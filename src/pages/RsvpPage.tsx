import React, { useState, useEffect, useRef } from 'react';
import { 
  Ticket, Calendar, Clock, MapPin, Check, Copy, 
  QrCode, User, Mail, Phone, Download, CheckCircle2, 
  ArrowLeft, Sparkles, MessageCircle, AlertCircle, ShieldCheck,
  Upload, FileText, X, Image as ImageIcon, Camera, Utensils
} from 'lucide-react';
import { CommunityEvent } from '../types';
import { getCommunityEvents } from '../utils/eventsManager';
import { generatePixPayload } from '../utils/pix';
import { generateSafeQrCode, triggerSafeConfetti } from '../utils/qrCodeHelper';
import { submitRsvpEmail, saveRsvpRecord, RSVP_ADMIN_EMAIL } from '../utils/formSubmit';

interface RsvpPageProps {
  selectedEvent: CommunityEvent | null;
  onSelectEvent: (event: CommunityEvent) => void;
  onNavigate: (page: string) => void;
}

export const RsvpPage: React.FC<RsvpPageProps> = ({ 
  selectedEvent, 
  onSelectEvent, 
  onNavigate 
}) => {
  const events = getCommunityEvents();
  const currentEvent = selectedEvent || events[0] || null;

  const [step, setStep] = useState<'form' | 'payment' | 'confirmed'>('form');
  const [tickets, setTickets] = useState({
    standard: 1,
    member: 0,
    youth: 0,
    child: 0
  });

  // State mapping meal key (e.g. 'Almoço 1', 'Almoço 2', 'Jantar 1') to tier quantities
  const [mealSelections, setMealSelections] = useState<Record<string, {
    standard: number;
    youth: number;
    child: number;
    member: number;
  }>>({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dietaryNotes: '',
    pixKey: 'kitov@chabadcuritiba.com',
    agreedToPix: false
  });

  // Helper to list all meal instances (custom schedule or legacy fallback)
  const getMealInstances = () => {
    if (!currentEvent?.hasMealOptions) return [];
    
    // 1. Custom meals schedule (new multi-day / multi-meal structure)
    if (currentEvent.meals && currentEvent.meals.length > 0) {
      return currentEvent.meals.map((m, idx) => ({
        key: m.id || `meal-${idx}`,
        name: m.name || (m.type === 'almoco' ? 'Almoço' : m.type === 'jantar' ? 'Jantar' : 'Refeição'),
        dayOrDate: m.dayOrDate,
        time: m.time,
        type: m.type,
        price: Number(m.price) || 0,
        youthPrice: m.youthPrice !== undefined && m.youthPrice !== null ? Number(m.youthPrice) : undefined,
        childPrice: m.childPrice !== undefined && m.childPrice !== null ? Number(m.childPrice) : undefined,
        memberPrice: m.memberPrice !== undefined && m.memberPrice !== null ? Number(m.memberPrice) : undefined,
        index: idx + 1
      }));
    }

    // 2. Legacy fallback if event only has mealOptions array
    const list: {
      key: string;
      name: string;
      dayOrDate?: string;
      time?: string;
      type: 'almoco' | 'jantar' | 'outro';
      price: number;
      youthPrice?: number;
      childPrice?: number;
      memberPrice?: number;
      index: number;
    }[] = [];
    
    if (currentEvent.mealOptions && currentEvent.mealOptions.includes('Almoço')) {
      const count = currentEvent.lunchCount && currentEvent.lunchCount > 1 ? currentEvent.lunchCount : 1;
      for (let i = 1; i <= count; i++) {
        list.push({
          key: count > 1 ? `Almoço ${i}` : 'Almoço',
          name: count > 1 ? `Almoço ${i}` : 'Almoço',
          dayOrDate: currentEvent.date,
          time: currentEvent.time,
          type: 'almoco',
          price: Number(currentEvent.lunchPrice) || 0,
          youthPrice: currentEvent.lunchYouthPrice !== undefined ? Number(currentEvent.lunchYouthPrice) : undefined,
          childPrice: currentEvent.lunchChildPrice !== undefined ? Number(currentEvent.lunchChildPrice) : undefined,
          memberPrice: currentEvent.lunchMemberPrice !== undefined ? Number(currentEvent.lunchMemberPrice) : undefined,
          index: i
        });
      }
    }

    if (currentEvent.mealOptions && currentEvent.mealOptions.includes('Jantar')) {
      const count = currentEvent.dinnerCount && currentEvent.dinnerCount > 1 ? currentEvent.dinnerCount : 1;
      for (let i = 1; i <= count; i++) {
        list.push({
          key: count > 1 ? `Jantar ${i}` : 'Jantar',
          name: count > 1 ? `Jantar ${i}` : 'Jantar',
          dayOrDate: currentEvent.date,
          time: currentEvent.time,
          type: 'jantar',
          price: Number(currentEvent.dinnerPrice) || 0,
          youthPrice: currentEvent.dinnerYouthPrice !== undefined ? Number(currentEvent.dinnerYouthPrice) : undefined,
          childPrice: currentEvent.dinnerChildPrice !== undefined ? Number(currentEvent.dinnerChildPrice) : undefined,
          memberPrice: currentEvent.dinnerMemberPrice !== undefined ? Number(currentEvent.dinnerMemberPrice) : undefined,
          index: i
        });
      }
    }

    return list;
  };

  const mealInstances = getMealInstances();

  useEffect(() => {
    if (currentEvent?.hasMealOptions) {
      const instances = getMealInstances();
      const initial: Record<string, { standard: number; youth: number; child: number; member: number }> = {};
      instances.forEach((inst) => {
        initial[inst.key] = {
          standard: 1,
          youth: 0,
          child: 0,
          member: 0
        };
      });
      setMealSelections(initial);

      // If event has meals, start with 0 standard tickets so only meals are selected
      if (instances.length > 0) {
        setTickets({ standard: 0, member: 0, youth: 0, child: 0 });
      }
    } else {
      setMealSelections({});
      setTickets({ standard: 1, member: 0, youth: 0, child: 0 });
    }
  }, [currentEvent?.id]);

  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [pixQrDataUrl, setPixQrDataUrl] = useState<string>('');
  const [pixPayloadStr, setPixPayloadStr] = useState<string>('');
  const [pixCopied, setPixCopied] = useState(false);
  const [keyCopied, setKeyCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ticketCode, setTicketCode] = useState(() => `CHB-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentEvent]);

  if (!currentEvent) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Nenhum evento selecionado</h2>
        <p className="text-sm text-slate-500 mt-2">Selecione um evento na página inicial para fazer sua inscrição.</p>
        <button 
          onClick={() => onNavigate('home')} 
          className="mt-4 bg-chabad text-white px-6 py-2.5 rounded-xl font-bold text-sm"
        >
          Voltar para Início
        </button>
      </div>
    );
  }

  const hasMeals = !!(currentEvent.hasMealOptions && mealInstances.length > 0);
  const basePrice = Number(currentEvent.price) || 0;
  const memberPrice = (currentEvent.memberPrice !== undefined && currentEvent.memberPrice !== null) ? Number(currentEvent.memberPrice) : undefined;
  const youthPrice = (currentEvent.youthPrice !== undefined && currentEvent.youthPrice !== null) ? Number(currentEvent.youthPrice) : undefined;
  const childPrice = (currentEvent.childPrice !== undefined && currentEvent.childPrice !== null) ? Number(currentEvent.childPrice) : undefined;

  // Meal Price Calculations
  let totalMealPrice = 0;
  let totalMealAttendees = 0;

  mealInstances.forEach(inst => {
    const sel = mealSelections[inst.key] || { standard: 0, youth: 0, child: 0, member: 0 };
    const baseMealPrice = inst.price || 0;
    const youthMealPrice = inst.youthPrice !== undefined && inst.youthPrice !== null ? inst.youthPrice : baseMealPrice;
    const childMealPrice = inst.childPrice !== undefined && inst.childPrice !== null ? inst.childPrice : baseMealPrice;
    const memberMealPrice = inst.memberPrice !== undefined && inst.memberPrice !== null ? inst.memberPrice : baseMealPrice;

    totalMealAttendees += (sel.standard || 0) + (sel.youth || 0) + (sel.child || 0) + (sel.member || 0);
    totalMealPrice += 
      (sel.standard || 0) * baseMealPrice +
      (sel.youth || 0) * youthMealPrice +
      (sel.child || 0) * childMealPrice +
      (sel.member || 0) * memberMealPrice;
  });

  const totalStandardTickets = tickets.standard + tickets.member + tickets.youth + tickets.child;
  const totalTickets = hasMeals 
    ? (totalMealAttendees > 0 ? totalMealAttendees : 1) 
    : (totalStandardTickets > 0 ? totalStandardTickets : 1);

  const totalPrice = Number((
    hasMeals
      ? totalMealPrice
      : (
          (tickets.standard * basePrice) +
          (tickets.member * (memberPrice || 0)) +
          (tickets.youth * (youthPrice || 0)) +
          (tickets.child * (childPrice || 0))
        )
  ).toFixed(2));

  const isFree = totalPrice === 0;

  const getSelectedMealsList = (): string[] => {
    if (!hasMeals) return [];
    const list: string[] = [];
    mealInstances.forEach(inst => {
      const sel = mealSelections[inst.key] || { standard: 0, youth: 0, child: 0, member: 0 };
      const tierParts: string[] = [];
      if (sel.standard > 0) tierParts.push(`${sel.standard}x Geral`);
      if (sel.youth > 0) tierParts.push(`${sel.youth}x Jovem`);
      if (sel.child > 0) tierParts.push(`${sel.child}x Kids`);
      if (sel.member > 0) tierParts.push(`${sel.member}x Membro`);
      if (tierParts.length > 0) {
        const scheduleInfo = inst.dayOrDate ? ` (${inst.dayOrDate}${inst.time ? ` às ${inst.time}` : ''})` : '';
        list.push(`${inst.name}${scheduleInfo}: ${tierParts.join(', ')}`);
      }
    });
    return list;
  };

  const getTicketSummaryString = (): string => {
    if (hasMeals) {
      const mealsList = getSelectedMealsList();
      return mealsList.length > 0 ? mealsList.join(', ') : `${totalMealAttendees}x Refeição`;
    }
    const parts: string[] = [];
    if (tickets.standard > 0) parts.push(`${tickets.standard}x Geral`);
    if (tickets.member > 0) parts.push(`${tickets.member}x Membro`);
    if (tickets.youth > 0) parts.push(`${tickets.youth}x Jovem`);
    if (tickets.child > 0) parts.push(`${tickets.child}x Criança`);
    return parts.length > 0 ? parts.join(', ') : '1x Inscrição';
  };

  // Generate PIX QR code
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

    if (totalStandardTickets < 1 && totalMealAttendees < 1) {
      alert('Por favor, selecione ao menos 1 ingresso ou refeição.');
      return;
    }

    if (currentEvent.hasMealOptions && mealInstances.length > 0 && totalMealAttendees === 0) {
      alert('Por favor, selecione a quantidade de pessoas para ao menos uma refeição.');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('O arquivo selecionado é muito grande. Escolha uma imagem ou documento de até 8MB.');
      return;
    }

    setReceiptFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setReceiptDataUrl(compressedDataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptDataUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptDataUrl(null);
    setReceiptFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmRegistration = () => {
    if (!isFree && !formData.agreedToPix) {
      alert('Por favor, confirme marcando a caixa de que realizou a transferência PIX.');
      return;
    }

    setIsProcessing(true);

    const ticketTypeName = getTicketSummaryString();
    const selectedMealsList = getSelectedMealsList();

    // 1. Save to local & cloud storage for Admin Dashboard with status & receipt
    try {
      saveRsvpRecord({
        ticketCode,
        eventTitle: currentEvent.title,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: totalTickets,
        ticketType: ticketTypeName,
        selectedMeals: selectedMealsList.length > 0 ? selectedMealsList : undefined,
        totalPrice,
        dietaryNotes: formData.dietaryNotes,
        paymentMethod: 'PIX',
        receiptUrl: receiptDataUrl || undefined,
        receiptFileName: receiptFileName || undefined,
        status: isFree ? 'Confirmado' : 'Pendente'
      });
    } catch (err) {
      console.warn('Error saving RSVP record:', err);
    }

    // 2. Dispatch email to mendys@gmail.com and chabad@chabadcuritiba.com
    try {
      submitRsvpEmail({
        eventTitle: currentEvent.title,
        ticketCode,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketCount: totalTickets,
        ticketType: ticketTypeName,
        selectedMeals: selectedMealsList.length > 0 ? selectedMealsList : undefined,
        totalPrice,
        dietaryNotes: formData.dietaryNotes,
        receiptUploaded: !!receiptDataUrl
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
    <div className="space-y-12 pb-20">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center space-x-1.5 text-xs text-chabad-gold hover:underline font-semibold bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para o início</span>
            </button>
            <img 
              src="/assets/logo.png" 
              alt="Beit Chabad Paraná" 
              className="h-12 w-auto bg-white/95 p-1.5 rounded-xl shadow-lg"
            />
          </div>

          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-3 text-xs font-bold text-chabad-gold uppercase">
            <Ticket className="w-3.5 h-3.5 mr-1" />
            Inscrição Oficial & Pagamento PIX
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {currentEvent.title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-emerald-100 max-w-2xl">
            {currentEvent.subtitle}
          </p>

        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Event Summary Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-luxury overflow-hidden lg:sticky lg:top-24">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img 
                src={currentEvent.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'} 
                alt={currentEvent.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-3 left-3 bg-chabad-dark/90 text-chabad-gold font-bold text-xs px-3 py-1 rounded-lg">
                {currentEvent.category}
              </div>
              <div className="absolute bottom-3 right-3 bg-chabad text-white font-extrabold text-sm px-3 py-1 rounded-lg shadow">
                {basePrice === 0 ? 'Gratuito' : `R$ ${basePrice}`}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Event Selector Dropdown if user wants to switch */}
              {events.length > 1 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Selecionar Outro Evento:
                  </label>
                  <select
                    value={currentEvent.id}
                    onChange={(e) => {
                      const found = events.find(ev => ev.id === e.target.value);
                      if (found) {
                        onSelectEvent(found);
                        setStep('form');
                      }
                    }}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.title}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2.5 text-xs text-slate-700 pt-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-chabad shrink-0" />
                  <span className="font-semibold">{currentEvent.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-chabad shrink-0" />
                  <span className="font-semibold">{currentEvent.time}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-chabad shrink-0 mt-0.5" />
                  <span>{(currentEvent.location || 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)').replace(/Batel/g, 'Água Verde')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                {currentEvent.description}
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Garantia de Reserva Imediata
                </div>
                <div>Seus dados e comprovante são enviados diretamente para a diretoria de eventos.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Form & Payment & Receipt */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-luxury p-6 sm:p-8">
            
            {/* STEP 1: FORM */}
            {step === 'form' && (
              <form onSubmit={handleProceedToPayment} className="space-y-6">
                
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Preencha seus dados para Inscrição
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Informe os dados do responsável e a quantidade de ingressos.
                  </p>
                </div>

                {/* Ticket Selection - Multi-tier Quantities (only when event has NO meal options) */}
                {!hasMeals && (
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Ingressos de Entrada & Quantidades:
                    </label>
                    <span className="text-xs font-semibold text-slate-500">
                      Total: <strong className="text-slate-800">{totalStandardTickets} {totalStandardTickets === 1 ? 'lugar' : 'lugares'}</strong>
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Geral / Adulto */}
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <div>
                        <div className="font-bold text-slate-800 text-xs sm:text-sm">Individual (Geral / Adulto)</div>
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
                        <span className="font-bold text-slate-900 text-sm sm:text-base w-6 text-center">{tickets.standard}</span>
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
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Membro Chabad</div>
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
                          <span className="font-bold text-slate-900 text-sm sm:text-base w-6 text-center">{tickets.member}</span>
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
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Jovem</div>
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
                          <span className="font-bold text-slate-900 text-sm sm:text-base w-6 text-center">{tickets.youth}</span>
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
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <div>
                          <div className="font-bold text-slate-800 text-xs sm:text-sm">Criança (até 12 anos)</div>
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
                          <span className="font-bold text-slate-900 text-sm sm:text-base w-6 text-center">{tickets.child}</span>
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
                </div>
                )}

                {/* Meal Selection (Almoço / Jantar) if event has meal options */}
                {currentEvent.hasMealOptions && mealInstances.length > 0 && (
                  <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                        <Utensils className="w-4 h-4 text-amber-700" />
                        <span>Refeições Comunitárias • Selecione os participantes por refeição: *</span>
                      </label>
                      <span className="text-[11px] font-bold text-amber-800">
                        {totalMealAttendees} refeição(ões) selecionada(s)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {mealInstances.map(inst => {
                        const sel = mealSelections[inst.key] || { standard: 0, youth: 0, child: 0, member: 0 };
                        const isLunch = inst.type === 'almoco';
                        const isDinner = inst.type === 'jantar';
                        const baseMealPrice = inst.price || 0;
                        const youthMealPrice = inst.youthPrice;
                        const childMealPrice = inst.childPrice;
                        const memberMealPrice = inst.memberPrice;
                        const mealTotalForThis = (sel.standard || 0) + (sel.youth || 0) + (sel.child || 0) + (sel.member || 0);

                        return (
                          <div 
                            key={inst.key}
                            className={`p-4 rounded-2xl border transition-all ${
                              mealTotalForThis > 0 
                                ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-300/60' 
                                : 'bg-white/80 border-slate-200'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2.5 mb-3 gap-2">
                              <div className="flex items-start gap-2.5">
                                <span className="text-xl mt-0.5">{isLunch ? '☀️' : isDinner ? '🌙' : '🍽️'}</span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="font-bold text-slate-900 text-sm">{inst.name}</h4>
                                    {inst.dayOrDate && (
                                      <span className="bg-amber-100/80 text-amber-900 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-200">
                                        <Calendar className="w-3 h-3 text-amber-700" />
                                        {inst.dayOrDate}
                                      </span>
                                    )}
                                    {inst.time && (
                                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3 text-slate-500" />
                                        {inst.time}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-slate-500 block mt-0.5">
                                    {isLunch ? 'Almoço festivo comunitário' : isDinner ? 'Jantar comemorativo tradicional' : 'Refeição comunitária'}
                                  </span>
                                </div>
                              </div>
                              <span className={`self-start sm:self-center text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                                mealTotalForThis > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {mealTotalForThis} {mealTotalForThis === 1 ? 'lugar' : 'lugares'}
                              </span>
                            </div>

                            {/* Tier Quantities for this meal */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {/* Geral (Adulto) */}
                              <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                                <div>
                                  <div className="font-bold text-slate-800 text-xs">Geral / Adulto</div>
                                  <div className="text-[11px] text-chabad font-bold">
                                    {baseMealPrice > 0 ? `R$ ${baseMealPrice.toFixed(2)}` : 'Incluso / Grátis'}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setMealSelections(prev => ({
                                      ...prev,
                                      [inst.key]: {
                                        ...sel,
                                        standard: Math.max(0, (sel.standard || 0) - 1)
                                      }
                                    }))}
                                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                  >
                                    -
                                  </button>
                                  <span className="font-bold text-slate-900 text-sm w-5 text-center">{sel.standard || 0}</span>
                                  <button
                                    type="button"
                                    onClick={() => setMealSelections(prev => ({
                                      ...prev,
                                      [inst.key]: {
                                        ...sel,
                                        standard: (sel.standard || 0) + 1
                                      }
                                    }))}
                                    className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>

                              {/* Jovem (se configurado) */}
                              {youthMealPrice !== undefined && (
                                <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                                  <div>
                                    <div className="font-bold text-slate-800 text-xs">Jovem</div>
                                    <div className="text-[11px] text-chabad font-bold">
                                      {Number(youthMealPrice) > 0 ? `R$ ${Number(youthMealPrice).toFixed(2)}` : 'Incluso / Grátis'}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          youth: Math.max(0, (sel.youth || 0) - 1)
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold text-slate-900 text-sm w-5 text-center">{sel.youth || 0}</span>
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          youth: (sel.youth || 0) + 1
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Kids / Criança (se configurado) */}
                              {childMealPrice !== undefined && (
                                <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                                  <div>
                                    <div className="font-bold text-slate-800 text-xs">Kids / Criança</div>
                                    <div className="text-[11px] text-chabad font-bold">
                                      {Number(childMealPrice) > 0 ? `R$ ${Number(childMealPrice).toFixed(2)}` : 'Incluso / Grátis'}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          child: Math.max(0, (sel.child || 0) - 1)
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold text-slate-900 text-sm w-5 text-center">{sel.child || 0}</span>
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          child: (sel.child || 0) + 1
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Membro (se configurado) */}
                              {memberMealPrice !== undefined && (
                                <div className="flex items-center justify-between p-2.5 bg-slate-50/80 rounded-xl border border-slate-200">
                                  <div>
                                    <div className="font-bold text-slate-800 text-xs">Membro</div>
                                    <div className="text-[11px] text-chabad font-bold">
                                      {Number(memberMealPrice) > 0 ? `R$ ${Number(memberMealPrice).toFixed(2)}` : 'Incluso / Grátis'}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          member: Math.max(0, (sel.member || 0) - 1)
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      -
                                    </button>
                                    <span className="font-bold text-slate-900 text-sm w-5 text-center">{sel.member || 0}</span>
                                    <button
                                      type="button"
                                      onClick={() => setMealSelections(prev => ({
                                        ...prev,
                                        [inst.key]: {
                                          ...sel,
                                          member: (sel.member || 0) + 1
                                        }
                                      }))}
                                      className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center border border-slate-200 shadow-2xs"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalMealAttendees === 0 && (
                      <p className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Selecione a quantidade de pessoas para as refeições que participará.</span>
                      </p>
                    )}
                  </div>
                )}

                {/* Personal Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome Completo do Titular *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: David Cohen"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
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
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp / Celular *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          placeholder="(41) 99999-9999"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Restrições Alimentares ou Observações (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Vegetariano, alergia a frutos secos, cadeirante..."
                      value={formData.dietaryNotes}
                      onChange={e => setFormData({ ...formData, dietaryNotes: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                    />
                  </div>
                </div>

                {/* Total & Submit */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Total a pagar:</span>
                    <span className="text-3xl font-black text-chabad">
                      {isFree ? 'Gratuito' : `R$ ${totalPrice.toFixed(2)}`}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="bg-chabad hover:bg-chabad-pine text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-luxury hover:shadow-lg transition-all flex items-center space-x-2"
                  >
                    <span>{isFree ? 'Confirmar Inscrição' : 'Avançar para Pagamento PIX'}</span>
                  </button>
                </div>

              </form>
            )}

            {/* STEP 2: PIX PAYMENT */}
            {step === 'payment' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-serif text-2xl font-bold text-slate-900">
                    Pagamento via PIX Instantâneo
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Escaneie o QR Code ou use a chave PIX abaixo para efetuar o pagamento.
                  </p>
                </div>

                {/* PIX Box */}
                <div className="text-center space-y-4 p-6 bg-emerald-50/70 rounded-3xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    QR Code Oficial Beit Chabad Curitiba
                  </div>

                  <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-slate-200">
                    {pixQrDataUrl ? (
                      <img src={pixQrDataUrl} alt="QR Code PIX" className="w-52 h-52 mx-auto" />
                    ) : (
                      <div className="w-52 h-52 flex items-center justify-center bg-slate-100 rounded-xl">
                        <QrCode className="w-12 h-12 text-slate-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="max-w-md mx-auto space-y-2.5">
                    <button
                      type="button"
                      onClick={handleCopyPixPayload}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                    >
                      {pixCopied ? <Check className="w-4 h-4 text-chabad-gold" /> : <Copy className="w-4 h-4" />}
                      <span>{pixCopied ? 'Código PIX Copiado com Sucesso!' : 'Copiar Código PIX (Copia e Cola)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyPixKey}
                      className="w-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                    >
                      {keyCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-700" />}
                      <span>{keyCopied ? 'Chave de E-mail Copiada!' : 'Copiar Chave E-mail: kitov@chabadcuritiba.com'}</span>
                    </button>

                    <div className="text-xs text-slate-500 pt-1">
                      Chave PIX Oficial: <strong className="text-slate-900 font-mono">kitov@chabadcuritiba.com</strong>
                    </div>
                  </div>

                  <div className="text-sm font-bold text-slate-800 pt-3 border-t border-emerald-200">
                    Valor a Transferir: <span className="text-chabad font-black text-lg">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* PIX Verification & Receipt Attachment */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Comprovante de Pagamento</span>
                    </div>
                    <span className="text-[10px] text-slate-400 lowercase font-normal">expira em 7 dias</span>
                  </div>

                  {/* Attachment Box for PIX Receipt */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5 text-chabad" />
                        <span>Anexar Foto ou Comprovante do PIX (Recomendado)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">JPG, PNG ou PDF</span>
                    </label>

                    {!receiptDataUrl ? (
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-300 hover:border-chabad bg-white hover:bg-emerald-50/50 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1.5"
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div className="text-xs font-bold text-slate-800">
                          Clique para Tirar Foto ou Anexar Comprovante
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Anexe o print da tela do seu banco para aprovação imediata
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,application/pdf"
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="bg-white border border-emerald-300 rounded-2xl p-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-3 truncate">
                          {receiptDataUrl.startsWith('data:image') ? (
                            <img src={receiptDataUrl} alt="Comprovante" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="truncate">
                            <div className="text-xs font-bold text-slate-900 truncate">
                              {receiptFileName || 'Comprovante PIX Anexado'}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-semibold flex items-center">
                              <Check className="w-3 h-3 mr-0.5" />
                              Pronto para envio seguro
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveReceipt}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remover comprovante"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <label className="flex items-start space-x-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData.agreedToPix}
                      onChange={e => setFormData({ ...formData, agreedToPix: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-chabad rounded border-slate-300 focus:ring-chabad accent-chabad"
                    />
                    <span className="text-xs text-slate-700 font-medium">
                      Confirmo que realizei o pagamento no valor de <strong>R$ {totalPrice.toFixed(2)}</strong> via PIX para <strong>kitov@chabadcuritiba.com</strong>.
                    </span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    ← Voltar e alterar dados
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmRegistration}
                    disabled={isProcessing || (!formData.agreedToPix && !isFree)}
                    className="bg-chabad hover:bg-chabad-pine text-white px-8 py-3.5 rounded-xl font-bold shadow-luxury transition-all text-sm flex items-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <span>Registrando inscrição...</span>
                    ) : (
                      <span>Concluir Inscrição & Gerar Voucher</span>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* STEP 3: CONFIRMED */}
            {step === 'confirmed' && (
              <div className="text-center space-y-6 animate-in zoom-in-95 duration-200">
                
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-amber-100 text-amber-900 border border-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Inscrição Registrada • Pendente de Conferência Bancária</span>
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-slate-900">
                    Inscrição Registrada com Sucesso!
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                    Os dados foram encaminhados para a diretoria (<strong className="text-slate-900">mendys@gmail.com</strong>).
                  </p>
                </div>

                {/* Voucher Card */}
                <div className="bg-gradient-to-br from-chabad-dark to-chabad-navy text-white p-6 rounded-3xl shadow-xl text-left border border-chabad-gold/30 space-y-4">
                  <div className="flex justify-between items-start border-b border-white/15 pb-3">
                    <div>
                      <div className="text-[10px] text-chabad-gold font-bold uppercase tracking-widest">
                        Beit Chabad do Paraná • Comprovante de Inscrição
                      </div>
                      <div className="font-bold text-lg text-white mt-0.5">{currentEvent.title}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-300 block">Voucher:</span>
                      <span className="font-mono text-base font-black text-chabad-gold">{ticketCode}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-200">
                    <div>
                      <span className="text-slate-400 block">Inscrito:</span>
                      <span className="font-semibold text-white">{formData.fullName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Ingressos:</span>
                      <span className="font-semibold text-white">{totalTickets} {totalTickets > 1 ? 'lugares' : 'lugar'} ({getTicketSummaryString()})</span>
                    </div>
                    {getSelectedMealsList().length > 0 && (
                      <div className="col-span-2">
                        <span className="text-slate-400 block">Refeições Escolhidas:</span>
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {getSelectedMealsList().map((m, idx) => (
                            <span key={idx} className="bg-chabad-gold/20 text-chabad-gold font-bold px-2 py-0.5 rounded border border-chabad-gold/40 text-[11px]">
                              {m.includes('Almoço') ? `☀️ ${m}` : m.includes('Jantar') ? `🌙 ${m}` : m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-400 block">Valor PIX:</span>
                      <span className="font-semibold text-chabad-gold font-mono">R$ {totalPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Data & Horário:</span>
                      <span>{currentEvent.date} às {currentEvent.time}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block">Local:</span>
                      <span>{currentEvent.location || 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left space-y-1">
                  <div className="font-bold flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Agilize a confirmação pelo WhatsApp
                  </div>
                  <div>Envie a foto ou PDF do comprovante do seu banco para o número da secretaria comunitária com um único clique.</div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={`https://wa.me/554198977249?text=${encodeURIComponent(`*Comprovante de Inscrição - ${currentEvent.title}*\n\n*Voucher:* #${ticketCode}\n*Inscrito:* ${formData.fullName}\n*Ingressos:* ${totalTickets}x (${getTicketSummaryString()})${getSelectedMealsList().length > 0 ? `\n*Refeições:* ${getSelectedMealsList().join(', ')}` : ''}\n*Valor:* R$ ${totalPrice.toFixed(2)}\n*Data do Evento:* ${currentEvent.date} às ${currentEvent.time}\n\n_Segue comprovante de transferência para kitov@chabadcuritiba.com:_`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-luxury transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Comprovante no WhatsApp (+55 41 9897-7249)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-5 py-3.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Imprimir Voucher</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('home')}
                    className="w-full sm:w-auto bg-chabad hover:bg-chabad-pine text-white font-bold px-6 py-3.5 rounded-xl text-xs transition-all"
                  >
                    Voltar para Início
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};
