import type { Session, User } from "@supabase/supabase-js"
import { createSignal, onCleanup, onMount, Show, type ParentProps } from "solid-js"
import {
  desktopAuthCallback,
  desktopAuthConfig,
  getDesktopAuthClient,
  isActiveAccess,
  loadAccessGrant,
  parseDesktopAuthCallback,
  takePendingAuthCallbacks,
  verifySession,
  type AccessGrant,
} from "./auth"

type State =
  | { kind: "loading"; label: string }
  | { kind: "signed-out" }
  | { kind: "waiting" }
  | { kind: "blocked"; user: User; grant: AccessGrant | null }
  | { kind: "active"; user: User; grant: AccessGrant }
  | { kind: "error"; message: string }
  | { kind: "unconfigured" }

const supportUrl = "https://awmate.nxtgensec.org/contact"

export function DesktopAuthGate(props: ParentProps) {
  const [state, setState] = createSignal<State>(
    desktopAuthConfig.configured ? { kind: "loading", label: "Verifying your account" } : { kind: "unconfigured" },
  )
  let session: Session | null = null
  let revision = 0

  const applySession = async (next: Session | null, label = "Verifying your account") => {
    const current = ++revision
    session = next
    if (!next) {
      setState({ kind: "signed-out" })
      return
    }

    setState({ kind: "loading", label })
    const supabase = getDesktopAuthClient()
    const user = await verifySession(supabase, next)
    const grant = await loadAccessGrant(supabase, user)
    if (current !== revision) return
    if (isActiveAccess(grant)) {
      setState({ kind: "active", user, grant: grant! })
      return
    }
    setState({ kind: "blocked", user, grant })
  }

  const refresh = async () => {
    if (!session) return
    await applySession(session, "Checking your AWMate access")
  }

  const handleCallback = async (input: string) => {
    const callback = parseDesktopAuthCallback(input)
    if (!callback) return
    if ("error" in callback) {
      setState({ kind: "error", message: callback.error })
      return
    }

    setState({ kind: "loading", label: "Completing secure sign in" })
    const result = await getDesktopAuthClient().auth.exchangeCodeForSession(callback.code)
    if (result.error) throw result.error
    await applySession(result.data.session, "Checking your AWMate access")
  }

  const handleCallbacks = (urls: string[]) => {
    const callback = urls.find((item) => parseDesktopAuthCallback(item))
    if (!callback) return
    void handleCallback(callback).catch((error: Error) => setState({ kind: "error", message: error.message }))
  }

  onMount(() => {
    if (!desktopAuthConfig.configured) return
    const supabase = getDesktopAuthClient()
    const auth = supabase.auth.onAuthStateChange((_event, next) => {
      if (next?.access_token === session?.access_token) return
      queueMicrotask(() => {
        void applySession(next).catch((error: Error) => setState({ kind: "error", message: error.message }))
      })
    })
    const deepLink = (event: Event) => {
      const detail = (event as CustomEvent<{ urls?: string[] }>).detail
      const urls = detail.urls ?? []
      handleCallbacks(urls)
      if (!window.__AWMATE__) return
      window.__AWMATE__.deepLinks = (window.__AWMATE__.deepLinks ?? []).filter(
        (item) => !urls.includes(item) || !parseDesktopAuthCallback(item),
      )
    }
    const focus = () => {
      const current = state()
      if (current.kind !== "active" && current.kind !== "blocked") return
      void refresh().catch((error: Error) => setState({ kind: "error", message: error.message }))
    }

    window.addEventListener("awmate:deep-link", deepLink)
    window.addEventListener("focus", focus)
    handleCallbacks(takePendingAuthCallbacks())
    void supabase.auth.getSession().then((result) => {
      if (result.error) {
        setState({ kind: "error", message: result.error.message })
        return
      }
      void applySession(result.data.session).catch((error: Error) =>
        setState({ kind: "error", message: error.message }),
      )
    })

    onCleanup(() => {
      auth.data.subscription.unsubscribe()
      window.removeEventListener("awmate:deep-link", deepLink)
      window.removeEventListener("focus", focus)
    })
  })

  const signIn = async () => {
    setState({ kind: "loading", label: "Opening Google sign in" })
    const result = await getDesktopAuthClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: desktopAuthCallback,
        skipBrowserRedirect: true,
        queryParams: { prompt: "select_account" },
      },
    })
    if (result.error) throw result.error
    if (!result.data.url) throw new Error("Google sign in did not return an authorization URL.")
    window.api.openLink(result.data.url)
    setState({ kind: "waiting" })
  }

  const requestAccess = async () => {
    setState({ kind: "loading", label: "Sending your access request" })
    const result = await getDesktopAuthClient().rpc("request_access")
    if (result.error) throw result.error
    await refresh()
  }

  const signOut = async () => {
    revision++
    session = null
    const result = await getDesktopAuthClient().auth.signOut()
    if (result.error) throw result.error
    setState({ kind: "signed-out" })
  }

  return (
    <Show
      when={state().kind === "active"}
      fallback={
        <AuthScreen state={state()} signIn={signIn} requestAccess={requestAccess} refresh={refresh} signOut={signOut} />
      }
    >
      {props.children}
    </Show>
  )
}

function AuthScreen(props: {
  state: State
  signIn: () => Promise<void>
  requestAccess: () => Promise<void>
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}) {
  const [actionError, setActionError] = createSignal<string | null>(null)
  const run = (action: () => Promise<void>) => {
    setActionError(null)
    void action().catch((error: Error) => setActionError(error.message))
  }

  const blockedTitle = () => {
    if (props.state.kind !== "blocked") return ""
    if (!props.state.grant) return "Access approval required"
    if (props.state.grant.status === "pending") return "Your request is pending"
    if (props.state.grant.status === "suspended") return "Your access is suspended"
    if (props.state.grant.status === "revoked") return "Your access was revoked"
    return "Your access has expired"
  }

  return (
    <main class="relative flex h-dvh w-screen items-center justify-center overflow-hidden bg-background-base px-6 text-text-strong">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.07),transparent_36%)]" />
      <section class="relative w-full max-w-[440px] rounded-2xl border border-border-weak-base bg-surface-base p-8 shadow-2xl">
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-xl border border-border-weak-base bg-surface-raised-base text-16-bold">
            AW
          </div>
          <div>
            <p class="text-16-bold">AWMate</p>
            <p class="text-12-regular text-text-weak">Your assistive workmate - Powered by NxtGenSec</p>
          </div>
        </div>

        <Show when={props.state.kind === "signed-out" || props.state.kind === "waiting"}>
          <h1 class="mt-8 text-24-bold">Sign in to continue</h1>
          <p class="mt-3 text-14-regular leading-6 text-text-base">
            Use the Google account approved for AWMate. Your password is entered only on Google's secure page.
          </p>
          <button
            type="button"
            class="mt-7 flex h-11 w-full items-center justify-center gap-3 rounded-lg bg-text-strong px-4 text-14-medium text-background-base transition-opacity hover:opacity-90"
            onClick={() => run(props.signIn)}
          >
            <GoogleMark />
            {props.state.kind === "waiting" ? "Open Google sign in again" : "Continue with Google"}
          </button>
          <Show when={props.state.kind === "waiting"}>
            <p class="mt-4 text-center text-12-regular text-text-weak">
              Complete sign in in your browser. AWMate will reopen automatically.
            </p>
          </Show>
        </Show>

        <Show when={props.state.kind === "loading"}>
          <div class="py-14 text-center">
            <div class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-border-weak-base border-t-text-strong" />
            <p class="mt-5 text-14-medium">{props.state.kind === "loading" ? props.state.label : "Loading"}</p>
          </div>
        </Show>

        <Show when={props.state.kind === "blocked"}>
          <h1 class="mt-8 text-24-bold">{blockedTitle()}</h1>
          <p class="mt-3 text-14-regular leading-6 text-text-base">
            Signed in as{" "}
            <span class="text-text-strong">{props.state.kind === "blocked" ? props.state.user.email : ""}</span>. An
            AWMate administrator must activate this account before the workspace can open.
          </p>
          <Show when={props.state.kind === "blocked" && !props.state.grant}>
            <button
              type="button"
              class="mt-7 h-11 w-full rounded-lg bg-text-strong px-4 text-14-medium text-background-base hover:opacity-90"
              onClick={() => run(props.requestAccess)}
            >
              Request access
            </button>
          </Show>
          <div class="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="h-10 rounded-lg border border-border-weak-base text-13-medium hover:bg-surface-raised-base"
              onClick={() => run(props.refresh)}
            >
              Check again
            </button>
            <button
              type="button"
              class="h-10 rounded-lg border border-border-weak-base text-13-medium hover:bg-surface-raised-base"
              onClick={() => run(props.signOut)}
            >
              Use another account
            </button>
          </div>
          <button
            type="button"
            class="mt-5 w-full text-center text-12-regular text-text-weak underline hover:text-text-strong"
            onClick={() => window.api.openLink(supportUrl)}
          >
            Contact AWMate support
          </button>
        </Show>

        <Show when={props.state.kind === "error" || props.state.kind === "unconfigured"}>
          <h1 class="mt-8 text-24-bold">Authentication unavailable</h1>
          <p class="mt-3 text-14-regular leading-6 text-text-base">
            {props.state.kind === "error"
              ? props.state.message
              : "This AWMate build is missing its Supabase public URL or publishable key."}
          </p>
          <button
            type="button"
            class="mt-7 h-10 w-full rounded-lg border border-border-weak-base text-13-medium hover:bg-surface-raised-base"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </Show>

        <Show when={actionError()}>
          {(message) => (
            <div class="mt-5 rounded-lg border border-icon-critical-base/30 bg-surface-critical-base p-3 text-12-regular text-text-critical-base">
              {message()}
            </div>
          )}
        </Show>
        <p class="mt-7 text-center text-11-regular text-text-weaker">
          Secure Google authentication - AWMate Beta access controls
        </p>
      </section>
    </main>
  )
}

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" class="h-4 w-4">
      <path
        fill="#4285F4"
        d="M21.6 12.2c0-.7-.1-1.5-.2-2.2H12v4.3h5.4a4.6 4.6 0 0 1-2 3v2.8h3.4c2-1.9 2.8-4.6 2.8-7.9Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 5-.9 6.8-2.4l-3.4-2.7c-.9.6-2.1 1-3.4 1a6 6 0 0 1-5.6-4.1H3v2.9A10.2 10.2 0 0 0 12 22Z"
      />
      <path fill="#FBBC05" d="M6.4 13.8a6 6 0 0 1 0-3.7V7.2H3a10.2 10.2 0 0 0 0 9.4l3.4-2.8Z" />
      <path fill="#EA4335" d="M12 6c1.6 0 3 .6 4.2 1.7l3.1-3.1A10.3 10.3 0 0 0 3 7.2l3.4 2.9A6 6 0 0 1 12 6Z" />
    </svg>
  )
}
