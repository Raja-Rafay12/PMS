import React, { useState, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { RichTextToolbar } from '../common/RichTextToolbar';
import { MarkdownView } from '../common/MarkdownView';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Edit3,
  Trash2,
  Stethoscope,
  Clock,
  AlertCircle,
  FileText,
  Activity,
  Calendar,
  Users,
  Briefcase,
  Pill,
  Baby,
  Syringe,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const HistoryTab = () => {
  const {
    activePatient,
    addClinicalNote,
    updateClinicalNote,
    deleteClinicalNote,
    showToast
  } = usePatients();

  const [isAdding, setIsAdding] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [collapsedNotes, setCollapsedNotes] = useState({});

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

  const handleStartAdd = () => {
    setFormData(defaultFormData);
    setEditingNoteId(null);
    setIsAdding(true);
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

  if (isAdding) {
    return (
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {editingNoteId ? 'Edit Clinical Consultation Note' : 'New Clinical Consultation Note'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Structured medical assessment. Empty sections are automatically omitted from final records.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { setIsAdding(false); setEditingNoteId(null); }}
          >
            Cancel
          </button>
        </div>

        <form onSubmit={handleSave} className="card" style={{ padding: '28px' }}>
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
                  placeholder="What brings the patient in today? e.g. Severe dry cough for 2 months, exacerbated at night"
                  value={formData.chiefComplaint}
                  onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
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
                  placeholder="Onset, character, duration, aggravating / relieving factors, associated symptoms..."
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

            <div className="clinical-field-block">
              <label className="clinical-field-label">Review of Systems (ROS)</label>
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
                  placeholder="Cardiovascular, Respiratory, GI, Neurological review..."
                  value={formData.systemReviews}
                  onChange={(e) => setFormData({ ...formData, systemReviews: e.target.value })}
                />
              </div>
            </div>

            <div className="clinical-field-block">
              <label className="clinical-field-label">Past Medical &amp; Surgical History</label>
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
                  placeholder="Past illnesses, previous hospitalisations, prior surgeries with dates..."
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
                <label className="clinical-field-label" style={{ color: '#b91c1c' }}>
                  <ShieldAlert size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                  Known Allergies &amp; Reactions
                </label>
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
                    placeholder="Drug (e.g. Penicillin), food, or environmental allergies and reaction type"
                    value={formData.allergicHistory}
                    onChange={(e) => setFormData({ ...formData, allergicHistory: e.target.value })}
                  />
                </div>
              </div>

              <div className="clinical-field-block">
                <label className="clinical-field-label">Current Regular Medications</label>
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
                    placeholder="Genetic predispositions, diabetes, hypertension in parents/siblings..."
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28, paddingTop: 18, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => { setIsAdding(false); setEditingNoteId(null); }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-cyan">
              Save Clinical Consultation Note
            </button>
          </div>
        </form>
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
