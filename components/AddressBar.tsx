import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X, Search, Lock, ShieldAlert, Star, Smartphone, SmartphoneNfc, Cookie, Cpu, Download, Languages, ShieldCheck, Activity, Shield } from 'lucide-react';
import { Language, Tab, ShieldState } from '../types'; // Added ShieldState
import { TRANSLATIONS } from '../constants';

interface AddressBarProps {
  activeTab: Tab;
  onNavigate: (url: string) => void;
  onRefresh: () => void;
  lang: Language;
  isSecure: boolean;
  isMobileMode: boolean;
  onToggleMobile: () => void;
  showAnnoyanceCrushed: boolean;
  onToggleServoDebug: () => void;
  showServoDebug: boolean;
  onInstallPWA: () => void;
  onToggleShield: () => void;
  shieldState: ShieldState; // New Prop
}

export const AddressBar: React.FC<AddressBarProps> = ({ 
  activeTab, 
  onNavigate, 
  onRefresh, 
  lang,
  isSecure,
  isMobileMode,
  onToggleMobile,
  showAnnoyanceCrushed,
  onToggleServoDebug,
  showServoDebug,
  onInstallPWA,
  onToggleShield,
  shieldState
}) => {
  const t = TRANSLATIONS[lang];
  const [inputValue, setInputValue] = useState(activeTab.url);
  const isRtl = lang === 'ar';

  useEffect(() => {
    setInputValue(activeTab.url);
  }, [activeTab.url]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let url = inputValue.trim();
      if (!url.includes('://') && !url.startsWith('browser://')) {
        if (url.includes('.') && !url.includes(' ')) {
           url = `https://${url}`;
        } else {
           url = `https://search.muhafiz.privacy?q=${encodeURIComponent(url)}`;
        }
      }
      onNavigate(url);
    }
  };

  const engineLabel = activeTab.engine === 'webf' ? 'WebF' : 'Rust';
  
  // Calculate total blocked for this session (simulating the Flutter Widget logic)
  const blockedCount = shieldState.adsBlockedSession + shieldState.trackersBlockedSession + shieldState.cryptojackingBlockedSession;
  const isProtected = activeTab.securityScore > 80;

  return (
    <div className="h-12 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center px-4 gap-2 shadow-sm z-20 relative">
      <div className={`flex items-center gap-1 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors">
          {isRtl ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-30 transition-colors">
            {isRtl ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
        </button>
        <button 
            onClick={onRefresh}
            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ${activeTab.isLoading ? 'animate-spin' : ''}`}
        >
          {activeTab.isLoading ? <X size={18} /> : <RotateCw size={18} />}
        </button>
      </div>

      <div className="flex-1 max-w-4xl mx-auto">
        <div 
          className={`
            relative flex items-center w-full h-9 bg-gray-100 dark:bg-dark-bg rounded-full border border-transparent 
            focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:bg-white dark:focus-within:bg-black transition-all
          `}
        >
          {/* Neon Shield Chip Trigger (Flutter PrivacyShieldWidget) */}
          <div className={`flex items-center justify-center pl-2 pr-1 h-full gap-1 border-r border-gray-200 dark:border-gray-700 mx-1 ${isRtl ? 'border-l border-r-0 pl-1 pr-2' : ''}`}>
             <button 
                onClick={onToggleShield}
                className={`
                    flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300
                    ${isProtected 
                        ? 'bg-neon-green/10 border-neon-green text-neon-green hover:bg-neon-green/20' 
                        : 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'}
                `}
                title={t.privacyShield}
             >
                 <Shield size={14} className={isProtected ? 'fill-neon-green/20' : ''} />
                 <span className="text-[10px] font-bold font-mono">
                    {t.blocked}: {blockedCount}
                 </span>
             </button>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            placeholder={t.searchOrUrl}
            className={`
                w-full h-full bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 px-2
                ${isRtl ? 'text-right' : 'text-left'}
            `}
            dir="ltr" 
          />
          
          {isRtl && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 mx-1 bg-gray-200 dark:bg-gray-800 rounded text-[10px] text-gray-500 dark:text-gray-400 font-arabic select-none">
                  <Languages size={12} />
                  <span>عربي</span>
              </div>
          )}
            
            {showAnnoyanceCrushed && (
                <div className="flex items-center gap-1 px-2 py-0.5 mr-1 bg-brand-100 dark:bg-brand-900 rounded-md text-xs font-medium text-brand-700 dark:text-brand-300 animate-pulse select-none">
                    <Cookie size={12} />
                    <span>Crushed</span>
                </div>
            )}
            
            {!activeTab.url.startsWith('browser://') && (
                <button 
                    onClick={onInstallPWA}
                    className="flex items-center gap-1 px-2 py-1 mx-1 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                >
                    <Download size={14} />
                </button>
            )}

            <button 
                onClick={onToggleServoDebug}
                className={`
                    flex items-center gap-1 px-2 mx-1 py-0.5 rounded-full border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all
                    ${showServoDebug ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}
                `}
            >
                <Activity size={12} />
                <span className="text-[10px] font-mono font-bold uppercase">{engineLabel}</span>
            </button>

          <div className="flex items-center px-2 gap-1">
             <button 
                onClick={onToggleMobile}
                className={`p-1 rounded-full transition-colors ${isMobileMode ? 'text-brand-500 bg-brand-100 dark:bg-brand-900/50' : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
             >
                <Smartphone size={16} />
             </button>
             <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-yellow-400 transition-colors">
                <Star size={14} />
             </button>
          </div>
        </div>
      </div>

       <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/30">
                P
            </div>
       </div>
    </div>
  );
};