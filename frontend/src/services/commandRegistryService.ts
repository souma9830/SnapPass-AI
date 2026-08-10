import { CommandItem, CommandCategoryGroup } from '../types/commandPalette';

let registeredCommands: CommandItem[] = [];

export function registerCommand(command: CommandItem): void {
  if (!registeredCommands.some((c) => c.id === command.id)) {
    registeredCommands.push(command);
  }
}

export function getRegisteredCommands(): CommandItem[] {
  return registeredCommands;
}

export function groupCommandsByCategory(commands: CommandItem[]): CommandCategoryGroup[] {
  const groups: { [key: string]: CommandItem[] } = {};

  commands.forEach((cmd) => {
    if (!groups[cmd.category]) {
      groups[cmd.category] = [];
    }
    groups[cmd.category].push(cmd);
  });

  return Object.keys(groups).map((category) => ({
    category,
    commands: groups[category],
  }));
}
