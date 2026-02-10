export type Language = 'en' | 'ar';

export interface Workspace {
  id: string;
  name: string;
  icon: 'briefcase' | 'coffee' | 'code' | 'zap';
  color: string;
}

export interface Tab {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  favicon?: string;
  isFrozen: boolean;
  isCrashed: boolean;
  lastActive: number;
  engine: 'webf' | 'servo';
  workspaceId: string;
  isVideo?: boolean;
  securityScore: number;
  memoryUsage: number; // MB used by this tab
}

export enum SecurityLevel {
  STANDARD = 'STANDARD',
  STRICT = 'STRICT',
  MAXIMUM = 'MAXIMUM'
}

export type VpnRegion = 'off' | 'jordan' | 'dubai' | 'saudi' | 'europe';
export type CookiePolicy = 'allow' | 'block-third-party' | 'block-all';
export type RenderingBackend = 'webf-only' | 'servo-only' | 'hybrid';
export type IsolationMode = 'thread' | 'process' | 'isolate';

// Advanced Rust Bridge Types
export type RequestCategory = 'Essential' | 'Media' | 'Tracking' | 'Malicious' | 'Unknown';
export type ThreatLevel = 'None' | 'Low' | 'Medium' | 'High' | 'Critical';

// Rust Smart Logging Enums
export enum SandaModule {
  PrivacyShield = 'PrivacyShield',
  StealthEngine = 'StealthEngine',
  NetworkGuard = 'NetworkGuard',
  RustCore = 'RustCore',
}

export enum LogLevel {
  Info = 'Info',
  Success = 'Success',
  Warning = 'Warning',
  Danger = 'Danger',
}

export interface SecurityLogEntry {
    id: string;
    timestamp: string;
    module: SandaModule;
    level: LogLevel;
    message: string;
}

export interface BlockResult {
    is_blocked: boolean;
    reason: string;
    threat_level: ThreatLevel;
    category: RequestCategory;
    timestamp: number;
    log: SecurityLogEntry; // Attached log event
}

// New Architecture: Privacy Shield State
export interface ShieldState {
  isActive: boolean;
  stealthMode: boolean; // Random User Agent
  currentUserAgent: string;
  adsBlockedSession: number;
  trackersBlockedSession: number;
  cryptojackingBlockedSession: number;
  lastThreatDetected: string | null;
  lastThreatLevel: string; // For UI display
  dohProvider: 'cloudflare' | 'google' | 'quad9' | 'local_rust_resolver';
  logs: SecurityLogEntry[]; // Live logs from Rust Core
}

export interface BrowserSettings {
  httpsOnly: boolean;
  blockTrackers: boolean;
  blockFingerprinting: boolean;
  blockAnnoyances: boolean;
  autoDeleteData: boolean;
  vpnEnabled: boolean;
  vpnRegion: VpnRegion;
  securityLevel: SecurityLevel;
  theme: 'light' | 'dark' | 'system';
  showServoDebug: boolean;
  dataSaver: boolean;
  nightEconomy: boolean;
  predictivePreloading: boolean;
  // Architecture Settings
  renderingBackend: RenderingBackend;
  isolationMode: IsolationMode;
  // Privacy Features
  dnsOverHttps: boolean;
  blockWebRtc: boolean;
  torIntegration: boolean;
  cookiePolicy: CookiePolicy;
}

export interface PrivacyStats {
  trackersBlocked: number;
  bandwidthSavedMB: number;
  threatsPrevented: number;
  fingerprintingAttempts: number;
  annoyancesCrushed: number;
}