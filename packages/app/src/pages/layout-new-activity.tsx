import type { ToolPart } from "@awmate/sdk/v2/client"
import { createEffect, createMemo, For, on, onCleanup, Show } from "solid-js"
import { useGlobal, type ServerCtx } from "@/context/global"
import { useLayout } from "@/context/layout"
import { ServerConnection, useServer } from "@/context/server"
import { sessionTitle } from "@/utils/session-title"

type ActivityTarget = {
  context: ServerCtx
  sessionID: string
}

const toolLabel = (tool: string) => {
  if (["bash", "shell", "terminal"].includes(tool)) return "Command"
  if (["read", "list", "glob"].includes(tool)) return "Reading files"
  if (["grep", "search"].includes(tool)) return "Searching project"
  if (["edit", "write", "apply_patch"].includes(tool)) return "Updating files"
  if (tool === "task") return "Background task"
  if (tool === "webfetch") return "Fetching information"
  return tool.replaceAll(/[-_]/g, " ").replace(/^./, (value) => value.toUpperCase())
}

const activityTitle = (part: ToolPart) => {
  if ((part.state.status === "running" || part.state.status === "completed") && part.state.title?.trim()) {
    return part.state.title.trim()
  }
  return toolLabel(part.tool)
}

const activityDetail = (part: ToolPart) => {
  const input = part.state.input
  const value = ["command", "path", "filePath", "pattern", "query", "description", "url"]
    .map((key) => input[key])
    .find((item) => typeof item === "string" && item.trim())
  if (typeof value !== "string") return
  return value.trim()
}

const statusLabel = (status: ToolPart["state"]["status"]) => {
  if (status === "pending") return "Queued"
  if (status === "running") return "Running"
  if (status === "completed") return "Completed"
  return "Failed"
}

const ActivityItem = (props: { part: ToolPart }) => (
  <div class="relative min-w-0 max-w-full border-l border-v2-border-border-muted pb-4 pl-4 last:pb-0">
    <span
      classList={{
        "absolute -left-[5px] top-1.5 size-2 rounded-full ring-4 ring-v2-background-bg-deep": true,
        "bg-v2-icon-icon-muted": props.part.state.status === "pending",
        "animate-pulse bg-v2-icon-icon-info": props.part.state.status === "running",
        "bg-v2-icon-icon-success": props.part.state.status === "completed",
        "bg-v2-icon-icon-critical": props.part.state.status === "error",
      }}
    />
    <div class="min-w-0 truncate text-[13px] text-v2-text-text-base [font-weight:530]">{activityTitle(props.part)}</div>
    <Show when={activityDetail(props.part)}>
      {(detail) => (
        <div class="mt-0.5 line-clamp-2 min-w-0 break-all font-mono text-[11px] leading-4 text-v2-text-text-faint">
          {detail()}
        </div>
      )}
    </Show>
    <div
      classList={{
        "mt-1 text-[11px]": true,
        "text-v2-text-text-faint": ["pending", "completed"].includes(props.part.state.status),
        "text-v2-text-text-info": props.part.state.status === "running",
        "text-v2-text-text-critical": props.part.state.status === "error",
      }}
    >
      {statusLabel(props.part.state.status)}
    </div>
  </div>
)

export function NewLayoutActivity() {
  const global = useGlobal()
  const layout = useLayout()
  const server = useServer()
  let scrollRef!: HTMLDivElement
  let scrollFrame: number | undefined

  const target = createMemo<ActivityTarget | undefined>(() => {
    const route = layout.route()
    if (route.type !== "session") return
    const key = route.server ?? server.key
    const conn = global.servers.list().find((item) => ServerConnection.key(item) === key)
    if (!conn) return
    return { context: global.ensureServerCtx(conn), sessionID: route.sessionId }
  })
  const activity = createMemo(() => {
    const current = target()
    if (!current) return []
    return (current.context.sync.session.data.message[current.sessionID] ?? [])
      .flatMap((message) => current.context.sync.session.data.part[message.id] ?? [])
      .filter((part): part is ToolPart => part.type === "tool")
      .slice(-40)
  })
  const session = createMemo(() => {
    const current = target()
    if (!current) return
    return current.context.sync.session.data.info[current.sessionID]
  })
  const working = createMemo(() => {
    const current = target()
    if (!current) return false
    return current.context.sync.session.data.session_working(current.sessionID)
  })

  createEffect(() => {
    const current = target()
    if (!current) return
    void current.context.sync.session.sync(current.sessionID, { messageLimit: 80 })
  })

  createEffect(
    on(
      () =>
        activity()
          .map((part) => `${part.id}:${part.state.status}`)
          .join("|"),
      () => {
        if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = undefined
          scrollRef.scrollTop = scrollRef.scrollHeight
        })
      },
    ),
  )

  onCleanup(() => {
    if (scrollFrame !== undefined) cancelAnimationFrame(scrollFrame)
  })

  return (
    <aside
      data-component="v2-live-activity"
      class="hidden w-1/5 min-w-[280px] shrink-0 flex-col border-l border-v2-border-border-muted bg-v2-background-bg-deep xl:flex"
      aria-label="Live background activity"
    >
      <div class="shrink-0 border-b border-v2-border-border-muted px-5 py-4">
        <div class="flex items-center justify-between gap-3">
          <div class="text-[14px] text-v2-text-text-base [font-weight:600]">Live activity</div>
          <div class="flex items-center gap-1.5 text-[11px] text-v2-text-text-muted">
            <span
              classList={{
                "size-2 rounded-full": true,
                "animate-pulse bg-v2-icon-icon-info": working(),
                "bg-v2-icon-icon-muted": !working(),
              }}
            />
            {working() ? "Working" : "Idle"}
          </div>
        </div>
        <div class="mt-1 truncate text-[12px] text-v2-text-text-faint">
          {sessionTitle(session()?.title) ?? "Background work transparency"}
        </div>
      </div>

      <div ref={scrollRef} class="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5 py-5" data-scrollable>
        <Show
          when={target()}
          fallback={
            <div class="rounded-[8px] border border-v2-border-border-muted bg-v2-background-bg-layer-01 p-4 text-[12px] leading-5 text-v2-text-text-muted">
              Open a chat to see its background work here.
            </div>
          }
        >
          <Show
            when={activity().length > 0}
            fallback={
              <div class="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <span
                  classList={{
                    "size-2 rounded-full": true,
                    "animate-pulse bg-v2-icon-icon-info": working(),
                    "bg-v2-icon-icon-muted": !working(),
                  }}
                />
                <div class="text-[13px] text-v2-text-text-muted">
                  {working() ? "Analyzing your request…" : "No background activity yet"}
                </div>
              </div>
            }
          >
            <div class="flex min-w-0 flex-col">
              <For each={activity()}>{(part) => <ActivityItem part={part} />}</For>
            </div>
          </Show>
        </Show>
      </div>

      <div class="shrink-0 border-t border-v2-border-border-muted px-5 py-3 text-[11px] leading-4 text-v2-text-text-faint">
        Commands, file operations, searches, and background tasks appear here in real time.
      </div>
    </aside>
  )
}
