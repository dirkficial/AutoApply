import { Suspense } from 'react'
import Link from 'next/link'
import { Mail, Zap } from 'lucide-react'
import { ResendButton } from './resend-button'

function VerifyEmailContent({ email }: { email: string | null }) {
  return (
    <div className="min-h-screen bg-[var(--autoapply-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[var(--autoapply-primary)] flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg text-foreground">AutoApply</span>
        </div>

        <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-6 space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full bg-[var(--autoapply-primary)]/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-[var(--autoapply-primary)]" />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-base font-semibold text-foreground">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              {email
                ? <>We sent a verification link to <span className="text-foreground font-medium">{email}</span></>
                : 'We sent you a verification link.'}
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>

          {email && <ResendButton email={email} />}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
          <Link href="/sign-in" className="text-[var(--autoapply-primary)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams
  return (
    <Suspense>
      <VerifyEmailContent email={email ?? null} />
    </Suspense>
  )
}

export default VerifyEmailPage
