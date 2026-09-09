import React, { useState } from 'react';
import { TORAH_CLASSES } from '../data/mockData';
import { BookOpen, Calendar, Clock, Video, Users, Sparkles, Download, Check } from 'lucide-react';

export const Colel: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todas as Aulas' },
    { id: 'Estudo Diário', label: 'Estudo Diário (Manhã)' },
    { id: 'Tanya & Chassidut', label: 'Tanya & Chassidut' },
    { id: 'Parasha', label: 'Parashat HaShavua' },
    { id: 'Feminino', label: 'Espaço da Mulher' },
  ];

  const filteredClasses = selectedCategory === 'all' 
    ? TORAH_CLASSES 
    : TORAH_CLASSES.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Colel & Centro de Estudos Judaicos
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Aulas de Torá & Sabedoria
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Alimente sua alma e sua mente com aulas envolventes sobre a porção semanal da Torá, filosofia chassídica, Tanya, mística e ética milenar.
          </p>
        </div>
      </section>

      {/* Main Classes Schedule */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-chabad text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-chabad bg-chabad-light px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                  {item.isOnlineAvailable && (
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md flex items-center">
                      <Video className="w-3 h-3 mr-1" /> Zoom Disponível
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 text-chabad mr-2" />
                    <span>Dia: <strong>{item.day}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3.5 h-3.5 text-chabad mr-2" />
                    <span>Horário: <strong>{item.time}</strong></span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3.5 h-3.5 text-chabad mr-2" />
                    <span>Público: {item.audience}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20participar%20das%20aulas%20de%20Torá."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-slate-50 hover:bg-chabad hover:text-white text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-all border border-slate-200 text-center"
                >
                  Inscrever-se / Receber Link
                </a>
              </div>
            </div>
          ))}
        </div>

      </section>

    </div>
  );
};
