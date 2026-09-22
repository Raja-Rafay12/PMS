import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Edit3,
  Trash2,
  Pill,
  X,
  Clock,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export const MedicationsTab = () => {
  const {
    activePatient,
    addMedications,
    updateMedication,
    deleteMedication,
    showToast
  } = usePatients();

  const [isAdding, setIsAdding] = useState(false);
  const [editingMedId, setEditingMedId] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const getTodayString = () => new Date().toISOString().slice(0, 10);

  const defaultSingleMed = {
    name: '',
    dose: '',
    doseType: 'Tablet',
    frequency: 'Twice daily',
    route: 'Oral',
    dateFrom: getTodayString(),
    days: 5,
    comment: ''
  };

  const [medsList, setMedsList] = useState([defaultSingleMed]);

  const quickDrugPresets = [
    { name: 'Panadol (Paracetamol)', dose: '500 mg', doseType: 'Tablet', frequency: '3 times daily', route: 'Oral', days: 3, comment: 'After meals for pain or fever' },
    { name: 'Amoxicillin', dose: '500 mg', doseType: 'Capsule', frequency: '3 times daily', route: 'Oral', days: 5, comment: 'Complete full course with water' },
    { name: 'Augmentin (Co-Amoxiclav)', dose: '625 mg', doseType: 'Tablet', frequency: 'Twice daily', route: 'Oral', days: 5, comment: 'Take at start of meals' },
    { name: 'Omeprazole (Risek)', dose: '20 mg', doseType: 'Capsule', frequency: 'Once daily', route: 'Oral', days: 14, comment: 'Take 30 mins before breakfast' },
    { name: 'Acefyl Cough Syrup', dose: '10 ml', doseType: 'Syrup', frequency: '3 times daily', route: 'Oral', days: 5, comment: 'Shake well before use' },
    { name: 'Cetirizine (Zyrtec)', dose: '10 mg', doseType: 'Tablet', frequency: 'Once daily', route: 'Oral', days: 7, comment: 'Take at bedtime' }
  ];

  const medications = activePatient?.medications || [];

  const handleStartAdd = () => {
    setMedsList([{ ...defaultSingleMed, dateFrom: getTodayString() }]);
    setEditingMedId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (med) => {
    setMedsList([{
      name: med.name || '',
      dose: med.dose || '',
      doseType: med.doseType || 'Tablet',
      frequency: med.frequency || 'Twice daily',
      route: med.route || 'Oral',
      dateFrom: med.dateFrom || getTodayString(),
      days: med.days || 5,
      comment: med.comment || ''
    }]);
    setEditingMedId(med.id);
    setIsAdding(true);
  };

  const handleAddField = () => {
    setMedsList(prev => [...prev, { ...defaultSingleMed, dateFrom: getTodayString() }]);
  };

  const handleApplyPreset = (preset) => {
    setMedsList(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...preset,
        dateFrom: getTodayString()
      };
      return updated;
    });
    showToast(`Loaded preset: ${preset.name}`);
  };

  const handleRemoveField = (index) => {
    if (medsList.length <= 1) return;
    setMedsList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleMedChange = (index, field, value) => {
    setMedsList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const validMeds = medsList.filter(m => m.name && m.name.trim());
    if (validMeds.length === 0) {
      alert('Please enter medicine name');
      return;
    }

    if (editingMedId) {
      updateMedication(activePatient.id, editingMedId, validMeds[0]);
    } else {
      addMedications(activePatient.id, validMeds);
    }

    setIsAdding(false);
    setEditingMedId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteMedication(activePatient.id, deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const doseTypeOptions = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Sachet'];
  const frequencyOptions = ['Once daily', 'Twice daily', '3 times daily', '4 times daily', 'Every 6 hours', 'As needed (PRN)', 'At bedtime'];
  const routeOptions = ['Oral', 'IV', 'IM', 'Topical', 'Sublingual', 'Inhalation', 'Eye/Ear Drop'];

  if (isAdding) {
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            {editingMedId ? 'Edit Prescription Item' : 'Add Medications to Prescription'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Select from clinical quick presets or enter customized formulation, route and dosage.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="card" style={{ padding: '14px 18px', marginBottom: 20, background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-cyan)', marginBottom: 10 }}>
            <Sparkles size={14} />
            <span>Quick Prescription Presets:</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {quickDrugPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.775rem', padding: '4px 10px' }}
                onClick={() => handleApplyPreset(preset)}
              >
                + {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSave}>
          {medsList.map((med, index) => (
            <div key={index} className="card" style={{ position: 'relative', marginBottom: 20 }}>
              {!editingMedId && medsList.length > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-cyan)' }}>
                    Item #{index + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => handleRemoveField(index)}
                  >
                    <X size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Medicine / Brand Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Amoxicillin, Panadol, Lipitor"
                    value={med.name}
                    onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Strength / Dose</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 500 mg, 10 ml, 20 mg"
                    value={med.dose}
                    onChange={(e) => handleMedChange(index, 'dose', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Formulation</label>
                  <select
                    className="form-select"
                    value={med.doseType}
                    onChange={(e) => handleMedChange(index, 'doseType', e.target.value)}
                  >
                    {doseTypeOptions.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Dosage Frequency</label>
                  <select
                    className="form-select"
                    value={med.frequency}
                    onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                  >
                    {frequencyOptions.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Administration Route</label>
                  <select
                    className="form-select"
                    value={med.route}
                    onChange={(e) => handleMedChange(index, 'route', e.target.value)}
                  >
                    {routeOptions.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 5"
                    value={med.days}
                    onChange={(e) => handleMedChange(index, 'days', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Patient Instructions / Timing</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Take after breakfast and dinner with water"
                    value={med.comment}
                    onChange={(e) => handleMedChange(index, 'comment', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          {!editingMedId && (
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: 20 }}
              onClick={handleAddField}
            >
              <Plus size={16} />
              <span>Add Another Medicine to this Prescription</span>
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsAdding(false);
                setEditingMedId(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMedId ? 'Update Medication' : 'Save Prescription'}
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
          <h2 className="tab-title">Active Prescriptions (Rx)</h2>
          <p className="tab-desc">Current medication regimen prescribed for this patient.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleStartAdd}
        >
          <Plus size={15} />
          <span>Prescribe Medicine</span>
        </button>
      </div>

      {medications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Pill size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No active medications prescribed</p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Add clinical drugs or prescriptions with schedule and route.</p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 14 }}
            onClick={handleStartAdd}
          >
            + Add First Medication
          </button>
        </div>
      ) : (
        medications.map((med) => (
          <div key={med.id} className="med-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div className="med-icon-badge">
                <Pill size={22} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {med.name}
                  </span>
                  {med.dose && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-cyan)', background: '#e0f2fe', padding: '1px 8px', borderRadius: 4 }}>
                      {med.dose}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', background: 'var(--bg-muted)', padding: '2px 8px', borderRadius: 9999, color: 'var(--text-muted)', fontWeight: 600 }}>
                    {med.doseType}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} color="var(--brand-teal)" />
                    <strong>{med.frequency}</strong> ({med.route})
                  </span>
                  {med.days && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={13} color="var(--brand-cyan)" />
                      <span>{med.days} days duration</span>
                    </span>
                  )}
                </div>

                {med.comment && (
                  <div style={{ fontSize: '0.8rem', color: '#0369a1', marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Info size={13} />
                    <span>Instructions: {med.comment}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => handleStartEdit(med)}
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setDeleteTargetId(med.id)}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))
      )}

      <ConfirmModal
        isOpen={!!deleteTargetId}
        title="Remove Medication"
        message="Are you sure you want to discontinue and delete this medication from the patient's records?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
