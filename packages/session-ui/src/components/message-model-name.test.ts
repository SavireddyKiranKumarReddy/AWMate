import { describe, expect, test } from "bun:test"
import { messageModelName } from "./message-model-name"

describe("messageModelName", () => {
  test("presents Big Pickle as AWMate", () => {
    expect(messageModelName("big-pickle", "Big Pickle")).toBe("AWMate")
  })

  test("preserves unrelated model names", () => {
    expect(messageModelName("claude-sonnet", "Claude Sonnet")).toBe("Claude Sonnet")
  })
})
