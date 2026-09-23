import React, { useState, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { RichTextToolbar } from '../common/RichTextToolbar';
import { MarkdownView } from '../common/MarkdownView';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Edit3,
  Trash2,
  Stethoscope,
  Clock,
  FileText,
  Activity,
  Users,
  Briefcase,
  Pill,
  Baby,
  Syringe,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Columns,
  Maximize2,
  Copy,
  Sparkles,
  RotateCcw,
  Check,
  Heart,
  Wind
} from 'lucide-react';

export const HistoryTab = () => {
  const {
    activePatient,
    addClinicalNote,
    updateClinicalNote,
    deleteClinicalNote,
    showToast
  } = usePatients();

  const { currentUser } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [collapsedNotes, setCollapsedNotes] = useState({});
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'full'
  const [isBaselineCarried, setIsBaselineCarried] = useState(false);
  const [selectedPastNoteId, setSelectedPastNoteId] = useState(null);

  // Detect doctor's specialty or default to general
  const [specialtyMode, setSpecialtyMode] = useState(() => {
    const s = (currentUser?.specialty || '').toLowerCase();
    if (s.includes('cardio') || s.includes('heart')) return 'cardiology';
    if (s.includes('pulmo') || s.includes('chest') || s.includes('respir')) return 'pulmonology';
    return 'general';
  });

  const defaultFormData = {
    chiefComplaint: '',
    presentIllness: '',
    systemReviews: '',
    pastHistory: '',
    vaccineHistory: '',
    familyHistory: '',
    socialHistory: '',
    presentMedication: '',
    allergicHistory: '',
    birthHistory: ''
  };

  const [formData, setFormData] = useState(defaultFormData);

  // References for toolbar targeting
  const chiefComplaintRef = useRef(null);
  const presentIllnessRef = useRef(null);
  const systemReviewsRef = useRef(null);
  const pastHistoryRef = useRef(null);
  const vaccineHistoryRef = useRef(null);
  const familyHistoryRef = useRef(null);
  const socialHistoryRef = useRef(null);
  const presentMedicationRef = useRef(null);
  const allergicHistoryRef = useRef(null);
  const birthHistoryRef = useRef(null);

  const notes = activePatient?.notes || [];
  const pastNotes = [...notes].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );

  const selectedPastNote = selectedPastNoteId
    ? pastNotes.find(n => n.id === selectedPastNoteId) || pastNotes[0]
    : pastNotes[0] || null;

  const handleStartAdd = () => {
    const lastNote = pastNotes[0];
    if (lastNote) {
      // Auto-carry forward static & chronic baseline medical history!
      setFormData({
        chiefComplaint: '',
        presentIllness: '',
        systemReviews: '',
        pastHistory: lastNote.pastHistory || '',
        vaccineHistory: lastNote.vaccineHistory || '',
        familyHistory: lastNote.familyHistory || '',
        socialHistory: lastNote.socialHistory || '',
        presentMedication: lastNote.presentMedication || '',
        allergicHistory: lastNote.allergicHistory || '',
        birthHistory: lastNote.birthHistory || ''
      });
      setIsBaselineCarried(true);
      setSelectedPastNoteId(lastNote.id);
    } else {
      setFormData(defaultFormData);
      setIsBaselineCarried(false);
      setSelectedPastNoteId(null);
    }
    setEditingNoteId(null);
    setIsAdding(true);
  };

  const handleResetBaseline = () => {
    setFormData(prev => ({
      ...prev,
      pastHistory: '',
      vaccineHistory: '',
      familyHistory: '',
      socialHistory: '',
      presentMedication: '',
      allergicHistory: '',
      birthHistory: ''
    }));
    setIsBaselineCarried(false);
    showToast('Baseline history cleared to blank');
  };

  const handleResyncBaseline = () => {
    const lastNote = pastNotes[0];
    if (lastNote) {
      setFormData(prev => ({
        ...prev,
        pastHistory: lastNote.pastHistory || '',
        vaccineHistory: lastNote.vaccineHistory || '',
        familyHistory: lastNote.familyHistory || '',
        socialHistory: lastNote.socialHistory || '',
        presentMedication: lastNote.presentMedication || '',
        allergicHistory: lastNote.allergicHistory || '',
        birthHistory: lastNote.birthHistory || ''
      }));
      setIsBaselineCarried(true);
      showToast('Baseline history re-synced from previous visit');
    }
  };

  const handleCopyFromPast = (field, text, fieldLabel) => {
    if (!text) return;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}\n\n${text}` : text
    }));
    showToast(`Copied ${fieldLabel} into today's note!`);
  };

  const handleInsertSystemReviewChip = (chipText) => {
    setFormData(prev => ({
      ...prev,
      systemReviews: prev.systemReviews
        ? `${prev.systemReviews}\n**${chipText}:** `
        : `**${chipText}:** `
    }));
    if (systemReviewsRef.current) {
      systemReviewsRef.current.focus();
    }
  };

  const handleStartEdit = (note) => {
    setFormData({
      chiefComplaint: note.chiefComplaint || '',
      presentIllness: note.presentIllness || '',
      systemReviews: note.systemReviews || '',
      pastHistory: note.pastHistory || '',
      vaccineHistory: note.vaccineHistory || '',
      familyHistory: note.familyHistory || '',
      socialHistory: note.socialHistory || '',
      presentMedication: note.presentMedication || '',
      allergicHistory: note.allergicHistory || '',
      birthHistory: note.birthHistory || ''
    });
    setEditingNoteId(note.id);
    setIsBaselineCarried(false);
    setIsAdding(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const hasContent = Object.values(formData).some(val => val && val.trim());
    if (!hasContent) {
      alert('Please fill at least one clinical note field before saving');
      return;
    }

    if (editingNoteId) {
      updateClinicalNote(activePatient.id, editingNoteId, formData);
      showToast('Clinical note updated');
    } else {
      addClinicalNote(activePatient.id, formData);
      showToast('New clinical note added to history');
    }

    setIsAdding(false);
    setEditingNoteId(null);
    setFormData(defaultFormData);
    setIsBaselineCarried(false);
  };

  const toggleCollapse = (noteId) => {
    setCollapsedNotes(prev => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteClinicalNote(activePatient.id, deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  // Quick chips for Review of Systems based on specialty
  const systemReviewPresets = {
    cardiology: [
      'Chest Pain (OPQRST)',
      'Orthopnea / PND',
      'Palpitations',
      'Ankle / Pedal Swelling',
      'Exertional Dyspnea (NYHA)',
      'Syncope / Pre-syncope'
    ],
    pulmonology: [
      'Cough Character & Sputum',
      'Exertional Dyspnea (mMRC)',
      'Wheezing / Nocturnal Asthma',
      'Hemoptysis',
      'Chest Tightness',
      'Smoking Pack-Years'
    ],
    general: [
      'General / Fever / Weight',
      'Cardiorespiratory',
      'Gastrointestinal',
      'Neurological & Sleep',
      'Genitourinary',
      'Musculoskeletal'
    ]
  };

  if (isAdding) {
    const isDualPane = viewMode === 'split' && pastNotes.length > 0;
    const latestExam = activePatient?.examinations?.[0];
    const latestAdvice = activePatient?.impressionAdvice;
    const activeMeds = activePatient?.medications || [];

    return (
      <div style={{ marginTop: 12 }}>
        {/* Workspace Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {editingNoteId ? 'Edit Clinical Consultation Note' : 'New Clinical Consultation Note'}
              </h2>
              {pastNotes.length > 0 && !editingNoteId && (
                <span className="badge badge-success" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                  <Sparkles size={12} style={{ marginRight: 4 }} />
                  Returning Patient
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Structured longitudinal assessment for <strong>{activePatient.name}</strong> (MRN: {activePatient.phone})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* View Mode Toggle (Split vs Full Width) */}
            {pastNotes.length > 0 && (
              <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 'var(--radius-sm)', padding: 3 }}>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`btn btn-xs ${viewMode === 'split' ? 'btn-primary' : 'btn-ghost'}`}
                  title="Side-by-side view with past visit on left"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: '0.775rem' }}
                >
                  <Columns size={13} />
                  <span>Split View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('full')}
                  className={`btn btn-xs ${viewMode === 'full' ? 'btn-primary' : 'btn-ghost'}`}
                  title="Full width single-column editor"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', fontSize: '0.775rem' }}
                >
                  <Maximize2 size={13} />
                  <span>Full Width</span>
                </button>
              </div>
            )}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setIsAdding(false); setEditingNoteId(null); }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Dual Pane Layout Container */}
        <div className={isDualPane ? 'dual-pane-workspace' : ''}>
          {/* =========================================================
              LEFT PANE: PREVIOUS VISIT REFERENCE (SIDE-BY-SIDE VIEW)
              ========================================================= */}
          {isDualPane && (
            <div className="past-visit-reference-pane">
              <div className="pane-header-title">
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} color="var(--brand-cyan)" />
                    <span>Previous Visit Reference</span>
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Compare prior findings with today
                  </div>
                </div>
                <span className="pane-badge">
                  {pastNotes.length} past {pastNotes.length === 1 ? 'note' : 'notes'}
                </span>
              </div>

              {/* Past Visits Selector if multiple exist */}
              {pastNotes.length > 1 && (
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                    Select Past Visit:
                  </label>
                  <select
                    className="visit-select-dropdown"
                    value={selectedPastNoteId || pastNotes[0].id}
                    onChange={(e) => setSelectedPastNoteId(e.target.value)}
                  >
                    {pastNotes.map((pn, i) => (
                      <option key={pn.id} value={pn.id}>
                        {pn.formattedDate || new Date(pn.date).toLocaleDateString()} — {pn.chiefComplaint ? pn.chiefComplaint.slice(0, 32) + '...' : `Visit #${pastNotes.length - i}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedPastNote && (
                <>
                  {/* Previous Chief Complaint */}
                  <div className="past-section-box">
                    <div className="past-section-header">
                      <span className="past-section-label">
                        <Stethoscope size={13} color="var(--brand-cyan)" />
                        <span>Previous Chief Complaint</span>
                      </span>
                      <button
                        type="button"
                        className="copy-mini-btn"
                        onClick={() => handleCopyFromPast('chiefComplaint', selectedPastNote.chiefComplaint, 'Chief Complaint')}
                        title="Copy to Today's Chief Complaint"
                      >
                        <Copy size={11} />
                        <span>Copy</span>
                      </button>
                    </div>
                    <div className="past-section-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedPastNote.chiefComplaint || '—'}
                    </div>
                  </div>

                  {/* Previous HPI */}
                  {selectedPastNote.presentIllness && (
                    <div className="past-section-box">
                      <div className="past-section-header">
                        <span className="past-section-label">
                          <FileText size={13} color="var(--brand-cyan)" />
                          <span>History of Present Illness (HPI)</span>
                        </span>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => handleCopyFromPast('presentIllness', selectedPastNote.presentIllness, 'HPI')}
                          title="Append to Today's HPI"
                        >
                          <Copy size={11} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="past-section-text">
                        {selectedPastNote.presentIllness}
                      </div>
                    </div>
                  )}

                  {/* Previous System Reviews */}
                  {selectedPastNote.systemReviews && (
                    <div className="past-section-box">
                      <div className="past-section-header">
                        <span className="past-section-label">
                          <Activity size={13} color="var(--brand-teal)" />
                          <span>Review of Systems</span>
                        </span>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => handleCopyFromPast('systemReviews', selectedPastNote.systemReviews, 'ROS')}
                          title="Copy to Today's ROS"
                        >
                          <Copy size={11} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="past-section-text">
                        {selectedPastNote.systemReviews}
                      </div>
                    </div>
                  )}

                  {/* Previous Vitals Snapshot */}
                  {latestExam && (
                    <div className="past-section-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                      <div className="past-section-header">
                        <span className="past-section-label" style={{ color: '#15803d' }}>
                          <Activity size={13} color="#15803d" />
                          <span>Last Recorded Vitals</span>
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>
                          {latestExam.formattedDate || 'Recent'}
                        </span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, fontSize: '0.75rem', marginTop: 4 }}>
                        {latestExam.vitals?.bpSystolic && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>BP: </span>
                            <strong>{latestExam.vitals.bpSystolic}/{latestExam.vitals.bpDiastolic}</strong>
                          </div>
                        )}
                        {latestExam.vitals?.pulse && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>Pulse: </span>
                            <strong>{latestExam.vitals.pulse} bpm</strong>
                          </div>
                        )}
                        {latestExam.vitals?.spO2 && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>SpO2: </span>
                            <strong>{latestExam.vitals.spO2}%</strong>
                          </div>
                        )}
                        {latestExam.vitals?.temperature && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>Temp: </span>
                            <strong>{latestExam.vitals.temperature}°C</strong>
                          </div>
                        )}
                        {latestExam.vitals?.weight && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>Wt: </span>
                            <strong>{latestExam.vitals.weight} kg</strong>
                          </div>
                        )}
                        {latestExam.vitals?.bloodSugar && (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600 }}>BS: </span>
                            <strong>{latestExam.vitals.bloodSugar} mg/dL</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Previous Diagnosis & Advice */}
                  {latestAdvice?.impression && (
                    <div className="past-section-box" style={{ background: '#fef3c7', borderColor: '#fde68a' }}>
                      <div className="past-section-header">
                        <span className="past-section-label" style={{ color: '#b45309' }}>
                          <Check size={13} color="#b45309" />
                          <span>Last Impression / Diagnosis</span>
                        </span>
                      </div>
                      <div className="past-section-text" style={{ color: '#78350f', fontWeight: 600 }}>
                        {latestAdvice.impression}
                      </div>
                    </div>
                  )}

                  {/* Active Medications Prescribed */}
                  {activeMeds.length > 0 && (
                    <div className="past-section-box">
                      <div className="past-section-header">
                        <span className="past-section-label">
                          <Pill size={13} color="#6366f1" />
                          <span>Previously Prescribed Rx ({activeMeds.length})</span>
                        </span>
                        <button
                          type="button"
                          className="copy-mini-btn"
                          onClick={() => {
                            const medsText = activeMeds.map(m => `• ${m.name} ${m.dose || ''} (${m.frequency || ''})`).join('\n');
                            handleCopyFromPast('presentMedication', medsText, 'Medication List');
                          }}
                          title="Copy med list to Current Medications"
                        >
                          <Copy size={11} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {activeMeds.slice(0, 4).map((m, i) => (
                          <li key={i} style={{ marginBottom: 3 }}>
                            <strong>{m.name}</strong> {m.dose && `(${m.dose})`} - {m.frequency || 'As directed'}
                          </li>
                        ))}
                        {activeMeds.length > 4 && (
                          <li style={{ color: 'var(--text-muted)' }}>+ {activeMeds.length - 4} more meds...</li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* =========================================================
              RIGHT PANE: TODAY'S CONSULTATION NOTE EDITOR
              ========================================================= */}
          <div className="consultation-form-pane">
            <form onSubmit={handleSave} className="card" style={{ padding: '28px' }}>
              {/* Auto-Carry Forward Notification Banner */}
              {isBaselineCarried && !editingNoteId && (
                <div className="baseline-carry-banner">
                  <div className="baseline-carry-text">
                    <Sparkles size={18} color="#16a34a" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>Baseline Medical History Auto-Carried Forward:</strong> Past history, allergies, chronic medications, family, and social history have been pre-filled from the patient's previous visit ({selectedPastNote?.formattedDate || 'last record'}).
                    </div>
                  </div>
                  <div className="baseline-carry-actions">
                    <button
                      type="button"
                      className="baseline-action-btn"
                      onClick={handleResetBaseline}
                      title="Clear carried baseline history to blank"
                    >
                      Clear Baseline
                    </button>
                    <button
                      type="button"
                      className="baseline-action-btn"
                      onClick={handleResyncBaseline}
                      title="Re-copy baseline from previous visit"
                    >
                      <RotateCcw size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Re-sync
                    </button>
                  </div>
                </div>
              )}

              {/* Specialty Mode Selector Bar */}
              <div className="specialty-mode-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Specialty Template:
                  </span>
                  <div className="specialty-pills-row">
                    <button
                      type="button"
                      className={`specialty-pill-btn ${specialtyMode === 'cardiology' ? 'active cardio' : ''}`}
                      onClick={() => setSpecialtyMode('cardiology')}
                    >
                      <Heart size={13} />
                      <span>Cardiology / Heart</span>
                    </button>
                    <button
                      type="button"
                      className={`specialty-pill-btn ${specialtyMode === 'pulmonology' ? 'active pulmo' : ''}`}
                      onClick={() => setSpecialtyMode('pulmonology')}
                    >
                      <Wind size={13} />
                      <span>Pulmonology / Chest</span>
                    </button>
                    <button
                      type="button"
                      className={`specialty-pill-btn ${specialtyMode === 'general' ? 'active' : ''}`}
                      onClick={() => setSpecialtyMode('general')}
                    >
                      <Stethoscope size={13} />
                      <span>General Medicine</span>
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Doctor: <strong>{currentUser?.name || 'Attending Physician'}</strong> ({currentUser?.specialty || 'Consultant'})
                </div>
              </div>

              {/* SECTION 1: PRIMARY ASSESSMENT */}
              <div className="note-form-card-section">
                <div className="section-badge-header">
                  <Stethoscope size={16} color="var(--brand-cyan)" />
                  <span>Primary Complaint &amp; History of Present Illness</span>
                </div>

                <div className="clinical-field-block">
                  <label className="clinical-field-label">Chief Complaint *</label>
                  <div className="rich-editor-wrapper">
                    <RichTextToolbar
                      textareaRef={chiefComplaintRef}
                      value={formData.chiefComplaint}
                      onChange={(val) => setFormData({ ...formData, chiefComplaint: val })}
                    />
                    <textarea
                      ref={chiefComplaintRef}
                      className="modern-clinical-textarea"
                      style={{ minHeight: '68px' }}
                      placeholder="What brings the patient in today? e.g. Recurrent palpitations on exertion; nocturnal dry cough"
                      value={formData.chiefComplaint}
                      onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="clinical-field-block">
                  <label className="clinical-field-label">History of Present Illness (HPI)</label>
                  <div className="rich-editor-wrapper">
                    <RichTextToolbar
                      textareaRef={presentIllnessRef}
                      value={formData.presentIllness}
                      onChange={(val) => setFormData({ ...formData, presentIllness: val })}
                    />
                    <textarea
                      ref={presentIllnessRef}
                      className="modern-clinical-textarea"
                      style={{ minHeight: '90px' }}
                      placeholder="Onset, character, duration, aggravating / relieving factors, radiation, associated symptoms..."
                      value={formData.presentIllness}
                      onChange={(e) => setFormData({ ...formData, presentIllness: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: REVIEW OF SYSTEMS & PAST HISTORY */}
              <div className="note-form-card-section">
                <div className="section-badge-header">
                  <Activity size={16} color="var(--brand-teal)" />
                  <span>Review of Systems (ROS) &amp; Medical History</span>
                </div>

                {/* Specialty-Specific Quick-Pick Prompt Chips */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label className="clinical-field-label" style={{ marginBottom: 0 }}>
                      Review of Systems (ROS)
                    </label>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                      Click chips to insert specialty prompts:
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {(systemReviewPresets[specialtyMode] || systemReviewPresets.general).map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInsertSystemReviewChip(chip)}
                        className="copy-mini-btn"
                        style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  <div className="rich-editor-wrapper">
                    <RichTextToolbar
                      textareaRef={systemReviewsRef}
                      value={formData.systemReviews}
                      onChange={(val) => setFormData({ ...formData, systemReviews: val })}
                    />
                    <textarea
                      ref={systemReviewsRef}
                      className="modern-clinical-textarea"
                      style={{ minHeight: '80px' }}
                      placeholder="Cardiovascular, Respiratory, GI, Neurological system reviews..."
                      value={formData.systemReviews}
                      onChange={(e) => setFormData({ ...formData, systemReviews: e.target.value })}
                    />
                  </div>
                </div>

                <div className="clinical-field-block">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <label className="clinical-field-label" style={{ marginBottom: 0 }}>
                      Past Medical &amp; Surgical History
                    </label>
                    {isBaselineCarried && (
                      <span className="badge badge-success" style={{ fontSize: '0.675rem' }}>
                        Carried from last visit
                      </span>
                    )}
                  </div>
                  <div className="rich-editor-wrapper">
                    <RichTextToolbar
                      textareaRef={pastHistoryRef}
                      value={formData.pastHistory}
                      onChange={(val) => setFormData({ ...formData, pastHistory: val })}
                    />
                    <textarea
                      ref={pastHistoryRef}
                      className="modern-clinical-textarea"
                      style={{ minHeight: '75px' }}
                      placeholder="Past chronic illnesses, prior surgeries, hospital admissions..."
                      value={formData.pastHistory}
                      onChange={(e) => setFormData({ ...formData, pastHistory: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: BACKGROUND, ALLERGIES & LIFESTYLE */}
              <div className="note-form-card-section" style={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }}>
                <div className="section-badge-header">
                  <Users size={16} color="#6366f1" />
                  <span>Background, Allergies &amp; Lifestyle</span>
                </div>

                <div className="form-row">
                  <div className="clinical-field-block">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label className="clinical-field-label" style={{ color: '#b91c1c', marginBottom: 0 }}>
                        <ShieldAlert size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        Known Allergies &amp; Reactions
                      </label>
                      {isBaselineCarried && (
                        <span className="badge badge-danger" style={{ fontSize: '0.675rem' }}>
                          Verified Baseline
                        </span>
                      )}
                    </div>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={allergicHistoryRef}
                        value={formData.allergicHistory}
                        onChange={(val) => setFormData({ ...formData, allergicHistory: val })}
                      />
                      <textarea
                        ref={allergicHistoryRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '70px', borderColor: '#fca5a5' }}
                        placeholder="Drug allergies (e.g. Penicillin, NSAIDs), food, or environmental reactions"
                        value={formData.allergicHistory}
                        onChange={(e) => setFormData({ ...formData, allergicHistory: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="clinical-field-block">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label className="clinical-field-label" style={{ marginBottom: 0 }}>
                        Current Regular Medications
                      </label>
                      {isBaselineCarried && (
                        <span className="badge badge-success" style={{ fontSize: '0.675rem' }}>
                          Carried Baseline
                        </span>
                      )}
                    </div>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={presentMedicationRef}
                        value={formData.presentMedication}
                        onChange={(val) => setFormData({ ...formData, presentMedication: val })}
                      />
                      <textarea
                        ref={presentMedicationRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '70px' }}
                        placeholder="Prescription and OTC medications currently taken..."
                        value={formData.presentMedication}
                        onChange={(e) => setFormData({ ...formData, presentMedication: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="clinical-field-block">
                    <label className="clinical-field-label">Family Medical History</label>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={familyHistoryRef}
                        value={formData.familyHistory}
                        onChange={(val) => setFormData({ ...formData, familyHistory: val })}
                      />
                      <textarea
                        ref={familyHistoryRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '70px' }}
                        placeholder="Genetic predispositions, CAD, diabetes, hypertension in parents/siblings..."
                        value={formData.familyHistory}
                        onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="clinical-field-block">
                    <label className="clinical-field-label">Social History &amp; Habits</label>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={socialHistoryRef}
                        value={formData.socialHistory}
                        onChange={(val) => setFormData({ ...formData, socialHistory: val })}
                      />
                      <textarea
                        ref={socialHistoryRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '70px' }}
                        placeholder="Occupation, tobacco / smoking, alcohol, diet, physical activity..."
                        value={formData.socialHistory}
                        onChange={(e) => setFormData({ ...formData, socialHistory: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="clinical-field-block">
                    <label className="clinical-field-label">Vaccination History</label>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={vaccineHistoryRef}
                        value={formData.vaccineHistory}
                        onChange={(val) => setFormData({ ...formData, vaccineHistory: val })}
                      />
                      <textarea
                        ref={vaccineHistoryRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '65px' }}
                        placeholder="COVID-19, Tetanus booster, Hepatitis, Influenza..."
                        value={formData.vaccineHistory}
                        onChange={(e) => setFormData({ ...formData, vaccineHistory: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="clinical-field-block">
                    <label className="clinical-field-label">Birth &amp; Developmental History</label>
                    <div className="rich-editor-wrapper">
                      <RichTextToolbar
                        textareaRef={birthHistoryRef}
                        value={formData.birthHistory}
                        onChange={(val) => setFormData({ ...formData, birthHistory: val })}
                      />
                      <textarea
                        ref={birthHistoryRef}
                        className="modern-clinical-textarea"
                        style={{ minHeight: '65px' }}
                        placeholder="Pregnancy, delivery, gestational age (pediatric / obstetric)..."
                        value={formData.birthHistory}
                        onChange={(e) => setFormData({ ...formData, birthHistory: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Submit Controls */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => { setIsAdding(false); setEditingNoteId(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-cyan" style={{ padding: '10px 22px' }}>
                  Save Clinical Consultation Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Clinical History &amp; Consultations</h2>
          <p className="tab-desc">Chronological medical history records and progress notes.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleStartAdd}
        >
          <Plus size={15} />
          <span>New Consultation Note</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <FileText size={38} color="var(--text-dim)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>No clinical notes recorded</p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Add clinical notes to build the patient's longitudinal history.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 14 }}
            onClick={handleStartAdd}
          >
            + Add First Note
          </button>
        </div>
      ) : (
        notes.map((note, idx) => {
          const isLatest = idx === 0;
          const isCollapsed = !!collapsedNotes[note.id];

          return (
            <div key={note.id} className="timeline-card" style={{ overflow: 'hidden' }}>
              {/* Header Bar */}
              <div className="timeline-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '6px', borderRadius: 8, display: 'flex' }}>
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                        {note.formattedDate}
                      </span>
                      {isLatest && <span className="badge badge-latest">LATEST</span>}
                    </div>
                    <span style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                      Outpatient Clinical Consultation
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="collapse-toggle-btn"
                    onClick={() => toggleCollapse(note.id)}
                    title={isCollapsed ? 'Expand Note' : 'Collapse Note'}
                  >
                    {isCollapsed ? (
                      <>
                        <ChevronDown size={13} />
                        <span>Expand</span>
                      </>
                    ) : (
                      <>
                        <ChevronUp size={13} />
                        <span>Collapse</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleStartEdit(note)}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteTargetId(note.id)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* HERO CLINICAL NARRATIVE BLOCK */}
                  {(note.chiefComplaint || note.presentIllness) && (
                    <div className="clinical-hero-summary">
                      {note.chiefComplaint && (
                        <div style={{ marginBottom: note.presentIllness ? 12 : 0 }}>
                          <div className="clinical-hero-label">Chief Complaint</div>
                          <div className="clinical-hero-value">
                            <MarkdownView content={note.chiefComplaint} />
                          </div>
                        </div>
                      )}

                      {note.presentIllness && (
                        <div>
                          <div className="clinical-hero-label">History of Present Illness (HPI)</div>
                          <div style={{ fontSize: '0.9rem', color: '#1e293b', marginTop: 3 }}>
                            <MarkdownView content={note.presentIllness} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STRUCTURED MEDICAL GRID */}
                  <div className="clinical-details-grid">
                    {note.systemReviews && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Activity size={14} color="var(--brand-teal)" />
                          <span>Review of Systems</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.systemReviews} />
                        </div>
                      </div>
                    )}

                    {note.pastHistory && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <FileText size={14} color="#6366f1" />
                          <span>Past Medical &amp; Surgical History</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.pastHistory} />
                        </div>
                      </div>
                    )}

                    {note.allergicHistory && (
                      <div className="clinical-detail-card" style={{ borderColor: '#fecaca', background: '#fff5f5' }}>
                        <div className="detail-card-header" style={{ color: '#b91c1c' }}>
                          <ShieldAlert size={14} color="#b91c1c" />
                          <span>Known Allergies</span>
                        </div>
                        <div className="detail-card-content" style={{ color: '#7f1d1d' }}>
                          <MarkdownView content={note.allergicHistory} />
                        </div>
                      </div>
                    )}

                    {note.presentMedication && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Pill size={14} color="#d97706" />
                          <span>Current Regular Medications</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.presentMedication} />
                        </div>
                      </div>
                    )}

                    {note.vaccineHistory && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Syringe size={14} color="#0284c7" />
                          <span>Vaccination Records</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.vaccineHistory} />
                        </div>
                      </div>
                    )}

                    {note.familyHistory && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Users size={14} color="#4f46e5" />
                          <span>Family Medical History</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.familyHistory} />
                        </div>
                      </div>
                    )}

                    {note.socialHistory && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Briefcase size={14} color="#059669" />
                          <span>Social History &amp; Habits</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.socialHistory} />
                        </div>
                      </div>
                    )}

                    {note.birthHistory && (
                      <div className="clinical-detail-card">
                        <div className="detail-card-header">
                          <Baby size={14} color="#ec4899" />
                          <span>Birth &amp; Development</span>
                        </div>
                        <div className="detail-card-content">
                          <MarkdownView content={note.birthHistory} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Consultation Record"
        message="Are you sure you want to permanently delete this clinical consultation note from history?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
