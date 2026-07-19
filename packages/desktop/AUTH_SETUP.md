# AWMate desktop Google authentication

The desktop app uses Supabase Google OAuth with PKCE. Google opens in the system browser and returns
to `awmate://auth/callback`. The desktop app never receives the Google password and contains only a
public Supabase publishable key.

## Supabase

1. Run the website migrations that create `profiles`, `access_grants`, `usage_events`, and
   `audit_events`.
2. Run `supabase/202607190003_desktop_access.sql` in the same Supabase project.
3. In **Authentication > URL Configuration**, add `awmate://auth/callback` to the redirect allow
   list. Keep the existing website callback as well.
4. Keep Google enabled under **Authentication > Providers**.

The `request_access()` function derives the user ID and email from the verified Supabase session. It
can create only a pending member grant and an audit record. It cannot approve, elevate, suspend, or
revoke an account.

## Local development

Copy `.env.example` to `.env.local` inside `packages/desktop` and replace the publishable-key
placeholder. Then run `bun run dev` from `packages/desktop`.

```env
VITE_SUPABASE_URL=https://gpdxgfrfxmbrjtiliwsn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_REAL_PUBLIC_KEY
```

Do not put `SUPABASE_SERVICE_ROLE_KEY`, an `sb_secret_...` key, or the Google client secret in the
desktop environment. Values prefixed with `VITE_` are bundled into the executable.

## GitHub desktop releases

Create these GitHub repository variables under **Settings > Secrets and variables > Actions >
Variables**:

- `AWMATE_SUPABASE_URL`
- `AWMATE_SUPABASE_PUBLISHABLE_KEY`

The release workflow injects them only while building the renderer. After releasing a new version,
test sign-in, pending access requests, approval, suspension, expiry, sign-out, and app restart.
