import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

if (!url || !serviceKey) {
  throw new Error('SUPABASE_URL o SUPABASE_SERVICE_KEY faltan en .env');
}

export const supa = createClient(url, serviceKey, {
  auth: { persistSession: false },
  global: { headers: { 'X-Client-Info': 'payments-factory-backend/1.0' } }
});
