import express from 'express';
import bcrypt from 'bcryptjs';
import {
  getDoctors,
  addDoctorRecord,
  updateDoctorRecord,
  resetDoctorPasswordRecord,
  deleteDoctorRecord,
  getClinicConfig,
  updateClinicConfigRecord,
  getDoctorLetterheads,
  updateDoctorLetterheadRecord,
  getAuditLogs,
  clearAuditLogsRecord,
  getPatients,
  updatePatientsCollection,
  recordAuditLog
} from '../data/store.js';
import { requireAdmin } from '../middleware/auth.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import {
  fetchDoctorsFromSupabase,
  createDoctorInSupabase,
  updateDoctorInSupabase,
  resetDoctorPasswordInSupabase,
  deleteDoctorFromSupabase,
  fetchClinicConfigFromSupabase,
  saveClinicConfigToSupabase,
  fetchDoctorLetterheadsFromSupabase,
  saveDoctorLetterheadToSupabase,
  fetchAuditLogsFromSupabase,
  clearAuditLogsInSupabase,
  fetchPatientsFromSupabase,
  logAuditToSupabase
} from '../services/supabaseService.js';

const router = express.Router();
router.use(requireAdmin);

/**
 * GET /api/admin/metrics
 * Returns real-time system analytics and storage metrics from Supabase & cache
 */
router.get('/metrics', async (req, res) => {
  try {
    let patients = getPatients();
    let doctors = getDoctors();

    if (isSupabaseConfigured) {
      try {
        const sbPatients = await fetchPatientsFromSupabase();
        if (sbPatients) patients = sbPatients;
        const sbDoctors = await fetchDoctorsFromSupabase();
        if (sbDoctors) doctors = sbDoctors;
      } catch (err) {
        console.warn('Supabase metrics notice:', err.message);
      }
    }

    const totalPatients = patients.length;
    const totalNotes = patients.reduce((acc, p) => acc + (p.notes?.length || 0), 0);
    const totalPrescriptions = patients.reduce((acc, p) => acc + (p.medications?.length || 0), 0);
    const totalLabReports = patients.reduce((acc, p) => acc + (p.labReports?.length || 0), 0);
    const activeDoctorsCount = doctors.filter(d => d.status === 'active').length;

    return res.json({
      success: true,
      metrics: {
        totalPatients,
        totalNotes,
        totalPrescriptions,
        totalLabReports,
        activeDoctorsCount,
        totalDoctors: doctors.length
      }
    });
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return res.status(500).json({ success: false, error: 'Failed to calculate metrics.' });
  }
});

/**
 * GET /api/admin/doctors
 * List all registered physicians from Supabase & cache
 */
router.get('/doctors', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const sbDoctors = await fetchDoctorsFromSupabase();
        if (sbDoctors && sbDoctors.length > 0) {
          return res.json({ success: true, doctors: sbDoctors });
        }
      } catch (sbErr) {
        console.warn('Supabase fetchDoctors notice:', sbErr.message);
      }
    }

    const doctors = getDoctors().map(({ passwordHash, ...safeDoc }) => safeDoc);
    return res.json({ success: true, doctors });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve doctors.' });
  }
});

/**
 * POST /api/admin/doctors
 * Register a new doctor with bcrypt password hashing in Supabase and cache
 */
router.post('/doctors', async (req, res) => {
  try {
    const { name, email, qualifications, pmcNumber, specialty, phone, password, username, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, Email, and Password are required.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.trim(), salt);

    let createdDoc = null;

    // 1. Persist directly into Supabase
    if (isSupabaseConfigured) {
      try {
        createdDoc = await createDoctorInSupabase(
          { name, email, qualifications, pmcNumber, specialty, phone, username, status },
          passwordHash
        );
      } catch (sbErr) {
        console.warn('Supabase createDoctor notice:', sbErr.message);
      }
    }

    // 2. Keep local cache updated
    const localDoc = await addDoctorRecord({
      name,
      email,
      username,
      qualifications,
      pmcNumber,
      specialty,
      phone,
      password,
      status
    });

    const finalDoc = createdDoc || localDoc;

    recordAuditLog(
      'Doctor Registered',
      `Registered physician account for ${finalDoc.name} (${finalDoc.email})`,
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Doctor Registered',
      req.user.name,
      `Registered physician account for ${finalDoc.name} (${finalDoc.email})`,
      'admin'
    );

    const { passwordHash: _, ...safeDoc } = finalDoc;
    return res.status(201).json({ success: true, doctor: safeDoc });
  } catch (err) {
    console.error('Add doctor error:', err);
    return res.status(500).json({ success: false, error: 'Failed to create doctor account.' });
  }
});

/**
 * PUT /api/admin/doctors/:id
 * Update doctor details in Supabase and cache
 */
router.put('/doctors/:id', async (req, res) => {
  try {
    let updatedDoc = null;

    // 1. Update in Supabase
    if (isSupabaseConfigured) {
      try {
        updatedDoc = await updateDoctorInSupabase(req.params.id, req.body);
      } catch (sbErr) {
        console.warn('Supabase updateDoctor notice:', sbErr.message);
      }
    }

    // 2. Update in local store
    const localUpdated = updateDoctorRecord(req.params.id, req.body);

    const result = updatedDoc || localUpdated;
    if (!result) {
      return res.status(404).json({ success: false, error: 'Doctor not found.' });
    }

    recordAuditLog(
      'Doctor Updated',
      `Updated physician profile: ${result.name}`,
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Doctor Updated',
      req.user.name,
      `Updated physician profile: ${result.name}`,
      'admin'
    );

    const { passwordHash: _, ...safeDoc } = result;
    return res.json({ success: true, doctor: safeDoc });
  } catch (err) {
    console.error('Error updating doctor:', err);
    return res.status(500).json({ success: false, error: 'Failed to update doctor profile.' });
  }
});

/**
 * POST /api/admin/doctors/:id/reset-password
 * Reset doctor password with new bcrypt hash in Supabase and cache
 */
router.post('/doctors/:id/reset-password', async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword.trim(), salt);

    // 1. Update in Supabase
    if (isSupabaseConfigured) {
      try {
        await resetDoctorPasswordInSupabase(req.params.id, passwordHash);
      } catch (sbErr) {
        console.warn('Supabase resetDoctorPassword notice:', sbErr.message);
      }
    }

    // 2. Update in local store
    const ok = await resetDoctorPasswordRecord(req.params.id, newPassword);

    recordAuditLog(
      'Password Reset',
      `Admin reset passkey for doctor ID: ${req.params.id}`,
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Password Reset',
      req.user.name,
      `Admin reset passkey for doctor ID: ${req.params.id}`,
      'admin'
    );

    return res.json({ success: true, message: 'Password reset successfully.' });
  } catch (err) {
    console.error('Error resetting password:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password.' });
  }
});

/**
 * DELETE /api/admin/doctors/:id
 * Delete a doctor account from Supabase and cache
 */
router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctors = getDoctors();
    if (doctors.length <= 1) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete the only registered doctor in the system.'
      });
    }

    // 1. Delete from Supabase
    if (isSupabaseConfigured) {
      try {
        await deleteDoctorFromSupabase(req.params.id);
      } catch (sbErr) {
        console.warn('Supabase deleteDoctor notice:', sbErr.message);
      }
    }

    // 2. Delete from local store
    deleteDoctorRecord(req.params.id);

    recordAuditLog(
      'Doctor Deleted',
      `Removed physician account ID: ${req.params.id}`,
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Doctor Deleted',
      req.user.name,
      `Removed physician account ID: ${req.params.id}`,
      'admin'
    );

    return res.json({ success: true, message: 'Doctor account deleted.' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    return res.status(500).json({ success: false, error: 'Failed to delete doctor.' });
  }
});

/**
 * GET /api/admin/clinic-config
 * Fetch clinic letterhead credentials from Supabase & cache
 */
router.get('/clinic-config', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const sbConfig = await fetchClinicConfigFromSupabase();
        if (sbConfig) {
          updateClinicConfigRecord(sbConfig);
          return res.json({ success: true, clinicConfig: sbConfig });
        }
      } catch (sbErr) {
        console.warn('Supabase fetchClinicConfig notice:', sbErr.message);
      }
    }

    return res.json({ success: true, clinicConfig: getClinicConfig() });
  } catch (err) {
    console.error('Error fetching clinic config:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve clinic config.' });
  }
});

/**
 * PUT /api/admin/clinic-config
 * Update clinic letterhead credentials in Supabase and cache
 */
router.put('/clinic-config', async (req, res) => {
  try {
    let result = null;

    // 1. Save in Supabase
    if (isSupabaseConfigured) {
      try {
        result = await saveClinicConfigToSupabase(req.body);
      } catch (sbErr) {
        console.warn('Supabase saveClinicConfig notice:', sbErr.message);
      }
    }

    const updated = updateClinicConfigRecord(req.body);
    const finalConfig = result || updated;

    recordAuditLog(
      'Clinic Master Settings Updated',
      'Updated clinic branding and letterhead configuration in database',
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Clinic Master Settings Updated',
      req.user.name,
      'Updated clinic branding and letterhead configuration in Supabase PostgreSQL',
      'admin'
    );

    return res.json({ success: true, clinicConfig: finalConfig });
  } catch (err) {
    console.error('Error updating clinic config:', err);
    return res.status(500).json({ success: false, error: 'Failed to update clinic config.' });
  }
});

/**
 * GET /api/admin/doctor-letterheads
 * Fetch individual doctor clinical letterheads registry
 */
router.get('/doctor-letterheads', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const sbLetterheads = await fetchDoctorLetterheadsFromSupabase();
        if (sbLetterheads && Object.keys(sbLetterheads).length > 0) {
          // Sync with local memory cache
          for (const [docId, lh] of Object.entries(sbLetterheads)) {
            updateDoctorLetterheadRecord(docId, lh);
          }
          return res.json({ success: true, doctorLetterheads: sbLetterheads });
        }
      } catch (sbErr) {
        console.warn('Supabase fetchDoctorLetterheads notice:', sbErr.message);
      }
    }

    return res.json({ success: true, doctorLetterheads: getDoctorLetterheads() });
  } catch (err) {
    console.error('Error fetching doctor letterheads:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve doctor letterheads.' });
  }
});

/**
 * PUT /api/admin/doctor-letterheads/:doctorId
 * Save or update an individual doctor's custom clinical letterhead
 */
router.put('/doctor-letterheads/:doctorId', async (req, res) => {
  try {
    const { doctorId } = req.params;
    const letterheadData = req.body;

    if (!doctorId) {
      return res.status(400).json({ success: false, error: 'Doctor ID is required.' });
    }

    let savedSb = null;
    if (isSupabaseConfigured) {
      try {
        savedSb = await saveDoctorLetterheadToSupabase(doctorId, letterheadData);
      } catch (sbErr) {
        console.warn('Supabase saveDoctorLetterhead notice:', sbErr.message);
      }
    }

    const localSaved = updateDoctorLetterheadRecord(doctorId, letterheadData);
    const finalLetterhead = savedSb || localSaved;

    recordAuditLog(
      'Doctor Letterhead Updated',
      `Updated clinical letterhead configuration for doctor ID: ${doctorId}`,
      'admin',
      req.user.name
    );
    logAuditToSupabase(
      'Doctor Letterhead Updated',
      req.user.name,
      `Updated clinical letterhead configuration for doctor ID: ${doctorId}`,
      'admin'
    );

    return res.json({ success: true, doctorId, letterhead: finalLetterhead });
  } catch (err) {
    console.error('Error updating doctor letterhead:', err);
    return res.status(500).json({ success: false, error: 'Failed to update doctor letterhead.' });
  }
});

/**
 * GET /api/admin/audit-logs
 * Fetch immutable security audit logs from Supabase & cache
 */
router.get('/audit-logs', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        const sbLogs = await fetchAuditLogsFromSupabase();
        if (sbLogs && sbLogs.length > 0) {
          return res.json({ success: true, auditLogs: sbLogs });
        }
      } catch (sbErr) {
        console.warn('Supabase fetchAuditLogs notice:', sbErr.message);
      }
    }

    return res.json({ success: true, auditLogs: getAuditLogs() });
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve audit logs.' });
  }
});

/**
 * POST /api/admin/audit-logs/clear
 * Clear audit logs in Supabase and cache
 */
router.post('/audit-logs/clear', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      try {
        await clearAuditLogsInSupabase();
      } catch (sbErr) {
        console.warn('Supabase clearAuditLogs notice:', sbErr.message);
      }
    }

    clearAuditLogsRecord();
    recordAuditLog(
      'Audit Trail Purged',
      'All historical security audit records were purged by Administrator',
      'admin',
      req.user.name
    );

    return res.json({ success: true, message: 'Audit logs cleared.' });
  } catch (err) {
    console.error('Error clearing audit logs:', err);
    return res.status(500).json({ success: false, error: 'Failed to clear audit logs.' });
  }
});

/**
 * POST /api/admin/backup/restore
 * Restore entire clinic database from uploaded JSON payload
 */
router.post('/backup/restore', (req, res) => {
  try {
    const { patients, clinicConfig } = req.body;
    if (!patients || !Array.isArray(patients)) {
      return res.status(400).json({ success: false, error: 'Invalid backup file format.' });
    }

    updatePatientsCollection(patients);
    if (clinicConfig) {
      updateClinicConfigRecord(clinicConfig);
    }

    recordAuditLog(
      'Database Restored',
      `Restored ${patients.length} patient records from backup`,
      'admin',
      req.user.name
    );

    return res.json({
      success: true,
      message: `Successfully restored ${patients.length} patients.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to restore backup.' });
  }
});

export default router;
