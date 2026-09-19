import { getComponentCatalogue } from "@opentui/solid/components"
import { registerSpinner } from "opentui-spinner/solid"

export function registerAWMateSpinner() {
  if (!getComponentCatalogue().spinner) registerSpinner()
}
