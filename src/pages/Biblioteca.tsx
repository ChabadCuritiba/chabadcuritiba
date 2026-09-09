import React from 'react';
import { BookOpen, Sparkles, ShoppingBag, Heart, ShieldCheck, Phone, Check } from 'lucide-react';

export const Biblioteca: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-chabad-navy to-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-chabad-gold/20 border border-chabad-gold/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-chabad-gold uppercase">
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            Acervo Sagrado & Judaica
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Biblioteca & Gift Shop
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
            Livros fundamentais com tradução em português, literatura infantil, Sidurim de oração e artigos de Judaica para o seu lar.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Section: Biblioteca */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-chabad flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Biblioteca Comunitária de Estudos
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Nosso acervo reúne clássicos da literatura judaica e do pensamento de Chabad. Um ambiente silencioso e propício para leitura e pesquisa individual ou em Chavruta (dupla de estudo).
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad mr-2" /> Chumash com Rashi e comentários em português</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad mr-2" /> Obra completa do Tanya bilingue</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad mr-2" /> Coleção de Salmos (Tehilim) comentados</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad mr-2" /> Livros infantis ilustrados sobre os Chaguim</div>
            </div>
          </div>

          {/* Section: Gift Shop */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-luxury space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-chabad-gold flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Gift Shop & Artigos Sagrados
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed">
              Encontre tudo o que você precisa para embelezar o cumprimento dos mandamentos na sua casa ou presentear em ocasiões especiais (Bar/Bat Mitzvá, casamentos, nascimentos).
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad-gold mr-2" /> Caixas artísticas para Mezuzot em metal, madeira e acrílico</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad-gold mr-2" /> Taças de Kidush em prata e cerâmica</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad-gold mr-2" /> Candelabros e castiçais para velas de Shabat</div>
              <div className="flex items-center"><Check className="w-4 h-4 text-chabad-gold mr-2" /> Kipót, Talitot e bolsas bordadas</div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20consultar%20itens%20disponíveis%20no%20Gift%20Shop%20Judaica."
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Consultar Disponibilidade de Artigos</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
