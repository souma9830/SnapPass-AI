export interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Editor' | 'Exports' | 'Settings';
  hotkey?: string;
  iconEmoji: string;
  action: () => void;
}

export interface CommandCategoryGroup {
  category: string;
  commands: CommandItem[];
}
