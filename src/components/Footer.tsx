import { 
  Heart, Phone, MapPin, Mail, Flame, 
  ArrowUp, ShieldCheck, Clock, ExternalLink, Coins 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
  onOpenPushka?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDonate, onOpenPushka }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-chabad-navy text-slate-300 relative overflow-hidden border-t-4 border-chabad-gold">
      {/* Background Subtle Araucaria Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Chabad do Paraná Brand & 40 Years */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/logo.png" 
                alt="Beit Chabad do Paraná" 
                className="h-16 w-auto bg-white/95 p-1.5 rounded-xl shadow-md object-contain"
              />
            </div>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Há 45 anos nutrindo a vida judaica em Curitiba e em todo o Estado do Paraná com amor incondicional, acolhimento caloroso e inspiração da Chassidut de Chabad-Lubavitch.
            </p>

            <div className="p-3.5 bg-chabad-dark/60 rounded-xl border border-chabad-gold/30 text-xs text-chabad-goldLight/90">
              <span className="font-semibold text-chabad-gold block mb-1">
                "Um pequeno ato de bondade dissipa uma imensidão de escuridão."
              </span>
              <span className="text-slate-400">— O Rebe de Lubavitch, Rabi Menachem M. Schneerson</span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-chabad hover:text-white flex items-center justify-center transition-all text-slate-300"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-chabad hover:text-white flex items-center justify-center transition-all text-slate-300"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-chabad hover:text-white flex items-center justify-center transition-all text-slate-300"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a 
                href="https://wa.me/554198977249" 
                target="_blank" 
                rel="noreferrer" 
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white flex items-center text-xs font-semibold transition-all border border-emerald-500/30"
              >
                WhatsApp Oficial
              </a>
            </div>
          </div>

          {/* Column 2: Navegação Rápida */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-chabad-gold mb-4 flex items-center">
              <span>Sobre Chabad</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('quem-somos')} className="hover:text-chabad-gold transition-colors">Quem Somos (45 Anos)</button>
              </li>
              <li>
                <button onClick={() => handleNav('o-rebe')} className="hover:text-chabad-gold transition-colors">O Rebe de Lubavitch</button>
              </li>
              <li>
                <button onClick={() => handleNav('campanha-mitsvot')} className="hover:text-chabad-gold transition-colors">10 Campanhas do Rebe</button>
              </li>
              <li>
                <button onClick={() => handleNav('chabad-mundo-ohel')} className="hover:text-chabad-gold transition-colors">Chabad no Mundo & Ohel</button>
              </li>
              <li>
                <button onClick={() => handleNav('fotos-revista')} className="hover:text-chabad-gold transition-colors flex items-center gap-1.5">
                  <span>Revista & Fotos</span>
                  <span className="text-[10px] text-chabad-gold font-bold bg-chabad-gold/15 px-1.5 py-0.5 rounded-full">Em breve</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPushka ? onOpenPushka() : handleNav('tzedaka')} className="hover:text-chabad-gold text-amber-400 font-medium transition-colors flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cofrinho de Tsedacá (Pushka)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenDonate} className="text-chabad-gold hover:underline font-semibold flex items-center">
                  <Heart className="w-3.5 h-3.5 mr-1 fill-chabad-gold" /> Apoiar o Beit Chabad
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Serviços e Comunidade */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-chabad-gold mb-4">
              Vida Comunitária
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleNav('sinagoga')} className="hover:text-chabad-gold transition-colors">Sinagoga & Festas</button>
              </li>
              <li>
                <button onClick={() => handleNav('mikve')} className="hover:text-chabad-gold transition-colors">Mikvê</button>
              </li>
              <li>
                <button onClick={() => handleNav('ganenu')} className="hover:text-chabad-gold transition-colors">Ganênu (Educação Infantil)</button>
              </li>
              <li>
                <button onClick={() => handleNav('kitov')} className="hover:text-chabad-gold transition-colors">KiTov - Culinária Casher</button>
              </li>
              <li>
                <button onClick={() => handleNav('mezuzot-tefilin')} className="hover:text-chabad-gold transition-colors">Mezuzot & Tefilin (Verificação)</button>
              </li>
              <li>
                <button onClick={() => handleNav('colel')} className="hover:text-chabad-gold transition-colors">Colel & Aulas de Torá</button>
              </li>
              <li>
                <button onClick={() => handleNav('juventude')} className="hover:text-chabad-gold transition-colors">Juventude & Alicerces</button>
              </li>
              <li>
                <button onClick={() => handleNav('yahrtzeit')} className="hover:text-chabad-gold transition-colors">Calculadora de Yahrtzeit</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contato & Localização */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-chabad-gold mb-4">
              Localização & Contato
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-chabad-gold shrink-0 mt-0.5" />
                <span>
                  Beit Chabad do Paraná
                  <span className="block text-xs text-slate-400 mt-0.5">Curitiba - PR • Brasil</span>
                </span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-chabad-gold shrink-0" />
                <a href="tel:+554198977249" className="hover:text-white transition-colors">
                  +55 (41) 9897-7249
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-chabad-gold shrink-0" />
                <a href="mailto:chabad@chabadcuritiba.com" className="hover:text-white transition-colors">
                  chabad@chabadcuritiba.com
                </a>
              </div>
            </div>

            <div className="mt-5">
              <button 
                onClick={() => handleNav('curitiba-info')}
                className="text-xs bg-white/10 hover:bg-white/20 text-chabad-goldLight px-3 py-2 rounded-lg flex items-center transition-all w-full justify-center"
              >
                <span>Guia para Turistas em Curitiba</span>
                <ExternalLink className="w-3 h-3 ml-1.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Beit Chabad do Paraná. 45 Anos de Judaísmo com amor e alegria. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center space-x-5">
            <button onClick={() => handleNav('fale-conosco')} className="hover:text-slate-200 transition-colors">
              Fale Conosco
            </button>
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-chabad-gold transition-colors text-slate-300"
            >
              <span>Voltar ao topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
