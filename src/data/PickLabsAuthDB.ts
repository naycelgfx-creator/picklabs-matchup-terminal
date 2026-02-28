/**
 * PickLabsAuthDB.ts
 * Direct port of the Flask/SQLite backend auth system.
 *
 * Python originals:
 *   init_db()           → initDB()
 *   VALID_UPGRADE_CODES → VALID_UPGRADE_CODES
 *   /signup POST        → signup()
 *   /upgrade POST       → applyVIPCode()
 *   /login POST         → login()
 *   /logout             → logout()
 *   /admin_action POST  → adminUpgrade/Downgrade/Delete()
 *   current_user        → getCurrentUser() / useCurrentUser hook
 *
 * Storage: browser localStorage (mirrors SQLite picklabs.db)
 * In production: swap localStorage calls for Supabase/Firebase API calls.
 */

import { adminDeleteUserBets } from './PickLabsBetsDB';

const DB_KEY = 'picklabs_users_db';       // mirrors: picklabs.db
const SESSION_KEY = 'picklabs_session';   // mirrors: Flask-Login cookie
const SESSION_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days (mirrors remember=True)

// ─── VIP Codes (port of VALID_UPGRADE_CODES list) ────────────────────────────
// Change these whenever you want. Give them out when people pay you on CashApp.
export const VALID_UPGRADE_CODES: string[] = [
    'CASHAPP_VIP_2026',
    'EARLY_ADOPTER_100',
    'PICKLABS_BETA',
    'SHARPS_ONLY_50',
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DBUser {
    id: string;                // mirrors: INTEGER PRIMARY KEY AUTOINCREMENT
    email: string;             // mirrors: email TEXT UNIQUE NOT NULL
    passwordHash: string;      // mirrors: password TEXT NOT NULL (hashed)
    isPremium: boolean;        // mirrors: is_premium BOOLEAN NOT NULL DEFAULT 0
    premiumExpiresAt?: number; // epoch ms when 30-day VIP expires
    createdAt: number;         // epoch ms
    referralCode?: string;     // Added for referral loop
    referralsCount?: number;   // Added for referral loop
    otp?: string;              // For 2FA/Password Reset
    otpExpiry?: number;        // Epoch ms
    lastKnownIp?: string;      // Mocked IP for 2FA trigger
    dripDay1Sent?: boolean;    // Drip Email Flags
    dripDay2Sent?: boolean;
    dripDay3Sent?: boolean;
    phoneNumber?: string;      // SMS Alerts
}

export interface SessionData {
    userId: string;
    email: string;
    isPremium: boolean;
    expiry: number;            // Session TTL
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// We hash on the client side just so plain text passwords aren't sitting in localStorage.
// (In a real app, send plaintext over HTTPS and hash strictly on the backend via bcrypt)
async function hashPassword(msg: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(msg);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
    const pHash = await hashPassword(password);
    return pHash === hash;
}

// ─── Mock IP ──────────────────────────────────────────────────────────────────

function getMockClientIP(): string {
    let mockIp = sessionStorage.getItem('mockClientIp');
    if (!mockIp) {
        mockIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        sessionStorage.setItem('mockClientIp', mockIp);
    }
    return mockIp;
}

// ─── DB Operations ────────────────────────────────────────────────────────────

// The "database" is just a JSON array stored in localStorage
export function getAllUsers(): DBUser[] {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function saveAllUsers(users: DBUser[]) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Deprecated findUserByEmail removed

function findUserById(id: string): DBUser | undefined {
    return getAllUsers().find(u => u.id === id);
}

// ─── Drip Campaigns ──────────────────────────────────────────────────────────

export function checkDripCampaigns(email: string) {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return;

    const user = users[idx];
    if (user.isPremium) return; // Drip is for Free users

    const daysActive = Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24));

    if (daysActive >= 1 && !user.dripDay1Sent) {
        console.log(`%c[DRIP CAMPAIGN SENT to ${user.email}]`, 'color: #10b981; font-weight: bold;', 'The math behind winning sports bets 📈');
        users[idx].dripDay1Sent = true;
    }
    if (daysActive >= 2 && !user.dripDay2Sent) {
        console.log(`%c[DRIP CAMPAIGN SENT to ${user.email}]`, 'color: #fbbf24; font-weight: bold;', 'How to exploit PrizePicks and Underdog 💸');
        users[idx].dripDay2Sent = true;
    }
    if (daysActive >= 3 && !user.dripDay3Sent) {
        console.log(`%c[DRIP CAMPAIGN SENT to ${user.email}]`, 'color: #ef4444; font-weight: bold;', "Unlock the sharp data (Here's a VIP Code) 🔓");
        users[idx].dripDay3Sent = true;
    }

    saveAllUsers(users);
}

// ─── Init DB ──────────────────────────────────────────────────────────────────

// Seed the "database" with a default VIP and Free user for dev testing
export async function initDB() {
    if (localStorage.getItem(DB_KEY)) return;

    const vipPass = await hashPassword('admin123');
    const freePass = await hashPassword('free123');

    const defaultUsers: DBUser[] = [
        {
            id: crypto.randomUUID(),
            email: 'admin@picklabs.app',
            passwordHash: vipPass,
            isPremium: true,
            premiumExpiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
            createdAt: Date.now(),
            referralCode: 'admin_ref',
            referralsCount: 0,
            phoneNumber: '+15551234567', // Mock phone for SMS testing
        },
        {
            id: crypto.randomUUID(),
            email: 'user@gmail.com',
            passwordHash: freePass,
            isPremium: false,
            createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago to trigger Drip
            referralCode: 'user_ref',
            referralsCount: 0,
            dripDay1Sent: false,
            dripDay2Sent: false,
            dripDay3Sent: false,
        }
    ];

    saveAllUsers(defaultUsers);
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export async function signup(email: string, password: string, referralCode?: string): Promise<{ ok: boolean; message: string }> {
    const users = getAllUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { ok: false, message: '❌ User with that email already exists.' };
    }

    // Process Referral
    if (referralCode) {
        const referrerIdx = users.findIndex(u => u.referralCode === referralCode);
        if (referrerIdx !== -1) {
            users[referrerIdx].referralsCount = (users[referrerIdx].referralsCount || 0) + 1;

            // Auto upgrade to premium if they hit 5 referrals
            if (users[referrerIdx].referralsCount >= 5 && !users[referrerIdx].isPremium) {
                users[referrerIdx].isPremium = true;
                users[referrerIdx].premiumExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
                console.log(`[SYSTEM] ${users[referrerIdx].email} reached 5 referrals and was upgraded to VIP.`);
            }
        }
    }

    const newUser: DBUser = {
        id: crypto.randomUUID(),
        email,
        passwordHash: await hashPassword(password),
        isPremium: false,
        createdAt: Date.now(),
        referralCode: email.split('@')[0] + '_' + Math.floor(Math.random() * 10000),
        referralsCount: 0,
        dripDay1Sent: false,
        dripDay2Sent: false,
        dripDay3Sent: false,
    };

    users.push(newUser);
    saveAllUsers(users);

    return { ok: true, message: 'Account created successfully!' };
}

export function generateOTP(email: string): string {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return '';

    // Generate 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    users[idx].otp = otp;
    users[idx].otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    saveAllUsers(users);

    // In a real app we'd trigger an email send here. Since we're client-side,
    // we'll "leak" it via console for demo purposes, or return it to be auto-filled by UI.
    console.log(`[SIMULATED EMAIL TO ${email}] Your OTP is: ${otp}`);
    return otp;
}

export function verifyOTP(email: string, otp: string): boolean {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return false;

    const user = users[idx];
    if (user.otp === otp && user.otpExpiry && Date.now() < user.otpExpiry) {
        // Clear OTP on success
        users[idx].otp = undefined;
        users[idx].otpExpiry = undefined;

        // If they verified an OTP, we can assume the device is trusted now
        // so let's update their "IP" to the current mocked device
        users[idx].lastKnownIp = getMockClientIP();

        saveAllUsers(users);
        return true;
    }
    return false;
}

export async function resetPassword(email: string, newPassword: string): Promise<boolean> {
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return false;

    users[idx].passwordHash = await hashPassword(newPassword);
    saveAllUsers(users);
    return true;
}

export async function login(email: string, password: string): Promise<{ ok: boolean; message: string; requires2FA?: boolean; user?: DBUser }> {
    // --- Hardcoded Admin Bypass ---
    if (email.toLowerCase() === 'admin@picklabs.bet' && password === 'admin12345') {
        const adminUser: DBUser = {
            id: 'root-admin',
            email: 'admin@picklabs.bet',
            passwordHash: 'bypassed',
            isPremium: true,
            createdAt: Date.now(),
            referralCode: 'admin_root',
            referralsCount: 0
        };

        const currentUsers = getAllUsers();
        if (!currentUsers.find(u => u.email.toLowerCase() === adminUser.email)) {
            currentUsers.push(adminUser);
            saveAllUsers(currentUsers);
        }

        const session: SessionData = {
            userId: adminUser.id,
            email: adminUser.email,
            isPremium: adminUser.isPremium,
            expiry: Date.now() + SESSION_TTL_MS,
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));

        return { ok: true, message: 'Admin Access Granted.', user: adminUser };
    }
    // ------------------------------

    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return { ok: false, message: '❌ Invalid email or password.' };

    const user = users[idx];
    // Skip hash check if it's the bypassed admin user from DB
    let valid = false;
    if (user.id === 'root-admin') {
        valid = (password === 'admin12345');
    } else {
        valid = await checkPasswordHash(password, user.passwordHash);
    }

    if (!valid) return { ok: false, message: '❌ Invalid email or password.' };

    // 2FA IP Check
    const currentIp = getMockClientIP();
    if (user.lastKnownIp && user.lastKnownIp !== currentIp) {
        // IP mismatch -> trigger 2FA
        generateOTP(user.email);
        return { ok: false, message: '⚠️ New device detected. OTP required.', requires2FA: true, user };
    }

    // Check Premium Expiry
    if (user.premiumExpiresAt && Date.now() > user.premiumExpiresAt) {
        users[idx].isPremium = false;
        user.isPremium = false;
    }

    // Update known IP on normal successful login
    users[idx].lastKnownIp = currentIp;
    saveAllUsers(users);

    // Create the session cookie equivalent (mirrors: login_user(user, remember=True))
    const session: SessionData = {
        userId: user.id,
        email: user.email,
        isPremium: user.isPremium,
        expiry: Date.now() + SESSION_TTL_MS,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { ok: true, message: 'Welcome back!', user };
}

export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): SessionData | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        const session = JSON.parse(raw) as SessionData;
        if (Date.now() > session.expiry) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }

        const user = findUserById(session.userId);
        if (user) {
            session.isPremium = user.isPremium;
        }
        return session;
    } catch {
        return null;
    }
}

export function isAdminEmail(email: string): boolean {
    return email.toLowerCase() === 'admin@picklabs.bet';
}

// ─── /upgrade equivalent (VIP code) ─────────────────────────────────────────

export function applyVIPCode(email: string, code: string): { ok: boolean; message: string } {
    if (!VALID_UPGRADE_CODES.includes(code.trim().toUpperCase())) {
        return { ok: false, message: '❌ Invalid VIP Code. Did you CashApp the admin?' };
    }
    const users = getAllUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return { ok: false, message: '❌ No account found for that email.' };

    users[idx].isPremium = true;
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    if (users[idx].premiumExpiresAt && users[idx].premiumExpiresAt! > now) {
        users[idx].premiumExpiresAt = users[idx].premiumExpiresAt! + thirtyDays;
    } else {
        users[idx].premiumExpiresAt = now + thirtyDays;
    }

    saveAllUsers(users);

    const session = getCurrentUser();
    if (session && session.email.toLowerCase() === email.toLowerCase()) {
        session.isPremium = true;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    return { ok: true, message: `🎉 SUCCESS! ${email} has been upgraded to Premium for 30 Days!` };
}

// ─── Admin actions (/admin_action) ───────────────────────────────────────────

export function adminUpgrade(userId: string): void {
    const users = getAllUsers();
    const u = users.find(u => u.id === userId);
    if (u) { u.isPremium = true; saveAllUsers(users); }
}

export function adminDowngrade(userId: string): void {
    const users = getAllUsers();
    const u = users.find(u => u.id === userId);
    if (u) { u.isPremium = false; saveAllUsers(users); }
}

export function adminDelete(userId: string): void {
    const all = getAllUsers();
    const target = all.find(u => u.id === userId);
    if (target) {
        adminDeleteUserBets(target.email);
    }
    const users = all.filter(u => u.id !== userId);
    saveAllUsers(users);
}
