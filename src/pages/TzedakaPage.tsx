import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Flame, CheckCircle2, 
  Copy, Check, ArrowRight, Coins, ShieldCheck,
  History, Calendar, Award, Info, ArrowLeft, Volume2, VolumeX, RotateCcw
} from 'lucide-react';
import { 
  getInitialPushkaState, 
  dropCoinIntoPushka, 
  emptyPushka, 
  PushkaState, 
  playCoinClinkSound
} from '../utils/tzedakaManager';
import { generatePixQrCodeUrl, generatePixCopyPaste } from '../utils/pix';
import { saveSupabaseDonation } from '../utils/supabaseClient';
import { triggerSafeConfetti } from '../utils/qrCodeHelper';

interface TzedakaPageProps {
  onNavigate?: (page: string) => void;
}

const PRESET_COINS = [
  { label: 'R$ 1', value: 1 },
  { label: 'R$ 2', value: 2 },
  { label: 'R$ 5', value: 5 },
  { label: 'R$ 10', value: 10 },
  { label: 'R$ 18 (Chai ✡️)', value: 18 },
  { label: 'R$ 36', value: 36 },
  { label: 'R$ 54', value: 54 },
  { label: 'R$ 100', value: 100 }
];

export const TzedakaPage: React.FC<TzedakaPageProps> = ({ onNavigate }) => {
  const [pushkaState, setPushkaState] = useState<PushkaState>(getInitialPushkaState());
  const [selectedCoin, setSelectedCoin] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [activeCoinAnim, setActiveCoinAnim] = useState<{ value: number; id: number } | null>(null);
  const [pushkaJiggling, setPushkaJiggling] = useState<boolean>(false);
  const [showPixCheckout, setShowPixCheckout] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [hebrewName, setHebrewName] = useState<string>('');
  const [isEmptiedSuccess, setIsEmptiedSuccess] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [sparkleActive, setSparkleActive] = useState<boolean>(false);

  useEffect(() => {
    setPushkaState(getInitialPushkaState());

    const handleUpdate = (e: any) => {
      if (e.detail) setPushkaState(e.detail);
    };
    window.addEventListener('chabad_pushka_updated', handleUpdate);
    return () => window.removeEventListener('chabad_pushka_updated', handleUpdate);
  }, []);

  const currentCoinValue = customAmount ? (Number(customAmount) || 0) : selectedCoin;

  const handleDropCoin = () => {
    const val = currentCoinValue;
    if (val <= 0 || isDropping) return;

    setIsDropping(true);
    setActiveCoinAnim({ value: val, id: Date.now() });

    if (soundEnabled) {
      playCoinClinkSound();
    }

    // Phone vibration
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 80]);
      } catch (e) {}
    }

    // Pushka jiggle as coin enters slot
    setTimeout(() => {
      setPushkaJiggling(true);
      setSparkleActive(true);
    }, 420);

    setTimeout(() => {
      const updated = dropCoinIntoPushka(val);
      setPushkaState(updated);
      setIsDropping(false);
      setActiveCoinAnim(null);
      setPushkaJiggling(false);
      setSparkleActive(false);
    }, 750);
  };

  const handleStartPixCheckout = () => {
    if (pushkaState.balance <= 0) return;
    setShowPixCheckout(true);
    setIsEmptiedSuccess(false);
  };

  const pixAmount = pushkaState.balance;
  const pixCode = generatePixCopyPaste(pixAmount, 'Tsedaca Digital Beit Chabad Curitiba');
  const qrCodeUrl = generatePixQrCodeUrl(pixCode);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleConfirmPixPayment = async () => {
    const donationRecord: any = {
      id: 'don_' + Date.now(),
      donorName: donorName.trim() || 'Doador Tsedacá Digital',
      email: 'contato@chabadcuritiba.com',
      hebrewName: hebrewName.trim() || undefined,
      amount: pixAmount,
      currency: 'BRL',
      paymentMethod: 'pix',
      purpose: 'Tsedacá Diária (Cofrinho Esvaziado)',
      createdAt: new Date().toISOString(),
      status: 'completed',
      source: 'pushka_digital'
    };

    try {
      await saveSupabaseDonation(donationRecord);
    } catch (e) {
      console.warn('Supabase donation record save:', e);
    }

    emptyPushka();
    setPushkaState(getInitialPushkaState());
    setIsEmptiedSuccess(true);
    triggerSafeConfetti();

    setTimeout(() => {
      setShowPixCheckout(false);
      setIsEmptiedSuccess(false);
    }, 4500);
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate('home');
    } else {
      window.location.hash = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-900 font-sans">
      <style>{`
        @keyframes coinDropIntoPushka {
          0% {
            opacity: 0;
            transform: translate(-50%, -150px) scale(1.3) rotateX(15deg) rotateY(0deg);
          }
          25% {
            opacity: 1;
            transform: translate(-50%, -75px) scale(1.1) rotateX(45deg) rotateY(180deg);
          }
          65% {
            opacity: 1;
            transform: translate(-50%, -12px) scale(0.75) rotateX(75deg) rotateY(360deg);
          }
          90% {
            opacity: 0.95;
            transform: translate(-50%, 5px) scale(0.32) rotateX(85deg) rotateY(540deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, 18px) scale(0.08) rotateX(90deg) rotateY(720deg);
          }
        }

        @keyframes pushkaRattlePhysics {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.02) rotate(-1.5deg) translateY(-3px); }
          40% { transform: scale(0.99) rotate(1.5deg) translateY(2px); }
          60% { transform: scale(1.01) rotate(-1deg); }
          80% { transform: scale(0.995) rotate(0.5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        .animate-coin-drop-slot {
          animation: coinDropIntoPushka 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .animate-pushka-jiggle-physics {
          animation: pushkaRattlePhysics 0.4s ease-in-out;
        }

        .gold-coin-glow {
          box-shadow: 0 0 25px rgba(234, 179, 8, 0.55), inset 0 2px 4px rgba(255, 255, 255, 0.9), inset 0 -2px 4px rgba(113, 63, 18, 0.9);
        }
      `}</style>

      {/* Top Header Bar */}
      <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-3 sticky top-0 z-30 flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 font-semibold text-sm transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-amber-400/40 flex items-center justify-center transition-colors">
            <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="hidden sm:inline">Voltar ao Beit Chabad</span>
          <span className="sm:hidden">Voltar</span>
        </button>

        {/* Center Title */}
        <div className="flex items-center space-x-2 text-center">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
          <h1 className="font-serif text-sm sm:text-base font-bold text-amber-300 tracking-wide">
            Cofrinho de Tsedacá Digital
          </h1>
        </div>

        {/* Right Tools */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 border border-white/10 transition-colors"
            title={soundEnabled ? 'Silenciar som das moedas' : 'Ativar som das moedas'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button 
            onClick={() => setShowHistoryModal(true)}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-amber-400 border border-white/10 text-xs font-semibold flex items-center space-x-1 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Extrato</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Stage: Pushka & Controls Closely Aligned */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full flex flex-col justify-center items-center">
        
        {/* Top Badges (Streak & Total in Pushka) */}
        <div className="w-full max-w-lg flex items-center justify-between gap-3 mb-3 px-1">
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl px-3.5 py-1.5 flex items-center space-x-2 shadow-md backdrop-blur-md">
            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
            <div>
              <div className="text-[9px] uppercase font-bold text-amber-400/80 leading-none">Sequência</div>
              <div className="text-xs font-bold text-white leading-tight">
                {pushkaState.currentStreak || 0} {(pushkaState.currentStreak || 0) === 1 ? 'Dia' : 'Dias'}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-600/30 to-amber-500/20 border border-amber-400/40 rounded-xl px-3.5 py-1.5 flex items-center space-x-2 shadow-md backdrop-blur-md">
            <Coins className="w-4 h-4 text-amber-300" />
            <div>
              <div className="text-[9px] uppercase font-bold text-amber-300 leading-none">Total no Cofrinho</div>
              <div className="text-sm font-black text-amber-200 leading-tight">
                R$ {pushkaState.balance.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
        </div>

        {/* COMBINED HERO: Physical Pushka + Immediate Controls */}
        <div className="w-full max-w-lg bg-slate-900/80 border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          
          {/* Subtle Ambient Aura */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

          {/* THE PUSHKA CANISTER (Compact size so everything fits on 1 screen) */}
          <div className="relative w-48 sm:w-56 flex justify-center items-center my-1">
            
            {/* Active Falling 3D Coin calibrated right into the slot at 11.5% */}
            {activeCoinAnim && (
              <div 
                className="absolute z-30 top-[11.5%] left-1/2 -translate-x-1/2 pointer-events-none animate-coin-drop-slot"
                key={activeCoinAnim.id}
              >
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-yellow-100 border-2 border-yellow-200 gold-coin-glow flex flex-col items-center justify-center text-slate-950 font-black text-xs drop-shadow-2xl">
                  <span>R$ {activeCoinAnim.value}</span>
                  <span className="text-[8px] opacity-80 leading-none">✡️</span>
                </div>
              </div>
            )}

            {/* Sparkle FX */}
            {sparkleActive && (
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-yellow-300 animate-spin" />
              </div>
            )}

            {/* Pushka Image with Jiggle */}
            <div className={`w-full transform transition-transform ${pushkaJiggling ? 'animate-pushka-jiggle-physics' : ''}`}>
              <img 
                src="/assets/pushka_official.png" 
                alt="Cofrinho Oficial Beit Chabad" 
                className="w-full h-auto object-contain max-h-[260px] sm:max-h-[300px] drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)] select-none pointer-events-none mx-auto"
              />
            </div>
          </div>

          {/* COIN SELECTION TRAY: Right under the Pushka */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800/80">
            
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <Coins className="w-3.5 h-3.5 mr-1 text-amber-400" />
                Valor da Moeda:
              </span>
              <span className="text-xs text-amber-300 font-extrabold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                R$ {currentCoinValue}
              </span>
            </div>

            {/* Preset Coins Grid */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESET_COINS.map((c) => {
                const isSelected = selectedCoin === c.value && !customAmount;
                return (
                  <button
                    key={c.value}
                    onClick={() => {
                      setSelectedCoin(c.value);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-500 to-yellow-600 border-amber-300 text-slate-950 font-black shadow-md scale-105 gold-coin-glow'
                        : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:border-amber-500/40'
                    }`}
                  >
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Amount + Main Deposit Button */}
            <div className="flex items-center gap-2">
              <div className="relative w-28 sm:w-32">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Outro..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl pl-7 pr-2 py-2.5 text-xs sm:text-sm font-bold text-white outline-none"
                />
              </div>

              <button
                onClick={handleDropCoin}
                disabled={isDropping || currentCoinValue <= 0}
                className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-2.5 sm:py-3 px-4 rounded-xl shadow-gold hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-slate-950 animate-bounce" />
                <span>{isDropping ? 'Colocando...' : `Colocar R$ ${currentCoinValue} no Cofrinho`}</span>
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM ACTION: Empty & Transfer via PIX */}
        <div className="w-full max-w-lg mt-3 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 shadow-lg flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Esvaziar Cofrinho (PIX)</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Acumulado: <strong className="text-amber-300 font-bold">R$ {pushkaState.balance.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>

          <button
            onClick={handleStartPixCheckout}
            disabled={pushkaState.balance <= 0}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-40"
          >
            <span>Transferir PIX</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </main>

      {/* PIX Checkout Fullscreen Modal */}
      {showPixCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-100 relative max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setShowPixCheckout(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10"
            >
              ✕
            </button>

            {isEmptiedSuccess ? (
              <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-emerald-300">
                  Tizkú LeMitzvot! Tsedacá Enviada!
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Seu cofrinho foi esvaziado e a doação registrada com sucesso. Que o Todo-Poderoso retribua com muita saúde, paz, bênçãos e prosperidade!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PIX Oficial Beit Chabad</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Esvaziar Cofrinho (PIX)
                  </h3>
                  <div className="text-3xl font-black text-amber-400 mt-2 font-serif">
                    R$ {pixAmount.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* QR Code Frame */}
                <div className="bg-white p-4 rounded-2xl w-52 h-52 mx-auto shadow-xl flex items-center justify-center border-4 border-amber-400">
                  <img 
                    src={qrCodeUrl} 
                    alt="PIX QR Code" 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Copy Paste Code */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">
                    Chave PIX Copia e Cola:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={pixCode}
                      className="bg-slate-950 text-slate-300 text-xs px-3 py-2.5 rounded-xl flex-1 border border-slate-700 outline-none font-mono truncate select-all"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors shrink-0"
                    >
                      {pixCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                      <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>

                {/* Donor Fields (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Seu Nome (Opcional):</label>
                    <input 
                      type="text"
                      placeholder="Ex: David ben Sara"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Nome Hebraico p/ Bênção:</label>
                    <input 
                      type="text"
                      placeholder="Ex: Menachem Mendel"
                      value={hebrewName}
                      onChange={(e) => setHebrewName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                {/* Confirm Action Button */}
                <button
                  onClick={handleConfirmPixPayment}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-base"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Já paguei o PIX • Zerar Cofrinho</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl text-slate-100 relative max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-serif text-lg font-bold text-amber-300 flex items-center">
                <History className="w-5 h-5 mr-2 text-amber-400" />
                <span>Extrato do Cofrinho</span>
              </h3>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-2.5">
              {pushkaState.drops.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Nenhuma moeda inserida recentemente no cofrinho.
                </div>
              ) : (
                pushkaState.drops.map((d) => (
                  <div key={d.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Moeda Inserida 🪙</div>
                      <div className="text-[10px] text-slate-400">{new Date(d.timestamp).toLocaleString('pt-BR')}</div>
                    </div>
                    <div className="font-bold text-amber-400 text-sm">
                      + R$ {d.amount.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total acumulado:</span>
              <span className="font-black text-amber-300 text-base">
                R$ {pushkaState.balance.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer info banner */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-3 px-4 text-center text-xs text-slate-400">
        <p>
          Beit Chabad do Paraná • 45 Anos • Chave PIX: <strong className="text-slate-200">kitov@chabadcuritiba.com</strong>
        </p>
      </footer>

    </div>
  );
};
