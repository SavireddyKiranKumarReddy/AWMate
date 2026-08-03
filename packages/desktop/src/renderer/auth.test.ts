import { describe, expect, test } from "bun:test"
import { isActiveAccess, parseDesktopAuthCallback, type AccessGrant } from "./auth"

const grant = (input: Partial<AccessGrant> = {}): AccessGrant => ({
  id: "grant",
  user_id: "user",
  email: "person@example.com",
  role: "member",
  status: "active",
  daily_request_limit: null,
  monthly_token_limit: null,
  approved_at: null,
  expires_at: null,
  ...input,
})

describe("desktop auth callback", () => {
  test("accepts only the AWMate auth callback", () => {
    expect(parseDesktopAuthCallback("awmate://auth/callback?code=abc")).toEqual({ code: "abc" })
    expect(parseDesktopAuthCallback("awmate://open-project?code=abc")).toBeUndefined()
    expect(parseDesktopAuthCallback("https://example.com/auth/callback?code=abc")).toBeUndefined()
  })

  test("returns provider errors safely", () => {
    expect(parseDesktopAuthCallback("awmate://auth/callback?error_description=Access%20denied")).toEqual({
      error: "Access denied",
    })
  })
})

describe("desktop access", () => {
  test("requires an active, unexpired grant", () => {
    expect(isActiveAccess(grant())).toBe(true)
    expect(isActiveAccess(grant({ status: "pending" }))).toBe(false)
    expect(isActiveAccess(grant({ status: "suspended" }))).toBe(false)
    expect(isActiveAccess(grant({ status: "revoked" }))).toBe(false)
    expect(isActiveAccess(grant({ expires_at: "2026-01-01T00:00:00.000Z" }), Date.UTC(2026, 1, 1))).toBe(false)
  })
})
