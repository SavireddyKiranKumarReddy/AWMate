import { Match, Show, Switch, createMemo, type ComponentProps, type JSX } from "solid-js"
import { ProgressCircle } from "@awmate/ui/progress-circle"
import { ProgressCircleV2 } from "@awmate/ui/v2/progress-circle-v2"
import { Button } from "@awmate/ui/button"
import { IconButtonV2 } from "@awmate/ui/v2/icon-button-v2"
import { TooltipV2 } from "@awmate/ui/v2/tooltip-v2"

import { useSync } from "@/context/sync"
import { useLanguage } from "@/context/language"
import { useProviders } from "@/hooks/use-providers"
import { useSDK } from "@/context/sdk"
import { getSessionContext } from "@/components/session/session-context-metrics"
import { useSessionLayout } from "@/pages/session/session-layout"
import { MODEL_ACCESS } from "@/model-access"

interface SessionContextUsageProps {
  variant?: "button" | "indicator"
  buttonAppearance?: "default" | "v2"
  placement?: ComponentProps<typeof TooltipV2>["placement"]
}

export function SessionContextUsage(props: SessionContextUsageProps) {
  const sync = useSync()
  const language = useLanguage()
  const sdk = useSDK()
  const providers = useProviders(() => sdk().directory)
  const { params } = useSessionLayout()

  const variant = createMemo(() => props.variant ?? "button")
  const buttonAppearance = createMemo(() => props.buttonAppearance ?? "default")
  const messages = createMemo(() => (params.id ? (sync().data.message[params.id] ?? []) : []))

  const context = createMemo(() => getSessionContext(messages(), [...providers.all().values()]))

  const circle = () => (
    <div class="flex items-center justify-center">
      <ProgressCircle
        size={16}
        strokeWidth={2}
        percentage={context()?.usage ?? 0}
        style={
          variant() === "indicator"
            ? {
                "--progress-circle-background": "var(--v2-background-bg-layer-04, var(--border-weak-base))",
                "--progress-circle-background-overlay": "var(--v2-overlay-simple-overlay-pressed, transparent)",
                "--progress-circle-progress": "var(--v2-icon-icon-base, var(--icon-base))",
              }
            : undefined
        }
      />
    </div>
  )
  const circleV2 = () => (
    <div class="flex items-center justify-center">
      <ProgressCircleV2 percentage={context()?.usage ?? 0} />
    </div>
  )

  return (
    <Show when={params.id}>
      <TooltipV2 value={MODEL_ACCESS.deniedMessage} placement={props.placement ?? "top"} shift={-8}>
        <Switch>
          <Match when={variant() === "indicator"}>
            <div data-locked="true" class="cursor-not-allowed opacity-70">
              {circle()}
            </div>
          </Match>
          <Match when={buttonAppearance() === "v2"}>
            <div
              data-locked="true"
              class="flex h-7 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-[6px] px-1 opacity-70"
            >
              <IconButtonV2
                variant="ghost-muted"
                size="large"
                icon={circleV2()}
                aria-label={language.t("context.usage.view")}
                aria-disabled="true"
                tabIndex={-1}
              />
            </div>
          </Match>
          <Match when={true}>
            <Button
              type="button"
              variant="ghost"
              class="size-6 cursor-not-allowed opacity-70"
              aria-disabled="true"
              tabIndex={-1}
              aria-label={language.t("context.usage.view")}
            >
              {circle()}
            </Button>
          </Match>
        </Switch>
      </TooltipV2>
    </Show>
  )
}
