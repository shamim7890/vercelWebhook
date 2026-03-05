/**
 * app/page.tsx — Landing page
 * Public. No auth required.
 */

import Link from 'next/link'
import { JSX } from 'react'

export default function LandingPage(): JSX.Element {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:        #080c10;
          --bg2:       #0e1420;
          --surface:   #131a24;
          --border:    rgba(74,222,128,0.12);
          --green:     #4ade80;
          --green-dim: rgba(74,222,128,0.18);
          --text:      #e8f0ea;
          --muted:     rgba(232,240,234,0.45);
          --mono:      'JetBrains Mono', monospace;
          --serif:     'Lora', Georgia, serif;
        }

        html { scroll-behavior: smooth; }

        .land-root {
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--mono);
          overflow-x: hidden;
        }

        /* ── Grid overlay ─────────────────────────────────────── */
        .land-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(74,222,128,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Glow orbs ────────────────────────────────────────── */
        .glow-tl {
          position: fixed;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }
        .glow-br {
          position: fixed;
          bottom: -200px; right: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        /* ── Nav ──────────────────────────────────────────────── */
        .nav {
          position: relative; z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 3rem;
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: var(--mono);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: var(--green);
          text-decoration: none;
        }
        .nav-logo span { color: var(--muted); font-weight: 300; }
        .nav-links { display: flex; gap: 0.5rem; align-items: center; }
        .nav-link {
          font-size: 0.78rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          color: var(--muted);
          text-decoration: none;
          padding: 0.4rem 0.9rem;
          border-radius: 4px;
          border: 1px solid transparent;
          transition: color 0.15s, border-color 0.15s;
        }
        .nav-link:hover { color: var(--text); border-color: var(--border); }
        .nav-cta {
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--bg);
          background: var(--green);
          text-decoration: none;
          padding: 0.45rem 1.1rem;
          border-radius: 4px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── Hero ─────────────────────────────────────────────── */
        .hero {
          position: relative; z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 5rem 3rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 1.5rem;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 8px var(--green);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .hero-title {
          font-family: var(--serif);
          font-size: clamp(2.4rem, 4vw, 3.8rem);
          font-weight: 500;
          line-height: 1.18;
          letter-spacing: -0.01em;
          color: var(--text);
          margin-bottom: 1.5rem;
        }
        .hero-title em {
          font-style: italic;
          color: var(--green);
        }
        .hero-sub {
          font-size: 0.88rem;
          font-weight: 300;
          line-height: 1.8;
          color: var(--muted);
          max-width: 40ch;
          margin-bottom: 2.5rem;
        }
        .hero-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .btn-primary {
          font-family: var(--mono);
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--bg);
          background: var(--green);
          text-decoration: none;
          padding: 0.7rem 1.5rem;
          border-radius: 5px;
          transition: opacity 0.15s, transform 0.15s;
          display: inline-block;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-ghost {
          font-family: var(--mono);
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: var(--muted);
          background: transparent;
          text-decoration: none;
          padding: 0.7rem 1.5rem;
          border-radius: 5px;
          border: 1px solid var(--border);
          transition: color 0.15s, border-color 0.15s;
          display: inline-block;
        }
        .btn-ghost:hover { color: var(--text); border-color: rgba(74,222,128,0.4); }

        /* ── Event feed terminal ──────────────────────────────── */
        .terminal {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(74,222,128,0.06);
        }
        .terminal-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 1rem;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid var(--border);
        }
        .t-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
        }
        .t-dot-r { background: #ff5f56; }
        .t-dot-y { background: #ffbd2e; }
        .t-dot-g { background: #27c93f; }
        .terminal-title {
          font-size: 0.7rem;
          font-weight: 400;
          color: var(--muted);
          letter-spacing: 0.05em;
          margin-left: 0.25rem;
        }
        .terminal-body { padding: 1.25rem; font-size: 0.75rem; line-height: 1.9; }
        .t-line { display: flex; gap: 0.75rem; align-items: baseline; }
        .t-time { color: rgba(74,222,128,0.5); flex-shrink: 0; font-size: 0.68rem; }
        .t-tag {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 1px 6px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .t-tag-created  { background: rgba(74,222,128,0.15); color: #4ade80; }
        .t-tag-updated  { background: rgba(56,189,248,0.15);  color: #38bdf8; }
        .t-tag-deleted  { background: rgba(248,113,113,0.15); color: #f87171; }
        .t-tag-verified { background: rgba(167,139,250,0.15); color: #a78bfa; }
        .t-msg { color: var(--muted); }
        .t-msg b { color: var(--text); font-weight: 500; }
        .t-msg code { color: var(--green); font-size: 0.68rem; }
        .t-cursor {
          display: inline-block;
          width: 8px; height: 0.85em;
          background: var(--green);
          margin-left: 2px;
          vertical-align: middle;
          animation: blink 1.1s step-end infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

        /* Staggered fade-in for terminal lines */
        .t-line { opacity: 0; animation: fadeSlide 0.4s ease forwards; }
        .t-line:nth-child(1)  { animation-delay: 0.1s; }
        .t-line:nth-child(2)  { animation-delay: 0.55s; }
        .t-line:nth-child(3)  { animation-delay: 1.0s; }
        .t-line:nth-child(4)  { animation-delay: 1.45s; }
        .t-line:nth-child(5)  { animation-delay: 1.9s; }
        .t-line:nth-child(6)  { animation-delay: 2.35s; }
        .t-line:nth-child(7)  { animation-delay: 2.8s; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Flow diagram ─────────────────────────────────────── */
        .flow {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 3rem 5rem;
        }
        .flow-title {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 2rem;
          text-align: center;
        }
        .flow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .flow-step {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          min-width: 160px;
          text-align: center;
        }
        .flow-step-icon {
          font-size: 1.4rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .flow-step-label {
          font-size: 0.72rem;
          font-weight: 500;
          color: var(--text);
          display: block;
          margin-bottom: 0.2rem;
        }
        .flow-step-sub {
          font-size: 0.65rem;
          color: var(--muted);
        }
        .flow-arrow {
          font-size: 0.9rem;
          color: var(--green);
          padding: 0 0.5rem;
          flex-shrink: 0;
        }

        /* ── Features ─────────────────────────────────────────── */
        .features {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 3rem 6rem;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
        }
        .feat-card {
          background: var(--bg2);
          padding: 2rem;
          transition: background 0.2s;
        }
        .feat-card:hover { background: var(--surface); }
        .feat-num {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--green);
          margin-bottom: 1rem;
          opacity: 0.7;
        }
        .feat-title {
          font-family: var(--serif);
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .feat-desc {
          font-size: 0.78rem;
          font-weight: 300;
          color: var(--muted);
          line-height: 1.75;
        }
        .feat-tag {
          display: inline-block;
          margin-top: 1.25rem;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--green);
          border: 1px solid rgba(74,222,128,0.25);
          padding: 2px 8px;
          border-radius: 3px;
        }

        /* ── Stack badge row ──────────────────────────────────── */
        .stack {
          position: relative; z-index: 1;
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          padding: 0 3rem 5rem;
        }
        .stack-pill {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 0.4rem 1rem;
          background: var(--surface);
        }

        /* ── Footer ───────────────────────────────────────────── */
        .footer {
          position: relative; z-index: 1;
          text-align: center;
          padding: 2rem 3rem;
          border-top: 1px solid var(--border);
          font-size: 0.72rem;
          color: var(--muted);
          letter-spacing: 0.05em;
        }

        @media (max-width: 900px) {
          .nav { padding: 1.25rem 1.5rem; }
          .hero { grid-template-columns: 1fr; padding: 3rem 1.5rem; gap: 2.5rem; }
          .flow, .features { padding-left: 1.5rem; padding-right: 1.5rem; }
          .features-grid { grid-template-columns: 1fr; }
          .flow-steps { gap: 0.5rem; }
          .flow-arrow { display: none; }
          .stack { padding: 0 1.5rem 3rem; }
        }
      `}</style>

      <div className="land-root">
        <div className="glow-tl" />
        <div className="glow-br" />

        {/* ── Nav ────────────────────────────────────────────── */}
        <nav className="nav">
          <a href="/" className="nav-logo">
            webhook<span>/</span>rbac
          </a>
          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#features" className="nav-link">Features</a>
            <Link href="/sign-in" className="nav-link">Sign in</Link>
            <Link href="/sign-up" className="nav-cta">Get started →</Link>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="hero">
          <div>
            <p className="hero-eyebrow">Live webhook sync</p>
            <h1 className="hero-title">
              Clerk events.<br />
              Supabase sync.<br />
              <em>Roles that work.</em>
            </h1>
            <p className="hero-sub">
              A minimal Next.js project that teaches you exactly how webhooks,
              Clerk, Supabase, and role-based access control connect together —
              with fully typed TypeScript throughout.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="btn-primary">Create account →</Link>
              <Link href="/sign-in" className="btn-ghost">Sign in</Link>
            </div>
          </div>

          {/* Animated terminal */}
          <div className="terminal">
            <div className="terminal-bar">
              <span className="t-dot t-dot-r" />
              <span className="t-dot t-dot-y" />
              <span className="t-dot t-dot-g" />
              <span className="terminal-title">POST /api/webhooks/clerk</span>
            </div>
            <div className="terminal-body">
              <div className="t-line">
                <span className="t-time">09:41:02</span>
                <span className="t-tag t-tag-verified">VERIFIED</span>
                <span className="t-msg">Svix signature valid</span>
              </div>
              <div className="t-line">
                <span className="t-time">09:41:02</span>
                <span className="t-tag t-tag-created">CREATED</span>
                <span className="t-msg"><b>user.created</b> received</span>
              </div>
              <div className="t-line">
                <span className="t-time">09:41:02</span>
                <span className="t-tag t-tag-created">SUPABASE</span>
                <span className="t-msg">upsert <code>users</code> ✓</span>
              </div>
              <div className="t-line">
                <span className="t-time">09:41:02</span>
                <span className="t-tag t-tag-verified">CLERK</span>
                <span className="t-msg">publicMetadata <code>role: user</code> set</span>
              </div>
              <div className="t-line">
                <span className="t-time">09:41:03</span>
                <span className="t-tag t-tag-updated">UPDATED</span>
                <span className="t-msg"><b>user.updated</b> re-synced</span>
              </div>
              <div className="t-line">
                <span className="t-time">09:44:17</span>
                <span className="t-tag t-tag-updated">ROLE</span>
                <span className="t-msg">admin set <code>role: moderator</code></span>
              </div>
              <div className="t-line">
                <span className="t-time">09:44:17</span>
                <span className="t-tag t-tag-updated">SUPABASE</span>
                <span className="t-msg">row updated ✓ <span className="t-cursor" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Data flow diagram ───────────────────────────────── */}
        <section id="how-it-works" className="flow">
          <p className="flow-title">The data flow</p>
          <div className="flow-steps">
            <div className="flow-step">
              <span className="flow-step-icon">🧑</span>
              <span className="flow-step-label">User signs up</span>
              <span className="flow-step-sub">Clerk handles auth</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-step-icon">📡</span>
              <span className="flow-step-label">Webhook fires</span>
              <span className="flow-step-sub">user.created event</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-step-icon">🔐</span>
              <span className="flow-step-label">Sig verified</span>
              <span className="flow-step-sub">Svix HMAC check</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-step-icon">🗄️</span>
              <span className="flow-step-label">Supabase sync</span>
              <span className="flow-step-sub">upsert users table</span>
            </div>
            <span className="flow-arrow">→</span>
            <div className="flow-step">
              <span className="flow-step-icon">🏷️</span>
              <span className="flow-step-label">Role in JWT</span>
              <span className="flow-step-sub">session claims</span>
            </div>
          </div>
        </section>

        {/* ── Feature cards ───────────────────────────────────── */}
        <section id="features" className="features">
          <div className="features-grid">
            <div className="feat-card">
              <p className="feat-num">01</p>
              <h3 className="feat-title">Webhook Verification</h3>
              <p className="feat-desc">
                Every incoming Clerk event is verified using Svix HMAC signatures
                before a single byte of data is trusted. Fake requests are rejected
                immediately with a 400.
              </p>
              <span className="feat-tag">svix</span>
            </div>
            <div className="feat-card">
              <p className="feat-num">02</p>
              <h3 className="feat-title">Role-Based Access Control</h3>
              <p className="feat-desc">
                Roles live in Clerk&apos;s publicMetadata and are baked directly into
                the session JWT. Every <code style={{color:'#4ade80',fontSize:'0.75rem'}}>checkRole()</code> call reads from the
                token — zero extra database calls per request.
              </p>
              <span className="feat-tag">clerk rbac</span>
            </div>
            <div className="feat-card">
              <p className="feat-num">03</p>
              <h3 className="feat-title">Supabase Mirror</h3>
              <p className="feat-desc">
                Every Clerk user event is reflected into a typed Supabase table.
                The service-role key is used server-side only, bypassing RLS for
                writes while keeping the anon key safe for client reads.
              </p>
              <span className="feat-tag">supabase</span>
            </div>
          </div>
        </section>

        {/* ── Stack pills ─────────────────────────────────────── */}
        <div className="stack">
          {['Next.js 15', 'TypeScript', 'Clerk', 'Supabase', 'Svix', 'Cloudflare Tunnel'].map((s) => (
            <span key={s} className="stack-pill">{s}</span>
          ))}
        </div>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="footer">
          webhook/rbac — a learning project
        </footer>
      </div>
    </>
  )
}