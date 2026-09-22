import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { loadPatients, savePatients, loadClinicConfig, saveClinicConfig, exportAllData } from '../services/storageService';
import { clinicalApi } from '../services/api';
import { useAuth } from './AuthContext';

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated;
  const isDoctor = auth?.isDoctor;

  const [patients, setPatients] = useState(() => loadPatients());
  const [clinicConfig, setClinicConfig] = useState(() => loadClinicConfig());
  const [activePatientId, setActivePatientId] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'new', 'detail', 'edit-patient', 'print'
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'examination', 'medications', 'labReports', 'impressionAdvice'
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const fetchedOnce = useRef(false);

  // Fetch live patient records from backend when doctor is logged in
  useEffect(() => {
    if (isAuthenticated && isDoctor) {
      clinicalApi.getPatients()
        .then(res => {
          if (res.success && Array.isArray(res.patients) && res.patients.length > 0) {
            setPatients(res.patients);
          }
        })
        .catch(err => {
          console.warn('Backend patient sync note:', err.message);
        });
    }
  }, [isAuthenticated, isDoctor]);

  // Load confidential doctor personal notes on-demand when patient is opened (/cso Zero-Trust)
  useEffect(() => {
    if (activePatientId && isDoctor) {
      clinicalApi.getPersonalNotes(activePatientId)
        .then(res => {
          if (res.success && typeof res.personalNotes === 'string') {
            setPatients(prev =>
              prev.map(p => (p.id === activePatientId ? { ...p, personalNotes: res.personalNotes } : p))
            );
          }
        })
        .catch(err => {
          console.warn('Confidential note vault status:', err.message);
        });
    }
  }, [activePatientId, isDoctor]);

  // Sync with localStorage
  useEffect(() => {
    savePatients(patients);
  }, [patients]);

  useEffect(() => {
    saveClinicConfig(clinicConfig);
  }, [clinicConfig]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast(curr => (curr && curr.id === id ? null : curr));
    }, 3500);
  };

  const activePatient = patients.find(p => p.id === activePatientId) || null;

  const navigateTo = (mode, patientId = null, tab = 'history') => {
    if (patientId) {
      setActivePatientId(patientId);
    }
    if (tab) {
      setActiveTab(tab);
    }
    setViewMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addPatient = (patientData) => {
    const newId = 'pat-' + Date.now();
    const newPatient = {
      id: newId,
      notes: [],
      examinations: [],
      medications: [],
      labReports: [],
      impressionAdvice: { impression: '', advice: '' },
      ...patientData
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(`Patient "${patientData.name}" created successfully`);

    // Asynchronously synchronize with backend
    clinicalApi.createPatient(newPatient).catch(err => {
      console.warn('Backend sync note for createPatient:', err.message);
    });

    return newId;
  };

  const updatePatient = (id, updatedFields) => {
    setPatients(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    showToast('Patient details updated');

    clinicalApi.updatePatient(id, updatedFields).catch(err => {
      console.warn('Backend sync note for updatePatient:', err.message);
    });
  };

  const deletePatient = (id) => {
    const p = patients.find(pat => pat.id === id);
    setPatients(prev => prev.filter(pat => pat.id !== id));
    if (activePatientId === id) {
      setActivePatientId(null);
      setViewMode('list');
    }
    showToast(`Patient ${p ? `"${p.name}"` : ''} deleted`);

    clinicalApi.deletePatient(id).catch(err => {
      console.warn('Backend sync note for deletePatient:', err.message);
    });
  };

  // Clinical Notes CRUD
  const addClinicalNote = (patientId, noteData) => {
    const noteId = 'note-' + Date.now();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const newNote = {
      id: noteId,
      date: now.toISOString(),
      formattedDate,
      ...noteData
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          notes: [newNote, ...(p.notes || [])]
        };
      })
    );
    showToast('Clinical note added');

    clinicalApi.addClinicalNote(patientId, newNote).catch(err => {
      console.warn('Backend sync note for clinicalNote:', err.message);
    });
  };

  const updateClinicalNote = (patientId, noteId, updatedFields) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          notes: (p.notes || []).map(n => (n.id === noteId ? { ...n, ...updatedFields } : n))
        };
      })
    );
    showToast('Clinical note updated');
  };

  const deleteClinicalNote = (patientId, noteId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          notes: (p.notes || []).filter(n => n.id !== noteId)
        };
      })
    );
    showToast('Clinical note removed');
  };

  // Physical Examination CRUD
  const addExamination = (patientId, examData) => {
    const examId = 'exam-' + Date.now();
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    const newExam = {
      id: examId,
      date: now.toISOString(),
      formattedDate,
      ...examData
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          examinations: [newExam, ...(p.examinations || [])]
        };
      })
    );
    showToast('Physical examination saved');

    clinicalApi.addVitals(patientId, newExam).catch(err => {
      console.warn('Backend sync note for examination:', err.message);
    });
  };

  const updateExamination = (patientId, examId, updatedFields) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          examinations: (p.examinations || []).map(e => (e.id === examId ? { ...e, ...updatedFields } : e))
        };
      })
    );
    showToast('Examination updated');
  };

  const deleteExamination = (patientId, examId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          examinations: (p.examinations || []).filter(e => e.id !== examId)
        };
      })
    );
    showToast('Examination removed');
  };

  // Medications CRUD
  const addMedications = (patientId, medsArray) => {
    const formattedMeds = medsArray.map(m => ({
      id: 'med-' + Math.random().toString(36).substr(2, 9),
      ...m
    }));

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: [...formattedMeds, ...(p.medications || [])]
        };
      })
    );
    showToast(medsArray.length > 1 ? `${medsArray.length} medications added` : 'Medication added');

    clinicalApi.addMedications(patientId, formattedMeds).catch(err => {
      console.warn('Backend sync note for medications:', err.message);
    });
  };

  const updateMedication = (patientId, medId, updatedFields) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: (p.medications || []).map(m => (m.id === medId ? { ...m, ...updatedFields } : m))
        };
      })
    );
    showToast('Medication updated');
  };

  const deleteMedication = (patientId, medId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          medications: (p.medications || []).filter(m => m.id !== medId)
        };
      })
    );
    showToast('Medication deleted');
  };

  // Lab Reports CRUD
  const addLabReport = (patientId, reportData) => {
    const reportId = 'lab-' + Date.now();
    const newReport = {
      id: reportId,
      ...reportData
    };

    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          labReports: [newReport, ...(p.labReports || [])]
        };
      })
    );
    showToast('Lab report saved');
  };

  const deleteLabReport = (patientId, reportId) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          labReports: (p.labReports || []).filter(l => l.id !== reportId)
        };
      })
    );
    showToast('Lab report deleted');
  };

  // Impression & Advice
  const updateImpressionAdvice = (patientId, impressionAdvice) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          impressionAdvice
        };
      })
    );
    showToast('Impression & advice saved');

    clinicalApi.updateImpressionAdvice(patientId, impressionAdvice).catch(err => {
      console.warn('Backend sync note for impressionAdvice:', err.message);
    });
  };

  // Personal Doctor Note (Strictly Private - Never printed)
  const updatePersonalNotes = (patientId, personalNotes) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          personalNotes
        };
      })
    );
    showToast('Personal note updated in private vault');

    clinicalApi.savePersonalNotes(patientId, personalNotes).catch(err => {
      console.warn('Backend sync note for personalNotes:', err.message);
    });
  };

  // Backup & Restore
  const handleExportBackup = () => {
    exportAllData(patients, clinicConfig);
    showToast('Data backup downloaded');
  };

  const handleImportBackup = (jsonData) => {
    try {
      if (jsonData.patients && Array.isArray(jsonData.patients)) {
        setPatients(jsonData.patients);
        if (jsonData.clinicConfig) {
          setClinicConfig(jsonData.clinicConfig);
        }
        showToast(`Successfully restored ${jsonData.patients.length} patients!`);
        return true;
      } else {
        throw new Error('Invalid backup file format');
      }
    } catch (err) {
      showToast(err.message || 'Failed to import backup', 'error');
      return false;
    }
  };

  const value = {
    patients,
    clinicConfig,
    setClinicConfig,
    activePatientId,
    activePatient,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    searchTerm,
    toast,
    setSearchTerm,
    navigateTo,
    addPatient,
    updatePatient,
    deletePatient,
    addClinicalNote,
    updateClinicalNote,
    deleteClinicalNote,
    addExamination,
    updateExamination,
    deleteExamination,
    addMedications,
    updateMedication,
    deleteMedication,
    addLabReport,
    deleteLabReport,
    updateImpressionAdvice,
    updatePersonalNotes,
    exportBackup: handleExportBackup,
    importBackup: handleImportBackup,
    showToast
  };

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
