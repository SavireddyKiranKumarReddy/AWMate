import { registerCustomTheme } from "@pierre/diffs"
import { AWMateTheme } from "./marked-theme"

let registered = false

export function registerAWMateTheme() {
  if (registered) return
  registered = true
  registerCustomTheme("AWMate", () => Promise.resolve(AWMateTheme))
}
