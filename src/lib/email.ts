import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`

  await resend.emails.send({
    from: 'AutoApply <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your AutoApply password',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0F0F23; color: #F9FAFB; border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #4A6CF7; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 18px;">⚡</span>
          </div>
          <span style="font-weight: 600; font-size: 18px;">AutoApply</span>
        </div>
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600;">Reset your password</h2>
        <p style="color: #9CA3AF; margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
          Click the button below to reset your AutoApply password. This link expires in 1 hour.
        </p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #4A6CF7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
          Reset password
        </a>
        <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}

export async function sendVerificationEmail(email: string, token: string, baseUrl: string) {
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`

  await resend.emails.send({
    from: 'AutoApply <onboarding@resend.dev>',
    to: email,
    subject: 'Verify your AutoApply account',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0F0F23; color: #F9FAFB; border-radius: 12px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #4A6CF7; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 18px;">⚡</span>
          </div>
          <span style="font-weight: 600; font-size: 18px;">AutoApply</span>
        </div>
        <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 600;">Verify your email</h2>
        <p style="color: #9CA3AF; margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
          Click the button below to verify your AutoApply account. This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: #4A6CF7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; font-size: 14px;">
          Verify email
        </a>
        <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">
          If you didn't create an AutoApply account, you can safely ignore this email.
        </p>
      </div>
    `,
  })
}
