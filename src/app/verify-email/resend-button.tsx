'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function ResendButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleResend() {
    setStatus('loading')
    setErrorMsg('')

    const res = await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.status === 429) {
      const data = await res.json()
      setErrorMsg(data.error ?? 'Too many attempts. Please try again later.')
      setStatus('error')
      return
    }

    setStatus('sent')
  }

  if (status === 'sent') {
    return <p className="text-xs text-green-400">Verification email resent. Check your inbox.</p>
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={handleResend}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending…' : 'Resend verification email'}
      </Button>
      {status === 'error' && (
        <p className="text-xs text-red-400 text-center">{errorMsg}</p>
      )}
    </div>
  )
}
