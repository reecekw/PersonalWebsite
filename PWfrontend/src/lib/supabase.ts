// Supabase connection for the trivia game.
// The URL and key come from environment variables:
//   local dev: PWfrontend/.env.local
//   live site: Cloudflare > your project > Settings > Variables and Secrets
// The key is the public "anon" / "publishable" key. It is safe in the browser:
// the database's security rules decide what each person can see.
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigured = Boolean(url && key);

export const supabase = createClient(url || 'http://localhost:54321', key || 'not-configured');
