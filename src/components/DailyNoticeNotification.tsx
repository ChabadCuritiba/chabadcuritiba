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
    // 1. Poller for newly broadcasted notifications by the admin
    const checkForNewBroadcasts = async () => {
      if (typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') return;

      // Query latest broadcast notice in Supabase events table
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/events?category=eq.Notificacao&order=created_at.desc&limit=1`, {
          headers: HEADERS
        });
        if (res.ok) {
          const rows = await res.json();
          if (Array.isArray(rows) && rows.length > 0) {
            const noticeRow = rows[0];
            const highlights: string[] = Array.isArray(noticeRow.highlights) ? noticeRow.highlights : [];
            const urlTag = highlights.find((h: string) => typeof h === 'string' && h.startsWith('__broadcast_url:'));
            const timeTag = highlights.find((h: string) => typeof h === 'string' && h.startsWith('__broadcast_time:'));

            const noticeId = noticeRow.id;
            const noticeUrl = urlTag ? urlTag.replace('__broadcast_url:', '') : '/#home';
            const noticeTime = timeTag ? Number(timeTag.replace('__broadcast_time:', '')) : new Date(noticeRow.created_at).getTime();

            const lastDeliveredId = localStorage.getItem('chabad_last_delivered_broadcast_id');

            // If not yet delivered and was broadcasted in the last 45 minutes
            if (lastDeliveredId !== noticeId) {
              const isRecent = Math.abs(Date.now() - noticeTime) < 45 * 60 * 1000;
              localStorage.setItem('chabad_last_delivered_broadcast_id', noticeId);
              
              // Only alert if actually broadcasted recently (avoids spamming historical notifications on first visit)
              if (isRecent) {
                showLocalSystemNotification(
                  noticeRow.title || '🕯️ Beit Chabad Curitiba', 
                  noticeRow.subtitle || noticeRow.description || '', 
                  noticeUrl
                );
              }
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

    // 2. Real-time DOM event listener (fires when admin sends broadcast in same window)
    const handleCustomBroadcast = (event: any) => {
      if (event.detail && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        showLocalSystemNotification(event.detail.title, event.detail.body, event.detail.url);
      }
    };
    window.addEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);

    // 3. Real-time BroadcastChannel listener (across open browser tabs)
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
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkForNewBroadcasts);
      window.removeEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  return null;
};
