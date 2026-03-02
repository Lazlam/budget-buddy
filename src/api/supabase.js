import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fqvjtrhplxceztnrozhr.supabase.co';
const supabaseKey = 'sb_publishable_EkHVAjuS-cr70Zt_dRSL3Q_VJfGJvRJ';

export const supabase = createClient(supabaseUrl, supabaseKey);