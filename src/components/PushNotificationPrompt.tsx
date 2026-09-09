import React, { useState, useEffect } from 'react';
import { Bell, BellRing, X, CheckCircle2, Flame } from 'lucide-react';
import { 
  shouldShowPushPrompt, 
  dismissPushPrompt, 
  requestNotificationPermission,
  getNotificationPermissionStatus 
} from '../utils/notifications';

export const PushNotificationPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Delay prompt slightly on page load (1.5s) for a smoother UX
    const timer = setTimeout(() => {
      if (shouldShowPushPrompt()) {
        setIsVisible(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAllow = async () => {
    setIsLoading(true);
    const result = await requestNotificationPermission();
    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } else {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    dismissPushPrompt();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 max-w-[calc(100vw-2.5rem)] sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-chabad-gold/40 relative">
        
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="flex items-center gap-3 py-1 text-emerald-400">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Notificações Ativadas!</p>
              <p className="text-xs text-slate-300">Você receberá os horários de velas e avisos importantes.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-chabad-gold/30 to-amber-600/30 border border-chabad-gold/50 flex items-center justify-center flex-shrink-0 text-chabad-gold">
                <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div className="pr-4">
                <h4 className="font-serif font-bold text-base text-amber-300 flex items-center gap-1.5">
                  Horários de Shabat & Avisos
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
                  Gostaria de receber avisos e horários de Shabat no seu celular?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleDismiss}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Agora não
              </button>
              <button
                onClick={handleAllow}
                disabled={isLoading}
                className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block animate-spin mr-1">⏳</span>
                ) : (
                  <BellRing className="w-3.5 h-3.5" />
                )}
                Permitir
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
