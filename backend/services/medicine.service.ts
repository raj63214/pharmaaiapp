
import { pool } from '../config/db';

export class MedicineService {
    async getAllMedicines(search?: string) {
        const query = search 
            ? `SELECT * FROM medicines WHERE name ILIKE $1 OR hsn_code ILIKE $1 LIMIT 50`
            : `SELECT * FROM medicines LIMIT 50`;
        const values = search ? [`%${search}%`] : [];
        const result = await pool.query(query, values);
        return result.rows;
    }

    async getInventoryByBatch(medicineId: string) {
        const query = `
            SELECT * FROM medicine_batch_master 
            WHERE medicine_id = $1 AND current_stock > 0 
            ORDER BY expiry_date ASC
        `;
        const result = await pool.query(query, [medicineId]);
        return result.rows;
    }

    async createMedicine(data: any) {
        const { name, manufacturer_id, hsn_code, category, uom, is_schedule_h } = data;
        const query = `
            INSERT INTO medicines (name, manufacturer_id, hsn_code, category, uom, is_schedule_h)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const result = await pool.query(query, [name, manufacturer_id, hsn_code, category, uom, is_schedule_h]);
        return result.rows[0];
    }
}
