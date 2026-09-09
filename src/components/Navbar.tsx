import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, Clock, Heart, Phone, MapPin, 
  BookOpen, Sparkles, ChevronDown, Award, Users, 
  UtensilsCrossed, ShieldCheck, Home, Flame, Search, Bell,
  Coins
} from 'lucide-react';
import { getCuritibaShabbatTimes, fetchLiveCuritibaShabbatTimes } from '../utils/shabbatTimes';
import { 
  requestNotificationPermission, 
  showLocalSystemNotification, 
  getDailyTimeBasedNotificationTemplate 
} from '../utils/notifications';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
  onOpenPushka?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenDonate, onOpenPushka }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [shabbatTimes, setShabbatTimes] = useState(getCuritibaShabbatTimes());

  useEffect(() => {
    fetchLiveCuritibaShabbatTimes().then(liveTimes => {
      setShabbatTimes(liveTimes);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNotificationClick = async () => {
    // Immediate vibration on touch
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([300, 100, 300, 100, 300]);
      } catch (e) {}
    }

    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Notificações não são suportadas neste navegador.');
      return;
    }

    try {
      let perm = Notification.permission;
      if (perm !== 'granted') {
        perm = await Notification.requestPermission();
      }

      if (perm === 'granted') {
        const template = getDailyTimeBasedNotificationTemplate();
        const sent = await showLocalSystemNotification(
          template.title,
          template.body,
          template.url
        );
        if (sent) {
          alert('🔔 Notificação enviada! Olhe na barra superior de notificações do seu celular.');
        } else {
          alert('Notificação autorizada com sucesso!');
        }
      } else {
        alert('⚠️ O Chrome/Android bloqueou as notificações do site.\n\nPara desbloquear com 1 clique:\n1. No seu celular, vá em Configurações > Aplicativos > Chabad PR > Armazenamento > Limpar Armazenamento (ou Limpar Dados)\n2. Ao reabrir o app, toque no Sino 🔔 e selecione "Permitir"!');
      }
    } catch (e: any) {
      console.warn('Error triggering notification:', e);
      alert('Erro ao disparar notificação: ' + (e?.message || e));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Banner - Curitiba Shabbat Times & Quick Contacts */}
      <div className="bg-chabad-navy text-white text-xs sm:text-sm py-1.5 px-4 border-b border-chabad-gold/20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Shabbat Bar */}
          <div className="flex items-center space-x-3 text-slate-200">
            <span className="flex items-center text-chabad-gold font-semibold tracking-wide">
              <Flame className="w-3.5 h-3.5 mr-1 text-chabad-gold animate-pulse" />
              Shabat em Curitiba:
            </span>
            <span className="hidden sm:inline text-slate-300">
              Velas: <strong className="text-white font-bold">{shabbatTimes.candleLighting}</strong>
            </span>
            <span className="hidden md:inline text-slate-300">
              • Havdalá: <strong className="text-white font-bold">{shabbatTimes.havdalah}</strong>
            </span>
            <span className="hidden lg:inline text-chabad-gold font-medium">
              ({shabbatTimes.parashaName})
            </span>
          </div>

          {/* Direct Contacts & Actions */}
          <div className="flex items-center space-x-4 text-xs">
            <a 
              href="tel:+554133432720" 
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 mr-1 text-chabad-gold" />
              <span className="hidden sm:inline">(41) 3343-2720</span>
              <span className="sm:hidden">Ligar</span>
            </a>
            <a 
              href="https://wa.me/554198977249?text=Olá, gostaria de informações sobre o Beit Chabad Curitiba" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors font-medium bg-emerald-950/60 px-2 py-0.5 rounded"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`bg-white/95 backdrop-blur-md transition-all duration-300 ${
        scrolled ? 'shadow-luxury py-2 border-b border-slate-200' : 'py-3 border-b border-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src="/assets/logo.png" 
                  alt="Beit Chabad do Paraná" 
                  className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-xs" 
                />
              </div>
            </div>

            {/* Desktop Navigation Menu */}
            <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              <button 
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === 'home' 
                    ? 'text-chabad bg-chabad-light/60 font-bold' 
                    : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                }`}
              >
                Início
              </button>

              {/* Institucional Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('institucional')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all ${
                    ['quem-somos', 'o-rebe', 'campanha-mitsvot', 'chabad-mundo-ohel'].includes(currentPage)
                      ? 'text-chabad bg-chabad-light/60'
                      : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                  }`}
                >
                  <span>Institucional</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'institucional' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => handleNavClick('quem-somos')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Award className="w-4 h-4 mr-2.5 text-chabad-gold" />
                      <div>
                        <div className="font-medium">Quem Somos?</div>
                        <div className="text-xs text-slate-500">História e 45 anos em Curitiba</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('o-rebe')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-chabad-gold" />
                      <div>
                        <div className="font-medium">O Rebe</div>
                        <div className="text-xs text-slate-500">Biografia e legado de amor</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('campanha-mitsvot')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Flame className="w-4 h-4 mr-2.5 text-chabad-gold" />
                      <div>
                        <div className="font-medium">10 Campanhas de Mitsvot</div>
                        <div className="text-xs text-slate-500">Ações práticas para o dia a dia</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('chabad-mundo-ohel')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <BookOpen className="w-4 h-4 mr-2.5 text-chabad-gold" />
                      <div>
                        <div className="font-medium">Chabad no Mundo & Ohel</div>
                        <div className="text-xs text-slate-500">Envio de cartas e orações</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Serviços Religiosos */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('servicos')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all ${
                    ['sinagoga', 'mikve', 'ganenu', 'kitov', 'mezuzot-tefilin'].includes(currentPage)
                      ? 'text-chabad bg-chabad-light/60'
                      : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                  }`}
                >
                  <span>Serviços & Comunidade</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'servicos' && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => handleNavClick('sinagoga')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Sinagoga & Tefilot</div>
                        <div className="text-xs text-slate-500">Minian diário, Shabat e Chaguim</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('mikve')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Mikvê Mei Menachem</div>
                        <div className="text-xs text-slate-500">Pureza familiar e agendamentos</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('ganenu')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Award className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Ganênu Infantil</div>
                        <div className="text-xs text-slate-500">Educação e vivência para crianças</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('kitov')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <UtensilsCrossed className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Ki-Tov Gastronomia Casher</div>
                        <div className="text-xs text-slate-500">Alimentos e rotulagem supervisionada</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('mezuzot-tefilin')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Mezuzot & Tefilin</div>
                        <div className="text-xs text-slate-500">Verificação sofer e colocação</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Eventos Link */}
              <button 
                onClick={() => handleNavClick('eventos')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === 'eventos' || currentPage === 'rsvp'
                    ? 'text-chabad bg-chabad-light/60 font-bold' 
                    : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                }`}
              >
                Eventos & RSVP
              </button>

              {/* Tsedacá Diária Link */}
              <button 
                onClick={() => onOpenPushka ? onOpenPushka() : handleNavClick('tzedaka')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                  currentPage === 'tzedaka'
                    ? 'text-amber-700 bg-amber-50 border border-amber-200 font-bold' 
                    : 'text-amber-800 hover:text-amber-900 hover:bg-amber-50/80'
                }`}
                title="Cofrinho de Tsedacá Digital"
              >
                <Coins className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Tsedacá Diária</span>
              </button>

              {/* Educação & Juventude */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('educacao')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all ${
                    ['colel', 'juventude', 'biblioteca'].includes(currentPage)
                      ? 'text-chabad bg-chabad-light/60'
                      : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                  }`}
                >
                  <span>Educação & Juventude</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'educacao' && (
                  <div className="absolute top-full left-0 w-68 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => handleNavClick('colel')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <BookOpen className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Colel & Aulas de Torá</div>
                        <div className="text-xs text-slate-500">Tanya, Parashá e Mística</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('juventude')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Juventude & Alicerces</div>
                        <div className="text-xs text-slate-500">Universitários, Bat Mitzvá & CTeen</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('biblioteca')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Biblioteca & Gift Shop</div>
                        <div className="text-xs text-slate-500">Livros judaicos e artigos sagrados</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Informações & Mídia */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('info')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all ${
                    ['yahrtzeit', 'curitiba-info', 'fotos-revista', 'fale-conosco'].includes(currentPage)
                      ? 'text-chabad bg-chabad-light/60'
                      : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                  }`}
                >
                  <span>Mais</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'info' && (
                  <div className="absolute top-full right-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => handleNavClick('yahrtzeit')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Calculadora de Yahrtzeit</div>
                        <div className="text-xs text-slate-500">Datas hebraicas e Kadish</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('curitiba-info')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Guia Judaico Curitiba</div>
                        <div className="text-xs text-slate-500">Turistas, Shabat e hotéis</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('fotos-revista')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Fotos & Revista Beit Chabad</div>
                        <div className="text-xs text-slate-500">Galeria e edições digitais</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('fale-conosco')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Fale Conosco</div>
                        <div className="text-xs text-slate-500">Localização e contato</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Right CTA - Pushka & eChabad Doação Button */}
            <div className="hidden lg:flex items-center space-x-2.5">
              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-xl text-slate-600 hover:text-chabad hover:bg-slate-100 transition-colors"
                title="Ativar e Testar Notificações"
              >
                <Bell className="w-5 h-5 text-amber-600" />
              </button>

              <button 
                onClick={() => onOpenPushka ? onOpenPushka() : handleNavClick('tzedaka')}
                className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 border border-amber-400/40 px-3.5 py-2.5 rounded-xl font-bold shadow-xs hover:shadow-sm transition-all flex items-center space-x-1.5 text-sm group"
                title="Abrir Cofrinho de Tsedacá Digital"
              >
                <Coins className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>Cofrinho</span>
              </button>

              <button 
                onClick={onOpenDonate}
                className="bg-chabad hover:bg-chabad-pine text-white px-4 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-sm group"
              >
                <Heart className="w-4 h-4 text-chabad-gold group-hover:scale-110 transition-transform fill-chabad-gold/20" />
                <span>Doação eChabad</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex xl:hidden items-center space-x-1.5">
              <button 
                onClick={handleNotificationClick}
                className="p-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
                title="Ativar Notificações"
              >
                <Bell className="w-4 h-4" />
              </button>

              <button 
                onClick={() => onOpenPushka ? onOpenPushka() : handleNavClick('tzedaka')}
                className="bg-amber-100/90 text-amber-900 border border-amber-300/80 px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
                title="Tsedacá Diária"
              >
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                <span>Pushka</span>
              </button>

              <button 
                onClick={onOpenDonate}
                className="bg-chabad text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <Heart className="w-3.5 h-3.5 text-chabad-gold" />
                <span>Doar</span>
              </button>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-chabad hover:bg-slate-100 rounded-lg focus:outline-none"
                aria-label="Abrir menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto px-4 py-5 animate-in slide-in-from-top-5 duration-200">
          <div className="space-y-4">
            
            {/* Quick Links Group */}
            <div className="pb-3 border-b border-slate-100 space-y-2">
              <button 
                onClick={() => handleNavClick('home')}
                className="w-full p-2.5 rounded-lg text-left text-sm font-semibold bg-slate-50 text-slate-800 hover:bg-chabad-light hover:text-chabad flex items-center"
              >
                <Home className="w-4 h-4 mr-2 text-chabad" /> Início
              </button>

              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenPushka) onOpenPushka();
                  else handleNavClick('tzedaka');
                }}
                className="w-full p-2.5 rounded-lg text-left text-sm font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 flex items-center justify-between"
              >
                <span className="flex items-center">
                  <Coins className="w-4 h-4 mr-2 text-amber-600" /> Tsedacá Diária (Cofrinho)
                </span>
                <span className="text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-full font-bold text-amber-800">Interativo 🪙</span>
              </button>
            </div>

            {/* Section: Chabad */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Sobre Chabad</div>
              <div className="space-y-1">
                <button onClick={() => handleNavClick('quem-somos')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Quem Somos? (45 Anos)</button>
                <button onClick={() => handleNavClick('o-rebe')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">O Rebe</button>
                <button onClick={() => handleNavClick('campanha-mitsvot')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">10 Campanhas de Mitsvot</button>
                <button onClick={() => handleNavClick('chabad-mundo-ohel')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Chabad no Mundo & Ohel</button>
              </div>
            </div>

            {/* Section: Serviços */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Serviços Religiosos</div>
              <div className="space-y-1">
                <button onClick={() => handleNavClick('sinagoga')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Sinagoga & Festas</button>
                <button onClick={() => handleNavClick('mikve')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Mikvê</button>
                <button onClick={() => handleNavClick('ganenu')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Ganênu (Educação Infantil)</button>
                <button onClick={() => handleNavClick('kitov')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">KiTov - Alimentos Casher</button>
                <button onClick={() => handleNavClick('mezuzot-tefilin')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Mezuzot & Tefilin (Verificação)</button>
              </div>
            </div>

            {/* Section: Educação & Juventude */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Educação & Juventude</div>
              <div className="space-y-1">
                <button onClick={() => handleNavClick('colel')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Colel & Aulas de Torá</button>
                <button onClick={() => handleNavClick('juventude')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Projeto Alicerces & Juventude</button>
                <button onClick={() => handleNavClick('biblioteca')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Biblioteca & Gift Shop</button>
              </div>
            </div>

            {/* Section: Informações & Contato */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">Informações & Mídia</div>
              <div className="space-y-1">
                <button onClick={() => handleNavClick('yahrtzeit')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">O Yahrtzeit (Calculadora)</button>
                <button onClick={() => handleNavClick('curitiba-info')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Guia de Curitiba (Visitantes)</button>
                <button onClick={() => handleNavClick('fotos-revista')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md flex items-center justify-between">
                  <span>Fotos & Revista Digital</span>
                  <span className="text-[10px] font-bold bg-chabad-gold/20 text-chabad-dark border border-chabad-gold/40 px-1.5 py-0.5 rounded-full">Em breve</span>
                </button>
                <button onClick={() => handleNavClick('fale-conosco')} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md">Fale Conosco</button>
              </div>
            </div>

            {/* Big Donation CTA Mobile */}
            <div className="pt-2">
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenDonate(); }}
                className="w-full bg-chabad text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-md"
              >
                <Heart className="w-4 h-4 text-chabad-gold fill-chabad-gold" />
                <span>Fazer Doação (PIX)</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
