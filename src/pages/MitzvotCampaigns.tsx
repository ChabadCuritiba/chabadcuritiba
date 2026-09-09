import React, { useState } from 'react';
import { MITZVAH_CAMPAIGNS } from '../data/mockData';
import { 
  Flame, Home, Scroll, HeartHandshake, Utensils, 
  BookOpen, Droplets, Library, GraduationCap, Users, 
  CheckCircle2, ArrowRight, Quote, ShieldCheck 
} from 'lucide-react';

interface MitzvotCampaignsProps {
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
}

export const MitzvotCampaigns: React.FC<MitzvotCampaignsProps> = ({ onNavigate, onOpenDonate }) => {
  const [selectedMitzvahId, setSelectedMitzvahId] = useState<string>(MITZVAH_CAMPAIGNS[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scroll': return <Scroll className="w-5 h-5" />;
      case 'Home': return <Home className="w-5 h-5" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Utensils': return <Utensils className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'Library': return <Library className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const currentMitzvah = MITZVAH_CAMPAIGNS.find(m => m.id === selectedMitzvahId) || MITZVAH_CAMPAIGNS[0];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Flame className="w-3.5 h-3.5 mr-1" />
            Ações Práticas para Iluminar o Mundo
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            As 10 Campanhas de Mitsvot
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Iniciadas pelo Rebe de Lubavitch, estas dez campanhas são as pontes fundamentais para conectar cada judeu às suas raízes sagradas e trazer bênçãos tangíveis para o lar.
          </p>
        </div>
      </section>

      {/* Main Interactive Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation: List of 10 Mitzvot */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">
              Selecione uma Mitsvá para detalhes:
            </h3>
            {MITZVAH_CAMPAIGNS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMitzvahId(m.id)}
                className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between border ${
                  selectedMitzvahId === m.id
                    ? 'bg-chabad text-white border-chabad shadow-md font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-chabad/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                    selectedMitzvahId === m.id ? 'bg-white/20 text-chabad-gold' : 'bg-slate-100 text-slate-600'
                  }`}>
                    #{m.number}
                  </div>
                  <div>
                    <div className="text-sm">{m.title}</div>
                    <div className={`text-[11px] ${selectedMitzvahId === m.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {m.hebrewTitle}
                    </div>
                  </div>
                </div>
                <div className={selectedMitzvahId === m.id ? 'text-chabad-gold' : 'text-slate-400'}>
                  {getIcon(m.iconName)}
                </div>
              </button>
            ))}
          </div>

          {/* Right Detail Pane */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-luxury space-y-8 sticky top-28">
              
              {/* Header of selected mitzvah */}
              <div className="border-b border-slate-100 pb-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-chabad bg-chabad-light px-3 py-1 rounded-full">
                    Campanha #{currentMitzvah.number}
                  </span>
                  <span className="font-serif text-lg font-bold text-chabad-goldDark" dir="rtl">
                    {currentMitzvah.hebrewTitle}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 mt-2">
                  {currentMitzvah.title}
                </h2>
                <p className="text-base text-slate-600 mt-1 font-medium">
                  {currentMitzvah.subtitle}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  O Significado Espiritual
                </h4>
                <p>{currentMitzvah.description}</p>
              </div>

              {/* Quote */}
              <div className="p-5 bg-chabad-goldLight/60 rounded-2xl border-l-4 border-chabad-gold text-slate-800">
                <Quote className="w-5 h-5 text-chabad-goldDark mb-1.5" />
                <p className="italic font-serif text-sm sm:text-base text-slate-900">
                  {currentMitzvah.quote}
                </p>
                <div className="text-xs text-slate-600 mt-2 font-medium">
                  — O Rebe de Lubavitch
                </div>
              </div>

              {/* How-To Steps */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Como Praticar no Seu Dia a Dia:
                </h4>
                <div className="space-y-2.5">
                  {currentMitzvah.howTo.map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-chabad shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support & Community action */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Precisa de ajuda ou orientação para cumprir esta mitsvá em Curitiba?
                </div>
                <div className="flex items-center space-x-3">
                  {currentMitzvah.id === 'mezuzah' || currentMitzvah.id === 'tefilin' ? (
                    <button
                      onClick={() => onNavigate('mezuzot-tefilin')}
                      className="bg-chabad hover:bg-chabad-pine text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                    >
                      Solicitar Verificação de Mezuzá/Tefilin
                    </button>
                  ) : currentMitzvah.id === 'taharat-hamishpacha' ? (
                    <button
                      onClick={() => onNavigate('mikve')}
                      className="bg-sky-700 hover:bg-sky-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                    >
                      Conhecer o Mikvê
                    </button>
                  ) : (
                    <a
                      href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20orientação%20sobre%20as%20Mitsvot."
                      target="_blank"
                      rel="noreferrer"
                      className="bg-chabad hover:bg-chabad-pine text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md"
                    >
                      Falar com a Equipe pelo WhatsApp
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
