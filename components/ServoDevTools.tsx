import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Cpu, Layers, Activity, Zap, Terminal, RefreshCw } from 'lucide-react';

interface ServoDevToolsProps {
  lang: Language;
  onCrashTest: () => void;
}

export const ServoDevTools: React.FC<ServoDevToolsProps> = ({ lang, onCrashTest }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';
  const [threads, setThreads] = useState<number[]>([12, 45, 23, 89]);

  // Simulate active threads fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
        setThreads(prev => prev.map(() => Math.floor(Math.random() * 100)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`
        fixed bottom-10 ${isRtl ? 'right-20' : 'left-20'} w-80 bg-black/90 text-green-400 font-mono text-xs rounded-xl border border-green-900/50 shadow-2xl backdrop-blur-md z-40 overflow-hidden
        animate-in slide-in-from-bottom duration-300
    `}>
        {/* Header */}
        <div className="flex items-center justify-between p-2 bg-green-900/20 border-b border-green-900/50">
            <div className="flex items-center gap-2">
                <Cpu size={14} />
                <span className="font-bold">Servo (Rust) Internals</span>
            </div>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
            
            {/* Parallel Layout Simulation */}
            <div>
                <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Layers size={12} />
                    <span>{t.parallelLayout} (Stylo)</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-12">
                    {threads.map((load, i) => (
                        <div key={i} className="relative bg-green-900/30 rounded overflow-hidden">
                            <div 
                                className="absolute bottom-0 left-0 w-full bg-green-500/50 transition-all duration-300"
                                style={{ height: `${load}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white">
                                T{i+1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Webrender Display List */}
            <div>
                 <div className="flex items-center gap-2 mb-2 text-gray-400">
                    <Activity size={12} />
                    <span>{t.displayList}</span>
                </div>
                <div className="h-24 overflow-y-auto bg-black rounded p-2 text-[10px] leading-tight opacity-80 scrollbar-thin scrollbar-thumb-green-900">
                    <div className="text-purple-400">DisplayListBuilder::begin()</div>
                    <div className="pl-2 text-blue-300">PushStackingContext(opacity: 1.0)</div>
                    <div className="pl-4 text-yellow-300">CreateBlobImage(600x400)</div>
                    <div className="pl-4 text-white">DrawText("Sanda Browser")</div>
                    <div className="pl-4 text-gray-500">... clipped 14 items</div>
                    <div className="pl-2 text-blue-300">PopStackingContext</div>
                    <div className="text-purple-400">DisplayListBuilder::end() -> GPU</div>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-green-900/50 flex justify-between items-center">
                <span className="text-gray-500">Mem: Safe (Ownership)</span>
                <button 
                    onClick={onCrashTest}
                    className="flex items-center gap-1 px-2 py-1 bg-red-900/20 text-red-400 hover:bg-red-900/40 rounded border border-red-900/50 transition-colors"
                >
                    <Zap size={10} />
                    Test Panic
                </button>
            </div>
        </div>
    </div>
  );
};