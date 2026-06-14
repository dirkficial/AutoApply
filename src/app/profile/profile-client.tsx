'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { UserAvatar } from '@/components/ui/user-avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'

interface JobStats {
  seen: number
  applied: number
  interviewing: number
  offers: number
  responseRate: string
}

interface ProfileClientProps {
  name: string | null
  email: string | null
  image: string | null
  memberSince: string
  isCredentialsUser: boolean
  stats: JobStats
}

export function ProfileClient({
  name,
  email,
  image,
  memberSince,
  isCredentialsUser,
  stats,
}: ProfileClientProps) {
  const [pwOpen, setPwOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function resetPasswordForm() {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.')
      return
    }

    setPwLoading(true)

    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    setPwLoading(false)

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error ?? 'Something went wrong.')
      return
    }

    toast.success('Password updated.')
    resetPasswordForm()
    setPwOpen(false)
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true)

    const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })

    if (!res.ok) {
      setDeleteLoading(false)
      toast.error('Failed to delete account. Please try again.')
      return
    }

    await signOut({ callbackUrl: '/sign-in' })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* User info */}
      <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-8 flex items-center gap-6">
        <UserAvatar name={name} image={image} size="lg" />
        <div className="min-w-0">
          <p className="text-xl font-semibold text-foreground truncate">{name ?? '—'}</p>
          <p className="text-base text-muted-foreground truncate mt-0.5">{email ?? '—'}</p>
          <p className="text-sm text-muted-foreground mt-1.5">Member since {memberSince}</p>
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Job Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="Jobs seen" value={String(stats.seen)} />
          <Stat label="Applied" value={String(stats.applied)} />
          <Stat label="Interviewing" value={String(stats.interviewing)} />
          <Stat label="Offers" value={String(stats.offers)} />
        </div>
        <Separator />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Response rate</span>
          <span className="font-medium text-foreground">{stats.responseRate}</span>
        </div>
      </div>

      {/* Account actions */}
      {isCredentialsUser && (
        <div className="bg-[var(--autoapply-surface)] rounded-xl border border-border p-6 space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <p className="text-sm text-muted-foreground">Update your login credentials.</p>

          {/* Change password dialog */}
          <AlertDialog open={pwOpen} onOpenChange={(open) => { setPwOpen(open); if (!open) resetPasswordForm() }}>
            <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
              Change password
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change password</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter your current password and choose a new one.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={handleChangePassword} id="change-password-form" className="space-y-3 px-4">
                <Input
                  type="password"
                  placeholder="Current password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-muted border-border"
                />
                <Input
                  type="password"
                  placeholder="New password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-muted border-border"
                />
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-muted border-border"
                />
              </form>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  type="submit"
                  form="change-password-form"
                  disabled={pwLoading}
                >
                  {pwLoading ? 'Saving…' : 'Update password'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-[var(--autoapply-surface)] rounded-xl border border-red-500/20 p-6 space-y-3">
        <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive" size="sm" disabled={deleteLoading} />}>
            {deleteLoading ? 'Deleting…' : 'Delete account'}
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account, all job decisions, and any tailored resumes. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDeleteAccount}
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}
