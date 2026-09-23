import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';

dotenv.config();

let db = {
  doctors: [],
  admin: null,
  patients: [],
  clinicConfig: null,
  auditLogs: []
};

// Initialize in-memory cache dynamically from Supabase and environment variables
export const initStore = async () => {
  const saltRounds = 10;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminUsername && adminPass) {
    const adminHash = await bcrypt.hash(adminPass, saltRounds);
    db.admin = {
      id: 'admin-master',
      name: 'System Administrator',
      email: adminEmail,
      username: adminUsername,
      passwordHash: adminHash,
      role: 'admin',
      title: 'Chief System Administrator'
    };
  }

  // All doctors, patients, clinical encounters, and clinic settings are loaded directly from Supabase PostgreSQL
  db.doctors = [];
  db.patients = [];
  db.auditLogs = [];
  db.doctorLetterheads = {};

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: config } = await supabase
        .from('clinic_config')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (config) {
        db.clinicConfig = {
          clinicName: config.clinic_name,
          doctorName: config.doctor_name,
          qualifications: config.qualifications,
          regNumber: config.reg_number,
          tagline: config.tagline,
          address: config.address,
          phone: config.phone,
          email: config.email
        };
      }
    } catch (err) {
      console.warn('Notice loading clinic config from Supabase:', err.message);
    }
  }
};

export const saveStore = () => {
  // In-memory only; all permanent records persist directly into Supabase PostgreSQL
};

// Database Accessors
export const getDoctors = () => db.doctors || [];
export const getAdmin = () => db.admin;
export const getPatients = () => db.patients || [];
export const getClinicConfig = () => db.clinicConfig || {};
export const getDoctorLetterheads = () => db.doctorLetterheads || {};
export const getAuditLogs = () => db.auditLogs || [];

export const recordAuditLog = (action, details, category = 'auth', performedBy = 'System') => {
  const newLog = {
    id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    action,
    details,
    category,
    performedBy
  };
  db.auditLogs = [newLog, ...(db.auditLogs || []).slice(0, 499)];
  saveStore();
  return newLog;
};

export const findDoctorByIdentifier = (identifier) => {
  const clean = (identifier || '').trim().toLowerCase();
  return getDoctors().find(
    d => d.email.toLowerCase() === clean || d.username?.toLowerCase() === clean
  );
};

export const addDoctorRecord = async (docData) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(docData.password || 'doc12345', salt);

  const newDoctor = {
    id: 'doc-' + Date.now(),
    name: docData.name?.trim(),
    email: docData.email?.trim().toLowerCase(),
    username: docData.username?.trim().toLowerCase() || docData.email?.split('@')[0],
    passwordHash,
    qualifications: docData.qualifications?.trim() || 'MBBS',
    pmcNumber: docData.pmcNumber?.trim() || 'PMC-PENDING',
    specialty: docData.specialty?.trim() || 'General Medicine',
    phone: docData.phone?.trim() || '',
    status: docData.status || 'active',
    createdAt: new Date().toISOString(),
    lastLogin: null
  };

  db.doctors.push(newDoctor);
  saveStore();
  return newDoctor;
};

export const updateDoctorRecord = (doctorId, updatedFields) => {
  const index = db.doctors.findIndex(d => d.id === doctorId);
  if (index !== -1) {
    db.doctors[index] = { ...db.doctors[index], ...updatedFields };
    saveStore();
    return db.doctors[index];
  }
  return null;
};

export const resetDoctorPasswordRecord = async (doctorId, newPassword) => {
  const index = db.doctors.findIndex(d => d.id === doctorId);
  if (index !== -1) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    db.doctors[index].passwordHash = passwordHash;
    saveStore();
    return true;
  }
  return false;
};

export const deleteDoctorRecord = (doctorId) => {
  db.doctors = db.doctors.filter(d => d.id !== doctorId);
  saveStore();
};

export const updateClinicConfigRecord = (newConfig) => {
  db.clinicConfig = { ...db.clinicConfig, ...newConfig };
  saveStore();
  return db.clinicConfig;
};

export const updateDoctorLetterheadRecord = (doctorId, letterheadData) => {
  if (!db.doctorLetterheads) db.doctorLetterheads = {};
  db.doctorLetterheads[doctorId] = {
    ...(db.doctorLetterheads[doctorId] || {}),
    ...letterheadData,
    updatedAt: new Date().toISOString()
  };
  saveStore();
  return db.doctorLetterheads[doctorId];
};

export const clearAuditLogsRecord = () => {
  db.auditLogs = [];
  saveStore();
};

export const updatePatientsCollection = (newPatients) => {
  db.patients = newPatients;
  saveStore();
};
