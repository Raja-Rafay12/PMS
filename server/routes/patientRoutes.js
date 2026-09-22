import express from 'express';
import {
  getPatients,
  updatePatientsCollection,
  recordAuditLog
} from '../data/store.js';
import { requireDoctor, requireConfidentialNoteAccess } from '../middleware/auth.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import {
  fetchPatientsFromSupabase,
  createPatientInSupabase,
  updatePatientInSupabase,
  deletePatientFromSupabase,
  addClinicalNoteToSupabase,
  addVitalsToSupabase,
  addMedicationsToSupabase,
  deleteMedicationFromSupabase,
  saveImpressionAdviceToSupabase,
  getPersonalNotesFromSupabase,
  savePersonalNotesToSupabase,
  logAuditToSupabase
} from '../services/supabaseService.js';

const router = express.Router();

// Apply requireDoctor to all clinical patient routes (/cso Mandate)
router.use(requireDoctor);

/**
 * GET /api/patients
 * List all registered patients.
 * (/cso rule: Doctor personal notes are excluded from general index)
 */
router.get('/', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const supabasePatients = await fetchPatientsFromSupabase();
        if (supabasePatients && supabasePatients.length > 0) {
          updatePatientsCollection(supabasePatients);
          return res.json({ success: true, patients: supabasePatients });
        }
      } catch (sbErr) {
        console.warn('Supabase fetchPatients notice (falling back to cache):', sbErr.message);
      }
    }

    const patients = getPatients();
    const sanitizedPatients = patients.map(p => {
      const { personalNotes, ...safeData } = p;
      return {
        ...safeData,
        hasPersonalNotes: Boolean(personalNotes && personalNotes.trim())
      };
    });
    return res.json({ success: true, patients: sanitizedPatients });
  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve patients.' });
  }
});

/**
 * POST /api/patients
 * Register a new patient in Supabase and local cache
 */
router.post('/', async (req, res) => {
  try {
    const { name, phone, age, ageSource, dob, gender, bloodGroup, address, emergencyContact } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Patient name and phone number (MRN) are required.'
      });
    }

    const patients = getPatients();
    const cleanPhone = String(phone).trim();
    const existing = patients.find(p => p.phone === cleanPhone);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `A patient with phone/MRN "${cleanPhone}" is already registered (${existing.name}).`
      });
    }

    let createdId = 'pat-' + Date.now();

    // 1. Persist directly to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const sbResult = await createPatientInSupabase({
          name,
          phone: cleanPhone,
          age,
          ageSource,
          dob,
          gender,
          bloodGroup,
          address,
          emergencyContact
        });
        if (sbResult && sbResult.id) {
          createdId = sbResult.id;
        }
      } catch (sbErr) {
        console.warn('Supabase createPatient notice:', sbErr.message);
      }
    }

    const newPatient = {
      id: createdId,
      name: name.trim(),
      phone: cleanPhone,
      age: age ? Number(age) : 0,
      ageSource: ageSource || 'age_only',
      dob: dob || '',
      gender: gender || 'Male',
      bloodGroup: bloodGroup || '',
      address: address || '',
      emergencyContact: emergencyContact || { name: '', phone: '', relation: '' },
      notes: [],
      examinations: [],
      medications: [],
      labReports: [],
      impressionAdvice: { impression: '', advice: '' },
      personalNotes: '',
      createdAt: new Date().toISOString()
    };

    const updated = [newPatient, ...patients];
    updatePatientsCollection(updated);

    recordAuditLog(
      'Patient Created',
      `Registered patient "${newPatient.name}" (MRN: ${newPatient.phone})`,
      'clinical',
      req.user.name
    );
    logAuditToSupabase(
      'Patient Created',
      req.user.name,
      `Registered patient "${newPatient.name}" (MRN: ${newPatient.phone})`,
      'clinical'
    );

    return res.status(201).json({ success: true, patient: newPatient });
  } catch (err) {
    console.error('Error creating patient:', err);
    return res.status(500).json({ success: false, error: 'Failed to create patient.' });
  }
});

/**
 * GET /api/patients/:id
 * Fetch complete clinical record for a patient
 */
router.get('/:id', (req, res) => {
  const patients = getPatients();
  const patient = patients.find(p => p.id === req.params.id || p.phone === req.params.id);

  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient not found.' });
  }

  return res.json({ success: true, patient });
});

/**
 * PUT /api/patients/:id
 * Update patient demographics in Supabase and local cache
 */
router.put('/:id', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // 1. Update Supabase
    if (isSupabaseConfigured) {
      try {
        await updatePatientInSupabase(req.params.id, req.body);
      } catch (sbErr) {
        console.warn('Supabase updatePatient notice:', sbErr.message);
      }
    }

    const updatedPatient = {
      ...patients[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    patients[index] = updatedPatient;
    updatePatientsCollection(patients);

    recordAuditLog(
      'Patient Updated',
      `Updated demographics for "${updatedPatient.name}"`,
      'clinical',
      req.user.name
    );
    logAuditToSupabase(
      'Patient Updated',
      req.user.name,
      `Updated demographics for "${updatedPatient.name}"`,
      'clinical'
    );

    return res.json({ success: true, patient: updatedPatient });
  } catch (err) {
    console.error('Error updating patient:', err);
    return res.status(500).json({ success: false, error: 'Failed to update patient.' });
  }
});

/**
 * DELETE /api/patients/:id
 * Delete a patient and all clinical data from Supabase and local cache
 */
router.delete('/:id', async (req, res) => {
  try {
    const patients = getPatients();
    const target = patients.find(p => p.id === req.params.id || p.phone === req.params.id);

    if (!target) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // 1. Delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deletePatientFromSupabase(req.params.id);
      } catch (sbErr) {
        console.warn('Supabase deletePatient notice:', sbErr.message);
      }
    }

    const filtered = patients.filter(p => p.id !== req.params.id && p.phone !== req.params.id);
    updatePatientsCollection(filtered);

    recordAuditLog(
      'Patient Deleted',
      `Deleted patient record "${target.name}" (MRN: ${target.phone})`,
      'clinical',
      req.user.name
    );
    logAuditToSupabase(
      'Patient Deleted',
      req.user.name,
      `Deleted patient record "${target.name}" (MRN: ${target.phone})`,
      'clinical'
    );

    return res.json({ success: true, message: 'Patient removed successfully.' });
  } catch (err) {
    console.error('Error deleting patient:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete patient.' });
  }
});

/**
 * POST /api/patients/:id/notes
 * Add a clinical consultation note to Supabase and cache
 */
router.post('/:id/notes', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    let noteId = 'note-' + Date.now();

    // 1. Save to Supabase
    if (isSupabaseConfigured) {
      try {
        const sbNote = await addClinicalNoteToSupabase(
          req.params.id,
          { ...req.body, date: now.toISOString(), formattedDate },
          req.user.id
        );
        if (sbNote && sbNote.id) {
          noteId = sbNote.id;
        }
      } catch (sbErr) {
        console.warn('Supabase addClinicalNote notice:', sbErr.message);
      }
    }

    const newNote = {
      id: noteId,
      date: now.toISOString(),
      formattedDate,
      doctorId: req.user.id,
      doctorName: req.user.name,
      ...req.body
    };

    patients[index].notes = [newNote, ...(patients[index].notes || [])];
    updatePatientsCollection(patients);

    recordAuditLog(
      'Clinical Note Added',
      `Added consultation note for patient "${patients[index].name}"`,
      'clinical',
      req.user.name
    );
    logAuditToSupabase(
      'Clinical Note Added',
      req.user.name,
      `Added consultation note for patient "${patients[index].name}"`,
      'clinical'
    );

    return res.status(201).json({ success: true, note: newNote });
  } catch (err) {
    console.error('Error adding clinical note:', err);
    return res.status(500).json({ success: false, error: 'Failed to add clinical note.' });
  }
});

/**
 * POST /api/patients/:id/vitals
 * Add physical examination and vitals to Supabase and cache
 */
router.post('/:id/vitals', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) +
      ', ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    let examId = 'exam-' + Date.now();

    // 1. Save to Supabase
    if (isSupabaseConfigured) {
      try {
        const sbExam = await addVitalsToSupabase(
          req.params.id,
          { ...req.body, date: now.toISOString(), formattedDate },
          req.user.id
        );
        if (sbExam && sbExam.id) {
          examId = sbExam.id;
        }
      } catch (sbErr) {
        console.warn('Supabase addVitals notice:', sbErr.message);
      }
    }

    const newExam = {
      id: examId,
      date: now.toISOString(),
      formattedDate,
      doctorId: req.user.id,
      doctorName: req.user.name,
      ...req.body
    };

    patients[index].examinations = [newExam, ...(patients[index].examinations || [])];
    updatePatientsCollection(patients);

    recordAuditLog(
      'Vitals Recorded',
      `Recorded vitals for patient "${patients[index].name}"`,
      'clinical',
      req.user.name
    );

    return res.status(201).json({ success: true, examination: newExam });
  } catch (err) {
    console.error('Error adding vitals:', err);
    return res.status(500).json({ success: false, error: 'Failed to record vitals.' });
  }
});

/**
 * POST /api/patients/:id/medications
 * Add medications / prescriptions (Rx) to Supabase and cache
 */
router.post('/:id/medications', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const { medications } = req.body;
    const medsArray = Array.isArray(medications) ? medications : [medications];
    const now = new Date().toISOString();

    // 1. Save to Supabase
    if (isSupabaseConfigured) {
      try {
        await addMedicationsToSupabase(req.params.id, medsArray, req.user.id);
      } catch (sbErr) {
        console.warn('Supabase addMedications notice:', sbErr.message);
      }
    }

    const formattedMeds = medsArray.map((m, i) => ({
      id: 'med-' + Date.now() + '-' + i,
      date: now,
      doctorId: req.user.id,
      ...m
    }));

    patients[index].medications = [...formattedMeds, ...(patients[index].medications || [])];
    updatePatientsCollection(patients);

    recordAuditLog(
      'Prescription Generated',
      `Prescribed ${formattedMeds.length} medication(s) for "${patients[index].name}"`,
      'clinical',
      req.user.name
    );

    return res.status(201).json({ success: true, medications: formattedMeds });
  } catch (err) {
    console.error('Error adding medications:', err);
    return res.status(500).json({ success: false, error: 'Failed to add medications.' });
  }
});

/**
 * DELETE /api/patients/:id/medications/:medId
 * Delete medication from Supabase and cache
 */
router.delete('/:id/medications/:medId', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // 1. Delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteMedicationFromSupabase(req.params.id, req.params.medId);
      } catch (sbErr) {
        console.warn('Supabase deleteMedication notice:', sbErr.message);
      }
    }

    patients[index].medications = (patients[index].medications || []).filter(
      m => m.id !== req.params.medId
    );
    updatePatientsCollection(patients);

    return res.json({ success: true, message: 'Medication removed.' });
  } catch (err) {
    console.error('Error deleting medication:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete medication.' });
  }
});

/**
 * PUT /api/patients/:id/impression-advice
 * Update patient impression and instructions in Supabase and cache
 */
router.put('/:id/impression-advice', async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    // 1. Save to Supabase
    if (isSupabaseConfigured) {
      try {
        await saveImpressionAdviceToSupabase(req.params.id, req.body, req.user.id);
      } catch (sbErr) {
        console.warn('Supabase saveImpressionAdvice notice:', sbErr.message);
      }
    }

    patients[index].impressionAdvice = req.body;
    updatePatientsCollection(patients);

    return res.json({ success: true, impressionAdvice: req.body });
  } catch (err) {
    console.error('Error updating impression/advice:', err);
    return res.status(500).json({ success: false, error: 'Failed to update impression/advice.' });
  }
});

/**
 * ==============================================================================
 * CONFIDENTIAL DOCTOR PERSONAL NOTE VAULT (/cso Mandatory Gate)
 * Strictly protected; blocked from Administrators & Public Endpoints
 * ==============================================================================
 */

/**
 * GET /api/patients/:id/personal-notes
 * Read confidential doctor perception from Supabase private vault
 */
router.get('/:id/personal-notes', requireConfidentialNoteAccess, async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const text = await getPersonalNotesFromSupabase(req.params.id);
        if (text !== null) {
          return res.json({ success: true, personalNotes: text });
        }
      } catch (sbErr) {
        console.warn('Supabase getPersonalNotes notice:', sbErr.message);
      }
    }

    const patients = getPatients();
    const patient = patients.find(p => p.id === req.params.id || p.phone === req.params.id);

    if (!patient) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    return res.json({
      success: true,
      personalNotes: patient.personalNotes || ''
    });
  } catch (err) {
    console.error('Error reading confidential personal notes:', err);
    return res.status(500).json({ success: false, error: 'Failed to read personal notes.' });
  }
});

/**
 * PUT /api/patients/:id/personal-notes
 * Save confidential doctor perception into Supabase private vault
 */
router.put('/:id/personal-notes', requireConfidentialNoteAccess, async (req, res) => {
  try {
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === req.params.id || p.phone === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const { personalNotes } = req.body;

    // 1. Save to Supabase private vault
    if (isSupabaseConfigured) {
      try {
        await savePersonalNotesToSupabase(req.params.id, personalNotes, req.user.id);
      } catch (sbErr) {
        console.warn('Supabase savePersonalNotes notice:', sbErr.message);
      }
    }

    patients[index].personalNotes = personalNotes || '';
    updatePatientsCollection(patients);

    recordAuditLog(
      'Personal Note Updated',
      `Doctor recorded private perception for "${patients[index].name}" (Strictly Confidential)`,
      'clinical',
      req.user.name
    );
    logAuditToSupabase(
      'Personal Note Updated',
      req.user.name,
      `Doctor recorded private perception for "${patients[index].name}" (Strictly Confidential)`,
      'clinical'
    );

    return res.json({
      success: true,
      message: 'Personal doctor note saved confidentially.',
      personalNotes: patients[index].personalNotes
    });
  } catch (err) {
    console.error('Error saving personal note:', err);
    return res.status(500).json({ success: false, error: 'Failed to save confidential personal note.' });
  }
});

export default router;
