import React from 'react';
import { Award, Globe, Heart, Users, MapPin, CheckCircle2, Sparkles, Phone, ArrowRight } from 'lucide-react';

interface QuemSomosProps {
  onNavigate: (page: string) => void;
  onOpenDonate: () => void;
}

export const QuemSomos: React.FC<QuemSomosProps> = ({ onNavigate, onOpenDonate }) => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-chabad-dark via-chabad to-emerald-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <Award className="w-3.5 h-3.5 mr-1" />
            Jubileu de 45 Anos (1982 - 2026)
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Quem Somos
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Conheça a trajetória de amor, acolhimento e dedicação ininterrupta do Beit Chabad do Paraná à comunidade judaica paranaense.
          </p>
        </div>
      </section>

      {/* Main Content & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <div className="inline-flex items-center text-xs font-bold text-chabad uppercase tracking-widest bg-chabad-light px-3 py-1 rounded-full">
              Nossa Missão & História
            </div>
            
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              45 Anos Iluminando Curitiba e o Paraná com Amor Incondicional
            </h2>

            <p>
              Fundado sob a orientação direta do <strong>Rebe de Lubavitch, Rabi Menachem Mendel Schneerson</strong>, o <strong>Beit Chabad do Paraná</strong> estabeleceu-se em Curitiba há quatro décadas e meia com uma missão primordial: <em>amar e acolher cada judeu incondicionalmente</em> (Ahavat Yisrael).
            </p>

            <p>
              Em um mundo em constante transformação, o Chabad se mantém como um farol permanente de tradição milenar, calor humano e autenticidade. Nossa casa é aberta a homens, mulheres e crianças de todas as idades, independentemente de sua filiação religiosa, nível de conhecimento ou observância.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-base mb-1 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-chabad mr-2" />
                  Portas Sempre Abertas
                </div>
                <div className="text-xs text-slate-600">
                  Nenhum judeu é estranho no Beit Chabad. Não exigimos mensalidades prévias para participar das orações ou frequentar a sinagoga.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-base mb-1 flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-chabad mr-2" />
                  Judaísmo com Alegria
                </div>
                <div className="text-xs text-slate-600">
                  A vivência dos mandamentos (Mitsvot) é transmitida com entusiasmo, profundidade chassídica e significado para a vida moderna.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-luxury border border-slate-200/80 space-y-6 text-center">
              <div className="w-20 h-20 bg-chabad-light text-chabad rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Globe className="w-10 h-10" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Rede Global Chabad-Lubavitch
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                O Beit Chabad do Paraná faz parte da maior rede de assistência judaica e espiritual do planeta, presente em mais de <strong>100 países</strong> e com mais de <strong>3.500 centros</strong> comunitários dedicados ao serviço ao próximo.
              </p>

              <div className="p-4 bg-chabad-gold/10 rounded-2xl border border-chabad-gold/30 text-xs text-slate-800 text-left space-y-2">
                <div className="font-bold text-chabad-goldDark flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Impacto Comunitário em Curitiba:
                </div>
                <ul className="space-y-1 text-slate-700">
                  <li>• Sinagoga ativa - Todos os dias & Shabbat</li>
                  <li>• Mikvê moderno</li>
                  <li>• Ganênu para formação integral da infância</li>
                  <li>• Projeto Alicerces para jovens universitários</li>
                  <li>• Assistência social & beneficência comunitária</li>
                  <li>• Kitov - Cozinha & Loja Kitov</li>
                </ul>
              </div>

              <button
                onClick={onOpenDonate}
                className="w-full bg-chabad hover:bg-chabad-pine text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Heart className="w-4 h-4 text-chabad-gold fill-chabad-gold" />
                <span>Apoiar as Obras do Beit Chabad</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Marcos Históricos dos 45 Anos
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Quatro décadas e meia de dedicação construindo uma comunidade forte, vibrante e unida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="font-serif font-black text-3xl text-chabad-gold mb-2 block">1982</span>
              <h4 className="font-bold text-slate-900 text-base mb-1">O Início em Curitiba</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chegada dos primeiros emissários (Shluchim) do Rebe ao Paraná, iniciando as primeiras reuniões, aulas de Torá e orações comunitárias.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="font-serif font-black text-3xl text-chabad-gold mb-2 block">1995</span>
              <h4 className="font-bold text-slate-900 text-base mb-1">Expansão e Sinagoga</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consolidação da Sinagoga oficial, início do Ganênu e estabelecimento das grandes celebrações públicas de Chanuká e Purim.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <span className="font-serif font-black text-3xl text-chabad-gold mb-2 block">2001</span>
              <h4 className="font-bold text-slate-900 text-base mb-1">Mikvê & Juventude</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inauguração das modernas instalações do Mikvê e expansão dos programas voltados para estudantes universitários (Projeto Alicerces).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-chabad-gold/60 shadow-gold relative">
              <span className="font-serif font-black text-3xl text-chabad mb-2 block">2026</span>
              <h4 className="font-bold text-slate-900 text-base mb-1">Jubileu de 45 Anos</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comemoração de 45 anos com milhares de vidas tocadas, novos projetos digitais, ampliação do centro e renovado vigor para o futuro.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
