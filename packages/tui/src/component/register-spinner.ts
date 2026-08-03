import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registerAwmateSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
