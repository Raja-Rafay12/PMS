import React, { useState, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Trash2,
  FileText,
  Upload,
  X,
  FileSpreadsheet,
  Image as ImageIcon,
  Eye,
  Download,
  Calendar,
  ExternalLink
} from 'lucide-react';

export const LabReportsTab = () => {
  const {
    activePatient,
    addLabReport,
    deleteLabReport,
    showToast
  } = usePatients();

  const [modalMode, setModalMode] = useState(null); // 'upload-doc', 'manual-report', null
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null); // Document object for viewing
  const fileInputRef = useRef(null);

  const getTodayString = () => new Date().toISOString().slice(0, 10);

  // Direct Document / Image Upload Form State
  const [uploadData, setUploadData] = useState({
    title: '',
    date: getTodayString(),
    notes: '',
    files: []
  });

  // Manual Key/Value Form State
  const [reportDate, setReportDate] = useState(getTodayString());
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState([
    { key: 'Hemoglobin', value: '' },
    { key: 'Total Leucocyte Count (TLC)', value: '' }
  ]);

  const commonTestSuggestions = [
    'Hemoglobin',
    'Total Leucocyte Count (TLC)',
    'Platelets',
    'ESR (1st Hour)',
    'Fasting Blood Sugar',
    'HbA1c',
    'Serum Creatinine',
    'Blood Urea',
    'SGPT (ALT)',
    'Serum Bilirubin',
    'Serum Electrolytes (Na/K/Cl)',
    'Lipid Profile - Total Cholesterol',
    'Urine Routine Examination',
    'Chest X-Ray PA View',
    'ECG 12-Lead'
  ];

  const labReports = activePatient?.labReports || [];

  // Handle direct file uploads (Image, PDF, Doc)
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileObj = {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type || 'application/octet-stream',
          dataUrl: event.target.result,
          uploadedAt: new Date().toISOString()
        };

        setUploadData(prev => ({
          ...prev,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
          files: [...prev.files, fileObj]
        }));
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleSaveUpload = (e) => {
    e.preventDefault();

    if (uploadData.files.length === 0) {
      alert('Please select at least one document or image file to upload.');
      return;
    }

    const d = new Date(uploadData.date || Date.now());
    const formattedDate = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    addLabReport(activePatient.id, {
      date: uploadData.date,
      formattedDate,
      title: uploadData.title || 'Diagnostic Report',
      notes: uploadData.notes,
      isDocumentUpload: true,
      entries: [],
      attachments: uploadData.files
    });

    showToast('Lab document uploaded and added to patient history');
    setUploadData({ title: '', date: getTodayString(), notes: '', files: [] });
    setModalMode(null);
  };

  // Manual Key/Value Report Handlers
  const handleAddRow = () => {
    setEntries(prev => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveRow = (index) => {
    setEntries(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleEntryChange = (index, field, val) => {
    setEntries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleSaveManualReport = (e) => {
    e.preventDefault();

    const validEntries = entries.filter(e => e.key && e.key.trim() && e.value && e.value.trim());
    if (validEntries.length === 0 && !notes.trim()) {
      alert('Please enter at least one test parameter or clinical note');
      return;
    }

    const d = new Date(reportDate || Date.now());
    const formattedDate = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    addLabReport(activePatient.id, {
      date: reportDate,
      formattedDate,
      title: 'Lab Investigation Panel',
      notes,
      entries: validEntries,
      attachments: []
    });

    setModalMode(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteLabReport(activePatient.id, deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const isImageFile = (type) => (type || '').startsWith('image/');
  const isPdfFile = (type, name) => (type || '').includes('pdf') || (name || '').endsWith('.pdf');

  return (
    <div>
      {/* Header with dual action buttons */}
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Diagnostic Lab Reports &amp; Scans</h2>
          <p className="tab-desc">
            Upload PDF reports, document scans, clinical test images, or record structured key/value lab parameters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn btn-cyan btn-sm"
            onClick={() => {
              setUploadData({ title: '', date: getTodayString(), notes: '', files: [] });
              setModalMode('upload-doc');
            }}
          >
            <Upload size={15} />
            <span>Upload Doc / PDF / Image</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setModalMode('manual-report')}
          >
            <Plus size={15} />
            <span>Add Test Table</span>
          </button>
        </div>
      </div>

      {/* DOCUMENT / IMAGE UPLOAD MODAL FORM */}
      {modalMode === 'upload-doc' && (
        <div className="card" style={{ marginBottom: 24, border: '2px solid #38bdf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={20} color="#0284c7" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Upload Lab Document, PDF or Scan Image</h3>
            </div>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => setModalMode(null)}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveUpload}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Report Title / Test Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Complete Blood Picture, Chest X-Ray, Renal Panel"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Investigation Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={uploadData.date}
                  onChange={(e) => setUploadData({ ...uploadData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Clinical Remarks / Doctor Notes</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Showing mild microcytic hypochromic anemia, reviewed with patient"
                value={uploadData.notes}
                onChange={(e) => setUploadData({ ...uploadData, notes: e.target.value })}
              />
            </div>

            {/* File Dropzone */}
            <div className="form-group">
              <label className="form-label">Select Document File (PDF, DOC/DOCX, PNG, JPG, WEBP) *</label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
                onChange={handleFileSelection}
              />

              <div
                className="upload-dropzone"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={32} color="#0284c7" style={{ margin: '0 auto 10px', display: 'block' }} />
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0369a1' }}>
                  Click to select or drag &amp; drop document files
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  Supports PDF documents, Lab scan images (JPG, PNG), and Word DOCs
                </div>
              </div>
            </div>

            {/* Selected File Badges */}
            {uploadData.files.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '14px 0' }}>
                {uploadData.files.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: '0.85rem'
                    }}
                  >
                    {isImageFile(file.type) ? (
                      <ImageIcon size={16} color="#0284c7" />
                    ) : (
                      <FileText size={16} color="#dc2626" />
                    )}
                    <span style={{ fontWeight: 600 }}>{file.name}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({file.size})</span>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadData(prev => ({
                          ...prev,
                          files: prev.files.filter((_, i) => i !== idx)
                        }))
                      }
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                    >
                      <X size={14} color="var(--text-muted)" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-cyan">
                Save to Lab History
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANUAL TEST TABLE FORM */}
      {modalMode === 'manual-report' && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Record Structured Lab Values</h3>
            <button
              type="button"
              className="btn-outline btn-sm"
              onClick={() => setModalMode(null)}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveManualReport}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Report Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes / Clinical Summary</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Fasting sample checked"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <datalist id="test-suggestions-tab">
              {commonTestSuggestions.map((s, idx) => (
                <option key={idx} value={s} />
              ))}
            </datalist>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
              {entries.map((entry, index) => (
                <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    list="test-suggestions-tab"
                    className="form-input"
                    placeholder="Parameter e.g. Hemoglobin"
                    style={{ flex: 1 }}
                    value={entry.key}
                    onChange={(e) => handleEntryChange(index, 'key', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Observed Value e.g. 13.5 g/dL"
                    style={{ flex: 1 }}
                    value={entry.value}
                    onChange={(e) => handleEntryChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => handleRemoveRow(index)}
                    title="Remove row"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddRow}
            >
              <Plus size={14} />
              <span>Add row</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setModalMode(null)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Report Table
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LAB REPORT HISTORY TIMELINE */}
      {labReports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--text-muted)' }}>
          <FileSpreadsheet size={40} color="var(--text-dim)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>No lab reports or scans recorded yet</p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
            Click "Upload Doc / PDF / Image" to attach files or "Add Test Table" to input key-value results.
          </p>
        </div>
      ) : (
        labReports.map((report) => (
          <div key={report.id} className="timeline-card">
            <div className="timeline-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: '#e0f2fe', color: '#0284c7', width: 36, height: 36, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {report.isDocumentUpload ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {report.title || (report.isDocumentUpload ? 'Uploaded Diagnostic File' : 'Laboratory Investigation')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                    <Calendar size={13} />
                    <span>{report.formattedDate || report.date}</span>
                    {report.notes && <span>· {report.notes}</span>}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteTargetId(report.id)}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>

            {/* Structured Table Values if any */}
            {report.entries && report.entries.length > 0 && (
              <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '8px 12px', width: '55%', color: 'var(--text-muted)', fontWeight: 600 }}>Parameter / Test</th>
                      <th style={{ padding: '8px 12px', width: '45%', color: 'var(--text-muted)', fontWeight: 600 }}>Result Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.entries.map((ent, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '8px 12px', fontWeight: 600 }}>{ent.key}</td>
                        <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#0f172a' }}>{ent.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Attached Documents & Images Gallery */}
            {report.attachments && report.attachments.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10, letterSpacing: '0.05em' }}>
                  Attached Files ({report.attachments.length})
                </div>

                <div className="lab-document-grid">
                  {report.attachments.map((att, i) => {
                    const isImg = isImageFile(att.type);
                    const isPdf = isPdfFile(att.type, att.name);

                    return (
                      <div key={i} className="lab-doc-card">
                        {isImg && att.dataUrl && (
                          <img
                            src={att.dataUrl}
                            alt={att.name}
                            className="doc-preview-thumb"
                            onClick={() => setPreviewDocument(att)}
                            style={{ cursor: 'pointer' }}
                          />
                        )}

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                          <div style={{ background: isPdf ? '#fee2e2' : '#e0f2fe', color: isPdf ? '#dc2626' : '#0284c7', padding: 8, borderRadius: 6, display: 'flex' }}>
                            {isPdf ? <FileText size={20} /> : <ImageIcon size={20} />}
                          </div>
                          <div style={{ overflow: 'hidden', flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={att.name}>
                              {att.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                              {att.size}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, padding: '5px' }}
                            onClick={() => setPreviewDocument(att)}
                          >
                            <Eye size={13} />
                            <span>Preview</span>
                          </button>

                          {att.dataUrl && (
                            <a
                              href={att.dataUrl}
                              download={att.name}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '5px 10px' }}
                              title="Download to computer"
                            >
                              <Download size={13} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* FULL DOCUMENT PREVIEW MODAL */}
      {previewDocument && (
        <div className="modal-overlay" onClick={() => setPreviewDocument(null)}>
          <div
            className="modal-card"
            style={{ maxWidth: 840, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
                <FileText size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {previewDocument.name}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {previewDocument.dataUrl && (
                  <a
                    href={previewDocument.dataUrl}
                    download={previewDocument.name}
                    className="btn btn-secondary btn-sm"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </a>
                )}
                <button
                  type="button"
                  className="btn-outline btn-sm"
                  onClick={() => setPreviewDocument(null)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 380 }}>
              {isImageFile(previewDocument.type) ? (
                <img
                  src={previewDocument.dataUrl}
                  alt={previewDocument.name}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 4 }}
                />
              ) : isPdfFile(previewDocument.type, previewDocument.name) ? (
                <iframe
                  src={previewDocument.dataUrl}
                  title={previewDocument.name}
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: 4 }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <FileText size={48} color="#0284c7" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ fontWeight: 600 }}>{previewDocument.name}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Document file ready. Click Download above to open in your native editor.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Lab Investigation"
        message="Are you sure you want to permanently delete this lab record and all attached documents?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
