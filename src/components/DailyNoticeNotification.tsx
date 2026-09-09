import React, { useState, useEffect } from 'react';
import { X, Flame, Bell, ChevronRight, Sparkles } from 'lucide-react';
import { 
  getActiveDailyNotification, 
  ActiveDailyNotification,
  NOTIFICATION_BROADCAST_EVENT 
} from '../utils/notifications';

interface DailyNoticeProps {
  onNavigate?: (page: string) => void;
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isSmallScreen;
}

export const DailyNoticeNotification: React.FC<DailyNoticeProps> = ({ onNavigate }) => {
  const [notice, setNotice] = useState<ActiveDailyNotification | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only display on phones / mobile devices
    if (!isMobileDevice()) return;

    // 1. Initial check on mount
    getActiveDailyNotification().then((data) => {
      if (data) {
        const dismissedId = sessionStorage.getItem('chabad_daily_notice_dismissed_id');
        if (dismissedId !== data.id) {
          setNotice(data);
          setIsOpen(true);
        }
      }
    });

    // 2. Real-time DOM event listener (fires when admin sends broadcast in same window)
    const handleCustomBroadcast = (event: any) => {
      if (event.detail) {
        setNotice(event.detail);
        setIsOpen(true);
      }
    };
    window.addEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);

    // 3. Real-time BroadcastChannel listener (fires across multiple tabs/windows simultaneously)
    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel('chabad_notifications_channel');
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'NEW_BROADCAST' && event.data.notice) {
            setNotice(event.data.notice);
            setIsOpen(true);
          }
        };
      } catch (e) {
        // continue
      }
    }

    // 4. Real-time storage listener (for across tabs fallback)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'chabad_active_daily_notification_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setNotice(parsed);
          setIsOpen(true);
        } catch (err) {
          // continue
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(NOTIFICATION_BROADCAST_EVENT, handleCustomBroadcast);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (notice?.id) {
      sessionStorage.setItem('chabad_daily_notice_dismissed_id', notice.id);
    }
  };

  const handleClickLink = () => {
    if (notice?.url) {
      const page = notice.url.replace('/#', '').replace('/', '');
      if (page && onNavigate) {
        onNavigate(page || 'home');
      } else {
        window.location.hash = page || '';
      }
    }
    handleClose();
  };

  if (!isOpen || !notice) return null;

  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 md:hidden">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-chabad-gold/50 relative overflow-hidden group">
        
        {/* Decorative Top Amber Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-chabad-gold to-amber-600"></div>

        {/* Prominent X Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-1.5 rounded-full transition-colors z-10"
          title="Fechar aviso (X)"
          aria-label="Fechar aviso"
        >
          <X className="w-4 h-4 text-slate-300 hover:text-white" />
        </button>

        <div className="flex items-start gap-3.5 pr-6">
          {/* Icon Badge */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Beit Chabad Curitiba
              </span>
            </div>

            <h4 className="font-serif font-bold text-sm sm:text-base text-amber-200 leading-tight">
              {notice.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
              {notice.body}
            </p>

            {/* Action link */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={handleClickLink}
                className="inline-flex items-center text-xs font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-400/60 underline-offset-2 transition-colors gap-1"
              >
                <span>Acessar Detalhes</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClose}
                className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                Fechar (X)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
