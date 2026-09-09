import React from 'react';
import { MapPin, Hotel, Utensils, Shield, Phone, Sparkles, Navigation, Clock } from 'lucide-react';

export const CuritibaInfo: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-chabad-dark to-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-emerald-200 uppercase">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            Guia do Visitante & Turista
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Vida Judaica em Curitiba
          </h1>
          <p className="mt-4 text-base sm:text-lg text-emerald-100 leading-relaxed font-light">
            Informações indispensáveis para turistas, viajantes de negócios e novos moradores: hospedagem a pé da sinagoga, alimentação casher, segurança e hospitalidade.
          </p>
        </div>
      </section>

      {/* Main Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hotels & Shabbat Walking Distance */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
          <div className="flex items-center space-x-3 text-chabad">
            <Hotel className="w-6 h-6" />
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Hotéis Próximos à Sinagoga (Acesso a Pé no Shabat)
            </h2>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">
            Para quem deseja vivenciar o Shabat com o Beit Chabad sem violar as leis de transporte, recomendamos opções de hospedagem localizadas nos bairros Água Verde e Batel:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-chabad bg-chabad-light px-2.5 py-0.5 rounded-full inline-block">
                ~5 a 10 min a pé
              </span>
              <h4 className="font-bold text-slate-900 text-base">Bairro Água Verde</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hotéis, flats e acomodações no bairro Água Verde, a uma curta caminhada de 5 a 10 minutos da sinagoga.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full inline-block">
                ~15 a 20 min a pé
              </span>
              <h4 className="font-bold text-slate-900 text-base">Bairro Batel</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Opções hoteleiras e flats na região do Batel, a cerca de 15 a 20 minutos de caminhada da sinagoga, com excelente infraestrutura.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">
                Hospitalidade
              </span>
              <h4 className="font-bold text-slate-900 text-base">Hospedagem Comunitária</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Em datas especiais de festas e Shabatons, entre em contato prévio para verificar opções com famílias da comunidade.
              </p>
            </div>
          </div>
        </div>

        {/* Tourist Highlights in Curitiba */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
          <div className="flex items-center space-x-3 text-chabad">
            <Sparkles className="w-6 h-6 text-chabad-gold" />
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Pontos Turísticos Emblemáticos da Capital Paranaense
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Jardim Botânico de Curitiba</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Famosa estufa de ferro e vidro inspirada no Palácio de Cristal de Londres com jardins em estilo francês e o lindo bosque de araucárias.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Ópera de Arame & Parque das Pedreiras</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Teatro circular em estrutura tubular metálica construído sobre um lago em uma antiga pedreira, cercado por rica vegetação.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Museu Oscar Niemeyer (MON)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Popularmente conhecido como "Museu do Olho", é um dos maiores centros de artes visuais da América Latina.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Contact for Visitors */}
        <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif text-2xl font-bold">Precisa de Ajuda com Sua Viagem?</h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Fale diretamente com nossa equipe para orientações sobre segurança, alimentação casher e orações.
            </p>
          </div>

          <a
            href="https://wa.me/554198977249?text=Olá!%20Estou%20visitando%20Curitiba%20e%20gostaria%20de%20informações%20sobre%20a%20comunidade%20judaica."
            target="_blank"
            rel="noreferrer"
            className="bg-chabad-gold hover:bg-yellow-500 text-chabad-dark font-bold px-7 py-3 rounded-xl text-xs shadow-md transition-all shrink-0"
          >
            Falar no WhatsApp do Chabad
          </a>
        </div>

      </section>

    </div>
  );
};
