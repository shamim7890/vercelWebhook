'use client'

import { useAuth, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    requestAnimationFrame(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
  }, [])

  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string
    const { error } = await signUp.password({ emailAddress, password })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }
    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async (formData: FormData) => {
    const code = formData.get('code') as string
    await signUp.verifications.verifyEmailCode({ code })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }
          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url)
          }
        },
      })
    } else {
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) return null

  const isVerifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .su-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0e0e0f;
          font-family: 'DM Sans', sans-serif;
        }

        /* LEFT PANEL */
        .su-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          background: #111113;
        }
        .su-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 30% 20%, rgba(196,154,78,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 80% 80%, rgba(196,154,78,0.07) 0%, transparent 60%);
          z-index: 0;
        }
        .su-left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(196,154,78,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,154,78,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }
        .su-left-content { position: relative; z-index: 1; }
        .su-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: #c49a4e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          position: absolute;
          top: 3rem;
          left: 3rem;
        }
        .su-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 4vw, 3.8rem);
          font-weight: 300;
          color: #f2ede6;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin-bottom: 1.25rem;
        }
        .su-tagline em {
          font-style: italic;
          color: #c49a4e;
        }
        .su-sub {
          font-size: 0.9rem;
          font-weight: 300;
          color: rgba(242,237,230,0.45);
          line-height: 1.7;
          max-width: 28ch;
        }
        .su-dots {
          display: flex;
          gap: 6px;
          margin-top: 2.5rem;
        }
        .su-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(196,154,78,0.3);
        }
        .su-dot.active { background: #c49a4e; }

        /* RIGHT PANEL */
        .su-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .su-card {
          width: 100%;
          max-width: 420px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .su-card-header { margin-bottom: 2.5rem; }
        .su-card-eyebrow {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c49a4e;
          margin-bottom: 0.75rem;
        }
        .su-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: #f2ede6;
          line-height: 1.2;
        }
        .su-card-sub {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          font-weight: 300;
          color: rgba(242,237,230,0.4);
        }
        .su-card-sub a {
          color: #c49a4e;
          text-decoration: none;
          border-bottom: 1px solid rgba(196,154,78,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .su-card-sub a:hover { border-color: #c49a4e; }

        /* FIELDS */
        .su-field { margin-bottom: 1.25rem; }
        .su-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(242,237,230,0.5);
          margin-bottom: 0.5rem;
        }
        .su-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(196,154,78,0.18);
          border-radius: 6px;
          padding: 0.85rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #f2ede6;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .su-input::placeholder { color: rgba(242,237,230,0.22); }
        .su-input:focus {
          border-color: rgba(196,154,78,0.55);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(196,154,78,0.08);
        }
        .su-field-error {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #e07070;
        }

        /* BUTTON */
        .su-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.9rem 1rem;
          background: #c49a4e;
          border: none;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #0e0e0f;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
        }
        .su-btn:hover:not(:disabled) { background: #d4aa5e; transform: translateY(-1px); }
        .su-btn:active:not(:disabled) { transform: translateY(0); }
        .su-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .su-btn-ghost {
          display: block;
          width: 100%;
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: transparent;
          border: 1px solid rgba(196,154,78,0.2);
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 400;
          letter-spacing: 0.06em;
          color: rgba(242,237,230,0.5);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
          text-align: center;
        }
        .su-btn-ghost:hover { border-color: rgba(196,154,78,0.5); color: #c49a4e; }

        /* DIVIDER */
        .su-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.75rem 0;
        }
        .su-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(196,154,78,0.12);
        }
        .su-divider-text {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(242,237,230,0.25);
        }

        /* CODE INPUT */
        .su-code-hint {
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(242,237,230,0.45);
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }
        .su-code-hint span { color: #c49a4e; }

        /* CAPTCHA */
        #clerk-captcha { margin-top: 1rem; }

        @media (max-width: 768px) {
          .su-root { grid-template-columns: 1fr; }
          .su-left { display: none; }
          .su-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="su-root">
        {/* Left decorative panel */}
        <div className="su-left">
          <div className="su-left-bg" />
          <div className="su-left-grid" />
          <span className="su-wordmark">Acme</span>
          <div className="su-left-content">
            <h1 className="su-tagline">
              The future<br />belongs to<br /><em>builders.</em>
            </h1>
            <p className="su-sub">
              Join thousands of teams who ship faster, collaborate smarter, and build without limits.
            </p>
            <div className="su-dots">
              <div className="su-dot active" />
              <div className="su-dot" />
              <div className="su-dot" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="su-right">
          <div className="su-card" ref={containerRef}>
            {isVerifying ? (
              <>
                <div className="su-card-header">
                  <p className="su-card-eyebrow">Step 2 of 2</p>
                  <h2 className="su-card-title">Check your inbox</h2>
                </div>
                <p className="su-code-hint">
                  We sent a 6-digit code to your email address.<br />
                  <span>Enter it below to verify your account.</span>
                </p>
                <form action={handleVerify}>
                  <div className="su-field">
                    <label className="su-label" htmlFor="code">Verification code</label>
                    <input
                      className="su-input"
                      id="code"
                      name="code"
                      type="text"
                      placeholder="000000"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {errors.fields.code && (
                      <p className="su-field-error">{errors.fields.code.message}</p>
                    )}
                  </div>
                  <button className="su-btn" type="submit" disabled={fetchStatus === 'fetching'}>
                    {fetchStatus === 'fetching' ? 'Verifying…' : 'Verify & continue →'}
                  </button>
                </form>
                <button
                  className="su-btn-ghost"
                  onClick={() => signUp.verifications.sendEmailCode()}
                >
                  Resend code
                </button>
              </>
            ) : (
              <>
                <div className="su-card-header">
                  <p className="su-card-eyebrow">Create account</p>
                  <h2 className="su-card-title">Get started</h2>
                  <p className="su-card-sub">
                    Already have an account?{' '}
                    <a href="/sign-in">Sign in</a>
                  </p>
                </div>
                <form action={handleSubmit}>
                  <div className="su-field">
                    <label className="su-label" htmlFor="email">Email address</label>
                    <input
                      className="su-input"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.fields.emailAddress && (
                      <p className="su-field-error">{errors.fields.emailAddress.message}</p>
                    )}
                  </div>
                  <div className="su-field">
                    <label className="su-label" htmlFor="password">Password</label>
                    <input
                      className="su-input"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />
                    {errors.fields.password && (
                      <p className="su-field-error">{errors.fields.password.message}</p>
                    )}
                  </div>
                  <button className="su-btn" type="submit" disabled={fetchStatus === 'fetching'}>
                    {fetchStatus === 'fetching' ? 'Creating account…' : 'Create account →'}
                  </button>
                  <div id="clerk-captcha" />
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}