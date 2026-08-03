import { A } from "@solidjs/router"
import { base64Encode } from "@awmate/core/util/encode"
import { Button } from "@awmate/ui/button"
import { Icon } from "@awmate/ui/icon"
import { IconButton } from "@awmate/ui/icon-button"
import { createEffect, createMemo, For, Show, type Accessor, type JSX } from "solid-js"
import { type LocalProject } from "@/context/layout"
import { useServerSync } from "@/context/server-sync"
import { SessionItem } from "./sidebar-items"
import { displayName, sortedRootSessions } from "./helpers"
import { type ProjectSidebarContext } from "./sidebar-project"

const ProjectChats = (props: {
  project: LocalProject
  ctx: ProjectSidebarContext
  sortNow: Accessor<number>
  mobile?: boolean
}): JSX.Element => {
  const serverSync = useServerSync()
  const directories = createMemo(() => props.ctx.workspaceIds(props.project))
  const groups = createMemo(() =>
    directories().map((directory) => {
      const [store] = serverSync().child(directory, { bootstrap: false })
      return {
        directory,
        sessions: sortedRootSessions(store, props.sortNow()),
      }
    }),
  )
  const empty = createMemo(() => groups().every((group) => group.sessions.length === 0))
  const selected = createMemo(() => props.ctx.currentProject()?.worktree === props.project.worktree)

  createEffect(() => {
    directories().forEach((directory) => serverSync().child(directory, { bootstrap: true }))
  })

  return (
    <section data-component="sidebar-chat-folder" data-project={base64Encode(props.project.worktree)}>
      <div
        classList={{
          "group/folder flex items-center gap-1 rounded-md transition-colors": true,
          "bg-surface-base-active": selected(),
          "hover:bg-surface-raised-base-hover": !selected(),
        }}
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left"
          onClick={() => props.ctx.navigateToProject(props.project.worktree)}
        >
          <span class="flex size-6 shrink-0 items-center justify-center">
            <Icon name="folder" size="small" class="text-icon-base" />
          </span>
          <span class="min-w-0 flex-1 truncate text-14-medium text-text-strong">{displayName(props.project)}</span>
        </button>
        <A
          href={`/${base64Encode(props.project.worktree)}/session`}
          class="mr-1 flex size-6 shrink-0 items-center justify-center rounded-md text-icon-base opacity-0 transition-opacity hover:bg-surface-base-hover focus-visible:opacity-100 group-hover/folder:opacity-100"
          aria-label={`New chat in ${displayName(props.project)}`}
        >
          <Icon name="plus-small" size="small" />
        </A>
      </div>

      <div class="ml-6 mt-0.5 flex flex-col">
        <Show when={!empty()} fallback={<div class="px-2 py-1 text-12-regular text-text-weak">No chats yet</div>}>
          <For each={groups()}>
            {(group) => (
              <For each={group.sessions}>
                {(session) => (
                  <SessionItem
                    {...props.ctx.sessionProps}
                    session={session}
                    list={group.sessions}
                    slug={base64Encode(group.directory)}
                    mobile={props.mobile}
                    dense
                  />
                )}
              </For>
            )}
          </For>
        </Show>
      </div>
    </section>
  )
}

export const ChatsSidebar = (props: {
  projects: Accessor<LocalProject[]>
  ctx: ProjectSidebarContext
  sortNow: Accessor<number>
  mobile?: boolean
  onNewChat: () => void
  onOpenProject: () => void
}): JSX.Element => (
  <div class="flex size-full min-h-0 flex-col bg-background-base">
    <div class="shrink-0 px-3 pb-2 pt-3">
      <div class="flex items-center gap-2 px-2 py-1.5">
        <Icon name="speech-bubble" size="small" class="text-icon-base" />
        <h2 class="min-w-0 flex-1 truncate text-16-medium text-text-strong">Chats</h2>
      </div>
      <Button variant="ghost" class="mt-1 w-full justify-start px-2" onClick={props.onNewChat}>
        <Icon name="edit" size="small" />
        New chat
      </Button>
    </div>

    <div class="flex min-h-0 flex-1 flex-col">
      <div class="flex shrink-0 items-center justify-between px-5 pb-1 pt-3">
        <span class="text-12-medium text-text-weak">Folders</span>
        <IconButton
          icon="folder-add-left"
          variant="ghost"
          class="size-6 rounded-md"
          aria-label="Open folder"
          onClick={props.onOpenProject}
        />
      </div>
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-3 pb-4 no-scrollbar">
        <For each={props.projects()}>
          {(project) => (
            <ProjectChats project={project} ctx={props.ctx} sortNow={props.sortNow} mobile={props.mobile} />
          )}
        </For>
        <Show when={props.projects().length === 0}>
          <div class="px-2 py-3 text-14-regular text-text-weak">Open a folder to start a chat.</div>
        </Show>
      </div>
    </div>
  </div>
)
