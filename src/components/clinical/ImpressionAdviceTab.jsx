import React, { useState, useEffect, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import { RichTextToolbar } from '../common/RichTextToolbar';
import { Check, FileCheck2, Lightbulb } from 'lucide-react';

export const ImpressionAdviceTab = () => {
  const { activePatient, updateImpressionAdvice, showToast } = usePatients();

  const [impression, setImpression] = useState('');
  const [advice, setAdvice] = useState('');

  const impressionRef = useRef(null);
  const adviceRef = useRef(null);

  useEffect(() => {
    if (activePatient?.impressionAdvice) {
      setImpression(activePatient.impressionAdvice.impression || '');
      setAdvice(activePatient.impressionAdvice.advice || '');
    }
  }, [activePatient]);

  const handleSave = (e) => {
    e.preventDefault();
    updateImpressionAdvice(activePatient.id, {
      impression,
      advice
    });
    showToast('Impression & advice saved to patient record');
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
