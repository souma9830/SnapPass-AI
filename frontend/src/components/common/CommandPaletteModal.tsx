import React, { useState, useEffect, useMemo } from 'react';
import { CommandItem } from '../../types/commandPalette';
import { getRegisteredCommands, groupCommandsByCategory } from '../../services/commandRegistryService';
import styles from './CommandPaletteModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  commands?: CommandItem[];
}

export const CommandPaletteModal: React.FC<Props> = ({ isOpen, onClose, commands }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const allCommands = commands || getRegisteredCommands();

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;
    return allCommands.filter(
      (cmd) =>
        cmd.title.toLowerCase().includes(query.toLowerCase()) ||
        cmd.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [allCommands, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const grouped = groupCommandsByCategory(filteredCommands);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  let globalIdx = 0;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Command Palette">
      <div className={styles.container}>
        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Type a command or search... (Ctrl+K)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <span className={styles.escBadge}>ESC</span>
        </div>

        <div className={styles.commandList}>
          {filteredCommands.length === 0 ? (
            <div className={styles.emptyState}>No matching commands found.</div>
          ) : (
            grouped.map((group) => (
              <div key={group.category} className={styles.groupSection}>
                <div className={styles.groupHeader}>{group.category}</div>
                {group.commands.map((cmd) => {
                  const isSelected = globalIdx === selectedIndex;
                  const currentIdx = globalIdx;
                  globalIdx++;

                  return (
                    <div
                      key={cmd.id}
                      className={`${styles.commandItem} ${isSelected ? styles.selectedItem : ''}`}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(currentIdx)}
                    >
                      <div className={styles.cmdLeft}>
                        <span>{cmd.iconEmoji}</span>
                        <span>{cmd.title}</span>
                      </div>
                      {cmd.hotkey && <span className={styles.hotkeyBadge}>{cmd.hotkey}</span>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
