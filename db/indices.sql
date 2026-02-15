
-- =========================================================
-- Index Strategy for High Performance
-- =========================================================

-- Medicines & Batches
CREATE INDEX idx_medicines_name ON medicines (name);
CREATE INDEX idx_medicines_hsn ON medicines (hsn_code);
CREATE INDEX idx_batches_expiry ON medicine_batch_master (expiry_date);
CREATE INDEX idx_batches_medicine_id ON medicine_batch_master (medicine_id);

-- Sales & Purchase (Search by number and customer)
CREATE INDEX idx_sales_bill_number ON sales_headers (bill_number);
CREATE INDEX idx_sales_customer ON sales_headers (customer_id);
CREATE INDEX idx_purchase_invoice ON purchase_headers (invoice_number);

-- Full Text Search for Salts (GIN Index)
CREATE INDEX idx_salts_name_gin ON salt_compositions USING GIN (to_tsvector('english', name));

-- Stock Ledger Analysis
CREATE INDEX idx_stock_ledger_batch ON stock_ledger (batch_id);
CREATE INDEX idx_stock_ledger_created ON stock_ledger (created_at);

-- Audit Tracking
CREATE INDEX idx_audit_record ON audit_logs (table_name, record_id);

-- =========================================================
-- Initial Partitions (Example: 2025 Start)
-- =========================================================

-- Sales Headers Partitions
CREATE TABLE sales_headers_2025_q1 PARTITION OF sales_headers
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

CREATE TABLE sales_headers_2025_q2 PARTITION OF sales_headers
    FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');

-- Sales Items Partitions
CREATE TABLE sales_items_2025_q1 PARTITION OF sales_items
    FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');

-- Audit Logs Partitions
CREATE TABLE audit_logs_2025_m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
