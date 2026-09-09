/**
 * Firebase Authentication & Role Management for Beit Chabad Curitiba
 * Super Admins: shueystolik@gmail.com, mendys@gmail.com
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseClient';

const firebaseConfig = {
  projectId: "chabadcuritiba",
  appId: "1:943793109445:web:bde4d5bc46c0ce9c9a33ac",
  storageBucket: "chabadcuritiba.firebasestorage.app",
  apiKey: "AIzaSyAhMuU1SRxAk7KmuRZTb2wJNQrF9uSHYP4",
  authDomain: "chabadcuritiba.firebaseapp.com",
  messagingSenderId: "943793109445"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Permanent Hardcoded Super Admins (Full unrestricted access)
export const HARDCODED_SUPER_ADMINS = [
  'shueystolik@gmail.com',
  'mendys@gmail.com'
];

export type AdminRole = 'super_admin' | 'admin' | 'receptionist';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: AdminRole;
  addedBy?: string;
  createdAt?: string;
}

const LOCAL_ADMINS_KEY = 'chabad_curitiba_authorized_admins_v2';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

/**
 * Sign in with Google Popup (forces account selection prompt)
 */
export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ 
    prompt: 'select_account' 
  });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

/**
 * Sign Out
 */
export async function signOutAdmin(): Promise<void> {
  await firebaseSignOut(auth);
  localStorage.removeItem('chabad_curitiba_current_admin_session');
}

/**
 * Check if an email is authorized and get their role
 */
export async function getAdminRoleForEmail(email: string): Promise<AdminRole | null> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Permanent Super Admins
  if (HARDCODED_SUPER_ADMINS.map(e => e.toLowerCase()).includes(cleanEmail)) {
    return 'super_admin';
  }

  // 2. Query dynamically configured admins from Supabase / cache
  try {
    const admins = await fetchAuthorizedAdmins();
    const found = admins.find(a => a.email.toLowerCase() === cleanEmail);
    if (found) {
      return found.role;
    }
  } catch (err) {
    console.warn('[AdminAuth] Error checking role:', err);
  }

  return null;
}

/**
 * Fetch all registered admins
 */
export async function fetchAuthorizedAdmins(): Promise<AdminUser[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/admins?select=*&order=created_at.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: AdminUser[] = rows.map(r => ({
          id: r.id,
          email: r.email,
          name: r.name || r.email.split('@')[0],
          role: r.role || 'admin',
          addedBy: r.added_by,
          createdAt: r.created_at
        }));
        localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[AdminAuth] Error fetching admins from Supabase:', err);
  }

  // Fallback to local cache
  try {
    const raw = localStorage.getItem(LOCAL_ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add or update an authorized admin (Super Admin privilege)
 */
export async function saveAuthorizedAdmin(admin: { email: string; name?: string; role: AdminRole; addedBy: string }): Promise<void> {
  const cleanEmail = admin.email.trim().toLowerCase();
  const id = 'adm-' + cleanEmail.replace(/[^a-z0-9]/g, '_');
  
  const record: AdminUser = {
    id,
    email: cleanEmail,
    name: admin.name || cleanEmail.split('@')[0],
    role: admin.role,
    addedBy: admin.addedBy,
    createdAt: new Date().toISOString()
  };

  // 1. Update local cache
  const current = await fetchAuthorizedAdmins();
  const updated = [record, ...current.filter(a => a.email.toLowerCase() !== cleanEmail)];
  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(updated));

  // 2. Persist to Supabase
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/admins`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: record.id,
        email: record.email,
        name: record.name,
        role: record.role,
        added_by: record.addedBy
      })
    });
  } catch (err) {
    console.warn('[AdminAuth] Error saving admin to Supabase:', err);
  }
}

/**
 * Remove an authorized admin (Super Admin privilege)
 */
export async function deleteAuthorizedAdmin(email: string): Promise<void> {
  const cleanEmail = email.trim().toLowerCase();

  // Protect hardcoded super admins
  if (HARDCODED_SUPER_ADMINS.map(e => e.toLowerCase()).includes(cleanEmail)) {
    throw new Error('Não é permitido remover os Super Administradores principais.');
  }

  // 1. Update local cache
  const current = await fetchAuthorizedAdmins();
  const updated = current.filter(a => a.email.toLowerCase() !== cleanEmail);
  localStorage.setItem(LOCAL_ADMINS_KEY, JSON.stringify(updated));

  // 2. Delete from Supabase
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/admins?email=eq.${cleanEmail}`, {
      method: 'DELETE',
      headers: HEADERS
    });
  } catch (err) {
    console.warn('[AdminAuth] Error deleting admin from Supabase:', err);
  }
}
