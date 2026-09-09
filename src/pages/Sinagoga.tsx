import React, { useState } from 'react';
import { SYNAGOGUE_SCHEDULE } from '../data/mockData';
import { Flame, Calendar, Clock, MapPin, Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';

interface SinagogaProps {
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
}

export const Sinagoga: React.FC<SinagogaProps> = ({ onNavigate, onOpenDonate }) => {
  const [activeTab, setActiveTab] = useState<'shabbat' | 'weekdays' | 'festas'>('shabbat');

  const holidays = [
    {
      name: 'Pessach (Páscoa Judaica)',
      hebrewName: 'פסח',
      desc: 'Celebração da libertação do Egito com Sedarim comunitários, Matsá Shmurá artesanal importada e vinhos finos casher.',
      customs: ['Sedarim comunitários', 'Proibição rigorosa de Chametz', 'Distribuição de Matsot']
    },
    {
      name: 'Rosh Hashaná & Yom Kipur (Grandes Festas)',
      hebrewName: 'ראש השנה ויום כיפור',
      desc: 'Oração solene, toque sagrado do Shofar, oração de Tashlich, Ne’ilá e quebra de jejum comunitária com fartura e alegria.',
      customs: ['Toque do Shofar', 'Maçã com Mel', 'Jejum solene de Yom Kipur']
    },
    {
      name: 'Sucot & Simchat Torá',
      hebrewName: 'סוכות ושמחת תורה',
      desc: 'Banquete festivo na grande Sucá comunitária, bênção das Quatro Espécies (Lulav e Etrog) e danças exuberantes com os rolos da Torá.',
      customs: ['Refeições na Sucá', 'Bênção do Lulav & Etrog', 'Hakafot e danças']
    },
    {
      name: 'Chanucá (Festa das Luzes)',
      hebrewName: 'חנוכה',
      desc: 'Acendimento público da Grande Menorá em praças de Curitiba, distribuição de Sufganiot (sonhos) quentinhos e moedas de chocolate para as crianças.',
      customs: ['Acendimento da Menorá', 'Sufganiot e Latkes', 'Chanucá Guêlt']
    },
    {
      name: 'Purim',
      hebrewName: 'פורים',
      desc: 'Leitura da Meguilat Ester com matracas, banquete carnavalesco com fantasias, Mishloach Manot (troca de presentes) e Matanot LaEvyonim.',
      customs: ['Leitura da Meguilá', 'Mishloach Manot', 'Banquete festivo']
    },
    {
      name: 'Shavuot',
      hebrewName: 'שבועות',
      desc: 'Festa da Entrega da Torá no Monte Sinai, noite inteira de estudo místico (Tikun Leil Shavuot) e recepção das Dez Palavras com banquete de laticínios.',
      customs: ['Leitura dos 10 Mandamentos', 'Refeição de Laticínios', 'Vigília de estudo']
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Flame className="w-3.5 h-3.5 mr-1" />
            Orações Diárias
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Sinagoga & Grandes Festas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Um lugar para preces e amizades no coração de Curitiba, onde a prece se une à música chassídica e a amizade comunitária.
          </p>
        </div>
      </section>

      {/* Schedule Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('shabbat')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'shabbat' ? 'bg-chabad text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Horários de Shabat
            </button>
            <button
              onClick={() => setActiveTab('weekdays')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'weekdays' ? 'bg-chabad text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dias de Semana & Domingo
            </button>
            <button
              onClick={() => setActiveTab('festas')}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'festas' ? 'bg-chabad text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guia das Grandes Festas
            </button>
          </div>
        </div>

        {/* Tab Content: Shabbat */}
        {activeTab === 'shabbat' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-chabad-gold flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Programação Sagrada do Shabat</h3>
                  <p className="text-xs text-slate-500">Kabalat Shabat às 19:15, Shacharit às 10:00 e Kidush comunitário às 12:45</p>
                </div>
              </div>

              <div className="space-y-4">
                {SYNAGOGUE_SCHEDULE.shabbat.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-chabad bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-center">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Weekdays */}
        {activeTab === 'weekdays' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-chabad flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Minianim Diários e Domingo</h3>
                  <p className="text-xs text-slate-500">Tefilot com colocação de Tefilin e leitura da Torá</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Segunda a Sexta-feira:</h4>
                {SYNAGOGUE_SCHEDULE.weekdays.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-chabad bg-white px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
                      {item.time}
                    </div>
                  </div>
                ))}

                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-3">Domingo de Manhã:</h4>
                {SYNAGOGUE_SCHEDULE.sundays.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{item.desc}</div>
                    </div>
                    <div className="font-mono text-sm font-bold text-chabad-goldDark bg-white px-3 py-1.5 rounded-xl border border-amber-200 shrink-0">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: High Holidays & Festas */}
        {activeTab === 'festas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {holidays.map((h, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-chabad mb-2">
                    <span className="font-bold uppercase tracking-wider">Festa Judaica</span>
                    <span className="font-serif font-bold text-base" dir="rtl">{h.hebrewName}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{h.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{h.desc}</p>
                  
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    {h.customs.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center">
                        <Sparkles className="w-3 h-3 text-chabad-gold mr-1.5 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onNavigate('fale-conosco')}
                    className="w-full bg-slate-50 hover:bg-chabad hover:text-white text-slate-700 font-bold py-2 rounded-xl text-xs transition-all border border-slate-200"
                  >
                    Informações e Participação
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </section>

    </div>
  );
};
