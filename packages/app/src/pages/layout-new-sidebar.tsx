import type { Session } from "@awmate/sdk/v2/client"
import { ButtonV2 } from "@awmate/ui/v2/button-v2"
import { DialogFooter, DialogHeader, DialogTitleGroup, DialogV2 } from "@awmate/ui/v2/dialog-v2"
import { Icon as IconV2 } from "@awmate/ui/v2/icon"
import { IconButtonV2 } from "@awmate/ui/v2/icon-button-v2"
import { MenuV2 } from "@awmate/ui/v2/menu-v2"
import { TooltipV2 } from "@awmate/ui/v2/tooltip-v2"
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js"
import { produce } from "solid-js/store"
import { getFilename } from "@awmate/core/util/path"
import { useDialog } from "@awmate/ui/context/dialog"
import { notifySessionTabsRemoved } from "@/components/titlebar-session-events"
import { useDirectoryPicker } from "@/components/directory-picker"
import { useGlobal, type ServerCtx } from "@/context/global"
import { useLayout, type LocalProject } from "@/context/layout"
import { useLanguage } from "@/context/language"
import { ServerConnection, useServer } from "@/context/server"
import { type ServerSync } from "@/context/server-sync"
import { useTabs } from "@/context/tabs"
import { displayName, homeProjectDirectories, sortedRootSessions } from "@/pages/layout/helpers"
import { formatServerError } from "@/utils/server-errors"
import { sessionTitle } from "@/utils/session-title"
import { showToast } from "@/utils/toast"

type ProjectEntry = {
  server: ServerConnection.Any
  serverKey: ServerConnection.Key
  sync: ServerSync
  sdk: ServerCtx["sdk"]
  projects: ServerCtx["projects"]
  project: LocalProject
}

const sessionsForProject = (entry: ProjectEntry) =>
  [entry.project.worktree, ...(entry.project.sandboxes ?? [])]
    .flatMap((directory) => sortedRootSessions(entry.sync.child(directory, { bootstrap: false })[0], Date.now()))
    .sort((a, b) => (b.time.updated ?? b.time.created) - (a.time.updated ?? a.time.created))

function collectSessionBranch(session: Session, sessions: Session[]) {
  const removed = new Set<string>([session.id])
  const byParent = new Map<string, string[]>()
  for (const item of sessions) {
    if (!item.parentID) continue
    const existing = byParent.get(item.parentID)
    if (existing) {
      existing.push(item.id)
      continue
    }
    byParent.set(item.parentID, [item.id])
  }
  const stack = [session.id]
  while (stack.length) {
    const parentID = stack.pop()
    if (!parentID) continue
    for (const child of byParent.get(parentID) ?? []) {
      if (removed.has(child)) continue
      removed.add(child)
      stack.push(child)
    }
  }
  return removed
}

const InlineRename = (props: {
  value: string
  class?: string
  onSubmit: (next: string) => void
  onCancel: () => void
}) => {
  const [draft, setDraft] = createSignal(props.value)
  let input: HTMLInputElement | undefined
  let blurFrame: number | undefined
  let cancelled = false
  let blurEnabled = false

  createEffect(() => {
    setDraft(props.value)
  })

  createEffect(() => {
    if (!input) return
    input.focus()
    input.select()
    blurEnabled = false
    if (blurFrame !== undefined) cancelAnimationFrame(blurFrame)
    blurFrame = requestAnimationFrame(() => {
      blurFrame = undefined
      blurEnabled = true
    })
  })

  onCleanup(() => {
    if (blurFrame !== undefined) cancelAnimationFrame(blurFrame)
  })

  const save = () => {
    if (cancelled || !blurEnabled) return
    const next = draft().trim()
    if (next && next !== props.value) props.onSubmit(next)
    else props.onCancel()
  }

  return (
    <input
      ref={input}
      type="text"
      value={draft()}
      onInput={(e) => setDraft(e.currentTarget.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== "Escape") return
        e.preventDefault()
        e.stopPropagation()
        if (e.key === "Escape") {
          cancelled = true
          props.onCancel()
          return
        }
        save()
      }}
      onMouseDown={(e) => e.stopPropagation()}
      class={props.class}
    />
  )
}

const SessionRow = (props: {
  entry: ProjectEntry
  session: Session
  active: boolean
  onOpen: () => void
  onRename: (next: string) => void
  onDelete: () => void
}) => {
  const language = useLanguage()
  const [editing, setEditing] = createSignal(false)

  return (
    <MenuV2.Context>
      <MenuV2.Context.Trigger as="div">
        <div
          class="group/row flex h-7 min-w-0 items-center rounded-[6px] transition-colors"
          classList={{
            "bg-v2-background-bg-layer-03": props.active,
            "hover:bg-v2-background-bg-layer-01": !props.active,
          }}
        >
          {editing() ? (
            <InlineRename
              value={sessionTitle(props.session.title) || props.session.id}
              class="mx-2 min-w-0 flex-1 bg-transparent p-0 text-[13px] leading-4 outline-none [font-weight:530]"
              onSubmit={(next) => {
                setEditing(false)
                props.onRename(next)
              }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <>
              <button
                type="button"
                data-component="v2-chat-history-row"
                data-session-id={props.session.id}
                class="min-w-0 flex-1 truncate px-2 text-left text-[13px] transition-colors"
                classList={{
                  "text-v2-text-text-base [font-weight:530]": props.active,
                  "text-v2-text-text-faint hover:text-v2-text-text-base [font-weight:440]": !props.active,
                }}
                onClick={props.onOpen}
              >
                {sessionTitle(props.session.title) || props.session.id}
              </button>
              <MenuV2>
                <MenuV2.Trigger
                  as="div"
                  class="mr-1 opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
                >
                  <IconButtonV2
                    data-action="v2-session-more"
                    variant="ghost-muted"
                    size="small"
                    icon={<IconV2 name="outline-dots" />}
                    aria-label={language.t("common.moreOptions")}
                  />
                </MenuV2.Trigger>
                <MenuV2.Portal>
                  <MenuV2.Content>
                    <MenuV2.Item onSelect={() => setEditing(true)}>{language.t("common.rename")}</MenuV2.Item>
                    <MenuV2.Item onSelect={props.onDelete}>{language.t("common.delete")}</MenuV2.Item>
                  </MenuV2.Content>
                </MenuV2.Portal>
              </MenuV2>
            </>
          )}
        </div>
      </MenuV2.Context.Trigger>
      <MenuV2.Context.Portal>
        <MenuV2.Context.Content>
          <MenuV2.Item onSelect={() => setEditing(true)}>{language.t("common.rename")}</MenuV2.Item>
          <MenuV2.Item onSelect={props.onDelete}>{language.t("common.delete")}</MenuV2.Item>
        </MenuV2.Context.Content>
      </MenuV2.Context.Portal>
    </MenuV2.Context>
  )
}

const ProjectFolder = (props: {
  entry: ProjectEntry
  sessions: Session[]
  activeSessionID?: string
  selected: boolean
  onSelect: () => void
  onNewChat: () => void
  onOpenSession: (session: Session) => void
  onRename: (next: string) => void
  onRemove: () => void
  onRenameSession: (session: Session, next: string) => void
  onDeleteSession: (session: Session) => void
}) => {
  const language = useLanguage()
  const [renaming, setRenaming] = createSignal(false)

  return (
    <section data-component="v2-chat-folder" data-directory={props.entry.project.worktree}>
      <MenuV2.Context>
        <MenuV2.Context.Trigger as="div">
          <div
            classList={{
              "group/folder flex h-8 min-w-0 items-center rounded-[6px] transition-colors": true,
              "bg-v2-background-bg-layer-03 text-v2-text-text-base": props.selected,
              "text-v2-text-text-muted hover:bg-v2-background-bg-layer-01 hover:text-v2-text-text-base":
                !props.selected,
            }}
          >
            {renaming() ? (
              <InlineRename
                value={displayName(props.entry.project)}
                class="mx-2 min-w-0 flex-1 bg-transparent p-0 text-[13px] leading-4 outline-none [font-weight:530]"
                onSubmit={(next) => {
                  setRenaming(false)
                  props.onRename(next)
                }}
                onCancel={() => setRenaming(false)}
              />
            ) : (
              <>
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
                <MenuV2>
                  <MenuV2.Trigger
                    as="div"
                    class="mr-1 opacity-0 group-hover/folder:opacity-100 focus-visible:opacity-100"
                  >
                    <IconButtonV2
                      data-action="v2-folder-more"
                      variant="ghost-muted"
                      size="small"
                      icon={<IconV2 name="outline-dots" />}
                      aria-label={language.t("common.moreOptions")}
                    />
                  </MenuV2.Trigger>
                  <MenuV2.Portal>
                    <MenuV2.Content>
                      <MenuV2.Item onSelect={() => setRenaming(true)}>{language.t("common.rename")}</MenuV2.Item>
                      <MenuV2.Item onSelect={props.onRemove}>
                        {language.t("sidebar.project.remove")}
                      </MenuV2.Item>
                    </MenuV2.Content>
                  </MenuV2.Portal>
                </MenuV2>
              </>
            )}
          </div>
        </MenuV2.Context.Trigger>
        <MenuV2.Context.Portal>
          <MenuV2.Context.Content>
            <MenuV2.Item onSelect={() => setRenaming(true)}>{language.t("common.rename")}</MenuV2.Item>
            <MenuV2.Item onSelect={props.onRemove}>{language.t("sidebar.project.remove")}</MenuV2.Item>
          </MenuV2.Context.Content>
        </MenuV2.Context.Portal>
      </MenuV2.Context>
      <div class="ml-7 flex min-w-0 flex-col gap-px">
        <For each={props.sessions}>
          {(session) => (
            <SessionRow
              entry={props.entry}
              session={session}
              active={props.activeSessionID === session.id}
              onOpen={() => props.onOpenSession(session)}
              onRename={(next) => props.onRenameSession(session, next)}
              onDelete={() => props.onDeleteSession(session)}
            />
          )}
        </For>
        <Show when={props.sessions.length === 0}>
          <div class="h-7 truncate px-2 py-1 text-[12px] text-v2-text-text-faint">No chats yet</div>
        </Show>
      </div>
    </section>
  )
}

export function NewLayoutSidebar() {
  const global = useGlobal()
  const layout = useLayout()
  const tabs = useTabs()
  const server = useServer()
  const language = useLanguage()
  const dialog = useDialog()
  const pickDirectory = useDirectoryPicker()

  const entries = createMemo(() =>
    global.servers.list().flatMap((conn) => {
      const ctx = global.ensureServerCtx(conn)
      return ctx.projects.list().map((project) => ({
        server: conn,
        serverKey: ServerConnection.key(conn),
        sync: ctx.sync,
        sdk: ctx.sdk,
        projects: ctx.projects,
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

  const renameSession = (entry: ProjectEntry, session: Session, next: string) => {
    const current = sessionTitle(session.title)
    if (!next || next === current) return
    entry.sdk
      .createClient({ directory: session.directory, throwOnError: true })
      .session.update({ sessionID: session.id, title: next })
      .catch((err) => {
        showToast({
          title: language.t("common.requestFailed"),
          description: formatServerError(err, language.t, language.t("common.requestFailed")),
        })
      })
  }

  const deleteSession = async (entry: ProjectEntry, session: Session) => {
    const [store, setStore] = entry.sync.child(session.directory, { bootstrap: false })
    const removed = collectSessionBranch(session, store.session ?? [])

    const result = await entry.sdk
      .createClient({ directory: session.directory, throwOnError: true })
      .session.delete({ sessionID: session.id })
      .then((x) => x.data)
      .catch((err) => {
        showToast({
          title: language.t("session.delete.failed.title"),
          description: formatServerError(err, language.t, language.t("common.requestFailed")),
        })
        return false
      })

    if (!result) return false

    setStore(
      "session",
      produce((draft) => {
        for (let i = draft.length - 1; i >= 0; i--) {
          if (removed.has(draft[i].id)) draft.splice(i, 1)
        }
      }),
    )
    for (const id of removed) {
      entry.sync.session.evict(id)
    }
    notifySessionTabsRemoved({ server: entry.serverKey, directory: session.directory, sessionIDs: [...removed] })
    return true
  }

  const confirmDeleteSession = (entry: ProjectEntry, session: Session) => {
    const title = sessionTitle(session.title) || session.id
    dialog.show(() => (
      <DialogV2 fit>
        <DialogHeader hideClose>
          <DialogTitleGroup
            title={language.t("session.delete.title")}
            description={language.t("session.delete.confirm", { name: title })}
          />
        </DialogHeader>
        <DialogFooter>
          <ButtonV2 variant="ghost" onClick={() => dialog.close()}>
            {language.t("common.cancel")}
          </ButtonV2>
          <ButtonV2
            variant="danger"
            onClick={() => {
              void deleteSession(entry, session).then((ok) => {
                if (ok) dialog.close()
              })
            }}
          >
            {language.t("session.delete.button")}
          </ButtonV2>
        </DialogFooter>
      </DialogV2>
    ))
  }

  const renameProject = async (entry: ProjectEntry, next: string) => {
    const project = entry.project
    const current = displayName(project)
    if (next === current) return
    const name = next === getFilename(project.worktree) ? "" : next

    if (project.id && project.id !== "global") {
      await entry.sdk.client.project
        .update({ projectID: project.id, directory: project.worktree, name })
        .catch((err) => {
          showToast({
            title: language.t("common.requestFailed"),
            description: formatServerError(err, language.t, language.t("common.requestFailed")),
          })
        })
      return
    }

    entry.sync.project.meta(project.worktree, { name })
  }

  const removeProject = (entry: ProjectEntry) => {
    const selection = selected()
    entry.projects.close(entry.project.worktree)
    if (selection.server !== entry.serverKey || selection.directory !== entry.project.worktree) return
    const next = entries().find(
      (item) => item.serverKey !== entry.serverKey || item.project.worktree !== entry.project.worktree,
    )
    layout.home.setSelection(
      next ? { server: next.serverKey, directory: next.project.worktree } : { server: entry.serverKey },
    )
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
                  onRename={(next) => void renameProject(entry, next)}
                  onRemove={() => removeProject(entry)}
                  onRenameSession={(session, next) => renameSession(entry, session, next)}
                  onDeleteSession={(session) => confirmDeleteSession(entry, session)}
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
