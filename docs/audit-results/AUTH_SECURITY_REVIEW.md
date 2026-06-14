# Auth Security Review

**Date:** 2026-06-13
**Auditor:** auth-auditor agent
**Scope:** Custom auth code outside NextAuth v5's automatic protections

---

## Summary

The auth implementation is well-structured and gets many things right: bcrypt cost factor, email enumeration prevention, session validation on protected API routes, and single-use token enforcement. However, there are two high-severity issues that require attention before production: the route-guard middleware is never actually invoked (the file is misnamed and not wired up as Next.js middleware), and the `callbackUrl` query parameter accepted by the sign-in page is passed directly to `router.push()` without validation, enabling open redirects. Three lower-severity gaps round out the findings.

---

## Findings

### [HIGH] Middleware guard file is not wired up as Next.js middleware — `src/proxy.ts`

**Severity:** High
**Lines:** 1–23

**Issue:**
The file `src/proxy.ts` exports a `proxy` function and a `config` object with a matcher, but Next.js only runs Edge Middleware from a file named `middleware.ts` (or `middleware.js`) located at the project root or inside `src/`. Because the file is named `proxy.ts`, it is never executed by the Next.js runtime.

Confirmed by inspecting `.next/server/middleware-manifest.json`, which shows:
```json
{
  "version": 3,
  "middleware": {},
  "sortedMiddleware": [],
  "functions": {}
}
```

The protection logic inside `proxy.ts` (redirect unauthenticated users to `/sign-in`, redirect unverified users to `/verify-email`) is dead code:

```ts
// src/proxy.ts  — never runs
export const proxy = auth(function proxy(req) {
  const isDashboard = nextUrl.pathname.startsWith('/dashboard')
  if (isDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/sign-in', nextUrl))
  }
  ...
})

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

**Impact:**
Any unauthenticated user can access `/dashboard` and all its sub-routes directly by navigating to the URL. The `ProfilePage` server component (`src/app/profile/page.tsx`, line 8) has its own `auth()` check and is safe, but the entire `/dashboard` tree has no server-side guard beyond the client-side session check. An attacker with no account can hit `/dashboard` and receive the server-rendered page shell; depending on what data the `DashboardPage` server component fetches, it may also return real data.

**Fix:**
Rename `src/proxy.ts` to `src/middleware.ts`. No code changes are required inside the file — just the filename. Next.js will automatically pick it up and enforce the middleware on all `/dashboard/*` routes.

```bash
git mv src/proxy.ts src/middleware.ts
```

Then update any import that references `src/proxy.ts` (there are none currently, so the rename is sufficient).

---

### [HIGH] Unvalidated `callbackUrl` passed to `router.push()` enables open redirect — `src/app/sign-in/page.tsx`, `src/app/sign-in/sign-in-form.tsx`

**Severity:** High
**Lines:** `page.tsx` line 9; `sign-in-form.tsx` lines 63, 71, 137

**Issue:**
The sign-in page reads `callbackUrl` directly from the query string and passes it, unvalidated, to both `signIn()` and `router.push()`:

```ts
// src/app/sign-in/page.tsx line 9
const callbackUrl = typeof params.callbackUrl === 'string' ? params.callbackUrl : '/dashboard'
```

```ts
// src/app/sign-in/sign-in-form.tsx line 71
router.push(callbackUrl)  // no origin check

// line 63
await signIn('credentials', { ..., callbackUrl })

// line 137
onClick={() => signIn('github', { callbackUrl })}
```

The only check is `typeof params.callbackUrl === 'string'`, which allows any string including `https://evil.com`.

**Impact:**
An attacker can craft a phishing link such as:
```
https://autoapply.dev/sign-in?callbackUrl=https://evil.com
```
After the user signs in successfully, `router.push('https://evil.com')` silently redirects them to the attacker-controlled site. This is a classic open redirect used for credential harvesting (the attacker's page mimics the app and asks the user to sign in again).

Note: NextAuth's built-in `callbackUrl` sanitization applies to the OAuth `redirect_uri` flow, but the `router.push(callbackUrl)` on line 71 is custom code outside NextAuth's protection.

**Fix:**
Validate that `callbackUrl` is a relative URL (starts with `/`) before using it:

```ts
// src/app/sign-in/page.tsx
const rawCallback = typeof params.callbackUrl === 'string' ? params.callbackUrl : ''
const callbackUrl = rawCallback.startsWith('/') ? rawCallback : '/dashboard'
```

This single change in `page.tsx` is sufficient because `callbackUrl` flows down as a prop and is never re-read from the URL. You do not need to change `sign-in-form.tsx`.

---

### [MEDIUM] No server-side password length or type validation on registration — `src/app/api/auth/register/route.ts`

**Severity:** Medium
**Lines:** 13–18

**Issue:**
The registration route checks that all fields are present and that `password === confirmPassword`, but it does not validate the type (`typeof password !== 'string'`) or enforce a minimum length server-side:

```ts
if (!name || !email || !password || !confirmPassword) {
  return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
}

if (password !== confirmPassword) { ... }

// No: typeof password !== 'string' check
// No: password.length >= 8 check
```

The reset-password and change-password routes both perform `typeof password !== 'string' || password.length < 8` checks. Registration should match.

**Impact:**
A direct API call (bypassing the frontend `minLength={8}` HTML attribute) can create accounts with arbitrarily short or empty passwords. This isn't exploitable for account takeover on its own, but a 1-character password is trivially brute-forced, and bcrypt hashing an empty string still produces a valid hash.

**Fix:**
Add the same guard used in `reset-password/route.ts`:

```ts
if (typeof password !== 'string' || password.length < 8) {
  return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
}
```

Add this after the `password !== confirmPassword` check (line 19), before the `bcrypt.hash` call.

---

### [LOW] `x-forwarded-proto` and `host` headers used to construct `baseUrl` for verification email — `src/app/api/auth/register/route.ts`

**Severity:** Low
**Lines:** 46–48

**Issue:**
The verification email URL is built from request headers:

```ts
const protocol = req.headers.get('x-forwarded-proto') ?? 'http'
const host = req.headers.get('host') ?? 'localhost:3000'
const baseUrl = `${protocol}://${host}`
```

If the app is deployed behind a trusted reverse proxy (Vercel), these headers are set by the infrastructure and are safe. However, if the server is ever exposed directly or sits behind an untrusted intermediary, a client could supply `Host: evil.com` to make the verification link point to an attacker-controlled domain.

The `forgot-password` route avoids this correctly by using `process.env.NEXTAUTH_URL`:
```ts
// src/app/api/auth/forgot-password/route.ts line 30
const baseUrl = process.env.NEXTAUTH_URL ?? `https://${req.headers.get('host')}`
```

**Impact:**
Low on Vercel (headers are controlled by infrastructure). If deployment ever changes, a host-header injection could generate verification emails with links to an attacker's site.

**Fix:**
Use the same pattern as `forgot-password/route.ts`:

```ts
const baseUrl = process.env.NEXTAUTH_URL ?? `https://${req.headers.get('host')}`
```

This eliminates the protocol header lookup and prefers the environment variable, which is always set in production.

---

### [LOW] Email verification race condition: user record created before token is stored and email is sent — `src/app/api/auth/register/route.ts`

**Severity:** Low
**Lines:** 35–50

**Issue:**
Registration creates the user, then creates the verification token, then sends the email — three separate database operations with no transaction:

```ts
await db.user.create({ data: { name, email, password: hashed } })  // line 35

const token = randomUUID()
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

await db.verificationToken.create({                                  // line 42
  data: { identifier: email, token, expires },
})

await sendVerificationEmail(email, token, baseUrl)                   // line 50
```

If the `verificationToken.create` call fails (DB error), the user exists in the database but has no verification token and no email was sent — they cannot verify their account and cannot re-register (the email is already taken). If `sendVerificationEmail` fails (Resend outage), the user exists with a token but never received the link.

**Impact:**
Not directly exploitable. However, it creates a class of permanently-stuck accounts: email is taken, but verification is impossible. The user has no way to recover without admin intervention.

**Fix:**
Wrap all three steps in a Prisma transaction, and handle Resend failures by returning an error (which lets the client retry the whole registration):

```ts
const token = randomUUID()
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

await db.$transaction([
  db.user.create({ data: { name, email, password: hashed } }),
  db.verificationToken.create({ data: { identifier: email, token, expires } }),
])

await sendVerificationEmail(email, token, baseUrl)
// If sendVerificationEmail throws, the transaction is already committed.
// You may want to catch this and return a 500 so the client can retry,
// or implement a resend-verification endpoint.
```

---

## Passed Checks

- **bcrypt cost factor** — All password hashing uses `bcrypt.hash(password, 12)` (register, reset-password, change-password). Cost factor 12 is appropriate for 2026 hardware.
- **bcrypt.compare for login** — `auth.ts` line 31 and `change-password/route.ts` line 28 both use `bcrypt.compare`, which is timing-safe.
- **Token entropy** — All verification and reset tokens are generated with `randomUUID()` from Node's built-in `crypto` module, which produces 128-bit cryptographically random UUIDs. This is sufficient entropy.
- **Token expiration enforced server-side** — `verify-email/route.ts` line 17 checks `record.expires < new Date()` before acting. `reset-password/route.ts` line 24 does the same. Expiry is not just stored — it's validated.
- **Single-use token enforcement** — Both `verify-email/route.ts` (line 26) and `reset-password/route.ts` (line 42) call `db.verificationToken.delete({ where: { token } })` immediately after use. Tokens cannot be replayed.
- **Email enumeration prevention on forgot-password** — `forgot-password/route.ts` lines 16–18 return `{ ok: true }` for both unknown emails and OAuth-only accounts, with a comment explaining the intent. Timing is not perfectly equalized, but the response body is identical.
- **Session validation on mutating API routes** — `change-password/route.ts` (line 7) and `delete-account/route.ts` (line 6) both call `auth()` and check `session?.user?.id` before performing any operation, returning 401 if the check fails.
- **Profile page server-side auth check** — `src/app/profile/page.tsx` line 8 calls `auth()` and redirects to `/sign-in` if no session is present. This is correct and independent of the broken middleware.
- **Previous reset tokens invalidated** — `forgot-password/route.ts` line 21 calls `db.verificationToken.deleteMany({ where: { identifier: \`reset:${email}\` } })` before creating a new token, preventing accumulation of valid reset links.
- **Reset token namespace separation** — Reset tokens use `identifier: \`reset:${email}\`` (with a `reset:` prefix) while verification tokens use the bare email. This prevents a verification token from being used as a reset token or vice versa.
- **OAuth users auto-verified** — `auth.ts` lines 40–49 set `emailVerified: new Date()` for OAuth sign-ins, correctly bypassing the email verification requirement for trusted providers.
- **Password not exposed in session or JWT** — The JWT and session callbacks only propagate `emailVerified` and `id`; the password hash is never included.
- **Type check on email in forgot-password** — `forgot-password/route.ts` line 9 validates `typeof email !== 'string'`, which the other routes do not (low risk for email since it's also validated at DB level, but good practice).

---

## Out of Scope

These are handled by NextAuth v5 and were not audited:

- CSRF protection on API routes and server actions
- Secure cookie flags (`httpOnly`, `Secure`, `SameSite=Lax`)
- JWT signing and verification (using `AUTH_SECRET`)
- OAuth state parameter validation (GitHub flow)
- Session token rotation
- OAuth `redirect_uri` / `callbackUrl` validation within the NextAuth OAuth flow itself
