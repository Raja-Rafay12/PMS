import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Edit3,
  Trash2,
  Activity,
  Heart,
  Wind,
  Thermometer,
  Scale,
  Droplets,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const ExaminationTab = () => {
  const {
    activePatient,
    addExamination,
    updateExamination,
    deleteExamination
  } = usePatients();

  const [isAdding, setIsAdding] = useState(false);
  const [editingExamId, setEditingExamId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [collapsedExams, setCollapsedExams] = useState({});

  const defaultVitals = {
    bpSystolic: '',
    bpDiastolic: '',
    pulse: '',
    respiratoryRate: '',
    temperature: '',
    weight: '',
    spO2: '',
    bloodSugar: ''
  };

  const defaultFindings = {
    general: '',
    skin: '',
    headNeck: '',
    lymphNodes: '',
    breast: '',
    throatLungs: '',
    abdomen: '',
    pelvicGenitalia: '',
    rectal: '',
    extremities: '',
    musculoskeletal: '',
    clubbing: '',
    pallor: '',
    jaundice: '',
    cyanosis: ''
  };

  const [vitals, setVitals] = useState(defaultVitals);
  const [findings, setFindings] = useState(defaultFindings);

  const exams = activePatient?.examinations || [];

  const handleStartAdd = () => {
    setVitals(defaultVitals);
    setFindings(defaultFindings);
    setEditingExamId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (exam) => {
    setVitals({
      bpSystolic: exam.vitals?.bpSystolic ?? '',
      bpDiastolic: exam.vitals?.bpDiastolic ?? '',
      pulse: exam.vitals?.pulse ?? '',
      respiratoryRate: exam.vitals?.respiratoryRate ?? '',
      temperature: exam.vitals?.temperature ?? '',
      weight: exam.vitals?.weight ?? '',
      spO2: exam.vitals?.spO2 ?? '',
      bloodSugar: exam.vitals?.bloodSugar ?? ''
    });
    setFindings({
      general: exam.findings?.general || '',
      skin: exam.findings?.skin || '',
      headNeck: exam.findings?.headNeck || '',
      lymphNodes: exam.findings?.lymphNodes || '',
      breast: exam.findings?.breast || '',
      throatLungs: exam.findings?.throatLungs || '',
      abdomen: exam.findings?.abdomen || '',
      pelvicGenitalia: exam.findings?.pelvicGenitalia || '',
      rectal: exam.findings?.rectal || '',
      extremities: exam.findings?.extremities || '',
      musculoskeletal: exam.findings?.musculoskeletal || '',
      clubbing: exam.findings?.clubbing || '',
      pallor: exam.findings?.pallor || '',
      jaundice: exam.findings?.jaundice || '',
      cyanosis: exam.findings?.cyanosis || ''
    });
    setEditingExamId(exam.id);
    setIsAdding(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const examData = {
      vitals,
      findings
    };

    if (editingExamId) {
      updateExamination(activePatient.id, editingExamId, examData);
    } else {
      addExamination(activePatient.id, examData);
    }

    setIsAdding(false);
    setEditingExamId(null);
  };

  const toggleCollapse = (id) => {
    setCollapsedExams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteExamination(activePatient.id, deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const getBPStatus = (sys, dia) => {
    if (!sys && !dia) return null;
    const s = Number(sys) || 120;
    const d = Number(dia) || 80;
    if (s < 120 && d < 80) return { label: 'Optimal', class: 'vital-normal' };
    if (s <= 129 && d < 80) return { label: 'Elevated', class: 'vital-warning' };
    if (s >= 140 || d >= 90) return { label: 'High (Stage 1-2)', class: 'vital-alert' };
    return { label: 'Normal', class: 'vital-normal' };
  };

  const getSpO2Status = (val) => {
    if (!val) return null;
    const n = Number(val);
    if (n >= 95) return { label: 'Normal', class: 'vital-normal' };
    if (n >= 90) return { label: 'Low', class: 'vital-warning' };
    return { label: 'Hypoxic Alert', class: 'vital-alert' };
  };

  const getPulseStatus = (val) => {
    if (!val) return null;
    const n = Number(val);
    if (n >= 60 && n <= 100) return { label: 'Normal Rhythm', class: 'vital-normal' };
    if (n > 100) return { label: 'Tachycardia', class: 'vital-warning' };
    return { label: 'Bradycardia', class: 'vital-warning' };
  };

  if (isAdding) {
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {editingExamId ? 'Edit Physical Examination' : 'Add Physical Examination'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Record patient vital signs and detailed 14-point physiological findings.
          </p>
        </div>

        <form onSubmit={handleSave} className="card">
          {/* VITALS SECTION */}
          <div className="form-section">
            <h3 className="form-section-title">Vital Signs Matrix</h3>

            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">BP Systolic (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 120"
                  value={vitals.bpSystolic}
                  onChange={(e) => setVitals({ ...vitals, bpSystolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">BP Diastolic (mmHg)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 80"
                  value={vitals.bpDiastolic}
                  onChange={(e) => setVitals({ ...vitals, bpDiastolic: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Heart Rate / Pulse (bpm)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 72"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Respiratory Rate (/min)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 18"
                  value={vitals.respiratoryRate}
                  onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">Temperature (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 37.0"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  placeholder="e.g. 74"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SpO₂ (%)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 98"
                  value={vitals.spO2}
                  onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 104"
                  value={vitals.bloodSugar}
                  onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* EXAMINATION FINDINGS SECTION */}
          <div className="form-section">
            <h3 className="form-section-title">Physical Findings (14 Systems)</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">General Appearance</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Alert, conscious, in no acute distress..."
                  value={findings.general}
                  onChange={(e) => setFindings({ ...findings, general: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Skin &amp; Integument</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Normal turgor, no rash or petechiae..."
                  value={findings.skin}
                  onChange={(e) => setFindings({ ...findings, skin: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Head &amp; Neck</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Normocephalic, no thyroid enlargement..."
                  value={findings.headNeck}
                  onChange={(e) => setFindings({ ...findings, headNeck: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lymph Nodes</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="No cervical or supraclavicular lymphadenopathy..."
                  value={findings.lymphNodes}
                  onChange={(e) => setFindings({ ...findings, lymphNodes: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Throat &amp; Lungs (Respiratory)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Clear vesicular breath sounds, no wheezing..."
                  value={findings.throatLungs}
                  onChange={(e) => setFindings({ ...findings, throatLungs: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Abdomen</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Soft, non-tender, active bowel sounds..."
                  value={findings.abdomen}
                  onChange={(e) => setFindings({ ...findings, abdomen: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Extremities (Peripheries)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="No pedal edema, peripheral pulses intact..."
                  value={findings.extremities}
                  onChange={(e) => setFindings({ ...findings, extremities: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Musculoskeletal</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Full range of motion, no deformities..."
                  value={findings.musculoskeletal}
                  onChange={(e) => setFindings({ ...findings, musculoskeletal: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row-4">
              <div className="form-group">
                <label className="form-label">Pallor</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Absent / Mild"
                  value={findings.pallor}
                  onChange={(e) => setFindings({ ...findings, pallor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jaundice</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Absent / Present"
                  value={findings.jaundice}
                  onChange={(e) => setFindings({ ...findings, jaundice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cyanosis</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Absent / Present"
                  value={findings.cyanosis}
                  onChange={(e) => setFindings({ ...findings, cyanosis: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Clubbing</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Absent / Grade"
                  value={findings.clubbing}
                  onChange={(e) => setFindings({ ...findings, clubbing: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAdding(false);
                setEditingExamId(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Examination Record
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
          <h2 className="tab-title">Physical Examination &amp; Vitals</h2>
          <p className="tab-desc">Monitor physiological indicators and clinical exam notes.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleStartAdd}
        >
          <Plus size={15} />
          <span>Record Examination</span>
        </button>
      </div>

      {exams.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Activity size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No examinations on file</p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Record patient vitals to track their clinical trend.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 14 }}
            onClick={handleStartAdd}
          >
            + Record First Exam
          </button>
        </div>
      ) : (
        exams.map((exam, idx) => {
          const isLatest = idx === 0;
          const isCollapsed = !!collapsedExams[exam.id];
          const bpStatus = getBPStatus(exam.vitals?.bpSystolic, exam.vitals?.bpDiastolic);
          const pulseStatus = getPulseStatus(exam.vitals?.pulse);
          const spo2Status = getSpO2Status(exam.vitals?.spO2);

          return (
            <div key={exam.id} className="timeline-card">
              <div className="timeline-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {exam.formattedDate}
                  </span>
                  {isLatest && <span className="badge badge-latest">LATEST</span>}
                  <button
                    type="button"
                    className="collapse-toggle-btn"
                    onClick={() => toggleCollapse(exam.id)}
                    title={isCollapsed ? 'Expand Examination Details' : 'Collapse Details'}
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
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleStartEdit(exam)}
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setDeleteTargetId(exam.id)}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div>
                  {/* Modern Vitals Cards Grid */}
                  <div className="vitals-cards-grid">
                    {/* Blood Pressure */}
                    {exam.vitals?.bpSystolic && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Blood Pressure</span>
                          <Activity size={16} color="#0284c7" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.bpSystolic}/{exam.vitals.bpDiastolic || '80'}</span>
                          <span className="vital-reading-unit">mmHg</span>
                        </div>
                        {bpStatus && (
                          <span className={`vital-status-pill ${bpStatus.class}`}>
                            {bpStatus.label}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Heart Rate / Pulse */}
                    {exam.vitals?.pulse && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Heart Rate</span>
                          <Heart size={16} color="#ef4444" fill="#fee2e2" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.pulse}</span>
                          <span className="vital-reading-unit">bpm</span>
                        </div>
                        {pulseStatus && (
                          <span className={`vital-status-pill ${pulseStatus.class}`}>
                            {pulseStatus.label}
                          </span>
                        )}
                      </div>
                    )}

                    {/* SpO2 */}
                    {exam.vitals?.spO2 && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Oxygen Sat. (SpO₂)</span>
                          <Wind size={16} color="#0d9488" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.spO2}</span>
                          <span className="vital-reading-unit">%</span>
                        </div>
                        {spo2Status && (
                          <span className={`vital-status-pill ${spo2Status.class}`}>
                            {spo2Status.label}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Temperature */}
                    {exam.vitals?.temperature && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Body Temp</span>
                          <Thermometer size={16} color="#f59e0b" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.temperature}</span>
                          <span className="vital-reading-unit">°C</span>
                        </div>
                        <span className="vital-status-pill vital-normal">
                          {Number(exam.vitals.temperature) > 37.5 ? 'Pyrexia' : 'Afebrile'}
                        </span>
                      </div>
                    )}

                    {/* Weight */}
                    {exam.vitals?.weight && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Body Weight</span>
                          <Scale size={16} color="#6366f1" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.weight}</span>
                          <span className="vital-reading-unit">kg</span>
                        </div>
                      </div>
                    )}

                    {/* Blood Sugar */}
                    {exam.vitals?.bloodSugar && (
                      <div className="vital-metric-card">
                        <div className="vital-metric-header">
                          <span className="vital-metric-title">Blood Sugar (RBS)</span>
                          <Droplets size={16} color="#ec4899" />
                        </div>
                        <div className="vital-metric-reading">
                          <span className="vital-reading-value">{exam.vitals.bloodSugar}</span>
                          <span className="vital-reading-unit">mg/dL</span>
                        </div>
                        <span className={`vital-status-pill ${Number(exam.vitals.bloodSugar) > 140 ? 'vital-warning' : 'vital-normal'}`}>
                          {Number(exam.vitals.bloodSugar) > 140 ? 'Elevated' : 'Normal'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Grouped Examination Findings */}
                  {exam.findings && Object.entries(exam.findings).some(([_, val]) => val && val.trim()) && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em', marginBottom: 10 }}>
                        Clinical Observations
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
                        {Object.entries(exam.findings).map(([key, val]) => {
                          if (!val || !val.trim()) return null;
                          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          return (
                            <div
                              key={key}
                              style={{
                                background: '#f8fafc',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: '10px 14px'
                              }}
                            >
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-cyan)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                {formattedKey}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', marginTop: 3 }}>
                                {val}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Examination Record"
        message="Are you sure you want to delete this vital signs and physical examination entry?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
