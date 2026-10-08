import React, { useState, useMemo, useRef, useEffect } from 'react';
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
  Info,
  Star,
  Check,
  Search,
  BookmarkCheck,
  Layers,
  ChevronDown
} from 'lucide-react';
import {
  searchMedications,
  saveCustomMedication,
  getFavoriteMedications,
  toggleFavoriteMedication,
  getAllDiseaseBundles
} from '../../services/formularyService';
import {
  CLINICAL_SPECIALTIES,
  getSuggestedMedicationsForDiagnosis,
  getSuggestedBundlesForDiagnosis
} from '../../data/clinicalFormulary';

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
  const [selectedSpecialty, setSelectedSpecialty] = useState('cardiology');
  const [searchQueryMap, setSearchQueryMap] = useState({});
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [autoFilledIndices, setAutoFilledIndices] = useState({});
  const [showBundlesModal, setShowBundlesModal] = useState(false);

  const getTodayString = () => new Date().toISOString().slice(0, 10);

  const defaultSingleMed = {
    name: '',
    dose: '',
    doseType: 'Tablet',
    frequency: 'Once in morning',
    route: 'Oral',
    dateFrom: getTodayString(),
    days: 30,
    comment: ''
  };

  const [medsList, setMedsList] = useState([defaultSingleMed]);

  const medications = activePatient?.medications || [];

  // Extract patient clinical assessment / chief complaints / diagnosis text
  const patientDiagnosisText = useMemo(() => {
    if (!activePatient) return '';
    const note = activePatient.notes?.[0];
    const assessment = note?.clinicalAssessment || '';
    const complaints = note?.chiefComplaints || '';
    const impression = activePatient.impressionAdvice?.impression || '';
    return `${assessment} ${complaints} ${impression}`.trim();
  }, [activePatient]);

  // Diagnosis-aware suggested medications and bundles
  const suggestedMedications = useMemo(() => {
    return getSuggestedMedicationsForDiagnosis(patientDiagnosisText);
  }, [patientDiagnosisText]);

  const suggestedBundles = useMemo(() => {
    return getSuggestedBundlesForDiagnosis(patientDiagnosisText);
  }, [patientDiagnosisText]);

  // Specialty quick drugs
  const specialtyQuickDrugs = useMemo(() => {
    if (selectedSpecialty === 'favorites') {
      return getFavoriteMedications();
    }
    return searchMedications('', selectedSpecialty, 16);
  }, [selectedSpecialty]);

  const handleStartAdd = () => {
    setMedsList([{ ...defaultSingleMed, dateFrom: getTodayString() }]);
    setEditingMedId(null);
    setIsAdding(true);
    setActiveDropdownIndex(null);
    setAutoFilledIndices({});
  };

  const handleStartEdit = (med) => {
    setMedsList([{
      name: med.name || '',
      dose: med.dose || '',
      doseType: med.doseType || 'Tablet',
      frequency: med.frequency || 'Once daily',
      route: med.route || 'Oral',
      dateFrom: med.dateFrom || getTodayString(),
      days: med.days || 30,
      comment: med.comment || ''
    }]);
    setEditingMedId(med.id);
    setIsAdding(true);
    setActiveDropdownIndex(null);
    setAutoFilledIndices({});
  };

  const handleAddField = () => {
    setMedsList(prev => [...prev, { ...defaultSingleMed, dateFrom: getTodayString() }]);
  };

  // One-click apply preset to active item (or append new)
  const handleApplyPreset = (preset, targetIndex = null) => {
    setMedsList(prev => {
      const updated = [...prev];
      const idx = targetIndex !== null ? targetIndex : updated.length - 1;

      updated[idx] = {
        name: preset.name,
        dose: preset.dose || '',
        doseType: preset.doseType || 'Tablet',
        frequency: preset.frequency || 'Once daily',
        route: preset.route || 'Oral',
        days: preset.days || 30,
        comment: preset.comment || '',
        dateFrom: getTodayString()
      };
      return updated;
    });

    const target = targetIndex !== null ? targetIndex : medsList.length - 1;
    setAutoFilledIndices(prev => ({ ...prev, [target]: true }));
    setActiveDropdownIndex(null);
    showToast(`Loaded ${preset.name} with standard dose & instructions`);
  };

  // Load an entire multi-medication protocol bundle (e.g. Post-PCI CAD)
  const handleApplyBundle = (bundle) => {
    if (!bundle.medications || bundle.medications.length === 0) return;

    const newMeds = bundle.medications.map(m => ({
      name: m.name,
      dose: m.dose || '',
      doseType: m.doseType || 'Tablet',
      frequency: m.frequency || 'Once daily',
      route: m.route || 'Oral',
      days: m.days || 30,
      comment: m.comment || '',
      dateFrom: getTodayString()
    }));

    setMedsList(newMeds);
    setShowBundlesModal(false);
    showToast(`Loaded protocol bundle: ${bundle.title} (${newMeds.length} medications)`);
  };

  // Save current item as doctor custom preset
  const handleSaveToFormulary = (med) => {
    if (!med.name || !med.name.trim()) {
      showToast('Please enter medicine name before saving', 'error');
      return;
    }

    const saved = saveCustomMedication({
      name: med.name.trim(),
      dose: med.dose || '',
      doseType: med.doseType || 'Tablet',
      frequency: med.frequency || 'Once daily',
      route: med.route || 'Oral',
      days: med.days || 30,
      comment: med.comment || '',
      category: selectedSpecialty !== 'all' && selectedSpecialty !== 'favorites' ? selectedSpecialty : 'cardiology'
    });

    if (saved) {
      showToast(`⭐ Saved "${saved.name}" to your preset formulary!`);
    }
  };

  const handleRemoveField = (index) => {
    if (medsList.length <= 1) return;
    setMedsList(prev => prev.filter((_, idx) => idx !== index));
    setAutoFilledIndices(prev => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  const handleMedChange = (index, field, value) => {
    setMedsList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });

    if (field === 'name') {
      setSearchQueryMap(prev => ({ ...prev, [index]: value }));
      if (value.trim().length >= 1) {
        setActiveDropdownIndex(index);
      } else {
        setActiveDropdownIndex(null);
      }
    }
  };

  const doseTypeOptions = [
    'Tablet',
    'Capsule',
    'Syrup',
    'Sublingual Tablet',
    'Inhaler',
    'Injection',
    'Oral Softgel',
    'Sachet',
    'Cream',
    'Drops'
  ];

  const frequencyOptions = [
    'Once in morning',
    'Once in night',
    'Once daily',
    'Twice daily',
    '1-0-0 (OD)',
    '0-1-0 (OD)',
    '0-0-1 (OD)',
    '1-0-1 (BD)',
    '1-1-1 (TDS)',
    '3 times daily',
    '4 times daily',
    'Every 8 hours',
    'Every 12 hours',
    'SOS (as needed)',
    'Once every 15 days',
    'At bedtime'
  ];

  const routeOptions = [
    'Oral',
    'Sublingual',
    'Inhalation',
    'IV',
    'IM',
    'Topical',
    'Eye/Ear Drop'
  ];

  const handleSave = (e) => {
    e.preventDefault();

    const validMeds = medsList.filter(m => m.name && m.name.trim());
    if (validMeds.length === 0) {
      alert('Please enter medicine name');
      return;
    }

    // Automatically learn and save all prescribed medications into doctor's formulary database
    validMeds.forEach((m) => {
      saveCustomMedication({
        name: m.name.trim(),
        dose: m.dose || '',
        doseType: m.doseType || 'Tablet',
        frequency: m.frequency || 'Once daily',
        route: m.route || 'Oral',
        days: m.days || 30,
        comment: m.comment || '',
        category: selectedSpecialty !== 'all' && selectedSpecialty !== 'favorites' ? selectedSpecialty : 'cardiology'
      });
    });

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

  if (isAdding) {
    return (
      <div style={{ marginTop: 20 }}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {editingMedId ? 'Edit Prescription Item' : 'Add Medications to Prescription'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Type 2 letters (e.g. <strong>"Lo"</strong> or <strong>"Nex"</strong>) for smart autocomplete, or click a clinical preset below.
            </p>
          </div>

          {!editingMedId && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowBundlesModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <Layers size={15} color="var(--brand-cyan)" />
              <span>Browse Disease Protocols / Bundles</span>
            </button>
          )}
        </div>

        {/* Diagnosis-Aware Recommendation Banner */}
        {suggestedMedications.length > 0 && !editingMedId && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              marginBottom: 16
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.825rem', fontWeight: 800, color: '#15803d' }}>
                <Sparkles size={16} />
                <span>Suggested for Patient's Diagnosis:</span>
                <span style={{ fontWeight: 600, color: '#166534', background: '#dcfce7', padding: '1px 8px', borderRadius: 4 }}>
                  {patientDiagnosisText.slice(0, 50)}...
                </span>
              </div>

              {suggestedBundles.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleApplyBundle(suggestedBundles[0])}
                  className="btn btn-sm"
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5
                  }}
                >
                  <Layers size={13} />
                  <span>⚡ 1-Click Load Full Protocol ({suggestedBundles[0].title})</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestedMedications.slice(0, 8).map((sug) => (
                <button
                  key={sug.id}
                  type="button"
                  onClick={() => handleApplyPreset(sug)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #86efac',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.775rem',
                    fontWeight: 700,
                    color: '#166534',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>+ {sug.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#15803d', opacity: 0.85 }}>({sug.dose})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Multi-Specialty Quick Presets Tabs & Pills */}
        <div className="card" style={{ padding: '14px 16px', marginBottom: 20, background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)' }}>
              <BookmarkCheck size={15} />
              <span>Routine Clinical Presets &amp; Favorites:</span>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
              Click any medication to auto-populate
            </div>
          </div>

          {/* Specialty Category Tabs */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10 }}>
            {CLINICAL_SPECIALTIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedSpecialty(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: selectedSpecialty === cat.id ? '1px solid var(--brand-cyan)' : '1px solid var(--border-subtle)',
                  background: selectedSpecialty === cat.id ? 'var(--brand-cyan-light)' : '#ffffff',
                  color: selectedSpecialty === cat.id ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: selectedSpecialty === cat.id ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedSpecialty('favorites')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedSpecialty === 'favorites' ? '1px solid #f59e0b' : '1px solid var(--border-subtle)',
                background: selectedSpecialty === 'favorites' ? '#fef3c7' : '#ffffff',
                color: selectedSpecialty === 'favorites' ? '#b45309' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: selectedSpecialty === 'favorites' ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Star size={13} fill={selectedSpecialty === 'favorites' ? '#f59e0b' : 'none'} color="#f59e0b" />
              <span>Doctor Favorites</span>
            </button>
          </div>

          {/* Preset Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {specialQuickDrugs.map((preset) => (
              <button
                key={preset.id || preset.name}
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.775rem', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}
                onClick={() => handleApplyPreset(preset)}
                title={`Formulation: ${preset.doseType}, Frequency: ${preset.frequency}, Route: ${preset.route}`}
              >
                <span>+ {preset.name}</span>
                {preset.dose && <span style={{ color: 'var(--brand-cyan)', fontWeight: 700 }}>{preset.dose}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Prescription Form */}
        <form onSubmit={handleSave}>
          {medsList.map((med, index) => {
            const currentQuery = searchQueryMap[index] || med.name || '';
            const searchSuggestions = activeDropdownIndex === index
              ? searchMedications(currentQuery, 'all', 8)
              : [];

            return (
              <div
                key={index}
                className="card"
                style={{
                  position: 'relative',
                  marginBottom: 20,
                  border: autoFilledIndices[index] ? '1.5px solid #38bdf8' : '1px solid var(--border-subtle)'
                }}
              >
                {/* Header row for item */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)' }}>
                      Medication #{index + 1}
                    </span>
                    {autoFilledIndices[index] && (
                      <span style={{ fontSize: '0.7rem', color: '#0369a1', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Check size={12} color="#0284c7" />
                        <span>Standard dosage &amp; timing auto-filled</span>
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleSaveToFormulary(med)}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.725rem', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 4 }}
                      title="Save this medicine with current dosage into your personal presets"
                    >
                      <Star size={12} color="#f59e0b" />
                      <span>Save as Preset</span>
                    </button>

                    {!editingMedId && medsList.length > 1 && (
                      <button
                        type="button"
                        className="btn-outline btn-sm"
                        style={{ padding: '3px 8px' }}
                        onClick={() => handleRemoveField(index)}
                      >
                        <X size={13} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  {/* Medicine Name with Smart Autocomplete */}
                  <div className="form-group" style={{ position: 'relative' }}>
                    <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Medicine / Brand Name *</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Type name for suggestions</span>
                    </label>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Loprin, Nexum, Crestat, Concor, Augmentin"
                        value={med.name}
                        onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                        onFocus={() => {
                          if ((med.name || '').trim().length >= 1) {
                            setActiveDropdownIndex(index);
                          }
                        }}
                        required
                        autoComplete="off"
                        style={{ paddingRight: 32 }}
                      />
                      <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>

                    {/* Floating Autocomplete Dropdown */}
                    {activeDropdownIndex === index && searchSuggestions.length > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 999,
                          background: '#ffffff',
                          border: '1.5px solid var(--brand-cyan)',
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                          marginTop: 4,
                          maxHeight: '260px',
                          overflowY: 'auto'
                        }}
                      >
                        <div style={{ padding: '6px 10px', fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Matching Clinical Formulary:</span>
                          <button
                            type="button"
                            onClick={() => setActiveDropdownIndex(null)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
                          >
                            Close ✕
                          </button>
                        </div>

                        {searchSuggestions.map((sug) => (
                          <div
                            key={sug.id || sug.name}
                            onClick={() => handleApplyPreset(sug, index)}
                            style={{
                              padding: '8px 12px',
                              borderBottom: '1px solid #f1f5f9',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background 0.1s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f9ff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span>{sug.name}</span>
                                {sug.isCustom && (
                                  <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#b45309', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                                    ⭐ Doctor Preset
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.725rem', color: '#64748b', display: 'flex', gap: 6 }}>
                                <span>{sug.doseType}</span>
                                <span>•</span>
                                <span>{sug.frequency}</span>
                                {sug.comment && (
                                  <>
                                    <span>•</span>
                                    <span style={{ color: '#0369a1' }}>{sug.comment}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--brand-cyan)', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4 }}>
                                {sug.dose}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Strength / Dose */}
                  <div className="form-group">
                    <label className="form-label">Strength / Dose</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 75 mg, 40 mg, 10 ml"
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
                      placeholder="e.g. 30"
                      value={med.days}
                      onChange={(e) => handleMedChange(index, 'days', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Patient Instructions / Timing</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Take 30 mins before breakfast on an empty stomach"
                      value={med.comment}
                      onChange={(e) => handleMedChange(index, 'comment', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

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

      {/* Disease Protocols / Bundles Modal */}
      {showBundlesModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowBundlesModal(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Layers size={20} color="var(--brand-cyan)" />
                  <span>Clinical Disease Protocols &amp; Regimens</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>
                  Load complete, guideline-directed multi-drug regimens with 1 click.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBundlesModal(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', padding: 6 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {getAllDiseaseBundles().map((bundle) => (
                <div
                  key={bundle.id}
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 10 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        {bundle.title}
                      </h4>
                      <p style={{ margin: '2px 0 0 0', fontSize: '0.775rem', color: '#64748b' }}>
                        {bundle.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.775rem', padding: '5px 12px', whiteSpace: 'nowrap' }}
                      onClick={() => handleApplyBundle(bundle)}
                    >
                      ⚡ Load Regimen
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    {bundle.medications.map((m, mIdx) => (
                      <span
                        key={mIdx}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.725rem',
                          color: '#334155',
                          fontWeight: 600
                        }}
                      >
                        💊 <strong>{m.name}</strong> ({m.dose}) - {m.frequency}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
