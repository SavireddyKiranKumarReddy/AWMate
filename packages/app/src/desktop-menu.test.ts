import { describe, expect, test } from "bun:test"
import { DESKTOP_MENU } from "./desktop-menu"

describe("desktop menu", () => {
  test("exports logs through the desktop command registry", () => {
    const items = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).filter(
      (item) => item.type === "item" && item.label === "Export Logs...",
    )

    expect(items).toHaveLength(2)
    expect(items.every((item) => item.type === "item" && item.command === "logs.export" && !item.action)).toBe(true)
  })

  test("opens documentation on the AWMate website", () => {
    const item = DESKTOP_MENU.flatMap((menu) => menu.items ?? []).find(
      (item) => item.type === "item" && item.label === "AWMate Documentation",
    )

    expect(item).toMatchObject({ href: "https://ai.awmate.nxtgensec.org/docs" })
  })

  test("does not offer a toggle for the fixed chats sidebar", () => {
    const items = DESKTOP_MENU.flatMap((menu) => menu.items ?? [])

    expect(items.some((item) => item.type === "item" && item.command === "sidebar.toggle")).toBe(false)
  })
})
