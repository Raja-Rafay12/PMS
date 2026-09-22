import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getPatients, updatePatientsCollection, recordAuditLog } from '../data/store.js';
import { requireDoctor } from '../middleware/auth.js';
import { labUpload } from '../middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../uploads/lab_reports');

const router = express.Router();
router.use(requireDoctor);

/**
 * POST /api/labs/:patientId
 * Create a new lab report entry with optional file attachments
 */
router.post('/:patientId', labUpload.array('files', 5), (req, res) => {
  try {
    const { patientId } = req.params;
    const patients = getPatients();
    const index = patients.findIndex(p => p.id === patientId);

    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Patient not found.' });
    }

    const { testName, category, date, findings, status, notes } = req.body;

    let parsedFindings = [];
    if (typeof findings === 'string') {
      try {
        parsedFindings = JSON.parse(findings);
      } catch {
        parsedFindings = [];
      }
    } else if (Array.isArray(findings)) {
      parsedFindings = findings;
    }

    // Process uploaded files
    const attachments = (req.files || []).map(f => ({
      name: f.originalname,
      size: f.size,
      mimeType: f.mimetype,
      filename: f.filename,
      url: `/api/labs/files/${f.filename}`,
      uploadedAt: new Date().toISOString()
    }));

    const newLabReport = {
      id: 'lab-' + Date.now(),
      testName: testName || 'Diagnostic Report',
      category: category || 'Routine',
      date: date || new Date().toISOString(),
      findings: parsedFindings,
      attachments,
      status: status || 'Completed',
      notes: notes || ''
    };

    patients[index].labReports = [newLabReport, ...(patients[index].labReports || [])];
    updatePatientsCollection(patients);

    recordAuditLog(
      'Lab Report Saved',
      `Saved diagnostic report "${newLabReport.testName}" with ${attachments.length} attachment(s) for "${patients[index].name}"`,
      'clinical',
      req.user.name
    );

    return res.status(201).json({ success: true, labReport: newLabReport });
  } catch (err) {
    console.error('Lab upload error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process lab report upload.' });
  }
});

/**
 * GET /api/labs/files/:filename
 * Secure streaming of uploaded diagnostic scans/PDFs
 */
router.get('/files/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(uploadDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'File not found.' });
  }

  res.sendFile(filePath);
});

/**
 * DELETE /api/labs/:patientId/:labId
 * Delete a lab report and its files
 */
router.delete('/:patientId/:labId', (req, res) => {
  const { patientId, labId } = req.params;
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patientId);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Patient not found.' });
  }

  const report = (patients[index].labReports || []).find(l => l.id === labId);
  if (report && report.attachments) {
    report.attachments.forEach(att => {
      if (att.filename) {
        const p = path.join(uploadDir, path.basename(att.filename));
        if (fs.existsSync(p)) {
          try {
            fs.unlinkSync(p);
          } catch {}
        }
      }
    });
  }

  patients[index].labReports = (patients[index].labReports || []).filter(l => l.id !== labId);
  updatePatientsCollection(patients);

  return res.json({ success: true, message: 'Lab report deleted.' });
});

export default router;
