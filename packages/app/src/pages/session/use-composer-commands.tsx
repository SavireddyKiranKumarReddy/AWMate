import { useCommand, type CommandOption } from "@/context/command"
import { useLanguage } from "@/context/language"
import { useLocal, type ModelSelection } from "@/context/local"
import { useSettings } from "@/context/settings"
import { MODEL_ACCESS } from "@/model-access"

const withCategory = (category: string) => {
  return (option: Omit<CommandOption, "category">): CommandOption => ({
    ...option,
    category,
  })
}

export const useComposerCommands = (_input: { model?: ModelSelection } = {}) => {
  const command = useCommand()
  const language = useLanguage()
  const local = useLocal()
  const settings = useSettings()
  const modelCommand = withCategory(language.t("command.category.model"))
  const agentCommand = withCategory(language.t("command.category.agent"))

  command.register("composer", () => [
    modelCommand({
      id: "model.choose",
      title: language.t("command.model.choose"),
      description: MODEL_ACCESS.deniedMessage,
      keybind: "mod+'",
      slash: "model",
      disabled: !MODEL_ACCESS.canSwitch,
      onSelect: () => {},
    }),
    modelCommand({
      id: "model.variant.cycle",
      title: language.t("command.model.variant.cycle"),
      description: language.t("command.model.variant.cycle.description"),
      keybind: "shift+mod+d",
      disabled: !MODEL_ACCESS.canSwitch,
      onSelect: () => {},
    }),
    agentCommand({
      id: "agent.cycle",
      title: language.t("command.agent.cycle"),
      description: language.t("command.agent.cycle.description"),
      keybind: "mod+.",
      slash: "agent",
      disabled: !settings.visibility.customAgents(),
      onSelect: () => local.agent.move(1),
    }),
    agentCommand({
      id: "agent.cycle.reverse",
      title: language.t("command.agent.cycle.reverse"),
      description: language.t("command.agent.cycle.reverse.description"),
      keybind: "shift+mod+.",
      disabled: !settings.visibility.customAgents(),
      onSelect: () => local.agent.move(-1),
    }),
  ])
}
