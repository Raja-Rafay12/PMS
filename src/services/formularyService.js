// Formulary Service: Handles medication searching, autocomplete, doctor custom favorites, and disease bundles
import { CLINICAL_FORMULARY, CLINICAL_DISEASE_BUNDLES } from '../data/clinicalFormulary';

const CUSTOM_FORMULARY_STORAGE_KEY = 'pms_custom_doctor_formulary';
const FAVORITES_STORAGE_KEY = 'pms_doctor_favorite_med_ids';

// Load custom user-added medications from persistent storage
export const getCustomMedications = () => {
  try {
    const raw = localStorage.getItem(CUSTOM_FORMULARY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load custom formulary:', err);
    return [];
  }
};

// Save a new or edited custom medication
export const saveCustomMedication = (med) => {
  if (!med || !med.name || med.name.trim().length === 0) return null;

  try {
    const current = getCustomMedications();
    const cleanName = med.name.trim();

    // Check if already exists by name
    const existingIndex = current.findIndex(
      m => m.name.toLowerCase() === cleanName.toLowerCase()
    );

    const newMedObj = {
      id: med.id || `custom-${Date.now()}`,
      name: cleanName,
      generic: med.generic || '',
      dose: med.dose || '',
      doseType: med.doseType || 'Tablet',
      frequency: med.frequency || 'Once daily',
      route: med.route || 'Oral',
      days: med.days || 7,
      comment: med.comment || '',
      category: med.category || 'all',
      isCustom: true,
      lastUpdated: new Date().toISOString()
    };

    let updated;
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = { ...updated[existingIndex], ...newMedObj };
    } else {
      updated = [newMedObj, ...current];
    }

    localStorage.setItem(CUSTOM_FORMULARY_STORAGE_KEY, JSON.stringify(updated));
    return newMedObj;
  } catch (err) {
    console.error('Failed to save custom medication:', err);
    return null;
  }
};

// Delete a custom medication
export const deleteCustomMedication = (id) => {
  try {
    const current = getCustomMedications();
    const filtered = current.filter(m => m.id !== id);
    localStorage.setItem(CUSTOM_FORMULARY_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete custom medication:', err);
    return false;
  }
};

// Get all combined medications (Built-in + Doctor custom additions)
export const getAllMedications = () => {
  const custom = getCustomMedications();
  // Filter out any built-ins that have a custom override
  const customNames = new Set(custom.map(c => c.name.toLowerCase()));
  const filteredBuiltIns = CLINICAL_FORMULARY.filter(b => !customNames.has(b.name.toLowerCase()));
  return [...custom, ...filteredBuiltIns];
};

// Autocomplete Search: matches name, generic, brand prefix, or category
export const searchMedications = (query = '', category = 'all', limit = 12) => {
  const all = getAllMedications();

  if (!query || query.trim().length === 0) {
    if (category === 'all') return all.slice(0, limit);
    return all.filter(m => m.category === category).slice(0, limit);
  }

  const clean = query.trim().toLowerCase();

  // Score matches:
  // Starts with name -> score 100
  // Starts with generic -> score 80
  // Contains name -> score 60
  // Contains generic -> score 40
  // Contains category -> score 20
  const scored = [];

  all.forEach(med => {
    if (category !== 'all' && med.category !== category) return;

    const medName = med.name.toLowerCase();
    const genName = (med.generic || '').toLowerCase();

    let score = 0;
    if (medName.startsWith(clean)) {
      score = 100 - (medName.length - clean.length);
    } else if (genName.startsWith(clean)) {
      score = 80;
    } else if (medName.includes(clean)) {
      score = 60;
    } else if (genName.includes(clean)) {
      score = 40;
    }

    if (score > 0) {
      scored.push({ med, score });
    }
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.med);
};

// Favorites management
export const getFavoriteMedicationIds = () => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      // Default initial favorites: Loprin, Concor, Crestat, Nexum, Augmentin, Panadol, Acefyl
      return ['med-loprin', 'med-concor-25', 'med-crestat-10', 'med-nexum-40', 'med-vasteral', 'med-augmentin-625', 'med-panadol-500', 'med-gaviscon-syrup'];
    }
    return JSON.parse(raw);
  } catch {
    return ['med-loprin', 'med-concor-25', 'med-crestat-10', 'med-nexum-40'];
  }
};

export const toggleFavoriteMedication = (medId) => {
  try {
    const current = getFavoriteMedicationIds();
    const exists = current.includes(medId);
    const updated = exists ? current.filter(id => id !== medId) : [...current, medId];
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to toggle favorite:', err);
    return [];
  }
};

export const getFavoriteMedications = () => {
  const favIds = new Set(getFavoriteMedicationIds());
  const all = getAllMedications();
  return all.filter(m => favIds.has(m.id));
};

export const getAllDiseaseBundles = () => {
  return CLINICAL_DISEASE_BUNDLES;
};
