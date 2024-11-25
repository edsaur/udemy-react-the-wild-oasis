
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://hmawvkblqtecobqfdqke.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYXd2a2JscXRlY29icWZkcWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkyMTU0NTIsImV4cCI6MjA0NDc5MTQ1Mn0.EcKQf6gD3R5NYW2ZRA1HrU7mVPwgBC-wpfDVJodyprg';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;