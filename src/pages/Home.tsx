import React from 'react';
import { 
  Flame, Heart, BookOpen, Users, Sparkles, 
  MapPin, Phone, ArrowRight, ShieldCheck, Award, 
  Droplets, UtensilsCrossed, ChevronRight, CheckCircle2,
  ExternalLink, GraduationCap, Coins
} from 'lucide-react';
import { ShabbatWidget } from '../components/ShabbatWidget';
import { MITZVAH_CAMPAIGNS, MAGAZINES } from '../data/mockData';
import { CommunityEvent } from '../types';

interface HomeProps {
  onNavigate: (page: string) => void;
  onSelectEvent?: (event: CommunityEvent) => void;
  onOpenDonate: () => void;
  onOpenOhel: () => void;
  onOpenPushka?: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  onNavigate, 
  onOpenDonate, 
  onOpenOhel,
  onOpenPushka 
}) => {
  const coreMitzvot = MITZVAH_CAMPAIGNS.slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO BANNER - 45 ANOS DE CHABAD NO PARANÁ & PESSACH / DESTAQUES */}
      <section className="relative overflow-hidden bg-gradient-to-br from-chabad-dark via-chabad-navy to-slate-950 text-white pt-12 sm:pt-20 pb-20 sm:pb-32">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:28px_28px] pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-chabad-gold/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-chabad/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Vision */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-chabad-gold/20 to-chabad-gold/5 border border-chabad-gold/40 rounded-full px-4 py-1.5 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-chabad-gold animate-ping"></span>
                <span className="text-xs sm:text-sm font-bold text-chabad-gold tracking-wide uppercase">
                  45 Anos no Paraná • 1982 - 2026
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Judaísmo com <span className="text-chabad-gold font-normal italic">amor</span> e <span className="text-chabad-gold font-normal italic">alegria</span> em Curitiba.
              </h1>

              {/* Paragraph */}
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Bem-vindo ao <strong>Beit Chabad do Paraná</strong>. Uma casa aberta para todo judeu, independentemente de afiliação ou nível de observância. Sinagoga calorosa, aulas de Torá, educação infantil, Mikvê e vida comunitária vibrante.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onOpenDonate}
                  className="bg-chabad-gold hover:bg-yellow-500 text-chabad-dark font-bold px-7 py-3.5 rounded-2xl shadow-gold hover:shadow-xl transition-all flex items-center space-x-2 text-sm sm:text-base group"
                >
                  <Heart className="w-4 h-4 text-chabad-dark fill-chabad-dark" />
                  <span>Fazer Doação (PIX)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('quem-somos')}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all text-sm sm:text-base"
                >
                  Conheça Nossa História
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center lg:text-left">
                <div>
                  <div className="font-serif text-2xl font-bold text-chabad-gold">45 Anos</div>
                  <div className="text-xs text-slate-400">Em Curitiba e Paraná</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-chabad-gold">+3.500</div>
                  <div className="text-xs text-slate-400">Centros no Mundo</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-chabad-gold">100%</div>
                  <div className="text-xs text-slate-400">Acolhedor a Todos</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual with 45 Anos Ribbon & Rebbe Tribute */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 p-6 rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md text-center group">
                
                {/* 45 Anos Official Emblem */}
                <div className="p-4 bg-white rounded-2xl shadow-lg mb-6 transform group-hover:scale-102 transition-all">
                  <img 
                    src="/assets/logo.png" 
                    alt="Chabad do Paraná - 45 Anos" 
                    className="w-full h-auto object-contain max-h-48 mx-auto"
                  />
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-2 text-xs text-chabad-gold font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Mensagem do Rebe</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                    "Cada boa ação, cada vela acesa antes do Shabat, cada página de Torá estudada ilumina o mundo inteiro e nos aproxima da redenção."
                  </p>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-xs text-slate-400">Rabi Menachem M. Schneerson</span>
                    <button 
                      onClick={onOpenOhel}
                      className="text-xs text-chabad-gold hover:underline font-semibold flex items-center"
                    >
                      Enviar carta ao Ohel →
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SHABBAT IN CURITIBA WIDGET SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20">
        <ShabbatWidget onLearnMore={() => onNavigate('colel')} />
      </section>

      {/* 2.5. DIGITAL PUSHKA (COFRINHO DE TSEDACÁ) FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-amber-100/50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative Coin Silhouette */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Coins className="w-64 h-64 text-amber-700" />
          </div>

          <div className="flex items-center space-x-5 z-10">
            <div className="relative shrink-0">
              <div className="w-16 h-20 bg-gradient-to-br from-chabad-navy to-slate-900 rounded-2xl border-2 border-chabad-gold shadow-xl flex flex-col items-center justify-center p-2 text-center transform hover:scale-105 transition-transform cursor-pointer"
                onClick={() => onOpenPushka ? onOpenPushka() : onNavigate('tzedaka')}
              >
                <div className="w-6 h-1 bg-black/80 rounded-full mb-2"></div>
                <img 
                  src="/assets/pushka-logo.png" 
                  alt="Pushka Chabad" 
                  className="w-10 h-10 object-contain drop-shadow"
                />
              </div>
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow animate-pulse">
                🪙 PIX
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wide bg-amber-200/60 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Mitzvá Diária Interativa</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Cofrinho de Tsedacá Digital
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
                Coloque moedas diariamente no cofrinho virtual do Beit Chabad, acumule suas boas ações e transfira quando desejar com 1 clique via PIX!
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10 shrink-0 w-full md:w-auto justify-end">
            <button
              onClick={() => onOpenPushka ? onOpenPushka() : onNavigate('tzedaka')}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold px-6 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm group"
            >
              <Coins className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>Colocar Moeda Agora</span>
            </button>

            <button
              onClick={() => onNavigate('tzedaka')}
              className="w-full sm:w-auto bg-white/80 hover:bg-white text-slate-700 font-semibold px-4 py-3 rounded-2xl border border-amber-200 text-sm transition-all flex items-center justify-center space-x-1"
            >
              <span>Ver Detalhes</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES GRID (Mikvê, Bar Mitzvah, KiTov Casher, Ganênu, Juventude) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center text-xs font-bold text-chabad uppercase tracking-widest bg-chabad-light px-3 py-1 rounded-full mb-3">
            Nossos Serviços & Vida Comunitária
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
            Acolhimento Integral em Curitiba
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Programas e suporte dedicados para cada etapa da vida da sua família.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card: Sinagoga & Festas */}
          <div 
            onClick={() => onNavigate('sinagoga')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-chabad-light text-chabad flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-chabad group-hover:text-white transition-all">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Sinagoga & As Grandes Festas
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tefilot diárias com Minyan, Kabalat Shabat cantado, Kidush comunitário e celebrações completas de Pessach, Rosh Hashaná e Yom Kipur.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-chabad">
              <span>Ver Horários das Orações</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Mikvê */}
          <div 
            onClick={() => onNavigate('mikve')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-sky-700 group-hover:text-white transition-all">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Mikvê
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Instalações modernas e acolhedoras para a vivência da Taharat Hamishpachá (Pureza Familiar) com privacidade e excelência haláchica.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-sky-700">
              <span>Agendar Horário</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Bar / Bat Mitzvah */}
          <div 
            onClick={() => onNavigate('bar-mitzvah')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-amber-700 group-hover:text-white transition-all">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Bar & Bat Mitzvá
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Preparação personalizada e significativa para jovens atingindo a maioridade judaica, com cerimônias inesquecíveis na Sinagoga.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700">
              <span>Conhecer Preparação</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Ganênu Educação */}
          <div 
            onClick={() => onNavigate('ganenu')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Ganênu & Juventude
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Atividades lúdicas, vivência das tradições e projeto Alicerces para conectar crianças e universitários com alegria e orgulho judaico.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
              <span>Programas Juvenis</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Ki Tov Casher */}
          <div 
            onClick={() => onNavigate('kitov')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-700 group-hover:text-white transition-all">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Ki Tov • Produtos Casher
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Alimentos casher com supervisão rabínica, carnes, vinhos para Shabat, chalot frescas e encomendas para toda a região de Curitiba.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-orange-700">
              <span>Catálogo e Pedidos</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card: Colel & Estudos */}
          <div 
            onClick={() => onNavigate('colel')}
            className="group bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-purple-700 group-hover:text-white transition-all">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-chabad transition-colors mb-2">
                Colel de Estudos de Torá
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cursos semanais de Tanach, Talmud, Tanya e Chassidut para homens e mulheres, com debates profundos e aplicação prática.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-purple-700">
              <span>Quadro de Aulas</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 5. 10 MITZVOT CAMPAIGNS HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold text-chabad uppercase tracking-widest bg-chabad-light px-3 py-1 rounded-full inline-block mb-2">
              Legado do Rebe
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
              As 10 Campanhas de Mitsvot
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Pilares práticos para transformar o mundo em uma morada para o Divino.
            </p>
          </div>

          <button
            onClick={() => onNavigate('campanha-mitsvot')}
            className="text-xs font-bold text-chabad hover:text-chabad-pine flex items-center"
          >
            <span>Ver todas as 10 campanhas</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreMitzvot.map(mitzvah => (
            <div 
              key={mitzvah.id}
              onClick={() => onNavigate('campanha-mitsvot')}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-luxury hover:border-chabad/40 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-chabad-gold font-serif font-black text-lg flex items-center justify-center mb-4 group-hover:bg-chabad group-hover:text-white transition-all">
                  #{mitzvah.number}
                </div>
                <div className="font-serif text-sm font-semibold text-chabad mb-1" dir="rtl">
                  {mitzvah.hebrewTitle}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-chabad transition-colors">
                  {mitzvah.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {mitzvah.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Saiba como praticar</span>
                <ChevronRight className="w-3.5 h-3.5 text-chabad group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DIGITAL MAGAZINE & MEDIA SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-chabad-dark to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-chabad-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full inline-block">
              Publicação Oficial • Beit Chabad Paraná (Em Breve)
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Revista Chabad Paraná - Edição Especial 45 Anos
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Artigos inspiradores, reportagens sobre as quatro décadas e meia de impacto comunitário e memórias da vida judaica em Curitiba. O acervo digital estará disponível em breve!
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('fotos-revista')}
                className="bg-chabad-gold hover:bg-yellow-500 text-chabad-dark font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Fotos & Revista (Em Breve)</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative transform hover:scale-105 transition-transform duration-300">
              <div className="w-56 h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-chabad-gold/40 relative bg-slate-800 flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <BookOpen className="w-12 h-12 text-chabad-gold mx-auto" />
                  <div className="font-serif font-bold text-white text-base">Edição Comemorativa 45 Anos</div>
                  <div className="text-xs text-chabad-gold font-semibold uppercase tracking-wider">Em Breve</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. QUICK VISITORS & CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Visitando Curitiba ou Precisa de Informações?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl">
              Nossa equipe está à disposição para auxiliar com refeições de Shabat, hotéis a pé da sinagoga e hospitalidade.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('curitiba-info')}
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded-xl border border-slate-300 text-xs shadow-sm transition-all"
            >
              Guia de Curitiba
            </button>
            <a
              href="tel:+554198977249"
              className="bg-chabad hover:bg-chabad-pine text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-all flex items-center space-x-1.5"
            >
              <Phone className="w-4 h-4 text-chabad-gold" />
              <span>(41) 9897-7249</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
