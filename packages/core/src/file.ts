export * as File from "./file"

import { Revert } from "@awmate/schema/revert"

export const Diff = Revert.FileDiff
export type Diff = typeof Diff.Type
