export const initialClinicConfig = {
  doctorName: "Dr. Consultant Physician",
  qualifications: "MBBS, FCPS (Internal Medicine)",
  regNumber: "PMC-00000-P",
  clinicName: "PatientCare Medical Center",
  tagline: "Quality Outpatient Care & Diagnostic Center",
  address: "Suite 101, Health Complex, Medical Boulevard",
  phone: "+92 300 0000000",
  email: "contact@clinic.example.com"
};

export const initialPatients = [
  {
    id: "pat-1",
    name: "Ahmad Hassan",
    ageSource: "age_only",
    age: 35,
    dob: "",
    gender: "Male",
    phone: "03000000001",
    bloodGroup: "O+",
    address: "Block B, Model Town",
    emergencyContact: {
      name: "Bilal Hassan",
      phone: "03000000011",
      relation: "Brother"
    },
    notes: [
      {
        id: "note-1",
        date: "2026-08-29T21:24:00.000Z",
        formattedDate: "29 Aug 2026, 21:24",
        chiefComplaint: "Cough",
        presentIllness: "Cough for 2 months",
        systemReviews: "**Cardiovascular:** No chest pain, no palpitations.\n**Respiratory:** Mild shortness of breath on strenuous exertion, persistent dry tickly cough especially at night.\n**GI:** Normal appetite, no reflux or dysphagia.",
        pastHistory: "Appendectomy in 2018 under general anesthesia with uncomplicated recovery. No known hypertension or diabetes.",
        vaccineHistory: "COVID-19: 2 doses mRNA (2021)\nTetanus toxoid booster: 2022\nInfluenza vaccine: Annual (last taken Oct 2025)",
        familyHistory: "Father diagnosed with Type 2 Diabetes at age 52.\nMother has mild hypertension controlled on medication.",
        socialHistory: "Non-smoker, non-alcoholic. Software engineer, sedentary desk work, drinks 2 cups of green tea daily.",
        presentMedication: "None regular. Took OTC Paracetamol 500mg occasionally for headache.",
        allergicHistory: "No known drug allergies (NKDA). Mild seasonal pollen rhinitis.",
        birthHistory: "Born at full term via normal vaginal delivery, no neonatal complications."
      }
    ],
    examinations: [
      {
        id: "exam-1",
        date: "2026-08-29T21:24:00.000Z",
        formattedDate: "29 Aug 2026, 21:24",
        vitals: {
          bpSystolic: 120,
          bpDiastolic: 80,
          pulse: 76,
          respiratoryRate: 18,
          temperature: 36.8,
          weight: 74,
          spO2: 98,
          bloodSugar: 104
        },
        findings: {
          general: "Comfortable at rest, well-hydrated, no apparent acute distress.",
          skin: "Warm and dry, normal turgor, no petechiae or rash.",
          headNeck: "Normocephalic, conjunctivae clear, pharynx mildly erythematous without exudate.",
          lymphNodes: "No cervical, supraclavicular, or axillary lymphadenopathy.",
          breast: "Deferred / Normal.",
          throatLungs: "Clear breath sounds bilaterally. Good air entry, no audible wheezes, scattered fine dry ronchi at right posterior base.",
          abdomen: "Soft, non-tender, non-distended. Bowel sounds present and active. No hepatosplenomegaly.",
          pelvicGenitalia: "Not indicated / Deferred.",
          rectal: "Not indicated / Deferred.",
          extremities: "No peripheral edema, normal peripheral pulses equal bilaterally.",
          musculoskeletal: "Normal range of motion across all joints, spine non-tender.",
          clubbing: "Absent.",
          pallor: "Absent.",
          jaundice: "Absent.",
          cyanosis: "Absent."
        }
      }
    ],
    medications: [
      {
        id: "med-1",
        name: "Provas N Forte",
        dose: "500 mg",
        doseType: "Tablet",
        frequency: "Twice daily",
        route: "Oral",
        dateFrom: "2026-08-29",
        days: 3,
        comment: "Take after breakfast and dinner with a glass of water"
      },
      {
        id: "med-2",
        name: "Cough Syrup Acefyl",
        dose: "10 ml",
        doseType: "Syrup",
        frequency: "3 times daily",
        route: "Oral",
        dateFrom: "2026-08-29",
        days: 5,
        comment: "After meals, shake well before use"
      }
    ],
    labReports: [
      {
        id: "lab-1",
        date: "2026-08-29",
        formattedDate: "29 Aug 2026",
        notes: "Baseline Complete Blood Picture and ESR test",
        entries: [
          { key: "Hemoglobin", value: "13.8 g/dL" },
          { key: "Total Leucocyte Count (TLC)", value: "7,400 /cu.mm" },
          { key: "Platelets", value: "265,000 /cu.mm" },
          { key: "ESR (1st Hour)", value: "12 mm" }
        ],
        attachments: []
      }
    ],
    impressionAdvice: {
      impression: "Subacute post-viral bronchial hyper-reactivity / mild tracheobronchitis.\nDifferential: Cough-variant asthma excluded for now.",
      advice: "1. Steam inhalation twice daily for 10 minutes.\n2. Avoid chilled beverages, cold air direct blast, and active smoke.\n3. Maintain adequate warm hydration (lukewarm water, warm soups).\n4. Return for follow-up evaluation after 5 days if cough or nocturnal spasms persist."
    },
    personalNotes: "**Doctor's Private Perception:**\nPatient is cooperative and well-informed. Expressed high anxiety about nocturnal coughing spells interfering with late-night software shifts. Reassured that auscultation is completely clear and no signs of chronic bronchiectasis or bacterial pneumonia. Suggested warm tea during shifts."
  },
  {
    id: "pat-2",
    name: "Tariq Mahmood",
    ageSource: "age_only",
    age: 46,
    dob: "",
    gender: "Male",
    phone: "03000000002",
    bloodGroup: "B+",
    address: "Sector F-7, Medical Enclave",
    emergencyContact: {
      name: "Sara Tariq",
      phone: "03000000012",
      relation: "Wife"
    },
    notes: [
      {
        id: "note-2-1",
        date: "2026-08-28T14:15:00.000Z",
        formattedDate: "28 Aug 2026, 14:15",
        chiefComplaint: "Routine hypertension review and mild dizziness upon standing",
        presentIllness: "Occasional morning occipital headache over past week. No chest pain or vision blurriness.",
        systemReviews: "Cardiovascular: Occasional palpitations when rushed. Respiratory: Normal.",
        pastHistory: "Essential hypertension diagnosed 2020.",
        vaccineHistory: "Full routine vaccination record.",
        familyHistory: "Strong paternal history of early CAD.",
        socialHistory: "Sedentary lifestyle, high sodium dietary preference.",
        presentMedication: "Tab Amlodipine 5mg once daily in morning.",
        allergicHistory: "NKDA.",
        birthHistory: ""
      }
    ],
    examinations: [
      {
        id: "exam-2-1",
        date: "2026-08-28T14:15:00.000Z",
        formattedDate: "28 Aug 2026, 14:15",
        vitals: {
          bpSystolic: 145,
          bpDiastolic: 92,
          pulse: 82,
          respiratoryRate: 16,
          temperature: 36.6,
          weight: 86,
          spO2: 99,
          bloodSugar: 128
        },
        findings: {
          general: "Alert, overweight, no acute distress.",
          skin: "Normal.",
          headNeck: "No carotid bruits.",
          lymphNodes: "Normal.",
          throatLungs: "Clear vesicular breath sounds throughout.",
          abdomen: "Obese, soft, non-tender.",
          extremities: "Trace bilateral pedal fullness, no pitting edema."
        }
      }
    ],
    medications: [
      {
        id: "med-2-1",
        name: "Amlodipine",
        dose: "10 mg",
        doseType: "Tablet",
        frequency: "Once daily",
        route: "Oral",
        dateFrom: "2026-08-28",
        days: 30,
        comment: "Take every morning after breakfast"
      }
    ],
    labReports: [],
    impressionAdvice: {
      impression: "Stage 1 essential hypertension, suboptimal control on monotherapy.",
      advice: "1. Strict dietary salt restriction (< 2g/day).\n2. 30 minutes brisk walking daily.\n3. Daily morning and evening home BP log for 14 days."
    }
  },
  {
    id: "pat-3",
    name: "Muhammad Azeem",
    ageSource: "age_only",
    age: 79,
    dob: "",
    gender: "Male",
    phone: "03000000003",
    bloodGroup: "A+",
    address: "Civil Lines, Central District",
    emergencyContact: {
      name: "Usman Azeem",
      phone: "03000000013",
      relation: "Son"
    },
    notes: [
      {
        id: "note-3-1",
        date: "2026-08-27T10:00:00.000Z",
        formattedDate: "27 Aug 2026, 10:00",
        chiefComplaint: "Bilateral knee joint pain aggravated by stair climbing and walking",
        presentIllness: "Gradual progression over 3 years, morning stiffness lasting ~15 minutes.",
        systemReviews: "Locomotor: Crepitus on both knees, left > right.",
        pastHistory: "Mild BPH.",
        vaccineHistory: "Completed vaccinations.",
        familyHistory: "Osteoarthritis in siblings.",
        socialHistory: "Retired teacher.",
        presentMedication: "Calcium + Vit D3 supplements.",
        allergicHistory: "Allergic to Diclofenac (gastric pain).",
        birthHistory: ""
      }
    ],
    examinations: [
      {
        id: "exam-3-1",
        date: "2026-08-27T10:00:00.000Z",
        formattedDate: "27 Aug 2026, 10:00",
        vitals: {
          bpSystolic: 130,
          bpDiastolic: 82,
          pulse: 72,
          respiratoryRate: 16,
          temperature: 36.5,
          weight: 68,
          spO2: 97,
          bloodSugar: 98
        },
        findings: {
          general: "Elderly gentleman, walks with mild antalgic gait.",
          musculoskeletal: "Bilateral knee joint swelling, joint margin tenderness, coarse crepitus."
        }
      }
    ],
    medications: [
      {
        id: "med-3-1",
        name: "Paracetamol",
        dose: "1 g",
        doseType: "Tablet",
        frequency: "3 times daily",
        route: "Oral",
        dateFrom: "2026-08-27",
        days: 10,
        comment: "Take when pain is severe, do not exceed 3g/day"
      }
    ],
    labReports: [],
    impressionAdvice: {
      impression: "Bilateral primary osteoarthritis of knees (Kellgren-Lawrence Grade 3).",
      advice: "1. Quadriceps strengthening exercises.\n2. Avoid deep squatting and cross-legged floor sitting.\n3. Hot fomentation."
    }
  },
  {
    id: "pat-4",
    name: "Sadia Khan",
    ageSource: "age_only",
    age: 27,
    dob: "",
    gender: "Female",
    phone: "03000000004",
    bloodGroup: "O-",
    address: "Garden Town, Sector 4",
    emergencyContact: {
      name: "Kamran Khan",
      phone: "03000000014",
      relation: "Husband"
    },
    notes: [],
    examinations: [],
    medications: [],
    labReports: [],
    impressionAdvice: {
      impression: "",
      advice: ""
    }
  },
  {
    id: "pat-5",
    name: "Sidra Noor",
    ageSource: "age_only",
    age: 39,
    dob: "",
    gender: "Female",
    phone: "03000000005",
    bloodGroup: "AB+",
    address: "Canal View, Phase 2",
    emergencyContact: {
      name: "Noman Noor",
      phone: "03000000015",
      relation: "Husband"
    },
    notes: [],
    examinations: [],
    medications: [],
    labReports: [],
    impressionAdvice: {
      impression: "",
      advice: ""
    }
  }
];
