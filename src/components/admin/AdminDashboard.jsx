import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  ShieldCheck,
  Users,
  Building2,
  FileText,
  Database,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  Key,
  Check,
  X,
  Search,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  Stethoscope,
  Activity,
  FileSpreadsheet,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Lock,
  Stamp,
  RotateCcw,
  FileSignature
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    currentUser,
    doctors,
    doctorLetterheads = {},
    updateDoctorLetterhead,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    resetDoctorPassword,
    auditLogs,
    clearAuditLogs,
    recordAudit
  } = useAuth();

  const {
    patients,
    clinicConfig,
    setClinicConfig,
    exportBackup,
    importBackup,
    showToast,
    navigateTo
  } = usePatients();

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState('overview');

  // Doctor Form Modal (Add / Edit)
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [docFormData, setDocFormData] = useState({
    name: '',
    email: '',
    username: '',
    qualifications: '',
    pmcNumber: '',
    specialty: '',
    phone: '',
    password: '',
    status: 'active'
  });

  // Reset Password Modal
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [resetDoctorTarget, setResetDoctorTarget] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // Delete Doctor Confirmation Modal
  const [isDeleteDocModalOpen, setIsDeleteDocModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  // Clinic Settings Form State
  const [clinicForm, setClinicForm] = useState({
    doctorName: clinicConfig.doctorName || '',
    qualifications: clinicConfig.qualifications || '',
    regNumber: clinicConfig.regNumber || '',
    clinicName: clinicConfig.clinicName || '',
    tagline: clinicConfig.tagline || '',
    address: clinicConfig.address || '',
    phone: clinicConfig.phone || '',
    email: clinicConfig.email || ''
  });

  // Scope switcher for Letterhead Settings: 'clinic' or doctor ID
  const [selectedLetterheadScope, setSelectedLetterheadScope] = useState('clinic');

  // Doctor-specific letterhead form state (supports multiple practice hospitals/chambers)
  const [docLhForm, setDocLhForm] = useState({
    enabled: true,
    doctorName: '',
    qualifications: '',
    pmcNumber: '',
    specialtyTitle: '',
    tagline: '',
    email: '',
    footerNote: '',
    locations: [
      {
        id: 'loc-1',
        hospitalName: '',
        department: '',
        address: '',
        consultationHours: '',
        phone: ''
      }
    ],
    // Legacy fallback fields
    clinicName: '',
    address: '',
    phone: '',
    consultationHours: ''
  });

  // Sync doctor letterhead form when selected scope or doctors change
  React.useEffect(() => {
    if (selectedLetterheadScope !== 'clinic') {
      const doc = doctors.find(d => d.id === selectedLetterheadScope);
      if (doc) {
        const savedLh = doctorLetterheads[doc.id] || {};

        let initialLocations = [];
        if (Array.isArray(savedLh.locations) && savedLh.locations.length > 0) {
          initialLocations = savedLh.locations;
        } else {
          initialLocations = [
            {
              id: 'loc-1',
              hospitalName: savedLh.clinicName || 'Ikram Hospital',
              department: savedLh.address || 'Cardiology Department, Executive Wing Room 104',
              address: 'Bhimber Road, Gujrat',
              consultationHours: savedLh.consultationHours || 'Mon – Sat: 4:00 PM – 9:00 PM',
              phone: savedLh.phone || doc.phone || '+92 336 1422773'
            }
          ];
        }

        setDocLhForm({
          enabled: savedLh.enabled !== undefined ? savedLh.enabled : true,
          doctorName: savedLh.doctorName || doc.name || '',
          qualifications: savedLh.qualifications || doc.qualifications || 'MBBS, FCPS',
          pmcNumber: savedLh.pmcNumber || doc.pmcNumber || 'PMC-',
          specialtyTitle: savedLh.specialtyTitle || (doc.specialty ? `Consultant in ${doc.specialty}` : 'Consultant Physician'),
          tagline: savedLh.tagline !== undefined ? savedLh.tagline : (clinicConfig.tagline || 'Specialist Outpatient Clinical Care'),
          email: savedLh.email || doc.email || clinicConfig.email || '',
          footerNote: savedLh.footerNote || 'Bring previous prescription and diagnostic reports on follow-up.',
          locations: initialLocations,
          clinicName: initialLocations[0]?.hospitalName || savedLh.clinicName || '',
          address: initialLocations[0]?.department || savedLh.address || '',
          phone: initialLocations[0]?.phone || savedLh.phone || '',
          consultationHours: initialLocations[0]?.consultationHours || savedLh.consultationHours || ''
        });
      }
    }
  }, [selectedLetterheadScope, doctors, doctorLetterheads, clinicConfig]);

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');
  const [auditCategoryFilter, setAuditCategoryFilter] = useState('all');

  // Reset Database confirmation
  const [isResetDbModalOpen, setIsResetDbModalOpen] = useState(false);

  // Calculate System Metrics
  const totalPatients = patients.length;
  const totalNotes = patients.reduce((acc, p) => acc + (p.notes?.length || 0), 0);
  const totalPrescriptions = patients.reduce((acc, p) => acc + (p.medications?.length || 0), 0);
  const totalLabReports = patients.reduce((acc, p) => acc + (p.labReports?.length || 0), 0);
  const activeDoctorsCount = doctors.filter(d => d.status === 'active').length;

  // Estimate storage
  const storageUsageKB = Math.round(
    ((localStorage.getItem('pms_patients_v1')?.length || 0) +
      (localStorage.getItem('pms_doctors_v1')?.length || 0) +
      (localStorage.getItem('pms_audit_logs_v1')?.length || 0)) / 1024
  );

  // Open Add Doctor Modal
  const handleOpenAddDoctor = () => {
    setEditingDoctor(null);
    setDocFormData({
      name: '',
      email: '',
      username: '',
      qualifications: 'MBBS, FCPS',
      pmcNumber: 'PMC-',
      specialty: 'Internal Medicine',
      phone: '',
      password: '',
      status: 'active'
    });
    setIsDoctorModalOpen(true);
  };

  // Open Edit Doctor Modal
  const handleOpenEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDocFormData({
      name: doc.name || '',
      email: doc.email || '',
      username: doc.username || '',
      qualifications: doc.qualifications || '',
      pmcNumber: doc.pmcNumber || '',
      specialty: doc.specialty || '',
      phone: doc.phone || '',
      password: '', // leave empty to keep existing
      status: doc.status || 'active'
    });
    setIsDoctorModalOpen(true);
  };

  // Save Doctor Form
  const handleSaveDoctor = (e) => {
    e.preventDefault();
    if (!docFormData.name.trim() || !docFormData.email.trim()) {
      showToast('Name and Email are required', 'error');
      return;
    }

    if (editingDoctor) {
      const updatePayload = {
        name: docFormData.name,
        email: docFormData.email,
        username: docFormData.username,
        qualifications: docFormData.qualifications,
        pmcNumber: docFormData.pmcNumber,
        specialty: docFormData.specialty,
        phone: docFormData.phone,
        status: docFormData.status
      };
      if (docFormData.password.trim()) {
        updatePayload.password = docFormData.password.trim();
      }
      updateDoctor(editingDoctor.id, updatePayload);
      showToast(`Doctor "${docFormData.name}" updated successfully`);
    } else {
      if (!docFormData.password.trim()) {
        showToast('Password is required for new doctor account', 'error');
        return;
      }
      addDoctor(docFormData);
      showToast(`Doctor "${docFormData.name}" registered successfully`);
    }

    setIsDoctorModalOpen(false);
  };

  // Trigger Reset Password
  const handleTriggerResetPassword = (doc) => {
    setResetDoctorTarget(doc);
    setNewPasswordValue('');
    setIsResetPassModalOpen(true);
  };

  const handleConfirmResetPassword = (e) => {
    e.preventDefault();
    if (!newPasswordValue.trim()) {
      showToast('Please enter a new password', 'error');
      return;
    }
    resetDoctorPassword(resetDoctorTarget.id, newPasswordValue.trim());
    showToast(`Password updated for ${resetDoctorTarget.name}`);
    setIsResetPassModalOpen(false);
  };

  // Trigger Delete Doctor
  const handleTriggerDeleteDoctor = (doc) => {
    if (doctors.length <= 1) {
      showToast('Cannot delete the only registered doctor in the system', 'error');
      return;
    }
    setDocToDelete(doc);
    setIsDeleteDocModalOpen(true);
  };

  const handleConfirmDeleteDoctor = () => {
    if (docToDelete) {
      deleteDoctor(docToDelete.id);
      showToast(`Doctor "${docToDelete.name}" removed from the system`);
      setIsDeleteDocModalOpen(false);
    }
  };

  // Save Clinic Master Settings
  const handleSaveClinicSettings = (e) => {
    e.preventDefault();
    setClinicConfig(clinicForm);
    recordAudit('Clinic Master Settings Updated', 'Clinic letterhead and doctor branding modified', 'admin');
    showToast('Clinic Master Settings updated successfully!');
  };

  // Location management for multi-hospital practices
  const handleAddLocation = () => {
    setDocLhForm(prev => ({
      ...prev,
      locations: [
        ...(prev.locations || []),
        {
          id: 'loc-' + Date.now(),
          hospitalName: '',
          department: '',
          address: '',
          consultationHours: '',
          phone: ''
        }
      ]
    }));
  };

  const handleUpdateLocation = (index, field, value) => {
    setDocLhForm(prev => {
      const locs = [...(prev.locations || [])];
      locs[index] = { ...locs[index], [field]: value };
      return {
        ...prev,
        locations: locs,
        ...(index === 0 ? {
          clinicName: field === 'hospitalName' ? value : prev.clinicName,
          address: field === 'department' ? value : prev.address,
          phone: field === 'phone' ? value : prev.phone,
          consultationHours: field === 'consultationHours' ? value : prev.consultationHours
        } : {})
      };
    });
  };

  const handleRemoveLocation = (index) => {
    setDocLhForm(prev => {
      const locs = (prev.locations || []).filter((_, i) => i !== index);
      return {
        ...prev,
        locations: locs.length > 0 ? locs : [{ id: 'loc-1', hospitalName: '', department: '', address: '', consultationHours: '', phone: '' }]
      };
    });
  };

  // Save Individual Doctor Letterhead
  const handleSaveDoctorLetterhead = (e) => {
    e.preventDefault();
    if (!docLhForm.doctorName.trim()) {
      showToast('Physician display name is required', 'error');
      return;
    }
    const doc = doctors.find(d => d.id === selectedLetterheadScope);
    if (!doc) return;

    const primaryLoc = docLhForm.locations?.[0] || {};
    const payload = {
      ...docLhForm,
      clinicName: primaryLoc.hospitalName || docLhForm.clinicName || 'Clinic Center',
      address: primaryLoc.department ? `${primaryLoc.department}${primaryLoc.address ? ', ' + primaryLoc.address : ''}` : (docLhForm.address || ''),
      phone: primaryLoc.phone || docLhForm.phone || '',
      consultationHours: primaryLoc.consultationHours || docLhForm.consultationHours || ''
    };

    updateDoctorLetterhead(doc.id, payload);

    // Sync core profile credentials
    updateDoctor(doc.id, {
      name: docLhForm.doctorName,
      qualifications: docLhForm.qualifications,
      pmcNumber: docLhForm.pmcNumber,
      specialty: docLhForm.specialtyTitle,
      phone: primaryLoc.phone || docLhForm.phone
    });

    showToast(`Clinical letterhead saved for ${docLhForm.doctorName}`);
  };

  // Revert doctor letterhead to clinic defaults
  const handleResetDoctorLetterhead = () => {
    const doc = doctors.find(d => d.id === selectedLetterheadScope);
    if (!doc) return;
    const defaultData = {
      enabled: false,
      doctorName: doc.name || '',
      qualifications: doc.qualifications || 'MBBS, FCPS',
      pmcNumber: doc.pmcNumber || 'PMC-',
      specialtyTitle: doc.specialty ? `Consultant in ${doc.specialty}` : 'Consultant Physician',
      clinicName: clinicConfig.clinicName || '',
      tagline: clinicConfig.tagline || '',
      address: clinicConfig.address || '',
      phone: doc.phone || clinicConfig.phone || '',
      email: doc.email || clinicConfig.email || '',
      consultationHours: '',
      footerNote: '',
      locations: [
        {
          id: 'loc-1',
          hospitalName: clinicConfig.clinicName || '',
          department: '',
          address: clinicConfig.address || '',
          consultationHours: '',
          phone: doc.phone || clinicConfig.phone || ''
        }
      ]
    };
    setDocLhForm(defaultData);
    updateDoctorLetterhead(doc.id, defaultData);
    showToast(`Letterhead for ${doc.name} reset to clinic defaults`);
  };

  // Jump from Doctor Accounts table directly to their letterhead in Tab 3
  const handleOpenDoctorLetterhead = (doc) => {
    setSelectedLetterheadScope(doc.id);
    setAdminTab('letterhead');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch =
      !auditSearch ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(auditSearch.toLowerCase());

    const matchesCategory =
      auditCategoryFilter === 'all' || log.category === auditCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Handle Restore file selection
  const handleFileRestore = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target?.result);
        const ok = importBackup(json);
        if (ok) {
          recordAudit('Database Restored', `Restored from file: ${file.name}`, 'admin');
        }
      } catch (err) {
        showToast('Invalid JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Handle Factory Reset
  const handleConfirmFactoryReset = () => {
    localStorage.clear();
    recordAudit('Factory Reset Executed', 'All clinic data cleared. Reloading page.', 'system');
    showToast('System reset! Reloading defaults...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="admin-container">
      {/* Admin Executive Header */}
      <div className="admin-header-card">
        <div className="admin-header-main">
          <div className="admin-badge-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 className="admin-title">Administration &amp; Master Control Panel</h1>
              <span className="admin-status-chip">
                <span className="pulse-dot" />
                SYSTEM ACTIVE
              </span>
            </div>
            <p className="admin-subtitle">
              Manage doctor licensing, clinic letterhead credentials, database integrity, and system audit logs.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="segmented-tabs" style={{ marginBottom: 24 }}>
        <button
          type="button"
          className={`segmented-tab-btn ${adminTab === 'overview' ? 'active' : ''}`}
          onClick={() => setAdminTab('overview')}
        >
          <BarChart3 size={16} />
          <span>System Overview</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${adminTab === 'doctors' ? 'active' : ''}`}
          onClick={() => setAdminTab('doctors')}
        >
          <Users size={16} />
          <span>Doctor Accounts</span>
          <span className="tab-counter-badge">{doctors.length}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${adminTab === 'letterhead' ? 'active' : ''}`}
          onClick={() => setAdminTab('letterhead')}
        >
          <Building2 size={16} />
          <span>Clinic Letterhead Settings</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${adminTab === 'audit' ? 'active' : ''}`}
          onClick={() => setAdminTab('audit')}
        >
          <Clock size={16} />
          <span>Audit Trail &amp; Security Logs</span>
          <span className="tab-counter-badge">{auditLogs.length}</span>
        </button>

        <button
          type="button"
          className={`segmented-tab-btn ${adminTab === 'database' ? 'active' : ''}`}
          onClick={() => setAdminTab('database')}
        >
          <Database size={16} />
          <span>Database &amp; Backup</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW & ANALYTICS */}
      {adminTab === 'overview' && (
        <div>
          {/* KPI Analytics Cards */}
          <div className="admin-kpi-grid">
            <div className="admin-kpi-card">
              <div className="kpi-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                <Users size={22} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Registered Patients</span>
                <span className="kpi-value">{totalPatients}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <FileText size={22} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Clinical Encounters</span>
                <span className="kpi-value">{totalNotes}</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-info">
                <span className="kpi-label">Active Prescriptions (Rx)</span>
                <span className="kpi-value">{totalPrescriptions}</span>
              </div>
              <div className="kpi-icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                <Activity size={22} />
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrapper" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                <Stethoscope size={22} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Licensed Doctors</span>
                <span className="kpi-value">{activeDoctorsCount} Active</span>
              </div>
            </div>

            <div className="admin-kpi-card">
              <div className="kpi-icon-wrapper" style={{ background: '#f1f5f9', color: '#475569' }}>
                <Database size={22} />
              </div>
              <div className="kpi-info">
                <span className="kpi-label">Local DB Storage</span>
                <span className="kpi-value">~{storageUsageKB} KB</span>
              </div>
            </div>
          </div>

          {/* Quick System Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginTop: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={18} color="var(--brand-cyan)" />
                <span>Current Clinic Credentials</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
                <div><strong>Primary Doctor:</strong> {clinicConfig.doctorName}</div>
                <div><strong>Qualifications:</strong> {clinicConfig.qualifications}</div>
                <div><strong>PMC Registration:</strong> {clinicConfig.regNumber}</div>
                <div><strong>Clinic Name:</strong> {clinicConfig.clinicName}</div>
                <div><strong>Official Address:</strong> {clinicConfig.address}</div>
                <div><strong>Helpline:</strong> {clinicConfig.phone}</div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 18 }}
                onClick={() => setAdminTab('letterhead')}
              >
                Modify Letterhead Configuration
              </button>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={18} color="var(--brand-indigo)" />
                <span>Recent System Activities</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {auditLogs.slice(0, 4).map(log => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.825rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-cyan)', marginTop: 6, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{log.action}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{log.details}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: 2 }}>{log.formattedDate} · by {log.performedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: 14 }}
                onClick={() => setAdminTab('audit')}
              >
                View Full Audit Trail ({auditLogs.length} Events)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCTOR ACCOUNTS MANAGEMENT */}
      {adminTab === 'doctors' && (
        <div>
          <div className="tab-header-row">
            <div>
              <h2 className="tab-title">Licensed Doctor Accounts</h2>
              <p className="tab-desc">
                Authorized clinical physicians who can sign in to view patients, prescribe medications, and maintain personal notes.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenAddDoctor}
            >
              <Plus size={16} />
              <span>Register New Doctor</span>
            </button>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Physician Name</th>
                  <th>Email &amp; Username</th>
                  <th>Credentials &amp; PMC No.</th>
                  <th>Specialty</th>
                  <th>Status</th>
                  <th>Last Sign In</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="doc-avatar-small">
                          {doc.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700 }}>{doc.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {doc.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{doc.email}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>@{doc.username}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{doc.qualifications}</div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.725rem' }}>{doc.pmcNumber}</span>
                    </td>
                    <td>{doc.specialty}</td>
                    <td>
                      {doc.status === 'active' ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge badge-danger">Suspended</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {doc.lastLogin ? new Date(doc.lastLogin).toLocaleDateString() : 'Never logged in'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-icon btn-icon-indigo"
                          title="Configure Clinical Letterhead"
                          onClick={() => handleOpenDoctorLetterhead(doc)}
                        >
                          <Stamp size={15} color="#6366f1" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-amber"
                          title="Reset Doctor Password"
                          onClick={() => handleTriggerResetPassword(doc)}
                        >
                          <Key size={15} color="#d97706" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-cyan"
                          title="Edit Doctor Details"
                          onClick={() => handleOpenEditDoctor(doc)}
                        >
                          <Edit3 size={15} color="#0284c7" />
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon-rose"
                          title="Delete Doctor Account"
                          onClick={() => handleTriggerDeleteDoctor(doc)}
                        >
                          <Trash2 size={15} color="#e11d48" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CLINIC & INDIVIDUAL DOCTOR LETTERHEADS */}
      {adminTab === 'letterhead' && (
        <div>
          <div className="tab-header-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 className="tab-title">Clinical Letterheads &amp; Master Branding</h2>
              <p className="tab-desc">
                Configure clinic-wide master letterhead or customize independent clinical letterheads for each physician.
              </p>
            </div>

            {/* Scope Switcher: Master Clinic vs Doctors */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-card)', padding: '5px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
              <button
                type="button"
                className={`segmented-tab-btn ${selectedLetterheadScope === 'clinic' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.825rem' }}
                onClick={() => setSelectedLetterheadScope('clinic')}
              >
                <Building2 size={14} />
                <span>Clinic Master</span>
              </button>

              {doctors.map(d => {
                const hasCustom = doctorLetterheads[d.id]?.enabled;
                return (
                  <button
                    key={d.id}
                    type="button"
                    className={`segmented-tab-btn ${selectedLetterheadScope === d.id ? 'active' : ''}`}
                    style={{ padding: '6px 14px', fontSize: '0.825rem' }}
                    onClick={() => setSelectedLetterheadScope(d.id)}
                  >
                    <Stethoscope size={14} />
                    <span>{d.name.startsWith('Dr.') ? d.name : `Dr. ${d.name}`}</span>
                    {hasCustom && (
                      <span className="badge badge-success" style={{ fontSize: '0.625rem', padding: '1px 5px', marginLeft: 4 }}>
                        Custom
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MODE A: CLINIC MASTER SETTINGS FORM */}
          {selectedLetterheadScope === 'clinic' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
              {/* Form */}
              <form onSubmit={handleSaveClinicSettings} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 18 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                    Clinic Master Default Credentials
                  </h3>
                  <span className="badge badge-indigo" style={{ fontSize: '0.725rem' }}>Global Fallback</span>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="field-label">Default Consultant Physician Name *</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={clinicForm.doctorName}
                    onChange={(e) => setClinicForm({ ...clinicForm, doctorName: e.target.value })}
                    placeholder="e.g. Consultant Physician"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label className="field-label" style={{ margin: 0 }}>Default Qualifications *</label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Press Enter for new line</span>
                  </div>
                  <textarea
                    className="modern-textarea"
                    rows={2}
                    style={{ width: '100%', resize: 'vertical', lineHeight: 1.4 }}
                    value={clinicForm.qualifications}
                    onChange={(e) => setClinicForm({ ...clinicForm, qualifications: e.target.value })}
                    placeholder={"e.g.\nMBBS\nFCPS (Internal Medicine)"}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="field-label">PMC / PMDC Registration Number *</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={clinicForm.regNumber}
                    onChange={(e) => setClinicForm({ ...clinicForm, regNumber: e.target.value })}
                    placeholder="e.g. PMC-00000-P"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="field-label">Clinic / Hospital Name *</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={clinicForm.clinicName}
                    onChange={(e) => setClinicForm({ ...clinicForm, clinicName: e.target.value })}
                    placeholder="e.g. PatientCare Medical Center"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="field-label">Clinic Tagline / Subtitle</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={clinicForm.tagline}
                    onChange={(e) => setClinicForm({ ...clinicForm, tagline: e.target.value })}
                    placeholder="e.g. Quality Outpatient Care & Diagnostic Center"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="field-label">Physical Address</label>
                  <input
                    type="text"
                    className="modern-input"
                    value={clinicForm.address}
                    onChange={(e) => setClinicForm({ ...clinicForm, address: e.target.value })}
                    placeholder="e.g. Suite 101, Health Complex, Main Boulevard"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="field-label">Official Phone</label>
                    <input
                      type="text"
                      className="modern-input"
                      value={clinicForm.phone}
                      onChange={(e) => setClinicForm({ ...clinicForm, phone: e.target.value })}
                      placeholder="+92 300 0000000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Official Email</label>
                    <input
                      type="email"
                      className="modern-input"
                      value={clinicForm.email}
                      onChange={(e) => setClinicForm({ ...clinicForm, email: e.target.value })}
                      placeholder="clinic@patientcare.org"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Check size={16} />
                  <span>Save Clinic Master Settings</span>
                </button>
              </form>

              {/* Master Live Preview */}
              <div>
                <div className="card" style={{ padding: 24, background: '#f8fafc', border: '2px dashed var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Live Clinic Master Header Preview
                    </div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>Default Layout</span>
                  </div>

                  <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--brand-cyan)', paddingBottom: 14, marginBottom: 14 }}>
                      <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-cyan)', margin: 0 }}>
                          {clinicForm.doctorName || 'Consultant Physician'}
                        </h4>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: 3, whiteSpace: 'pre-line', lineHeight: 1.35 }}>
                          {clinicForm.qualifications || 'MBBS, FCPS'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                          Reg: <strong style={{ color: 'var(--text-primary)' }}>{clinicForm.regNumber || 'PMC-00000-P'}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {clinicForm.clinicName || 'PatientCare Medical Center'}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {clinicForm.tagline || 'Quality Outpatient Care'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 4 }}>
                          {clinicForm.phone} · {clinicForm.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                      {clinicForm.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: INDIVIDUAL DOCTOR LETTERHEAD CONFIGURATION */
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(520px, 1.35fr) minmax(380px, 1fr)', gap: 24, alignItems: 'start' }}>
              {/* Doctor Letterhead Form */}
              <form onSubmit={handleSaveDoctorLetterhead} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14, marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--brand-cyan)' }}>
                      {docLhForm.doctorName || 'Doctor Letterhead'}
                    </h3>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Multi-Hospital Clinical Stationery &amp; Prescriptions
                    </div>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={docLhForm.enabled}
                      onChange={(e) => setDocLhForm({ ...docLhForm, enabled: e.target.checked })}
                    />
                    <span>Custom Letterhead Active</span>
                  </label>
                </div>

                {!docLhForm.enabled && (
                  <div className="badge badge-warning" style={{ display: 'block', padding: '10px 14px', marginBottom: 18, fontSize: '0.8rem', lineHeight: 1.4 }}>
                    ⚠️ Custom letterhead is disabled for this doctor. Printed prescriptions and summaries will use the Clinic Master settings until enabled.
                  </div>
                )}

                {/* Section 1: Physician Identity */}
                <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em', marginBottom: 14 }}>
                    1. Physician Identity &amp; Licensing Credentials
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="field-label">Physician Full Display Name *</label>
                    <input
                      type="text"
                      className="modern-input"
                      style={{ width: '100%', fontSize: '0.925rem' }}
                      value={docLhForm.doctorName}
                      onChange={(e) => setDocLhForm({ ...docLhForm, doctorName: e.target.value })}
                      placeholder="e.g. Dr. Zain Safdar"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="field-label">PMC / PMDC Registration Number *</label>
                    <input
                      type="text"
                      className="modern-input"
                      style={{ width: '100%' }}
                      value={docLhForm.pmcNumber}
                      onChange={(e) => setDocLhForm({ ...docLhForm, pmcNumber: e.target.value })}
                      placeholder="e.g. PMC-48201-P"
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <label className="field-label" style={{ margin: 0 }}>Qualifications, Degrees &amp; Fellowships *</label>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Press Enter to write beneath on new line</span>
                    </div>
                    <textarea
                      className="modern-textarea"
                      rows={3}
                      style={{ width: '100%', resize: 'vertical', lineHeight: 1.45 }}
                      value={docLhForm.qualifications}
                      onChange={(e) => setDocLhForm({ ...docLhForm, qualifications: e.target.value })}
                      placeholder={"e.g.\nMBBS (Gold Medalist)\nFCPS Cardiology\nFellow Interventional Cardiology"}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="field-label">Clinical Specialty / Designation Title</label>
                    <input
                      type="text"
                      className="modern-input"
                      style={{ width: '100%' }}
                      value={docLhForm.specialtyTitle}
                      onChange={(e) => setDocLhForm({ ...docLhForm, specialtyTitle: e.target.value })}
                      placeholder="e.g. Consultant Cardiologist &amp; Heart Specialist"
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Letterhead Tagline / Clinical Sub-Specialty Focus</label>
                    <input
                      type="text"
                      className="modern-input"
                      style={{ width: '100%' }}
                      value={docLhForm.tagline}
                      onChange={(e) => setDocLhForm({ ...docLhForm, tagline: e.target.value })}
                      placeholder="e.g. Specialist in Hypertension, Coronary Angiography, Echo &amp; Heart Failure"
                    />
                  </div>
                </div>

                {/* Section 2: Multiple Practice Hospitals & Clinical Chambers */}
                <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em' }}>
                        2. Practice Hospitals &amp; Clinical Chambers
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Add all hospitals or clinics where this physician consults (e.g. Mon/Wed at Hospital A, Tue/Thu at Hospital B).
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleAddLocation}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.775rem' }}
                    >
                      <Plus size={14} />
                      <span>Add Hospital</span>
                    </button>
                  </div>

                  {/* Locations List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {(docLhForm.locations || []).map((loc, idx) => (
                      <div
                        key={loc.id || idx}
                        style={{
                          background: 'var(--bg-page)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 8,
                          padding: 16,
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px dashed var(--border-subtle)', paddingBottom: 8 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Building2 size={14} />
                            <span>Hospital / Practice Location #{idx + 1} {idx === 0 ? '(Primary / Main)' : ''}</span>
                          </span>

                          {(docLhForm.locations || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveLocation(idx)}
                              className="btn-icon btn-icon-rose"
                              style={{ width: 26, height: 26 }}
                              title="Remove this location"
                            >
                              <Trash2 size={13} color="#e11d48" />
                            </button>
                          )}
                        </div>

                        {/* Full Width Hospital Name */}
                        <div className="form-group" style={{ marginBottom: 12 }}>
                          <label className="field-label">Hospital / Medical Center Name *</label>
                          <input
                            type="text"
                            className="modern-input"
                            style={{ width: '100%', fontSize: '0.9rem' }}
                            value={loc.hospitalName}
                            onChange={(e) => handleUpdateLocation(idx, 'hospitalName', e.target.value)}
                            placeholder="e.g. Ikram Hospital, Gujrat"
                            required
                          />
                        </div>

                        {/* Full Width Department & Chamber */}
                        <div className="form-group" style={{ marginBottom: 12 }}>
                          <label className="field-label">Department &amp; Chamber / Room No.</label>
                          <input
                            type="text"
                            className="modern-input"
                            style={{ width: '100%' }}
                            value={loc.department}
                            onChange={(e) => handleUpdateLocation(idx, 'department', e.target.value)}
                            placeholder="e.g. Cardiology Department, Executive Wing Room 104"
                          />
                        </div>

                        {/* Full Width Address */}
                        <div className="form-group" style={{ marginBottom: 12 }}>
                          <label className="field-label">Physical Address / Road / City</label>
                          <input
                            type="text"
                            className="modern-input"
                            style={{ width: '100%' }}
                            value={loc.address}
                            onChange={(e) => handleUpdateLocation(idx, 'address', e.target.value)}
                            placeholder="e.g. Bhimber Road, Gujrat"
                          />
                        </div>

                        {/* Schedule & Phone */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                          <div className="form-group">
                            <label className="field-label">Consultation Days &amp; OPD Timings</label>
                            <input
                              type="text"
                              className="modern-input"
                              style={{ width: '100%' }}
                              value={loc.consultationHours}
                              onChange={(e) => handleUpdateLocation(idx, 'consultationHours', e.target.value)}
                              placeholder="e.g. Mon, Wed, Fri: 4:00 PM – 9:00 PM"
                            />
                          </div>

                          <div className="form-group">
                            <label className="field-label">Appointment / Helpline Phone</label>
                            <input
                              type="text"
                              className="modern-input"
                              style={{ width: '100%' }}
                              value={loc.phone}
                              onChange={(e) => handleUpdateLocation(idx, 'phone', e.target.value)}
                              placeholder="+92 336 1422773"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Prescription Footer & Contact */}
                <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 20 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--brand-cyan)', letterSpacing: '0.05em', marginBottom: 14 }}>
                    3. Prescription Footer Instructions &amp; Email
                  </div>

                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label className="field-label">Custom Prescription Footer Advice / Emergency Note</label>
                    <input
                      type="text"
                      className="modern-input"
                      style={{ width: '100%' }}
                      value={docLhForm.footerNote}
                      onChange={(e) => setDocLhForm({ ...docLhForm, footerNote: e.target.value })}
                      placeholder="e.g. In case of acute cardiac emergency, report to Emergency CCU immediately."
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label">Official / Practice Email</label>
                    <input
                      type="email"
                      className="modern-input"
                      style={{ width: '100%' }}
                      value={docLhForm.email}
                      onChange={(e) => setDocLhForm({ ...docLhForm, email: e.target.value })}
                      placeholder="e.g. dr.zain@example.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}>
                    <Check size={16} />
                    <span>Save Doctor Letterhead</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleResetDoctorLetterhead}
                    title="Reset to Master Clinic Defaults"
                    style={{ padding: '12px 16px' }}
                  >
                    <RotateCcw size={15} />
                    <span>Reset</span>
                  </button>
                </div>
              </form>

              {/* Doctor Live A4 Preview */}
              <div style={{ position: 'sticky', top: 20 }}>
                <div className="card" style={{ padding: 24, background: '#f8fafc', border: '2px dashed var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Physician Prescription Preview
                    </div>
                    {docLhForm.enabled ? (
                      <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>Active Doctor Letterhead</span>
                    ) : (
                      <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Inheriting Clinic Master</span>
                    )}
                  </div>

                  <div style={{ background: '#ffffff', padding: '24px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-subtle)' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: 16, marginBottom: 16 }}>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                          {docLhForm.doctorName || 'Attending Physician'}
                        </h4>
                        <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, marginTop: 2 }}>
                          {docLhForm.specialtyTitle || 'Consultant Specialist'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginTop: 2, whiteSpace: 'pre-line', lineHeight: 1.35 }}>
                          {docLhForm.qualifications || 'MBBS, FCPS'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
                          PMDC / PMC Reg: <strong style={{ color: '#0f172a' }}>{docLhForm.pmcNumber || 'PMC-PENDING'}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 260 }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {docLhForm.locations?.[0]?.hospitalName || docLhForm.clinicName || 'Practice Center'}
                        </h4>
                        {docLhForm.tagline && (
                          <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: 2 }}>
                            {docLhForm.tagline}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#334155', fontWeight: 600, marginTop: 3 }}>
                          {docLhForm.locations?.[0]?.department || docLhForm.address || 'OPD Chamber'}
                        </div>
                        {docLhForm.locations?.[0]?.address && (
                          <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                            {docLhForm.locations[0].address}
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                          {docLhForm.locations?.[0]?.phone ? `Ph: ${docLhForm.locations[0].phone}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Multi-Hospital Practice Chambers Strip */}
                    {(docLhForm.locations || []).length > 1 ? (
                      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '10px 12px', marginBottom: 16 }}>
                        <div style={{ fontSize: '0.675rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.04em' }}>
                          Clinical Chambers &amp; Practice Timings:
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: docLhForm.locations.length === 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
                          {docLhForm.locations.map((loc, idx) => (
                            <div key={loc.id || idx} style={{ borderLeft: '2px solid #0284c7', paddingLeft: 8, fontSize: '0.725rem' }}>
                              <div style={{ fontWeight: 800, color: '#0f172a' }}>
                                🏥 {loc.hospitalName || `Hospital #${idx + 1}`}
                              </div>
                              {loc.department && <div style={{ color: '#475569' }}>{loc.department}</div>}
                              {loc.address && <div style={{ color: '#64748b' }}>{loc.address}</div>}
                              {loc.consultationHours && (
                                <div style={{ color: '#0284c7', fontWeight: 600, marginTop: 1 }}>
                                  🕒 {loc.consultationHours}
                                </div>
                              )}
                              {loc.phone && (
                                <div style={{ color: '#334155', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                                  📞 {loc.phone}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      docLhForm.locations?.[0]?.consultationHours && (
                        <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: 4, display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: '#475569', marginBottom: 16 }}>
                          <span>🕒 <strong>OPD Timings:</strong> {docLhForm.locations[0].consultationHours}</span>
                          <span>Official Prescription</span>
                        </div>
                      )
                    )}

                    {/* Simulated Body */}
                    <div style={{ border: '1px dashed #e2e8f0', borderRadius: 6, padding: '20px 14px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem', marginBottom: 16 }}>
                      <span style={{ fontSize: '1.2rem', fontFamily: 'serif', fontWeight: 900, color: '#cbd5e1', marginRight: 8 }}>&#8478;</span>
                      Prescription Items, Clinical Findings &amp; Medications print here
                    </div>

                    {/* Simulated Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', maxWidth: 220, fontStyle: 'italic' }}>
                        {docLhForm.footerNote || 'Bring previous prescription on follow-up.'}
                      </div>
                      <div style={{ textAlign: 'center', borderTop: '1px solid #0f172a', paddingTop: 4, minWidth: 140 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>
                          {docLhForm.doctorName || 'Dr. Zain Safdar'}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Authorized Signature</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL & SECURITY LOGS */}
      {adminTab === 'audit' && (
        <div>
          <div className="tab-header-row">
            <div>
              <h2 className="tab-title">Audit Trail &amp; Security Log</h2>
              <p className="tab-desc">
                Chronological record of authentication attempts, doctor logins, and clinical modifications for regulatory compliance.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={clearAuditLogs}
              title="Purge logs"
            >
              <Trash2 size={14} />
              <span>Clear Audit Log</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '14px 18px', marginBottom: 18, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="modern-input"
                style={{ paddingLeft: 36 }}
                placeholder="Search audit records by action, actor, or details..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'auth', 'admin', 'system'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`btn btn-sm ${auditCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAuditCategoryFilter(cat)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Category</th>
                  <th>Event Action</th>
                  <th>Actor / Performed By</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No audit events match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAuditLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>
                        {log.formattedDate}
                      </td>
                      <td>
                        <span className={`badge badge-${log.category === 'auth' ? 'indigo' : log.category === 'admin' ? 'amber' : 'gray'}`}>
                          {log.category.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>{log.action}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--brand-cyan)' }}>
                          {log.performedBy}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {log.details}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: DATABASE & BACKUP */}
      {adminTab === 'database' && (
        <div>
          <div className="tab-header-row">
            <div>
              <h2 className="tab-title">Database Maintenance &amp; Disaster Recovery</h2>
              <p className="tab-desc">
                Export encrypted JSON snapshots of all clinical records, restore from an earlier backup, or reset to factory defaults.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {/* Backup Export */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#ecfdf5', color: '#10b981', padding: 8, borderRadius: 8 }}>
                  <Download size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Download Database Backup</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Full JSON file of all patients, consultations, and prescriptions</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '14px 0' }}>
                Generates a clean timestamped backup file that you can store securely or transfer to another clinic computer.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={exportBackup}
                style={{ width: '100%' }}
              >
                <Download size={16} />
                <span>Export System Backup (JSON)</span>
              </button>
            </div>

            {/* Restore from Backup */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#eff6ff', color: '#3b82f6', padding: 8, borderRadius: 8 }}>
                  <Upload size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Restore from Backup</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Upload previously exported JSON backup</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '14px 0' }}>
                Restores patient records, physical vitals, and medications from a valid backup file.
              </p>
              <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                <Upload size={16} />
                <span>Select Backup JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileRestore}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Reset Defaults */}
            <div className="card" style={{ padding: 24, border: '1px solid #fee2e2', background: '#fff5f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ background: '#fee2e2', color: '#ef4444', padding: 8, borderRadius: 8 }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#991b1b' }}>Factory Reset</h3>
                  <p style={{ fontSize: '0.8rem', color: '#b91c1c', margin: 0 }}>Reset database to initial demo state</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.5, margin: '14px 0' }}>
                WARNING: This wipes any newly created patients and resets all records to the original sample dataset.
              </p>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setIsResetDbModalOpen(true)}
                style={{ width: '100%' }}
              >
                <RefreshCw size={16} />
                <span>Reset Database to Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT DOCTOR */}
      {isDoctorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 550 }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingDoctor ? `Edit Doctor: ${editingDoctor.name}` : 'Register New Doctor'}
              </h3>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsDoctorModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="modal-body">
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="field-label">Physician Full Name *</label>
                <input
                  type="text"
                  className="modern-input"
                  placeholder="e.g. Dr. Ayesha Khan"
                  value={docFormData.name}
                  onChange={(e) => setDocFormData({ ...docFormData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="field-label">Email Address *</label>
                  <input
                    type="email"
                    className="modern-input"
                    placeholder="doctor@clinic.com"
                    value={docFormData.email}
                    onChange={(e) => setDocFormData({ ...docFormData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Username</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="drayesha"
                    value={docFormData.username}
                    onChange={(e) => setDocFormData({ ...docFormData, username: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="field-label">Qualifications</label>
                  <textarea
                    className="modern-textarea"
                    rows={2}
                    style={{ resize: 'vertical', lineHeight: 1.4 }}
                    placeholder={"MBBS\nFCPS"}
                    value={docFormData.qualifications}
                    onChange={(e) => setDocFormData({ ...docFormData, qualifications: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">PMC Registration No.</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="PMC-12345-P"
                    value={docFormData.pmcNumber}
                    onChange={(e) => setDocFormData({ ...docFormData, pmcNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="form-group">
                  <label className="field-label">Specialty / Dept</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="Pulmonology"
                    value={docFormData.specialty}
                    onChange={(e) => setDocFormData({ ...docFormData, specialty: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="field-label">Contact Phone</label>
                  <input
                    type="text"
                    className="modern-input"
                    placeholder="+92 300 0000000"
                    value={docFormData.phone}
                    onChange={(e) => setDocFormData({ ...docFormData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="field-label">
                  {editingDoctor ? 'Change Password (leave blank to keep existing)' : 'Sign In Password *'}
                </label>
                <input
                  type="password"
                  className="modern-input"
                  placeholder={editingDoctor ? 'Leave blank to preserve' : 'Min. 6 characters'}
                  value={docFormData.password}
                  onChange={(e) => setDocFormData({ ...docFormData, password: e.target.value })}
                  required={!editingDoctor}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="field-label">Account Status</label>
                <select
                  className="modern-input"
                  value={docFormData.status}
                  onChange={(e) => setDocFormData({ ...docFormData, status: e.target.value })}
                >
                  <option value="active">Active (Can Log In)</option>
                  <option value="suspended">Suspended (Blocked)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsDoctorModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>{editingDoctor ? 'Save Changes' : 'Register Doctor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {isResetPassModalOpen && resetDoctorTarget && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <h3 className="modal-title">Reset Doctor Password</h3>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsResetPassModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                Enter a new password for <strong>{resetDoctorTarget.name}</strong> ({resetDoctorTarget.email}):
              </p>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="field-label">New Password *</label>
                <input
                  type="password"
                  className="modern-input"
                  placeholder="Enter new passkey"
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsResetPassModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Check size={16} />
                  <span>Set New Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE DOCTOR */}
      <ConfirmModal
        isOpen={isDeleteDocModalOpen}
        title={`Delete Doctor Account: ${docToDelete?.name}`}
        message={`Are you sure you want to delete the doctor profile for ${docToDelete?.name}? They will no longer be able to log in to the clinical workstation.`}
        onConfirm={handleConfirmDeleteDoctor}
        onCancel={() => setIsDeleteDocModalOpen(false)}
      />

      {/* MODAL: CONFIRM FACTORY RESET */}
      <ConfirmModal
        isOpen={isResetDbModalOpen}
        title="Factory Reset Confirmation"
        message="Are you sure you want to wipe all local data and reset the clinic database to demo initial state? This action cannot be undone."
        onConfirm={handleConfirmFactoryReset}
        onCancel={() => setIsResetDbModalOpen(false)}
      />
    </div>
  );
};
