export * from "./client.js"
export * from "./server.js"

import { createAWMateClient } from "./client.js"
import { createAWMateServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createAWMate(options?: ServerOptions) {
  const server = await createAWMateServer({
    ...options,
  })

  const client = createAWMateClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
