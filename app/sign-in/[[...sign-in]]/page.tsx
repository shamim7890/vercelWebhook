'use client'

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn()
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

    const { error } = await signIn.password({ emailAddress, password })
    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
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
    } else if (signIn.status === 'needs_second_factor') {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code',
      )
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  const handleVerify = async (formData: FormData) => {
    const code = formData.get('code') as string
    await signIn.mfa.verifyEmailCode({ code })
    if (signIn.status === 'complete') {
      await signIn.finalize({
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
      console.error('Sign-in attempt not complete:', signIn)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .si-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #0e0e0f;
          font-family: 'DM Sans', sans-serif;
        }

        /* LEFT PANEL */
        .si-left {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          background: #111113;
        }
        .si-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 30% 20%, rgba(196,154,78,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 50% 80% at 80% 80%, rgba(196,154,78,0.07) 0%, transparent 60%);
          z-index: 0;
        }
        .si-left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(196,154,78,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,154,78,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          z-index: 0;
        }
        .si-left-content { position: relative; z-index: 1; }
        .si-wordmark {
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
        .si-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.6rem, 4vw, 3.8rem);
          font-weight: 300;
          color: #f2ede6;
          line-height: 1.15;
          letter-spacing: -0.01em;
          margin-bottom: 1.25rem;
        }
        .si-tagline em {
          font-style: italic;
          color: #c49a4e;
        }
        .si-sub {
          font-size: 0.9rem;
          font-weight: 300;
          color: rgba(242,237,230,0.45);
          line-height: 1.7;
          max-width: 28ch;
        }
        .si-dots {
          display: flex;
          gap: 6px;
          margin-top: 2.5rem;
        }
        .si-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(196,154,78,0.3);
        }
        .si-dot.active { background: #c49a4e; }

        /* RIGHT PANEL */
        .si-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .si-card {
          width: 100%;
          max-width: 420px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
        }
        .si-card-header { margin-bottom: 2.5rem; }
        .si-card-eyebrow {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c49a4e;
          margin-bottom: 0.75rem;
        }
        .si-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: #f2ede6;
          line-height: 1.2;
        }
        .si-card-sub {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          font-weight: 300;
          color: rgba(242,237,230,0.4);
        }
        .si-card-sub a {
          color: #c49a4e;
          text-decoration: none;
          border-bottom: 1px solid rgba(196,154,78,0.3);
          padding-bottom: 1px;
          transition: border-color 0.2s;
        }
        .si-card-sub a:hover { border-color: #c49a4e; }

        /* FIELDS */
        .si-field { margin-bottom: 1.25rem; }
        .si-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(242,237,230,0.5);
          margin-bottom: 0.5rem;
        }
        .si-input {
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
        .si-input::placeholder { color: rgba(242,237,230,0.22); }
        .si-input:focus {
          border-color: rgba(196,154,78,0.55);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(196,154,78,0.08);
        }
        .si-field-error {
          margin-top: 0.4rem;
          font-size: 0.75rem;
          color: #e07070;
        }

        /* FORGOT */
        .si-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.6rem;
          margin-bottom: 1.25rem;
        }
        .si-forgot {
          font-size: 0.78rem;
          font-weight: 300;
          color: rgba(242,237,230,0.4);
          text-decoration: none;
          transition: color 0.2s;
        }
        .si-forgot:hover { color: #c49a4e; }

        /* BUTTON */
        .si-btn {
          width: 100%;
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
        .si-btn:hover:not(:disabled) { background: #d4aa5e; transform: translateY(-1px); }
        .si-btn:active:not(:disabled) { transform: translateY(0); }
        .si-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .si-btn-ghost {
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
        .si-btn-ghost:hover { border-color: rgba(196,154,78,0.5); color: #c49a4e; }

        /* CODE */
        .si-code-hint {
          font-size: 0.82rem;
          font-weight: 300;
          color: rgba(242,237,230,0.45);
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }
        .si-code-hint span { color: #c49a4e; }

        @media (max-width: 768px) {
          .si-root { grid-template-columns: 1fr; }
          .si-left { display: none; }
          .si-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="si-root">
        {/* Left decorative panel */}
        <div className="si-left">
          <div className="si-left-bg" />
          <div className="si-left-grid" />
          <span className="si-wordmark">Acme</span>
          <div className="si-left-content">
            <h1 className="si-tagline">
              Good to have<br />you <em>back.</em>
            </h1>
            <p className="si-sub">
              Pick up right where you left off. Your workspace is waiting for you.
            </p>
            <div className="si-dots">
              <div className="si-dot" />
              <div className="si-dot active" />
              <div className="si-dot" />
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="si-right">
          <div className="si-card" ref={containerRef}>
            {signIn.status === 'needs_client_trust' ? (
              <>
                <div className="si-card-header">
                  <p className="si-card-eyebrow">Verification required</p>
                  <h2 className="si-card-title">Check your inbox</h2>
                </div>
                <p className="si-code-hint">
                  A 6-digit verification code was sent to your email.<br />
                  <span>Enter it below to continue.</span>
                </p>
                <form action={handleVerify}>
                  <div className="si-field">
                    <label className="si-label" htmlFor="code">Verification code</label>
                    <input
                      className="si-input"
                      id="code"
                      name="code"
                      type="text"
                      placeholder="000000"
                      autoComplete="one-time-code"
                      maxLength={6}
                    />
                    {errors.fields.code && (
                      <p className="si-field-error">{errors.fields.code.message}</p>
                    )}
                  </div>
                  <button className="si-btn" type="submit" disabled={fetchStatus === 'fetching'}>
                    {fetchStatus === 'fetching' ? 'Verifying…' : 'Verify & sign in →'}
                  </button>
                </form>
                <button
                  className="si-btn-ghost"
                  onClick={() => signIn.mfa.sendEmailCode()}
                >
                  Resend code
                </button>
                <button
                  className="si-btn-ghost"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => signIn.reset()}
                >
                  ← Start over
                </button>
              </>
            ) : (
              <>
                <div className="si-card-header">
                  <p className="si-card-eyebrow">Welcome back</p>
                  <h2 className="si-card-title">Sign in</h2>
                  <p className="si-card-sub">
                    Don't have an account?{' '}
                    <a href="/sign-up">Get started</a>
                  </p>
                </div>
                <form action={handleSubmit}>
                  <div className="si-field">
                    <label className="si-label" htmlFor="email">Email address</label>
                    <input
                      className="si-input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                    {errors.fields.identifier && (
                      <p className="si-field-error">{errors.fields.identifier.message}</p>
                    )}
                  </div>
                  <div className="si-field">
                    <label className="si-label" htmlFor="password">Password</label>
                    <input
                      className="si-input"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />
                    {errors.fields.password && (
                      <p className="si-field-error">{errors.fields.password.message}</p>
                    )}
                  </div>
                  <div className="si-forgot-row">
                    <a className="si-forgot" href="/forgot-password">Forgot password?</a>
                  </div>
                  <button className="si-btn" type="submit" disabled={fetchStatus === 'fetching'}>
                    {fetchStatus === 'fetching' ? 'Signing in…' : 'Sign in →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}