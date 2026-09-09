import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Clock, MapPin, Check, Copy, QrCode, 
  Ticket, User, Mail, Phone, Sparkles, Download, 
  CheckCircle2, AlertCircle, MessageCircle 
} from 'lucide-react';
import { CommunityEvent } from '../types';
import { generatePixPayload } from '../utils/pix';
import { generateSafeQrCode, triggerSafeConfetti } from '../utils/qrCodeHelper';
import { submitRsvpEmail, saveRsvpRecord, RSVP_ADMIN_EMAIL } from '../utils/formSubmit';

interface EventModalProps {
  event: CommunityEvent | null;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
  const [step, setStep] = useState<'form' | 'payment' | 'confirmed'>('form');
  const [tickets, setTickets] = useState<{
    standard: number;
    member: number;
    youth: number;
    child: number;
  }>({
    standard: 1,
    member: 0,
    youth: 0,
    child: 0
  });
  
  // Registration Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dietaryNotes: '',
    pixKey: 'kitov@chabadcuritiba.com',
  });

  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>('');
  const [pixPayloadStr, setPixPayloadStr] = useState<string>('');
  const [pixCopied, setPixCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketCode, setTicketCode] = useState('');

  useEffect(() => {
    if (event) {
      setStep('form');
      setTickets({
        standard: 1,
        member: 0,
        youth: 0,
        child: 0
      });
      setTicketCode(`CHB-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  }, [event]);

  if (!event) return null;

  const eventTitle = event.title || 'Evento Beit Chabad';
  const eventSubtitle = event.subtitle || 'Comunidade Judaica do Paraná';
  const eventDate = event.date || 'Data a confirmar';
  const eventTime = event.time || '19:30';
  const eventLocation = event.location || 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)';
  const basePrice = Number(event.price) || 0;
  const memberPrice = event.memberPrice ? Number(event.memberPrice) : undefined;
  const youthPrice = event.youthPrice ? Number(event.youthPrice) : undefined;
  const childPrice = event.childPrice ? Number(event.childPrice) : undefined;

  const totalTickets = tickets.standard + tickets.member + tickets.youth + tickets.child;

  const totalPrice = Number((
    (tickets.standard * basePrice) +
    (tickets.member * (memberPrice || 0)) +
    (tickets.youth * (youthPrice || 0)) +
    (tickets.child * (childPrice || 0))
  ).toFixed(2));

  const isFree = totalPrice === 0;

  const getTicketSummaryString = (): string => {
    const parts: string[] = [];
    if (tickets.standard > 0) parts.push(`${tickets.standard}x Geral`);
    if (tickets.member > 0) parts.push(`${tickets.member}x Membro`);
    if (tickets.youth > 0) parts.push(`${tickets.youth}x Jovem`);
    if (tickets.child > 0) parts.push(`${tickets.child}x Criança`);
    return parts.length > 0 ? parts.join(', ') : '1x Geral';
  };

  // Generate PIX QR code safely
  useEffect(() => {
    let isMounted = true;
    if (step === 'payment' && !isFree) {
      try {
        const payload = generatePixPayload({
          pixKey: formData.pixKey,
          merchantName: 'BEIT CHABAD CURITIBA',
          merchantCity: 'CURITIBA',
          amount: totalPrice,
          txId: (ticketCode || 'EVENTO').replace(/[^a-zA-Z0-9]/g, '').slice(0, 20),
          description: 'EVENTO CHABAD'
        });
        setPixPayloadStr(payload);

        generateSafeQrCode(payload).then(url => {
          if (isMounted && url) {
            setPixQrDataUrl(url);
          }
        }).catch(err => {
          console.warn('Safe QR error:', err);
        });
      } catch (e) {
        console.warn('Error generating PIX payload:', e);
      }
    }
    return () => { isMounted = false; };
  }, [step, totalPrice, isFree, formData.pixKey, ticketCode]);

  const handleCopyPixPayload = () => {
    try {
      navigator.clipboard.writeText(pixPayloadStr);
      setPixCopied(true);
      setTimeout(() => setPixCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleCopyPixKey = () => {
    try {
      navigator.clipboard.writeText(formData.pixKey);
      setKeyCopied(true);
      setTimeout(() => setKeyCopied(false), 3000);
    } catch (e) {
      console.warn('Clipboard copy error:', e);
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalTickets === 0) {
      alert('Por favor, selecione a quantidade de pelo menos 1 ingresso.');
      return;
    }

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, E-mail e WhatsApp).');
      return;
    }

    if (isFree) {
      handleConfirmRegistration();
    } else {
      setStep('payment');
    }
  };

  const handleConfirmRegistration = () => {
    if (totalTickets === 0) {
      alert('Por favor, selecione a quantidade de pelo menos 1 ingresso.');
      return;
    }

    setIsProcessing(true);
    const ticketSummary = getTicketSummaryString();

    // 1. Save to local storage for Admin Dashboard
    try {
      saveRsvpRecord({
        ticketCode,
        eventTitle,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: totalTickets,
        ticketType: ticketSummary,
        totalPrice,
        dietaryNotes: formData.dietaryNotes,
        paymentMethod: 'PIX'
      });
    } catch (err) {
      console.warn('Error saving RSVP record locally:', err);
    }

    // 2. Dispatch email to mendys@gmail.com and chabad@chabadcuritiba.com
    try {
      submitRsvpEmail({
        eventTitle,
        ticketCode,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: totalTickets,
        ticketType: ticketSummary,
        totalPrice,
        dietaryNotes: formData.dietaryNotes
      });
    } catch (err) {
      console.warn('Error dispatching RSVP email:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setStep('confirmed');
      triggerSafeConfetti();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100 relative my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white p-6 sm:p-8 relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-chabad-gold/20 text-chabad-gold border border-chabad-gold/30 mb-2">
            <Ticket className="w-3.5 h-3.5 mr-1" />
            Inscrição & RSVP
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
            {eventTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {eventSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200 mt-4 pt-3 border-t border-white/10">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-chabad-gold" />
              {eventDate}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-chabad-gold" />
              {eventTime}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-chabad-gold" />
              {eventLocation}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">

          {/* STEP 1: Registration Form & Ticket Selection */}
          {step === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              
              {/* Multi-Tier Ticket Quantity Selectors */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Selecione a Quantidade por Categoria de Ingresso
                </label>
                
                <div className="space-y-2.5">
                  {/* Geral / Adulto */}
                  <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                    <div>
                      <div className="font-bold text-slate-800 text-sm">Ingresso Individual (Geral / Adulto)</div>
                      <div className="text-xs text-chabad font-bold mt-0.5">
                        {basePrice === 0 ? 'Gratuito' : `R$ ${basePrice.toFixed(2)}`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <button
                        type="button"
                        onClick={() => setTickets(t => ({ ...t, standard: Math.max(0, t.standard - 1) }))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 text-base w-6 text-center">{tickets.standard}</span>
                      <button
                        type="button"
                        onClick={() => setTickets(t => ({ ...t, standard: t.standard + 1 }))}
                        className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Membro Chabad (se configurado) */}
                  {memberPrice !== undefined && (
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Membro Chabad</div>
                        <div className="text-xs text-chabad font-bold mt-0.5">R$ {memberPrice.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, member: Math.max(0, t.member - 1) }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 text-base w-6 text-center">{tickets.member}</span>
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, member: t.member + 1 }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Jovem (se configurado) */}
                  {youthPrice !== undefined && (
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Jovem</div>
                        <div className="text-xs text-chabad font-bold mt-0.5">R$ {youthPrice.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, youth: Math.max(0, t.youth - 1) }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 text-base w-6 text-center">{tickets.youth}</span>
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, youth: t.youth + 1 }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Criança (se configurado) */}
                  {childPrice !== undefined && (
                    <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Criança (até 12 anos)</div>
                        <div className="text-xs text-chabad font-bold mt-0.5">R$ {childPrice.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, child: Math.max(0, t.child - 1) }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          -
                        </button>
                        <span className="font-bold text-slate-900 text-base w-6 text-center">{tickets.child}</span>
                        <button
                          type="button"
                          onClick={() => setTickets(t => ({ ...t, child: t.child + 1 }))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-200/80 text-xs gap-2">
                  <div className="text-slate-600">
                    <span className="font-bold text-slate-800">Total de pessoas:</span> {totalTickets} ({getTicketSummaryString()})
                  </div>
                  <div className="text-sm font-extrabold text-chabad">
                    Subtotal: {totalPrice === 0 ? 'Gratuito' : `R$ ${totalPrice.toFixed(2)}`}
                  </div>
                </div>
              </div>

              {/* Personal Info Form */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Dados do Responsável pela Inscrição
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: David Cohen"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-chabad focus:border-chabad text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-chabad focus:border-chabad text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        placeholder="(41) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-chabad focus:border-chabad text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Restrições Alimentares ou Observações (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Vegetariano, alergia a nozes, etc."
                    value={formData.dietaryNotes}
                    onChange={e => setFormData({ ...formData, dietaryNotes: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-chabad focus:border-chabad text-sm"
                  />
                </div>
              </div>

              {/* Total & Submit Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total a pagar:</span>
                  <span className="text-2xl font-black text-chabad">
                    {isFree ? 'Gratuito' : `R$ ${totalPrice.toFixed(2)}`}
                  </span>
                </div>

                <button
                  type="submit"
                  className="bg-chabad hover:bg-chabad-pine text-white px-7 py-3 rounded-xl font-bold shadow-luxury hover:shadow-lg transition-all text-sm flex items-center space-x-2"
                >
                  <span>{isFree ? 'Confirmar Inscrição' : 'Avançar para Pagamento PIX'}</span>
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: Payment Section (PIX Instantâneo) */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-bold text-sm">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>Pagamento via PIX Instantâneo</span>
              </div>

              {/* PIX Option */}
              <div className="text-center space-y-4 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-900">
                  Escaneie o QR Code abaixo no app do seu banco ou use a chave oficial:
                </div>

                {/* QR Code */}
                <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                  {pixQrDataUrl ? (
                    <img src={pixQrDataUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-slate-100 rounded-xl">
                      <QrCode className="w-12 h-12 text-slate-400 animate-spin" />
                    </div>
                  )}
                </div>

                {/* Copy Paste Code */}
                <div className="max-w-md mx-auto space-y-2">
                  <button
                    type="button"
                    onClick={handleCopyPixPayload}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                  >
                    {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{pixCopied ? 'Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyPixKey}
                    className="w-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                  >
                    {keyCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                    <span>{keyCopied ? 'Chave de E-mail Copiada!' : 'Copiar Chave de E-mail: kitov@chabadcuritiba.com'}</span>
                  </button>

                  <div className="text-[11px] text-slate-500 pt-1">
                    Chave PIX Oficial: <strong>kitov@chabadcuritiba.com</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 pt-2 border-t border-emerald-200/60">
                  Valor a ser pago: <strong className="text-slate-900 text-sm">R$ {totalPrice.toFixed(2)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  ← Voltar para dados
                </button>

                <button
                  type="button"
                  onClick={handleConfirmRegistration}
                  disabled={isProcessing}
                  className="bg-chabad hover:bg-chabad-pine text-white px-8 py-3 rounded-xl font-bold shadow-luxury transition-all text-sm flex items-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Processando confirmação...</span>
                  ) : (
                    <span>Já fiz o PIX / Concluir Inscrição</span>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Confirmed Voucher & Ticket Receipt */}
          {step === 'confirmed' && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-200">
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900">
                  Inscrição Confirmada com Sucesso!
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Enviamos o comprovante e os detalhes para o e-mail: <strong className="text-slate-800">{formData.email}</strong>
                </p>
              </div>

              {/* Ticket Card Preview */}
              <div className="bg-gradient-to-br from-chabad-dark to-chabad-navy text-white p-6 rounded-2xl shadow-xl text-left border border-chabad-gold/30 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 border-b border-white/15 pb-3">
                  <div>
                    <div className="text-[11px] text-chabad-gold font-bold uppercase tracking-widest">
                      Beit Chabad do Paraná • Voucher Oficial
                    </div>
                    <div className="font-bold text-lg text-white mt-0.5">{eventTitle}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-300 block">Código:</span>
                    <span className="font-mono text-sm font-black text-chabad-gold">{ticketCode}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                  <div>
                    <span className="text-slate-400 block">Titular:</span>
                    <span className="font-semibold text-white">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ingressos:</span>
                    <span className="font-semibold text-white">{totalTickets} {totalTickets > 1 ? 'lugares' : 'lugar'} ({getTicketSummaryString()})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Data & Horário:</span>
                    <span>{eventDate} às {eventTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Local:</span>
                    <span>{eventLocation}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/554198977249?text=${encodeURIComponent(`*Inscrição Confirmada - ${eventTitle}*\n\n*Voucher:* #${ticketCode}\n*Titular:* ${formData.fullName}\n*Ingressos:* ${totalTickets}x (${getTicketSummaryString()})\n*Valor Total (PIX):* R$ ${totalPrice.toFixed(2)}\n*Data:* ${eventDate} às ${eventTime}\n*Local:* ${eventLocation}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprovante no WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Imprimir / Salvar PDF</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-chabad hover:bg-chabad-pine text-white font-bold px-7 py-2.5 rounded-xl text-xs transition-all shadow-md"
                >
                  Concluir
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
