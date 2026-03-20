import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ymunqojshrbcupcubuhs.supabase.co';
const supabaseKey = 'sb_publishable_pzvQHV1kDflWyWZVvSjK_g_tD_yxX9t';

export const supabase = createClient(supabaseUrl, supabaseKey); 