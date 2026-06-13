'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[var(--autoapply-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[var(--autoapply-primary)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-foreground">AutoApply</span>
        </div>

        <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-6 space-y-5">
          {submitted ? (
            <div className="space-y-3 text-center">
              <h1 className="text-base font-semibold text-foreground">Check your email</h1>
              <p className="text-sm text-muted-foreground">
                If an account exists for <span className="text-foreground">{email}</span>, we&apos;ve sent a password reset link. It expires in 1 hour.
              </p>
              <Link href="/sign-in" className="block text-sm text-[var(--autoapply-primary)] hover:underline mt-2">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-base font-semibold text-foreground">Forgot password?</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted border-border"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
            </>
          )}
        </div>

        {!submitted && (
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-[var(--autoapply-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
