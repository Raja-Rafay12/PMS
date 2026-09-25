import React, { useState } from 'react';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Layout,
  Columns,
  Sparkles,
  RotateCcw,
  FileText,
  Pill,
  Activity,
  FlaskConical,
  MessageSquare,
  CheckCircle,
  User,
  Building2
} from 'lucide-react';

export const DEFAULT_PRESCRIPTION_SECTIONS = [
  {
    id: 'header',
    name: 'Clinical Letterhead Header',
    icon: '🏥',
    description: 'Doctor credentials, hospital branding & practice schedule strip',
    enabled: true,
    layout: 'vertical', // 'vertical' | 'horizontal'
    align: 'full', // 'full' | 'left' | 'right'
  },
  {
    id: 'demographics',
    name: 'Patient Demographics Bar',
    icon: '👤',
    description: 'Patient Name, Age/Gender, MRN/Phone, Blood Group & Date',
    enabled: true,
    layout: 'vertical',
    align: 'full',
  },
  {
    id: 'clinical_notes',
    name: 'Clinical Notes & Complaints',
    icon: '📝',
    description: 'Chief complaints, history of illness & consultation findings',
    enabled: true,
    layout: 'vertical',
    align: 'left',
  },
  {
    id: 'vitals_exam',
    name: 'Recorded Vitals & Examination',
    icon: '🩺',
    description: 'BP, Pulse, Temperature, SpO2, Weight & physical findings',
    enabled: true,
    layout: 'vertical',
    align: 'left',
  },
  {
    id: 'rx_medications',
    name: '℞ Prescriptions (Medications Table)',
    icon: '💊',
    description: 'Active medications, dosage, frequency, duration & instructions with Urdu translation',
    enabled: true,
    layout: 'vertical',
    align: 'full',
  },
  {
    id: 'lab_reports',
    name: 'Laboratory Investigations',
    icon: '🧪',
    description: 'Diagnostic lab tests ordered and investigation findings',
    enabled: true,
    layout: 'vertical',
    align: 'full',
  },
  {
    id: 'impression_advice',
    name: 'Clinical Impression & Advice',
    icon: '💡',
    description: 'Doctor diagnostic impression and follow-up guidance',
    enabled: true,
    layout: 'vertical',
    align: 'full',
  },
  {
    id: 'footer_signature',
    name: 'Authorization & Signature Block',
    icon: '✍️',
    description: 'Emergency advice note and authorized physician signature',
    enabled: true,
    layout: 'vertical',
    align: 'full',
  }
];

export const PRESCRIPTION_PRESETS = [
  {
    id: 'classic_split',
    label: '📑 Classic 2-Column Split',
    description: 'Vitals & Notes on Left Column (40%), ℞ Prescriptions on Right Column (60%)',
    generate: () => [
      { id: 'header', name: 'Clinical Letterhead Header', icon: '🏥', description: 'Doctor credentials, hospital branding & practice schedule strip', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'demographics', name: 'Patient Demographics Bar', icon: '👤', description: 'Patient Name, Age/Gender, MRN/Phone, Blood Group & Date', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'clinical_notes', name: 'Clinical Notes & Complaints', icon: '📝', description: 'Chief complaints, history of illness & consultation findings', enabled: true, layout: 'horizontal', align: 'left' },
      { id: 'rx_medications', name: '℞ Prescriptions (Medications Table)', icon: '💊', description: 'Active medications, dosage, frequency, duration & instructions', enabled: true, layout: 'horizontal', align: 'right' },
      { id: 'vitals_exam', name: 'Recorded Vitals & Examination', icon: '🩺', description: 'BP, Pulse, Temperature, SpO2, Weight & physical findings', enabled: true, layout: 'horizontal', align: 'left' },
      { id: 'lab_reports', name: 'Laboratory Investigations', icon: '🧪', description: 'Diagnostic lab tests ordered and investigation findings', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'impression_advice', name: 'Clinical Impression & Advice', icon: '💡', description: 'Doctor diagnostic impression and follow-up guidance', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'footer_signature', name: 'Authorization & Signature Block', icon: '✍️', description: 'Emergency advice note and authorized physician signature', enabled: true, layout: 'vertical', align: 'full' }
    ]
  },
  {
    id: 'stacked',
    label: '📄 Modern Full-Width Stack',
    description: 'Standard clinical hierarchy from Header down to Signature',
    generate: () => DEFAULT_PRESCRIPTION_SECTIONS
  },
  {
    id: 'rx_first',
    label: '💊 ℞ Medications Priority',
    description: 'Prescription Table right beneath Demographics, followed by Notes',
    generate: () => [
      { id: 'header', name: 'Clinical Letterhead Header', icon: '🏥', description: 'Doctor credentials, hospital branding & practice schedule strip', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'demographics', name: 'Patient Demographics Bar', icon: '👤', description: 'Patient Name, Age/Gender, MRN/Phone, Blood Group & Date', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'rx_medications', name: '℞ Prescriptions (Medications Table)', icon: '💊', description: 'Active medications, dosage, frequency, duration & instructions', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'clinical_notes', name: 'Clinical Notes & Complaints', icon: '📝', description: 'Chief complaints, history of illness & consultation findings', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'vitals_exam', name: 'Recorded Vitals & Examination', icon: '🩺', description: 'BP, Pulse, Temperature, SpO2, Weight & physical findings', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'impression_advice', name: 'Clinical Impression & Advice', icon: '💡', description: 'Doctor diagnostic impression and follow-up guidance', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'lab_reports', name: 'Laboratory Investigations', icon: '🧪', description: 'Diagnostic lab tests ordered and investigation findings', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'footer_signature', name: 'Authorization & Signature Block', icon: '✍️', description: 'Emergency advice note and authorized physician signature', enabled: true, layout: 'vertical', align: 'full' }
    ]
  },
  {
    id: 'rx_slip',
    label: '⚡ Quick Rx Pharmacy Slip',
    description: 'Only Demographics, ℞ Prescriptions & Signature (Notes & Labs hidden)',
    generate: () => [
      { id: 'header', name: 'Clinical Letterhead Header', icon: '🏥', description: 'Doctor credentials, hospital branding & practice schedule strip', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'demographics', name: 'Patient Demographics Bar', icon: '👤', description: 'Patient Name, Age/Gender, MRN/Phone, Blood Group & Date', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'rx_medications', name: '℞ Prescriptions (Medications Table)', icon: '💊', description: 'Active medications, dosage, frequency, duration & instructions', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'clinical_notes', name: 'Clinical Notes & Complaints', icon: '📝', description: 'Chief complaints, history of illness & consultation findings', enabled: false, layout: 'vertical', align: 'full' },
      { id: 'vitals_exam', name: 'Recorded Vitals & Examination', icon: '🩺', description: 'BP, Pulse, Temperature, SpO2, Weight & physical findings', enabled: false, layout: 'vertical', align: 'full' },
      { id: 'lab_reports', name: 'Laboratory Investigations', icon: '🧪', description: 'Diagnostic lab tests ordered and investigation findings', enabled: false, layout: 'vertical', align: 'full' },
      { id: 'impression_advice', name: 'Clinical Impression & Advice', icon: '💡', description: 'Doctor diagnostic impression and follow-up guidance', enabled: true, layout: 'vertical', align: 'full' },
      { id: 'footer_signature', name: 'Authorization & Signature Block', icon: '✍️', description: 'Emergency advice note and authorized physician signature', enabled: true, layout: 'vertical', align: 'full' }
    ]
  }
];

export const PrescriptionLayoutBuilder = ({ sections = DEFAULT_PRESCRIPTION_SECTIONS, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const currentSections = Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_PRESCRIPTION_SECTIONS;

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    try {
      e.dataTransfer.setData('text/plain', index.toString());
    } catch {
      // ignore
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...currentSections];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    onChange(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const moveUp = (index) => {
    if (index <= 0) return;
    const updated = [...currentSections];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const moveDown = (index) => {
    if (index >= currentSections.length - 1) return;
    const updated = [...currentSections];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const updateSection = (id, updates) => {
    const updated = currentSections.map(s => (s.id === id ? { ...s, ...updates } : s));
    onChange(updated);
  };

  const applyPreset = (preset) => {
    onChange(preset.generate());
  };

  return (
    <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
      {/* Title & Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em' }}>
            Full Prescription &amp; Clinical Sections Layout Builder
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Drag and reorder any section on the prescription (Rx Medications, Clinical Notes, Vitals, Demographics, Footer). Adjust horizontal/vertical placement and visibility to match the doctor's custom workflow.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.725rem', padding: '4px 10px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          onClick={() => onChange(DEFAULT_PRESCRIPTION_SECTIONS)}
          title="Reset to default arrangement"
        >
          <RotateCcw size={12} />
          <span>Reset Layout</span>
        </button>
      </div>

      {/* 1-Click Prescription Presets */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={12} style={{ color: 'var(--brand-amber)' }} />
          <span>One-Click Prescription Layout Presets:</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
          {PRESCRIPTION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 10px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--brand-cyan)';
                e.currentTarget.style.background = 'var(--brand-cyan-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = 'var(--bg-page)';
              }}
            >
              <div style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {preset.label}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.3 }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Prescription Sections List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {currentSections.map((section, index) => {
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={section.id}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`drag-section-card ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over-top' : ''} ${!section.enabled ? 'disabled' : ''}`}
              style={{
                background: section.enabled ? 'var(--bg-surface)' : '#f8fafc',
                border: isDragOver ? '2px solid var(--brand-cyan)' : '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                boxShadow: isDragging ? 'var(--shadow-lg)' : 'var(--shadow-xs)'
              }}
            >
              {/* Card Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Drag Handle */}
                  <div
                    className="drag-handle"
                    title="Click and drag to reorder this prescription section"
                    style={{
                      cursor: 'grab',
                      padding: '5px 7px',
                      background: 'var(--bg-muted)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      color: 'var(--text-muted)'
                    }}
                  >
                    <GripVertical size={16} />
                    <span style={{ fontSize: '0.675rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Drag #{index + 1}
                    </span>
                  </div>

                  {/* Section Title */}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: section.enabled ? 'var(--text-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{section.icon || '📌'}</span>
                      <span>{section.name}</span>
                      {!section.enabled && <span className="badge badge-warning" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>Hidden in Print</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 1 }}>
                      {section.description}
                    </div>
                  </div>
                </div>

                {/* Move & Visibility Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    title="Move Section Up"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-page)',
                      borderRadius: 4,
                      padding: '4px 6px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      opacity: index === 0 ? 0.35 : 1,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <ChevronUp size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={index === currentSections.length - 1}
                    onClick={() => moveDown(index)}
                    title="Move Section Down"
                    style={{
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-page)',
                      borderRadius: 4,
                      padding: '4px 6px',
                      cursor: index === currentSections.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: index === currentSections.length - 1 ? 0.35 : 1,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <ChevronDown size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => updateSection(section.id, { enabled: !section.enabled })}
                    title={section.enabled ? 'Hide this section in print' : 'Show this section in print'}
                    style={{
                      border: section.enabled ? '1px solid var(--brand-cyan)' : '1px solid var(--border-subtle)',
                      background: section.enabled ? 'var(--brand-cyan-light)' : 'var(--bg-page)',
                      color: section.enabled ? 'var(--brand-cyan)' : 'var(--text-muted)',
                      borderRadius: 4,
                      padding: '4px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.725rem',
                      fontWeight: 700
                    }}
                  >
                    {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{section.enabled ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
              </div>

              {/* Placement & Alignment Mode Controls */}
              {section.enabled && (
                <div style={{ background: 'var(--bg-page)', borderRadius: 6, padding: '10px 12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                    Placement Mode &amp; Page Column Allocation
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <button
                      type="button"
                      className={`layout-toggle-btn ${section.layout === 'vertical' ? 'active' : ''}`}
                      onClick={() => updateSection(section.id, { layout: 'vertical', align: 'full' })}
                    >
                      <Layout size={12} />
                      <span>📄 Full Width (Vertical Stack)</span>
                    </button>

                    <button
                      type="button"
                      className={`layout-toggle-btn ${section.layout === 'horizontal' && section.align === 'left' ? 'active' : ''}`}
                      onClick={() => updateSection(section.id, { layout: 'horizontal', align: 'left' })}
                    >
                      <Columns size={12} />
                      <span>↔ Left Column (Side-by-Side)</span>
                    </button>

                    <button
                      type="button"
                      className={`layout-toggle-btn ${section.layout === 'horizontal' && section.align === 'right' ? 'active' : ''}`}
                      onClick={() => updateSection(section.id, { layout: 'horizontal', align: 'right' })}
                    >
                      <Columns size={12} />
                      <span>↔ Right Column (Side-by-Side)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
        💡 <strong>Pro Doctor Tip:</strong> Set <strong>Clinical Notes &amp; Vitals</strong> to <em>Left Column</em> and <strong>℞ Prescriptions</strong> to <em>Right Column</em> to get the classic multi-column prescription pad used in top hospitals!
      </div>
    </div>
  );
};
