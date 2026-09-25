import React, { useState } from 'react';
import { GripVertical, ChevronUp, ChevronDown, Eye, EyeOff, Layout, Columns, AlignLeft, AlignCenter, AlignRight, Sparkles, RotateCcw } from 'lucide-react';

export const DEFAULT_HEADER_SECTIONS = [
  {
    id: 'doctor_info',
    name: 'Physician Credentials',
    icon: '👨‍⚕️',
    description: 'Doctor Name, PMC Reg #, Specialty & Qualifications',
    enabled: true,
    layout: 'horizontal', // 'horizontal' | 'vertical'
    align: 'left', // 'left' | 'center' | 'right'
  },
  {
    id: 'hospital_info',
    name: 'Hospital / Clinic Branding',
    icon: '🏥',
    description: 'Hospital Name, Department, Tagline & Facility Branding',
    enabled: true,
    layout: 'horizontal',
    align: 'right',
  },
  {
    id: 'divider_line',
    name: 'Header Divider Rule',
    icon: '━',
    description: 'Decorative divider line separating header from prescription body',
    enabled: true,
    layout: 'vertical',
    align: 'center',
    dividerStyle: 'solid', // 'solid' | 'cyan-accent' | 'double' | 'minimal' | 'dotted' | 'none'
  },
  {
    id: 'schedule_info',
    name: 'Practice Chambers & OPD Hours',
    icon: '🕒',
    description: 'Multi-hospital practice chambers, consultation timings & days',
    enabled: true,
    layout: 'vertical',
    align: 'left',
    schedulePosition: 'banner', // 'banner' | 'compact'
  },
  {
    id: 'contact_info',
    name: 'Chamber Address & Helpline Phone',
    icon: '📞',
    description: 'Direct appointment helpline, official email & location address',
    enabled: false,
    layout: 'vertical',
    align: 'left',
  }
];

export const PRESETS = [
  {
    id: 'split',
    label: '↔ Executive Split',
    description: 'Doctor on Left, Hospital on Right',
    generate: () => [
      { id: 'doctor_info', name: 'Physician Credentials', icon: '👨‍⚕️', description: 'Doctor Name, PMC Reg #, Specialty & Qualifications', enabled: true, layout: 'horizontal', align: 'left' },
      { id: 'hospital_info', name: 'Hospital / Clinic Branding', icon: '🏥', description: 'Hospital Name, Department, Tagline & Facility Branding', enabled: true, layout: 'horizontal', align: 'right' },
      { id: 'divider_line', name: 'Header Divider Rule', icon: '━', description: 'Decorative divider line separating header from prescription body', enabled: true, layout: 'vertical', align: 'center', dividerStyle: 'solid' },
      { id: 'schedule_info', name: 'Practice Chambers & OPD Hours', icon: '🕒', description: 'Multi-hospital practice chambers, consultation timings & days', enabled: true, layout: 'vertical', align: 'left', schedulePosition: 'banner' },
      { id: 'contact_info', name: 'Chamber Address & Helpline Phone', icon: '📞', description: 'Direct appointment helpline, official email & location address', enabled: false, layout: 'vertical', align: 'left' }
    ]
  },
  {
    id: 'centered',
    label: '↕ Centered Classic',
    description: 'Symmetrically centered doctor & clinic header',
    generate: () => [
      { id: 'doctor_info', name: 'Physician Credentials', icon: '👨‍⚕️', description: 'Doctor Name, PMC Reg #, Specialty & Qualifications', enabled: true, layout: 'vertical', align: 'center' },
      { id: 'hospital_info', name: 'Hospital / Clinic Branding', icon: '🏥', description: 'Hospital Name, Department, Tagline & Facility Branding', enabled: true, layout: 'vertical', align: 'center' },
      { id: 'divider_line', name: 'Header Divider Rule', icon: '━', description: 'Decorative divider line separating header from prescription body', enabled: true, layout: 'vertical', align: 'center', dividerStyle: 'cyan-accent' },
      { id: 'schedule_info', name: 'Practice Chambers & OPD Hours', icon: '🕒', description: 'Multi-hospital practice chambers, consultation timings & days', enabled: true, layout: 'vertical', align: 'center', schedulePosition: 'compact' },
      { id: 'contact_info', name: 'Chamber Address & Helpline Phone', icon: '📞', description: 'Direct appointment helpline, official email & location address', enabled: false, layout: 'vertical', align: 'center' }
    ]
  },
  {
    id: 'inverted',
    label: '⇄ Hospital First',
    description: 'Hospital on Left, Doctor on Right',
    generate: () => [
      { id: 'hospital_info', name: 'Hospital / Clinic Branding', icon: '🏥', description: 'Hospital Name, Department, Tagline & Facility Branding', enabled: true, layout: 'horizontal', align: 'left' },
      { id: 'doctor_info', name: 'Physician Credentials', icon: '👨‍⚕️', description: 'Doctor Name, PMC Reg #, Specialty & Qualifications', enabled: true, layout: 'horizontal', align: 'right' },
      { id: 'divider_line', name: 'Header Divider Rule', icon: '━', description: 'Decorative divider line separating header from prescription body', enabled: true, layout: 'vertical', align: 'center', dividerStyle: 'solid' },
      { id: 'schedule_info', name: 'Practice Chambers & OPD Hours', icon: '🕒', description: 'Multi-hospital practice chambers, consultation timings & days', enabled: true, layout: 'vertical', align: 'left', schedulePosition: 'banner' },
      { id: 'contact_info', name: 'Chamber Address & Helpline Phone', icon: '📞', description: 'Direct appointment helpline, official email & location address', enabled: false, layout: 'vertical', align: 'left' }
    ]
  },
  {
    id: 'stacked',
    label: '📄 Modern Stacked',
    description: 'Doctor full-width on top, Hospital full-width beneath',
    generate: () => [
      { id: 'doctor_info', name: 'Physician Credentials', icon: '👨‍⚕️', description: 'Doctor Name, PMC Reg #, Specialty & Qualifications', enabled: true, layout: 'vertical', align: 'left' },
      { id: 'hospital_info', name: 'Hospital / Clinic Branding', icon: '🏥', description: 'Hospital Name, Department, Tagline & Facility Branding', enabled: true, layout: 'vertical', align: 'left' },
      { id: 'divider_line', name: 'Header Divider Rule', icon: '━', description: 'Decorative divider line separating header from prescription body', enabled: true, layout: 'vertical', align: 'center', dividerStyle: 'double' },
      { id: 'schedule_info', name: 'Practice Chambers & OPD Hours', icon: '🕒', description: 'Multi-hospital practice chambers, consultation timings & days', enabled: true, layout: 'vertical', align: 'left', schedulePosition: 'banner' },
      { id: 'contact_info', name: 'Chamber Address & Helpline Phone', icon: '📞', description: 'Direct appointment helpline, official email & location address', enabled: false, layout: 'vertical', align: 'left' }
    ]
  }
];

export const LetterheadLayoutBuilder = ({ sections = DEFAULT_HEADER_SECTIONS, onChange }) => {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // Normalize sections array
  const currentSections = Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_HEADER_SECTIONS;

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
    const updated = currentSections.map(s => s.id === id ? { ...s, ...updates } : s);
    onChange(updated);
  };

  const applyPreset = (preset) => {
    onChange(preset.generate());
  };

  return (
    <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: '0.775rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em' }}>
            3. Interactive Letterhead Layout Builder (Drag to Reorder)
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
            Drag and reorder any section. Choose whether each block is <strong>Horizontal (side-by-side)</strong> or <strong>Vertical (full row)</strong>, set alignment, or toggle visibility.
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: '0.725rem', padding: '4px 10px', height: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}
          onClick={() => onChange(DEFAULT_HEADER_SECTIONS)}
          title="Reset to default arrangement"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* 1-Click Layout Presets Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={12} style={{ color: 'var(--brand-amber)' }} />
          <span>Quick Layout Presets (1-Click Arrangement):</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
          {PRESETS.map(preset => (
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
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-cyan)'; e.currentTarget.style.background = 'var(--brand-cyan-light)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.background = 'var(--bg-page)'; }}
            >
              <div style={{ fontSize: '0.775rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {preset.label}
              </div>
              <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {preset.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Sections List */}
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
              {/* Card Header Row: Drag Handle, Number Badge, Title, Reorder & Visibility */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Drag Handle */}
                  <div
                    className="drag-handle"
                    title="Click and drag to reorder this section"
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

                {/* Actions: Up, Down, Visibility Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {/* Up Button */}
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

                  {/* Down Button */}
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

                  {/* Visibility Toggle */}
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

              {/* Card Body: Orientation & Alignment Controls (when enabled) */}
              {section.enabled && (
                <div style={{ background: 'var(--bg-page)', borderRadius: 6, padding: '10px 12px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, alignItems: 'center' }}>
                  {/* Control 1: Orientation (Horizontal vs Vertical) */}
                  {section.id !== 'divider_line' && (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                        Placement Mode
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className={`layout-toggle-btn ${section.layout === 'horizontal' ? 'active' : ''}`}
                          onClick={() => updateSection(section.id, { layout: 'horizontal', align: section.align === 'center' ? 'left' : section.align })}
                          title="Sits side-by-side with another horizontal section in the same row"
                        >
                          <Columns size={12} />
                          <span>↔ Horizontal (Side-by-Side)</span>
                        </button>

                        <button
                          type="button"
                          className={`layout-toggle-btn ${section.layout === 'vertical' ? 'active' : ''}`}
                          onClick={() => updateSection(section.id, { layout: 'vertical' })}
                          title="Occupies its own full row width"
                        >
                          <Layout size={12} />
                          <span>📄 Vertical (Full Row)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Control 2: Alignment / Position */}
                  {section.id !== 'divider_line' && (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                        {section.layout === 'horizontal' ? 'Side in Row' : 'Row Text Alignment'}
                      </div>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          className={`layout-toggle-btn ${section.align === 'left' ? 'active' : ''}`}
                          onClick={() => updateSection(section.id, { align: 'left' })}
                        >
                          <AlignLeft size={12} />
                          <span>{section.layout === 'horizontal' ? 'Left Side' : 'Align Left'}</span>
                        </button>

                        {section.layout === 'vertical' && (
                          <button
                            type="button"
                            className={`layout-toggle-btn ${section.align === 'center' ? 'active' : ''}`}
                            onClick={() => updateSection(section.id, { align: 'center' })}
                          >
                            <AlignCenter size={12} />
                            <span>Centered</span>
                          </button>
                        )}

                        <button
                          type="button"
                          className={`layout-toggle-btn ${section.align === 'right' ? 'active' : ''}`}
                          onClick={() => updateSection(section.id, { align: 'right' })}
                        >
                          <AlignRight size={12} />
                          <span>{section.layout === 'horizontal' ? 'Right Side' : 'Align Right'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Section-Specific Settings: Divider Style */}
                  {section.id === 'divider_line' && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                        Divider Line Appearance
                      </div>
                      <select
                        className="modern-select"
                        value={section.dividerStyle || 'solid'}
                        onChange={(e) => updateSection(section.id, { dividerStyle: e.target.value })}
                        style={{ width: '100%', maxWidth: 360, fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <option value="solid">Dark Slate Solid Rule (Classic)</option>
                        <option value="cyan-accent">Vibrant Cyan Accent Bar (Modern Brand)</option>
                        <option value="double">Double Rule (Academic / Prestigious)</option>
                        <option value="minimal">Subtle 1px Slate Border (Clean)</option>
                        <option value="dotted">Clean Dotted Rule (Clinical Minimal)</option>
                        <option value="none">No Visible Line (Open Whitespace)</option>
                      </select>
                    </div>
                  )}

                  {/* Section-Specific Settings: Schedule Format */}
                  {section.id === 'schedule_info' && (
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                        Schedule Box Format
                      </div>
                      <select
                        className="modern-select"
                        value={section.schedulePosition || 'banner'}
                        onChange={(e) => updateSection(section.id, { schedulePosition: e.target.value })}
                        style={{ width: '100%', fontSize: '0.8rem', padding: '6px 12px' }}
                      >
                        <option value="banner">Highlighted Chambers Box</option>
                        <option value="compact">Compact Single-Row Tag Strip</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 10 }}>
        💡 <strong>Layout Tip:</strong> When two consecutive sections are both set to <strong>Horizontal (Left &amp; Right)</strong>, they automatically sit side-by-side in one row. Set a section to <strong>Vertical</strong> when you want it to stretch across the full width.
      </div>
    </div>
  );
};
