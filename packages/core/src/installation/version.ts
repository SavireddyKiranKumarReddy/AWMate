declare global {
  const AWMATE_VERSION: string
  const AWMATE_CHANNEL: string
}

export const InstallationVersion = typeof AWMATE_VERSION === "string" ? AWMATE_VERSION : "local"
export const InstallationChannel = typeof AWMATE_CHANNEL === "string" ? AWMATE_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
