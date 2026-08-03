export function messageModelName(modelID: string, name: string) {
  const model = `${modelID} ${name}`.toLowerCase()
  if (model.includes("big-pickle") || model.includes("big pickle")) return "AWMate"
  return name
}
