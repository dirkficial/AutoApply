'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ResetPasswordFormProps {
  token: string
  email: string
}

export function ResetPasswordForm({ token, email }: ResetPasswordFormProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[var(--autoapply-bg)] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-6 text-center space-y-3">
            <h1 className="text-base font-semibold text-foreground">Invalid reset link</h1>
            <p className="text-sm text-muted-foreground">This password reset link is missing required parameters.</p>
            <Link href="/forgot-password" className="text-sm text-[var(--autoapply-primary)] hover:underline">
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, password }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong.')
      return
    }

    router.push('/sign-in?reset=true')
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
          <div className="space-y-1">
            <h1 className="text-base font-semibold text-foreground">Set new password</h1>
            <p className="text-sm text-muted-foreground">Choose a new password for your account.</p>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="password"
              placeholder="New password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-muted border-border"
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="bg-muted border-border"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/sign-in" className="text-[var(--autoapply-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
