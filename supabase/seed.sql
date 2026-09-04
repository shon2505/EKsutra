-- EKsutra — Seed Data for Supabase
-- Run after schema.sql to populate demo data.

-- Departments
INSERT INTO departments (id, name, short_name, service, route, api_status, color) VALUES
  ('DEPT-AGR', 'Agriculture Department', 'Agriculture', 'Farmer Registration', '/department/agriculture', 'HEALTHY', '#15803d'),
  ('DEPT-EDU', 'Education & Welfare Department', 'Education', 'Scholarship Application', '/department/scholarship', 'HEALTHY', '#1d4ed8'),
  ('DEPT-REV', 'Revenue Department', 'Revenue', 'Land / Income Verification', '/department/revenue', 'HEALTHY', '#7c3aed')
ON CONFLICT (id) DO NOTHING;

-- Demo User
INSERT INTO users (id, name, synthetic_id, email) VALUES
  ('USER-1001', 'Rahul Sharma', 'USER-1001', 'rahul.sharma@demo.eksutra.in')
ON CONFLICT (id) DO NOTHING;

-- Consent
INSERT INTO consent_records (id, subject_id, subject_name, granted_at, issuing_dept_id, issuing_dept_name, is_active) VALUES
  ('CONSENT-001', 'USER-1001', 'Rahul Sharma', '2026-09-04T10:30:00Z', 'DEPT-AGR', 'Agriculture Department', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Note: Verification assertions include HMAC signatures.
-- Run the app once with in-memory mode to see the signatures, then insert them here.
-- OR let the app generate them dynamically via /api/verification/create.
