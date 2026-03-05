// lib/supabase.ts
// ─────────────────────────────────────────────────────────────
// Server-side Supabase client using the SERVICE ROLE key.
//
// IMPORTANT: The service role key bypasses Row Level Security.
// NEVER import this file in client components or expose it
// to the browser. Only use it in:
//   - API routes (like the webhook handler)
//   - Server actions
//   - Server components
// ─────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

// These env vars are server-only (no NEXT_PUBLIC_ prefix on the secret)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance to reuse across requests.
// The Database generic gives us full type-safety on every .from() call.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Disable auto-refresh — this is a server-side client, no sessions here
    autoRefreshToken: false,
    persistSession: false,
  },
})