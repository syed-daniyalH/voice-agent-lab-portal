-- Voice Agent Portal - PostgreSQL Production Schema & Seed Data
-- Architecture: Voice AI -> n8n Orchestrator -> FastAPI -> PostgreSQL 16

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Manager',
    company VARCHAR(255) NOT NULL DEFAULT 'Keystone Trade Solutions',
    access_level VARCHAR(100) NOT NULL DEFAULT 'Full Access',
    cost_per_minute VARCHAR(50) NOT NULL DEFAULT '£0.18/min',
    joined_date VARCHAR(50) NOT NULL DEFAULT 'Oct 2024'
);

-- Table: invitations
CREATE TABLE IF NOT EXISTS invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    company VARCHAR(255) NOT NULL,
    sent_date VARCHAR(50) NOT NULL,
    expires_date VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending'
);

-- Table: contacts
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    postcode VARCHAR(20),
    address TEXT,
    total_calls INTEGER DEFAULT 1,
    last_call_date VARCHAR(50),
    notes TEXT,
    is_favourite BOOLEAN DEFAULT FALSE
);

-- Table: calls
CREATE TABLE IF NOT EXISTS calls (
    id VARCHAR(100) PRIMARY KEY,
    datetime_str VARCHAR(50) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    duration_str VARCHAR(50) NOT NULL,
    cost VARCHAR(50) NOT NULL,
    caller_phone VARCHAR(50) NOT NULL,
    destination_phone VARCHAR(50),
    contact_name VARCHAR(255) NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    direction VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    end_reason VARCHAR(100) NOT NULL,
    outcome VARCHAR(100) NOT NULL,
    is_favourite BOOLEAN DEFAULT FALSE,
    call_status VARCHAR(50),
    call_success VARCHAR(50),
    user_sentiment VARCHAR(50) DEFAULT 'Neutral',
    disconnection_reason VARCHAR(100),
    latency VARCHAR(50) DEFAULT '740ms',
    custom_analysis JSONB DEFAULT '{}'::jsonb,
    summary TEXT NOT NULL,
    transcript JSONB DEFAULT '[]'::jsonb,
    review_status VARCHAR(50) DEFAULT 'Pending',
    feedback_comment TEXT DEFAULT ''
);

-- Table: knowledge_bases
CREATE TABLE IF NOT EXISTS knowledge_bases (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    docs_count INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'Active',
    total_size VARCHAR(50) DEFAULT '1.2 MB',
    updated_date VARCHAR(50),
    files JSONB DEFAULT '[]'::jsonb
);

-- Table: invoices
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(100) PRIMARY KEY,
    date_str VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    amount VARCHAR(50) NOT NULL,
    tax VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Paid'
);

-- Table: billing_config
CREATE TABLE IF NOT EXISTS billing_config (
    id SERIAL PRIMARY KEY,
    balance NUMERIC(10, 2) DEFAULT 142.50,
    auto_refill_enabled BOOLEAN DEFAULT TRUE,
    refill_threshold NUMERIC(10, 2) DEFAULT 25.00,
    refill_amount NUMERIC(10, 2) DEFAULT 100.00,
    card_last4 VARCHAR(10) DEFAULT '4242',
    card_brand VARCHAR(50) DEFAULT 'Visa',
    card_expiry VARCHAR(20) DEFAULT '12/28',
    tax_rate NUMERIC(5, 2) DEFAULT 20.00
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    datetime_str VARCHAR(50) NOT NULL,
    "user" VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    details TEXT NOT NULL
);

-- SEED DATA INSERTIONS
INSERT INTO billing_config (balance, auto_refill_enabled, refill_threshold, refill_amount, card_last4, card_brand, card_expiry, tax_rate)
VALUES (142.50, TRUE, 25.00, 100.00, '4242', 'Visa', '12/28', 20.00)
ON CONFLICT DO NOTHING;

INSERT INTO users (name, email, agent_name, role, company, access_level, cost_per_minute, joined_date)
VALUES 
('John Davies', 'john@keystonetrade.co.uk', 'Essex Heating Inbound', 'Owner', 'Keystone Trade Solutions', 'Administrator (Full Access)', '£0.18/min', 'Oct 2024'),
('Sarah Jenkins', 'sarah.j@keystonetrade.co.uk', 'Essex Heating Inbound', 'Manager', 'Keystone Trade Solutions', 'Manager (Review & Contacts)', '£0.18/min', 'Nov 2024'),
('Dave Miller', 'dave.m@keystonetrade.co.uk', 'Out of Hours Emergency', 'Operator', 'Keystone Trade Solutions', 'Operator (View Only)', '£0.18/min', 'Dec 2024')
ON CONFLICT DO NOTHING;

INSERT INTO invitations (email, name, agent_name, role, company, sent_date, expires_date, status)
VALUES 
('rachel.a@keystonetrade.co.uk', 'Rachel Adams', 'Essex Heating Inbound', 'Manager', 'Keystone Trade Solutions', '18 Oct 2024', '25 Oct 2024', 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO contacts (id, name, phone, email, postcode, address, total_calls, last_call_date, notes, is_favourite)
VALUES 
('ct_001', 'James Wilson', '+44 7700 900123', 'j.wilson88@gmail.com', 'CM1 2AB', '14 Victoria Road, Chelmsford', 3, '18 Oct 2024, 09:14', 'Boiler making banging noises. Booked Worcester Bosch certified engineer for Oct 24th.', TRUE),
('ct_002', 'Emma Thompson', '+44 7700 900456', 'emma.t@outlook.com', 'CM2 7QJ', '32 Springfield Green, Chelmsford', 1, '18 Oct 2024, 10:22', 'Commercial landlord. Requested quotes for 4 HMO CP12 gas safety checks.', FALSE),
('ct_003', 'Robert Chen', '+44 7700 900789', 'rchen@chenholdings.co.uk', 'SS1 3XX', '88 High Street, Southend-on-Sea', 2, '18 Oct 2024, 11:45', 'Commercial HVAC quote request for warehouse unit. Sent spec sheet.', FALSE),
('ct_004', 'Margaret Davies', '+44 7700 900321', 'margaret.davies@btinternet.com', 'CM3 5KL', '7 Church Lane, Danbury', 4, '17 Oct 2024, 14:10', 'Elderly customer. Priority emergency response for cold radiators.', TRUE),
('ct_005', 'Liam O''Connor', '+44 7700 900654', 'liam.oc@hotmail.com', 'CM1 4UU', '51 Broomfield Road, Chelmsford', 1, '17 Oct 2024, 16:30', 'Radiator valve leaking slowly. Advised on emergency isolation valve.', FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO knowledge_bases (id, name, description, docs_count, status, total_size, updated_date, files)
VALUES 
('kb_001', 'Keystone Trade Pricing & Rates 2024', 'Comprehensive pricing for emergency diagnostics, boiler replacements, CP12 gas certificates, and VAT schedules.', 4, 'Active', '1.4 MB', '15 Oct 2024', '[{"name": "Keystone_Trade_Pricing_Guide_2024.pdf", "type": "PDF", "size": "450 KB", "uploaded": "15 Oct 2024", "category": "Pricing"}]'::jsonb),
('kb_002', 'Boiler Diagnostics & Fault Codes', 'Technical troubleshooting guides for Worcester Bosch, Vaillant, Baxi, and Ideal boilers with automated question flows.', 6, 'Active', '2.8 MB', '12 Oct 2024', '[{"name": "Worcester_Bosch_Fault_Diagnostic_Flow.pdf", "type": "PDF", "size": "820 KB", "uploaded": "12 Oct 2024", "category": "Technical"}]'::jsonb),
('kb_003', 'Essex Coverage Areas & Postcodes', 'Whitelist and travel surcharge matrix for CM1-CM9, SS0-SS17, and CO1-CO16 postal codes.', 2, 'Active', '680 KB', '08 Oct 2024', '[{"name": "Postcode_Coverage_Matrix_v3.pdf", "type": "PDF", "size": "340 KB", "uploaded": "08 Oct 2024", "category": "Logistics"}]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO invoices (id, date_str, description, amount, tax, status)
VALUES 
('INV-2024-001', '01 Oct 2024', 'Monthly Voice Inbound Minutes (1,240 mins)', '£223.20', '£44.64', 'Paid'),
('INV-2024-002', '01 Sep 2024', 'Monthly Voice Inbound Minutes (980 mins)', '£176.40', '£35.28', 'Paid'),
('INV-2024-003', '01 Aug 2024', 'Monthly Voice Inbound Minutes (1,150 mins)', '£207.00', '£41.40', 'Paid')
ON CONFLICT DO NOTHING;

INSERT INTO audit_logs (datetime_str, "user", action, entity, entity_name, details)
VALUES 
('18 Oct 2024, 14:15:32', 'Sarah Jenkins', 'Updated Review', 'Call Log', 'call_002', 'Marked call as Accurate. Confirmed quote details sent to dispatcher.'),
('18 Oct 2024, 11:30:10', 'System (Voice)', 'Sync Completed', 'Telephony DID', '+44 1245 982001', 'Automated healthcheck verified 100% trunk uptime with 24ms jitter.'),
('17 Oct 2024, 16:45:00', 'John Davies', 'KB Document Upload', 'Knowledge Base', 'kb_001', 'Uploaded updated Winter 2024 Emergency Diagnostic Pricing matrix.')
ON CONFLICT DO NOTHING;
