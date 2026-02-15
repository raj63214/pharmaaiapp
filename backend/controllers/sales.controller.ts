
import { Request, Response } from 'express';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/auth.middleware';

export class SalesController {
    /**
     * Creates a new Sale record.
     * Note: Triggers in Phase 1 handle the stock subtraction and schedule drug logging automatically.
     */
    async createSale(req: AuthRequest, res: Response) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            // Fix: Destructuring from req.body which is now correctly recognized via the fixed AuthRequest intersection type
            const { customer_id, items, sale_type, payment_mode, doctor_name } = req.body;

            // 1. Calculate totals
            let taxableTotal = 0;
            let gstTotal = 0;
            
            // 2. Insert Header
            const headerQuery = `
                INSERT INTO sales_headers (id, customer_id, bill_number, sale_type, doctor_name, payment_mode, created_at)
                VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
                RETURNING id
            `;
            // Simplified bill numbering logic for Phase 2
            const billNo = 'BILL-' + Date.now();
            const headerResult = await client.query(headerQuery, [customer_id, billNo, sale_type, doctor_name, payment_mode]);
            const saleId = headerResult.rows[0].id;

            // 3. Insert Items and calculate amounts
            for (const item of items) {
                const itemTotal = item.quantity * item.sale_rate;
                const itemGst = (itemTotal * item.gst_rate) / 100;
                taxableTotal += itemTotal;
                gstTotal += itemGst;

                const itemQuery = `
                    INSERT INTO sales_items (id, sales_header_id, batch_id, quantity, sale_rate, gst_rate, net_amount, created_at)
                    VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
                `;
                await client.query(itemQuery, [saleId, item.batch_id, item.quantity, item.sale_rate, item.gst_rate, itemTotal + itemGst]);
            }

            // 4. Update Header with totals
            await client.query(
                `UPDATE sales_headers SET total_taxable_amount = $1, total_gst_amount = $2, net_amount = $3 WHERE id = $4`,
                [taxableTotal, gstTotal, taxableTotal + gstTotal, saleId]
            );

            await client.query('COMMIT');
            res.status(201).json({ success: true, saleId, billNo });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Sale Transaction Failed:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    }
}
