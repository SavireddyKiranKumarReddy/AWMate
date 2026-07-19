export function collectAwmateDeepLinks(argv: string[]) {
  return argv.filter((arg) => arg.startsWith("awmate://"))
}

export function describeDeepLink(input: string) {
  try {
    const url = new URL(input)
    if (url.protocol !== "awmate:") return "invalid"
    return `${url.protocol}//${url.hostname}${url.pathname}`
  } catch {
    return "invalid"
  }
}
