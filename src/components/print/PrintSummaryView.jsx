import React, { useState, useMemo, useEffect } from 'react';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import {
  Download,
  Printer,
  ArrowLeft,
  Building2,
  Stethoscope,
  CheckSquare,
  QrCode,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Languages,
  Stamp
} from 'lucide-react';
import {
  translateDoseType,
  translateFrequency,
  translateRoute,
  translateDuration,
  translateInstructionText,
  translateDoctorAdvice,
  urduDigits
} from '../../services/prescriptionTranslation';

export const PrintSummaryView = () => {
  const { activePatient, clinicConfig, navigateTo, showToast } = usePatients();
  const { currentUser, doctors = [], doctorLetterheads = {} } = useAuth();
  const isDoctorUser = currentUser?.role === 'doctor';

  // Selected physician for letterhead branding (strictly locked to logged-in doctor, or first doctor for admin)
  const [selectedDoctorId, setSelectedDoctorId] = useState(() => {
    if (currentUser?.role === 'doctor' && currentUser?.id) {
      return currentUser.id;
    }
    if (doctors.length > 0) {
      return doctors[0].id;
    }
    return 'clinic';
  });

  // Ensure logged-in doctor is always locked to their own physician ID
  useEffect(() => {
    if (isDoctorUser && currentUser?.id && selectedDoctorId !== currentUser.id) {
      setSelectedDoctorId(currentUser.id);
    }
  }, [isDoctorUser, currentUser?.id, selectedDoctorId]);

  // Selected practice hospital location (defaults to 'all')
  const [selectedLocationId, setSelectedLocationId] = useState('all');

  // Calculate effective letterhead based on selected physician or clinic defaults
  const effectiveLetterhead = useMemo(() => {
    if (selectedDoctorId === 'clinic') {
      const defaultLoc = {
        id: 'loc-default',
        hospitalName: clinicConfig.clinicName || 'PatientCare Medical Center',
        department: clinicConfig.address || '',
        address: '',
        consultationHours: '',
        phone: clinicConfig.phone || ''
      };
      return {
        doctorName: clinicConfig.doctorName || 'Consultant Physician',
        qualifications: clinicConfig.qualifications || 'MBBS, FCPS',
        regNumber: clinicConfig.regNumber || '',
        specialtyTitle: '',
        clinicName: clinicConfig.clinicName || 'PatientCare Medical Center',
        tagline: clinicConfig.tagline || '',
        address: clinicConfig.address || '',
        phone: clinicConfig.phone || '',
        email: clinicConfig.email || '',
        consultationHours: '',
        footerNote: '',
        layoutStyle: clinicConfig.layoutStyle || 'split',
        dividerStyle: clinicConfig.dividerStyle || 'solid',
        schedulePosition: clinicConfig.schedulePosition || 'banner',
        locations: [defaultLoc]
      };
    }

    const doc = doctors.find(d => d.id === selectedDoctorId);
    const customLh = doctorLetterheads[selectedDoctorId];

    if (customLh && customLh.enabled) {
      const locations = (Array.isArray(customLh.locations) && customLh.locations.length > 0)
        ? customLh.locations
        : [
            {
              id: 'loc-1',
              hospitalName: customLh.clinicName || clinicConfig.clinicName || 'PatientCare Medical Center',
              department: customLh.address || clinicConfig.address || '',
              address: '',
              consultationHours: customLh.consultationHours || '',
              phone: customLh.phone || doc?.phone || clinicConfig.phone || ''
            }
          ];

      return {
        doctorName: customLh.doctorName || doc?.name || clinicConfig.doctorName || 'Consultant Physician',
        qualifications: customLh.qualifications || doc?.qualifications || clinicConfig.qualifications || 'MBBS, FCPS',
        regNumber: customLh.pmcNumber || doc?.pmcNumber || clinicConfig.regNumber || '',
        specialtyTitle: customLh.specialtyTitle || (doc?.specialty ? `Consultant in ${doc.specialty}` : ''),
        clinicName: locations[0]?.hospitalName || customLh.clinicName || clinicConfig.clinicName || 'PatientCare Medical Center',
        tagline: customLh.tagline !== undefined ? customLh.tagline : (clinicConfig.tagline || ''),
        address: locations[0]?.department || customLh.address || clinicConfig.address || '',
        phone: locations[0]?.phone || customLh.phone || doc?.phone || clinicConfig.phone || '',
        email: customLh.email || doc?.email || clinicConfig.email || '',
        consultationHours: locations[0]?.consultationHours || customLh.consultationHours || '',
        footerNote: customLh.footerNote || '',
        layoutStyle: customLh.layoutStyle || 'split',
        dividerStyle: customLh.dividerStyle || 'solid',
        schedulePosition: customLh.schedulePosition || 'banner',
        locations
      };
    }

    if (doc) {
      const defaultLoc = {
        id: 'loc-doc',
        hospitalName: clinicConfig.clinicName || 'PatientCare Medical Center',
        department: clinicConfig.address || '',
        address: '',
        consultationHours: '',
        phone: doc.phone || clinicConfig.phone || ''
      };
      return {
        doctorName: doc.name || clinicConfig.doctorName || 'Consultant Physician',
        qualifications: doc.qualifications || clinicConfig.qualifications || 'MBBS, FCPS',
        regNumber: doc.pmcNumber || clinicConfig.regNumber || '',
        specialtyTitle: doc.specialty ? `Consultant in ${doc.specialty}` : '',
        clinicName: clinicConfig.clinicName || 'PatientCare Medical Center',
        tagline: clinicConfig.tagline || '',
        address: clinicConfig.address || '',
        phone: doc.phone || clinicConfig.phone || '',
        email: doc.email || clinicConfig.email || '',
        consultationHours: '',
        footerNote: '',
        layoutStyle: 'split',
        dividerStyle: 'solid',
        schedulePosition: 'banner',
        locations: [defaultLoc]
      };
    }

    const defaultLoc = {
      id: 'loc-default',
      hospitalName: clinicConfig.clinicName || 'PatientCare Medical Center',
      department: clinicConfig.address || '',
      address: '',
      consultationHours: '',
      phone: clinicConfig.phone || ''
    };
    return {
      doctorName: clinicConfig.doctorName || 'Consultant Physician',
      qualifications: clinicConfig.qualifications || 'MBBS, FCPS',
      regNumber: clinicConfig.regNumber || '',
      specialtyTitle: '',
      clinicName: clinicConfig.clinicName || 'PatientCare Medical Center',
      tagline: clinicConfig.tagline || '',
      address: clinicConfig.address || '',
      phone: clinicConfig.phone || '',
      email: clinicConfig.email || '',
      consultationHours: '',
      footerNote: '',
      layoutStyle: 'split',
      dividerStyle: 'solid',
      schedulePosition: 'banner',
      locations: [defaultLoc]
    };
  }, [selectedDoctorId, doctors, doctorLetterheads, clinicConfig]);

  // Selected specific location if chosen
  const activeLocation = useMemo(() => {
    if (selectedLocationId === 'all') return null;
    return effectiveLetterhead.locations?.find(l => l.id === selectedLocationId) || null;
  }, [selectedLocationId, effectiveLetterhead]);

  // Checkbox selections for customized print output
  const [selectedNotes, setSelectedNotes] = useState(() => {
    const map = {};
    if (activePatient?.notes?.length > 0) {
      map[activePatient.notes[0].id] = true;
    }
    return map;
  });

  const [selectedExams, setSelectedExams] = useState(() => {
    const map = {};
    if (activePatient?.examinations?.length > 0) {
      map[activePatient.examinations[0].id] = true;
    }
    return map;
  });

  const [selectedLabs, setSelectedLabs] = useState(() => {
    const map = {};
    if (activePatient?.labReports?.length > 0) {
      map[activePatient.labReports[0].id] = true;
    }
    return map;
  });

  const [includeMedications, setIncludeMedications] = useState(true);
  const [includeUrduTranslation, setIncludeUrduTranslation] = useState(true);
  const [includeImpression, setIncludeImpression] = useState(true);

  if (!activePatient) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>No patient selected for printing.</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigateTo('list')}
        >
          &larr; Back to Patients List
        </button>
      </div>
    );
  }

  const toggleNote = (id) => setSelectedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleExam = (id) => setSelectedExams(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleLab = (id) => setSelectedLabs(prev => ({ ...prev, [id]: !prev[id] }));

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast('Triggering print dialog to save as PDF...');
    window.print();
  };

  const formatAgeDisplay = (patient) => {
    if (patient.ageSource === 'dob' && patient.dob) {
      const birthDate = new Date(patient.dob);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      return `${Math.abs(ageDate.getUTCFullYear() - 1970)} yrs`;
    }
    if (patient.age) {
      return `${patient.age} yrs (approx)`;
    }
    return 'Unknown';
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const notesToPrint = (activePatient.notes || []).filter(n => selectedNotes[n.id]);
  const examsToPrint = (activePatient.examinations || []).filter(e => selectedExams[e.id]);
  const labsToPrint = (activePatient.labReports || []).filter(l => selectedLabs[l.id]);

  return (
    <div>
      {/* Top back navigation */}
      <button
        type="button"
        className="breadcrumb-back no-print"
        onClick={() => navigateTo('detail', activePatient.id)}
      >
        <ArrowLeft size={16} />
        <span>Return to {activePatient.name}</span>
      </button>

      <div className="no-print" style={{ marginBottom: 24 }}>
        <h1 className="page-title">Prescription &amp; Medical Summary</h1>
        <p className="page-subtitle">
          Customize sections to include, review the live letterhead preview, then download PDF or print.
        </p>
      </div>

      <div className="print-layout">
        {/* Left Selection Panel */}
        <div className="print-selection-panel no-print">
          {/* Attending Physician Letterhead Selector */}
          <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-cyan)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase' }}>
              <Stethoscope size={14} />
              <span>Attending Letterhead</span>
            </div>
            {isDoctorUser ? (
              /* Doctor users strictly see only their own letterhead identity */
              <div style={{
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--brand-cyan-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    flexShrink: 0
                  }}>
                    👨‍⚕️
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser?.name || effectiveLetterhead.doctorName}
                    </div>
                    <div style={{ fontSize: '0.725rem', color: 'var(--brand-cyan)', fontWeight: 600 }}>
                      {currentUser?.specialty ? `Consultant in ${currentUser.specialty}` : (effectiveLetterhead.specialtyTitle || 'Attending Physician')}
                    </div>
                  </div>
                </div>

                <span className="badge badge-success" style={{ fontSize: '0.675rem', padding: '3px 8px', flexShrink: 0 }}>
                  ✓ Your Letterhead
                </span>
              </div>
            ) : (
              /* Only Admin or Staff can choose which attending letterhead to apply */
              <>
                <select
                  className="modern-select"
                  value={selectedDoctorId}
                  onChange={(e) => {
                    setSelectedDoctorId(e.target.value);
                    setSelectedLocationId('all');
                  }}
                >
                  <option value="clinic">🏥 Clinic Master Default</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      👨‍⚕️ {d.name} {d.specialty ? `(${d.specialty})` : ''} {doctorLetterheads[d.id]?.enabled ? '★' : ''}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.3 }}>
                  {selectedDoctorId !== 'clinic' && doctorLetterheads[selectedDoctorId]?.enabled ? (
                    <span style={{ color: 'var(--brand-emerald)', fontWeight: 600 }}>✓ Physician Custom Letterhead</span>
                  ) : (
                    <span>Using default clinic letterhead formatting</span>
                  )}
                </div>
              </>
            )}

            {/* Practice Hospital Today Dropdown */}
            {effectiveLetterhead.locations && effectiveLetterhead.locations.length > 1 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={13} color="var(--brand-cyan)" />
                  <span>Practice Hospital Today:</span>
                </div>
                <select
                  className="modern-select"
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                >
                  <option value="all">🏢 All Hospitals (Chamber Schedule)</option>
                  {effectiveLetterhead.locations.map((loc, idx) => (
                    <option key={loc.id || idx} value={loc.id}>
                      🏥 {loc.hospitalName} {loc.consultationHours ? `(${loc.consultationHours})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 16 }}>
            Report Inclusions
          </div>

          {/* Clinical Note Selection */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Clinical History
            </div>
            {activePatient.notes?.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No notes available</p>
            ) : (
              activePatient.notes?.map((n, idx) => (
                <label key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer', marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!selectedNotes[n.id]}
                    onChange={() => toggleNote(n.id)}
                  />
                  <span>{n.formattedDate}</span>
                  {idx === 0 && <span className="badge badge-latest" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>LATEST</span>}
                </label>
              ))
            )}
          </div>

          {/* Physical Exams Selection */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Physical Exam &amp; Vitals
            </div>
            {activePatient.examinations?.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No exams on file</p>
            ) : (
              activePatient.examinations?.map((e, idx) => (
                <label key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer', marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!selectedExams[e.id]}
                    onChange={() => toggleExam(e.id)}
                  />
                  <span>{e.formattedDate}</span>
                  {idx === 0 && <span className="badge badge-latest" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>LATEST</span>}
                </label>
              ))
            )}
          </div>

          {/* Lab Reports Selection */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Lab Reports &amp; Scans
            </div>
            {activePatient.labReports?.length === 0 ? (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>No lab records</p>
            ) : (
              activePatient.labReports?.map((l) => (
                <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer', marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!selectedLabs[l.id]}
                    onChange={() => toggleLab(l.id)}
                  />
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 220 }}>
                    {l.title || l.formattedDate || l.date}
                  </span>
                </label>
              ))
            )}
          </div>

          {/* Medications Selection */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Prescriptions (Rx)
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeMedications}
                onChange={() => setIncludeMedications(!includeMedications)}
              />
              <span>Include active medicines ({activePatient.medications?.length || 0})</span>
            </label>

            {includeMedications && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.825rem', cursor: 'pointer', marginTop: 6, marginLeft: 22, color: 'var(--brand-cyan)' }}>
                <input
                  type="checkbox"
                  checked={includeUrduTranslation}
                  onChange={() => setIncludeUrduTranslation(!includeUrduTranslation)}
                />
                <span style={{ fontWeight: 600 }}>Bilingual English + Urdu (اردو ترجمہ)</span>
              </label>
            )}
          </div>

          {/* Impression & Advice */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>
              Impression &amp; Advice
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeImpression}
                onChange={() => setIncludeImpression(!includeImpression)}
              />
              <span>Include doctor's clinical instructions</span>
            </label>
          </div>

          {/* Clinic Brand Reminder */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 14, fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Letterhead header reflects your settings. To customize clinic address, doctor qualifications or contact numbers, click the doctor name in the top navbar.
          </div>
        </div>

        {/* Live Preview & Action Area */}
        <div>
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Official Letterhead Preview (A4)
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handlePrint}
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
              <button
                type="button"
                className="btn btn-cyan"
                onClick={handleDownloadPDF}
              >
                <Download size={16} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* A4 Sheet */}
          <div className="a4-page" id="printable-summary-document">
            {/* Watermark Rx in background */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '24rem',
                fontFamily: 'serif',
                fontWeight: 900,
                color: 'rgba(15, 23, 42, 0.02)',
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              &#8478;
            </div>

            {/* Header with Dynamic Layout Architecture */}
            {(() => {
              const layoutStyle = effectiveLetterhead.layoutStyle || 'split';
              const dividerStyle = effectiveLetterhead.dividerStyle || 'solid';

              const dividerCss = {
                paddingBottom: 16,
                marginBottom: 16,
                ...(dividerStyle === 'double'
                  ? { borderBottom: '4px double #0f172a' }
                  : dividerStyle === 'cyan-accent'
                  ? { borderBottom: '3px solid #0284c7', boxShadow: '0 2px 4px rgba(2, 132, 199, 0.15)' }
                  : dividerStyle === 'minimal'
                  ? { borderBottom: '1px solid #cbd5e1' }
                  : dividerStyle === 'none'
                  ? { borderBottom: 'none' }
                  : { borderBottom: '2px solid #0f172a' })
              };

              const doctorBlock = (align = 'left') => (
                <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
                    {effectiveLetterhead.doctorName || 'Consultant Physician'}
                  </h2>
                  {effectiveLetterhead.specialtyTitle && (
                    <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: 700, marginTop: 2 }}>
                      {effectiveLetterhead.specialtyTitle}
                    </div>
                  )}
                  <div style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 600, marginTop: 2, whiteSpace: 'pre-line', lineHeight: 1.35 }}>
                    {effectiveLetterhead.qualifications || 'MBBS, FCPS'}
                  </div>
                  {effectiveLetterhead.regNumber && (
                    <div style={{ fontSize: '0.775rem', color: '#64748b', marginTop: 2 }}>
                      PMDC / PMC Reg: <strong style={{ color: '#0f172a' }}>{effectiveLetterhead.regNumber}</strong>
                    </div>
                  )}
                </div>
              );

              const hospitalBlock = (align = 'right') => (
                <div style={{ textAlign: align, display: 'flex', flexDirection: 'column', alignItems: align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end', maxWidth: align === 'center' ? '100%' : 350 }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {activeLocation ? activeLocation.hospitalName : (effectiveLetterhead.locations[0]?.hospitalName || effectiveLetterhead.clinicName || 'PatientCare Medical Center')}
                  </h3>
                  {effectiveLetterhead.tagline && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                      {effectiveLetterhead.tagline}
                    </div>
                  )}
                  <div style={{ fontSize: '0.775rem', color: '#334155', fontWeight: 600, marginTop: 3 }}>
                    {activeLocation ? (activeLocation.department || activeLocation.address) : (effectiveLetterhead.locations[0]?.department || effectiveLetterhead.address || 'Clinic Diagnostic Center')}
                  </div>
                  {activeLocation?.address && activeLocation?.department && (
                    <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                      {activeLocation.address}
                    </div>
                  )}
                  {(activeLocation?.phone || effectiveLetterhead.locations[0]?.phone || effectiveLetterhead.phone) && (
                    <div style={{ fontSize: '0.775rem', color: '#0284c7', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      Ph: {activeLocation ? activeLocation.phone : (effectiveLetterhead.locations[0]?.phone || effectiveLetterhead.phone)}
                    </div>
                  )}
                </div>
              );

              if (layoutStyle === 'centered') {
                return (
                  <div style={{ ...dividerCss, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    {doctorBlock('center')}
                    <div style={{ width: 48, height: 2, background: '#0284c7', margin: '10px auto', borderRadius: 2 }} />
                    {hospitalBlock('center')}
                  </div>
                );
              }

              if (layoutStyle === 'inverted') {
                return (
                  <div style={{ ...dividerCss, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {hospitalBlock('left')}
                    {doctorBlock('right')}
                  </div>
                );
              }

              if (layoutStyle === 'stacked') {
                return (
                  <div style={{ ...dividerCss, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', borderLeft: '4px solid #0284c7', paddingLeft: 16 }}>
                    {doctorBlock('left')}
                    <div style={{ width: '100%', height: 1, background: '#e2e8f0', margin: '8px 0' }} />
                    {hospitalBlock('left')}
                  </div>
                );
              }

              // Default: 'split'
              return (
                <div style={{ ...dividerCss, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  {doctorBlock('left')}
                  {hospitalBlock('right')}
                </div>
              );
            })()}

            {/* Practice Schedule or Multi-Hospital Chambers Strip */}
            {activeLocation ? (
              activeLocation.consultationHours && (
                <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '6px 12px', fontSize: '0.75rem', color: '#475569', marginBottom: 16 }}>
                  <span>🏥 <strong>{activeLocation.hospitalName}:</strong> {activeLocation.consultationHours} {activeLocation.department ? `· ${activeLocation.department}` : ''}</span>
                  <span>Official Patient Prescription &amp; Clinical Record</span>
                </div>
              )
            ) : (
              (effectiveLetterhead.locations || []).length > 1 ? (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 6, padding: '9px 12px', marginBottom: 16 }}>
                  <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.04em', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Clinical Practice Chambers &amp; Schedule</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Active Multi-Hospital Practice</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: effectiveLetterhead.locations.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
                    {effectiveLetterhead.locations.map((loc, idx) => (
                      <div key={loc.id || idx} style={{ borderLeft: '2px solid #0284c7', paddingLeft: 8, fontSize: '0.735rem' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          🏥 {loc.hospitalName}
                        </div>
                        {loc.department && <div style={{ color: '#334155', fontWeight: 600 }}>{loc.department}</div>}
                        {loc.address && <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{loc.address}</div>}
                        {loc.consultationHours && (
                          <div style={{ color: '#0284c7', fontWeight: 700, marginTop: 1 }}>
                            🕒 {loc.consultationHours}
                          </div>
                        )}
                        {loc.phone && (
                          <div style={{ color: '#475569', fontFamily: 'var(--font-mono)', fontSize: '0.685rem' }}>
                            📞 {loc.phone}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                effectiveLetterhead.consultationHours && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 4, padding: '5px 12px', fontSize: '0.75rem', color: '#475569', marginBottom: 16 }}>
                    <span>🕒 <strong>Consultation Hours:</strong> {effectiveLetterhead.consultationHours}</span>
                    <span>Official Patient Prescription &amp; Clinical Record</span>
                  </div>
                )
              )
            )}

            {/* Patient Demographics Bar */}
            {(() => {
              const hasBloodGroup = Boolean(
                activePatient.bloodGroup &&
                activePatient.bloodGroup.trim() !== '' &&
                activePatient.bloodGroup !== '—' &&
                activePatient.bloodGroup.toLowerCase() !== 'unknown' &&
                activePatient.bloodGroup.toLowerCase() !== 'n/a'
              );

              return (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '12px 18px',
                    display: 'grid',
                    gridTemplateColumns: hasBloodGroup ? 'repeat(5, 1fr)' : 'repeat(4, 1fr)',
                    gap: 12,
                    fontSize: '0.85rem',
                    marginBottom: 24
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Patient Name</div>
                    <div style={{ fontWeight: 800, fontSize: '0.975rem', color: '#0f172a' }}>{activePatient.name}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Age / Gender</div>
                    <div style={{ fontWeight: 600 }}>{formatAgeDisplay(activePatient)} / {activePatient.gender}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Phone / MRN</div>
                    <div style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{activePatient.phone}</div>
                  </div>

                  {hasBloodGroup && (
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</div>
                      <div style={{ fontWeight: 700, color: '#b91c1c' }}>{activePatient.bloodGroup}</div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Consultation Date</div>
                    <div style={{ fontWeight: 600 }}>{currentDateFormatted}</div>
                  </div>
                </div>
              );
            })()}

            {/* Clinical Notes Section */}
            {notesToPrint.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 8, letterSpacing: '0.04em' }}>
                  Clinical History &amp; Complaints
                </h4>
                {notesToPrint.map((n) => (
                  <div key={n.id} style={{ fontSize: '0.875rem', marginBottom: 12 }}>
                    {n.chiefComplaint && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>Chief Complaint: </span>
                        <span>{n.chiefComplaint}</span>
                      </div>
                    )}
                    {n.presentIllness && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>History of Present Illness: </span>
                        <span>{n.presentIllness}</span>
                      </div>
                    )}
                    {n.pastHistory && (
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontWeight: 700 }}>Past Medical History: </span>
                        <span>{n.pastHistory}</span>
                      </div>
                    )}
                    {n.allergicHistory && (
                      <div style={{ marginBottom: 4, color: '#dc2626' }}>
                        <span style={{ fontWeight: 700 }}>Known Allergies: </span>
                        <span>{n.allergicHistory}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Physical Examination & Vitals Section */}
            {examsToPrint.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 8, letterSpacing: '0.04em' }}>
                  Recorded Vital Signs
                </h4>
                {examsToPrint.map((e) => (
                  <div key={e.id} style={{ fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', background: '#f1f5f9', padding: '10px 14px', borderRadius: 6, marginBottom: 8 }}>
                      {e.vitals?.bpSystolic && <span><strong>BP:</strong> {e.vitals.bpSystolic}/{e.vitals.bpDiastolic || '80'} mmHg</span>}
                      {e.vitals?.pulse && <span><strong>Pulse:</strong> {e.vitals.pulse} bpm</span>}
                      {e.vitals?.temperature && <span><strong>Temp:</strong> {e.vitals.temperature} °C</span>}
                      {e.vitals?.spO2 && <span><strong>SpO₂:</strong> {e.vitals.spO2}%</span>}
                      {e.vitals?.weight && <span><strong>Weight:</strong> {e.vitals.weight} kg</span>}
                      {e.vitals?.bloodSugar && <span><strong>RBS:</strong> {e.vitals.bloodSugar} mg/dL</span>}
                    </div>

                    {e.findings && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6 }}>
                        {Object.entries(e.findings).map(([key, val]) => {
                          if (!val || !val.trim()) return null;
                          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                          return (
                            <div key={key} style={{ fontSize: '0.825rem' }}>
                              <span style={{ fontWeight: 700, color: '#475569' }}>{label}: </span>
                              <span>{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Lab Reports Section */}
            {labsToPrint.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', borderBottom: '1px solid #cbd5e1', paddingBottom: 4, marginBottom: 8, letterSpacing: '0.04em' }}>
                  Laboratory Investigations Summary
                </h4>
                {labsToPrint.map((l) => (
                  <div key={l.id} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0284c7', marginBottom: 4 }}>
                      {l.title || 'Laboratory Report'} ({l.formattedDate || l.date})
                    </div>
                    {l.entries && l.entries.length > 0 && (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                        <tbody>
                          {l.entries.map((ent, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px dotted #cbd5e1' }}>
                              <td style={{ padding: '4px 8px', fontWeight: 600, width: '60%' }}>{ent.key}</td>
                              <td style={{ padding: '4px 8px', width: '40%', fontFamily: 'var(--font-mono)' }}>{ent.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Medications / Prescription Section */}
            {includeMedications && activePatient.medications?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0f172a', paddingBottom: 6, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', fontFamily: 'serif' }}>&#8478;</span>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.04em' }}>
                      Rx Prescriptions
                    </h4>
                  </div>
                  {includeUrduTranslation && (
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif" }}>
                      نسخہ ادویات (طریقہ استعمال)
                    </div>
                  )}
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', width: '34%' }}>
                        <div>Medicine Formulation</div>
                        {includeUrduTranslation && (
                          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#0284c7', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 3 }}>
                            دوا کا نام اور قسم
                          </div>
                        )}
                      </th>
                      <th style={{ padding: '8px 10px', width: '28%' }}>
                        <div>Frequency &amp; Route</div>
                        {includeUrduTranslation && (
                          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#0284c7', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 3 }}>
                            اوقات اور طریقہ استعمال
                          </div>
                        )}
                      </th>
                      <th style={{ padding: '8px 10px', width: '14%' }}>
                        <div>Duration</div>
                        {includeUrduTranslation && (
                          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#0284c7', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 3 }}>
                            مدت (کتنے دن)
                          </div>
                        )}
                      </th>
                      <th style={{ padding: '8px 10px', width: '24%' }}>
                        <div>Instructions</div>
                        {includeUrduTranslation && (
                          <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#0284c7', direction: 'rtl', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 3 }}>
                            ضروری ہدایات برائے مریض
                          </div>
                        )}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePatient.medications.map((m, idx) => (
                      <tr key={m.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 10px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.925rem' }}>
                            {idx + 1}. {m.name}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 3 }}>
                            {m.dose && (
                              <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>
                                {m.dose}
                              </span>
                            )}
                            {m.doseType && (
                              <span style={{ fontSize: '0.775rem', color: '#475569', background: '#f1f5f9', padding: '1px 6px', borderRadius: 3, fontWeight: 500, fontFamily: includeUrduTranslation ? "'Noto Sans Arabic', 'Segoe UI', sans-serif" : 'inherit' }}>
                                {m.doseType} {includeUrduTranslation && `(${translateDoseType(m.doseType)})`}
                              </span>
                            )}
                          </div>
                        </td>

                        <td style={{ padding: '10px 10px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{m.frequency}</div>
                          {includeUrduTranslation && (
                            <div style={{ fontSize: '0.785rem', fontWeight: 600, color: '#0369a1', direction: 'rtl', textAlign: 'left', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 2 }}>
                              {translateFrequency(m.frequency)}
                            </div>
                          )}
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
                            Route: {m.route} {includeUrduTranslation && `(${translateRoute(m.route)})`}
                          </div>
                        </td>

                        <td style={{ padding: '10px 10px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>
                            {m.days ? `${m.days} days` : '—'}
                          </div>
                          {includeUrduTranslation && m.days && (
                            <div style={{ fontSize: '0.785rem', fontWeight: 700, color: '#0284c7', direction: 'rtl', textAlign: 'left', fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif", marginTop: 2 }}>
                              {translateDuration(m.days)}
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '10px 10px', verticalAlign: 'top' }}>
                          <div style={{ fontSize: '0.825rem', color: '#334155', fontWeight: 500 }}>
                            {m.comment || 'As advised'}
                          </div>
                          {includeUrduTranslation && m.comment && (
                            <div
                              style={{
                                fontSize: '0.775rem',
                                fontWeight: 500,
                                color: '#1e293b',
                                direction: 'rtl',
                                textAlign: 'left',
                                marginTop: 4,
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: 4,
                                padding: '3px 8px',
                                fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif",
                                lineHeight: 1.5
                              }}
                            >
                              {translateInstructionText(m.comment)}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Impression & Advice */}
            {includeImpression && activePatient.impressionAdvice && (
              <div style={{ marginBottom: 36 }}>
                {activePatient.impressionAdvice.impression && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>
                      Clinical Impression / Diagnosis:
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: 2, whiteSpace: 'pre-wrap' }}>
                      {activePatient.impressionAdvice.impression}
                    </div>
                  </div>
                )}

                {activePatient.impressionAdvice.advice && (
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#0f172a' }}>
                      Follow-up &amp; Doctor's Instructions:
                    </div>
                    <div style={{ fontSize: '0.875rem', marginTop: 2, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                      {activePatient.impressionAdvice.advice}
                    </div>

                    {/* Dedicated Urdu Doctor's Instructions & Precautions Section */}
                    {includeUrduTranslation && (
                      <div
                        style={{
                          marginTop: 14,
                          padding: '12px 16px',
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          direction: 'rtl',
                          textAlign: 'right'
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            color: '#0f172a',
                            marginBottom: 8,
                            fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
                          }}
                        >
                          ڈاکٹر کی ضروری ہدایات و احتیاطی تدابیر (برائے مریض):
                        </div>
                        <div
                          style={{
                            fontSize: '0.85rem',
                            color: '#1e293b',
                            lineHeight: 1.8,
                            fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, sans-serif"
                          }}
                        >
                          {translateDoctorAdvice(activePatient.impressionAdvice.advice).map((instr, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontWeight: 800, color: '#0284c7', minWidth: 20 }}>{urduDigits(idx + 1)}.</span>
                              <span>{instr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Footer verification & doctor signature */}
            <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <QrCode size={48} color="#0f172a" />
                <div style={{ fontSize: '0.725rem', color: '#64748b', lineHeight: 1.3 }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>Verified Digital Prescription</div>
                  <div>Valid across accredited pharmacies</div>
                  {effectiveLetterhead.footerNote ? (
                    <div style={{ color: '#0284c7', fontWeight: 600, marginTop: 3 }}>
                      {effectiveLetterhead.footerNote}
                    </div>
                  ) : (
                    <div>Scan QR to verify authentic record</div>
                  )}
                </div>
              </div>

              <div style={{ textAlign: 'center', width: 220, borderTop: '1px solid #0f172a', paddingTop: 8 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                  {effectiveLetterhead.doctorName || 'Attending Physician'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Authorized Signatory &amp; Stamp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
