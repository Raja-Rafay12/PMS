import React, { useState, useMemo, useRef } from 'react';
import { usePatients } from '../../context/PatientContext';
import {
  Plus,
  Search,
  Users,
  FileText,
  Pill,
  Activity,
  ArrowRight,
  Upload,
  UserPlus,
  X,
  Phone,
  Calendar
} from 'lucide-react';

export const PatientList = () => {
  const {
    patients,
    searchTerm,
    setSearchTerm,
    navigateTo,
    importBackup
  } = usePatients();

  const fileInputRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [genderFilter, setGenderFilter] = useState('ALL'); // 'ALL', 'Male', 'Female'
  const pageSize = 8;

  // KPI Calculations
  const stats = useMemo(() => {
    let totalConsultations = 0;
    let totalMeds = 0;
    let totalLabs = 0;

    patients.forEach(p => {
      totalConsultations += (p.notes?.length || 0);
      totalMeds += (p.medications?.length || 0);
      totalLabs += (p.labReports?.length || 0);
    });

    return {
      totalPatients: patients.length,
      totalConsultations,
      totalMeds,
      totalLabs
    };
  }, [patients]);

  // Filter patients by name/phone and gender
  const filteredPatients = useMemo(() => {
    const term = (searchTerm || '').toLowerCase().trim();
    return patients.filter(p => {
      const matchesSearch = !term ||
        (p.name || '').toLowerCase().includes(term) ||
        (p.phone || '').includes(term);

      const matchesGender = genderFilter === 'ALL' || p.gender === genderFilter;

      return matchesSearch && matchesGender;
    });
  }, [patients, searchTerm, genderFilter]);

  const totalItems = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + pageSize);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        importBackup(json);
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
    return '—';
  };

  return (
    <div>
      {/* Top action header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Directory</h1>
          <p className="page-subtitle">
            Manage outpatient clinical consultations, prescriptions, and lab diagnostics.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import patient backup JSON file"
          >
            <Upload size={15} />
            <span>Import</span>
          </button>

          <button
            type="button"
            className="btn btn-cyan"
            onClick={() => navigateTo('new')}
          >
            <UserPlus size={16} />
            <span>New Patient</span>
          </button>
        </div>
      </div>

      {/* KPI Dashboard Metric Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info-block">
            <span className="kpi-label">Active Patients</span>
            <span className="kpi-value">{stats.totalPatients}</span>
          </div>
          <div className="kpi-icon-badge" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info-block">
            <span className="kpi-label">Consultations</span>
            <span className="kpi-value">{stats.totalConsultations}</span>
          </div>
          <div className="kpi-icon-badge" style={{ background: '#d1fae5', color: '#059669' }}>
            <FileText size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info-block">
            <span className="kpi-label">Prescriptions</span>
            <span className="kpi-value">{stats.totalMeds}</span>
          </div>
          <div className="kpi-icon-badge" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Pill size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info-block">
            <span className="kpi-label">Lab Investigations</span>
            <span className="kpi-value">{stats.totalLabs}</span>
          </div>
          <div className="kpi-icon-badge" style={{ background: '#e0e7ff', color: '#4f46e5' }}>
            <Activity size={22} />
          </div>
        </div>
      </div>

      {/* Modern Filter Toolbar */}
      <div className="filter-toolbar">
        <div className="search-input-group">
          <Search
            size={16}
            color="var(--text-dim)"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="search-input"
            placeholder="Search by patient name or phone (MRN)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={14} color="var(--text-dim)" />
            </button>
          )}
        </div>

        <div className="filter-chip-group">
          <button
            type="button"
            className={`filter-chip ${genderFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => { setGenderFilter('ALL'); setCurrentPage(1); }}
          >
            All Patients ({patients.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${genderFilter === 'Male' ? 'active' : ''}`}
            onClick={() => { setGenderFilter('Male'); setCurrentPage(1); }}
          >
            Male
          </button>
          <button
            type="button"
            className={`filter-chip ${genderFilter === 'Female' ? 'active' : ''}`}
            onClick={() => { setGenderFilter('Female'); setCurrentPage(1); }}
          >
            Female
          </button>
        </div>
      </div>

      {/* Modern Patient Table */}
      <div className="modern-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '32%' }}>Patient Information</th>
              <th style={{ width: '16%' }}>Age &amp; Gender</th>
              <th style={{ width: '14%' }}>Blood Group</th>
              <th style={{ width: '22%' }}>Contact / MRN</th>
              <th style={{ width: '16%', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '52px 20px', color: 'var(--text-muted)' }}>
                  <Users size={38} color="var(--text-dim)" style={{ margin: '0 auto 12px', display: 'block' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>No patients found</p>
                  <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
                    {searchTerm ? `No matches for "${searchTerm}". Try a different name or phone.` : 'Start by clicking "+ New Patient"'}
                  </p>
                </td>
              </tr>
            ) : (
              currentPatients.map((patient) => {
                const isPositive = (patient.bloodGroup || '').includes('+');
                return (
                  <tr key={patient.id}>
                    <td>
                      <div className="patient-identity-cell">
                        <div
                          className="patient-avatar-badge"
                          style={{ background: getAvatarGradient(patient.name) }}
                        >
                          {getInitials(patient.name)}
                        </div>
                        <div>
                          <button
                            type="button"
                            className="patient-name-link"
                            onClick={() => navigateTo('detail', patient.id)}
                          >
                            {patient.name}
                          </button>
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {patient.notes?.length || 0} notes · {patient.medications?.length || 0} Rx
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatAgeDisplay(patient)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {patient.gender}
                      </div>
                    </td>

                    <td>
                      {patient.bloodGroup ? (
                        <span className={`blood-badge ${isPositive ? 'blood-badge-pos' : 'blood-badge-neg'}`}>
                          {patient.bloodGroup}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>—</span>
                      )}
                    </td>

                    <td>
                      <div className="phone-mono">{patient.phone}</div>
                      {patient.address && (
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: 180 }}>
                          {patient.address}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                        onClick={() => navigateTo('detail', patient.id)}
                      >
                        <span>Open Record</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination & Summary Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#fafbfc',
            fontSize: '0.875rem',
            color: 'var(--text-muted)'
          }}
        >
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{totalItems === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, totalItems)}</strong> of {totalItems} patients
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{ opacity: currentPage <= 1 ? 0.5 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                className={`btn btn-sm ${num === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                style={{ minWidth: 32, padding: '4px 8px' }}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{ opacity: currentPage >= totalPages ? 0.5 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
