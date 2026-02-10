import React, { useState, useEffect } from 'react';
import { BrowserProvider, useBrowser } from './context/BrowserContext';
import { TabBar } from './components/TabBar';
import { AddressBar } from './components/AddressBar';
import { Settings } from './components/Settings';
import { NewTabPage } from './components/NewTabPage';
import { WorkspaceRail } from './components/WorkspaceRail';
import { ServoDevTools } from './components/ServoDevTools';
import { PrivacyShieldPanel } from './components/PrivacyShieldPanel'; // New Import
import { MOCK_STATS, TRANSLATIONS } from './constants';
import { Globe, Globe2, Moon, Sun, Settings as SettingsIcon, Snowflake, Fingerprint, ShieldAlert, Cpu, X, Play, AlertTriangle, RefreshCw, Zap, Download, Network, ShieldCheck, Layers, ArrowDown, Activity, Layout } from 'lucide-react';

const BrowserShell: React.FC = () => {
  const { 
    activeWorkspaceTabs,
    activeTabId, 
    setActiveTab, 
    addTab, 
    closeTab, 
    updateTabUrl, 
    settings, 
    language,
    toggleLanguage,
    updateSetting,
    wakeTab,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    isMobileMode,
    toggleMobileMode,
    isPiPActive,
    closePiP,
    showAnnoyanceCrushed,
    toggleServoDebug,
    crashTab,
    recoverTab,
    // Shield Props
    isShieldOpen,
    toggleShieldPanel,
    shieldState,
    toggleStealthMode
  } = useBrowser();

  const [showNativeAuth, setShowNativeAuth] = useState(false);
  const [pwaToast, setPwaToast] = useState(false);
  const [bridgeLatency, setBridgeLatency] = useState(0);

  // Simulate Bridge Latency
  useEffect(() => {
    const interval = setInterval(() => {
        setBridgeLatency(Math.floor(Math.random() * 5 + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeTab = activeWorkspaceTabs.find(t => t.id === activeTabId) || activeWorkspaceTabs[0];
  const isSettings = activeTab?.url === 'browser://settings';
  const isNewTab = activeTab?.url === 'browser://newtab';
  const isAuthPage = activeTab?.url.includes('login') || activeTab?.url.includes('auth');
  const isRtl = language === 'ar';
  
  // Handlers
  const handleNavigate = (url: string) => updateTabUrl(activeTabId, url);
  const handleReload = () => updateTabUrl(activeTabId, activeTab.url);

  const handleInstallPWA = () => {
      setPwaToast(true);
      setTimeout(() => setPwaToast(false), 3000);
  };

  // Native Auth Simulation Component
  const NativeAuthModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 w-96 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-200 dark:border-gray-700">
            <div className="bg-indigo-600 p-4 flex items-center gap-3">
                <ShieldAlert className="text-white" />
                <div>
                    <h3 className="font-bold text-white">AppAuth Secure Bridge</h3>
                    <p className="text-xs text-indigo-200">System Isolation Active</p>
                </div>
            </div>
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                    <Fingerprint className="text-indigo-600 dark:text-indigo-400" size={24} />
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        {TRANSLATIONS[language].secureLoginDesc}
                    </p>
                </div>
                <div className="space-y-3">
                    <button 
                        onClick={() => { setShowNativeAuth(false); handleNavigate('https://dashboard.secure.net'); }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-md"
                    >
                        Confirm Identity
                    </button>
                    <button 
                        onClick={() => setShowNativeAuth(false)}
                        className="w-full py-2.5 bg-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
  
  // Render Content Logic
  const renderContent = () => {
    if (!activeTab) return null;

    if (activeTab.isCrashed) {
         return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/90 text-red-200 font-mono">
                <AlertTriangle size={64} className="mb-6 text-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold mb-2">{TRANSLATIONS[language].rustPanic}</h2>
                <p className="mb-8 text-center max-w-md text-red-300/70">{TRANSLATIONS[language].rustPanicDesc}</p>
                <button onClick={() => recoverTab(activeTab.id)} className="flex items-center gap-2 px-6 py-3 bg-red-900 hover:bg-red-800 text-white rounded-lg transition-colors border border-red-700 shadow-xl">
                    <RefreshCw size={18} /> {TRANSLATIONS[language].respawnProcess}
                </button>
            </div>
        );
    }

    if (activeTab.isFrozen) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-black/90 text-gray-400">
                <Snowflake size={64} className="mb-6 text-blue-300 animate-pulse" />
                <h2 className="text-2xl font-bold mb-2 text-gray-700 dark:text-gray-200">{TRANSLATIONS[language].tabFrozen}</h2>
                <button onClick={() => wakeTab(activeTab.id)} className="px-6 py-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors shadow-lg font-medium">
                    {TRANSLATIONS[language].wakeTab}
                </button>
            </div>
        );
    }

    if (isSettings) return <Settings settings={settings} updateSetting={updateSetting} lang={language} />;
    if (isNewTab) return <NewTabPage stats={MOCK_STATS} lang={language} />;
    if (isAuthPage) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center p-8 max-w-md">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto flex items-center justify-center mb-6">
                        <ShieldAlert size={40} className="text-gray-400" />
                    </div>
                    <button onClick={() => setShowNativeAuth(true)} className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:scale-105 transition-transform">
                        {TRANSLATIONS[language].continueWithAuth}
                    </button>
                </div>
            </div>
        );
    }
    
    // Bare Metal Architecture Simulation
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-400 relative overflow-hidden">
         <div className="w-full max-w-3xl p-8">
             <div className="mb-6 text-center">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{TRANSLATIONS[language].simulatedContent}</h2>
                 <p className="text-sm text-gray-500">Direct Rendering Path (HTML → RenderObject)</p>
             </div>
             <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 bg-gray-50 dark:bg-black/50">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <Layout size={18} className="text-blue-600 dark:text-blue-400" />
                             <span className="font-bold text-blue-900 dark:text-blue-100">Flutter UI Shell</span>
                        </div>
                        <span className="text-xs font-mono text-blue-600 dark:text-blue-300">Native Performance</span>
                    </div>
                    <ArrowDown className="mx-auto text-gray-400" size={20} />
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg flex flex-col gap-2 relative overflow-hidden">
                         <div className="flex items-center justify-between z-10">
                            <div className="flex items-center gap-2">
                                <Globe size={18} className="text-purple-600 dark:text-purple-400" />
                                <span className="font-bold text-purple-900 dark:text-purple-100">WebF (Kraken) Viewport</span>
                            </div>
                            <span className="text-xs font-mono text-purple-600 dark:text-purple-300">QuickJS Engine</span>
                        </div>
                        <div className="text-xs text-purple-800 dark:text-purple-200 bg-white dark:bg-black/30 p-2 rounded border border-purple-100 dark:border-purple-800 font-mono z-10">
                            &lt;DOM&gt; → &lt;Element&gt; → &lt;RenderObject&gt;
                        </div>
                        <div className="absolute inset-0 bg-purple-500/5 animate-pulse z-0"></div>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                         <div className="h-8 w-0.5 bg-gray-400"></div>
                         <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] rounded-full border border-green-200 dark:border-green-800 font-mono flex items-center gap-1">
                            <Activity size={10} />
                            FFI Bridge: {bridgeLatency}ms
                         </div>
                         <div className="h-8 w-0.5 bg-gray-400"></div>
                    </div>
                    <div className="p-4 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             <Cpu size={18} className="text-orange-600 dark:text-orange-400" />
                             <span className="font-bold text-orange-900 dark:text-orange-100">Rust Core (Parsing & Net)</span>
                        </div>
                        <span className="text-xs font-mono text-orange-600 dark:text-orange-300">Memory Safe</span>
                    </div>
                </div>
             </div>
         </div>
         {activeTab.isVideo && (
            <div className="absolute bottom-10 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm">
                <Play size={16} className="inline mr-2" />
                Video Playing... Switch tabs to test Smart PiP.
            </div>
         )}
      </div>
    );
  };

  return (
    <div className={`flex flex-row h-screen bg-gray-100 dark:bg-dark-bg transition-colors duration-300 ${isRtl ? 'font-arabic' : 'font-sans'} overflow-hidden relative`}>
      
      {/* Global Overlays */}
      {showNativeAuth && <NativeAuthModal />}
      
      {/* Privacy Shield Panel */}
      <PrivacyShieldPanel 
        isOpen={isShieldOpen} 
        onClose={toggleShieldPanel} 
        state={shieldState} 
        onToggleStealth={toggleStealthMode} 
        lang={language} 
      />

      {/* PWA Toast */}
      {pwaToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <Download size={16} className="text-green-400" />
              <span>{TRANSLATIONS[language].pwaInstalled}</span>
          </div>
      )}
      
      {settings.showServoDebug && <ServoDevTools lang={language} onCrashTest={() => crashTab(activeTabId)} />}
      
      <div className={`${isRtl ? 'order-last' : 'order-first'}`}>
          <WorkspaceRail workspaces={workspaces} activeWorkspaceId={activeWorkspaceId} onSwitch={setActiveWorkspace} lang={language} />
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0">
        <div className="flex-none bg-gray-200 dark:bg-black pt-2 pb-0">
            <div className="flex items-center px-4 justify-between mb-2">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" />
                </div>
                <div className={`flex gap-3 text-gray-600 dark:text-gray-400 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <button onClick={() => updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark')} title="Toggle Theme"><Sun size={16} /></button>
                <button onClick={toggleLanguage} title="Switch Language" className="flex items-center gap-1 text-xs font-bold uppercase"><Globe2 size={16} /> {language}</button>
                <button onClick={() => handleNavigate('browser://settings')}><SettingsIcon size={16} /></button>
                </div>
            </div>
            <TabBar tabs={activeWorkspaceTabs} activeTabId={activeTabId} onTabClick={setActiveTab} onTabClose={(id, e) => { e.stopPropagation(); closeTab(id); }} onNewTab={addTab} lang={language} />
        </div>

        {activeTab && (
            <AddressBar 
                activeTab={activeTab} 
                onNavigate={handleNavigate} 
                onRefresh={handleReload}
                lang={language}
                isSecure={settings.httpsOnly}
                isMobileMode={isMobileMode}
                onToggleMobile={toggleMobileMode}
                showAnnoyanceCrushed={showAnnoyanceCrushed}
                onToggleServoDebug={toggleServoDebug}
                showServoDebug={settings.showServoDebug}
                onInstallPWA={handleInstallPWA}
                onToggleShield={toggleShieldPanel} 
                shieldState={shieldState} // PASSED
            />
        )}

        <div className="flex-1 overflow-auto relative scroll-smooth bg-gray-50 dark:bg-gray-900 flex justify-center">
            <div className={`transition-all duration-300 ease-in-out h-full w-full ${isMobileMode ? 'max-w-[375px] my-4 border-8 border-gray-800 rounded-[3rem] shadow-2xl overflow-hidden bg-white dark:bg-black' : ''}`}>
                {renderContent()}
            </div>
        </div>

        <div className="h-6 bg-brand-900 text-white text-[10px] flex items-center px-4 justify-between select-none z-20">
            <span className="opacity-70">Sanda Hybrid Core (WebF + Rust/Servo)</span>
            <div className="flex gap-4">
                {activeTab?.isCrashed && <span className="flex items-center gap-1 text-red-300 font-bold"><AlertTriangle size={10} /> PANIC</span>}
                {activeTab?.isFrozen && <span className="flex items-center gap-1 text-blue-300"><Snowflake size={10} /> Tab Suspended</span>}
                {settings.torIntegration && <span className="flex items-center gap-1 text-purple-300 font-bold"><Network size={10} /> TOR CIRCUIT ACTIVE</span>}
                {settings.dnsOverHttps && <span className="flex items-center gap-1 text-green-300"><ShieldCheck size={10} /> DoH</span>}
                {settings.dataSaver && <span className="flex items-center gap-1 text-yellow-300"><Zap size={10} /> Saved 1.2MB</span>}
                {settings.vpnEnabled && <span className="flex items-center gap-1 text-brand-300 uppercase"><Globe size={10} /> {settings.vpnRegion}</span>}
                <span className="flex items-center gap-1"><span className={`w-1.5 h-1.5 rounded-full ${activeTab.memoryUsage > 100 ? 'bg-red-400' : 'bg-green-400'}`}></span> Mem: {activeTab?.memoryUsage?.toFixed(1) || '0.0'} MB (QuickJS)</span>
            </div>
        </div>

        {isPiPActive && (
            <div className={`fixed bottom-10 ${isRtl ? 'left-20' : 'right-20'} w-72 h-40 bg-black rounded-lg shadow-2xl z-50 overflow-hidden border border-gray-700 animate-in slide-in-from-bottom duration-300 group`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop')] bg-cover"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90">
                     <Play size={32} className="drop-shadow-lg" fill="white" />
                     <span className="text-xs font-bold mt-2 shadow-black drop-shadow-md">{TRANSLATIONS[language].pipMode}</span>
                </div>
                <button onClick={closePiP} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
            </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
    return (
        <BrowserProvider>
            <BrowserShell />
        </BrowserProvider>
    );
};

export default App;