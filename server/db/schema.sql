-- ==============================================================================
-- PatientCare PMS - PostgreSQL / Supabase Complete Relational Schema
-- Incorporates /cso (Chief Security Officer) Row-Level Security (RLS) & Standards
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. DOCTORS & CLINICAL USERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  qualifications TEXT NOT NULL,
  pmc_number TEXT NOT NULL,
  specialty TEXT DEFAULT 'General Medicine',
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 2. PATIENTS DIRECTORY (MRN = Phone)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age_source TEXT DEFAULT 'age_only' CHECK (age_source IN ('age_only', 'dob')),
  age INT,
  dob DATE,
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  phone TEXT UNIQUE NOT NULL, -- Serves as unique MRN identifier
  blood_group TEXT,
  address TEXT,
  emergency_contact JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CLINICAL NOTES (Encounters & History)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  formatted_date TEXT,
  chief_complaint TEXT NOT NULL,
  present_illness TEXT,
  system_reviews TEXT,
  past_history TEXT,
  vaccine_history TEXT,
  family_history TEXT,
  social_history TEXT,
  present_medication TEXT,
  allergic_history TEXT,
  birth_history TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. PHYSICAL EXAMINATIONS & VITALS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS examinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  formatted_date TEXT,
  vitals JSONB NOT NULL DEFAULT '{}'::JSONB,
  findings JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. PRESCRIPTIONS (Rx Medications with Urdu Instructions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  form TEXT DEFAULT 'Tab',
  dosage TEXT,
  frequency TEXT,
  duration TEXT,
  timing TEXT,
  instructions TEXT,
  urdu_instructions TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. LAB REPORTS & ATTACHMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lab_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  date TIMESTAMPTZ DEFAULT NOW(),
  test_name TEXT NOT NULL,
  category TEXT DEFAULT 'Routine',
  findings JSONB DEFAULT '[]'::JSONB,
  attachments JSONB DEFAULT '[]'::JSONB,
  status TEXT DEFAULT 'Completed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. IMPRESSION & ADVICE (Patient-Facing Discharge & Followup)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS impression_advice (
  patient_id UUID PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  impression TEXT,
  advice TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. DOCTOR'S PERSONAL PERCEPTION NOTES (/cso CONFIDENTIAL VAULT)
-- Strictly separated; NEVER included in patient prints or admin views
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS personal_notes (
  patient_id UUID PRIMARY KEY REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id),
  notes_text TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. CLINIC MASTER SETTINGS & LETTERHEAD
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clinic_config (
  id INT PRIMARY KEY DEFAULT 1,
  clinic_name TEXT NOT NULL DEFAULT 'PatientCare Medical Center',
  doctor_name TEXT NOT NULL DEFAULT 'Consultant Physician',
  qualifications TEXT NOT NULL DEFAULT 'MBBS, FCPS',
  reg_number TEXT NOT NULL DEFAULT 'PMC-00000-P',
  tagline TEXT DEFAULT 'Quality Outpatient Care & Diagnostic Center',
  address TEXT DEFAULT '123 Medical Boulevard',
  phone TEXT DEFAULT '+92 300 0000000',
  email TEXT DEFAULT 'contact@clinic.example.com',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. IMMUTABLE AUDIT TRAIL (/cso Compliance)
-- Append-only; No updates or deletes permitted
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  details TEXT,
  category TEXT DEFAULT 'auth' CHECK (category IN ('auth', 'admin', 'clinical', 'system'))
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES (/cso Defense-in-Depth)
-- ------------------------------------------------------------------------------
ALTER TABLE personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated doctors to select or write personal notes
CREATE POLICY personal_notes_doctor_only ON personal_notes
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'doctor');

-- Prevent updates or deletions on audit_logs (Append-only)
CREATE POLICY audit_logs_insert_only ON audit_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY audit_logs_read ON audit_logs
  FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
