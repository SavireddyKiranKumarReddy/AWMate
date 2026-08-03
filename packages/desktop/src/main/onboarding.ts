import { app } from "electron"
import { getStore } from "./store"
import { FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY } from "./store-keys"
import { write as writeLog } from "./logging"

export function isFirstLaunchOnboardingPending() {
  const pending = getStore().get(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY) !== true
  writeLog("onboarding", "first launch onboarding pending checked", { pending })
  return pending
}

export async function finishFirstLaunchOnboarding(_createDefaultProject: boolean) {
  if (!isFirstLaunchOnboardingPending()) {
    writeLog("onboarding", "first launch onboarding already completed")
    return null
  }

  // Do not create or open a default project on first launch.
  getStore().set(FIRST_LAUNCH_ONBOARDING_COMPLETE_KEY, true)
  writeLog("onboarding", "first launch onboarding completed", { createDefaultProject: false })
  return null
}
