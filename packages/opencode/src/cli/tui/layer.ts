import { run as runTui, type TuiInput } from "@awmate/tui"
import { Global } from "@awmate/core/global"
import { AppNodeBuilder } from "@awmate/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
