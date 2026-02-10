import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { BrowserSettings, Language, Tab, Workspace, ShieldState, SecurityLogEntry } from '../types';
import { DEFAULT_SETTINGS, DEFAULT_WORKSPACES, DEFAULT_SHIELD_STATE } from '../constants';
import { RustCoreBridge } from '../core/RustBridge'; 

interface BrowserContextType {
  tabs: Tab[]; 
  activeWorkspaceTabs: Tab[]; 
  activeTabId: string;
  activeWorkspaceId: string;
  workspaces: Workspace[];
  settings: BrowserSettings;
  shieldState: ShieldState; 
  language: Language;
  isMobileMode: boolean;
  isPiPActive: boolean;
  pipTabId: string | null;
  showAnnoyanceCrushed: boolean;
  isShieldOpen: boolean; 
  
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  setActiveWorkspace: (id: string) => void;
  updateTabUrl: (id: string, url: string) => void;
  updateSetting: (key: keyof BrowserSettings, value: any) => void;
  toggleLanguage: () => void;
  wakeTab: (id: string) => void;
  toggleMobileMode: () => void;
  closePiP: () => void;
  toggleServoDebug: () => void;
  crashTab: (id: string) => void;
  recoverTab: (id: string) => void;
  toggleShieldPanel: () => void; 
  toggleStealthMode: () => void; 
}

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(DEFAULT_WORKSPACES);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState('personal');
  
  const [tabs, setTabs] = useState<Tab[]>([
    { 
      id: '1', 
      title: 'New Tab', 
      url: 'browser://newtab', 
      isLoading: false, 
      isFrozen: false, 
      isCrashed: false,
      lastActive: Date.now(),
      engine: 'webf',
      workspaceId: 'personal',
      securityScore: 100,
      memoryUsage: 12.5
    }
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [settings, setSettings] = useState<BrowserSettings>(DEFAULT_SETTINGS);
  
  // Shield State
  const [shieldState, setShieldState] = useState<ShieldState>(DEFAULT_SHIELD_STATE);
  const [isShieldOpen, setIsShieldOpen] = useState(false);

  const [language, setLanguage] = useState<Language>('ar');
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [pipTabId, setPipTabId] = useState<string | null>(null);
  const [showAnnoyanceCrushed, setShowAnnoyanceCrushed] = useState(false);

  // Sync theme
  useEffect(() => {
    if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Tab Freezing & Memory Simulation Logic
  useEffect(() => {
    const interval = setInterval(() => {
        const now = Date.now();
        setTabs(currentTabs => currentTabs.map(tab => {
            const isActive = tab.id === activeTabId;
            const isPip = tab.id === pipTabId;
            let newMemory = tab.memoryUsage;
            if (isActive) {
                newMemory = Math.min(150, Math.max(40, newMemory + (Math.random() * 10 - 4)));
            } else if (tab.isFrozen) {
                newMemory = 2.5; 
            } else {
                newMemory = Math.max(15, newMemory - 5);
            }
            if (!isActive && !isPip && !tab.isFrozen && !tab.isCrashed && (now - tab.lastActive > 15000)) {
                if (!tab.url.startsWith('browser://')) { 
                    return { ...tab, isFrozen: true, memoryUsage: newMemory };
                }
            }
            return { ...tab, memoryUsage: parseFloat(newMemory.toFixed(1)) };
        }));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeTabId, pipTabId]);

  // Derive active workspace tabs
  const activeWorkspaceTabs = tabs.filter(t => t.workspaceId === activeWorkspaceId);

  // Auto-switch active tab
  useEffect(() => {
      const currentTab = tabs.find(t => t.id === activeTabId);
      if (currentTab && currentTab.workspaceId !== activeWorkspaceId) {
          const firstInWs = tabs.find(t => t.workspaceId === activeWorkspaceId);
          if (firstInWs) setActiveTabId(firstInWs.id);
          else addTab();
      }
  }, [activeWorkspaceId]);

  const addTab = useCallback(() => {
    const newId = Date.now().toString();
    const newTab: Tab = {
      id: newId,
      title: language === 'ar' ? 'علامة تبويب جديدة' : 'New Tab',
      url: 'browser://newtab',
      isLoading: false,
      isFrozen: false,
      isCrashed: false,
      lastActive: Date.now(),
      engine: 'webf',
      workspaceId: activeWorkspaceId,
      securityScore: 100,
      memoryUsage: 8.0
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
  }, [language, activeWorkspaceId]);

  const closeTab = useCallback((id: string) => {
    if (id === pipTabId) {
        setIsPiPActive(false);
        setPipTabId(null);
    }
    setTabs(prev => {
      const remaining = prev.filter(t => t.id !== id);
      const inCurrentWs = remaining.filter(t => t.workspaceId === activeWorkspaceId);
      if (inCurrentWs.length === 0) {
          const newId = Date.now().toString();
           const newTab: Tab = {
            id: newId,
            title: language === 'ar' ? 'علامة تبويب جديدة' : 'New Tab',
            url: 'browser://newtab',
            isLoading: false,
            isFrozen: false,
            isCrashed: false,
            lastActive: Date.now(),
            engine: 'webf',
            workspaceId: activeWorkspaceId,
            securityScore: 100,
            memoryUsage: 8.0
          };
          remaining.push(newTab);
      }
      return remaining;
    });
    if (activeTabId === id) {
       const inCurrentWs = tabs.filter(t => t.workspaceId === activeWorkspaceId && t.id !== id);
       if (inCurrentWs.length > 0) setActiveTabId(inCurrentWs[inCurrentWs.length - 1].id);
    }
  }, [activeTabId, activeWorkspaceId, tabs, pipTabId, language]);

  const handleSetActiveTab = useCallback((id: string) => {
    const currentTab = tabs.find(t => t.id === activeTabId);
    if (currentTab && currentTab.isVideo && id !== activeTabId && !currentTab.isCrashed) {
        setIsPiPActive(true);
        setPipTabId(currentTab.id);
    } 
    if (id === pipTabId) {
        setIsPiPActive(false);
        setPipTabId(null);
    }
    setActiveTabId(id);
    setTabs(prev => prev.map(tab => {
        if (tab.id === id) return { ...tab, lastActive: Date.now() };
        return tab;
    }));
  }, [activeTabId, tabs, pipTabId]);

  const updateTabUrl = useCallback(async (id: string, url: string) => {
    // 1. Check URL Safety via Rust Bridge (Advanced Bloom Filter & Stealth Engine)
    const result = await RustCoreBridge.checkUrlSafety(url);
    
    // Take the structured log from the result
    const newLog: SecurityLogEntry = result.log;

    setShieldState(prev => {
        const updatedLogs = [newLog, ...(prev.logs || [])].slice(0, 20);

        // Randomly inject a background log
        if (!result.is_blocked && Math.random() > 0.85) {
             updatedLogs.unshift(RustCoreBridge.generateBackgroundLog());
        }

        if (result.is_blocked) {
            return {
                ...prev,
                trackersBlockedSession: result.category === 'Tracking' ? prev.trackersBlockedSession + 1 : prev.trackersBlockedSession,
                adsBlockedSession: result.category === 'Tracking' ? prev.adsBlockedSession + 1 : prev.adsBlockedSession,
                cryptojackingBlockedSession: result.category === 'Malicious' ? prev.cryptojackingBlockedSession + 1 : prev.cryptojackingBlockedSession,
                lastThreatDetected: result.reason,
                lastThreatLevel: result.threat_level,
                logs: updatedLogs
            };
        } else {
            return { 
                ...prev, 
                lastThreatLevel: 'None',
                logs: updatedLogs 
            };
        }
    });

    if (shieldState.stealthMode) {
        const newUA = RustCoreBridge.rotateUserAgent();
        setShieldState(prev => ({ 
            ...prev, 
            currentUserAgent: newUA
        }));
    }

    setTabs(prev => prev.map(tab => {
        if (tab.id === id) {
            const isWebF = url.includes('webf') || url.includes('app');
            const isVideo = url.includes('youtube') || url.includes('video');
            
            let score = url.startsWith('browser://') ? 100 : Math.floor(Math.random() * (100 - 65) + 65);
            
            if (result.is_blocked) {
                if (result.threat_level === 'Critical') score = 0;
                else if (result.threat_level === 'High') score -= 40;
                else score -= 15;
            }

            if (url.includes('news') || url.includes('blog')) {
                setTimeout(() => {
                    setShowAnnoyanceCrushed(true);
                    setTimeout(() => setShowAnnoyanceCrushed(false), 3000);
                }, 1500);
            }

            return { 
                ...tab, 
                url, 
                title: url.replace('https://', '').split('/')[0],
                isLoading: true, 
                lastActive: Date.now(),
                isFrozen: false,
                isCrashed: false,
                engine: isWebF ? 'webf' : 'servo',
                isVideo,
                securityScore: Math.max(0, score),
                memoryUsage: 35.5
            };
        }
        return tab;
    }));
    
    setTimeout(() => {
        setTabs(prev => prev.map(tab => {
            if (tab.id === id) return { ...tab, isLoading: false };
            return tab;
        }));
    }, 800);
  }, [shieldState.stealthMode, shieldState.logs]); 

  const updateSetting = useCallback((key: keyof BrowserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const wakeTab = useCallback((id: string) => {
    setTabs(prev => prev.map(tab => {
        if (tab.id === id) {
            return { ...tab, isFrozen: false, lastActive: Date.now(), isLoading: true, memoryUsage: 45.0 };
        }
        return tab;
    }));
    setTimeout(() => {
        setTabs(prev => prev.map(tab => {
            if (tab.id === id) return { ...tab, isLoading: false };
            return tab;
        }));
    }, 500);
  }, []);
  
  const crashTab = useCallback((id: string) => {
    setTabs(prev => prev.map(tab => {
        if(tab.id === id) return { ...tab, isCrashed: true, isLoading: false };
        return tab;
    }));
  }, []);

  const recoverTab = useCallback((id: string) => {
    setTabs(prev => prev.map(tab => {
        if(tab.id === id) return { ...tab, isCrashed: false, isLoading: true };
        return tab;
    }));
    setTimeout(() => {
         setTabs(prev => prev.map(tab => {
            if (tab.id === id) return { ...tab, isLoading: false };
            return tab;
        }));
    }, 800);
  }, []);

  const toggleMobileMode = useCallback(() => setIsMobileMode(prev => !prev), []);
  const closePiP = useCallback(() => { setIsPiPActive(false); setPipTabId(null); }, []);
  const toggleServoDebug = useCallback(() => setSettings(prev => ({...prev, showServoDebug: !prev.showServoDebug})), []);
  const toggleShieldPanel = useCallback(() => setIsShieldOpen(prev => !prev), []);
  const toggleStealthMode = useCallback(() => setShieldState(prev => ({...prev, stealthMode: !prev.stealthMode})), []);

  return (
    <BrowserContext.Provider value={{
      tabs,
      activeWorkspaceTabs,
      activeTabId,
      activeWorkspaceId,
      workspaces,
      settings,
      shieldState,
      isShieldOpen,
      language,
      isMobileMode,
      isPiPActive,
      pipTabId,
      showAnnoyanceCrushed,
      addTab,
      closeTab,
      setActiveTab: handleSetActiveTab,
      setActiveWorkspace: setActiveWorkspaceId,
      updateTabUrl,
      updateSetting,
      toggleLanguage,
      wakeTab,
      toggleMobileMode,
      closePiP,
      toggleServoDebug,
      crashTab,
      recoverTab,
      toggleShieldPanel,
      toggleStealthMode
    }}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) throw new Error('useBrowser must be used within BrowserProvider');
  return context;
};