import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!supabaseUrl) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not defined")
}

if (!supabaseAnonKey) {
  console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined")
}

// Client standard pour les opérations de lecture (côté client)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cette fonction doit être appelée uniquement côté serveur
export function createAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceKey) {
    console.error("SUPABASE_SERVICE_ROLE_KEY is not defined")
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

