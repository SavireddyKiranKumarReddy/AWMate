import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["AWMATE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["AWMATE_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("AWMATE_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  AWMATE_AUTO_HEAP_SNAPSHOT: truthy("AWMATE_AUTO_HEAP_SNAPSHOT"),
  AWMATE_GIT_BASH_PATH: process.env["AWMATE_GIT_BASH_PATH"],
  AWMATE_CONFIG: process.env["AWMATE_CONFIG"],
  AWMATE_CONFIG_CONTENT: process.env["AWMATE_CONFIG_CONTENT"],
  AWMATE_DISABLE_AUTOUPDATE: truthy("AWMATE_DISABLE_AUTOUPDATE"),
  AWMATE_ALWAYS_NOTIFY_UPDATE: truthy("AWMATE_ALWAYS_NOTIFY_UPDATE"),
  AWMATE_DISABLE_PRUNE: truthy("AWMATE_DISABLE_PRUNE"),
  AWMATE_DISABLE_TERMINAL_TITLE: truthy("AWMATE_DISABLE_TERMINAL_TITLE"),
  AWMATE_SHOW_TTFD: truthy("AWMATE_SHOW_TTFD"),
  AWMATE_DISABLE_AUTOCOMPACT: truthy("AWMATE_DISABLE_AUTOCOMPACT"),
  AWMATE_DISABLE_MODELS_FETCH: truthy("AWMATE_DISABLE_MODELS_FETCH"),
  AWMATE_DISABLE_MOUSE: truthy("AWMATE_DISABLE_MOUSE"),
  AWMATE_FAKE_VCS: process.env["AWMATE_FAKE_VCS"],
  AWMATE_SERVER_PASSWORD: process.env["AWMATE_SERVER_PASSWORD"],
  AWMATE_SERVER_USERNAME: process.env["AWMATE_SERVER_USERNAME"],
  AWMATE_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("AWMATE_DISABLE_FFF"),

  // Experimental
  AWMATE_EXPERIMENTAL_FILEWATCHER: Config.boolean("AWMATE_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  AWMATE_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("AWMATE_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  AWMATE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("AWMATE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  AWMATE_MODELS_URL: process.env["AWMATE_MODELS_URL"],
  AWMATE_MODELS_PATH: process.env["AWMATE_MODELS_PATH"],
  AWMATE_DB: process.env["AWMATE_DB"],

  AWMATE_WORKSPACE_ID: process.env["AWMATE_WORKSPACE_ID"],
  AWMATE_EXPERIMENTAL_WORKSPACES: enabledByExperimental("AWMATE_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get AWMATE_DISABLE_PROJECT_CONFIG() {
    return truthy("AWMATE_DISABLE_PROJECT_CONFIG")
  },
  get AWMATE_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("AWMATE_EXPERIMENTAL_REFERENCES")
  },
  get AWMATE_TUI_CONFIG() {
    return process.env["AWMATE_TUI_CONFIG"]
  },
  get AWMATE_CONFIG_DIR() {
    return process.env["AWMATE_CONFIG_DIR"]
  },
  get AWMATE_PURE() {
    return truthy("AWMATE_PURE")
  },
  get AWMATE_PERMISSION() {
    return process.env["AWMATE_PERMISSION"]
  },
  get AWMATE_PLUGIN_META_FILE() {
    return process.env["AWMATE_PLUGIN_META_FILE"]
  },
  get AWMATE_CLIENT() {
    return process.env["AWMATE_CLIENT"] ?? "cli"
  },
}
