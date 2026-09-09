import React, { useEffect } from 'react';
import { 
  getActiveDailyNotification, 
  showLocalSystemNotification,
  NOTIFICATION_BROADCAST_EVENT 
} from '../utils/notifications';

interface DailyNoticeProps {
  onNavigate?: (page: string) => void;
}

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

    // 2. Real-time DOM event listener (fires when admin sends broadcast)
    const handleCustomBroadcast = (event: any) => {
      if (event.detail && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        showLocalSystemNotification(event.detail.title, event.detail.body, event.detail.url);
      }
    };
    window.addEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);

    // 3. Real-time BroadcastChannel listener
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
      window.removeEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  // Return null so NO floating web card is displayed on the screen; only native Android notification
  return null;
};
