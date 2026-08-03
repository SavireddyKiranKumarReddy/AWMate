import type { Session } from "@awmate/sdk/v2/client"
import { ButtonV2 } from "@awmate/ui/v2/button-v2"
import { Icon as IconV2 } from "@awmate/ui/v2/icon"
import { IconButtonV2 } from "@awmate/ui/v2/icon-button-v2"
import { TooltipV2 } from "@awmate/ui/v2/tooltip-v2"
import { createEffect, createMemo, For, Show } from "solid-js"
import { useDirectoryPicker } from "@/components/directory-picker"
import { useGlobal } from "@/context/global"
import { useLayout, type LocalProject } from "@/context/layout"
import { useLanguage } from "@/context/language"
import { ServerConnection, useServer } from "@/context/server"
import { type ServerSync } from "@/context/server-sync"
import { useTabs } from "@/context/tabs"
import { displayName, homeProjectDirectories, sortedRootSessions } from "@/pages/layout/helpers"
import { sessionTitle } from "@/utils/session-title"

type ProjectEntry = {
  server: ServerConnection.Any
  serverKey: ServerConnection.Key
  sync: ServerSync
  project: LocalProject
}

const sessionsForProject = (entry: ProjectEntry) =>
  [entry.project.worktree, ...(entry.project.sandboxes ?? [])]
    .flatMap((directory) => sortedRootSessions(entry.sync.child(directory, { bootstrap: false })[0], Date.now()))
    .sort((a, b) => (b.time.updated ?? b.time.created) - (a.time.updated ?? a.time.created))

const ProjectFolder = (props: {
  entry: ProjectEntry
  sessions: Session[]
  activeSessionID?: string
  selected: boolean
  onSelect: () => void
  onNewChat: () => void
  onOpenSession: (session: Session) => void
}) => (
  <section data-component="v2-chat-folder" data-directory={props.entry.project.worktree}>
    <div
      classList={{
        "group/folder flex h-8 min-w-0 items-center rounded-[6px] transition-colors": true,
        "bg-v2-background-bg-layer-03 text-v2-text-text-base": props.selected,
        "text-v2-text-text-muted hover:bg-v2-background-bg-layer-01 hover:text-v2-text-text-base": !props.selected,
      }}
    >
      <button type="button" class="flex min-w-0 flex-1 items-center gap-2 px-2" onClick={props.onSelect}>
        <IconV2 name="folder" size="small" />
        <span class="min-w-0 flex-1 truncate text-left text-[13px] [font-weight:530]">
          {displayName(props.entry.project)}
        </span>
      </button>
      <TooltipV2 placement="right" value="New chat">
        <IconButtonV2
          data-action="v2-folder-new-chat"
          variant="ghost-muted"
          size="small"
          class="mr-1 opacity-0 group-hover/folder:opacity-100 focus-visible:opacity-100"
          icon={<IconV2 name="edit" />}
          aria-label={`New chat in ${displayName(props.entry.project)}`}
          onClick={props.onNewChat}
        />
      </TooltipV2>
    </div>
    <div class="ml-7 flex min-w-0 flex-col gap-px">
      <For each={props.sessions}>
        {(session) => (
          <button
            type="button"
            data-component="v2-chat-history-row"
            data-session-id={session.id}
            classList={{
              "flex h-7 min-w-0 items-center rounded-[6px] px-2 text-left text-[13px] transition-colors": true,
              "bg-v2-background-bg-layer-03 text-v2-text-text-base [font-weight:530]":
                props.activeSessionID === session.id,
              "text-v2-text-text-faint hover:bg-v2-background-bg-layer-01 hover:text-v2-text-text-base [font-weight:440]":
                props.activeSessionID !== session.id,
            }}
            onClick={() => props.onOpenSession(session)}
          >
            <span class="min-w-0 flex-1 truncate">{sessionTitle(session.title) || session.id}</span>
          </button>
        )}
      </For>
      <Show when={props.sessions.length === 0}>
        <div class="h-7 truncate px-2 py-1 text-[12px] text-v2-text-text-faint">No chats yet</div>
      </Show>
    </div>
  </section>
)

export function NewLayoutSidebar() {
  const global = useGlobal()
  const layout = useLayout()
  const tabs = useTabs()
  const server = useServer()
  const language = useLanguage()
  const pickDirectory = useDirectoryPicker()

  const entries = createMemo(() =>
    global.servers.list().flatMap((conn) => {
      const ctx = global.ensureServerCtx(conn)
      return ctx.projects.list().map((project) => ({
        server: conn,
        serverKey: ServerConnection.key(conn),
        sync: ctx.sync,
        project,
      }))
    }),
  )
  const activeSessionID = createMemo(() => {
    const route = layout.route()
    if (route.type !== "session") return
    return route.sessionId
  })
  const selected = createMemo(() => layout.home.selection())
  const activeEntry = createMemo(() => {
    const active = activeSessionID()
    if (active) {
      const match = entries().find((entry) => sessionsForProject(entry).some((session) => session.id === active))
      if (match) return match
    }
    const selection = selected()
    return (
      entries().find(
        (entry) => entry.serverKey === selection.server && entry.project.worktree === selection.directory,
      ) ?? entries()[0]
    )
  })

  createEffect(() => {
    entries().forEach((entry) => {
      ;[entry.project.worktree, ...(entry.project.sandboxes ?? [])].forEach((directory) => {
        void entry.sync.project.loadSessions(directory, { limit: 64 })
      })
    })
  })

  const newChat = (entry = activeEntry()) => {
    if (!entry) {
      openFolder()
      return
    }
    layout.home.setSelection({ server: entry.serverKey, directory: entry.project.worktree })
    tabs.newDraft({ server: entry.serverKey, directory: entry.project.worktree }, "")
  }

  const openFolder = () => {
    const conn =
      global.servers.list().find((item) => ServerConnection.key(item) === server.key) ?? global.servers.list()[0]
    if (!conn) return
    pickDirectory({
      server: conn,
      title: language.t("command.project.open"),
      multiple: true,
      onSelect: (result) => {
        const directories = homeProjectDirectories(result)
        if (directories.length === 0) return
        const ctx = global.ensureServerCtx(conn)
        directories.forEach(ctx.projects.open)
        ctx.projects.touch(directories[0]!)
        layout.home.setSelection({ server: ServerConnection.key(conn), directory: directories[0] })
      },
    })
  }

  return (
    <aside
      class="hidden w-[292px] shrink-0 flex-col border-r border-v2-border-border-muted bg-v2-background-bg-deep md:flex"
      aria-label="Chats and history"
    >
      <div class="shrink-0 px-3 pb-2 pt-4">
        <div class="px-2 pb-2 text-[14px] text-v2-text-text-base [font-weight:600]">Chats</div>
        <ButtonV2
          data-action="v2-sidebar-new-chat"
          variant="ghost-muted"
          size="normal"
          icon="edit"
          class="w-full justify-start"
          onClick={() => newChat()}
        >
          New chat
        </ButtonV2>
      </div>

      <div class="flex min-h-0 flex-1 flex-col">
        <div class="flex h-8 shrink-0 items-center justify-between px-5 text-[12px] text-v2-text-text-muted [font-weight:530]">
          <span>Folders</span>
          <TooltipV2 placement="right" value={language.t("home.project.add")}>
            <IconButtonV2
              data-action="v2-sidebar-open-folder"
              variant="ghost-muted"
              size="small"
              icon={<IconV2 name="folder-add-left" />}
              aria-label={language.t("home.project.add")}
              onClick={openFolder}
            />
          </TooltipV2>
        </div>
        <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-4">
          <For each={entries()}>
            {(entry) => {
              const sessions = createMemo(() => sessionsForProject(entry))
              const isSelected = () => {
                const current = activeEntry()
                return current?.serverKey === entry.serverKey && current.project.worktree === entry.project.worktree
              }
              return (
                <ProjectFolder
                  entry={entry}
                  sessions={sessions()}
                  activeSessionID={activeSessionID()}
                  selected={isSelected()}
                  onSelect={() =>
                    layout.home.setSelection({ server: entry.serverKey, directory: entry.project.worktree })
                  }
                  onNewChat={() => newChat(entry)}
                  onOpenSession={(session) => {
                    const tab = tabs.addSessionTab({ server: entry.serverKey, sessionId: session.id })
                    tabs.select(tab)
                  }}
                />
              )
            }}
          </For>
          <Show when={entries().length === 0}>
            <button
              type="button"
              class="flex h-8 items-center gap-2 rounded-[6px] px-2 text-left text-[13px] text-v2-text-text-muted hover:bg-v2-background-bg-layer-01"
              onClick={openFolder}
            >
              <IconV2 name="folder-add-left" size="small" />
              Open folder
            </button>
          </Show>
        </div>
      </div>

      <div class="flex shrink-0 flex-col gap-1 border-t border-v2-border-border-muted p-3">
        <TooltipV2 placement="top" value="Available after beta">
          <ButtonV2
            data-action="v2-sidebar-settings"
            data-locked="true"
            aria-disabled="true"
            tabIndex={-1}
            variant="ghost-muted"
            size="normal"
            icon="settings-gear"
            class="w-full cursor-not-allowed justify-start opacity-70"
          >
            {language.t("sidebar.settings")}
          </ButtonV2>
        </TooltipV2>
      </div>
    </aside>
  )
}
