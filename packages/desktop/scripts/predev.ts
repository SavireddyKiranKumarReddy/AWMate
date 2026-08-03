import { $ } from "bun"

await $`bun ./scripts/copy-icons.ts ${process.env.AWMATE_CHANNEL ?? "dev"}`

await $`cd ../awmate && bun script/build-node.ts`
