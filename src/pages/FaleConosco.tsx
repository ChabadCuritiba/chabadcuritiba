import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

export const FaleConosco: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Informações Gerais',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitToChabadEmail({
      subject: `[Contato Site] ${formData.subject} - ${formData.name}`,
      fields: {
        'Nome Completo': formData.name,
        'E-mail': formData.email,
        'WhatsApp / Telefone': formData.phone,
        'Assunto': formData.subject,
        'Mensagem': formData.message,
      }
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Phone className="w-3.5 h-3.5 mr-1" />
            Canais de Atendimento
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Fale Conosco
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Estamos sempre de portas e braços abertos para atender você e sua família em Curitiba e no Paraná.
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Info & Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Informações de Contato
              </h3>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-chabad-light text-chabad flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Localização:</strong>
                    <span>Curitiba - Paraná • Brasil</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-chabad-light text-chabad flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">Telefone Central:</strong>
                    <a href="tel:+554198977249" className="hover:text-chabad font-medium">
                      +55 (41) 9897-7249
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">WhatsApp Oficial:</strong>
                    <a href="https://wa.me/554198977249" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold">
                      +55 (41) 9897-7249 (Clique para conversar)
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-chabad-light text-chabad flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold">E-mail:</strong>
                    <a href={`mailto:${CHABAD_OFFICIAL_EMAIL}`} className="hover:text-chabad font-medium">
                      {CHABAD_OFFICIAL_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20falar%20com%20a%20equipe%20do%20Beit%20Chabad."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Iniciar Conversa no WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-luxury">
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                Envie uma Mensagem Direta
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Sua mensagem será enviada diretamente para: <strong>{CHABAD_OFFICIAL_EMAIL}</strong>.
              </p>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome completo"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(41) 99999-9999"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail *</label>
                      <input
                        type="email"
                        required
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Assunto</label>
                      <select
                        value={formData.subject}
                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                      >
                        <option value="Informações Gerais">Informações Gerais</option>
                        <option value="Sinagoga & Shabat">Sinagoga & Horários de Shabat</option>
                        <option value="Mikvê">Mikvê</option>
                        <option value="Ganênu & Educação Infantil">Ganênu & Educação Infantil</option>
                        <option value="Juventude & Alicerces">Juventude & Projeto Alicerces</option>
                        <option value="Mezuzot & Tefilin">Mezuzot & Tefilin (Verificação)</option>
                        <option value="KiTov Casher">KiTov - Alimentos Casher</option>
                        <option value="Doação & Apoio">Doações e Parcerias</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mensagem *</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Como podemos ajudar você?"
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-chabad hover:bg-chabad-pine text-white py-3.5 rounded-xl font-bold text-sm shadow-luxury transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4 text-chabad-gold" />
                    <span>Enviar Mensagem para {CHABAD_OFFICIAL_EMAIL}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Mensagem Encaminhada com Sucesso!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Sua mensagem foi direcionada para <strong>{CHABAD_OFFICIAL_EMAIL}</strong>. Responderemos para seu e-mail ou telefone em breve.
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                    <a
                      href={`https://wa.me/554198977249?text=${encodeURIComponent(`*Nova Mensagem pelo Site (Fale Conosco)*\n\n*Nome:* ${formData.name}\n*E-mail:* ${formData.email}\n*Telefone:* ${formData.phone}\n*Assunto:* ${formData.subject}\n*Mensagem:* ${formData.message}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Enviar também cópia pelo WhatsApp</span>
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

