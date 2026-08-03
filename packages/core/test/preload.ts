import path from "path"

process.env.AWMATE_DB = ":memory:"
process.env.AWMATE_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.AWMATE_DISABLE_MODELS_FETCH = "true"
