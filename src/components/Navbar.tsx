import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Calendar, Clock, Heart, Phone, MapPin, 
  BookOpen, Sparkles, ChevronDown, Award, Users, 
  UtensilsCrossed, ShieldCheck, Home, Flame, Search
} from 'lucide-react';
import { getCuritibaShabbatTimes, fetchLiveCuritibaShabbatTimes } from '../utils/shabbatTimes';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenDonate }) => {
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
            <span>Velas: <strong className="text-white">{shabbatTimes.candleLighting}</strong></span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">Havdalá: <strong className="text-white">{shabbatTimes.havdalah}</strong></span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-chabad-goldLight/90">Parashat {shabbatTimes.parashaName}</span>
          </div>

          {/* Quick Contact & Jubileu Indicator */}
          <div className="flex items-center space-x-4">
            <a 
              href="tel:+554198977249" 
              className="flex items-center text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 mr-1 text-chabad-gold" />
              <span className="hidden lg:inline">(41) 9897-7249</span>
              <span className="lg:hidden">Ligar</span>
            </a>
            <a 
              href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20mais%20informações%20sobre%20o%20Beit%20Chabad%20Curitiba." 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-2 py-0.5 rounded text-xs flex items-center font-medium transition-colors"
            >
              WhatsApp
            </a>
            <span className="bg-chabad-gold/20 text-chabad-gold font-medium px-2 py-0.5 rounded border border-chabad-gold/40 text-[11px] hidden sm:inline-block">
              ✨ 45 Anos no Paraná
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-luxury py-2.5' : 'bg-white py-3.5 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo with 45 Years Emblem */}
            <button 
              onClick={() => handleNavClick('home')}
              className="flex items-center space-x-3 text-left group focus:outline-none"
            >
              <img 
                src="/assets/logo.png" 
                alt="Chabad do Paraná - 45 Anos" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform group-hover:scale-102"
              />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
              <button 
                onClick={() => handleNavClick('home')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === 'home' ? 'text-chabad bg-chabad-light/60' : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                }`}
              >
                Início
              </button>

              {/* Chabad Dropdown */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('chabad')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all ${
                    ['quem-somos', 'o-rebe', 'campanha-mitsvot', 'chabad-mundo-ohel'].includes(currentPage)
                      ? 'text-chabad bg-chabad-light/60'
                      : 'text-slate-700 hover:text-chabad hover:bg-slate-50'
                  }`}
                >
                  <span>Chabad</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'chabad' && (
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
                  <span>Serviços & Vida Judaica</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
                </button>

                {activeDropdown === 'servicos' && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button 
                      onClick={() => handleNavClick('sinagoga')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Home className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Sinagoga & Grandes Festas</div>
                        <div className="text-xs text-slate-500">Tefilot diárias, Shabat e Pessach</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('mikve')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Mikvê</div>
                        <div className="text-xs text-slate-500">Pureza familiar & Agendamentos</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('ganenu')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Ganênu</div>
                        <div className="text-xs text-slate-500">Educação infantil & Valores</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('kitov')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <UtensilsCrossed className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">KiTov - Alimentos Casher</div>
                        <div className="text-xs text-slate-500">Guia e culinária casher em Curitiba</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('mezuzot-tefilin')}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Mezuzot & Tefilin</div>
                        <div className="text-xs text-slate-500">Verificação e aquisição</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

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
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">O Yahrtzeit</div>
                        <div className="text-xs text-slate-500">Calculadora e Kadish</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('curitiba-info')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
                    >
                      <MapPin className="w-4 h-4 mr-2.5 text-chabad" />
                      <div>
                        <div className="font-medium">Guia de Curitiba</div>
                        <div className="text-xs text-slate-500">Para visitantes e turistas</div>
                      </div>
                    </button>
                    <button 
                      onClick={() => handleNavClick('fotos-revista')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2.5 text-chabad" />
                        <div>
                          <div className="font-medium">Fotos & Revista Chabad</div>
                          <div className="text-xs text-slate-500">Galeria e edições digitais</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-chabad-gold/20 text-chabad-dark border border-chabad-gold/40 px-1.5 py-0.5 rounded-full ml-2">
                        Em breve
                      </span>
                    </button>
                    <button 
                      onClick={() => handleNavClick('fale-conosco')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-chabad-light/50 hover:text-chabad flex items-center"
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

            {/* Right CTA - eChabad Doação Button */}
            <div className="hidden lg:flex items-center space-x-3">
              <button 
                onClick={onOpenDonate}
                className="bg-chabad hover:bg-chabad-pine text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2 text-sm group"
              >
                <Heart className="w-4 h-4 text-chabad-gold group-hover:scale-110 transition-transform fill-chabad-gold/20" />
                <span>Doação eChabad</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex xl:hidden items-center space-x-2">
              <button 
                onClick={onOpenDonate}
                className="bg-chabad text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1"
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
            <div className="pb-3 border-b border-slate-100">
              <button 
                onClick={() => handleNavClick('home')}
                className="w-full p-2.5 rounded-lg text-left text-sm font-semibold bg-slate-50 text-slate-800 hover:bg-chabad-light hover:text-chabad flex items-center"
              >
                <Home className="w-4 h-4 mr-2 text-chabad" /> Início
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
