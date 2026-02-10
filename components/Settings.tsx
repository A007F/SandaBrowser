import React from 'react';
import { BrowserSettings, Language, SecurityLevel, VpnRegion, CookiePolicy } from '../types';
import { TRANSLATIONS, SETTING_SECTIONS } from '../constants';
import { ToggleLeft, ToggleRight, Check, ChevronRight, Shield, Globe, Zap, Moon, Network, Eye, Lock, Fingerprint, Layers, Cpu } from 'lucide-react';

interface SettingsProps {
  settings: BrowserSettings;
  updateSetting: (key: keyof BrowserSettings, value: any) => void;
  lang: Language;
}

export const Settings: React.FC<SettingsProps> = ({ settings, updateSetting, lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button 
        onClick={onChange}
        className={`transition-colors duration-200 ${checked ? 'text-brand-500' : 'text-gray-400'}`}
    >
        {checked ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
    </button>
  );

  return (
    <div className={`max-w-4xl mx-auto p-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-3">
        <Shield className="text-brand-500" />
        {t.settings}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
            {SETTING_SECTIONS.map((section) => (
                <button 
                    key={section.id}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all shadow-sm border border-transparent hover:border-brand-500/30"
                >
                    <section.icon size={18} />
                    <span className="font-medium flex-1 text-start">
                        {lang === 'ar' ? section.labelAr : section.labelEn}
                    </span>
                    {isRtl ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
                </button>
            ))}
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
            
            {/* Architecture Settings (New) */}
            <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/20 space-y-6">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Layers size={20} className="text-indigo-500" />
                    {t.architecture}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rendering Engine */}
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{t.renderingBackend}</div>
                        <select 
                            value={settings.renderingBackend}
                            onChange={(e) => updateSetting('renderingBackend', e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border-none rounded-md text-sm p-2 text-gray-700 dark:text-gray-300 shadow-sm"
                        >
                            <option value="webf">{t.backendOptions.webf}</option>
                            <option value="servo">{t.backendOptions.servo}</option>
                            <option value="hybrid">{t.backendOptions.hybrid}</option>
                        </select>
                    </div>

                    {/* Isolation Mode */}
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">{t.isolationMode}</div>
                         <select 
                            value={settings.isolationMode}
                            onChange={(e) => updateSetting('isolationMode', e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border-none rounded-md text-sm p-2 text-gray-700 dark:text-gray-300 shadow-sm"
                        >
                            <option value="thread">{t.isolationOptions.thread}</option>
                            <option value="isolate">{t.isolationOptions.isolate}</option>
                            <option value="process">{t.isolationOptions.process}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Identity & Auth Bridge */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Fingerprint size={20} className="text-blue-500" />
                    {t.authBridge}
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{t.secureLogin}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-md">{t.authBridgeDesc}</div>
                    </div>
                     <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        Manage Providers
                     </button>
                </div>
            </div>

            {/* Privacy & Censorship Circumvention */}
            <div className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-border space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Network size={20} className="text-purple-500" />
                    {t.privacy}
                </h3>
                
                {/* VPN Region Selection */}
                 <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                             {t.vpn}
                             <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300">FREE</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{t.featureDesc.vpn}</div>
                    </div>
                    <div className="flex items-center gap-2">
                         <select 
                            value={settings.vpnRegion}
                            onChange={(e) => updateSetting('vpnRegion', e.target.value)}
                            disabled={!settings.vpnEnabled}
                            className="bg-gray-100 dark:bg-gray-800 border-none rounded-md text-sm p-1 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                         >
                            <option value="jordan">{t.regions.jordan}</option>
                            <option value="saudi">{t.regions.saudi}</option>
                            <option value="dubai">{t.regions.dubai}</option>
                            <option value="europe">{t.regions.europe}</option>
                         </select>
                         <Toggle checked={settings.vpnEnabled} onChange={() => updateSetting('vpnEnabled', !settings.vpnEnabled)} />
                    </div>
                </div>
                
                <div className="h-px bg-gray-100 dark:bg-dark-border" />

                {/* Tor Integration */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{t.torMode}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{t.featureDesc.tor}</div>
                    </div>
                    <Toggle checked={settings.torIntegration} onChange={() => updateSetting('torIntegration', !settings.torIntegration)} />
                </div>

                <div className="h-px bg-gray-100 dark:bg-dark-border" />

                 {/* DoH & WebRTC */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{t.doh}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.featureDesc.doh}</div>
                        </div>
                        <Toggle checked={settings.dnsOverHttps} onChange={() => updateSetting('dnsOverHttps', !settings.dnsOverHttps)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{t.webRtc}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.featureDesc.webRtc}</div>
                        </div>
                        <Toggle checked={settings.blockWebRtc} onChange={() => updateSetting('blockWebRtc', !settings.blockWebRtc)} />
                    </div>
                 </div>
            </div>
            
            {/* Auto Delete */}
             <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-900/20">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-medium text-red-900 dark:text-red-200">{t.featureDesc.delete}</div>
                        <div className="text-sm text-red-700/70 dark:text-red-300/60">{t.general}</div>
                    </div>
                    <Toggle checked={settings.autoDeleteData} onChange={() => updateSetting('autoDeleteData', !settings.autoDeleteData)} />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};