/**
 * PatientCare API Client Service (/cso Compliant)
 * Handles JWT Bearer authorization, role gating, and server API calls with fallback
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'pms_auth_token_v1';

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY) || null;
};

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Core authenticated fetch wrapper
 */
const apiFetch = async (endpoint, options = {}) => {
  const token = getStoredToken();
  const headers = {
    ...(options.headers || {})
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || `HTTP error ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const authApi = {
  loginDoctor: async (identifier, password) => {
    const res = await apiFetch('/auth/doctor/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  loginAdmin: async (identifier, password) => {
    const res = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
    if (res.token) setStoredToken(res.token);
    return res;
  },

  getMe: async () => {
    return apiFetch('/auth/me');
  },

  logout: () => {
    setStoredToken(null);
  }
};

export const clinicalApi = {
  getPatients: async () => {
    return apiFetch('/patients');
  },

  getPatient: async (id) => {
    return apiFetch(`/patients/${id}`);
  },

  createPatient: async (patientData) => {
    return apiFetch('/patients', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  },

  updatePatient: async (id, updatedFields) => {
    return apiFetch(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });
  },

  deletePatient: async (id) => {
    return apiFetch(`/patients/${id}`, {
      method: 'DELETE'
    });
  },

  addClinicalNote: async (patientId, noteData) => {
    return apiFetch(`/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify(noteData)
    });
  },

  addVitals: async (patientId, examData) => {
    return apiFetch(`/patients/${patientId}/vitals`, {
      method: 'POST',
      body: JSON.stringify(examData)
    });
  },

  addMedications: async (patientId, medications) => {
    return apiFetch(`/patients/${patientId}/medications`, {
      method: 'POST',
      body: JSON.stringify({ medications })
    });
  },

  deleteMedication: async (patientId, medId) => {
    return apiFetch(`/patients/${patientId}/medications/${medId}`, {
      method: 'DELETE'
    });
  },

  updateImpressionAdvice: async (patientId, impressionAdvice) => {
    return apiFetch(`/patients/${patientId}/impression-advice`, {
      method: 'PUT',
      body: JSON.stringify(impressionAdvice)
    });
  },

  // Confidential Doctor Personal Notes Vault
  getPersonalNotes: async (patientId) => {
    return apiFetch(`/patients/${patientId}/personal-notes`);
  },

  savePersonalNotes: async (patientId, personalNotes) => {
    return apiFetch(`/patients/${patientId}/personal-notes`, {
      method: 'PUT',
      body: JSON.stringify({ personalNotes })
    });
  },

  // Upload Lab Report with documents
  uploadLabReport: async (patientId, formData) => {
    return apiFetch(`/labs/${patientId}`, {
      method: 'POST',
      body: formData
    });
  },

  deleteLabReport: async (patientId, labId) => {
    return apiFetch(`/labs/${patientId}/${labId}`, {
      method: 'DELETE'
    });
  }
};

export const adminApi = {
  getMetrics: async () => {
    return apiFetch('/admin/metrics');
  },

  getDoctors: async () => {
    return apiFetch('/admin/doctors');
  },

  createDoctor: async (doctorData) => {
    return apiFetch('/admin/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData)
    });
  },

  updateDoctor: async (doctorId, updatedFields) => {
    return apiFetch(`/admin/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    });
  },

  resetPassword: async (doctorId, newPassword) => {
    return apiFetch(`/admin/doctors/${doctorId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ newPassword })
    });
  },

  deleteDoctor: async (doctorId) => {
    return apiFetch(`/admin/doctors/${doctorId}`, {
      method: 'DELETE'
    });
  },

  getClinicConfig: async () => {
    return apiFetch('/admin/clinic-config');
  },

  updateClinicConfig: async (config) => {
    return apiFetch('/admin/clinic-config', {
      method: 'PUT',
      body: JSON.stringify(config)
    });
  },

  getAuditLogs: async () => {
    return apiFetch('/admin/audit-logs');
  },

  clearAuditLogs: async () => {
    return apiFetch('/admin/audit-logs/clear', {
      method: 'POST'
    });
  }
};
