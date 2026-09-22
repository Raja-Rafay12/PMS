import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';
import { ClinicSettingsModal } from './ClinicSettingsModal';
import {
  Activity,
  Settings,
  LogOut,
  Download,
  ShieldCheck,
  Stethoscope,
  LayoutDashboard,
  Users
} from 'lucide-react';

export const Header = () => {
  const { currentUser, isAdmin, isDoctor, logout } = useAuth();
  const { clinicConfig, viewMode, setViewMode, navigateTo, exportBackup, showToast } = usePatients();
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully');
  };

  const displayName = currentUser?.name || clinicConfig.doctorName || 'Dr. Sufyan Akram';
  const roleTitle = isAdmin ? 'System Administrator' : (currentUser?.specialty || 'Consultant Physician');

  const initials = displayName
    .replace('Dr. ', '')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'DR';

  return (
    <>
      <header className="navbar">
        <div
          className="nav-brand"
          onClick={() => {
            if (!isAdmin) {
              navigateTo('list');
            }
          }}
          style={{ cursor: isAdmin ? 'default' : 'pointer' }}
          title={isAdmin ? "Admin Control Panel" : "Go to Patient Directory"}
        >
          <div className="brand-icon-wrapper">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <div className="brand-text-block">
            <span className="brand-title">PatientCare</span>
            <span className="brand-subtitle">{clinicConfig.clinicName || 'Clinical Management'}</span>
          </div>
        </div>

        <div className="nav-user-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm no-print"
            onClick={exportBackup}
            title="Download full JSON backup of patients and records"
          >
            <Download size={14} />
            <span>Backup Data</span>
          </button>

          {/* Doctor / User Profile Chip */}
          <div
            className="doctor-profile-chip"
            onClick={() => {
              if (isDoctor) setIsConfigOpen(true);
            }}
            style={{ cursor: isDoctor ? 'pointer' : 'default' }}
            title={isDoctor ? "Configure Doctor Credentials & Letterhead" : "System Administrator Profile"}
          >
            <div className={`doctor-avatar-circle ${isAdmin ? 'admin-avatar' : ''}`}>
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              <span className="doctor-chip-name">{displayName}</span>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)' }}>
                {isAdmin ? '🛡️ Administrator' : `🩺 ${roleTitle}`}
              </span>
            </div>
            <div className="doctor-status-dot" />
          </div>

          {/* Logout Button */}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={handleLogout}
            title="Sign out of workstation"
          >
            <LogOut size={15} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem' }}>Sign Out</span>
          </button>
        </div>
      </header>

      <ClinicSettingsModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
      />
    </>
  );
};
