import React from 'react';
import { Workspace, Language } from '../types';
import { Briefcase, Coffee, Code, Zap, Plus } from 'lucide-react';

interface WorkspaceRailProps {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSwitch: (id: string) => void;
  lang: Language;
}

export const WorkspaceRail: React.FC<WorkspaceRailProps> = ({ 
  workspaces, 
  activeWorkspaceId, 
  onSwitch,
  lang 
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase': return <Briefcase size={20} />;
      case 'coffee': return <Coffee size={20} />;
      case 'code': return <Code size={20} />;
      case 'zap': return <Zap size={20} />;
      default: return <Zap size={20} />;
    }
  };

  return (
    <div className="w-16 h-full bg-gray-50 dark:bg-black border-r border-l border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 gap-4 z-30">
        {workspaces.map((ws) => {
            const isActive = ws.id === activeWorkspaceId;
            return (
                <div key={ws.id} className="relative group">
                    <button
                        onClick={() => onSwitch(ws.id)}
                        className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                            ${isActive 
                                ? `${ws.color} text-white shadow-lg scale-110` 
                                : 'bg-white dark:bg-gray-800 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }
                        `}
                    >
                        {getIcon(ws.icon)}
                    </button>
                    {/* Tooltip */}
                    <div className={`
                        absolute top-2 ${lang === 'ar' ? 'right-12' : 'left-12'} px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50
                    `}>
                        {ws.name}
                    </div>
                </div>
            );
        })}
        
        <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700 my-2" />
        
        <button className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:border-gray-400 transition-colors">
            <Plus size={18} />
        </button>
    </div>
  );
};