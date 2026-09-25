import React from 'react';
import { QrCode } from 'lucide-react';
import { HeaderSectionRenderer } from './HeaderSectionRenderer';
import {
  translateDoseType,
  translateFrequency,
  translateRoute,
  translateDuration,
  translateInstructionText
} from '../../services/prescriptionTranslation';

export const PrescriptionSectionRenderer = ({
  sections = [],
  headerSections = [],
  headerData = {},
  patientData = {},
  isPreview = false
}) => {
  // Sample patient data for Admin Live Preview if not supplied
  const samplePatient = {
    name: 'Muhammad Tariq',
    gender: 'Male',
    age: '48',
    phone: '+92 300 1234567',
    bloodGroup: 'B+',
    notes: [
      {
        id: 'sample-n1',
        chiefComplaints: 'Chest tightness on moderate exertion for 2 weeks. Mild shortness of breath while climbing stairs. Non-radiating.',
        clinicalAssessment: 'Borderline hypertension with mild exertional angina. No peripheral edema.',
        allergicHistory: 'Penicillin (mild skin rash)'
      }
    ],
    examinations: [
      {
        id: 'sample-e1',
        vitals: {
          bpSystolic: '135',
          bpDiastolic: '85',
          pulse: '74',
          temperature: '36.8',
          spO2: '98',
          weight: '76',
          bloodSugar: '112'
        },
        findings: {
          cardiovascular: 'S1, S2 audible, no murmurs',
          respiratory: 'Chest clear bilaterally, good air entry'
        }
      }
    ],
    medications: [
      {
        id: 'sample-m1',
        name: 'Capoten (Captopril)',
        dose: '25mg',
        doseType: 'Tablet',
        frequency: '1-0-1 (BD)',
        route: 'Oral',
        days: '14',
        comment: 'Take 1 hour before meals'
      },
      {
        id: 'sample-m2',
        name: 'Loprin (Aspirin)',
        dose: '75mg',
        doseType: 'Tablet',
        frequency: '0-1-0 (OD)',
        route: 'Oral',
        days: '30',
        comment: 'Take after lunch with water'
      },
      {
        id: 'sample-m3',
        name: 'Concor (Bisoprolol)',
        dose: '2.5mg',
        doseType: 'Tablet',
        frequency: '1-0-0 (OD)',
        route: 'Oral',
        days: '30',
        comment: 'Take in the morning'
      }
    ],
    labReports: [
      {
        id: 'sample-l1',
        title: 'Lipid Profile & Serum Creatinine',
        formattedDate: 'Recent',
        entries: [
          { key: 'Total Cholesterol', value: '185 mg/dL (Normal < 200)' },
          { key: 'Serum Creatinine', value: '0.9 mg/dL' }
        ]
      }
    ],
    impressionAdvice: {
      impression: 'Mild Exertional Angina / Essential Hypertension',
      advice: 'Low sodium diet, brisk walking 30 mins daily. Report to Emergency CCU if chest pain persists longer than 15 minutes.',
      followUpDate: 'Follow-up in 2 weeks with repeat ECG'
    }
  };

  const patient = isPreview
    ? { ...samplePatient, ...(patientData.activePatient || {}) }
    : (patientData.activePatient || samplePatient);

  const notesToPrint = isPreview ? patient.notes : (patientData.notesToPrint || []);
  const examsToPrint = isPreview ? patient.examinations : (patientData.examsToPrint || []);
  const labsToPrint = isPreview ? (patient.labReports || []) : (patientData.labsToPrint || []);
  const includeMedications = patientData.includeMedications !== undefined ? patientData.includeMedications : true;
  const includeUrduTranslation = patientData.includeUrduTranslation !== undefined ? patientData.includeUrduTranslation : true;
  const includeImpression = patientData.includeImpression !== undefined ? patientData.includeImpression : true;
  const currentDateFormatted = patientData.currentDateFormatted || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const footerNote = patientData.footerNote || headerData.footerNote || 'Bring previous prescription and diagnostic reports on follow-up.';
  const doctorName = patientData.doctorName || headerData.doctorName || 'Attending Physician';
  const followUpDateToDisplay = patientData.followUpDate ||
    patient.impressionAdvice?.followUpDate ||
    patient.followUpDate ||
    '';

  const formatAge = (p) => {
    if (patientData.formatAgeDisplay) return patientData.formatAgeDisplay(p);
    return `${p.age || '48'} yrs`;
  };

  const hasBloodGroup = Boolean(
    patient.bloodGroup &&
    patient.bloodGroup.trim() !== '' &&
    patient.bloodGroup !== '—' &&
    patient.bloodGroup.toLowerCase() !== 'unknown' &&
    patient.bloodGroup.toLowerCase() !== 'n/a'
  );

  // Active / enabled sections
  const enabledSections = Array.isArray(sections) && sections.length > 0
    ? sections.filter(s => s.enabled !== false)
    : [
        { id: 'header', layout: 'vertical', align: 'full' },
        { id: 'demographics', layout: 'vertical', align: 'full' },
        { id: 'clinical_notes', layout: 'vertical', align: 'full' },
        { id: 'vitals_exam', layout: 'vertical', align: 'full' },
        { id: 'rx_medications', layout: 'vertical', align: 'full' },
        { id: 'impression_advice', layout: 'vertical', align: 'full' },
        { id: 'footer_signature', layout: 'vertical', align: 'full' }
      ];

  // Render individual section blocks
  const renderSectionBlock = (section) => {
    switch (section.id) {
      case 'header':
        return (
          <HeaderSectionRenderer
            sections={headerSections}
            data={headerData}
            isPreview={isPreview}
          />
        );

      case 'demographics':
        return (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: isPreview ? '8px 14px' : '12px 18px',
              display: 'grid',
              gridTemplateColumns: hasBloodGroup ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)',
              gap: 10,
              fontSize: isPreview ? '0.75rem' : '0.85rem',
              marginBottom: 16
            }}
          >
            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Patient Name</div>
              <div style={{ fontWeight: 800, fontSize: isPreview ? '0.85rem' : '0.975rem', color: '#0f172a' }}>{patient.name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Age / Gender</div>
              <div style={{ fontWeight: 600 }}>{formatAge(patient)} / {patient.gender}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Phone / MRN</div>
              <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{patient.phone}</div>
            </div>

            {hasBloodGroup && (
              <div>
                <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</div>
                <div style={{ fontWeight: 700, color: '#b91c1c' }}>{patient.bloodGroup}</div>
              </div>
            )}

            <div>
              <div style={{ fontSize: '0.675rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Consultation Date</div>
              <div style={{ fontWeight: 600 }}>{currentDateFormatted}</div>
            </div>
          </div>
        );

      case 'clinical_notes':
        if (!notesToPrint || notesToPrint.length === 0) return null;
        return (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: 3, marginBottom: 8, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📝</span>
              <span>Allergies &amp; Clinical Diagnosis</span>
            </h4>
            {notesToPrint.map((n, idx) => (
              <div key={n.id || idx} style={{ fontSize: '0.825rem', marginBottom: 8, lineHeight: 1.45 }}>
                {/* Drug Allergies */}
                <div style={{ marginBottom: 6, padding: '4px 8px', background: n.allergicHistory ? '#fef2f2' : '#f8fafc', borderRadius: 4, borderLeft: `3px solid ${n.allergicHistory ? '#dc2626' : '#10b981'}` }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: n.allergicHistory ? '#b91c1c' : '#047857' }}>
                    Drug Allergies:
                  </div>
                  <div style={{ fontWeight: 600, color: n.allergicHistory ? '#dc2626' : '#334155' }}>
                    {n.allergicHistory || 'No Known Drug Allergies'}
                  </div>
                </div>

                {/* Food Allergies */}
                <div style={{ marginBottom: 6, padding: '4px 8px', background: '#f8fafc', borderRadius: 4, borderLeft: '3px solid #64748b' }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>
                    Food Allergies:
                  </div>
                  <div style={{ color: '#334155' }}>
                    No Known Food Allergies
                  </div>
                </div>

                {/* Clinical Diagnosis / Assessment */}
                {(n.clinicalAssessment || patient.impressionAdvice?.impression) && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', marginBottom: 3 }}>
                      Diagnosis:
                    </div>
                    <div style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'pre-line', lineHeight: 1.5, background: '#f8fafc', padding: '6px 10px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                      {n.clinicalAssessment || patient.impressionAdvice?.impression}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'vitals_exam':
        if (!examsToPrint || examsToPrint.length === 0) return null;
        return (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: '0.825rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1.5px solid #0f172a', paddingBottom: 3, marginBottom: 8, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🩺</span>
              <span>Vital Signs &amp; Complaints</span>
            </h4>
            {examsToPrint.map((e, idx) => (
              <div key={e.id || idx} style={{ fontSize: '0.825rem' }}>
                {/* Vital Signs */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: 2 }}>
                    Vital Signs:
                  </div>
                  <div style={{ display: 'flex', gap: '6px 10px', flexWrap: 'wrap', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: 4, fontSize: '0.8rem' }}>
                    {e.vitals?.bpSystolic && <span><strong>BP:</strong> {e.vitals.bpSystolic}/{e.vitals.bpDiastolic || '80'} mmHg</span>}
                    {e.vitals?.pulse && <span><strong>Pulse:</strong> {e.vitals.pulse} /min</span>}
                    {e.vitals?.temperature && <span><strong>Temp:</strong> {e.vitals.temperature} °F</span>}
                    {e.vitals?.spO2 && <span><strong>SpO₂:</strong> {e.vitals.spO2}%</span>}
                    {e.vitals?.weight && <span><strong>Weight:</strong> {e.vitals.weight} kg</span>}
                    {e.vitals?.bloodSugar && <span><strong>BS:</strong> {e.vitals.bloodSugar} mg/dL</span>}
                  </div>
                </div>

                {/* Complaints */}
                {notesToPrint?.[0]?.chiefComplaints && (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: 2 }}>
                      Complaints:
                    </div>
                    <div style={{ color: '#1e293b', fontSize: '0.8rem', lineHeight: 1.4, background: '#f8fafc', padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
                      {notesToPrint[0].chiefComplaints}
                    </div>
                  </div>
                )}

                {/* Clinical Details */}
                {e.findings && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: 2 }}>
                      Clinical Details:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
                      {Object.entries(e.findings).map(([key, val]) => {
                        if (!val || !val.trim()) return null;
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return (
                          <div key={key} style={{ fontSize: '0.775rem', color: '#334155' }}>
                            <strong style={{ color: '#475569' }}>{label}: </strong>
                            <span>{val}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'rx_medications':
        if (!includeMedications || !patient.medications || patient.medications.length === 0) return null;
        return (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: 6, marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'serif' }}>&#8478;</span>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.04em', margin: 0 }}>
                  Rx Prescriptions
                </h4>
              </div>
              {includeUrduTranslation && (
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" }}>
                  نسخہ ادویات (طریقہ استعمال)
                </div>
              )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isPreview ? '0.785rem' : '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px', width: '35%' }}>
                    <div>Medicine Formulation</div>
                    {includeUrduTranslation && <div style={{ fontSize: '0.675rem', color: '#0284c7', direction: 'rtl' }}>دوا کا نام</div>}
                  </th>
                  <th style={{ padding: '6px 8px', width: '28%' }}>
                    <div>Frequency &amp; Route</div>
                    {includeUrduTranslation && <div style={{ fontSize: '0.675rem', color: '#0284c7', direction: 'rtl' }}>اوقات استعمال</div>}
                  </th>
                  <th style={{ padding: '6px 8px', width: '15%' }}>
                    <div>Duration</div>
                    {includeUrduTranslation && <div style={{ fontSize: '0.675rem', color: '#0284c7', direction: 'rtl' }}>مدت</div>}
                  </th>
                  <th style={{ padding: '6px 8px', width: '22%' }}>
                    <div>Instructions</div>
                    {includeUrduTranslation && <div style={{ fontSize: '0.675rem', color: '#0284c7', direction: 'rtl' }}>ہدایات</div>}
                  </th>
                </tr>
              </thead>
              <tbody>
                {patient.medications.map((m, idx) => (
                  <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: isPreview ? '0.825rem' : '0.9rem' }}>
                        {idx + 1}. {m.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                        {m.dose && <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>{m.dose}</span>}
                        {m.doseType && (
                          <span style={{ fontSize: '0.725rem', color: '#475569', background: '#f1f5f9', padding: '1px 5px', borderRadius: 3 }}>
                            {m.doseType} {includeUrduTranslation && `(${translateDoseType(m.doseType)})`}
                          </span>
                        )}
                      </div>
                    </td>

                    <td style={{ padding: '8px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.frequency}</div>
                      {includeUrduTranslation && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0369a1', direction: 'rtl', textAlign: 'left', marginTop: 1 }}>
                          {translateFrequency(m.frequency)}
                        </div>
                      )}
                      <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: 2 }}>
                        Route: {m.route} {includeUrduTranslation && `(${translateRoute(m.route)})`}
                      </div>
                    </td>

                    <td style={{ padding: '8px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>
                        {m.days ? `${m.days} days` : '—'}
                      </div>
                      {includeUrduTranslation && m.days && (
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', direction: 'rtl', textAlign: 'left' }}>
                          {translateDuration(m.days)}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '8px 8px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '0.785rem', color: '#334155' }}>
                        {m.comment || 'As advised'}
                      </div>
                      {includeUrduTranslation && m.comment && (
                        <div style={{ fontSize: '0.725rem', color: '#1e293b', direction: 'rtl', textAlign: 'left', marginTop: 2, background: '#f8fafc', padding: '2px 6px', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                          {translateInstructionText(m.comment)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'lab_reports':
        if (!labsToPrint || labsToPrint.length === 0) return null;
        return (
          <div style={{ marginBottom: 16 }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 8, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🧪</span>
              <span>Laboratory Investigations Summary</span>
            </h4>
            {labsToPrint.map((l, idx) => (
              <div key={l.id || idx} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '0.825rem', color: '#0284c7', marginBottom: 3 }}>
                  {l.title || 'Laboratory Report'} ({l.formattedDate || l.date})
                </div>
                {l.entries && l.entries.length > 0 && (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <tbody>
                      {l.entries.map((ent, eIdx) => (
                        <tr key={eIdx} style={{ borderBottom: '1px dotted #cbd5e1' }}>
                          <td style={{ padding: '3px 6px', fontWeight: 600, width: '60%' }}>{ent.key}</td>
                          <td style={{ padding: '3px 6px', width: '40%', fontFamily: 'var(--font-mono)' }}>{ent.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        );

      case 'impression_advice':
        if (!includeImpression || !patient.impressionAdvice) return null;
        return (
          <div style={{ marginBottom: 20 }}>
            {patient.impressionAdvice.impression && (
              <div style={{ marginBottom: 8 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 6, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>💡</span>
                  <span>Clinical Impression &amp; Diagnosis</span>
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                  {patient.impressionAdvice.impression}
                </div>
              </div>
            )}

            {patient.impressionAdvice.advice && (
              <div style={{ marginBottom: 8 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 6, letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>📋</span>
                  <span>General Advice &amp; Follow-up Instructions</span>
                </h4>
                <div style={{ fontSize: '0.825rem', color: '#334155', whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                  {patient.impressionAdvice.advice}
                </div>

                {includeUrduTranslation && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '10px 14px',
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      direction: 'rtl',
                      textAlign: 'right'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: '#0f172a',
                        marginBottom: 4,
                        fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
                      }}
                    >
                      ڈاکٹر کی ضروری ہدایات و احتیاطی تدابیر (برائے مریض):
                    </div>
                    <div
                      style={{
                        fontSize: '0.825rem',
                        color: '#1e293b',
                        fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
                        lineHeight: 1.6
                      }}
                    >
                      {translateInstructionText(patient.impressionAdvice.advice)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reference Safety Warning Banner */}
            <div
              style={{
                marginTop: 12,
                padding: '8px 14px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8
              }}
            >
              <div
                style={{
                  fontSize: '0.825rem',
                  color: '#b91c1c',
                  fontWeight: 700,
                  fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
                  direction: 'rtl'
                }}
              >
                ہدایات: براہ کرم مشورہ کے بغیر دوائی بند، کم یا تبدیل نہ کریں۔
              </div>

              {followUpDateToDisplay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                  <span>Next Follow-up:</span>
                  <span style={{ color: '#0284c7', background: '#e0f2fe', padding: '2px 8px', borderRadius: 4, fontWeight: 800, border: '1px solid #bae6fd' }}>
                    {followUpDateToDisplay}
                  </span>
                  <span style={{ fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", color: '#0284c7', fontWeight: 700 }}>
                    چیک اپ
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case 'footer_signature':
        return (
          <div style={{ marginTop: 'auto', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <QrCode size={44} color="#0f172a" />
              <div style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>Verified Digital Prescription</div>
                <div>Valid across accredited pharmacies</div>
                {footerNote ? (
                  <div style={{ color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
                    {footerNote}
                  </div>
                ) : (
                  <div>Scan QR to verify authentic record</div>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', minWidth: 200, borderTop: '1.5px solid #0f172a', paddingTop: 6 }}>
              <div style={{ fontWeight: 800, fontSize: '0.925rem', color: '#0f172a' }}>
                {doctorName || 'Attending Physician'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                Authorized Signatory &amp; Stamp
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Group sections into rows:
  // If adjacent sections are horizontal (e.g. left column 40% and right column 60%),
  // pair them side by side in a 2-column flex row!
  const rows = [];
  let pendingRow = [];

  enabledSections.forEach((section) => {
    if (section.layout === 'horizontal' && (section.align === 'left' || section.align === 'right')) {
      if (pendingRow.length === 0) {
        pendingRow.push(section);
      } else if (pendingRow.length === 1 && pendingRow[0].layout === 'horizontal' && pendingRow[0].align !== section.align) {
        pendingRow.push(section);
        rows.push({ type: 'columns', items: pendingRow });
        pendingRow = [];
      } else {
        rows.push({ type: 'single', items: pendingRow });
        pendingRow = [section];
      }
    } else {
      if (pendingRow.length > 0) {
        rows.push({ type: 'single', items: pendingRow });
        pendingRow = [];
      }
      rows.push({ type: 'single', items: [section] });
    }
  });

  if (pendingRow.length > 0) {
    rows.push({ type: 'single', items: pendingRow });
  }

  return (
    <div style={{ width: '100%' }}>
      {rows.map((row, rIdx) => {
        if (row.type === 'columns') {
          const leftItem = row.items.find(i => i.align === 'left') || row.items[0];
          const rightItem = row.items.find(i => i.align === 'right') || row.items[1];

          return (
            <div
              key={`p-row-${rIdx}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
                gap: 18,
                marginBottom: 14
              }}
            >
              <div style={{ flex: '0 0 38%', maxWidth: '38%', borderRight: '1px dashed #e2e8f0', paddingRight: 14 }}>
                {renderSectionBlock(leftItem)}
              </div>
              <div style={{ flex: '0 0 60%', maxWidth: '60%' }}>
                {renderSectionBlock(rightItem)}
              </div>
            </div>
          );
        }

        const singleItem = row.items[0];
        return (
          <div key={`p-row-${rIdx}`} style={{ width: '100%' }}>
            {renderSectionBlock(singleItem)}
          </div>
        );
      })}
    </div>
  );
};
