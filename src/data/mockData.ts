import { CommunityEvent, TorahClass, MitzvahCampaign, MagazineIssue, PhotoGalleryItem } from '../types';

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'seder-pessach-5786',
    title: 'Grande Seder Comunitário de Pessach 5786',
    subtitle: 'Uma noite inesquecível de libertação, tradição, matsot artesanais de Israel e vinhos finos casher',
    category: 'Festa & Chag',
    date: '14 de Nissan (Quarta-feira)',
    time: '19:30',
    location: 'Salão Social Beit Chabad do Paraná - Curitiba',
    price: 180,
    memberPrice: 140,
    childPrice: 90,
    description: 'Junte-se à nossa calorosa comunidade para a celebração das noites sagradas do Seder de Pessach. Com explicações em português, cantos tradicionais, Shmurah Matzah crocante feita à mão, banquete festivo de 4 pratos casher lePessach e uma atmosfera cheia de alegria para toda a família.',
    highlights: [
      'Matsá Shmurá artesanal importada de Israel',
      'Jantar gourmet casher com entrada, prato principal e sobremesas',
      'As 4 Taças de vinho/suco de uva casher',
      'Hagadá ilustrada com tradução e transliteração',
      'Espaço e animação infantil para as crianças'
    ],
    image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    registrationOpen: true,
    maxAttendees: 150
  },
  {
    id: 'friday-night-live-parana',
    title: 'Friday Night Live: Shabat com Amor e Alegria',
    subtitle: 'Recepção calorosa do Shabat, Kabalat Shabat cantado e jantar festivo comunitário',
    category: 'Shabat',
    date: 'Toda Sexta-feira',
    time: '18:45 (Minchá & Kabalat Shabat)',
    location: 'Sinagoga Beit Chabad - Curitiba',
    price: 65,
    memberPrice: 50,
    childPrice: 35,
    description: 'Sinta a santidade e o calor do Shabat em Curitiba! Tefilá harmoniosa com melodias chassídicas, Kidush especial, chalot quentinhas feitas na casa, peixe gefilte fish tradicional, frango assado e debates inspiradores com o Rabino.',
    highlights: [
      'Kabalat Shabat alegre e participativo',
      'Kidush tradicional e Chalot caseiras',
      'Conversa inspiradora de Torá e histórias chassídicas',
      'Excelente oportunidade para turistas, estudantes e famílias'
    ],
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    registrationOpen: true,
    maxAttendees: 80
  },
  {
    id: 'curso-tanya-mistica',
    title: 'Curso Master: Segredos da Alma no Tanya',
    subtitle: 'Mapeando o subconsciente, a mente e o coração através da Chassidut de Chabad',
    category: 'Palestra & Curso',
    date: 'Terças-feiras às 20:00',
    time: '20:00 - 21:15',
    location: 'Beit Midrash & Transmissão Online via Zoom',
    price: 0,
    description: 'Uma jornada fascinante pela obra magna do primeiro Rebe de Chabad, Rabi Shneur Zalman de Liadi. Aprenda como superar a ansiedade, transformar impulsos negativos em força construtiva e viver com clareza espiritual.',
    highlights: [
      'Material de apoio impresso e digital em PDF',
      'Espaço aberto para perguntas e debates profundos',
      'Acesso à gravação de todas as aulas passadas',
      'Certificado de participação ao final do módulo'
    ],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    registrationOpen: true
  },
  {
    id: 'bat-mitzvah-club-2026',
    title: 'Clube de Bat Mitzvá 5786 / 2026',
    subtitle: 'Um ano inesquecível de empoderamento, amizade, projetos sociais e identidade para jovens meninas',
    category: 'Juventude',
    date: 'Encontros Quinzenais aos Domingos',
    time: '16:00 - 18:00',
    location: 'Espaço Jovem Beit Chabad Curitiba',
    price: 120,
    description: 'O Clube de Bat Mitzvá oferece uma preparação única e dinâmica para meninas que completam 12 anos. Muito além de uma celebração, o curso desenvolve orgulho judaico, liderança, valores de generosidade e aprendizados práticos sobre as mulheres marcantes da história judaica.',
    highlights: [
      'Workshops culinários (Chalot, doces tradicionais, culinária casher)',
      'Voluntariado prático na comunidade e visita a lares de idosos',
      'Cerimônia de graduação emocionante com entrega de diplomas',
      'Kit exclusivo da aluna com diário personalizado e presente'
    ],
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    registrationOpen: true
  },
  {
    id: 'alicerces-shabbaton-inverno',
    title: 'Shabaton Universitário Alicerces Paraná',
    subtitle: 'Fim de semana imersivo de conexão, networking judaico e reflexões existenciais para universitários',
    category: 'Juventude',
    date: 'Sexta a Domingo (Próximo mês)',
    time: 'Início Sexta 16:00',
    location: 'Chácara Beit Chabad & Serra da Graciosa',
    price: 150,
    memberPrice: 90,
    description: 'Exclusivo para estudantes universitários e jovens profissionais (18 a 30 anos). Um refúgio da rotina com boa comida, conversas autênticas sobre carreira, propósito, relacionamentos e a sabedoria milenar da Torá.',
    highlights: [
      'Hospedagem completa e alimentação casher gourmet',
      'Painel de debates sobre carreira, ética e judaísmo',
      'Fogueira com música chassídica e violão após a Havdalá',
      'Vagas limitadas para 40 jovens'
    ],
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    registrationOpen: true
  }
];

export const MITZVAH_CAMPAIGNS: MitzvahCampaign[] = [
  {
    id: 'tefilin',
    number: 1,
    title: 'Campanha de Tefilin',
    hebrewTitle: 'מבצע תפילין',
    subtitle: 'Conexão direta entre mente, coração e ação',
    description: 'Iniciada pelo Rebe antes da Guerra dos Seis Dias em 1967, esta campanha incentiva todo homem judeu a partir dos 13 anos a colocar os Tefilin diariamente nos dias de semana, atraindo proteção divina e paz para todo o povo de Israel.',
    howTo: [
      'Colocado no braço mais fraco (apontado para o coração) e na cabeça (sede do intelecto)',
      'Cumprido de manhã ou a qualquer hora antes do pôr do sol',
      'Disponibilizamos Tefilin e auxílio na sinagoga ou onde você estiver em Curitiba'
    ],
    quote: '"O Tefilin no braço subjuga as emoções a D-us; o Tefilin na cabeça direciona o intelecto para o bem."',
    iconName: 'Scroll'
  },
  {
    id: 'mezuzah',
    number: 2,
    title: 'Campanha de Mezuzá',
    hebrewTitle: 'מבצע מזוזה',
    subtitle: 'Proteção e santidade para o lar judaico',
    description: 'Colocar um pergaminho sagrado de Mezuzá escrito à mão por um Sofer qualificado nos portais da casa assegura a bênção de D-us para todos os que habitam e entram na residência.',
    howTo: [
      'Fixada no terço superior do batente direito de cada porta da casa (exceto banheiro)',
      'Deve ser verificada por um Sofer competente pelo menos duas vezes a cada 7 anos',
      'O Beit Chabad oferece serviço de revisão e colocação de Mezuzot em Curitiba'
    ],
    quote: '"D-us é o teu guardião; Ele protege as tuas saídas e as tuas entradas para sempre."',
    iconName: 'Home'
  },
  {
    id: 'tzedakah',
    number: 3,
    title: 'Campanha de Tzedaká',
    hebrewTitle: 'מבצע צדקה',
    subtitle: 'Justiça social, generosidade e sustento ao próximo',
    description: 'Ter uma caixinha de Tzedaká (Pushke) em casa e no escritório e colocar moedas diariamente antes das orações ou antes do acendimento das velas de Shabat transforma o ambiente em um canal de bênçãos materiais e espirituais.',
    howTo: [
      'Dar uma moeda todos os dias úteis',
      'Colocar algumas moedas antes de acender as velas de Shabat',
      'Peça sua caixinha oficial de Tzedaká do Beit Chabad do Paraná'
    ],
    quote: '"A Tzedaká apressa a Redenção e traz fartura para o doador."',
    iconName: 'HeartHandshake'
  },
  {
    id: 'velas-shabat',
    number: 4,
    title: 'Velas de Shabat e Yom Tov',
    hebrewTitle: 'נרות שבת קודש',
    subtitle: 'A luz que ilumina o lar e traz Shalom Bait',
    description: 'Toda mulher e menina judia a partir dos 3 anos acende as velas de Shabat na sexta-feira antes do pôr do sol, espalhando harmonia, calor e espiritualidade para o mundo.',
    howTo: [
      'Mulheres casadas acendem pelo menos duas velas; meninas solteiras acendem uma vela',
      'Acender 18 minutos antes do pôr do sol com a bênção apropriada',
      'Momento propício para orações íntimas pela saúde e sucesso da família'
    ],
    quote: '"Uma pequena luz dissipa muita escuridão."',
    iconName: 'Flame'
  },
  {
    id: 'kashrut',
    number: 5,
    title: 'Campanha de Kashrut',
    hebrewTitle: 'מבצע כשרות',
    subtitle: 'Nutrição física e espiritual em sintonia com a Torá',
    description: 'Alimentar-se com comida Casher refina a sensibilidade da alma, garante o bem-estar e alinha o corpo com os preceitos de pureza alimentar judaica.',
    howTo: [
      'Separar carne e leite, utilizando louças e panelas distintas',
      'Consumir carnes abatidas ritualmente (Shechitá) e produtos com certificação rabínica',
      'Oferecemos orientação para tornar a cozinha do seu lar 100% casher em Curitiba'
    ],
    quote: '"O que ingerimos se torna o sangue e a carne que alimentam nossos pensamentos e sentimentos."',
    iconName: 'Utensils'
  },
  {
    id: 'estudo-tora',
    number: 6,
    title: 'Estudo Diário da Torá',
    hebrewTitle: 'מבצע תורה',
    subtitle: 'Alimento para a mente e bússola moral diária',
    description: 'Estabelecer horários fixos diários para o estudo da Torá (Chumash com Rashi, Tehilim, Tanya - Chitas e Rambam diário) fortalece a fé e conecta a alma à sabedoria infinita do Criador.',
    howTo: [
      'Dedicar pelo menos 15 minutos diários ao estudo',
      'Participar dos cursos e Shiurim presenciais ou online do Beit Chabad',
      'Acessar livros comentados em português em nossa biblioteca'
    ],
    quote: '"Torá é vida e sabedoria prática para enfrentar os desafios modernos."',
    iconName: 'BookOpen'
  },
  {
    id: 'taharat-hamishpacha',
    number: 7,
    title: 'Pureza Familiar & Mikvê',
    hebrewTitle: 'טהרת המשפחה',
    subtitle: 'A santidade do casamento e a renovação do amor',
    description: 'A observância das leis de Taharat HaMishpacha e a imersão na água sagrada do Mikvê renovam mensalmente o vínculo conjugal, trazendo bênçãos para os filhos e saúde para o casal.',
    howTo: [
      'Aulas individuais e confidenciais para noivas e mulheres casadas',
      'Agendamento privativo e seguro no Mikvê em Curitiba',
      'Ambiente moderno, higiênico e acolhedor'
    ],
    quote: '"O Mikvê é o alicerce secreto da felicidade e da continuidade do povo judeu."',
    iconName: 'Droplets'
  },
  {
    id: 'casa-cheia-livros',
    number: 8,
    title: 'Casa Cheia de Livros Sagrados',
    hebrewTitle: 'בית מלא ספרים',
    subtitle: 'Transformando o lar em um santuário de sabedoria',
    description: 'Ter em casa um Tanach (Bíblia), Sidur (livro de orações), Tehilim (Salmos) e o livro do Tanya preenche as paredes do lar com santidade e protege a família.',
    howTo: [
      'Montar uma estante judaica visível na sala ou no quarto das crianças',
      'Adquirir obras fundamentais com tradução em português',
      'Visite nosso Gift Shop e Biblioteca comunitária'
    ],
    quote: '"Que as paredes da sua casa vejam e respirem as palavras dos livros sagrados."',
    iconName: 'Library'
  },
  {
    id: 'educacao-judaica',
    number: 9,
    title: 'Educação Judaica Autêntica',
    hebrewTitle: 'מבצע חינוך',
    subtitle: 'Garantindo o futuro das próximas gerações',
    description: 'Proporcionar aos filhos uma formação rica em valores éticos, tradições e amor a D-us desde os primeiros anos de vida através do Ganênu, Shul e colônias de férias.',
    howTo: [
      'Matricular crianças no Ganênu e no Gan Israel de Curitiba',
      'Incentivar a bênção antes de comer (Berachot) e o Shma Israel antes de dormir',
      'Conversar sobre a Parashá da semana à mesa de Shabat'
    ],
    quote: '"Educa a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele."',
    iconName: 'GraduationCap'
  },
  {
    id: 'ahavat-yisrael',
    number: 10,
    title: 'Amor ao Próximo (Ahavat Yisrael)',
    hebrewTitle: 'ואהבת לרעך כמוך',
    subtitle: 'A regra de ouro da Torá e a essência de Chabad',
    description: 'Amar cada judeu incondicionalmente, independentemente de seu nível de observância religiosa, origem ou conhecimento, acolhendo a todos com um sorriso e respeito fraterno.',
    howTo: [
      'Receber novos visitantes e turistas com hospitalidade calorosa',
      'Apoiar os membros da comunidade que estejam necessitados ou enfermos (Bikur Cholim)',
      'Praticar atos de bondade diários (Guemilat Chassadim)'
    ],
    quote: '"O que é odioso para ti, não faças ao teu semelhante. Esta é toda a Torá."',
    iconName: 'Users'
  }
];

export const TORAH_CLASSES: TorahClass[] = [
  {
    id: 'estudo-diario-semana',
    title: 'Estudo Diário: Tanya & Chumash',
    teacher: 'Corpo Rabínico',
    audience: 'Aberto a todos',
    day: 'Segunda a Sexta-feira',
    time: '08:30 (após a reza matinal)',
    location: 'Beit Midrash Beit Chabad',
    description: 'Estudo diário da porção do Chumash com Rashi e lição diária do Tanya, fortalecendo a mente e a alma para a jornada diária.',
    category: 'Estudo Diário',
    isOnlineAvailable: false
  },
  {
    id: 'estudo-diario-domingo',
    title: 'Estudo Diário: Tanya & Chumash de Domingo',
    teacher: 'Corpo Rabínico',
    audience: 'Aberto a todos',
    day: 'Domingo',
    time: '10:30 (após a reza)',
    location: 'Beit Midrash Beit Chabad',
    description: 'Estudo especial dos ensinamentos semanais do Chumash e capítulos do Tanya após a oração matinal de domingo.',
    category: 'Estudo Diário',
    isOnlineAvailable: false
  },
  {
    id: 'espaco-da-mulher',
    title: 'Espaço da Mulher • Estudos & Conexão',
    teacher: 'Rebbetzin Dubrawsky',
    audience: 'Exclusivo para Mulheres',
    day: 'Terça-feira',
    time: 'Encontros Semanais',
    location: 'Espaço Gourmet Chabad',
    description: 'Encontro inspirador dedicado às mulheres da comunidade com reflexões sobre sabedoria feminina na Torá, valores e harmonia no lar.',
    category: 'Feminino',
    isOnlineAvailable: false
  },
  {
    id: 'aula-terca-noite',
    title: 'Aula Noturna de Torá & Chassidut',
    teacher: 'Rabino Menachem',
    audience: 'Adultos e Jovens',
    day: 'Terça-feira',
    time: '20:00',
    location: 'Salão Principal Beit Chabad',
    description: 'Aulas semanais explorando as profundezas do pensamento judaico, ética e aplicação prática da sabedoria chassídica.',
    category: 'Tanya & Chassidut',
    isOnlineAvailable: true
  },
  {
    id: 'tanya-quarta-zoom',
    title: 'Shiur de Tanya Online (Zoom)',
    teacher: 'Rabino Dubrawsky',
    audience: 'Aberto a todos',
    day: 'Quarta-feira',
    time: '20:00',
    location: 'Transmissão Online via Zoom',
    description: 'Shiur semanal de Tanya transmitido ao vivo pelo Zoom, desvendando a anatomia da alma e o propósito divino da existência.',
    category: 'Tanya & Chassidut',
    isOnlineAvailable: true
  },
  {
    id: 'aula-quinta-parasha',
    title: 'Parashat HaShavua & Sabedoria de Vida',
    teacher: 'Corpo Rabínico',
    audience: 'Aberto a todos',
    day: 'Quinta-feira',
    time: '20:00',
    location: 'Beit Midrash Beit Chabad',
    description: 'Análise aprofundada da porção semanal da Torá com lições práticas para família, liderança e conduta ética.',
    category: 'Parasha',
    isOnlineAvailable: true
  }
];

export const MAGAZINES: MagazineIssue[] = [
  {
    id: 'mag-40-anos',
    edition: 'Edição Histórica - Nº 40',
    title: '40 Anos de Chabad no Paraná: Uma Trajetória de Amor e Alegria',
    season: 'Edição Especial de Jubileu',
    year: '2026 / 5786',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '#',
    highlights: [
      'Linha do tempo: De 1986 aos dias atuais em Curitiba',
      'Entrevista exclusiva com líderes e pioneiros da comunidade',
      'Artigos sobre Pessach e a libertação da alma',
      'Depoimentos emocionantes de gerações impactadas'
    ]
  },
  {
    id: 'mag-festas-5786',
    edition: 'Edição de Tishrei - Nº 39',
    title: 'Rosh Hashaná & Grandes Festas: Renovando o Voo da Alma',
    season: 'Outono / Tishrei',
    year: '5786',
    coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be8510ab?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '#',
    highlights: [
      'Guia prático para as orações de Yom Kipur',
      'Receitas tradicionais de Challah redonda com mel',
      'O significado profundo do Shofar no Chassidismo',
      'Construção e leis da Sucá em Curitiba'
    ]
  },
  {
    id: 'mag-shavuot-5785',
    edition: 'Edição de Shavuot - Nº 38',
    title: 'A Entrega da Torá e a Alegria de Ser Judeu',
    season: 'Primavera / Sivan',
    year: '5785',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
    pdfUrl: '#',
    highlights: [
      'A noite de estudo de Shavuot (Tikun Leil Shavuot)',
      'Por que comemos laticínios em Shavuot?',
      'As crianças são nossos fiadores espirituais'
    ]
  }
];

export const PHOTO_GALLERIES: PhotoGalleryItem[] = [
  {
    id: 'gala-40-anos',
    title: 'Celebração dos 40 Anos do Beit Chabad do Paraná',
    date: '2026',
    category: 'Comunitário',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    imageCount: 48,
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'chanukah-curitiba',
    title: 'Acendimento da Grande Menorá no Palácio Iguaçu & Praça Santos Andrade',
    date: 'Chanuká 5786',
    category: 'Festas',
    coverImage: 'https://images.unsplash.com/photo-1575881875475-310247076284?auto=format&fit=crop&w=1200&q=80',
    imageCount: 36,
    images: [
      'https://images.unsplash.com/photo-1575881875475-310247076284?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'purim-curitiba',
    title: 'Megilá, Banquete e Fantasias no Grande Purim Circus',
    date: 'Purim 5786',
    category: 'Festas',
    coverImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    imageCount: 52,
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'gan-israel-camp',
    title: 'Colônia de Férias Gan Israel Curitiba: Alegria Infantil',
    date: 'Julho 2025 / Janeiro 2026',
    category: 'Juventude',
    coverImage: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=80',
    imageCount: 64,
    images: [
      'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

export const SYNAGOGUE_SCHEDULE = {
  weekdays: [
    { name: 'Shacharit (Oração da Manhã)', time: '07:30 (Segunda a Sexta)', desc: 'Com leitura de Torá às Segundas e Quintas e colocação de Tefilin.' }
  ],
  shabbat: [
    { name: 'Kabalat Shabat & Arvit', time: '19:15', desc: 'Canções chassídicas, prece noturna de Shabat, recepção calorosa e Dvar Torá.' },
    { name: 'Shacharit de Shabat', time: '10:00', desc: 'Oração festiva matinal, leitura da Parashat HaShavua com Aliyot e sermão rabínico.' },
    { name: 'Kidush Comunitário', time: '12:45', desc: 'Almoço festivo com Cholent quentinho, L\'chaim e confraternização comunitária.' }
  ],
  sundays: [
    { name: 'Shacharit de Domingo', time: '08:30', desc: 'Oração matinal com colocação de Tefilin e estudo de Torá.' }
  ]
};
