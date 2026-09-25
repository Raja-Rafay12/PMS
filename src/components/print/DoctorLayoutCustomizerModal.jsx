import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  FileText,
  Building2,
  Sliders,
  UserCheck,
  Plus,
  Trash2,
  Clock
} from 'lucide-react';
import {
  LetterheadLayoutBuilder,
  DEFAULT_HEADER_SECTIONS
} from '../admin/LetterheadLayoutBuilder';
import {
  PrescriptionLayoutBuilder,
  DEFAULT_PRESCRIPTION_SECTIONS,
  PRESCRIPTION_PRESETS
} from '../admin/PrescriptionLayoutBuilder';

export const DoctorLayoutCustomizerModal = ({
  isOpen,
  onClose,
  doctorId,
  doctorName = 'Physician',
  currentLetterhead = {},
  onSave
}) => {
  if (!isOpen) return null;

  // Active tab in modal: 'prescription' | 'header' | 'credentials'
  const [activeTab, setActiveTab] = useState('prescription');

  // Working copy of letterhead configuration
  const [formState, setFormState] = useState(() => {
    return {
      enabled: true,
      doctorName: currentLetterhead.doctorName || doctorName || '',
      qualifications: currentLetterhead.qualifications || 'MBBS, FCPS',
      pmcNumber: currentLetterhead.regNumber || currentLetterhead.pmcNumber || '',
      specialtyTitle: currentLetterhead.specialtyTitle || '',
      clinicName: currentLetterhead.clinicName || 'PatientCare Medical Center',
      tagline: currentLetterhead.tagline || '',
      address: currentLetterhead.address || '',
      phone: currentLetterhead.phone || '',
      email: currentLetterhead.email || '',
      consultationHours: currentLetterhead.consultationHours || '',
      footerNote: currentLetterhead.footerNote || 'Bring previous prescription and diagnostic reports on follow-up.',
      headerSections: (Array.isArray(currentLetterhead.headerSections) && currentLetterhead.headerSections.length > 0)
        ? currentLetterhead.headerSections
        : DEFAULT_HEADER_SECTIONS,
      prescriptionSections: (Array.isArray(currentLetterhead.prescriptionSections) && currentLetterhead.prescriptionSections.length > 0)
        ? currentLetterhead.prescriptionSections
        : DEFAULT_PRESCRIPTION_SECTIONS,
      locations: (Array.isArray(currentLetterhead.locations) && currentLetterhead.locations.length > 0)
        ? currentLetterhead.locations
        : [
            {
              id: 'loc-1',
              hospitalName: currentLetterhead.clinicName || 'PatientCare Medical Center',
              department: currentLetterhead.address || '',
              consultationHours: currentLetterhead.consultationHours || 'Mon - Sat: 2:00 PM - 7:00 PM',
              phone: currentLetterhead.phone || '+92 300 0000000'
            }
          ]
    };
  });

  const handleApplyPreset = (preset) => {
    const generatedSections = preset.generate();
    setFormState(prev => ({
      ...prev,
      prescriptionSections: generatedSections
    }));
  };

  const handleAddLocation = () => {
    const newLoc = {
      id: `loc-${Date.now()}`,
      hospitalName: '',
      department: '',
      consultationHours: '',
      phone: ''
    };
    setFormState(prev => ({
      ...prev,
      locations: [...prev.locations, newLoc]
    }));
  };

  const handleRemoveLocation = (id) => {
    if (formState.locations.length <= 1) return;
    setFormState(prev => ({
      ...prev,
      locations: prev.locations.filter(l => l.id !== id)
    }));
  };

  const handleLocationChange = (id, field, value) => {
    setFormState(prev => ({
      ...prev,
      locations: prev.locations.map(l => (l.id === id ? { ...l, [field]: value } : l))
    }));
  };

  const handleSave = () => {
    onSave({
      ...formState,
      enabled: true
    });
    onClose();
  };

  return (
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--bg-card, #ffffff)',
          color: 'var(--text-primary, #0f172a)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-page, #f8fafc)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: '8px',
                background: 'var(--brand-cyan-light, #e0f2fe)',
                color: 'var(--brand-cyan, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sliders size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>
                Customize Layout &amp; Letterhead
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)' }}>
                Configuring layout for <strong style={{ color: 'var(--brand-cyan, #0284c7)' }}>{formState.doctorName || 'Doctor'}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted, #64748b)',
              padding: 6,
              borderRadius: 6,
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
            background: 'var(--bg-card, #ffffff)',
            padding: '0 20px',
            gap: 12
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('prescription')}
            style={{
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'prescription' ? '2px solid var(--brand-cyan, #0284c7)' : '2px solid transparent',
              color: activeTab === 'prescription' ? 'var(--brand-cyan, #0284c7)' : 'var(--text-muted, #64748b)',
              fontWeight: activeTab === 'prescription' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <FileText size={16} />
            <span>Prescription Body &amp; Rx Layout</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('header')}
            style={{
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'header' ? '2px solid var(--brand-cyan, #0284c7)' : '2px solid transparent',
              color: activeTab === 'header' ? 'var(--brand-cyan, #0284c7)' : 'var(--text-muted, #64748b)',
              fontWeight: activeTab === 'header' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Building2 size={16} />
            <span>Header Branding Layout</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            style={{
              padding: '12px 14px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'credentials' ? '2px solid var(--brand-cyan, #0284c7)' : '2px solid transparent',
              color: activeTab === 'credentials' ? 'var(--brand-cyan, #0284c7)' : 'var(--text-muted, #64748b)',
              fontWeight: activeTab === 'credentials' ? 800 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <UserCheck size={16} />
            <span>Credentials &amp; Chambers</span>
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Tab 1: Prescription Body Layout */}
          {activeTab === 'prescription' && (
            <div>
              {/* Quick Presets Strip */}
              <div
                style={{
                  background: 'var(--bg-page, #f8fafc)',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} color="var(--brand-cyan, #0284c7)" />
                  <span>1-Click Layout Presets</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {PRESCRIPTION_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="btn btn-secondary btn-sm"
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: preset.id === 'preset_1' ? 800 : 600,
                        borderColor: preset.id === 'preset_1' ? 'var(--brand-cyan, #0284c7)' : undefined,
                        background: preset.id === 'preset_1' ? 'var(--brand-cyan-light, #e0f2fe)' : undefined,
                        color: preset.id === 'preset_1' ? '#0369a1' : undefined
                      }}
                      title={preset.description}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drag-and-Drop Prescription Layout Builder */}
              <PrescriptionLayoutBuilder
                sections={formState.prescriptionSections}
                onChange={(newSections) => setFormState(prev => ({ ...prev, prescriptionSections: newSections }))}
              />
            </div>
          )}

          {/* Tab 2: Header Branding Layout */}
          {activeTab === 'header' && (
            <div>
              <LetterheadLayoutBuilder
                sections={formState.headerSections}
                onChange={(newSections) => setFormState(prev => ({ ...prev, headerSections: newSections }))}
              />
            </div>
          )}

          {/* Tab 3: Doctor Credentials & Hospital Chambers */}
          {activeTab === 'credentials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 700 }}>Doctor Full Name</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={formState.doctorName}
                    onChange={(e) => setFormState({ ...formState, doctorName: e.target.value })}
                    placeholder="e.g. Dr. Zain Safdar"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 700 }}>Medical Qualifications</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={formState.qualifications}
                    onChange={(e) => setFormState({ ...formState, qualifications: e.target.value })}
                    placeholder="e.g. MBBS, FCPS Cardiology, Diplomate ABIM"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 700 }}>PMC / Reg Number</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={formState.pmcNumber}
                    onChange={(e) => setFormState({ ...formState, pmcNumber: e.target.value })}
                    placeholder="e.g. 79817-P"
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 700 }}>Clinical Specialty Title</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={formState.specialtyTitle}
                    onChange={(e) => setFormState({ ...formState, specialtyTitle: e.target.value })}
                    placeholder="e.g. Consultant Cardiologist & Heart Specialist"
                  />
                </div>
              </div>

              {/* Practice Chambers / Locations */}
              <div style={{ borderTop: '1px solid var(--border-subtle, #e2e8f0)', paddingTop: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Building2 size={16} color="var(--brand-cyan, #0284c7)" />
                    <span>Practice Chambers &amp; OPD Consultation Hours</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={13} />
                    <span>Add Hospital</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {formState.locations.map((loc, idx) => (
                    <div
                      key={loc.id || idx}
                      style={{
                        background: 'var(--bg-page, #f8fafc)',
                        border: '1px solid var(--border-subtle, #e2e8f0)',
                        borderRadius: 6,
                        padding: '10px 12px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 36px',
                        gap: 10,
                        alignItems: 'center'
                      }}
                    >
                      <input
                        type="text"
                        className="modern-input"
                        value={loc.hospitalName}
                        onChange={(e) => handleLocationChange(loc.id, 'hospitalName', e.target.value)}
                        placeholder="Hospital Name (e.g. Ikram Hospital)"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        className="modern-input"
                        value={loc.department}
                        onChange={(e) => handleLocationChange(loc.id, 'department', e.target.value)}
                        placeholder="Address / Dept (e.g. Bhimber Road, Gujrat)"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        className="modern-input"
                        value={loc.consultationHours}
                        onChange={(e) => handleLocationChange(loc.id, 'consultationHours', e.target.value)}
                        placeholder="Timings (e.g. Mon-Sat: 2:00 PM - 7:00 PM)"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <input
                        type="text"
                        className="modern-input"
                        value={loc.phone}
                        onChange={(e) => handleLocationChange(loc.id, 'phone', e.target.value)}
                        placeholder="Phone / Helpline"
                        style={{ fontSize: '0.8rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLocation(loc.id)}
                        disabled={formState.locations.length <= 1}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: formState.locations.length <= 1 ? '#cbd5e1' : '#ef4444',
                          cursor: formState.locations.length <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 6
                        }}
                        title="Remove hospital"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription Footer Note */}
              <div style={{ borderTop: '1px solid var(--border-subtle, #e2e8f0)', paddingTop: 14 }}>
                <label className="form-label" style={{ fontSize: '0.785rem', fontWeight: 700 }}>
                  Prescription Footer Advice / Emergency Note
                </label>
                <input
                  type="text"
                  className="modern-input"
                  value={formState.footerNote}
                  onChange={(e) => setFormState({ ...formState, footerNote: e.target.value })}
                  placeholder="e.g. Emergency cardiac consultation available 24/7 in CCU."
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--border-subtle, #e2e8f0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-page, #f8fafc)'
          }}
        >
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted, #64748b)' }}>
            Changes will immediately update the live prescription sheet.
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-cyan"
              onClick={handleSave}
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
            >
              <Check size={16} />
              <span>Save &amp; Apply Layout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
