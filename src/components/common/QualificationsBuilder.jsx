import React, { useState } from 'react';
import { GraduationCap, Plus, X, List, AlignLeft } from 'lucide-react';

export const QualificationsBuilder = ({
  value = '',
  onChange,
  label = 'Qualifications, Degrees & Fellowships',
  required = false
}) => {
  const [mode, setMode] = useState('list'); // 'list' | 'text'
  const [newDegree, setNewDegree] = useState('');

  // Parse lines from string (preserves user-entered lines)
  const items = (value || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const handleAddDegree = (degreeToAdd) => {
    const text = (degreeToAdd || newDegree).trim();
    if (!text) return;

    // Support multiline paste
    const splitLines = text.split('\n').map(s => s.trim()).filter(Boolean);
    const updated = [...items, ...splitLines];
    onChange(updated.join('\n'));
    if (!degreeToAdd) {
      setNewDegree('');
    }
  };

  const handleUpdateItem = (index, newText) => {
    const copy = [...items];
    copy[index] = newText;
    onChange(copy.filter(Boolean).join('\n'));
  };

  const handleRemoveItem = (index) => {
    const copy = items.filter((_, idx) => idx !== index);
    onChange(copy.join('\n'));
  };

  const quickChips = [
    'MBBS',
    'FCPS Cardiology',
    'FCPS Medicine',
    'MRCP (UK)',
    'MCPS',
    'MD',
    'MBBS (Gold Medalist)',
    'Fellowship Interventional Cardiology'
  ];

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      {/* Header with Title and Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <label className="field-label" style={{ margin: 0 }}>
          {label} {required && '*'}
        </label>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setMode(m => m === 'list' ? 'text' : 'list')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--brand-cyan)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '2px 6px',
              borderRadius: 4
            }}
            title={mode === 'list' ? 'Switch to freeform text' : 'Switch to structured list'}
          >
            {mode === 'list' ? (
              <>
                <AlignLeft size={13} />
                <span>Text Mode</span>
              </>
            ) : (
              <>
                <List size={13} />
                <span>List Builder</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mode === 'list' ? (
        <div className="qual-builder">
          {/* List of stacked degrees */}
          {items.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 10 }}>
              No qualifications entered yet. Type below and press Enter to add.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
              {items.map((item, idx) => (
                <div key={idx} className="qual-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <span
                      style={{
                        fontSize: '0.675rem',
                        fontWeight: 800,
                        background: 'var(--brand-cyan-light)',
                        color: 'var(--brand-cyan)',
                        padding: '2px 6px',
                        borderRadius: 4,
                        minWidth: 20,
                        textAlign: 'center'
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <GraduationCap size={15} color="var(--brand-cyan)" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      className="modern-input"
                      style={{
                        padding: '4px 8px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        border: '1px solid transparent',
                        background: 'transparent',
                        flex: 1,
                        color: 'var(--text-primary)'
                      }}
                      value={item}
                      onChange={(e) => handleUpdateItem(idx, e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-icon btn-icon-rose"
                    style={{ width: 26, height: 26, flexShrink: 0 }}
                    onClick={() => handleRemoveItem(idx)}
                    title="Remove qualification"
                  >
                    <X size={14} color="#e11d48" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Active Add-Next-Degree Input (Pressing Enter adds beneath) */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="modern-input"
                style={{
                  fontSize: '0.875rem',
                  paddingLeft: 34,
                  width: '100%',
                  background: '#ffffff'
                }}
                placeholder={
                  items.length === 0
                    ? 'Type qualification (e.g. MBBS Gold Medalist) & press Enter ↵'
                    : 'Type next qualification / fellowship & press Enter ↵'
                }
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDegree();
                  }
                }}
              />
              <GraduationCap
                size={16}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleAddDegree()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                whiteSpace: 'nowrap',
                padding: '9px 14px',
                fontSize: '0.825rem'
              }}
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          {/* Quick-Pick Medical Degree Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick Add:</span>
            {quickChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="qual-chip-btn"
                onClick={() => handleAddDegree(chip)}
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Textarea Mode with full styling */
        <div>
          <textarea
            className="modern-input modern-textarea"
            rows={3}
            style={{
              width: '100%',
              resize: 'vertical',
              lineHeight: 1.5,
              fontFamily: 'inherit',
              fontSize: '0.875rem',
              minHeight: 80
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={"e.g.\nMBBS (Gold Medalist)\nFCPS Cardiology\nFellow Interventional Cardiology"}
            required={required}
          />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
            💡 Tip: Each line prints on its own row beneath the doctor's name on letterheads.
          </div>
        </div>
      )}
    </div>
  );
};
