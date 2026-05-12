'use client';

import React, { useRef, useCallback } from 'react';

export interface Tab {
  id: string;
  label: string;
  href?: string;
}

export interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function TabNavigation({ tabs, activeTab, onChange }: TabNavigationProps) {
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (currentIndex === -1) return;

      let nextIndex: number | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (nextIndex !== null) {
        event.preventDefault();
        const nextTab = tabs[nextIndex];
        onChange(nextTab.id);
        const tabElement = tabListRef.current?.querySelector(
          `[data-tab-id="${nextTab.id}"]`
        ) as HTMLElement | null;
        tabElement?.focus();
      }
    },
    [tabs, activeTab, onChange]
  );

  const handleTabClick = (tabId: string) => {
    onChange(tabId);
  };

  return (
    <div role="tablist" className="flex border-b border-zinc-200 dark:border-zinc-800">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <a
            key={tab.id}
            role="tab"
            data-tab-id={tab.id}
            href={tab.href || '#'}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(tab.id);
            }}
            onKeyDown={handleKeyDown}
            className={`
              px-4 py-3 text-sm font-medium transition-colors
              ${
                isActive
                  ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }
            `}
          >
            {tab.label}
          </a>
        );
      })}
    </div>
  );
}

export default TabNavigation;