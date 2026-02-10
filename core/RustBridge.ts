import { BlockResult, RequestCategory, ThreatLevel, SandaModule, LogLevel, SecurityLogEntry } from '../types';

/* 
 * ------------------------------------------------------------------
 * SANDA BROWSER - RUST CORE SIMULATION
 * ------------------------------------------------------------------
 * Implements the specific Rust logic provided in the specs:
 * 1. SandaBloomFilter: Custom hashing and bitset logic.
 * 2. StealthIdentity: Struct for consistent fingerprint spoofing.
 * 3. Smart Logging: Structured Event Generation (SandaLog).
 */

// --- 1. SANDA BLOOM FILTER (RUST IMPLEMENTATION) ---
class SandaBloomFilter {
    private bitArray: Uint8Array;
    private size: number;
    private hashCount: number;

    constructor(size: number = 100000, hashCount: number = 3) {
        this.size = size;
        this.hashCount = hashCount;
        this.bitArray = new Uint8Array(size);
    }

    private hash(item: string, seed: number): number {
        let h = seed;
        for (let i = 0; i < item.length; i++) {
            h = (Math.imul(h, 31) + item.charCodeAt(i)) >>> 0; 
        }
        return h % this.size;
    }

    public add(item: string) {
        for (let i = 0; i < this.hashCount; i++) {
            const h = this.hash(item, i);
            this.bitArray[h] = 1;
        }
    }

    public isBlocked(item: string): boolean {
        for (let i = 0; i < this.hashCount; i++) {
            const h = this.hash(item, i);
            if (this.bitArray[h] === 0) {
                return false; 
            }
        }
        return true; 
    }
}

const shield = new SandaBloomFilter(100000, 3);
const BAD_PATTERNS = [
    "doubleclick.net", "analytics.google.com", "facebook.pixel.com",
    "hotjar.com", "segment.io", "coinhive.com", "miner.js", "ads-twitter.com",
    "tracker", "telemetry", "adservice"
];
BAD_PATTERNS.forEach(p => shield.add(p));


// --- 2. STEALTH IDENTITY ENGINE ---
interface StealthProfile {
    ua: string;
    platform: string;
    vendor: string;
    res: string;
}

class StealthIdentity {
    userAgent: string;
    platform: string;
    vendor: string;
    screenResolution: string;

    constructor(profile: StealthProfile) {
        this.userAgent = profile.ua;
        this.platform = profile.platform;
        this.vendor = profile.vendor;
        this.screenResolution = profile.res;
    }

    static generateRandom(): StealthIdentity {
        const profiles: StealthProfile[] = [
            {
                ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                platform: "Win32",
                vendor: "Google Inc.",
                res: "1920x1080"
            },
            {
                ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
                platform: "MacIntel",
                vendor: "Apple Computer, Inc.",
                res: "2560x1600"
            },
            {
                ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                platform: "Linux x86_64",
                vendor: "Google Inc.",
                res: "1366x768"
            }
        ];
        
        const profile = profiles[Math.floor(Math.random() * profiles.length)];
        return new StealthIdentity(profile);
    }
}

// --- 3. CORE BRIDGE INTERFACE ---

export class RustCoreBridge {
    
    // The main IDL function called by Flutter/Dart
    static async checkUrlSafety(url: string): Promise<BlockResult> {
        // Simulate FFI bridge latency
        await new Promise(resolve => setTimeout(resolve, Math.random() * 5 + 2));

        const cleanUrl = url.toLowerCase();
        let category: RequestCategory = 'Unknown';
        let isBlocked = false;
        let reason = 'Verified Safe';
        let threatLevel: ThreatLevel = 'None';
        
        // Log attributes
        let module = SandaModule.NetworkGuard;
        let level = LogLevel.Info;
        let message = `Request authorized: ${url.substring(0, 30)}...`;

        // 1. Media Check
        if (cleanUrl.match(/\.(jpg|jpeg|png|gif|mp4|webp)$/)) {
            category = 'Media';
            module = SandaModule.NetworkGuard;
            level = LogLevel.Info;
            message = `Media resource passed: ${cleanUrl.split('/').pop()}`;
            
            return { 
                is_blocked: false, 
                reason: 'Media Resource Allowed', 
                threat_level: 'None', 
                category, 
                timestamp: Date.now(),
                log: RustCoreBridge.createLog(module, level, message)
            };
        }

        // 2. Sanda Shield Check (Bloom Filter)
        let matchFound = false;
        let matchedPattern = "";

        for (const pattern of BAD_PATTERNS) {
            if (cleanUrl.includes(pattern)) {
                if (shield.isBlocked(pattern)) { 
                    matchFound = true;
                    matchedPattern = pattern;
                    break; 
                }
            }
        }

        if (matchFound) {
            isBlocked = true;
            if (cleanUrl.includes('miner') || cleanUrl.includes('coin')) {
                category = 'Malicious';
                threatLevel = 'Critical';
                reason = `Miner Terminated: ${matchedPattern}`;
                module = SandaModule.RustCore;
                level = LogLevel.Danger;
                message = `Crypto-miner signature detected: ${matchedPattern}`;
            } else {
                category = 'Tracking';
                threatLevel = 'High';
                reason = `Packet Intercepted: ${matchedPattern}`;
                module = SandaModule.PrivacyShield;
                level = LogLevel.Warning;
                message = `Tracker blocked in bloom filter: ${matchedPattern}`;
            }
        } else {
            category = 'Essential';
            // 3. Stealth Logic Simulation for allowed requests
            const identity = StealthIdentity.generateRandom();
            reason = `Spoofed to ${identity.platform}`;
            module = SandaModule.StealthEngine;
            level = LogLevel.Success; // Neon Green success
            message = `Identity spoofed to ${identity.platform} for privacy`;
        }

        return {
            is_blocked: isBlocked,
            reason,
            threat_level: threatLevel,
            category,
            timestamp: Date.now(),
            log: RustCoreBridge.createLog(module, level, message)
        };
    }

    static rotateUserAgent(): string {
        return StealthIdentity.generateRandom().userAgent;
    }

    private static createLog(module: SandaModule, level: LogLevel, message: string): SecurityLogEntry {
        return {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
            module,
            level,
            message
        };
    }
    
    // Helper to generate random background logs
    static generateBackgroundLog(): SecurityLogEntry {
        const rand = Math.random();
        if (rand > 0.7) {
            return this.createLog(SandaModule.RustCore, LogLevel.Info, "Memory safety check passed (Borrow Checker)");
        } else if (rand > 0.4) {
            return this.createLog(SandaModule.NetworkGuard, LogLevel.Success, "DNS query encrypted (DoH)");
        } else {
            return this.createLog(SandaModule.StealthEngine, LogLevel.Info, "Canvas fingerprinting noise added");
        }
    }
}