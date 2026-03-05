/**
 * proxy.ts  (use middleware.ts if you're on Next.js ≤ 15)
 *
 * Clerk middleware — runs on every request BEFORE it reaches any page or route.
 *
 * Responsibilities:
 *   1. Attach Clerk auth state to every request.
 *   2. Redirect unauthenticated users away from protected routes.
 *   3. Enforce role-based guards at the route level.
 *
 * CRITICAL: /api/webhooks/* must be a PUBLIC route.
 * Clerk's servers call the webhook endpoint with no session cookie —
 * if we let Clerk middleware protect it, every webhook returns 401
 * and Clerk retries indefinitely.
 */

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import type { Roles } from '@/types/globals'

// ─── Route matchers ──────────────────────────────────────────────────────────

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',   // ← webhooks must be public — Clerk has no session
])

const isAdminRoute      = createRouteMatcher(['/admin(.*)'])
const isModerationRoute = createRouteMatcher(['/moderation(.*)'])

// ─── Middleware ───────────────────────────────────────────────────────────────

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes through with no auth check.
  if (isPublicRoute(req)) return NextResponse.next()

  // All other routes require a signed-in user.
  // auth.protect() redirects to /sign-in if no session exists.
  await auth.protect()

  // ── Role guard: /admin/* ──────────────────────────────────────────────────
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    const role: Roles | undefined = sessionClaims?.metadata?.role

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // ── Role guard: /moderation/* ─────────────────────────────────────────────
  if (isModerationRoute(req)) {
    const { sessionClaims } = await auth()
    const role: Roles | undefined = sessionClaims?.metadata?.role

    if (role !== 'admin' && role !== 'moderator') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static assets.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run middleware for API routes.
    '/(api|trpc)(.*)',
  ],
}