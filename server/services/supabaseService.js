import { isSupabaseConfigured, supabase } from '../config/supabase.js';

/**
 * PatientCare Supabase Data Service
 * Provides complete bidirectional CRUD synchronization between the PMS server and Supabase PostgreSQL.
 * Strict compliance with /cso rules (confidential notes isolation, audit logs).
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolves a patient UUID whether the input is already a UUID or a phone/MRN identifier.
 */
export const resolvePatientId = async (idOrPhone) => {
  if (!isSupabaseConfigured || !supabase || !idOrPhone) return null;
  if (UUID_REGEX.test(idOrPhone)) return idOrPhone;

  // Check by phone / MRN
  const { data: byPhone } = await supabase
    .from('patients')
    .select('id')
    .eq('phone', String(idOrPhone).trim())
    .maybeSingle();

  if (byPhone) return byPhone.id;

  return null;
};

/**
 * Resolves a valid doctor UUID from Supabase.
 */
export const resolveDoctorId = async (docIdOrEmail) => {
  if (!isSupabaseConfigured || !supabase || !docIdOrEmail) return null;
  if (UUID_REGEX.test(docIdOrEmail)) return docIdOrEmail;

  const { data } = await supabase
    .from('doctors')
    .select('id')
    .limit(1)
    .maybeSingle();

  return data ? data.id : null;
};

/**
 * Fetches all patients and their clinical sub-records from Supabase.
 * Excludes personal_notes text to uphold /cso confidentiality; provides hasPersonalNotes boolean flag.
 */
export const fetchPatientsFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('patients')
    .select('*, clinical_notes(*), examinations(*), medications(*), lab_reports(*), impression_advice(*), personal_notes(patient_id)')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(row => ({
    id: row.id,
    name: row.name,
    ageSource: row.age_source || 'age_only',
    age: row.age,
    dob: row.dob || '',
    gender: row.gender,
    phone: row.phone,
    bloodGroup: row.blood_group,
    address: row.address,
    emergencyContact: row.emergency_contact || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: (row.clinical_notes || []).map(n => ({
      id: n.id,
      date: n.date,
      formattedDate: n.formatted_date,
      chiefComplaint: n.chief_complaint,
      presentIllness: n.present_illness,
      systemReviews: n.system_reviews,
      pastHistory: n.past_history,
      vaccineHistory: n.vaccine_history,
      familyHistory: n.family_history,
      socialHistory: n.social_history,
      presentMedication: n.present_medication,
      allergicHistory: n.allergic_history,
      birthHistory: n.birth_history
    })),
    examinations: (row.examinations || []).map(e => ({
      id: e.id,
      date: e.date,
      formattedDate: e.formatted_date,
      vitals: e.vitals || {},
      findings: e.findings || {}
    })),
    medications: (row.medications || []).map(m => ({
      id: m.id,
      date: m.date,
      name: m.name,
      form: m.form,
      dosage: m.dosage,
      frequency: m.frequency,
      duration: m.duration,
      timing: m.timing,
      instructions: m.instructions,
      urduInstructions: m.urdu_instructions,
      notes: m.notes,
      status: m.status
    })),
    labReports: (row.lab_reports || []).map(l => ({
      id: l.id,
      date: l.date,
      testName: l.test_name,
      category: l.category,
      findings: l.findings,
      attachments: l.attachments || [],
      status: l.status,
      notes: l.notes
    })),
    impressionAdvice: row.impression_advice ? {
      impression: row.impression_advice.impression || '',
      advice: row.impression_advice.advice || ''
    } : { impression: '', advice: '' },
    hasPersonalNotes: Boolean(row.personal_notes)
  }));
};

/**
 * Creates a new patient in Supabase.
 */
export const createPatientInSupabase = async (p) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const insertPayload = {
    name: p.name.trim(),
    age_source: p.ageSource || 'age_only',
    age: p.age ? Number(p.age) : 0,
    dob: p.dob ? p.dob : null,
    gender: p.gender || 'Male',
    phone: p.phone.trim(),
    blood_group: p.bloodGroup || '',
    address: p.address || '',
    emergency_contact: p.emergencyContact || {}
  };

  const { data, error } = await supabase
    .from('patients')
    .insert(insertPayload)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates an existing patient in Supabase.
 */
export const updatePatientInSupabase = async (idOrPhone, fields) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found in Supabase');

  const updatePayload = {
    updated_at: new Date().toISOString()
  };
  if (fields.name !== undefined) updatePayload.name = fields.name.trim();
  if (fields.ageSource !== undefined) updatePayload.age_source = fields.ageSource;
  if (fields.age !== undefined) updatePayload.age = Number(fields.age);
  if (fields.dob !== undefined) updatePayload.dob = fields.dob ? fields.dob : null;
  if (fields.gender !== undefined) updatePayload.gender = fields.gender;
  if (fields.phone !== undefined) updatePayload.phone = fields.phone.trim();
  if (fields.bloodGroup !== undefined) updatePayload.blood_group = fields.bloodGroup;
  if (fields.address !== undefined) updatePayload.address = fields.address;
  if (fields.emergencyContact !== undefined) updatePayload.emergency_contact = fields.emergencyContact;

  const { data, error } = await supabase
    .from('patients')
    .update(updatePayload)
    .eq('id', patientId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Deletes a patient from Supabase (cascades to all sub-records).
 */
export const deletePatientFromSupabase = async (idOrPhone) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) return false;

  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', patientId);

  if (error) throw error;
  return true;
};

/**
 * Inserts a clinical consultation note into Supabase.
 */
export const addClinicalNoteToSupabase = async (idOrPhone, note, doctorId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found');
  const validDocId = await resolveDoctorId(doctorId);

  const { data, error } = await supabase
    .from('clinical_notes')
    .insert({
      patient_id: patientId,
      doctor_id: validDocId,
      date: note.date || new Date().toISOString(),
      formatted_date: note.formattedDate || '',
      chief_complaint: note.chiefComplaint || 'Consultation Note',
      present_illness: note.presentIllness || '',
      system_reviews: note.systemReviews || '',
      past_history: note.pastHistory || '',
      vaccine_history: note.vaccineHistory || '',
      family_history: note.familyHistory || '',
      social_history: note.socialHistory || '',
      present_medication: note.presentMedication || '',
      allergic_history: note.allergicHistory || '',
      birth_history: note.birthHistory || ''
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Inserts vital signs and examination findings into Supabase.
 */
export const addVitalsToSupabase = async (idOrPhone, exam, doctorId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found');
  const validDocId = await resolveDoctorId(doctorId);

  const { data, error } = await supabase
    .from('examinations')
    .insert({
      patient_id: patientId,
      doctor_id: validDocId,
      date: exam.date || new Date().toISOString(),
      formatted_date: exam.formattedDate || '',
      vitals: exam.vitals || {},
      findings: exam.findings || {}
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Inserts medication prescriptions into Supabase.
 */
export const addMedicationsToSupabase = async (idOrPhone, medsArray, doctorId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found');
  const validDocId = await resolveDoctorId(doctorId);

  const rows = (Array.isArray(medsArray) ? medsArray : [medsArray]).map(m => ({
    patient_id: patientId,
    doctor_id: validDocId,
    date: m.date || new Date().toISOString(),
    name: m.name,
    form: m.form || 'Tab',
    dosage: m.dosage || '',
    frequency: m.frequency || '',
    duration: m.duration || '',
    timing: m.timing || '',
    instructions: m.instructions || '',
    urdu_instructions: m.urduInstructions || '',
    notes: m.notes || '',
    status: m.status || 'active'
  }));

  const { data, error } = await supabase
    .from('medications')
    .insert(rows)
    .select();

  if (error) throw error;
  return data;
};

/**
 * Deletes a medication prescription from Supabase.
 */
export const deleteMedicationFromSupabase = async (idOrPhone, medId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) return false;

  let query = supabase.from('medications').delete().eq('patient_id', patientId);
  if (UUID_REGEX.test(medId)) {
    query = query.eq('id', medId);
  }

  const { error } = await query;
  if (error) throw error;
  return true;
};

/**
 * Upserts impression & advice into Supabase.
 */
export const saveImpressionAdviceToSupabase = async (idOrPhone, ia, doctorId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found');
  const validDocId = await resolveDoctorId(doctorId);

  const { data, error } = await supabase
    .from('impression_advice')
    .upsert({
      patient_id: patientId,
      doctor_id: validDocId,
      impression: ia.impression || '',
      advice: ia.advice || '',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Retrieves confidential personal perception notes from Supabase.
 */
export const getPersonalNotesFromSupabase = async (idOrPhone) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) return '';

  const { data, error } = await supabase
    .from('personal_notes')
    .select('notes_text')
    .eq('patient_id', patientId)
    .maybeSingle();

  if (error) throw error;
  return data ? data.notes_text : '';
};

/**
 * Upserts confidential personal perception notes into Supabase private vault.
 */
export const savePersonalNotesToSupabase = async (idOrPhone, notesText, doctorId) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const patientId = await resolvePatientId(idOrPhone);
  if (!patientId) throw new Error('Patient not found');
  const validDocId = await resolveDoctorId(doctorId);

  const { data, error } = await supabase
    .from('personal_notes')
    .upsert({
      patient_id: patientId,
      doctor_id: validDocId,
      notes_text: notesText || '',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Inserts immutable audit log entry into Supabase.
 */
export const logAuditToSupabase = async (action, performedBy, details, category = 'clinical') => {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    await supabase.from('audit_logs').insert({
      action,
      performed_by: performedBy,
      details,
      category
    });
  } catch (err) {
    console.warn('Supabase audit log notice:', err.message);
  }
};

/**
 * ==============================================================================
 * ADMIN PORTAL SUPABASE INTEGRATIONS
 * ==============================================================================
 */

/**
 * Fetches all registered doctors from Supabase.
 */
export const fetchDoctorsFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('doctors')
    .select('id, name, email, username, qualifications, pmc_number, specialty, phone, status, created_at, last_login')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []).map(d => ({
    id: d.id,
    name: d.name,
    email: d.email,
    username: d.username,
    qualifications: d.qualifications,
    pmcNumber: d.pmc_number,
    specialty: d.specialty,
    phone: d.phone,
    status: d.status,
    createdAt: d.created_at,
    lastLogin: d.last_login
  }));
};

/**
 * Registers a new doctor into Supabase.
 */
export const createDoctorInSupabase = async (d, passwordHash) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('doctors')
    .insert({
      name: d.name.trim(),
      email: d.email.trim().toLowerCase(),
      username: d.username ? d.username.trim().toLowerCase() : d.email.split('@')[0],
      password_hash: passwordHash,
      qualifications: d.qualifications || 'MBBS',
      pmc_number: d.pmcNumber || 'PMC-PENDING',
      specialty: d.specialty || 'General Medicine',
      phone: d.phone || '',
      status: d.status || 'active'
    })
    .select('id, name, email, username, qualifications, pmc_number, specialty, phone, status, created_at, last_login')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    username: data.username,
    qualifications: data.qualifications,
    pmcNumber: data.pmc_number,
    specialty: data.specialty,
    phone: data.phone,
    status: data.status,
    createdAt: data.created_at,
    lastLogin: data.last_login
  };
};

/**
 * Updates doctor record in Supabase.
 */
export const updateDoctorInSupabase = async (id, fields) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const payload = {};
  if (fields.name !== undefined) payload.name = fields.name.trim();
  if (fields.email !== undefined) payload.email = fields.email.trim().toLowerCase();
  if (fields.username !== undefined) payload.username = fields.username.trim().toLowerCase();
  if (fields.qualifications !== undefined) payload.qualifications = fields.qualifications.trim();
  if (fields.pmcNumber !== undefined) payload.pmc_number = fields.pmcNumber.trim();
  if (fields.specialty !== undefined) payload.specialty = fields.specialty.trim();
  if (fields.phone !== undefined) payload.phone = fields.phone.trim();
  if (fields.status !== undefined) payload.status = fields.status;

  let query = supabase.from('doctors').update(payload);
  if (UUID_REGEX.test(id)) {
    query = query.eq('id', id);
  } else {
    query = query.eq('email', id);
  }

  const { data, error } = await query
    .select('id, name, email, username, qualifications, pmc_number, specialty, phone, status, created_at, last_login')
    .single();

  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    username: data.username,
    qualifications: data.qualifications,
    pmcNumber: data.pmc_number,
    specialty: data.specialty,
    phone: data.phone,
    status: data.status,
    createdAt: data.created_at,
    lastLogin: data.last_login
  };
};

/**
 * Resets doctor password in Supabase.
 */
export const resetDoctorPasswordInSupabase = async (id, newPasswordHash) => {
  if (!isSupabaseConfigured || !supabase) return null;

  let query = supabase.from('doctors').update({ password_hash: newPasswordHash });
  if (UUID_REGEX.test(id)) {
    query = query.eq('id', id);
  } else {
    query = query.eq('email', id);
  }

  const { error } = await query;
  if (error) throw error;
  return true;
};

/**
 * Deletes doctor record from Supabase.
 */
export const deleteDoctorFromSupabase = async (id) => {
  if (!isSupabaseConfigured || !supabase) return null;

  let query = supabase.from('doctors').delete();
  if (UUID_REGEX.test(id)) {
    query = query.eq('id', id);
  } else {
    query = query.eq('email', id);
  }

  const { error } = await query;
  if (error) throw error;
  return true;
};

/**
 * Fetches clinic master settings from Supabase.
 */
export const fetchClinicConfigFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('clinic_config')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    clinicName: data.clinic_name,
    doctorName: data.doctor_name,
    qualifications: data.qualifications,
    regNumber: data.reg_number,
    tagline: data.tagline,
    address: data.address,
    phone: data.phone,
    email: data.email
  };
};

/**
 * Saves clinic master settings in Supabase.
 */
export const saveClinicConfigToSupabase = async (c) => {
  if (!isSupabaseConfigured || !supabase) return null;

  const payload = {
    id: 1,
    clinic_name: c.clinicName || '',
    doctor_name: c.doctorName || '',
    qualifications: c.qualifications || '',
    reg_number: c.regNumber || '',
    tagline: c.tagline || '',
    address: c.address || '',
    phone: c.phone || '',
    email: c.email || '',
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('clinic_config')
    .upsert(payload)
    .select()
    .single();

  if (error) throw error;

  return {
    clinicName: data.clinic_name,
    doctorName: data.doctor_name,
    qualifications: data.qualifications,
    regNumber: data.reg_number,
    tagline: data.tagline,
    address: data.address,
    phone: data.phone,
    email: data.email
  };
};

/**
 * Fetches audit logs from Supabase.
 */
export const fetchAuditLogsFromSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(500);

  if (error) throw error;
  return (data || []).map(log => ({
    id: log.id,
    timestamp: log.timestamp,
    formattedDate: new Date(log.timestamp).toLocaleString('en-GB'),
    action: log.action,
    performedBy: log.performed_by,
    details: log.details,
    category: log.category
  }));
};

/**
 * Clears audit logs in Supabase.
 */
export const clearAuditLogsInSupabase = async () => {
  if (!isSupabaseConfigured || !supabase) return false;

  const { error } = await supabase
    .from('audit_logs')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) throw error;
  return true;
};
