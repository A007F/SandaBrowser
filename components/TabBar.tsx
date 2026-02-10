import React from 'react';
import { Tab, Language } from '../types';
import { X, Plus, ShieldCheck, Snowflake } from 'lucide-react';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onTabClick: (id: string) => void;
  onTabClose: (id: string, e: React.MouseEvent) => void;
  onNewTab: () => void;
  lang: Language;
}

export const TabBar: React.FC<TabBarProps> = ({ 
  tabs, 
  activeTabId, 
  onTabClick, 
  onTabClose, 
  onNewTab,
  lang
}) => {
  const isRtl = lang === 'ar';

  return (
    <div className={`flex items-end h-10 bg-gray-200 dark:bg-black px-2 gap-1 pt-1 overflow-x-auto select-none ${isRtl ? 'flex-row-reverse' : ''}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`
              group relative flex items-center justify-between min-w-[160px] max-w-[240px] h-full px-3 rounded-t-lg text-sm cursor-default transition-all duration-200
              ${isActive 
                ? 'bg-white dark:bg-dark-surface text-brand-600 dark:text-brand-400 shadow-[0_-1px_2px_rgba(0,0,0,0.05)] z-10' 
                : 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800'
              }
              ${tab.isFrozen && !isActive ? 'opacity-60 grayscale' : ''}
            `}
            role="button"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center gap-2 overflow-hidden w-full">
              {/* Favicon / Security Indicator */}
              <span className={`flex-shrink-0 ${isActive ? 'text-green-500' : 'text-gray-400'}`}>
                {tab.isLoading ? (
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : tab.isFrozen ? (
                    <Snowflake size={14} className="text-blue-400" />
                ) : (
                    <ShieldCheck size={14} />
                )}
              </span>
              <span className="truncate font-medium">{tab.title}</span>
            </div>
            
            <button
              onClick={(e) => onTabClose(tab.id, e)}
              className={`
                p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-1
                hover:bg-gray-200 dark:hover:bg-gray-700
                ${isActive ? 'opacity-100' : ''}
              `}
            >
              <X size={14} />
            </button>
            
            {/* Visual separator for inactive tabs */}
            {!isActive && (
               <div className={`absolute bottom-2 ${isRtl ? 'left-0' : 'right-0'} w-[1px] h-4 bg-gray-400/30 group-hover:hidden`} />
            )}
          </div>
        );
      })}
      
      <button
        onClick={onNewTab}
        className="flex items-center justify-center w-8 h-8 mb-0.5 rounded-lg text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
        title="New Tab"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};