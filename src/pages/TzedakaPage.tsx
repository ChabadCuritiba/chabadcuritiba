import React, { useState, useEffect } from 'react';
import { 
  Heart, Sparkles, Flame, CheckCircle2, 
  Copy, Check, ArrowRight, Coins, ShieldCheck,
  History, Calendar, Award, Info
} from 'lucide-react';
import { 
  getInitialPushkaState, 
  dropCoinIntoPushka, 
  emptyPushka, 
  PushkaState, 
  REBBE_TZEDAKA_QUOTES,
  playCoinClinkSound
} from '../utils/tzedakaManager';
import { generatePixQrCodeUrl, generatePixCopyPaste } from '../utils/pix';
import { saveSupabaseDonation } from '../utils/supabaseClient';

const PRESET_COINS = [
  { label: 'R$ 1', value: 1 },
  { label: 'R$ 2', value: 2 },
  { label: 'R$ 5', value: 5 },
  { label: 'R$ 10', value: 10 },
  { label: 'R$ 18 (Chai ✡️)', value: 18 },
  { label: 'R$ 36 (2x Chai)', value: 36 },
  { label: 'R$ 54 (3x Chai)', value: 54 },
  { label: 'R$ 100', value: 100 }
];

export const TzedakaPage: React.FC = () => {
  const [pushkaState, setPushkaState] = useState<PushkaState>(getInitialPushkaState());
  const [selectedCoin, setSelectedCoin] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [activeCoinAnim, setActiveCoinAnim] = useState<{ value: number; id: number } | null>(null);
  const [pushkaJiggling, setPushkaJiggling] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [showPixCheckout, setShowPixCheckout] = useState<boolean>(false);
  const [pixCopied, setPixCopied] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [hebrewName, setHebrewName] = useState<string>('');
  const [isEmptiedSuccess, setIsEmptiedSuccess] = useState<boolean>(false);

  useEffect(() => {
    setPushkaState(getInitialPushkaState());
    setQuoteIndex(Math.floor(Math.random() * REBBE_TZEDAKA_QUOTES.length));

    const handleUpdate = (e: any) => {
      if (e.detail) setPushkaState(e.detail);
    };
    window.addEventListener('chabad_pushka_updated', handleUpdate);
    return () => window.removeEventListener('chabad_pushka_updated', handleUpdate);
  }, []);

  const currentCoinValue = customAmount ? (Number(customAmount) || 0) : selectedCoin;

  const handleDropCoin = () => {
    if (currentCoinValue <= 0 || isDropping) return;

    setIsDropping(true);
    setActiveCoinAnim({ value: currentCoinValue, id: Date.now() });

    playCoinClinkSound();

    setTimeout(() => {
      setPushkaJiggling(true);
    }, 450);

    setTimeout(() => {
      const updated = dropCoinIntoPushka(currentCoinValue);
      setPushkaState(updated);
      setIsDropping(false);
      setActiveCoinAnim(null);
      setPushkaJiggling(false);
      setQuoteIndex((prev) => (prev + 1) % REBBE_TZEDAKA_QUOTES.length);
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
    const donationRecord = {
      id: 'don_' + Date.now(),
      donorName: donorName.trim() || 'Doador Tsedacá Digital',
      email: '',
      hebrewName: hebrewName.trim() || undefined,
      amount: pixAmount,
      purpose: 'Tsedacá Diária (Cofrinho Digital)',
      paymentMethod: 'PIX' as const,
      status: 'Recebido' as const,
      createdAt: new Date().toLocaleString('pt-BR')
    };

    saveSupabaseDonation(donationRecord).catch(() => {});
    const updated = emptyPushka();
    setPushkaState(updated);
    setIsEmptiedSuccess(true);
    setShowPixCheckout(false);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      
      {/* Hero Title */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Coins className="w-4 h-4 text-amber-700" />
          <span>Mitzvá de Tsedacá Diária</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
          Cofrinho Digital • Pushka Beit Chabad
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Deposite sua moeda todos os dias antes das orações ou acendimento das velas. Acumule suas boas ações e transfira via PIX quando desejar!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive 3D Pushka */}
        <div className="lg:col-span-7 bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white flex flex-col items-center space-y-6">
          
          {/* Top Pushka Stats */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Total no Cofrinho
              </span>
              <span className="text-3xl font-black text-amber-400 font-mono">
                R$ {pushkaState.balance.toFixed(2)}
              </span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 text-center flex flex-col justify-center items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse" /> Sequência
              </span>
              <span className="text-3xl font-black text-orange-400 font-mono">
                {pushkaState.currentStreak || 1} {pushkaState.currentStreak === 1 ? 'dia' : 'dias'}
              </span>
            </div>
          </div>

          {/* Success Banner */}
          {isEmptiedSuccess && (
            <div className="w-full p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-center space-y-2 animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-emerald-300">Tizkú LeMitsvot! Cofrinho Esvaziado!</h4>
              <p className="text-xs text-slate-300">
                Sua Tsedacá de R$ {pixAmount.toFixed(2)} foi registrada com sucesso!
              </p>
            </div>
          )}

          {/* 3D Pushka Visual */}
          <div className="relative flex flex-col items-center justify-center py-4 select-none w-full">
            
            {/* Falling Coin Animation */}
            {isDropping && activeCoinAnim && (
              <div 
                className="absolute z-30 pointer-events-none"
                style={{
                  top: '10px',
                  animation: 'dropCoinAnim 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 border-2 border-yellow-200 shadow-xl flex items-center justify-center text-slate-950 font-black text-xs font-mono drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform rotate-12">
                  R$ {activeCoinAnim.value}
                </div>
              </div>
            )}

            {/* The 3D Pushka Box */}
            <div 
              onClick={handleDropCoin}
              className={`cursor-pointer transition-transform duration-200 relative group w-68 sm:w-76 rounded-3xl p-5 bg-gradient-to-b from-[#163a2e] via-[#0d2820] to-[#081a14] border-2 border-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] text-center flex flex-col items-center ${
                pushkaJiggling ? 'animate-bounce' : 'hover:scale-[1.02]'
              }`}
            >
              {/* Pushka Slot */}
              <div className="w-36 h-4 bg-black/90 rounded-full border border-amber-400/80 shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)] mb-4 relative flex items-center justify-center">
                <div className="w-20 h-1 bg-amber-400/50 rounded-full animate-pulse"></div>
              </div>

              {/* Pushka Front Plate */}
              <div className="w-full bg-slate-950/50 backdrop-blur-xs rounded-2xl p-3 border border-amber-500/30 flex flex-col items-center space-y-2 shadow-inner">
                <img
                  src="/assets/pushka-logo.png"
                  alt="Chabad do Paraná"
                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-md"
                />

                {/* Hebrew Tzedaká Gold Engraving */}
                <div className="font-serif text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  צדקה
                </div>
              </div>

              {/* Tap CTA */}
              <div className="mt-3.5 px-4 py-1.5 bg-amber-500/20 rounded-full border border-amber-400/40 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Toque para depositar moedas</span>
              </div>
            </div>

          </div>

          {/* Coin Selector */}
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Valor da Moeda:
              </span>
              {customAmount && (
                <button 
                  onClick={() => setCustomAmount('')}
                  className="text-xs text-amber-400 underline"
                >
                  Usar predefinidos
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_COINS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setSelectedCoin(c.value);
                    setCustomAmount('');
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${
                    selectedCoin === c.value && !customAmount
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105 font-black'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-xs text-slate-400 font-bold">Outro valor (R$):</span>
              <input
                type="number"
                min="1"
                placeholder="Ex: 25"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>
          </div>

          {/* Big Action Drop Button */}
          <button
            type="button"
            onClick={handleDropCoin}
            disabled={isDropping || currentCoinValue <= 0}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm shadow-xl hover:shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Coins className="w-5 h-5 text-slate-950" />
            <span>Colocar R$ {currentCoinValue.toFixed(2)} na Pushka 🪙</span>
          </button>

          {/* Quote */}
          <div className="w-full p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 text-xs text-slate-300 italic text-center leading-relaxed">
            "{REBBE_TZEDAKA_QUOTES[quoteIndex]}"
            <span className="block not-italic font-bold text-[10px] text-amber-400 mt-1 uppercase">
              — O Rebe de Lubavitch
            </span>
          </div>

          {/* Empty & PIX Button */}
          {pushkaState.balance > 0 && !showPixCheckout && (
            <button
              type="button"
              onClick={handleStartPixCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Heart className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Esvaziar Cofrinho & Doar R$ {pushkaState.balance.toFixed(2)} via PIX</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

        </div>

        {/* Right Column: Information & PIX Checkout */}
        <div className="lg:col-span-5 space-y-6">
          
          {showPixCheckout ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-4">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-lg text-slate-900">Esvaziar Cofrinho via PIX</h4>
                <p className="text-xs text-slate-600">
                  Total acumulado: <strong className="text-emerald-700 text-base">R$ {pixAmount.toFixed(2)}</strong>
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center justify-center space-y-2 border border-slate-200">
                <img
                  src={qrCodeUrl}
                  alt="PIX QR Code"
                  className="w-44 h-44 object-contain rounded-xl border border-slate-200"
                />
                <span className="text-[11px] font-bold text-slate-500">
                  Abra o app do seu banco e escaneie
                </span>
              </div>

              {/* Copy Code */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Código Copia e Cola PIX:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={pixCode}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 shrink-0 shadow-sm"
                  >
                    {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Donor fields */}
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="Seu Nome (Opcional)"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Nome Hebraico para Bênção"
                  value={hebrewName}
                  onChange={(e) => setHebrewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                <button
                  type="button"
                  onClick={() => setShowPixCheckout(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Voltar
                </button>

                <button
                  type="button"
                  onClick={handleConfirmPixPayment}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Já Fiz o PIX & Esvaziar</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Teaching Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center space-x-2.5 text-chabad">
                  <Award className="w-5 h-5 text-chabad-gold" />
                  <h3 className="font-bold text-base text-slate-900">O Poder da Tsedacá Diária</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  O Rebe de Lubavitch ensina que a mitzvá de colocar moedas no cofrinho de Tsedacá todos os dias (exceto no Shabat e Festas) transforma a nossa casa e o nosso ambiente num santuário de bênçãos e generosidade.
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">1.</span>
                    <span className="text-slate-700"><strong>Antes das Orações:</strong> Coloque uma moeda antes de Shacharit e Minchá.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">2.</span>
                    <span className="text-slate-700"><strong>Velas de Shabat:</strong> Mulheres e moças dão Tsedacá antes de acender as velas nas sextas-feiras.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">3.</span>
                    <span className="text-slate-700"><strong>Educação dos Filhos:</strong> Ensine as crianças a colocarem uma moedinha diariamente.</span>
                  </div>
                </div>
              </div>

              {/* Lifetime Stats Card */}
              <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 text-center space-y-2">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Total Vitalício no App
                </span>
                <span className="text-2xl font-black text-amber-950 font-mono">
                  R$ {pushkaState.totalGivenLifetime.toFixed(2)}
                </span>
                <span className="text-[11px] text-amber-800 block">
                  Obrigado por fortalecer a comunidade e iluminar o judaísmo!
                </span>
              </div>

            </div>
          )}

        </div>

      </div>

      <style>{`
        @keyframes dropCoinAnim {
          0% {
            transform: translateY(-80px) rotateY(0deg) scale(1.1);
            opacity: 1;
          }
          40% {
            transform: translateY(-20px) rotateY(360deg) scale(0.95);
            opacity: 1;
          }
          75% {
            transform: translateY(20px) rotateY(720deg) scale(0.7);
            opacity: 0.9;
          }
          100% {
            transform: translateY(50px) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
