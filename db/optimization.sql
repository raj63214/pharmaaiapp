
-- =========================================================
-- AstraPharmacy ERP - Phase 10: Performance Optimization
-- Target: PostgreSQL High Performance Tuning & Server Config
-- =========================================================

-- 1. Partial Index for Active Inventory
CREATE INDEX idx_active_batches_mrp 
ON medicine_batch_master (medicine_id, mrp) 
WHERE current_stock > 0 AND expiry_date > CURRENT_DATE;

-- 2. Covering Index for Sales Headers
CREATE INDEX idx_sales_daily_summary 
ON sales_headers (created_at) 
INCLUDE (net_amount, total_taxable_amount, total_gst_amount);

-- 3. GIN Index for Advanced Search
CREATE INDEX IF NOT EXISTS idx_medicines_salt_trgm 
ON salt_compositions USING gin (name gin_trgm_ops);

-- 4. Bloom Filters for Audit Logs
CREATE EXTENSION IF NOT EXISTS bloom;
CREATE INDEX idx_audit_bloom ON audit_logs 
USING bloom (table_name, action, user_id) 
WITH (length=80, col1=2, col2=2, col3=4);

-- 5. Recommended Server-Level Configuration (Apply in postgresql.conf)
-- ---------------------------------------------------------
-- shared_buffers = 1GB             # 25% of RAM for a 4GB system
-- work_mem = 64MB                  # Buffer for complex sorts
-- maintenance_work_mem = 256MB     # Speed up index creation
-- effective_cache_size = 3GB       # 75% of RAM
-- synchronous_commit = off         # Performance trade-off (Loss risk: 1-2 transactions)
-- ---------------------------------------------------------

-- 6. Materialized View for Compliance
CREATE MATERIALIZED VIEW mv_gst_monthly_summary AS
SELECT 
    date_trunc('month', created_at) as month,
    gst_rate,
    SUM(total_taxable_amount) as total_taxable,
    SUM(total_gst_amount) as total_gst
FROM sales_items
GROUP BY 1, 2;

CREATE UNIQUE INDEX idx_mv_gst_month ON mv_gst_monthly_summary (month, gst_rate);

-- 7. Automated Maintenance Function
CREATE OR REPLACE FUNCTION refresh_compliance_mv()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_gst_monthly_summary;
END;
$$ LANGUAGE plpgsql;
