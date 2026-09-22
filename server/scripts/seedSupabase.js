import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { initialPatients, initialClinicConfig } from '../../src/services/initialData.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Seeding initial data into Supabase PostgreSQL...');

  try {
    // 1. Seed Doctor Account
    const salt = await bcrypt.genSalt(10);
    const initialDoctorPassword = process.env.INITIAL_DOCTOR_PASSWORD || 'ChangeMeDoctor123!';
    const doctorPasswordHash = await bcrypt.hash(initialDoctorPassword, salt);
    const initialEmail = process.env.INITIAL_DOCTOR_EMAIL || 'doctor@example.com';
    const initialName = process.env.INITIAL_DOCTOR_NAME || 'Consultant Physician';
    const initialUsername = process.env.INITIAL_DOCTOR_USERNAME || initialEmail.split('@')[0];
    const initialPhone = process.env.INITIAL_DOCTOR_PHONE || '+92 300 0000000';

    const { data: existingDoc } = await supabase
      .from('doctors')
      .select('id')
      .eq('email', initialEmail)
      .maybeSingle();

    let doctorId;
    if (!existingDoc) {
      const { data: newDoc, error: docErr } = await supabase
        .from('doctors')
        .insert({
          name: initialName,
          email: initialEmail,
          username: initialUsername,
          password_hash: doctorPasswordHash,
          qualifications: 'MBBS, FCPS, Consultant Physician',
          pmc_number: 'PMC-00000-P',
          specialty: 'Internal Medicine',
          phone: initialPhone,
          status: 'active'
        })
        .select('id')
        .single();

      if (docErr) {
        console.error('Warning seeding doctor:', docErr.message);
      } else {
        doctorId = newDoc.id;
        console.log(`✅ Doctor account seeded (Email: ${initialEmail})`);
      }
    } else {
      doctorId = existingDoc.id;
      console.log('ℹ️ Doctor account already exists in Supabase.');
    }

    // 2. Seed Clinic Config
    const { data: existingConfig } = await supabase
      .from('clinic_config')
      .select('id')
      .eq('id', 1)
      .maybeSingle();

    if (!existingConfig) {
      await supabase.from('clinic_config').insert({
        id: 1,
        clinic_name: initialClinicConfig.clinicName,
        doctor_name: initialClinicConfig.doctorName,
        qualifications: initialClinicConfig.qualifications,
        reg_number: initialClinicConfig.regNumber,
        tagline: initialClinicConfig.tagline,
        address: initialClinicConfig.address,
        phone: initialClinicConfig.phone,
        email: initialClinicConfig.email
      });
      console.log('✅ Clinic master letterhead config seeded.');
    }

    // 3. Seed Patients
    for (const pat of initialPatients) {
      const { data: existingPat } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', pat.phone)
        .maybeSingle();

      let patientId;
      if (!existingPat) {
        const { data: newPat, error: patErr } = await supabase
          .from('patients')
          .insert({
            name: pat.name,
            age_source: pat.ageSource || 'age_only',
            age: pat.age,
            dob: pat.dob ? pat.dob : null,
            gender: pat.gender,
            phone: pat.phone,
            blood_group: pat.bloodGroup,
            address: pat.address,
            emergency_contact: pat.emergencyContact || {}
          })
          .select('id')
          .single();

        if (patErr) {
          console.error(`Error inserting patient ${pat.name}:`, patErr.message);
          continue;
        }

        patientId = newPat.id;
        console.log(`✅ Seeded patient: ${pat.name} (MRN: ${pat.phone})`);

        // Seed Clinical Notes
        if (pat.notes && pat.notes.length > 0) {
          for (const note of pat.notes) {
            await supabase.from('clinical_notes').insert({
              patient_id: patientId,
              doctor_id: doctorId,
              date: note.date,
              formatted_date: note.formattedDate,
              chief_complaint: note.chiefComplaint,
              present_illness: note.presentIllness,
              system_reviews: note.systemReviews,
              past_history: note.pastHistory,
              vaccine_history: note.vaccineHistory,
              family_history: note.familyHistory,
              social_history: note.socialHistory,
              present_medication: note.presentMedication,
              allergic_history: note.allergicHistory,
              birth_history: note.birthHistory
            });
          }
        }

        // Seed Examinations / Vitals
        if (pat.examinations && pat.examinations.length > 0) {
          for (const exam of pat.examinations) {
            await supabase.from('examinations').insert({
              patient_id: patientId,
              doctor_id: doctorId,
              date: exam.date,
              formatted_date: exam.formattedDate,
              vitals: exam.vitals,
              findings: exam.findings
            });
          }
        }

        // Seed Medications (Rx)
        if (pat.medications && pat.medications.length > 0) {
          for (const med of pat.medications) {
            await supabase.from('medications').insert({
              patient_id: patientId,
              doctor_id: doctorId,
              date: med.date,
              name: med.name,
              form: med.form,
              dosage: med.dosage,
              frequency: med.frequency,
              duration: med.duration,
              timing: med.timing,
              instructions: med.instructions,
              urdu_instructions: med.urduInstructions || '',
              notes: med.notes || '',
              status: med.status || 'active'
            });
          }
        }

        // Seed Lab Reports
        if (pat.labReports && pat.labReports.length > 0) {
          for (const lab of pat.labReports) {
            await supabase.from('lab_reports').insert({
              patient_id: patientId,
              doctor_id: doctorId,
              date: lab.date,
              test_name: lab.testName,
              category: lab.category,
              findings: lab.findings,
              attachments: lab.attachments || [],
              status: lab.status || 'Completed',
              notes: lab.notes || ''
            });
          }
        }

        // Seed Impression & Advice
        if (pat.impressionAdvice) {
          await supabase.from('impression_advice').insert({
            patient_id: patientId,
            doctor_id: doctorId,
            impression: pat.impressionAdvice.impression,
            advice: pat.impressionAdvice.advice
          });
        }

        // Seed Confidential Doctor Personal Notes
        if (pat.personalNotes) {
          await supabase.from('personal_notes').insert({
            patient_id: patientId,
            doctor_id: doctorId,
            notes_text: pat.personalNotes
          });
        }
      } else {
        console.log(`ℹ️ Patient "${pat.name}" already in database.`);
      }
    }

    // 4. Initial Audit Log
    await supabase.from('audit_logs').insert({
      action: 'Supabase Database Seeded',
      performed_by: 'System Seed Script',
      category: 'system',
      details: 'Populated initial clinic configuration, licensed doctor, and clinical patient records.'
    });

    console.log('\n🎉 SUPABASE SEEDING COMPLETE! All tables are populated and ready.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
}

seed();
