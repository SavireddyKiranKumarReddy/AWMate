import { createClient, type Session, type SupabaseClient, type User } from "@supabase/supabase-js"

export const desktopAuthCallback = "awmate://auth/callback"

export type AccessGrant = {
  id: string
  user_id: string | null
  email: string
  role: "owner" | "admin" | "member" | "auditor"
  status: "active" | "pending" | "suspended" | "revoked"
  daily_request_limit: number | null
  monthly_token_limit: number | null
  approved_at: string | null
  expires_at: string | null
}

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const desktopAuthConfig = {
  url,
  publishableKey,
  configured:
    Boolean(url && publishableKey) && !url?.includes("YOUR_PROJECT") && !publishableKey?.includes("REPLACE_ME"),
}

let client: SupabaseClient | undefined

export function getDesktopAuthClient() {
  if (!desktopAuthConfig.configured || !url || !publishableKey) {
    throw new Error("AWMate authentication is not configured in this build.")
  }

  client ??= createClient(url, publishableKey, {
    auth: {
      flowType: "pkce",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: "awmate.desktop.auth",
    },
  })
  return client
}

export function isActiveAccess(grant: AccessGrant | null, now = Date.now()) {
  if (!grant || grant.status !== "active") return false
  if (!grant.expires_at) return true
  return new Date(grant.expires_at).getTime() > now
}

export async function loadAccessGrant(supabase: SupabaseClient, user: User) {
  const result = await supabase
    .from("access_grants")
    .select("id,user_id,email,role,status,daily_request_limit,monthly_token_limit,approved_at,expires_at")
    .eq("user_id", user.id)
    .maybeSingle<AccessGrant>()

  if (result.error) throw result.error
  return result.data
}

export async function verifySession(supabase: SupabaseClient, session: Session) {
  const result = await supabase.auth.getUser(session.access_token)
  if (result.error) throw result.error
  if (!result.data.user) throw new Error("The signed-in Google account could not be verified.")
  return result.data.user
}

export type DesktopAuthCallback = { code: string } | { error: string }

export function parseDesktopAuthCallback(input: string): DesktopAuthCallback | undefined {
  if (!input.startsWith("awmate://")) return

  let parsed: URL
  try {
    parsed = new URL(input)
  } catch {
    return
  }

  if (parsed.hostname !== "auth" || parsed.pathname !== "/callback") return
  const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ""))
  const error =
    parsed.searchParams.get("error_description") ??
    parsed.searchParams.get("error") ??
    fragment.get("error_description") ??
    fragment.get("error")
  if (error) return { error }

  const code = parsed.searchParams.get("code") ?? fragment.get("code")
  if (!code) return { error: "Google did not return a valid authorization code." }
  return { code }
}

export function takePendingAuthCallbacks() {
  const pending = window.__AWMATE__?.deepLinks ?? []
  const callbacks = pending.filter((item) => parseDesktopAuthCallback(item))
  if (window.__AWMATE__) {
    window.__AWMATE__.deepLinks = pending.filter((item) => !parseDesktopAuthCallback(item))
  }
  return callbacks
}
