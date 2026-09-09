import React from 'react';
import { UtensilsCrossed, Phone, Heart, Sparkles, CheckCircle2, ShieldCheck, Wine, Coffee, Cake, MessageCircle } from 'lucide-react';

export const KiTov: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-amber-300 uppercase">
            <UtensilsCrossed className="w-3.5 h-3.5 mr-1" />
            Kashrut & Gastronomia Judaica
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            KiTov - Alimentos Casher
          </h1>
          <p className="mt-4 text-base sm:text-lg text-amber-100 leading-relaxed font-light">
            Orientações, produtos e suporte gastronômico casher sob supervisão rabínica em Curitiba e no Estado do Paraná.
          </p>
        </div>
      </section>

      {/* Main Informational Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-7 space-y-6 text-slate-700 text-base sm:text-lg leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Alimentação Casher com Sabor, Tradição e Confiança
            </h2>

            <p>
              O projeto <strong>KiTov</strong> ("Pois é Bom") do Beit Chabad do Paraná foi criado para facilitar a vida judaica e tornar os preceitos de <em>Kashrut</em> acessíveis e prazerosos para todas as famílias de Curitiba, bem como para turistas e viajantes de negócios.
            </p>

            <p>
              Consumir alimentos casher purifica os sentimentos, ilumina a mente e conecta a mesa da família à santidade divina. No Beit Chabad, oferecemos total assessoria rabínica para quem deseja tornar sua cozinha casher ou obter informações sobre produtos certificados no Brasil e no exterior.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                <div className="font-bold text-amber-950 text-sm mb-1 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-amber-700 mr-2" />
                  Supervisão Rigorosa (Mehadrin)
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  Supervisão rabínica atestando os mais altos padrões de abate ritual (Shechitá), separação de leite e carne e controle de ingredientes.
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 text-sm mb-1 flex items-center">
                  <Wine className="w-4 h-4 text-chabad mr-2" />
                  Vinhos & Itens para Shabat
                </div>
                <div className="text-xs text-slate-700 leading-relaxed">
                  Disponibilidade de vinhos para Kidush, suco de uva casher para crianças, Matsot artesanais para Pessach e chalot fresquinhas.
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Inquiry Box */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Atendimento & Encomendas Especiais</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Precisa de Informações ou Refeições Casher?
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Está visitando Curitiba e necessita de refeições de Shabat no hotel, ou deseja encomendar pratos tradicionais e tirar dúvidas sobre marcas e produtos casher?
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Como Podemos Ajudar:</div>
                <ul className="space-y-1 text-slate-600">
                  <li>• Informações sobre itens casher disponíveis na cidade</li>
                  <li>• Refeições de Shabat e Chaguim sob encomenda</li>
                  <li>• Kasherização de cozinhas residenciais</li>
                  <li>• Matsá Shmurá de Pessach e produtos festivos</li>
                </ul>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20informações%20sobre%20alimentos%20casher%20e%20refeições%20em%20Curitiba."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>Falar pelo WhatsApp com a Equipe</span>
                </a>

                <a
                  href="tel:+554198977249"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ligar: +55 (41) 9897-7249</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Practical Kashrut Guide Section */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-slate-900">
              Pilares da Culinária Casher
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Conceitos fundamentais da tradição judaica para o dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
                🥩 / 🥛
              </div>
              <h4 className="font-bold text-slate-900 text-base">Separação de Carne e Leite</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A Torá proíbe misturar carne e laticínios no preparo, consumo ou benefício. Mantemos jogos separados de louças e utensílios.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
                🍷
              </div>
              <h4 className="font-bold text-slate-900 text-base">Vinhos & Bebidas Certificadas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Os vinhos para o Kidush e celebrações devem possuir o selo rabínico (Hechsher), garantindo o manuseio ritual estrito do início ao engarrafamento.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-sm">
                🥖
              </div>
              <h4 className="font-bold text-slate-900 text-base">Separação da Chalá (Hafrashat Challah)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ao sovar a massa do pão, separa-se uma porção (1.666 kg) com uma bênção especial — momento auspicioso para orações de saúde, sustento e paz no lar.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
