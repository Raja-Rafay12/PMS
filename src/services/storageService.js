import { initialPatients, initialClinicConfig } from './initialData';

const PATIENTS_STORAGE_KEY = 'pms_patients_v1';
const CLINIC_STORAGE_KEY = 'pms_clinic_config_v1';

export const loadPatients = () => {
  try {
    const saved = localStorage.getItem(PATIENTS_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(initialPatients));
      return initialPatients;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialPatients;
  } catch (err) {
    console.error('Failed to load patients from localStorage:', err);
    return initialPatients;
  }
};

export const savePatients = (patients) => {
  try {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
  } catch (err) {
    console.error('Failed to save patients to localStorage:', err);
  }
};

export const loadClinicConfig = () => {
  try {
    const saved = localStorage.getItem(CLINIC_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(initialClinicConfig));
      return initialClinicConfig;
    }
    return JSON.parse(saved);
  } catch (err) {
    console.error('Failed to load clinic config:', err);
    return initialClinicConfig;
  }
};

export const saveClinicConfig = (config) => {
  try {
    localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save clinic config:', err);
  }
};

const DOCTOR_LETTERHEADS_KEY = 'pms_doctor_letterheads_v1';

export const loadDoctorLetterheads = () => {
  try {
    const saved = localStorage.getItem(DOCTOR_LETTERHEADS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (err) {
    console.error('Failed to load doctor letterheads from localStorage:', err);
    return {};
  }
};

export const saveDoctorLetterheads = (letterheads) => {
  try {
    localStorage.setItem(DOCTOR_LETTERHEADS_KEY, JSON.stringify(letterheads || {}));
  } catch (err) {
    console.error('Failed to save doctor letterheads to localStorage:', err);
  }
};

export const exportAllData = (patients, clinicConfig) => {
  const exportPayload = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    clinicConfig,
    patients
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStamp = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `patients_backup_${dateStamp}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
