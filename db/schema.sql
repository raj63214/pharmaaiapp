
-- =========================================================
-- AstraPharmacy ERP - Phase 1: Database Core Schema
-- Target: PostgreSQL 16+
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 0. Pharmacy Profile (Multi-tenant/Branch Support)
CREATE TABLE pharmacies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    gstin VARCHAR(15),
    dl_number VARCHAR(100),
    fssai_number VARCHAR(100),
    address TEXT,
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    bank_details JSONB, -- {bank: "", account: "", ifsc: ""}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 1. Core Authentication & Authorization
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g. 'sales.create'
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role_id UUID REFERENCES roles(id),
    pharmacy_id UUID REFERENCES pharmacies(id), -- Default pharmacy
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GST and Tax Configuration
CREATE TABLE gst_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hsn_code VARCHAR(12) UNIQUE NOT NULL,
    description TEXT,
    cgst_rate DECIMAL(5,2) DEFAULT 0.0,
    sgst_rate DECIMAL(5,2) DEFAULT 0.0,
    igst_rate DECIMAL(5,2) DEFAULT 0.0,
    cess_rate DECIMAL(5,2) DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Master Data
CREATE TABLE manufacturers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    gst_number VARCHAR(15),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20)
);

CREATE TABLE salt_compositions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    manufacturer_id UUID REFERENCES manufacturers(id),
    hsn_code VARCHAR(12) REFERENCES gst_configurations(hsn_code),
    category VARCHAR(50), -- Tab, Syr, Inj, etc.
    uom VARCHAR(20) DEFAULT 'STRIP', -- Unit of measurement
    pack_size VARCHAR(50), -- e.g. 10s, 100ml
    is_schedule_h BOOLEAN DEFAULT FALSE,
    is_schedule_h1 BOOLEAN DEFAULT FALSE,
    is_schedule_x BOOLEAN DEFAULT FALSE,
    min_stock_level INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicine_salts (
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    salt_id UUID REFERENCES salt_compositions(id) ON DELETE CASCADE,
    strength VARCHAR(50), -- e.g. 500mg
    PRIMARY KEY (medicine_id, salt_id)
);

-- 4. Batch and Inventory (Stock Ledger)
CREATE TABLE medicine_batch_master (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id), -- Stock is specific to a pharmacy
    medicine_id UUID REFERENCES medicines(id),
    batch_number VARCHAR(100) NOT NULL,
    mfg_date DATE,
    expiry_date DATE NOT NULL,
    purchase_rate DECIMAL(15,2) NOT NULL,
    mrp DECIMAL(15,2) NOT NULL,
    sale_rate DECIMAL(15,2) NOT NULL,
    wholesale_rate DECIMAL(15,2),
    current_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pharmacy_id, medicine_id, batch_number)
);

-- PARTITIONED TABLE: Stock Ledger
CREATE TABLE stock_ledger (
    id UUID NOT NULL,
    pharmacy_id UUID NOT NULL REFERENCES pharmacies(id),
    batch_id UUID REFERENCES medicine_batch_master(id),
    transaction_type VARCHAR(20) NOT NULL, -- PURCHASE, SALE, RETURN, ADJUSTMENT
    quantity INTEGER NOT NULL,
    reference_id UUID, -- Link to sales_header or purchase_header
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 5. Purchase and Sales (Partioning on Sales)
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    gst_number VARCHAR(15) UNIQUE,
    dl_number VARCHAR(50), -- Drug License
    address TEXT,
    contact_person VARCHAR(100),
    mobile VARCHAR(20)
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) UNIQUE,
    address TEXT,
    gst_number VARCHAR(15), -- For B2B/Wholesale
    credit_limit DECIMAL(15,2) DEFAULT 0.0
);

CREATE TABLE purchase_headers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id), -- Linked to specific pharmacy profile
    vendor_id UUID REFERENCES vendors(id),
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    total_taxable_amount DECIMAL(15,2),
    total_gst_amount DECIMAL(15,2),
    net_amount DECIMAL(15,2),
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_header_id UUID REFERENCES purchase_headers(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id),
    batch_number VARCHAR(100),
    quantity INTEGER,
    free_quantity INTEGER DEFAULT 0,
    purchase_rate DECIMAL(15,2),
    gst_rate DECIMAL(5,2),
    mrp DECIMAL(15,2),
    expiry_date DATE
);

-- PARTITIONED TABLE: Sales
CREATE TABLE sales_headers (
    id UUID NOT NULL,
    pharmacy_id UUID REFERENCES pharmacies(id), -- Linked to specific pharmacy profile
    customer_id UUID REFERENCES customers(id),
    bill_number VARCHAR(100) NOT NULL,
    sale_type VARCHAR(10) DEFAULT 'RETAIL', -- RETAIL, WHOLESALE
    doctor_name VARCHAR(255),
    total_taxable_amount DECIMAL(15,2),
    total_gst_amount DECIMAL(15,2),
    round_off DECIMAL(5,2),
    net_amount DECIMAL(15,2),
    payment_mode VARCHAR(20), -- CASH, CARD, UPI, CREDIT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

CREATE TABLE sales_items (
    id UUID NOT NULL,
    sales_header_id UUID NOT NULL,
    batch_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    sale_rate DECIMAL(15,2) NOT NULL,
    gst_rate DECIMAL(5,2) NOT NULL,
    cgst_amount DECIMAL(15,2),
    sgst_amount DECIMAL(15,2),
    igst_amount DECIMAL(15,2),
    discount_percent DECIMAL(5,2) DEFAULT 0.0,
    net_amount DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 6. Specialized Registers
CREATE TABLE schedule_drug_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    sales_header_id UUID, -- Link to sales
    medicine_id UUID REFERENCES medicines(id),
    batch_number VARCHAR(100),
    customer_name VARCHAR(255),
    doctor_name VARCHAR(255),
    doctor_reg_number VARCHAR(100),
    quantity_sold INTEGER,
    sale_date DATE DEFAULT CURRENT_DATE,
    remarks TEXT
);

-- 7. Security and Audit
CREATE TABLE audit_logs (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    pharmacy_id UUID REFERENCES pharmacies(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 8. Wholesale Pricing
CREATE TABLE wholesale_pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    medicine_id UUID REFERENCES medicines(id),
    min_quantity INTEGER NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 9. Migration Versioning
CREATE TABLE migration_versions (
    version INTEGER PRIMARY KEY,
    name VARCHAR(255),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
