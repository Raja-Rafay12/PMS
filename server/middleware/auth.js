import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'patientcare_clinical_dev_jwt_secret_92837492817349182374';

/**
 * requireAuth: Core authentication middleware
 * Verifies JWT signature and active validity (/cso standard)
 */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. No bearer token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.'
    });
  }
};

/**
 * requireDoctor: Strict role gate for clinical workflows
 * Enforces that only authorized physicians can view/edit patient data
 */
export const requireDoctor = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Physician credentials required for clinical operations.'
      });
    }
    next();
  });
};

/**
 * requireAdmin: Strict role gate for administrative controls
 * Enforces that only system administrators can access clinic setup, doctor accounts, and audit logs
 */
export const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Administrator privileges required.'
      });
    }
    next();
  });
};

/**
 * requireConfidentialNoteAccess: High-security gate for Doctor's Personal Notes
 * (/cso Confidential Vault protection)
 * Strictly blocks administrators and non-doctors from reading physician private perceptions
 */
export const requireConfidentialNoteAccess = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Doctor personal notes are confidential and inaccessible to administrators or non-physicians.'
      });
    }
    next();
  });
};

/**
 * Helper to generate signed JWT tokens
 */
export const signUserToken = (userPayload) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
  return jwt.sign(
    {
      id: userPayload.id,
      email: userPayload.email,
      name: userPayload.name,
      role: userPayload.role,
      specialty: userPayload.specialty,
      pmcNumber: userPayload.pmcNumber
    },
    JWT_SECRET,
    { expiresIn }
  );
};
