-- EKsutra — PostgreSQL Schema (Supabase)
-- Run this in the Supabase SQL editor to create all required tables.
-- The app works without this (uses in-memory store), but this enables persistence.

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  synthetic_id TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Departments ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  service TEXT NOT NULL,
  route TEXT NOT NULL,
  api_status TEXT DEFAULT 'HEALTHY' CHECK (api_status IN ('HEALTHY', 'DEGRADED', 'DOWN')),
  color TEXT DEFAULT '#1a56db',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Verification Assertions ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS verification_assertions (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_ref TEXT NOT NULL,         -- Synthetic reference only, never real doc
  status TEXT NOT NULL DEFAULT 'VERIFIED',
  verified_by TEXT NOT NULL,
  verifier_dept_id TEXT NOT NULL,
  verified_at DATE NOT NULL,
  valid_until DATE NOT NULL,
  purpose TEXT NOT NULL,
  consent_id TEXT NOT NULL,
  signature TEXT NOT NULL,            -- HMAC-SHA256 hex
  signature_status TEXT DEFAULT 'VALID',
  is_tampered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (verifier_dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assertions_subject ON verification_assertions(subject_id);
CREATE INDEX IF NOT EXISTS idx_assertions_doctype ON verification_assertions(document_type);

-- ─── Consent Records ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_records (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  issuing_dept_id TEXT NOT NULL,
  issuing_dept_name TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['STORE_VERIFICATION_STATUS', 'ALLOW_AUTHORIZED_REUSE'],
  is_active BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (issuing_dept_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_consent_subject ON consent_records(subject_id);

-- ─── Applications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  application_ref TEXT UNIQUE NOT NULL,
  subject_id TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  documents_required TEXT[] NOT NULL,
  documents_verified TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'IN_PROGRESS'
    CHECK (status IN ('IN_PROGRESS', 'READY_FOR_REVIEW', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Audit Log ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_type TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id TEXT,
  department_id TEXT,
  assertion_id TEXT,
  application_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_subject ON audit_log(subject_id);
