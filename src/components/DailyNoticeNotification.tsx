import React, { useEffect } from 'react';
import { 
  getActiveDailyNotification, 
  showLocalSystemNotification,
  NOTIFICATION_BROADCAST_EVENT 
} from '../utils/notifications';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../utils/supabaseClient';

interface DailyNoticeProps {
  onNavigate?: (page: string) => void;
}

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
};

export const DailyNoticeNotification: React.FC<DailyNoticeProps> = () => {
  useEffect(() => {
    // 1. Initial check on mount: If user has enabled notifications, trigger the system notification on their phone
    getActiveDailyNotification().then((data) => {
      if (data && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const lastShownId = sessionStorage.getItem('chabad_last_system_notif_id');
        if (lastShownId !== data.id) {
          sessionStorage.setItem('chabad_last_system_notif_id', data.id);
          showLocalSystemNotification(data.title, data.body, data.url);
        }
      }
    });

    // 2. Real-time Supabase Poller for newly broadcasted notifications
    const checkForNewBroadcasts = async () => {
      if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;

      // A. Check live_broadcast_notice row in Supabase events table
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/events?id=eq.live_broadcast_notice&select=*`, {
          headers: HEADERS
        });
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const noticeRow = rows[0];
            const highlights: string[] = Array.isArray(noticeRow.highlights) ? noticeRow.highlights : [];
            const idTag = highlights.find((h: string) => typeof h === 'string' && h.startsWith('__broadcast_id:'));
            const urlTag = highlights.find((h: string) => typeof h === 'string' && h.startsWith('__broadcast_url:'));
            const timeTag = highlights.find((h: string) => typeof h === 'string' && h.startsWith('__broadcast_time:'));

            const noticeId = idTag ? idTag.replace('__broadcast_id:', '') : (noticeRow.id + '_' + noticeRow.created_at);
            const noticeUrl = urlTag ? urlTag.replace('__broadcast_url:', '') : '/#home';
            const noticeTime = timeTag ? Number(timeTag.replace('__broadcast_time:', '')) : new Date(noticeRow.created_at).getTime();

            const lastDeliveredId = localStorage.getItem('chabad_last_delivered_broadcast_id');
            // If new and broadcasted within the last 2 hours
            if (lastDeliveredId !== noticeId && (Math.abs(Date.now() - noticeTime) < 2 * 60 * 60 * 1000)) {
              localStorage.setItem('chabad_last_delivered_broadcast_id', noticeId);
              showLocalSystemNotification(noticeRow.title, noticeRow.subtitle || noticeRow.description || '', noticeUrl);
            }
          }
        }
      } catch (e) {
        // continue
      }

      // B. Check sent_notifications table (when created)
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/sent_notifications?select=*&order=sent_at.desc&limit=1`, {
          headers: HEADERS
        });
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const latest = rows[0];
            const lastDeliveredId = localStorage.getItem('chabad_last_delivered_broadcast_id');
            const sentTime = latest.sent_at ? new Date(latest.sent_at).getTime() : Date.now();
            
            // If sent within the last 2 hours and not yet delivered to this device
            if (lastDeliveredId !== latest.id && (Math.abs(Date.now() - sentTime) < 2 * 60 * 60 * 1000)) {
              localStorage.setItem('chabad_last_delivered_broadcast_id', latest.id);
              showLocalSystemNotification(latest.title, latest.body, latest.url || '/#home');
            }
          }
        }
      } catch (e) {
        // continue
      }
    };

    checkForNewBroadcasts();
    const pollInterval = setInterval(checkForNewBroadcasts, 3000); // Check every 3 seconds

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForNewBroadcasts();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkForNewBroadcasts);

    // 3. Real-time DOM event listener (fires when admin sends broadcast in same window)
    const handleCustomBroadcast = (event: any) => {
      if (event.detail && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        showLocalSystemNotification(event.detail.title, event.detail.body, event.detail.url);
      }
    };
    window.addEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);

    // 4. Real-time BroadcastChannel listener (across open browser tabs)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('chabad_notifications_channel');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_BROADCAST' && event.data.notice) {
            if ('Notification' in window && Notification.permission === 'granted') {
              showLocalSystemNotification(event.data.notice.title, event.data.notice.body, event.data.notice.url);
            }
          }
        };
      } catch (e) {
        // continue
      }
    }

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Return null so NO floating web card is displayed on the screen; only native Android notification
  return null;
};
