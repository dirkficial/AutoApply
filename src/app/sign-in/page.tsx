import { SignInForm } from './sign-in-form'

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SignInPage({ searchParams }: Props) {
  const params = await searchParams
  const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : '/dashboard'
  const registered = params.registered === 'true'
  const verified = params.verified === 'true'
  const reset = params.reset === 'true'
  const urlError = typeof params.error === 'string' ? params.error : undefined

  return (
    <SignInForm
      callbackUrl={callbackUrl}
      registered={registered}
      verified={verified}
      reset={reset}
      urlError={urlError}
    />
  )
}
