interface ImportMetaEnv {
  readonly AWMATE_CHANNEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module "virtual:awmate-server" {
  export namespace Server {
    export const listen: typeof import("../../../awmate/dist/types/src/node").Server.listen
    export type Listener = import("../../../awmate/dist/types/src/node").Server.Listener
  }
  export namespace Config {
    export const get: typeof import("../../../awmate/dist/types/src/node").Config.get
    export type Info = import("../../../awmate/dist/types/src/node").Config.Info
  }
  export const bootstrap: typeof import("../../../awmate/dist/types/src/node").bootstrap
}
