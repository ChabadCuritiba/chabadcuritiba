import React, { useState } from 'react';
import { Users, Sparkles, Heart, GraduationCap, Calendar, Phone, CheckCircle2 } from 'lucide-react';

export const Juventude: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string>('alicerces');

  const programs = [
    {
      id: 'alicerces',
      title: 'Projeto Alicerces (Universitários & Jovens Adultos)',
      subtitle: 'Para jovens de 18 a 30 anos: debates existenciais, networking, eventos sociais e bolsas de estudo',
      icon: <GraduationCap className="w-6 h-6" />,
      desc: 'O Projeto Alicerces é a casa do jovem judeu universitário em Curitiba. Oferecemos encontros semanais dinâmicos onde a sabedoria milenar da Torá dialoga com os desafios da carreira, ética profissional, relacionamentos e liderança.',
      features: [
        'Cursos com bolsas de estudo e incentivos acadêmicos',
        'Shabatons universitários e viagens exclusivas',
        'Palestras com empresários e líderes comunitários',
        'Eventos, sushi na Sucá e mais'
      ],
      cta: 'Inscrever-se no Alicerces'
    },
    {
      id: 'bat-mitzvah',
      title: 'Clube de Bat Mitzvá',
      subtitle: 'Desenvolvimento de identidade, liderança e amizades para meninas de 11 a 13 anos',
      icon: <Sparkles className="w-6 h-6" />,
      desc: 'Mais que uma festa, a transição para a maturidade judaica é vivida com oficinas práticas, culinária casher, voluntariado social e debates sobre as grandes heroínas da Torá.',
      features: [
        'Workshops de Chalá, velas e arte judaica',
        'Visitas voluntárias e projetos de Tzedaká na cidade',
        'Álbum comemorativo e cerimônia emocionante',
        'Formação de laços de amizade duradouros'
      ],
      cta: 'Matricular no Clube de Bat Mitzvá'
    },
    {
      id: 'gan-israel',
      title: 'Gan Israel (Colônia de Férias)',
      subtitle: 'As férias mais inesquecíveis, alegres e seguras para crianças de 4 a 12 anos',
      icon: <Heart className="w-6 h-6" />,
      desc: 'A maior rede de acampamentos judaicos do mundo tem sua sede em Curitiba. Dias repletos de passeios, esportes, piscina, gincanas temáticas e o orgulho contagiante de viver o judaísmo.',
      features: [
        'Monitores treinados e dedicados',
        'Alimentação casher deliciosa incluída',
        'Passeios aos melhores parques e atrações de Curitiba',
        'Edições de Inverno (Julho) e Verão (Janeiro)'
      ],
      cta: 'Garantir Vaga no Gan Israel'
    }
  ];

  const current = programs.find(p => p.id === selectedProgram) || programs[0];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/40 rounded-full px-4 py-1 mb-4 text-xs font-bold text-purple-300 uppercase">
            <Users className="w-3.5 h-3.5 mr-1" />
            Juventude, Universitários & Infância
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
            Juventude Chabad Paraná
          </h1>
          <p className="mt-4 text-base sm:text-lg text-purple-100 leading-relaxed font-light">
            Empoderando a nova geração com orgulho de suas raízes, amizade calorosa e liderança transformadora.
          </p>
        </div>
      </section>

      {/* Main Interactive Programs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Program Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {programs.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProgram(p.id)}
              className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                selectedProgram === p.id
                  ? 'bg-purple-900 text-white border-purple-800 shadow-lg'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-slate-50'
              }`}
            >
              <div className="mb-2 text-purple-300">{p.icon}</div>
              <div className="font-bold text-sm sm:text-base leading-tight">{p.title.split('(')[0]}</div>
              <div className="text-[11px] opacity-80 mt-1">Ver Detalhes →</div>
            </button>
          ))}
        </div>

        {/* Selected Program Showcase */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-luxury space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="flex items-center space-x-3 mb-2 text-purple-700">
              {current.icon}
              <span className="text-xs font-bold uppercase tracking-wider">Programa em Destaque</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900">
              {current.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {current.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>{current.desc}</p>

              <div className="space-y-2.5 pt-4">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Destaques e Atividades:
                </div>
                {current.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs sm:text-sm text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-purple-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl text-center space-y-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto text-purple-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-xl font-bold">Faça Parte Deste Movimento</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Vagas limitadas por turma para garantir atendimento personalizado e atmosfera acolhedora.
              </p>
              <a
                href={`https://wa.me/554198977249?text=Olá!%20Gostaria%20de%20inscrição%20para%20o%20programa%20${encodeURIComponent(current.title)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full bg-chabad-gold hover:bg-yellow-500 text-chabad-dark py-3 rounded-xl font-bold text-xs shadow-md transition-all"
              >
                {current.cta}
              </a>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
