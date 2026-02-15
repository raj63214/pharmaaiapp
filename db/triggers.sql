
-- =========================================================
-- Business Logic Triggers
-- =========================================================

-- 1. Immutable Audit Logs (Reject UPDATE/DELETE)
CREATE OR REPLACE FUNCTION fn_prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be modified or deleted for compliance reasons.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_immutability
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION fn_prevent_audit_tampering();

-- 2. Automatic Stock Update on Sales (Pseudo-code logic)
CREATE OR REPLACE FUNCTION fn_update_stock_on_sale()
RETURNS TRIGGER AS $$
BEGIN
    -- Subtract stock from batch master
    UPDATE medicine_batch_master
    SET current_stock = current_stock - NEW.quantity
    WHERE id = NEW.batch_id;

    -- Add entry to ledger
    INSERT INTO stock_ledger (id, batch_id, transaction_type, quantity, reference_id, created_at)
    VALUES (uuid_generate_v4(), NEW.batch_id, 'SALE', -NEW.quantity, NEW.sales_header_id, NEW.created_at);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_sale_item_insert
AFTER INSERT ON sales_items
FOR EACH ROW EXECUTE FUNCTION fn_update_stock_on_sale();

-- 3. Automatic Schedule Register Logging
CREATE OR REPLACE FUNCTION fn_log_schedule_drug()
RETURNS TRIGGER AS $$
DECLARE
    is_sched BOOLEAN;
    med_id UUID;
    h_id UUID;
BEGIN
    -- Check if medicine is schedule drug
    SELECT m.id, (m.is_schedule_h OR m.is_schedule_h1 OR m.is_schedule_x)
    INTO med_id, is_sched
    FROM medicines m
    JOIN medicine_batch_master b ON b.medicine_id = m.id
    WHERE b.id = NEW.batch_id;

    IF is_sched THEN
        INSERT INTO schedule_drug_register (
            sales_header_id, medicine_id, batch_number, quantity_sold, sale_date
        )
        VALUES (
            NEW.sales_header_id, med_id, (SELECT batch_number FROM medicine_batch_master WHERE id = NEW.batch_id),
            NEW.quantity, CURRENT_DATE
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_schedule_drug_detect
AFTER INSERT ON sales_items
FOR EACH ROW EXECUTE FUNCTION fn_log_schedule_drug();
