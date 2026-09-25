import React, { useState, useEffect, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { RichTextToolbar } from '../common/RichTextToolbar';
import { Check, FileCheck2, Lightbulb, Calendar, Clock } from 'lucide-react';

export const ImpressionAdviceTab = () => {
  const { activePatient, updateImpressionAdvice, showToast } = usePatients();

  const [impression, setImpression] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const impressionRef = useRef(null);
  const adviceRef = useRef(null);

  useEffect(() => {
    if (activePatient?.impressionAdvice) {
      setImpression(activePatient.impressionAdvice.impression || '');
      setAdvice(activePatient.impressionAdvice.advice || '');
      setFollowUpDate(activePatient.impressionAdvice.followUpDate || '');
    }
  }, [activePatient]);

  const handleQuickFollowUp = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setFollowUpDate(formatted);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateImpressionAdvice(activePatient.id, {
      impression,
      advice,
      followUpDate
    });
    showToast('Impression, advice & follow-up date saved');
  };

  return (
    <div>
      <div className="tab-header-row">
        <div>
          <h2 className="tab-title">Impression &amp; Advice</h2>
          <p className="tab-desc">
            Record clinical diagnosis, differential impressions, and doctor's instructions for the patient.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card" style={{ padding: '28px' }}>
        {/* Clinical Impression */}
        <div className="clinical-field-block" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FileCheck2 size={16} color="var(--brand-cyan)" />
            <label className="clinical-field-label" style={{ margin: 0 }}>
              Clinical Impression / Working Diagnosis
            </label>
          </div>
          <div className="rich-editor-wrapper">
            <RichTextToolbar
              textareaRef={impressionRef}
              value={impression}
              onChange={setImpression}
            />
            <textarea
              ref={impressionRef}
              className="modern-clinical-textarea"
              style={{ minHeight: '110px' }}
              placeholder="e.g. Acute viral upper respiratory tract infection with post-viral bronchial hyper-reactivity..."
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
            />
          </div>
        </div>

        {/* Advice by doctor */}
        <div className="clinical-field-block" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Lightbulb size={16} color="var(--brand-teal)" />
            <label className="clinical-field-label" style={{ margin: 0 }}>
              Doctor's Advice &amp; Follow-up Instructions
            </label>
          </div>
          <div className="rich-editor-wrapper">
            <RichTextToolbar
              textareaRef={adviceRef}
              value={advice}
              onChange={setAdvice}
            />
            <textarea
              ref={adviceRef}
              className="modern-clinical-textarea"
              style={{ minHeight: '130px' }}
              placeholder="1. Steam inhalation twice daily with warm fluids.&#10;2. Avoid chilled beverages and dust exposure.&#10;3. Follow up after 5 days if cough persists."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>
        </div>

        {/* Next Follow-up Date */}
        <div className="clinical-field-block" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} color="var(--brand-cyan)" />
              <label className="clinical-field-label" style={{ margin: 0 }}>
                Next Follow-up Appointment Date (برائے دوبارہ معائنہ / چیک اپ)
              </label>
            </div>
            {followUpDate && (
              <span className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                Follow-up: {followUpDate}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
            <input
              type="text"
              className="modern-input"
              style={{ maxWidth: 280, fontSize: '0.875rem', fontWeight: 600 }}
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              placeholder="e.g. 16 Oct 2026 or In 2 weeks"
            />

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFollowUp(3)}
                style={{ fontSize: '0.75rem' }}
              >
                +3 Days
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFollowUp(7)}
                style={{ fontSize: '0.75rem' }}
              >
                +1 Week
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFollowUp(14)}
                style={{ fontSize: '0.75rem' }}
              >
                +2 Weeks
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleQuickFollowUp(30)}
                style={{ fontSize: '0.75rem' }}
              >
                +1 Month
              </button>
              {followUpDate && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setFollowUpDate('')}
                  style={{ fontSize: '0.75rem', color: '#ef4444' }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <p style={{ fontSize: '0.785rem', color: 'var(--text-muted)', margin: 0 }}>
            This date will be printed directly in the prescription review strip for the patient.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <button type="submit" className="btn btn-cyan">
            <Check size={16} />
            <span>Save Impression &amp; Advice</span>
          </button>
        </div>
      </form>
    </div>
  );
};
