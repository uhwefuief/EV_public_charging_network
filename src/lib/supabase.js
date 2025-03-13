import { createClient} from '@supabase/supabase-js'

//us for read the yrl from the .env
const supabaseUrl =import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;


// Create a supabase client instance for use in the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)