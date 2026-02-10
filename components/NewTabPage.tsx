import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { PrivacyStats, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Shield, Zap, EyeOff, Globe, Lock } from 'lucide-react';

interface NewTabPageProps {
  stats: PrivacyStats;
  lang: Language;
}

const data = [
  { name: 'Mon', blocked: 400 },
  { name: 'Tue', blocked: 300 },
  { name: 'Wed', blocked: 200 },
  { name: 'Thu', blocked: 278 },
  { name: 'Fri', blocked: 189 },
  { name: 'Sat', blocked: 239 },
  { name: 'Sun', blocked: 349 },
];

export const NewTabPage: React.FC<NewTabPageProps> = ({ stats, lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const StatCard = ({ icon: Icon, value, label, color }: any) => (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-200">
      <div className={`p-3 rounded-full mb-3 ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-6 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Hero Logo */}
      <div className="mb-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-900 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-brand-500/20">
          <Shield size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Sanda Browser</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center justify-center gap-2">
            <Lock size={16} /> {t.connected}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
        <StatCard 
            icon={EyeOff} 
            value={stats.trackersBlocked.toLocaleString()} 
            label={t.trackersBlocked} 
            color="bg-red-500" 
        />
        <StatCard 
            icon={Zap} 
            value={`${stats.bandwidthSavedMB} MB`} 
            label={t.dataSaved} 
            color="bg-yellow-500" 
        />
        <StatCard 
            icon={Globe} 
            value={stats.fingerprintingAttempts} 
            label={t.fingerprints} 
            color="bg-purple-500" 
        />
         <StatCard 
            icon={Shield} 
            value="100%" 
            label={t.secureConnection} 
            color="bg-green-500" 
        />
      </div>

      {/* Graph Area */}
      <div className="w-full max-w-5xl bg-white dark:bg-dark-surface rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-border h-64">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white px-2">{t.privacyReport} (7 Days)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
            />
            <Area type="monotone" dataKey="blocked" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorBlocked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};