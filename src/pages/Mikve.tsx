import React, { useState } from 'react';
import { Droplets, Calendar, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

export const Mikve: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    isBride: 'nao',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitToChabadEmail({
      subject: `[Mikvê] Solicitação de Agendamento - ${formData.name}`,
      fields: {
        'Nome Completo': formData.name,
        'WhatsApp / Telefone': formData.phone,
        'E-mail': formData.email,
        'Data Pretendida': formData.preferredDate,
        'Horário Aproximado': formData.preferredTime,
        'Noiva / Casamento': formData.isBride === 'sim' ? 'Sim (Noiva)' : 'Não (Imersão Regular)',
        'Observações': formData.notes,
      }
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-sky-950 via-sky-900 to-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-sky-500/20 border border-sky-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-sky-300 uppercase">
            <Droplets className="w-3.5 h-3.5 mr-1" />
            Taharat HaMishpacha • Pureza Familiar
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Mikvê
          </h1>
          <p className="mt-4 text-base sm:text-lg text-sky-100 leading-relaxed font-light">
            Um refúgio de paz, beleza e renovação espiritual para a mulher judia em Curitiba. Instalações modernas com o mais alto padrão de higiene e privacidade.
          </p>
        </div>
      </section>

      {/* Main Content & Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              A Fonte Secreta da Bênção no Casamento Judaico
            </h2>

            <p>
              O <strong>Mikvê</strong> é a própria espinha dorsal da continuidade do povo judeu. A imersão em suas águas vivas e sagradas marca o ápice do ciclo mensal da <em>Pureza Familiar (Taharat HaMishpacha)</em>, trazendo uma renovação constante do amor conjugal, serenidade para o lar e bênçãos especiais.
            </p>

            <p>
              Construído de acordo com os mais rigorosos parâmetros da lei judaica (Halachá) e com supervisão rabínica especializada, o <strong>Mikvê</strong> em Curitiba foi projetado para oferecer o máximo conforto e tranquilidade.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex items-start space-x-3 text-sm">
                <Sparkles className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-950 block">Atendimento Exclusivo para Noivas (Calot)</strong>
                  Aulas personalizadas e acompanhamento carinhoso para preparar a futura noiva com amor e conhecimento para o dia mais sagrado de sua vida.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start space-x-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Privacidade e Sigilo Absolutos</strong>
                  Cada atendimento é realizado de forma individual e agendada com antecedência, garantindo total discrição.
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form / Contact */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury">
              <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Agendamento Confidencial</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Solicitar Horário no Mikvê
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(41) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">É para Noiva (Casamento)?</label>
                      <select
                        value={formData.isBride}
                        onChange={e => setFormData({ ...formData, isBride: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                      >
                        <option value="nao">Não (Imersão Mensal)</option>
                        <option value="sim">Sim (Noiva / Casamento)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Data Pretendida *</label>
                      <input
                        type="date"
                        required
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Horário Aproximado</label>
                      <input
                        type="time"
                        value={formData.preferredTime}
                        onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Observações (Opcional)</label>
                    <textarea
                      rows={2}
                      placeholder="Alguma necessidade específica?"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-800 hover:bg-sky-900 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                  >
                    Enviar Solicitação de Agendamento
                  </button>

                  <div className="text-center pt-2">
                    <a
                      href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20agendar%20um%20horário%20no%20Mikvê."
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-800 hover:underline font-semibold"
                    >
                      Ou agende diretamente pelo WhatsApp confidencial →
                    </a>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="w-12 h-12 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Solicitação Enviada!</h4>
                  <p className="text-xs text-slate-600">
                    A responsável pelo Mikvê entrará em contato confidencialmente com você para confirmar o horário.
                  </p>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/554198977249?text=${encodeURIComponent(`*Solicitação de Agendamento no Mikvê*\n\n*Nome:* ${formData.name}\n*WhatsApp:* ${formData.phone}\n*Data Pretendida:* ${formData.preferredDate}\n*Horário:* ${formData.preferredTime}\n*Noiva:* ${formData.isBride === 'sim' ? 'Sim' : 'Não'}\n*Observações:* ${formData.notes || 'Nenhuma'}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm transition-all"
                    >
                      <span>Avisar no WhatsApp da Responsável</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
