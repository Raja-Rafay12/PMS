import express from 'express';
import bcrypt from 'bcryptjs';
import {
  findDoctorByIdentifier,
  getAdmin,
  recordAuditLog,
  updateDoctorRecord
} from '../data/store.js';
import { signUserToken, requireAuth } from '../middleware/auth.js';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';

const router = express.Router();

/**
 * POST /api/auth/doctor/login
 * Validates doctor credentials with bcrypt hash comparison & issues JWT
 */
router.post('/doctor/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Doctor email/username and password are required.'
      });
    }

    let doctor = null;
    let passwordHash = null;

    // 1. Query Supabase PostgreSQL doctors table
    if (isSupabaseConfigured && supabase) {
      try {
        const clean = String(identifier).trim().toLowerCase();
        const { data: sbDoc } = await supabase
          .from('doctors')
          .select('*')
          .or(`email.ilike.${clean},username.ilike.${clean}`)
          .maybeSingle();

        if (sbDoc) {
          doctor = {
            id: sbDoc.id,
            name: sbDoc.name,
            email: sbDoc.email,
            username: sbDoc.username,
            status: sbDoc.status,
            qualifications: sbDoc.qualifications,
            pmcNumber: sbDoc.pmc_number,
            specialty: sbDoc.specialty,
            phone: sbDoc.phone,
            passwordHash: sbDoc.password_hash
          };
          passwordHash = sbDoc.password_hash;
        }
      } catch (err) {
        console.warn('Supabase doctor login lookup notice:', err.message);
      }
    }

    // 2. Fallback to local store if not found in Supabase
    if (!doctor) {
      doctor = findDoctorByIdentifier(identifier);
      if (doctor) passwordHash = doctor.passwordHash;
    }

    if (!doctor) {
      recordAuditLog(
        'Failed Doctor Login',
        `Unrecognized identifier attempted: "${identifier}"`,
        'auth',
        'Unknown'
      );
      return res.status(401).json({
        success: false,
        error: 'Invalid doctor email/username or password.'
      });
    }

    if (doctor.status !== 'active') {
      recordAuditLog(
        'Blocked Doctor Login',
        `Deactivated account attempted sign in: ${doctor.email}`,
        'auth',
        doctor.name
      );
      return res.status(403).json({
        success: false,
        error: 'Your doctor account is deactivated. Please contact the administrator.'
      });
    }

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) {
      recordAuditLog(
        'Failed Doctor Login',
        `Incorrect password entered for: ${doctor.email}`,
        'auth',
        doctor.name
      );
      return res.status(401).json({
        success: false,
        error: 'Invalid doctor email/username or password.'
      });
    }

    const now = new Date().toISOString();
    updateDoctorRecord(doctor.id, { lastLogin: now });

    const userProfile = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      username: doctor.username,
      role: 'doctor',
      qualifications: doctor.qualifications,
      pmcNumber: doctor.pmcNumber,
      specialty: doctor.specialty,
      phone: doctor.phone,
      lastLogin: now
    };

    // Sign JWT token
    const token = signUserToken(userProfile);

    recordAuditLog(
      'Doctor Logged In',
      `Session established via JWT for ${doctor.name}`,
      'auth',
      doctor.name
    );

    return res.json({
      success: true,
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Doctor login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication.'
    });
  }
});

/**
 * POST /api/auth/admin/login
 * Validates admin master passkey with bcrypt hash comparison & issues JWT
 */
router.post('/admin/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Admin identifier and master passkey are required.'
      });
    }

    const admin = getAdmin();
    const cleanId = (identifier || '').trim().toLowerCase();

    const isIdentifierMatch =
      cleanId === admin.email.toLowerCase() || cleanId === admin.username.toLowerCase();

    if (!isIdentifierMatch) {
      recordAuditLog(
        'Failed Admin Login',
        `Unrecognized admin identifier attempted: "${identifier}"`,
        'auth',
        'Unknown'
      );
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials or passkey.'
      });
    }

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      recordAuditLog(
        'Failed Admin Login',
        'Incorrect master passkey entered',
        'auth',
        admin.name
      );
      return res.status(401).json({
        success: false,
        error: 'Invalid admin credentials or passkey.'
      });
    }

    const now = new Date().toISOString();
    const adminProfile = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      username: admin.username,
      role: 'admin',
      title: admin.title,
      lastLogin: now
    };

    // Sign JWT token with admin role
    const token = signUserToken(adminProfile);

    recordAuditLog(
      'Admin Logged In',
      'Master administrative session established via JWT',
      'auth',
      admin.name
    );

    return res.json({
      success: true,
      token,
      user: adminProfile
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during administrative authentication.'
    });
  }
});

/**
 * GET /api/auth/me
 * Returns authenticated user profile by verifying active JWT
 */
router.get('/me', requireAuth, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
