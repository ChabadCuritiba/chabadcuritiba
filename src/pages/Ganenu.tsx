import React, { useState } from 'react';
import { GraduationCap, Sun, Smile, CheckCircle2 } from 'lucide-react';
import { submitToChabadEmail, CHABAD_OFFICIAL_EMAIL } from '../utils/formSubmit';

export const Ganenu: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitToChabadEmail({
      subject: `[Ganênu Curitiba] Interesse em Matrícula/Visita - ${formData.parentName}`,
      fields: {
        'Nome dos Pais': formData.parentName,
        'Nome da Criança': formData.childName,
        'Idade': formData.childAge,
        'WhatsApp / Telefone': formData.phone,
        'E-mail': formData.email,
      }
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-chabad to-emerald-800 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-emerald-200 uppercase">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            Educação Infantil & Primeiros Passos
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ganênu Curitiba
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Onde as crianças florescem com amor, calor chassídico, brincadeiras pedagógicas e o doce sabor das tradições judaicas.
          </p>
        </div>
      </section>

      {/* Main Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Amor Incondicional e Valores para Toda a Vida
            </h2>

            <p>
              O <strong>Ganênu</strong> ("Nosso Jardim") é um espaço acolhedor e seguro, projetado com carinho para crianças da primeira infância. Inspirado nos ensinamentos do Rebe sobre a pureza das almas infantis, nosso objetivo é nutrir tanto o desenvolvimento cognitivo e emocional quanto a identidade judaica positiva de cada pequeno aluno.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                  <Sun className="w-4 h-4 text-amber-500 mr-2" />
                  Ambiente Estimulante
                </div>
                <div className="text-xs text-slate-600">
                  Salas climatizadas, brinquedoteca, artes plásticas, música e vivências sensoriais guiadas por pedagogas experientes.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                  <Smile className="w-4 h-4 text-emerald-600 mr-2" />
                  Tradição com Alegria
                </div>
                <div className="text-xs text-slate-600">
                  Shabat simulado toda sexta-feira com Chalá feita pelas próprias crianças, canções em hebraico e celebração de todos os Chaguim.
                </div>
              </div>
            </div>
          </div>

          {/* Interest Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury">
              <div className="flex items-center space-x-2 text-xs font-bold text-chabad uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Interesse em Matrícula</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                Visite o Ganênu
              </h3>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nome dos Pais / Responsável *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome da Criança *</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome do filho(a)"
                        value={formData.childName}
                        onChange={e => setFormData({ ...formData, childName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Idade *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 3 anos"
                        value={formData.childAge}
                        onChange={e => setFormData({ ...formData, childAge: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
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
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-chabad hover:bg-chabad-pine text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all"
                  >
                    Agendar Visita Pedagógica
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">Mensagem Recebida!</h4>
                  <p className="text-xs text-slate-600">
                    Nossa coordenadora pedagógica entrará em contato para agendar uma visita e apresentar o Ganênu à sua família.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
