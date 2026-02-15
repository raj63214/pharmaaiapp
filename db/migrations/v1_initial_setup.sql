
-- =========================================================
-- Migration Script v1
-- =========================================================

BEGIN;

-- Insert initial roles
INSERT INTO roles (name, description) VALUES 
('ADMIN', 'Full system access'),
('PHARMACIST', 'Inventory and Billing access'),
('CASHIER', 'Billing only access');

-- Insert initial permissions
INSERT INTO permissions (slug, description) VALUES
('sales.create', 'Create new sales bills'),
('inventory.manage', 'Manage stock and medicines'),
('reports.view', 'View compliance and financial reports');

-- Map default permissions (Example)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'ADMIN';

-- Mark migration as complete
INSERT INTO migration_versions (version, name) VALUES (1, 'Initial Database Setup');

COMMIT;
