/**
 * app/dashboard/page.tsx
 *
 * Protected dashboard — all signed-in users.
 * Reads role from JWT (fast), fetches Supabase row (proves webhook fired),
 * and shows role-gated sections.
 */

import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { getCurrentRole } from '@/utils/roles'
import type { UserRow, UserRole } from '@/types/database'
import { JSX } from 'react'

// ─── Role config ─────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string; border: string; icon: string; desc: string }> = {
  admin: {
    label: 'Admin',
    color: '#854d0e',
    bg: '#fefce8',
    border: '#fde047',
    icon: '🔑',
    desc: 'Full access. You can manage all users and assign roles in the admin dashboard.',
  },
  moderator: {
    label: 'Moderator',
    color: '#1e40af',
    bg: '#eff6ff',
    border: '#93c5fd',
    icon: '🛡️',
    desc: 'Elevated access. You can view and manage moderation tools.',
  },
  user: {
    label: 'User',
    color: '#166534',
    bg: '#f0fdf4',
    border: '#86efac',
    icon: '✅',
    desc: 'Standard access. Contact an admin if you need elevated permissions.',
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage(): Promise<JSX.Element> {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const [role, clerkUser] = await Promise.all([
    getCurrentRole(),
    currentUser(),
  ])

  const { data: dbUser, error: dbError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single<UserRow>()

  const roleConfig = role ? ROLE_CONFIG[role] : null
  const displayName = clerkUser?.firstName
    ? `${clerkUser.firstName}${clerkUser.lastName ? ' ' + clerkUser.lastName : ''}`
    : 'there'
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? ''
  const initials = (clerkUser?.firstName?.[0] ?? '') + (clerkUser?.lastName?.[0] ?? '')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:      #f7f7f5;
          --surface: #ffffff;
          --border:  #e5e7e4;
          --text:    #111714;
          --muted:   #6b7280;
          --green:   #16a34a;
          --mono:    'JetBrains Mono', monospace;
          --serif:   'Lora', Georgia, serif;
        }

        .dash-root {
          min-height: 100vh;
          background: var(--bg);
          font-family: var(--mono);
          color: var(--text);
        }

        /* ── Top bar ──────────────────────────────────────────── */
        .topbar {
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
        }
        .topbar-logo {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--green);
          text-decoration: none;
        }
        .topbar-logo span { color: var(--muted); font-weight: 300; }
        .topbar-right { display: flex; align-items: center; gap: 1rem; }
        .topbar-email { font-size: 0.72rem; color: var(--muted); }
        .sign-out-link {
          font-size: 0.72rem;
          color: var(--muted);
          text-decoration: none;
          border: 1px solid var(--border);
          padding: 4px 12px;
          border-radius: 4px;
          transition: color 0.15s, border-color 0.15s;
        }
        .sign-out-link:hover { color: var(--text); border-color: #9ca3af; }

        /* ── Main layout ──────────────────────────────────────── */
        .dash-main {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2.5rem 2rem;
        }

        /* ── Welcome header ───────────────────────────────────── */
        .welcome-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .avatar {
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #dcfce7;
          border: 2px solid #86efac;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: var(--green);
          flex-shrink: 0;
          letter-spacing: 0.02em;
        }
        .welcome-text h1 {
          font-family: var(--serif);
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--text);
          line-height: 1.2;
        }
        .welcome-text p {
          font-size: 0.78rem;
          color: var(--muted);
          margin-top: 2px;
        }

        /* ── Grid ─────────────────────────────────────────────── */
        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .grid-full { margin-bottom: 1rem; }

        /* ── Card ─────────────────────────────────────────────── */
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.5rem;
        }
        .card-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .card-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* ── Role card ────────────────────────────────────────── */
        .role-card {
          border-radius: 10px;
          padding: 1.5rem;
          border-width: 1px;
          border-style: solid;
        }
        .role-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .role-icon { font-size: 1.5rem; }
        .role-name {
          font-family: var(--serif);
          font-size: 1.25rem;
          font-weight: 500;
        }
        .role-badge {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 3px;
          border: 1px solid currentColor;
          opacity: 0.7;
        }
        .role-desc {
          font-size: 0.8rem;
          line-height: 1.65;
          opacity: 0.75;
        }
        .role-admin-link {
          display: inline-block;
          margin-top: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-decoration: none;
          padding: 0.4rem 1rem;
          border-radius: 4px;
          border: 1px solid currentColor;
          opacity: 0.8;
          transition: opacity 0.15s;
        }
        .role-admin-link:hover { opacity: 1; }

        /* ── Sync status card ─────────────────────────────────── */
        .sync-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border);
          font-size: 0.8rem;
        }
        .sync-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sync-row:first-child { padding-top: 0; }
        .sync-key { color: var(--muted); }
        .sync-val {
          font-weight: 500;
          text-align: right;
        }
        .sync-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          margin-right: 5px;
          vertical-align: middle;
        }
        .dot-green { background: #22c55e; box-shadow: 0 0 6px #22c55e80; }
        .dot-yellow { background: #f59e0b; }
        .dot-red { background: #ef4444; }

        /* ── Supabase row pre ─────────────────────────────────── */
        .db-pre {
          background: #0f1117;
          color: #4ade80;
          padding: 1.25rem;
          border-radius: 7px;
          font-size: 0.72rem;
          line-height: 1.8;
          overflow-x: auto;
          border: 1px solid rgba(74,222,128,0.15);
        }
        .db-pre .key { color: #93c5fd; }
        .db-pre .str { color: #86efac; }
        .db-pre .num { color: #fbbf24; }
        .db-pre .null-val { color: #9ca3af; }

        /* ── Warning ──────────────────────────────────────────── */
        .warn-card {
          background: #fefce8;
          border: 1px solid #fde047;
          border-radius: 10px;
          padding: 1.25rem;
          font-size: 0.82rem;
          color: #854d0e;
          line-height: 1.65;
        }
        .warn-card code {
          background: rgba(133,77,14,0.1);
          padding: 1px 5px;
          border-radius: 3px;
          font-size: 0.75rem;
        }

        @media (max-width: 680px) {
          .grid-2 { grid-template-columns: 1fr; }
          .dash-main { padding: 1.5rem 1rem; }
          .topbar { padding: 0 1rem; }
          .topbar-email { display: none; }
        }
      `}</style>

      <div className="dash-root">
        {/* ── Top bar ──────────────────────────────────────────── */}
        <header className="topbar">
          <a href="/" className="topbar-logo">
            webhook<span>/</span>rbac
          </a>
          <div className="topbar-right">
            <span className="topbar-email">{email}</span>
            <a href="/sign-out" className="sign-out-link">Sign out</a>
          </div>
        </header>

        <main className="dash-main">
          {/* ── Welcome ────────────────────────────────────────── */}
          <div className="welcome-row">
            <div className="avatar">{initials || '??'}</div>
            <div className="welcome-text">
              <h1>Good to see you, {displayName}</h1>
              <p>Your session is active · Role synced via Clerk webhook</p>
            </div>
          </div>

          {/* ── Top grid: role + sync status ───────────────────── */}
          <div className="grid-2">
            {/* Role card */}
            {roleConfig ? (
              <div
                className="role-card"
                style={{
                  background: roleConfig.bg,
                  borderColor: roleConfig.border,
                  color: roleConfig.color,
                }}
              >
                <p
                  className="card-label"
                  style={{ color: roleConfig.color, opacity: 0.7 }}
                >
                  Your role
                </p>
                <div className="role-header">
                  <span className="role-icon">{roleConfig.icon}</span>
                  <span className="role-name">{roleConfig.label}</span>
                  <span className="role-badge">{role}</span>
                </div>
                <p className="role-desc">{roleConfig.desc}</p>
                {role === 'admin' && (
                  <a
                    href="/admin"
                    className="role-admin-link"
                    style={{ color: roleConfig.color }}
                  >
                    Open Admin Dashboard →
                  </a>
                )}
              </div>
            ) : (
              <div className="card">
                <p className="card-label">Your role</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>
                  No role assigned yet. The webhook may still be processing.
                </p>
              </div>
            )}

            {/* Webhook sync status */}
            <div className="card">
              <p className="card-label">Webhook sync status</p>
              <div className="sync-row">
                <span className="sync-key">Supabase record</span>
                <span className="sync-val">
                  {dbUser ? (
                    <><span className="sync-dot dot-green" />synced</>
                  ) : (
                    <><span className="sync-dot dot-red" />not found</>
                  )}
                </span>
              </div>
              <div className="sync-row">
                <span className="sync-key">JWT role claim</span>
                <span className="sync-val">
                  {role ? (
                    <><span className="sync-dot dot-green" /><code style={{fontSize:'0.72rem'}}>{role}</code></>
                  ) : (
                    <><span className="sync-dot dot-yellow" />pending</>
                  )}
                </span>
              </div>
              <div className="sync-row">
                <span className="sync-key">Supabase role</span>
                <span className="sync-val">
                  {dbUser?.role ? (
                    <><span className="sync-dot dot-green" /><code style={{fontSize:'0.72rem'}}>{dbUser.role}</code></>
                  ) : (
                    <><span className="sync-dot dot-yellow" />—</>
                  )}
                </span>
              </div>
              <div className="sync-row">
                <span className="sync-key">Clerk user ID</span>
                <span className="sync-val" style={{fontSize:'0.68rem', color:'var(--muted)', fontFamily:'var(--mono)'}}>
                  {userId?.slice(0, 18)}…
                </span>
              </div>
            </div>
          </div>

          {/* ── Supabase row / warning ──────────────────────────── */}
          <div className="grid-full">
            {dbUser ? (
              <div className="card">
                <p className="card-label">Supabase row — users table</p>
                <pre className="db-pre">
                  <span>{'{'}</span>{'\n'}
                  {Object.entries(dbUser).map(([k, v]) => (
                    <span key={k}>
                      {'  '}
                      <span className="key">&quot;{k}&quot;</span>
                      {': '}
                      {v === null
                        ? <span className="null-val">null</span>
                        : typeof v === 'number'
                          ? <span className="num">{v}</span>
                          : <span className="str">&quot;{String(v)}&quot;</span>
                      }
                      {','}
                      {'\n'}
                    </span>
                  ))}
                  <span>{'}'}</span>
                </pre>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                  This row was written by the <code style={{background:'#f3f4f6',padding:'1px 5px',borderRadius:'3px'}}>user.created</code> webhook
                  and kept in sync by <code style={{background:'#f3f4f6',padding:'1px 5px',borderRadius:'3px'}}>user.updated</code> on every role change.
                </p>
              </div>
            ) : (
              <div className="warn-card">
                ⚠️ No Supabase row found for your account. This means the <code>user.created</code> webhook
                hasn&apos;t fired or wasn&apos;t processed yet. Check that your Cloudflare tunnel is running
                and the webhook endpoint is registered in the Clerk Dashboard.
                {dbError && (
                  <p style={{ marginTop: '0.5rem', opacity: 0.75 }}>
                    DB error: {dbError.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}