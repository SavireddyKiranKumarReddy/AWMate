import { AgentV2 } from "@awmate/core/agent"
import { AISDK } from "@awmate/core/aisdk"
import { Catalog } from "@awmate/core/catalog"
import { CommandV2 } from "@awmate/core/command"
import { Credential } from "@awmate/core/credential"
import { AppNodeBuilder } from "@awmate/core/effect/app-node-builder"
import { LayerNodePlatform } from "@awmate/core/effect/app-node-platform"
import { LayerNode } from "@awmate/core/effect/layer-node"
import { EventV2 } from "@awmate/core/event"
import { FileSystem } from "@awmate/core/filesystem"
import { FSUtil } from "@awmate/core/fs-util"
import { Integration } from "@awmate/core/integration"
import { Location } from "@awmate/core/location"
import { Npm } from "@awmate/core/npm"
import { PluginV2 } from "@awmate/core/plugin"
import { Reference } from "@awmate/core/reference"
import { SkillV2 } from "@awmate/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
