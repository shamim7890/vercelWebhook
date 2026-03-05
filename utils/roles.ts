// utils/roles.ts
// ─────────────────────────────────────────────────────────────
// A simple helper to check the current user's role.
//
// HOW IT WORKS:
// - Calls Clerk's auth() to get the session
// - Reads sessionClaims.metadata.role (we put this in the JWT)
// - Returns true/false
//
// WHY READ FROM SESSION CLAIMS (not from Supabase)?
// The JWT is already in memory — reading it is instant.
// If we queried Supabase on every page load / middleware check,
// it would be slow and expensive. The JWT is the fast path.
// Supabase is the source of truth for reporting/querying.
// ─────────────────────────────────────────────────────────────

import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles): Promise<boolean> => {
  const { sessionClaims } = await auth()

  // sessionClaims?.metadata.role is typed because of our globals.d.ts
  return sessionClaims?.metadata.role === role
}

// Check if user has AT LEAST one of the given roles
// Useful for pages that both admins and moderators can access
export const checkAnyRole = async (roles: Roles[]): Promise<boolean> => {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata.role
  return roles.some((r) => r === userRole)
}

// Get the current user's role (or null if not set)
export const getRole = async (): Promise<Roles | null> => {
  const { sessionClaims } = await auth()
  return (sessionClaims?.metadata.role as Roles) ?? null
}

export async function getCurrentRole(): Promise<Roles | null> {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata?.role ?? null
}

export async function hasAnyRole(roles: Roles[]): Promise<boolean> {
  const { sessionClaims } = await auth()
  const userRole = sessionClaims?.metadata?.role
  if (!userRole) return false
  return roles.includes(userRole)
}