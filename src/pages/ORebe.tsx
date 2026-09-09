import React from 'react';
import { Sparkles, Heart, BookOpen, Send, Flame, Globe, ArrowRight, Quote } from 'lucide-react';

interface ORebeProps {
  onNavigate: (page: string) => void;
  onOpenOhel: () => void;
}

export const ORebe: React.FC<ORebeProps> = ({ onNavigate, onOpenOhel }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-chabad-navy to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            Liderança Espiritual & Amor Incondicional
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            O Rebe de Lubavitch
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Rabi Menachem Mendel Schneerson (1902–1994) — o líder que transformou o pós-Holocausto em um renascimento global do judaísmo com amor, positividade e fé inabalável.
          </p>
        </div>
      </section>

      {/* Main Biography & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Uma Visão Revolucionária: Nenhum Judeu Deixado para Trás
            </h2>

            <p>
              Reconhecido internacionalmente como uma das personalidades mais influentes do século XX, o Rebe foi um líder extraordinário, erudito de sabedoria monumental tanto nos mistérios da Torá e Cabala quanto nas ciências contemporâneas.
            </p>

            <p>
              Ao assumir a liderança do movimento Chabad em 1950, o Rebe lançou uma visão sem precedentes: enviar casais de emissários (Shluchim) aos quatro cantos do planeta — de grandes metrópoles como Curitiba a ilhas remotas — não para julgar ou criticar, mas para estender a mão a todo e qualquer ser humano com carinho, alimentos, acolhimento e luz espiritual.
            </p>

            {/* Sunday Dollars Quote */}
            <div className="p-6 bg-chabad-gold/10 rounded-2xl border-l-4 border-chabad-gold text-slate-800 my-6">
              <Quote className="w-6 h-6 text-chabad-gold mb-2" />
              <p className="italic font-serif text-base text-slate-900">
                "Quando duas pessoas se encontram, algo de bom para uma terceira deve resultar desse encontro."
              </p>
              <div className="text-xs text-slate-600 mt-2 font-semibold">
                — O Rebe, durante as famosas distribuições dominicais de notas de um dólar para incentivar a caridade (Tzedaká)
              </div>
            </div>

            <p>
              Para o Rebe, não existia divisão entre judeus "ortodoxos", "reformistas", "seculares" ou "afiliados". Para ele, <strong>"um judeu é um judeu"</strong>, possuidor de uma centelha divina imaculada e digna do mais profundo respeito e afeto.
            </p>
          </div>

          {/* Rebbe Tribute Box & Ohel Action */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900 to-chabad-navy text-white p-8 rounded-3xl shadow-2xl border border-chabad-gold/30 text-center space-y-6">
              
              <div className="w-20 h-20 bg-chabad-gold/20 rounded-full flex items-center justify-center mx-auto border border-chabad-gold/40 text-chabad-gold">
                <Sparkles className="w-10 h-10" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-white">
                  O Ohel Sagrado em Nova York
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  O local de descanso do Rebe em Queens, NY, é visitado anualmente por centenas de milhares de pessoas de todas as crenças em busca de bênçãos, consolo, orientação e cura.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 text-left space-y-2">
                <div className="font-bold text-chabad-gold flex items-center">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Envie sua Carta através do Beit Chabad Paraná:
                </div>
                <p>
                  Imprimimos e entregamos sua carta no Ohel com sigilo e respeito absoluto.
                </p>
              </div>

              <button
                onClick={onOpenOhel}
                className="w-full bg-chabad-gold hover:bg-yellow-500 text-chabad-dark py-3.5 rounded-xl font-bold text-sm shadow-gold transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Escrever Carta ao Rebe</span>
              </button>

              <button
                onClick={() => onNavigate('campanha-mitsvot')}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition-all"
              >
                Conhecer as 10 Campanhas do Rebe →
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* Core Teachings */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Pilares do Pensamento do Rebe
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Princípios eternos que inspiram as ações diárias do Beit Chabad em Curitiba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-chabad flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">O Poder de Um Único Ato</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Baseado em Maimônides, o Rebe ensinou que o mundo está em equilíbrio exato; um único ato positivo de bondade pode inclinar toda a balança da humanidade para o lado do mérito e da salvação.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-chabad-gold flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Ahavat Yisrael Incondicional</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                O amor ao próximo não pode depender do que o outro pensa ou pratica. Amar a essência da alma judaica é a porta de entrada para a santidade e para a harmonia comunitária.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900">Positividade e Otimismo Cósmico</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                "Pense positivo e tudo será positivo" (<em>Tracht gut vet zein gut</em>). O Rebe transformava qualquer desafio em oportunidade de crescimento e elevação espiritual.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
