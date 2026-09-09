import React, { useState, useEffect } from 'react';
import { 
  X, Heart, Sparkles, QrCode, CreditCard, Copy, 
  Check, ShieldCheck, CheckCircle2, DollarSign, Gift 
} from 'lucide-react';
import { generatePixPayload } from '../utils/pix';
import { generateSafeQrCode, triggerSafeConfetti } from '../utils/qrCodeHelper';
import { saveDonationRecord } from '../utils/formSubmit';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState<number>(180);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [purpose, setPurpose] = useState('Geral / Manutenção Comunitária');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select');
  const [pixCopied, setPixCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [pixPayloadStr, setPixPayloadStr] = useState('');
  const [pixQrDataUrl, setPixQrDataUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    phone: '',
    hebrewNameForBlessing: '',
    pixKey: 'kitov@chabadcuritiba.com',
  });

  const predefinedAmounts = [54, 108, 180, 360, 770, 1800];

  const actualAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setAmount(180);
      setCustomAmount('');
    }
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;
    if (step === 'pay' && paymentMethod === 'pix' && actualAmount > 0) {
      const payload = generatePixPayload({
        pixKey: donorData.pixKey,
        merchantName: 'BEIT CHABAD CURITIBA',
        merchantCity: 'CURITIBA',
        amount: actualAmount,
        txId: 'DOACAO',
        description: 'DOACAO ECHABAD'
      });
      setPixPayloadStr(payload);
      
      generateSafeQrCode(payload).then(url => {
        if (isMounted && url) {
          setPixQrDataUrl(url);
        }
      }).catch(console.error);
    }
    return () => { isMounted = false; };
  }, [step, paymentMethod, actualAmount, donorData.pixKey]);

  if (!isOpen) return null;

  const handleCopyPixPayload = () => {
    navigator.clipboard.writeText(pixPayloadStr);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(donorData.pixKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 3000);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (actualAmount <= 0) {
      alert('Por favor, informe um valor válido para doação.');
      return;
    }
    setStep('pay');
  };

  const handleConfirmDonation = () => {
    setIsProcessing(true);

    saveDonationRecord({
      donorName: donorData.name,
      email: donorData.email,
      hebrewName: donorData.hebrewNameForBlessing,
      amount: actualAmount,
      purpose,
      paymentMethod: 'PIX'
    });

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      triggerSafeConfetti();
    }, 1000);
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-100 relative my-6 cursor-default"
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white p-6 sm:p-8 relative">
          <button 
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-5 right-5 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white border border-white/20 transition-all hover:scale-110 shadow-md cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-chabad-gold/20 text-chabad-gold border border-chabad-gold/30 mb-2">
            <Heart className="w-3.5 h-3.5 mr-1 fill-chabad-gold" />
            Portal eChabad Paraná
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Faça Parte Desta Mitsvá
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Seu apoio mantém a chama do judaísmo viva, acolhendo centenas de famílias em Curitiba.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {step === 'select' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Preset Amounts */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Selecione o Valor da Doação (R$)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {predefinedAmounts.map(val => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => {
                        setAmount(val);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-2 rounded-xl text-center font-bold border transition-all text-sm ${
                        amount === val && !customAmount
                          ? 'border-chabad bg-chabad text-white shadow-md'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ou digite outro valor desejado:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">R$</span>
                  <input
                    type="number"
                    min="5"
                    step="1"
                    placeholder="Outro valor..."
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-chabad text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Donation Destination */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Destinação da Doação
                </label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-chabad text-sm bg-white"
                >
                  <option value="Geral / Manutenção Comunitária">Geral / Manutenção e Atividades Comunitárias</option>
                  <option value="Cestas Casher de Pessach & Ajuda Social">Cestas Casher de Pessach & Ajuda Social (Maot Chitim)</option>
                  <option value="Ganênu & Juventude">Ganênu & Projetos de Juventude / Alicerces</option>
                  <option value="Mikvê">Mikvê (Manutenção e Aperfeiçoamento)</option>
                </select>
              </div>

              {/* Donor info */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome Completo *"
                    value={donorData.name}
                    onChange={e => setDonorData({ ...donorData, name: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Seu E-mail *"
                    value={donorData.email}
                    onChange={e => setDonorData({ ...donorData, email: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Nome em Hebraico para Berachá / Bênção (Opcional)"
                  value={donorData.hebrewNameForBlessing}
                  onChange={e => setDonorData({ ...donorData, hebrewNameForBlessing: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-chabad hover:bg-chabad-pine text-white py-3.5 rounded-xl font-bold shadow-luxury transition-all text-sm flex items-center justify-center space-x-2"
              >
                <span>Avançar para Doação PIX (R$ {actualAmount})</span>
              </button>

            </form>
          )}

          {step === 'pay' && (
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 py-2 px-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold text-sm">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>Pagamento Exclusivo via PIX Instantâneo</span>
              </div>

              <div className="text-center space-y-4 p-5 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <div className="text-xs text-emerald-900 font-semibold">
                  Escaneie o QR Code no app do seu banco ou use a chave oficial:
                </div>

                <div className="inline-block p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200">
                  {pixQrDataUrl ? (
                    <img src={pixQrDataUrl} alt="PIX QR" className="w-48 h-48 mx-auto" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-slate-50 rounded-xl">
                      <QrCode className="w-10 h-10 text-slate-400 animate-spin" />
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={handleCopyPixPayload}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                  >
                    {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{pixCopied ? 'Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPixKey}
                    className="w-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold py-2 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    {keyCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                    <span>{keyCopied ? 'Chave de E-mail Copiada!' : 'Copiar Chave de E-mail: kitov@chabadcuritiba.com'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 pt-1 border-t border-emerald-200/50">
                  Chave Oficial: <strong>kitov@chabadcuritiba.com</strong> • Valor: <strong className="text-slate-900">R$ {actualAmount}</strong>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  ← Alterar valor
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDonation}
                  disabled={isProcessing}
                  className="bg-chabad hover:bg-chabad-pine text-white px-7 py-3 rounded-xl font-bold shadow-luxury text-sm"
                >
                  {isProcessing ? 'Confirmando...' : `Confirmar Doação (R$ ${actualAmount})`}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Tizkú LeMitsvot! Muito Obrigado!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Sua generosa contribuição fortalece as atividades judaicas e sociais no Paraná. Que D-us retribua com saúde, alegria, fartura e bênçãos!
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-chabad hover:bg-chabad-pine text-white font-bold px-8 py-2.5 rounded-xl text-sm shadow-md mt-4"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
