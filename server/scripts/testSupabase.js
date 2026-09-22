import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl || '(not set)');
console.log('Key:', supabaseAnonKey ? `${supabaseAnonKey.slice(0, 15)}...` : '(not set)');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.log('\n❌ Supabase is not configured yet in .env');
  console.log('Please paste your Project URL and anon key in .env:');
  console.log('SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  try {
    const { data, error } = await supabase.from('patients').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        console.log('\n⚠️ Connected to Supabase, but tables have not been created yet!');
        console.log('Please copy and run the SQL from server/db/schema.sql in your Supabase SQL Editor.');
      } else {
        console.log('\n❌ Supabase query error:', error.message);
      }
      process.exit(1);
    }

    console.log('\n🎉 SUCCESS: Connected to Supabase PostgreSQL database!');
    console.log('Patients table is active.');
  } catch (err) {
    console.error('\n❌ Connection error:', err.message);
    process.exit(1);
  }
}

checkConnection();
