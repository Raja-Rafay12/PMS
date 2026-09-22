import React, { useState, useEffect, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { RichTextToolbar } from '../common/RichTextToolbar';
import { MarkdownView } from '../common/MarkdownView';
import {
  Lock,
  ShieldCheck,
  Check,
  Sparkles,
  EyeOff,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

export const PersonalNotesTab = () => {
  const { activePatient, updatePersonalNotes, showToast } = usePatients();

  const [notes, setNotes] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const noteRef = useRef(null);

  useEffect(() => {
    if (activePatient) {
      setNotes(activePatient.personalNotes || '');
    }
  }, [activePatient]);

  const quickTemplates = [
    {
      title: 'Compliance & Adherence',
      text: '**Treatment Adherence & Compliance:**\nPatient understands the dosage schedule. Expressed hesitation regarding side effects; addressed concerns and encouraged compliance.'
    },
    {
      title: 'Behavioral & Psychological',
      text: '**Psychological & Behavioral Observations:**\nPatient exhibits mild anxiety regarding symptoms. Mood is receptive and cooperative. Good insight into their condition.'
    },
    {
      title: 'Next Visit Agenda',
      text: '**Agenda for Next Consultation:**\n1. Re-evaluate symptom resolution\n2. Check blood pressure / lab parameters\n3. Review medication tolerance'
    },
    {
      title: 'Socio-economic & Family',
      text: '**Social & Family Context:**\nWorks demanding hours with high occupational stress. Supportive family environment.'
    }
  ];

  const handleApplyTemplate = (tpl) => {
    setNotes(prev => {
      if (!prev || !prev.trim()) return tpl.text;
      return `${prev.trim()}\n\n${tpl.text}`;
    });
    showToast(`Added template: ${tpl.title}`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePersonalNotes(activePatient.id, notes);
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    showToast('Personal confidential note saved');
  };

  return (
    <div>
      {/* Tab Header with Privacy Badge */}
      <div className="tab-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 className="tab-title">Personal Doctor Note</h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                background: '#fef3c7',
                color: '#b45309',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '9999px',
                letterSpacing: '0.04em'
              }}
            >
              <Lock size={12} />
              CONFIDENTIAL
            </span>
          </div>
          <p className="tab-desc">
            Your personal clinical perception and private observations. Strictly confidential to you — Never included in patient printouts or prescriptions.
          </p>
        </div>

        {lastSaved && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span>Saved at {lastSaved}</span>
          </div>
        )}
      </div>

      {/* Security Notice Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12
        }}
      >
        <div style={{ background: '#f59e0b', color: '#ffffff', padding: 6, borderRadius: 6, display: 'flex', marginTop: 1 }}>
          <EyeOff size={16} />
        </div>
        <div style={{ fontSize: '0.85rem', color: '#92400e', lineHeight: 1.5 }}>
          <strong>Doctor Privacy Guarantee:</strong> Anything recorded here is stored in your private physician log for this patient. It will <strong>never</strong> appear on the printed medical summary, prescription sheet, or patient-facing reports.
        </div>
      </div>

      {/* Quick Clinical Templates */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 20, background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--brand-cyan)', marginBottom: 10 }}>
          <Sparkles size={14} />
          <span>Quick Doctor Observation Templates:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {quickTemplates.map((tpl, i) => (
            <button
              key={i}
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.775rem', padding: '4px 10px' }}
              onClick={() => handleApplyTemplate(tpl)}
            >
              + {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Note Editor Form */}
      <form onSubmit={handleSave} className="card" style={{ padding: '24px' }}>
        <div className="clinical-field-block" style={{ marginBottom: 20 }}>
          <label className="clinical-field-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Private Notes &amp; Clinical Perception:</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Supports bold, italic, and bullet lists
            </span>
          </label>

          <div className="rich-editor-wrapper">
            <RichTextToolbar
              textareaRef={noteRef}
              value={notes}
              onChange={setNotes}
            />
            <textarea
              ref={noteRef}
              className="modern-clinical-textarea"
              style={{ minHeight: '220px', lineHeight: 1.6 }}
              placeholder="Record your confidential thoughts about the patient here... e.g. Patient appears anxious about nocturnal cough; discussed stress factors; advised on regular medication schedule. Good compliance expected."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <Lock size={14} />
            <span>Hidden from print &amp; PDF summaries</span>
          </div>

          <button type="submit" className="btn btn-primary">
            <Check size={16} />
            <span>Save Personal Note</span>
          </button>
        </div>
      </form>
    </div>
  );
};
