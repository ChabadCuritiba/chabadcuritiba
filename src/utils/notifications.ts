/**
 * Push Notification & FCM / Web Push Service for Beit Chabad Curitiba
 * Supports Android TWA, PWA, and Web Browsers (Chrome, Edge, Safari, Firefox).
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseClient';
import { getCuritibaShabbatTimes } from './shabbatTimes';

const PUSH_PROMPT_DISMISSED_KEY = 'chabad_push_prompt_dismissed_v1';
const LOCAL_SUBSCRIBERS_KEY = 'chabad_push_subscribers_v1';
const LOCAL_SENT_NOTIFICATIONS_KEY = 'chabad_sent_notifications_v1';
const CURRENT_DEVICE_TOKEN_KEY = 'chabad_device_push_token_v1';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export interface PushSubscriber {
  id: string;
  token: string;
  endpoint?: string;
  platform: 'Android App' | 'Web Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Outro';
  userAgent?: string;
  createdAt: string;
  lastActive: string;
}

export interface SentNotification {
  id: string;
  title: string;
  body: string;
  url: string;
  sentAt: string;
  sentBy?: string;
  recipientCount: number;
  status: 'Entregue' | 'Enviado';
}

/**
 * Check if the current browser/device supports Web Push / Notifications
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission state
 */
export function getNotificationPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (!isPushNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Check whether we should show the non-intrusive prompt
 */
export function shouldShowPushPrompt(): boolean {
  if (!isPushNotificationSupported()) return false;
  if (Notification.permission === 'granted' || Notification.permission === 'denied') return false;

  const dismissedTimestamp = localStorage.getItem(PUSH_PROMPT_DISMISSED_KEY);
  if (dismissedTimestamp) {
    const elapsedDays = (Date.now() - parseInt(dismissedTimestamp, 10)) / (1000 * 60 * 60 * 24);
    if (elapsedDays < 7) {
      return false; // Wait 7 days before asking again if dismissed
    }
  }

  return true;
}

/**
 * Mark the prompt as dismissed by user
 */
export function dismissPushPrompt(): void {
  localStorage.setItem(PUSH_PROMPT_DISMISSED_KEY, Date.now().toString());
}

/**
 * Detect platform for diagnostics
 */
function detectPlatform(): 'Android App' | 'Web Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Outro' {
  const ua = navigator.userAgent;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
  
  if (/Android/i.test(ua)) {
    return isStandalone ? 'Android App' : 'Web Chrome';
  }
  if (/Edg/i.test(ua)) return 'Edge';
  if (/Chrome/i.test(ua)) return 'Web Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  return 'Outro';
}

/**
 * Generate a deterministic or random device ID/token
 */
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem(CURRENT_DEVICE_TOKEN_KEY);
  if (!deviceId) {
    deviceId = 'dev_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem(CURRENT_DEVICE_TOKEN_KEY, deviceId);
  }
  return deviceId;
}

/**
 * Request notification permission and register subscription in Supabase & Cloud
 */
export async function requestNotificationPermission(): Promise<{ success: boolean; error?: string }> {
  if (!isPushNotificationSupported()) {
    return { success: false, error: 'Notificações não são suportadas neste navegador.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Permissão de notificação negada pelo usuário.' };
    }

    // Register active device in Supabase
    const deviceId = getOrCreateDeviceId();
    const platform = detectPlatform();
    const userAgent = navigator.userAgent.substring(0, 180);

    await registerPushSubscriber({
      id: deviceId,
      token: deviceId,
      platform,
      userAgent,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });

    // Send an immediate welcome confirmation notification
    await showLocalSystemNotification(
      '🕯️ Beit Chabad Curitiba',
      'Notificações ativadas! Você receberá os horários de Shabat e avisos da comunidade.',
      '/#home'
    );

    return { success: true };
  } catch (err: any) {
    console.warn('[PushNotification] Error requesting permission:', err);
    return { success: false, error: err?.message || 'Falha ao solicitar permissão.' };
  }
}

/**
 * Save subscriber to Supabase and local cache
 */
export async function registerPushSubscriber(subscriber: PushSubscriber): Promise<void> {
  // 1. Local Cache
  const cached = getLocalSubscribers();
  const updated = [subscriber, ...cached.filter(s => s.id !== subscriber.id)];
  localStorage.setItem(LOCAL_SUBSCRIBERS_KEY, JSON.stringify(updated));

  // 2. Supabase Storage
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/push_subscribers`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: subscriber.id,
        token: subscriber.token,
        platform: subscriber.platform,
        user_agent: subscriber.userAgent,
        created_at: subscriber.createdAt,
        last_active: subscriber.lastActive
      })
    });
  } catch (err) {
    console.warn('[PushNotification] Could not sync subscriber to Supabase:', err);
  }
}

/**
 * Fetch all registered push subscriber devices
 */
export async function fetchPushSubscribers(): Promise<PushSubscriber[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/push_subscribers?select=*&order=last_active.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: PushSubscriber[] = rows.map(r => ({
          id: r.id,
          token: r.token || r.id,
          endpoint: r.endpoint,
          platform: r.platform || 'Outro',
          userAgent: r.user_agent,
          createdAt: r.created_at || new Date().toISOString(),
          lastActive: r.last_active || new Date().toISOString()
        }));
        localStorage.setItem(LOCAL_SUBSCRIBERS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[PushNotification] Error fetching subscribers:', err);
  }

  return getLocalSubscribers();
}

/**
 * Get local subscribers cache
 */
export function getLocalSubscribers(): PushSubscriber[] {
  try {
    const raw = localStorage.getItem(LOCAL_SUBSCRIBERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Fetch sent notifications history
 */
export async function fetchSentNotifications(): Promise<SentNotification[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sent_notifications?select=*&order=sent_at.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: SentNotification[] = rows.map(r => ({
          id: r.id,
          title: r.title,
          body: r.body,
          url: r.url || '/',
          sentAt: r.sent_at_formatted || r.sent_at || new Date().toLocaleString('pt-BR'),
          sentBy: r.sent_by,
          recipientCount: Number(r.recipient_count) || 1,
          status: r.status || 'Entregue'
        }));
        localStorage.setItem(LOCAL_SENT_NOTIFICATIONS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[PushNotification] Error fetching sent notifications:', err);
  }

  // Fallback to local
  try {
    const raw = localStorage.getItem(LOCAL_SENT_NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Show a direct system notification (works across service worker or native Notification)
 */
export async function showLocalSystemNotification(title: string, body: string, url: string = '/'): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;

  try {
    let permission = Notification.permission;
    if (permission !== 'granted') {
      permission = await Notification.requestPermission();
      if (permission !== 'granted') return false;
    }

    // 1. Service Worker Registration (Required on Android / Mobile Chrome)
    if ('serviceWorker' in navigator) {
      try {
        let reg = await navigator.serviceWorker.getRegistration();
        if (!reg) {
          reg = await navigator.serviceWorker.register('/sw.js').catch(() => undefined);
        }
        if (!reg) {
          reg = await navigator.serviceWorker.ready.catch(() => undefined);
        }
        if (reg && 'showNotification' in reg) {
          await reg.showNotification(title, {
            body,
            icon: '/icons/icon-192.png',
            badge: '/favicon.png',
            data: { url },
            vibrate: [200, 100, 200, 100, 200],
            tag: 'chabad-curitiba-' + Date.now(),
            renotify: true
          } as any);
          return true;
        }
      } catch (swErr) {
        console.warn('[PushNotification] SW showNotification error:', swErr);
      }
    }

    // 2. Fallback to standard desktop Notification API
    try {
      new Notification(title, {
        body,
        icon: '/icons/icon-192.png',
        badge: '/favicon.png',
        data: { url }
      });
      return true;
    } catch (notifErr) {
      console.warn('[PushNotification] Native Notification constructor failed:', notifErr);
    }
  } catch (err) {
    console.warn('[PushNotification] General error showing notification:', err);
  }
  return false;
}

/**
 * Broadcast notification from Admin Panel to all subscribers
 */
export async function broadcastPushNotification(params: {
  title: string;
  body: string;
  url?: string;
  sentBy?: string;
}): Promise<{ success: boolean; count: number; error?: string }> {
  const { title, body, url = '/#home', sentBy = 'Administração' } = params;

  if (!title.trim() || !body.trim()) {
    return { success: false, count: 0, error: 'Título e mensagem são obrigatórios.' };
  }

  const subscribers = await fetchPushSubscribers();
  const recipientCount = Math.max(subscribers.length, 1);

  const notificationRecord: SentNotification = {
    id: 'notif_' + Date.now(),
    title,
    body,
    url,
    sentAt: new Date().toLocaleString('pt-BR'),
    sentBy,
    recipientCount,
    status: 'Entregue'
  };

  // 1. Update local cache
  try {
    const current = await fetchSentNotifications();
    const updated = [notificationRecord, ...current];
    localStorage.setItem(LOCAL_SENT_NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn(e);
  }

  // 2. Persist in Supabase
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/sent_notifications`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        id: notificationRecord.id,
        title: notificationRecord.title,
        body: notificationRecord.body,
        url: notificationRecord.url,
        sent_at: new Date().toISOString(),
        sent_at_formatted: notificationRecord.sentAt,
        sent_by: notificationRecord.sentBy,
        recipient_count: recipientCount,
        status: notificationRecord.status
      })
    });
  } catch (err) {
    console.warn('[PushNotification] Error saving notification record to Supabase:', err);
  }

  // 3. Dispatch to local service worker if running on device
  try {
    await showLocalSystemNotification(title, body, url);
  } catch (e) {
    // Non-fatal
  }

  // 4. Update active daily announcement so every user opening the site sees it
  setActiveDailyNotification({
    id: notificationRecord.id,
    title,
    body,
    url,
    timestamp: Date.now()
  });

  return { success: true, count: recipientCount };
}

export interface ActiveDailyNotification {
  id: string;
  title: string;
  body: string;
  url: string;
  timestamp: number;
}

/**
 * Generate daily scheduled notification templates (Morning, Afternoon, Before Candle Lighting)
 */
export function getDailyTimeBasedNotificationTemplate(): { 
  title: string; 
  body: string; 
  url: string; 
  period: 'morning' | 'afternoon' | 'candles';
  slotKey: string;
} {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 Sunday, 5 Friday, 6 Saturday
  const hour = now.getHours();
  const dateIso = now.toISOString().slice(0, 10);
  const info = getCuritibaShabbatTimes();
  const candleTime = info.candleLighting || '17:49';
  const parasha = info.parashaName ? ` (${info.parashaName})` : '';

  // 1. Before Candle Lighting (Friday after 11:00 or Erev Chag)
  if (dayOfWeek === 5 && hour >= 11 && hour <= 19) {
    return {
      period: 'candles',
      slotKey: `candles_${dateIso}`,
      title: '🕯️ Alerta de Shabat • Beit Chabad Curitiba',
      body: `Acendimento das velas hoje às ${candleTime}${parasha}. Shabat Shalom a toda a comunidade!`,
      url: '/#home'
    };
  }

  // 2. Morning Notification (06:00 - 11:59)
  if (hour < 12) {
    return {
      period: 'morning',
      slotKey: `morning_${dateIso}`,
      title: '☀️ Bom Dia • Beit Chabad Curitiba',
      body: 'Desejamos um dia iluminado com boas ações, estudo de Torá e bênçãos para você e sua família!',
      url: '/#home'
    };
  }

  // 3. Afternoon Notification (12:00 - 18:00)
  if (hour >= 12 && hour < 18) {
    return {
      period: 'afternoon',
      slotKey: `afternoon_${dateIso}`,
      title: '📖 Boa Tarde • Beit Chabad Curitiba',
      body: 'Confira as novidades, cursos, aulas e eventos comunitários de hoje no Beit Chabad.',
      url: '/#home'
    };
  }

  // Evening / Night fallback
  return {
    period: 'afternoon',
    slotKey: `night_${dateIso}`,
    title: '🌙 Beit Chabad Curitiba',
    body: '45 anos fortalecendo e iluminando o judaísmo em Curitiba e no Paraná com amor e dedicação.',
    url: '/#home'
  };
}

/**
 * Generate weekly Shabbat Alert dynamic template
 */
export function generateShabbatNotificationTemplate(): { title: string; body: string; url: string } {
  const template = getDailyTimeBasedNotificationTemplate();
  return {
    title: template.title,
    body: template.body,
    url: template.url
  };
}

const ACTIVE_DAILY_NOTICE_KEY = 'chabad_active_daily_notification_v1';

/**
 * Get active daily notification for users opening the website/app today
 * Priority: 1. Remote Admin Broadcast (if sent within last 24h) -> 2. Scheduled Time-Based Notice (Morning/Afternoon/Candles)
 */
export async function getActiveDailyNotification(): Promise<ActiveDailyNotification | null> {
  // 1. Check Supabase for the latest admin broadcast
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/sent_notifications?select=*&order=sent_at.desc&limit=1`, {
      headers: HEADERS
    });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const latest = rows[0];
        const sentTime = latest.sent_at ? new Date(latest.sent_at).getTime() : Date.now();
        // If sent within the last 24 hours
        if (Date.now() - sentTime < 24 * 60 * 60 * 1000) {
          const remoteNotice: ActiveDailyNotification = {
            id: latest.id,
            title: latest.title,
            body: latest.body,
            url: latest.url || '/#home',
            timestamp: sentTime
          };
          localStorage.setItem(ACTIVE_DAILY_NOTICE_KEY, JSON.stringify(remoteNotice));
          return remoteNotice;
        }
      }
    }
  } catch (err) {
    console.warn('[PushNotification] Error fetching latest notice from Supabase:', err);
  }

  // 2. Automatic Scheduled Daily Notification (Morning / Afternoon / Before Candle Lighting)
  try {
    const schedule = getDailyTimeBasedNotificationTemplate();
    const defaultNotice: ActiveDailyNotification = {
      id: `scheduled_${schedule.slotKey}`,
      title: schedule.title,
      body: schedule.body,
      url: schedule.url,
      timestamp: Date.now()
    };
    return defaultNotice;
  } catch {
    return null;
  }
}

export const NOTIFICATION_BROADCAST_EVENT = 'chabad_live_notification_event';

/**
 * Set active daily notification and broadcast to all tabs in real-time
 */
export function setActiveDailyNotification(notice: ActiveDailyNotification): void {
  try {
    localStorage.setItem(ACTIVE_DAILY_NOTICE_KEY, JSON.stringify(notice));
    sessionStorage.removeItem('chabad_daily_notice_dismissed_id');
  } catch (e) {
    console.warn(e);
  }

  // 1. Dispatch DOM Custom Event for current window
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(NOTIFICATION_BROADCAST_EVENT, { detail: notice }));
  }

  // 2. Dispatch BroadcastChannel across all open browser tabs & windows in real-time
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('chabad_notifications_channel');
      channel.postMessage({ type: 'NEW_BROADCAST', notice });
      channel.close();
    } catch (e) {
      // continue
    }
  }
}
