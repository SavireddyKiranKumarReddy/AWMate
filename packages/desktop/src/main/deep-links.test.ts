import { describe, expect, test } from "bun:test"
import { collectAwmateDeepLinks, describeDeepLink } from "./deep-links"

describe("main process deep links", () => {
  test("collects AWMate protocol arguments", () => {
    expect(collectAwmateDeepLinks(["AWMate.exe", "--flag", "awmate://auth/callback?code=secret"])).toEqual([
      "awmate://auth/callback?code=secret",
    ])
  })

  test("removes query values from logs", () => {
    expect(describeDeepLink("awmate://auth/callback?code=secret")).toBe("awmate://auth/callback")
    expect(describeDeepLink("awmate://open-project?directory=C%3A%5Cprivate")).toBe("awmate://open-project")
  })
})
