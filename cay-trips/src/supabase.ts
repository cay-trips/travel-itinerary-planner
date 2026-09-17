import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = "https://vegebmohmwdkruirweza.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_m_qieE2iunA8b2g1idGvMg_XJmAdosH";

export const isConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.startsWith("YOUR_") &&
  !SUPABASE_ANON_KEY.startsWith("YOUR_")
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
