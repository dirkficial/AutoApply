import { ResetPasswordForm } from './reset-password-form'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ResetPasswordPage({ searchParams }: Props) {
  const params = await searchParams
  const token = typeof params.token === 'string' ? params.token : ''
  const email = typeof params.email === 'string' ? params.email : ''

  return <ResetPasswordForm token={token} email={email} />
}
