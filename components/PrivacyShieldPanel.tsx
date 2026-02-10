import React, { useEffect, useRef } from 'react';
import { Shield, EyeOff, Zap, X, Fingerprint, Server, AlertTriangle, CheckCircle, Terminal, Activity } from 'lucide-react';
import { ShieldState, Language, LogLevel, SandaModule } from '../types';
import { TRANSLATIONS } from '../constants';

interface PrivacyShieldPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: ShieldState;
  onToggleStealth: () => void;
  lang: Language;
}

export const PrivacyShieldPanel: React.FC<PrivacyShieldPanelProps> = ({ 
  isOpen, 
  onClose, 
  state, 
  onToggleStealth,
  lang 
}) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (isOpen && logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.logs, isOpen]);
  
  if (!isOpen) return null;

  const Counter = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2 text-gray-400">
            <Icon size={14} className="text-neon-green" />
            <span className="text-xs">{label}</span>
        </div>
        <span className="text-xl font-mono font-bold text-white tabular-nums">{value}</span>
    </div>
  );

  const getLogColor = (level: LogLevel, module: SandaModule) => {
      if (module === SandaModule.RustCore) return 'text-[#DEA584]'; // Rust/Clay Color
      switch (level) {
          case LogLevel.Success: return 'text-[#00E676]'; // Neon Green
          case LogLevel.Danger: return 'text-red-500';
          case LogLevel.Warning: return 'text-orange-400';
          case LogLevel.Info: return 'text-blue-400';
          default: return 'text-gray-400';
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
            className={`
                relative w-[450px] bg-[#0a0a0a] rounded-2xl border border-[#00E676] overflow-hidden shadow-[0_0_40px_rgba(0,230,118,0.15)]
                ${isRtl ? 'font-arabic' : 'font-sans'} flex flex-col max-h-[85vh]
            `}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            {/* Header / Close */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
            >
                <X size={20} />
            </button>

            {/* Neon Shield Visual */}
            <div className="relative shrink-0 h-36 bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center border-b border-gray-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00E676]/10 to-transparent"></div>
                
                <div className="relative z-10 flex items-center gap-4">
                    <div className="p-3 rounded-full border border-[#00E676] shadow-[0_0_15px_#00E676] bg-black/50 backdrop-blur-md">
                        <Shield size={32} className="text-[#00E676] animate-pulse-fast" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[#00E676] font-bold text-lg tracking-wider uppercase shadow-[#00E676] drop-shadow-sm">{t.privacyShield}</h2>
                        <span className="text-[10px] text-gray-500 font-mono">Rust Core v0.1.0 • <span className="text-green-500">Active</span></span>
                    </div>
                </div>
            </div>

            {/* Content Scroll Area */}
            <div className="overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">
                
                {/* Threat Level Indicator */}
                <div className={`p-3 rounded-lg border flex items-center justify-between ${state.lastThreatLevel === 'None' ? 'bg-green-900/10 border-green-800/50' : 'bg-red-900/10 border-red-800/50'}`}>
                    <div className="flex items-center gap-3">
                         {state.lastThreatLevel === 'None' ? <CheckCircle size={18} className="text-green-500" /> : <AlertTriangle size={18} className="text-red-500" />}
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Current Threat Level</span>
                            <span className={`text-sm font-bold ${state.lastThreatLevel === 'None' ? 'text-green-400' : 'text-red-400'}`}>
                                {state.lastThreatLevel.toUpperCase()}
                            </span>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Counter icon={EyeOff} label={t.trackersBlocked} value={state.trackersBlockedSession} />
                    <Counter icon={Zap} label={t.cryptojacking} value={state.cryptojackingBlockedSession} />
                </div>

                {/* Stealth Mode Toggle */}
                <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${state.stealthMode ? 'bg-[#00E676]/20' : 'bg-gray-800'}`}>
                            <Fingerprint size={18} className={state.stealthMode ? 'text-[#00E676]' : 'text-gray-500'} />
                        </div>
                        <div>
                            <div className="font-bold text-gray-200 text-sm">{t.stealthMode}</div>
                            <div className="text-[10px] text-gray-500">Fingerprint Spoofer</div>
                        </div>
                    </div>
                    <button 
                        onClick={onToggleStealth}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${state.stealthMode ? 'bg-[#00E676]' : 'bg-gray-700'}`}
                    >
                         <div className={`absolute top-1 left-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${state.stealthMode ? 'translate-x-5' : ''}`} />
                    </button>
                </div>
                
                {/* Active Agent Info */}
                {state.stealthMode && (
                    <div className="text-[9px] font-mono text-gray-400 bg-black p-2 rounded border border-gray-800 break-all border-l-2 border-l-[#00E676]">
                        <span className="text-[#00E676] block mb-1">> {t.userAgent}:</span>
                        {state.currentUserAgent}
                    </div>
                )}

                {/* Smart Logs Terminal */}
                <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs">
                        <Terminal size={12} />
                        <span className="font-mono uppercase">Rust Core Logs (Live)</span>
                    </div>
                    <div className="h-40 bg-black rounded-lg border border-gray-800 p-2 overflow-y-auto font-mono text-[10px] space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
                        {state.logs.length === 0 && <div className="text-gray-600 italic">Listening for events...</div>}
                        {state.logs.map((log) => (
                            <div key={log.id} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <span className="text-gray-600 min-w-[50px]">[{log.timestamp}]</span>
                                <span className="text-gray-500 min-w-[80px]">[{log.module}]</span>
                                <span className={`${getLogColor(log.level, log.module)} truncate flex-1`}>
                                    -> {log.message}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};