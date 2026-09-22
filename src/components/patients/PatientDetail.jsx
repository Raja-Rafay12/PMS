import React, { useState } from 'react';
import { usePatients } from '../../context/PatientContext';
import { HistoryTab } from '../clinical/HistoryTab';
import { ExaminationTab } from '../clinical/ExaminationTab';
import { MedicationsTab } from '../clinical/MedicationsTab';
import { LabReportsTab } from '../clinical/LabReportsTab';
import { ImpressionAdviceTab } from '../clinical/ImpressionAdviceTab';
import { PersonalNotesTab } from '../clinical/PersonalNotesTab';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Printer,
  Edit3,
  Trash2,
  ArrowLeft,
  Calendar,
  Phone,
  Droplet,
  MapPin,
  HeartHandshake,
  Clock,
  Activity,
  Pill,
  FileSpreadsheet,
  FileCheck2,
  Lock,
  Copy,
  Check
} from 'lucide-react';

export const PatientDetail = () => {
  const {
    activePatient,
    activeTab,
    setActiveTab,
    navigateTo,
    deletePatient,
    showToast
  } = usePatients();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!activePatient) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p>Patient record not found.</p>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ marginTop: 12 }}
          onClick={() => navigateTo('list')}
        >
          &larr; Return to Patients List
        </button>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return 'PT';
    return name
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
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

  const handleCopyPhone = () => {
    if (!activePatient.phone) return;
    navigator.clipboard.writeText(activePatient.phone);
    setCopiedPhone(true);
    showToast(`Phone number ${activePatient.phone} copied!`);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleDelete = () => {
    deletePatient(activePatient.id);
  };

  return (
    <div>
      {/* Back to patients breadcrumb */}
      <button
        type="button"
        className="breadcrumb-back"
        onClick={() => navigateTo('list')}
      >
        <ArrowLeft size={15} />
        <span>All Patients</span>
      </button>

      {/* Modern Patient Hero Card */}
      <div className="patient-hero-card">
        <div className="patient-hero-main">
          <div
            className="patient-hero-avatar"
            style={{ background: getAvatarGradient(activePatient.name) }}
          >
            {getInitials(activePatient.name)}
          </div>

          <div>
            <h1 className="patient-hero-title">{activePatient.name}</h1>
            <div className="patient-meta-row">
              <span className="meta-pill">
                <strong>{formatAgeDisplay(activePatient)}</strong> · {activePatient.gender}
              </span>

              {activePatient.bloodGroup && (
                <span className="meta-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>
                  <Droplet size={13} fill="#b91c1c" />
                  <span>{activePatient.bloodGroup}</span>
                </span>
              )}

              <span
                className="meta-pill"
                style={{ cursor: 'pointer' }}
                onClick={handleCopyPhone}
                title="Click to copy phone number"
              >
                <Phone size={13} />
                <span style={{ fontFamily: 'var(--font-mono)' }}>{activePatient.phone}</span>
                {copiedPhone ? <Check size={12} color="#10b981" /> : <Copy size={12} color="var(--text-dim)" />}
              </span>

              {activePatient.address && (
                <span className="meta-pill">
                  <MapPin size={13} />
                  <span>{activePatient.address}</span>
                </span>
              )}
            </div>

            {activePatient.emergencyContact?.name && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>
                <HeartHandshake size={14} color="#0284c7" />
                <span>Emergency: <strong>{activePatient.emergencyContact.name}</strong> ({activePatient.emergencyContact.relation || 'Contact'})</span>
                {activePatient.emergencyContact.phone && (
                  <span style={{ fontFamily: 'var(--font-mono)' }}>· {activePatient.emergencyContact.phone}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-button-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigateTo('print', activePatient.id)}
            title="Generate prescription summary & letterhead PDF"
          >
            <Printer size={15} />
            <span>Print Summary</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigateTo('edit-patient', activePatient.id)}
          >
            <Edit3 size={15} />
            <span>Edit</span>
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Modern Segmented Tabs */}
      <div className="segmented-tabs">
        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Clock size={16} />
          <span>Clinical History</span>
          <span className="tab-counter-badge">{activePatient.notes?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'examination' ? 'active' : ''}`}
          onClick={() => setActiveTab('examination')}
        >
          <Activity size={16} />
          <span>Physical Exam &amp; Vitals</span>
          <span className="tab-counter-badge">{activePatient.examinations?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          <Pill size={16} />
          <span>Prescriptions (Rx)</span>
          <span className="tab-counter-badge">{activePatient.medications?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'labReports' ? 'active' : ''}`}
          onClick={() => setActiveTab('labReports')}
        >
          <FileSpreadsheet size={16} />
          <span>Lab Reports &amp; Scans</span>
          <span className="tab-counter-badge">{activePatient.labReports?.length || 0}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'impressionAdvice' ? 'active' : ''}`}
          onClick={() => setActiveTab('impressionAdvice')}
        >
          <FileCheck2 size={16} />
          <span>Impression &amp; Advice</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${activeTab === 'personalNotes' ? 'active' : ''}`}
          onClick={() => setActiveTab('personalNotes')}
          title="Doctor's private confidential perceptions - not visible on print"
        >
          <Lock size={16} />
          <span>Personal Note</span>
          {activePatient.personalNotes && (
            <span
              className="tab-counter-badge"
              style={{ background: '#fef3c7', color: '#b45309', fontWeight: 800 }}
              title="Confidential note recorded"
            >
              •
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'history' && <HistoryTab />}
        {activeTab === 'examination' && <ExaminationTab />}
        {activeTab === 'medications' && <MedicationsTab />}
        {activeTab === 'labReports' && <LabReportsTab />}
        {activeTab === 'impressionAdvice' && <ImpressionAdviceTab />}
        {activeTab === 'personalNotes' && <PersonalNotesTab />}
      </div>

      {/* Delete Patient Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`Delete Patient Record "${activePatient.name}"`}
        message="Are you sure you want to permanently delete this patient profile, all clinical notes, vitals, prescriptions, and uploaded lab scans? This action cannot be reversed."
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
