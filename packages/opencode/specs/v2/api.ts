// @ts-nocheck

import { AWMate } from "@awmate/core"
import { ReadTool } from "@awmate/core/tools"

const awmate = AWMate.make({})

awmate.tool.add(ReadTool)

awmate.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

awmate.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

awmate.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await awmate.session.create({
  agent: "build",
})

awmate.subscribe((event) => {
  console.log(event)
})

await awmate.session.prompt({
  sessionID,
  text: "hey what is up",
})

await awmate.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await awmate.session.wait()

console.log(await awmate.session.messages(sessionID))
