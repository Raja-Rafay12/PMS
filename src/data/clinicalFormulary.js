// Comprehensive Clinical Formulary Database for Primary Care, Cardiology, and Multi-Specialty Clinics
// Contains standard dosages, formulations, routes, frequencies, instructions (English & Urdu), and diagnosis associations.

export const CLINICAL_SPECIALTIES = [
  { id: 'all', label: 'All Specialties', icon: '🏥' },
  { id: 'cardiology', label: 'Cardiology & HTN', icon: '❤️' },
  { id: 'gastroenterology', label: 'Gastroenterology / GI', icon: '🫄' },
  { id: 'diabetes_endocrine', label: 'Diabetes & Endocrine', icon: '🩸' },
  { id: 'antibiotics', label: 'Antibiotics & Infections', icon: '🦠' },
  { id: 'respiratory', label: 'Respiratory & ENT', icon: '🫁' },
  { id: 'pain_neuro', label: 'Pain & Neurology', icon: '⚡' },
  { id: 'vitamins', label: 'Vitamins & Supplements', icon: '💊' }
];

export const CLINICAL_FORMULARY = [
  // ─── CARDIOLOGY & HYPERTENSION ───
  {
    id: 'med-loprin',
    name: 'Loprin (Aspirin)',
    generic: 'Aspirin',
    dose: '75 mg',
    doseType: 'Tablet',
    frequency: '0-1-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take after lunch with water',
    category: 'cardiology',
    indications: ['hypertension', 'angina', 'ihd', 'cad', 'myocardial infarction', 'heart attack', 'chest pain', 'post pci', 'cabg']
  },
  {
    id: 'med-loprin-150',
    name: 'Loprin (Aspirin)',
    generic: 'Aspirin',
    dose: '150 mg',
    doseType: 'Tablet',
    frequency: '0-1-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take after meals with plenty of water',
    category: 'cardiology',
    indications: ['acute coronary syndrome', 'ihd', 'stent', 'angina']
  },
  {
    id: 'med-plavix',
    name: 'Plavix (Clopidogrel)',
    generic: 'Clopidogrel',
    dose: '75 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning with or without food',
    category: 'cardiology',
    indications: ['stent', 'post pci', 'acs', 'ihd', 'stroke', 'antiplatelet']
  },
  {
    id: 'med-concor-25',
    name: 'Concor (Bisoprolol)',
    generic: 'Bisoprolol Fumarate',
    dose: '2.5 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning. Check pulse rate regularly',
    category: 'cardiology',
    indications: ['hypertension', 'angina', 'tachycardia', 'heart failure', 'ihd']
  },
  {
    id: 'med-concor-5',
    name: 'Concor (Bisoprolol)',
    generic: 'Bisoprolol Fumarate',
    dose: '5 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take once daily in the morning',
    category: 'cardiology',
    indications: ['hypertension', 'angina', 'ihd', 'arrhythmia']
  },
  {
    id: 'med-crestat-10',
    name: 'Crestat (Rosuvastatin)',
    generic: 'Rosuvastatin Calcium',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take at night before sleeping',
    category: 'cardiology',
    indications: ['hyperlipidemia', 'cholesterol', 'dyslipidemia', 'ihd', 'cad', 'atherosclerosis']
  },
  {
    id: 'med-crestat-20',
    name: 'Crestat (Rosuvastatin)',
    generic: 'Rosuvastatin Calcium',
    dose: '20 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take at bedtime for intensive lipid lowering',
    category: 'cardiology',
    indications: ['hypercholesterolemia', 'post mi', 'cad', 'high risk ihd']
  },
  {
    id: 'med-lipitor-20',
    name: 'Lipitor (Atorvastatin)',
    generic: 'Atorvastatin',
    dose: '20 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take at night with water',
    category: 'cardiology',
    indications: ['cholesterol', 'dyslipidemia', 'ihd', 'cardiovascular risk']
  },
  {
    id: 'med-vasteral',
    name: 'Vasteral MR (Trimetazidine)',
    generic: 'Trimetazidine Dihydrochloride',
    dose: '35 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Take twice daily with meals (morning and evening)',
    category: 'cardiology',
    indications: ['angina', 'ihd', 'chest tightness', 'ischemic cardiomyopathy']
  },
  {
    id: 'med-capoten-25',
    name: 'Capoten (Captopril)',
    generic: 'Captopril',
    dose: '25 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 14,
    comment: 'Take 1 hour before meals. Do not stop abruptly',
    category: 'cardiology',
    indications: ['hypertension', 'heart failure', 'left ventricular dysfunction']
  },
  {
    id: 'med-exforge-5-80',
    name: 'Exforge (Amlodipine + Valsartan)',
    generic: 'Amlodipine + Valsartan',
    dose: '5/80 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning with water',
    category: 'cardiology',
    indications: ['essential hypertension', 'high blood pressure', 'resistant htn']
  },
  {
    id: 'med-exforge-10-160',
    name: 'Exforge (Amlodipine + Valsartan)',
    generic: 'Amlodipine + Valsartan',
    dose: '10/160 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take once daily in the morning',
    category: 'cardiology',
    indications: ['severe hypertension', 'uncontrolled bp']
  },
  {
    id: 'med-norvasc-5',
    name: 'Norvasc (Amlodipine)',
    generic: 'Amlodipine Besylate',
    dose: '5 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning. Watch for ankle swelling',
    category: 'cardiology',
    indications: ['hypertension', 'angina pectoris', 'coronary artery disease']
  },
  {
    id: 'med-angised',
    name: 'Angised (Glyceryl Trinitrate)',
    generic: 'Nitroglycerin / GTN',
    dose: '0.5 mg',
    doseType: 'Sublingual Tablet',
    frequency: 'SOS (as needed)',
    route: 'Sublingual',
    days: 30,
    comment: 'Place under tongue during acute chest pain. Sit down while taking',
    category: 'cardiology',
    indications: ['acute angina', 'chest pain', 'ischemic spasm']
  },
  {
    id: 'med-cardinit-26',
    name: 'Cardinit SR (Nitroglycerin)',
    generic: 'Nitroglycerin Sustained Release',
    dose: '2.6 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Swallow whole with water before meals',
    category: 'cardiology',
    indications: ['chronic stable angina', 'ihd prophylaxis']
  },
  {
    id: 'med-lasix-40',
    name: 'Lasix (Furosemide)',
    generic: 'Furosemide',
    dose: '40 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 14,
    comment: 'Take early morning to avoid nighttime urination',
    category: 'cardiology',
    indications: ['edema', 'congestive heart failure', 'fluid retention', 'pulmonary edema']
  },
  {
    id: 'med-aldactone-25',
    name: 'Aldactone (Spironolactone)',
    generic: 'Spironolactone',
    dose: '25 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning with food. Periodic serum potassium check advised',
    category: 'cardiology',
    indications: ['heart failure', 'resistant hypertension', 'edema', 'hypokalemia']
  },
  {
    id: 'med-entresto-50',
    name: 'Entresto (Sacubitril + Valsartan)',
    generic: 'Sacubitril / Valsartan',
    dose: '24/26 mg (50 mg)',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Take twice daily with or without food. Monitor renal profile',
    category: 'cardiology',
    indications: ['heart failure with reduced ejection fraction', 'hfref', 'chf']
  },

  // ─── GASTROENTEROLOGY & ACID-PEPTIC ───
  {
    id: 'med-nexum-40',
    name: 'Nexum (Esomeprazole)',
    generic: 'Esomeprazole Magnesium',
    dose: '40 mg',
    doseType: 'Capsule',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 14,
    comment: 'Take 30 to 45 mins before breakfast on an empty stomach',
    category: 'gastroenterology',
    indications: ['gerd', 'gastritis', 'heartburn', 'acid peptic disease', 'peptic ulcer', 'dyspepsia']
  },
  {
    id: 'med-nexum-20',
    name: 'Nexum (Esomeprazole)',
    generic: 'Esomeprazole Magnesium',
    dose: '20 mg',
    doseType: 'Capsule',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 14,
    comment: 'Take before breakfast on an empty stomach',
    category: 'gastroenterology',
    indications: ['mild gastritis', 'maintenance gerd', 'stomach burning']
  },
  {
    id: 'med-risek-20',
    name: 'Risek (Omeprazole)',
    generic: 'Omeprazole',
    dose: '20 mg',
    doseType: 'Capsule',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 14,
    comment: 'Take 30 minutes before breakfast with water',
    category: 'gastroenterology',
    indications: ['gastritis', 'ulcer', 'acidity', 'gerd', 'hyperacidity']
  },
  {
    id: 'med-risek-40',
    name: 'Risek (Omeprazole)',
    generic: 'Omeprazole',
    dose: '40 mg',
    doseType: 'Capsule',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 14,
    comment: 'Take once daily before breakfast',
    category: 'gastroenterology',
    indications: ['severe peptic ulcer', 'erosive esophagitis', 'h pylori regimen']
  },
  {
    id: 'med-gaviscon-syrup',
    name: 'Gaviscon Syrup',
    generic: 'Sodium Alginate + Sodium Bicarbonate',
    dose: '10 ml',
    doseType: 'Syrup',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 7,
    comment: 'Take after meals and at bedtime for instant heartburn relief',
    category: 'gastroenterology',
    indications: ['heartburn', 'acid reflux', 'indigestion', 'esophagitis']
  },
  {
    id: 'med-motilium-10',
    name: 'Motilium (Domperidone)',
    generic: 'Domperidone',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 5,
    comment: 'Take 15-30 minutes before meals',
    category: 'gastroenterology',
    indications: ['nausea', 'vomiting', 'bloating', 'delayed gastric emptying', 'fullness']
  },
  {
    id: 'med-flagyl-400',
    name: 'Flagyl (Metronidazole)',
    generic: 'Metronidazole',
    dose: '400 mg',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 5,
    comment: 'Take after meals. Avoid alcohol completely during therapy',
    category: 'gastroenterology',
    indications: ['gastroenteritis', 'amoebiasis', 'diarrhea', 'giardiasis', 'abdominal infection']
  },
  {
    id: 'med-duspatalin-135',
    name: 'Duspatalin (Mebeverine)',
    generic: 'Mebeverine HCl',
    dose: '135 mg',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 14,
    comment: 'Take 20 minutes before meals with water',
    category: 'gastroenterology',
    indications: ['irritable bowel syndrome', 'ibs', 'abdominal cramp', 'spastic colon']
  },
  {
    id: 'med-heptral-500',
    name: 'Heptral (Ademetionine)',
    generic: 'S-Adenosylmethionine',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Swallow whole on an empty stomach',
    category: 'gastroenterology',
    indications: ['fatty liver', 'nafld', 'intrahepatic cholestasis', 'chronic hepatitis']
  },

  // ─── DIABETES & ENDOCRINE ───
  {
    id: 'med-glucophage-500',
    name: 'Glucophage (Metformin)',
    generic: 'Metformin Hydrochloride',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Take during or immediately after meals to avoid stomach upset',
    category: 'diabetes_endocrine',
    indications: ['type 2 diabetes', 't2dm', 'insulin resistance', 'prediabetes', 'pcos']
  },
  {
    id: 'med-glucophage-xr-1000',
    name: 'Glucophage XR (Metformin)',
    generic: 'Metformin Extended Release',
    dose: '1000 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take with dinner. Swallow whole without crushing',
    category: 'diabetes_endocrine',
    indications: ['type 2 diabetes', 'hyperglycemia', 'metabolic syndrome']
  },
  {
    id: 'med-jardiance-10',
    name: 'Jardiance (Empagliflozin)',
    generic: 'Empagliflozin',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in morning with water. Maintain adequate fluid intake',
    category: 'diabetes_endocrine',
    indications: ['type 2 diabetes', 't2dm', 'heart failure', 'cardiorenal risk']
  },
  {
    id: 'med-januvia-100',
    name: 'Januvia (Sitagliptin)',
    generic: 'Sitagliptin Phosphate',
    dose: '100 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take once daily in the morning with or without food',
    category: 'diabetes_endocrine',
    indications: ['type 2 diabetes', 'glycemic control']
  },
  {
    id: 'med-galvus-met',
    name: 'Galvus Met (Vildagliptin + Metformin)',
    generic: 'Vildagliptin + Metformin',
    dose: '50/500 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Take twice daily with meals',
    category: 'diabetes_endocrine',
    indications: ['uncontrolled diabetes', 'combination therapy t2dm']
  },
  {
    id: 'med-thyroxine-50',
    name: 'Thyroxine (Levothyroxine)',
    generic: 'Levothyroxine Sodium',
    dose: '50 mcg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 60,
    comment: 'Take first thing in the morning 30 mins before tea or food',
    category: 'diabetes_endocrine',
    indications: ['hypothyroidism', 'goiter', 'hashimoto thyroiditis']
  },

  // ─── ANTIBIOTICS & INFECTIONS ───
  {
    id: 'med-augmentin-625',
    name: 'Augmentin (Co-Amoxiclav)',
    generic: 'Amoxicillin + Clavulanic Acid',
    dose: '625 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 5,
    comment: 'Take at start of meals to reduce GI intolerance. Complete full course',
    category: 'antibiotics',
    indications: ['urti', 'chest infection', 'sinusitis', 'bronchitis', 'skin infection', 'cellulitis']
  },
  {
    id: 'med-augmentin-1g',
    name: 'Augmentin (Co-Amoxiclav)',
    generic: 'Amoxicillin + Clavulanic Acid',
    dose: '1 g',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 7,
    comment: 'Take with food every 12 hours. Do not skip doses',
    category: 'antibiotics',
    indications: ['community acquired pneumonia', 'severe sinusitis', 'uti', 'dental abscess']
  },
  {
    id: 'med-cipro-500',
    name: 'Cipro (Ciprofloxacin)',
    generic: 'Ciprofloxacin HCl',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 5,
    comment: 'Take with full glass of water. Avoid milk or antacids within 2 hours',
    category: 'antibiotics',
    indications: ['urinary tract infection', 'uti', 'typhoid fever', 'bacterial diarrhea']
  },
  {
    id: 'med-zithromax-500',
    name: 'Zithromax (Azithromycin)',
    generic: 'Azithromycin',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 3,
    comment: 'Take 1 hour before or 2 hours after food for 3 consecutive days',
    category: 'antibiotics',
    indications: ['pharyngitis', 'tonsillitis', 'atypical pneumonia', 'bronchitis', 'chlamydia']
  },
  {
    id: 'med-leflox-500',
    name: 'Leflox (Levofloxacin)',
    generic: 'Levofloxacin',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 7,
    comment: 'Take once daily with plenty of water. Protect from direct sun exposure',
    category: 'antibiotics',
    indications: ['copd exacerbation', 'pneumonia', 'complicated uti', 'pyelonephritis']
  },

  // ─── RESPIRATORY, ENT & ALLERGY ───
  {
    id: 'med-acefyl-syrup',
    name: 'Acefyl Cough Syrup',
    generic: 'Acefylline Piperazine + Diphenhydramine',
    dose: '10 ml',
    doseType: 'Syrup',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 5,
    comment: 'Take 3 times daily after meals. Shake well before use',
    category: 'respiratory',
    indications: ['cough', 'productive cough', 'bronchitis', 'asthma', 'chest congestion']
  },
  {
    id: 'med-montiget-10',
    name: 'Montiget (Montelukast)',
    generic: 'Montelukast Sodium',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take once daily at evening/bedtime',
    category: 'respiratory',
    indications: ['bronchial asthma', 'allergic rhinitis', 'seasonal allergy', 'sneezing', 'wheezing']
  },
  {
    id: 'med-softin-10',
    name: 'Softin (Loratadine)',
    generic: 'Loratadine',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 7,
    comment: 'Take once daily. Non-drowsy anti-allergy formula',
    category: 'respiratory',
    indications: ['allergy', 'urticaria', 'allergic rhinitis', 'skin rash', 'itching']
  },
  {
    id: 'med-zyrtec-10',
    name: 'Zyrtec (Cetirizine)',
    generic: 'Cetirizine Dihydrochloride',
    dose: '10 mg',
    doseType: 'Tablet',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 7,
    comment: 'Take at night before sleeping',
    category: 'respiratory',
    indications: ['allergic rhinitis', 'sneezing', 'urticaria', 'itchy eyes']
  },
  {
    id: 'med-ventolin-inhaler',
    name: 'Ventolin Inhaler (Salbutamol)',
    generic: 'Salbutamol 100mcg/puff',
    dose: '2 Puffs',
    doseType: 'Inhaler',
    frequency: 'SOS (as needed)',
    route: 'Inhalation',
    days: 30,
    comment: 'Inhale 2 puffs as needed for shortness of breath or acute wheeze',
    category: 'respiratory',
    indications: ['acute asthma attack', 'bronchospasm', 'copd', 'breathlessness']
  },

  // ─── PAIN, NEUROLOGY & MUSCULOSKELETAL ───
  {
    id: 'med-panadol-500',
    name: 'Panadol (Paracetamol)',
    generic: 'Paracetamol / Acetaminophen',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 3,
    comment: 'Take after meals for fever or body aches. Max 8 tablets in 24 hours',
    category: 'pain_neuro',
    indications: ['fever', 'headache', 'body aches', 'pain', 'pyrexia', 'flu']
  },
  {
    id: 'med-panadol-cf',
    name: 'Panadol CF (Cold & Flu)',
    generic: 'Paracetamol + Pseudoephedrine + Chlorpheniramine',
    dose: '1 Tablet',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 3,
    comment: 'Take with warm water for cold, runny nose, and sinus congestion',
    category: 'pain_neuro',
    indications: ['common cold', 'flu', 'nasal congestion', 'rhinorrhea', 'headache']
  },
  {
    id: 'med-synflex-550',
    name: 'Synflex (Naproxen Sodium)',
    generic: 'Naproxen Sodium',
    dose: '550 mg',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 5,
    comment: 'Take after a full meal. Combine with acid reducer if prone to gastritis',
    category: 'pain_neuro',
    indications: ['osteoarthritis', 'gout', 'back pain', 'joint pain', 'dysmenorrhea']
  },
  {
    id: 'med-ponstan-500',
    name: 'Ponstan (Mefenamic Acid)',
    generic: 'Mefenamic Acid',
    dose: '500 mg',
    doseType: 'Tablet',
    frequency: '1-1-1 (TDS)',
    route: 'Oral',
    days: 3,
    comment: 'Take with meals or milk to avoid gastric distress',
    category: 'pain_neuro',
    indications: ['dental pain', 'headache', 'period pain', 'mild to moderate pain']
  },
  {
    id: 'med-gabica-75',
    name: 'Gabica (Pregabalin)',
    generic: 'Pregabalin',
    dose: '75 mg',
    doseType: 'Capsule',
    frequency: '0-0-1 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take at night. May cause drowsiness; avoid driving initially',
    category: 'pain_neuro',
    indications: ['diabetic neuropathy', 'neuropathic pain', 'sciatica', 'fibromyalgia']
  },

  // ─── VITAMINS & MINERALS ───
  {
    id: 'med-surbex-z',
    name: 'Surbex Z (Zinc + B-Complex + C + E)',
    generic: 'Multivitamins with Zinc',
    dose: '1 Tablet',
    doseType: 'Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Take in the morning after breakfast',
    category: 'vitamins',
    indications: ['general weakness', 'nutritional deficiency', 'convalescence', 'immunity']
  },
  {
    id: 'med-cac-1000',
    name: 'Cac-1000 Plus (Calcium + Vit D3 + C)',
    generic: 'Calcium Lactate Gluconate + Vit C + D3',
    dose: '1 Tablet',
    doseType: 'Effervescent Tablet',
    frequency: '1-0-0 (OD)',
    route: 'Oral',
    days: 30,
    comment: 'Dissolve tablet in a full glass of cold water and drink after breakfast',
    category: 'vitamins',
    indications: ['osteoporosis', 'calcium deficiency', 'bone health', 'pregnancy']
  },
  {
    id: 'med-dsun-200k',
    name: 'D-Sun (Vitamin D3)',
    generic: 'Cholecalciferol',
    dose: '200,000 IU',
    doseType: 'Oral Softgel / Ampoule',
    frequency: 'Once every 15 days',
    route: 'Oral',
    days: 60,
    comment: 'Take with milk or a fatty meal for optimal absorption',
    category: 'vitamins',
    indications: ['vitamin d deficiency', 'bone pain', 'osteopenia', 'fatigue']
  },
  {
    id: 'med-neurobion',
    name: 'Neurobion (Vit B1, B6, B12)',
    generic: 'B-Complex Vitamins',
    dose: '1 Tablet',
    doseType: 'Tablet',
    frequency: '1-0-1 (BD)',
    route: 'Oral',
    days: 30,
    comment: 'Take after meals with water',
    category: 'vitamins',
    indications: ['peripheral neuropathy', 'nerve regeneration', 'tingling', 'numbness']
  }
];

// ─── CLINICAL MULTI-MEDICATION BUNDLES (DIAGNOSIS PROTOCOLS) ───
export const CLINICAL_DISEASE_BUNDLES = [
  {
    id: 'bundle-cad-ihd',
    title: 'Post-PCI / Ischemic Heart Disease (IHD)',
    specialty: 'cardiology',
    description: 'Standard 4-drug guideline-directed secondary prevention bundle for CAD / Stent / Angina',
    tags: ['ihd', 'angina', 'cad', 'stent', 'post pci', 'heart', 'coronary'],
    medications: [
      { name: 'Loprin (Aspirin)', dose: '75 mg', doseType: 'Tablet', frequency: '0-1-0 (OD)', route: 'Oral', days: 30, comment: 'Take after lunch with water' },
      { name: 'Concor (Bisoprolol)', dose: '2.5 mg', doseType: 'Tablet', frequency: '1-0-0 (OD)', route: 'Oral', days: 30, comment: 'Take in the morning. Check pulse rate' },
      { name: 'Crestat (Rosuvastatin)', dose: '10 mg', doseType: 'Tablet', frequency: '0-0-1 (OD)', route: 'Oral', days: 30, comment: 'Take at bedtime' },
      { name: 'Nexum (Esomeprazole)', dose: '40 mg', doseType: 'Capsule', frequency: '1-0-0 (OD)', route: 'Oral', days: 30, comment: 'Take 30 mins before breakfast' }
    ]
  },
  {
    id: 'bundle-hypertension-dual',
    title: 'Essential Hypertension (Dual Therapy)',
    specialty: 'cardiology',
    description: 'Dual combination for moderate to severe hypertension',
    tags: ['hypertension', 'high blood pressure', 'htn', 'bp'],
    medications: [
      { name: 'Exforge (Amlodipine + Valsartan)', dose: '5/80 mg', doseType: 'Tablet', frequency: '1-0-0 (OD)', route: 'Oral', days: 30, comment: 'Take in the morning with water' },
      { name: 'Concor (Bisoprolol)', dose: '2.5 mg', doseType: 'Tablet', frequency: '1-0-0 (OD)', route: 'Oral', days: 30, comment: 'Take in morning' },
      { name: 'Loprin (Aspirin)', dose: '75 mg', doseType: 'Tablet', frequency: '0-1-0 (OD)', route: 'Oral', days: 30, comment: 'Take after lunch' }
    ]
  },
  {
    id: 'bundle-gerd-gastritis',
    title: 'GERD & Acid Peptic Disease (Full Regimen)',
    specialty: 'gastroenterology',
    description: 'PPI + Prokinetic + Antacid protocol for heartburn, dyspepsia & gastritis',
    tags: ['gerd', 'gastritis', 'acidity', 'heartburn', 'stomach', 'dyspepsia', 'peptic'],
    medications: [
      { name: 'Nexum (Esomeprazole)', dose: '40 mg', doseType: 'Capsule', frequency: '1-0-0 (OD)', route: 'Oral', days: 14, comment: 'Take 30 mins before breakfast on an empty stomach' },
      { name: 'Motilium (Domperidone)', dose: '10 mg', doseType: 'Tablet', frequency: '1-1-1 (TDS)', route: 'Oral', days: 7, comment: 'Take 20 mins before meals' },
      { name: 'Gaviscon Syrup', dose: '10 ml', doseType: 'Syrup', frequency: '1-1-1 (TDS)', route: 'Oral', days: 7, comment: 'Take after meals and at bedtime' }
    ]
  },
  {
    id: 'bundle-urti-bronchitis',
    title: 'Acute Bronchitis / URTI Protocol',
    specialty: 'respiratory',
    description: 'Antibiotic + Bronchodilator cough syrup + Antipyretic for respiratory infection',
    tags: ['urti', 'chest infection', 'cough', 'fever', 'bronchitis', 'flu', 'sore throat'],
    medications: [
      { name: 'Augmentin (Co-Amoxiclav)', dose: '625 mg', doseType: 'Tablet', frequency: '1-0-1 (BD)', route: 'Oral', days: 5, comment: 'Take at start of meals with water' },
      { name: 'Acefyl Cough Syrup', dose: '10 ml', doseType: 'Syrup', frequency: '1-1-1 (TDS)', route: 'Oral', days: 5, comment: 'Take 3 times daily after food' },
      { name: 'Panadol (Paracetamol)', dose: '500 mg', doseType: 'Tablet', frequency: '1-1-1 (TDS)', route: 'Oral', days: 3, comment: 'Take after meals for fever and body ache' },
      { name: 'Softin (Loratadine)', dose: '10 mg', doseType: 'Tablet', frequency: '1-0-0 (OD)', route: 'Oral', days: 5, comment: 'Take once daily' }
    ]
  },
  {
    id: 'bundle-diabetes-t2',
    title: 'Type 2 Diabetes Mellitus Protocol',
    specialty: 'diabetes_endocrine',
    description: 'Cardioprotective SGLT2i + Metformin regimen for glycemic control',
    tags: ['diabetes', 't2dm', 'sugar', 'hyperglycemia', 'metabolic'],
    medications: [
      { name: 'Glucophage XR (Metformin)', dose: '1000 mg', doseType: 'Tablet', frequency: '0-0-1 (OD)', route: 'Oral', days: 30, comment: 'Take with dinner. Swallow whole' },
      { name: 'Jardiance (Empagliflozin)', dose: '10 mg', doseType: 'Tablet', frequency: '1-0-0 (OD)', route: 'Oral', days: 30, comment: 'Take in the morning with plenty of water' },
      { name: 'Neurobion (Vit B1, B6, B12)', dose: '1 Tablet', doseType: 'Tablet', frequency: '1-0-1 (BD)', route: 'Oral', days: 30, comment: 'Take after meals' }
    ]
  }
];

// Helper: Match medications to clinical text / diagnosis
export const getSuggestedMedicationsForDiagnosis = (clinicalText = '') => {
  if (!clinicalText || typeof clinicalText !== 'string' || clinicalText.trim().length < 3) {
    return [];
  }

  const query = clinicalText.toLowerCase();

  return CLINICAL_FORMULARY.filter(med => {
    if (!med.indications || med.indications.length === 0) return false;
    return med.indications.some(ind => query.includes(ind));
  });
};

// Helper: Match bundles to clinical text / diagnosis
export const getSuggestedBundlesForDiagnosis = (clinicalText = '') => {
  if (!clinicalText || typeof clinicalText !== 'string' || clinicalText.trim().length < 3) {
    return [];
  }

  const query = clinicalText.toLowerCase();

  return CLINICAL_DISEASE_BUNDLES.filter(b => {
    if (!b.tags || b.tags.length === 0) return false;
    return b.tags.some(tag => query.includes(tag));
  });
};
