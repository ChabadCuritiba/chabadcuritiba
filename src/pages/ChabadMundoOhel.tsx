import React from 'react';
import { Globe, Send, Sparkles, MapPin, Heart, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface ChabadMundoOhelProps {
  onOpenOhel: () => void;
  onOpenDonate: () => void;
}

export const ChabadMundoOhel: React.FC<ChabadMundoOhelProps> = ({ onOpenOhel, onOpenDonate }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-chabad-navy to-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Globe className="w-3.5 h-3.5 mr-1" />
            Presença Internacional & Ohel Sagrado
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Chabad no Mundo & O Ohel
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Conheça o alcance planetário do movimento Chabad-Lubavitch e como você pode enviar suas orações e pedidos de bênção ao Ohel do Rebe em Nova York.
          </p>
        </div>
      </section>

      {/* Global Movement & Brooklyn 770 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Mais de 3.500 Centros nos 5 Continentes
            </h2>
            <p>
              Onde quer que um viajante, estudante ou família judaica se encontre no planeta — de Tóquio a Paris, de Buenos Aires a Curitiba, do Nepal ao Alasca — haverá sempre um <strong>Beit Chabad</strong> de portas abertas com uma refeição quente de Shabat, palavras amigas e acolhimento espiritual.
            </p>
            <p>
              O epicentro espiritual mundial do movimento é o famoso endereço <strong>770 Eastern Parkway</strong> no Brooklyn, Nova York — o local onde o Rebe liderou o judaísmo contemporâneo por mais de 40 anos e de onde emana a luz que alcança nossa comunidade no Paraná.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-serif text-2xl font-bold text-chabad">100+</div>
                <div className="text-xs text-slate-600 mt-0.5">Países Atendidos</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-serif text-2xl font-bold text-chabad">5.000+</div>
                <div className="text-xs text-slate-600 mt-0.5">Famílias de Shluchim</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-chabad-dark to-chabad-navy text-white p-8 rounded-3xl shadow-luxury border border-chabad-gold/40 space-y-6">
              <div className="w-16 h-16 bg-chabad-gold/20 rounded-2xl flex items-center justify-center border border-chabad-gold/30 text-chabad-gold">
                <Send className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs text-chabad-gold font-bold uppercase tracking-widest">
                  Canal Sagrado de Bênçãos
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-1">
                  O Ohel do Rebe em Queens, NY
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  O <em>Ohel</em> é o local de repouso do Rebe de Lubavitch e de seu sogro, o sexto Rebe, Rabi Yosef Yitzchak Schneersohn. É um local sagrado onde judeus e não-judeus do mundo inteiro vão orar, ler Salmos e pedir a intercessão do Justo (Tsadik) perante D-us.
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1.5">
                <div className="font-semibold text-white flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
                  Serviço Gratuito de Envio de Cartas:
                </div>
                <p>
                  Através do Beit Chabad do Paraná, você pode enviar seus pedidos de bênção (Pidyon Nefesh / Pan). Sua carta é impressa e depositada diretamente no Ohel com total confidencialidade.
                </p>
              </div>

              <button
                onClick={onOpenOhel}
                className="w-full bg-chabad-gold hover:bg-yellow-500 text-chabad-dark py-3.5 rounded-xl font-bold text-sm shadow-gold transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Minha Carta ao Ohel</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Guide on How to prepare a letter to the Ohel */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Como Escrever uma Carta ao Ohel
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Orientações tradicionais para formular seus pedidos com sinceridade e devoção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-chabad text-sm">1. Nomes em Hebraico</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mencione seu nome em hebraico e o nome de sua mãe (ex: <em>Moshe ben Sara</em>). Caso não saiba, utilize seu nome secular completo.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-chabad text-sm">2. Expressão do Coração</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Escreva abertamente sobre sua saúde, família, trabalho, casamento ou qualquer dilema que aflige sua alma. D-us escuta a oração sincera.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="font-bold text-chabad text-sm">3. Decisão de Boa Ação</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                É auspicioso acompanhar o pedido com a decisão pessoal de cumprir uma nova boa ação (ex: dar Tzedaká, colocar Tefilin, acender velas de Shabat).
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
