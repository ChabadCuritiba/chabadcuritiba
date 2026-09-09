import React, { useState, useEffect } from 'react';
import { getCommunityEvents, fetchRemoteEvents } from '../utils/eventsManager';
import { CommunityEvent } from '../types';
import { Calendar, Clock, MapPin, Search, ArrowRight, QrCode, CreditCard, Sparkles, Filter, Ticket } from 'lucide-react';

interface EventsPageProps {
  onSelectEvent: (event: CommunityEvent) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<CommunityEvent[]>(() => getCommunityEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchRemoteEvents().then(remoteList => {
      if (Array.isArray(remoteList)) {
        setEvents(remoteList);
      }
    });
  }, []);

  const categories = ['all', 'Festa & Chag', 'Shabat', 'Palestra & Curso', 'Juventude'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.subtitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/logo.png" 
              alt="Beit Chabad Paraná" 
              className="h-16 w-auto bg-white/95 p-2 rounded-2xl shadow-xl backdrop-blur-md"
            />
          </div>
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Ticket className="w-3.5 h-3.5 mr-1" />
            Inscrições Abertas com PIX Instantâneo
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Próximos Eventos & RSVP
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Celebrações comunitárias, jantares festivos de Shabat, conferências e cursos. Reserve seu lugar com confirmação imediata.
          </p>
        </div>
      </section>

      {/* Main Events Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar evento por nome ou tema..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-chabad"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-chabad text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todos os Eventos' : cat}
              </button>
            ))}
          </div>

        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div 
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Cover */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000'} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-chabad-dark/80 backdrop-blur-sm text-chabad-gold font-bold text-[11px] px-2.5 py-1 rounded-lg border border-chabad-gold/30">
                    {event.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-chabad font-black text-white text-xs px-3 py-1 rounded-lg shadow-md">
                    {event.price === 0 ? 'Gratuito' : `R$ ${event.price}`}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6">
                  <div className="flex items-center text-xs text-chabad-goldDark font-semibold mb-2 space-x-2">
                    <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {event.date}</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {event.time}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {event.subtitle}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-chabad shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => onSelectEvent(event)}
                  className="w-full bg-chabad hover:bg-chabad-pine text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all group-hover:bg-chabad-pine"
                >
                  <Ticket className="w-4 h-4 text-chabad-gold" />
                  <span>Inscrever-se com PIX</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-serif text-xl font-bold text-slate-700">Nenhum evento encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca ou o filtro de categoria.</p>
          </div>
        )}

      </section>

    </div>
  );
};
