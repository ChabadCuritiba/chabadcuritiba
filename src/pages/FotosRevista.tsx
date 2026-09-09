import React from 'react';
import { BookOpen, Camera, Clock, Sparkles } from 'lucide-react';

export const FotosRevista: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-chabad-navy to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Em Breve
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Fotos & Revista Digital
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Estamos preparando uma seleção especial das quatro décadas e meia de história e celebrações da nossa comunidade.
          </p>
        </div>
      </section>

      {/* Main Em Breve Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-200 shadow-luxury text-center space-y-8">
          
          <div className="w-20 h-20 bg-amber-50 text-chabad-gold rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-chabad-gold/30">
            <Sparkles className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-chabad-gold/20 text-chabad-dark border border-chabad-gold/40 uppercase tracking-wider">
              Disponível em Breve
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
              Galeria de Fotos & Revista Comemorativa 45 Anos
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              O acervo histórico digital e a edição especial da Revista Beit Chabad do Paraná (1981–2026) estão em fase final de diagramação e digitalização.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-left">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-chabad font-bold text-base">
                <BookOpen className="w-5 h-5 text-chabad-gold" />
                <span>Revista Chabad Paraná</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Artigos inspiradores, ensinamentos de Torá, entrevistas exclusivas com pioneiros da comunidade e memórias em formato digital interativo e PDF.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-chabad font-bold text-base">
                <Camera className="w-5 h-5 text-chabad-gold" />
                <span>Galeria de Momentos</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fotografias dos grandes eventos comunitários: celebrações de Chanuká em praça pública, Grandes Seders de Pessach, Purim Circus, acampamento Gan Israel e formaturas do Ganênu.
              </p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
