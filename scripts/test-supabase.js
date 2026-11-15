const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
console.log('Reading env from:', envPath);

let supabaseUrl = '';
let supabaseKey = '';

try {
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.trim().startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error('Failed to read env file:', e.message);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listStories() {
  console.log('Fetching success stories table...');
  const { data, error } = await supabase
    .from('success_stories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch:', error);
  } else {
    console.log('Success Stories in Database:');
    console.log(JSON.stringify(data, null, 2));
  }
}

listStories();
