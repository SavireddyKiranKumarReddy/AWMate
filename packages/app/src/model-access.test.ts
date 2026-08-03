import { describe, expect, test } from "bun:test"
import { MODEL_ACCESS } from "./model-access"

describe("model access", () => {
  test("keeps the model selector branded and locked", () => {
    expect(MODEL_ACCESS).toEqual({
      displayName: "AWMate",
      deniedMessage: "Available after beta",
      canSwitch: false,
    })
  })
})
