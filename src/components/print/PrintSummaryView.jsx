import React, { useState, useMemo, useEffect } from 'react';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { HeaderSectionRenderer } from '../common/HeaderSectionRenderer';
import { PrescriptionSectionRenderer } from '../common/PrescriptionSectionRenderer';
import { DoctorLayoutCustomizerModal } from './DoctorLayoutCustomizerModal';
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
  Stamp,
  Sliders
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
  const { currentUser, doctors = [], doctorLetterheads = {}, updateDoctorLetterhead } = useAuth();
  const isDoctorUser = currentUser?.role === 'doctor';

  // Toggle for Doctor Layout & Letterhead Customizer Modal
  const [showLayoutModal, setShowLayoutModal] = useState(false);

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
        headerSections: customLh.headerSections || null,
        prescriptionSections: customLh.prescriptionSections || null,
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
        headerSections: null,
        prescriptionSections: null,
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
      headerSections: null,
      prescriptionSections: null,
      locations: [defaultLoc]
    };
  }, [selectedDoctorId, doctors, doctorLetterheads, clinicConfig]);

  // Save updated letterhead configuration from in-page customizer modal
  const handleSaveDoctorLayout = async (updatedData) => {
    try {
      const targetDocId = (isDoctorUser && currentUser?.id)
        ? currentUser.id
        : (selectedDoctorId !== 'clinic' ? selectedDoctorId : (doctors[0]?.id || 'clinic'));

      await updateDoctorLetterhead(targetDocId, updatedData);
      showToast('Prescription layout & letterhead updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update letterhead:', err);
      showToast('Failed to save layout: ' + err.message, 'error');
    }
  };

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

            {/* Practice Hospital Today Dropdown & Edit Layout Button */}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Building2 size={13} color="var(--brand-cyan)" />
                  <span>Practice Hospital Today:</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLayoutModal(true)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.72rem',
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    borderRadius: 4,
                    height: 26,
                    fontWeight: 700,
                    color: 'var(--brand-cyan)',
                    borderColor: 'var(--brand-cyan-light)',
                    background: 'var(--brand-cyan-light, #e0f2fe)'
                  }}
                  title="Customize prescription body layout and doctor letterhead"
                >
                  <Sliders size={12} />
                  <span>Edit Layout</span>
                </button>
              </div>

              {effectiveLetterhead.locations && effectiveLetterhead.locations.length > 1 ? (
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
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🏥 {effectiveLetterhead.locations?.[0]?.hospitalName || effectiveLetterhead.clinicName || 'PatientCare Medical Center'}
                </div>
              )}
            </div>
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

            {/* Dynamic Full Prescription Layout (Header, Demographics, Notes, Vitals, Rx, Labs, Advice, Footer) */}
            <PrescriptionSectionRenderer
              sections={effectiveLetterhead.prescriptionSections}
              headerSections={effectiveLetterhead.headerSections}
              headerData={{
                ...effectiveLetterhead,
                activeLocation
              }}
              patientData={{
                activePatient,
                notesToPrint,
                examsToPrint,
                labsToPrint,
                includeMedications,
                includeUrduTranslation,
                includeImpression,
                currentDateFormatted,
                formatAgeDisplay,
                footerNote: effectiveLetterhead.footerNote || '',
                doctorName: effectiveLetterhead.doctorName || ''
              }}
              isPreview={false}
            />
          </div>
        </div>
      </div>

      {/* Doctor Layout & Letterhead Customizer Modal */}
      <DoctorLayoutCustomizerModal
        isOpen={showLayoutModal}
        onClose={() => setShowLayoutModal(false)}
        doctorId={selectedDoctorId}
        doctorName={effectiveLetterhead.doctorName || currentUser?.name}
        currentLetterhead={effectiveLetterhead}
        onSave={handleSaveDoctorLayout}
      />
    </div>
  );
};
