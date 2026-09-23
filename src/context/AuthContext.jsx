import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, adminApi, getStoredToken } from '../services/api';
import { loadDoctorLetterheads, saveDoctorLetterheads } from '../services/storageService';

const AuthContext = createContext(null);

const AUTH_USER_KEY = 'pms_auth_user_v1';
const DOCTORS_STORAGE_KEY = 'pms_doctors_v1';
const AUDIT_LOGS_KEY = 'pms_audit_logs_v1';

export const AuthProvider = ({ children }) => {
  // Load current authenticated user session
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem(DOCTORS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [doctorLetterheads, setDoctorLetterheads] = useState(() => loadDoctorLetterheads());

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(AUDIT_LOGS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    saveDoctorLetterheads(doctorLetterheads);
  }, [doctorLetterheads]);

  // Verify stored session on boot
  useEffect(() => {
    const token = getStoredToken();
    if (token && !currentUser) {
      authApi.getMe()
        .then(res => {
          if (res.success && res.user) {
            setCurrentUser(res.user);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
          }
        })
        .catch(() => {
          authApi.logout();
          localStorage.removeItem(AUTH_USER_KEY);
          setCurrentUser(null);
        });
    }
  }, []);

  // When admin is logged in, sync live doctors and audit logs from backend & Supabase
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      adminApi.getDoctors()
        .then(res => {
          if (res.success && Array.isArray(res.doctors)) {
            setDoctors(res.doctors);
            localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(res.doctors));
          }
        })
        .catch(err => console.warn('Admin doctors sync notice:', err.message));

      adminApi.getAuditLogs()
        .then(res => {
          if (res.success && Array.isArray(res.auditLogs)) {
            setAuditLogs(res.auditLogs);
            localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(res.auditLogs));
          }
        })
        .catch(err => console.warn('Admin audit logs sync notice:', err.message));
    }

    if (currentUser) {
      adminApi.getDoctorLetterheads()
        .then(res => {
          if (res.success && res.doctorLetterheads) {
            setDoctorLetterheads(prev => ({ ...prev, ...res.doctorLetterheads }));
          }
        })
        .catch(err => console.warn('Doctor letterheads sync note:', err.message));
    }
  }, [currentUser]);

  // Helper to record an audit entry
  const recordAudit = (action, details, category = 'auth', performedBy = null) => {
    const actor = performedBy || (currentUser ? currentUser.name : 'System');
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      action,
      details,
      category,
      performedBy: actor
    };

    setAuditLogs(prev => [newLog, ...prev.slice(0, 499)]);
  };

  // Doctor login - verified strictly against database via API
  const loginDoctor = async (identifier, password) => {
    try {
      const res = await authApi.loginDoctor(identifier, password);
      if (res.success && res.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.error || 'Invalid credentials' };
    } catch (apiErr) {
      return {
        success: false,
        message: apiErr.data?.error || apiErr.message || 'Authentication failed. Please check credentials.'
      };
    }
  };

  // Admin login - verified strictly against database via API
  const loginAdmin = async (identifier, password) => {
    try {
      const res = await authApi.loginAdmin(identifier, password);
      if (res.success && res.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
        setCurrentUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.error || 'Invalid credentials' };
    } catch (apiErr) {
      return {
        success: false,
        message: apiErr.data?.error || apiErr.message || 'Invalid admin credentials or passkey.'
      };
    }
  };

  // Logout
  const logout = () => {
    authApi.logout();
    if (currentUser) {
      recordAudit('User Logged Out', `User ${currentUser.name} (${currentUser.role}) signed out`, 'auth');
    }
    localStorage.removeItem(AUTH_USER_KEY);
    setCurrentUser(null);
  };

  // Doctor Management (Admin functions - synchronized directly with backend and database)
  const addDoctor = async (docData) => {
    try {
      const res = await adminApi.createDoctor(docData);
      if (res.success && res.doctor) {
        setDoctors(prev => [res.doctor, ...prev]);
        recordAudit('Doctor Account Created', `Created account for ${res.doctor.name} (${res.doctor.email})`, 'admin');
        return res.doctor;
      }
    } catch (err) {
      console.warn('Backend create doctor notice:', err.message);
    }
  };

  const updateDoctor = async (doctorId, updatedFields) => {
    try {
      const res = await adminApi.updateDoctor(doctorId, updatedFields);
      if (res.success && res.doctor) {
        setDoctors(prev =>
          prev.map(d => (d.id === doctorId ? { ...d, ...res.doctor } : d))
        );
      }
    } catch (err) {
      console.warn('Backend update doctor notice:', err.message);
      setDoctors(prev =>
        prev.map(d => (d.id === doctorId ? { ...d, ...updatedFields } : d))
      );
    }
    recordAudit('Doctor Account Updated', `Updated fields for doctor ID: ${doctorId}`, 'admin');
  };

  const resetDoctorPassword = async (doctorId, newPassword) => {
    try {
      await adminApi.resetPassword(doctorId, newPassword);
    } catch (err) {
      console.warn('Backend reset password notice:', err.message);
    }
    recordAudit('Doctor Password Reset', `Reset password for doctor ID: ${doctorId}`, 'admin');
  };

  const deleteDoctor = async (doctorId) => {
    const docToDelete = doctors.find(d => d.id === doctorId);
    try {
      await adminApi.deleteDoctor(doctorId);
    } catch (err) {
      console.warn('Backend delete doctor notice:', err.message);
    }
    setDoctors(prev => prev.filter(d => d.id !== doctorId));
    recordAudit(
      'Doctor Account Deleted',
      `Deleted doctor ${docToDelete ? docToDelete.name : doctorId}`,
      'admin'
    );
  };

  const clearAuditLogs = async () => {
    try {
      await adminApi.clearAuditLogs();
    } catch (err) {
      console.warn('Backend clear audit logs notice:', err.message);
    }
    setAuditLogs([]);
    localStorage.removeItem(AUDIT_LOGS_KEY);
    recordAudit('Audit Logs Purged', 'All previous security audit records were cleared by Admin', 'admin');
  };

  const updateDoctorLetterhead = async (doctorId, letterheadData) => {
    // 1. Optimistic update in state & localStorage
    setDoctorLetterheads(prev => {
      const updated = {
        ...prev,
        [doctorId]: {
          ...(prev[doctorId] || {}),
          ...letterheadData,
          updatedAt: new Date().toISOString()
        }
      };
      saveDoctorLetterheads(updated);
      return updated;
    });

    // 2. Synchronize to backend / Supabase
    try {
      const res = await adminApi.updateDoctorLetterhead(doctorId, letterheadData);
      if (res.success && res.letterhead) {
        setDoctorLetterheads(prev => ({
          ...prev,
          [doctorId]: res.letterhead
        }));
      }
    } catch (err) {
      console.warn('Backend updateDoctorLetterhead notice:', err.message);
    }

    recordAudit('Doctor Letterhead Updated', `Configured clinical letterhead for doctor ID: ${doctorId}`, 'admin');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    isDoctor: currentUser?.role === 'doctor',
    doctors,
    doctorLetterheads,
    auditLogs,
    loginDoctor,
    loginAdmin,
    logout,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    resetDoctorPassword,
    updateDoctorLetterhead,
    recordAudit,
    clearAuditLogs
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
