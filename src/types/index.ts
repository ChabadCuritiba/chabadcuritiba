export interface ShabbatTimesInfo {
  location: string;
  parashaName: string;
  hebrewDate: string;
  candleLighting: string;
  havdalah: string;
  nextShabbatDate: string;
  isShabbatNow: boolean;
  candlesCountdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export interface EventMealItem {
  id: string;
  name: string; // e.g. "Jantar de Shabat", "1º Almoço de Yom Tov"
  dayOrDate: string; // e.g. "Sexta-feira, 22/09" or "22/09/2026"
  time?: string; // e.g. "20:00"
  type: 'almoco' | 'jantar' | 'outro';
  price: number; // Preço Geral / Adulto (R$)
  youthPrice?: number; // Preço Jovem (R$)
  childPrice?: number; // Preço Kids / Criança (R$)
  memberPrice?: number; // Preço Membro (R$)
}

export interface CommunityEvent {
  id: string;
  title: string;
  subtitle: string;
  category: 'Festa & Chag' | 'Shabat' | 'Jantar' | 'Palestra & Curso' | 'Juventude' | 'Mulheres';
  date: string;
  time: string;
  location: string;
  price: number; // in BRL, 0 for free
  memberPrice?: number;
  youthPrice?: number;
  childPrice?: number;
  hasMealOptions?: boolean;
  meals?: EventMealItem[]; // Schedule of custom meals with date & tiered pricing
  mealOptions?: string[]; // Legacy fallback e.g. ['Almoço', 'Jantar']
  lunchCount?: number;
  dinnerCount?: number;
  lunchPrice?: number;
  lunchMemberPrice?: number;
  lunchYouthPrice?: number;
  lunchChildPrice?: number;
  dinnerPrice?: number;
  dinnerMemberPrice?: number;
  dinnerYouthPrice?: number;
  dinnerChildPrice?: number;
  description: string;
  highlights: string[];
  image: string;
  featured?: boolean;
  registrationOpen: boolean;
  maxAttendees?: number;
}

export interface TorahClass {
  id: string;
  title: string;
  teacher: string;
  audience: string;
  day: string;
  time: string;
  location: string;
  description: string;
  category: 'Estudo Diário' | 'Parasha' | 'Tanya & Chassidut' | 'Talmud & Halacha' | 'Feminino' | 'Jovens';
  isOnlineAvailable: boolean;
}

export interface MitzvahCampaign {
  id: string;
  number: number;
  title: string;
  hebrewTitle: string;
  subtitle: string;
  description: string;
  howTo: string[];
  quote: string;
  iconName: string;
}

export interface MagazineIssue {
  id: string;
  edition: string;
  title: string;
  season: string;
  year: string;
  coverImage: string;
  pdfUrl: string;
  highlights: string[];
}

export interface PhotoGalleryItem {
  id: string;
  title: string;
  date: string;
  category: string;
  coverImage: string;
  imageCount: number;
  images: string[];
}

export interface YahrtzeitEntry {
  id: string;
  hebrewName: string;
  secularName: string;
  hebrewDate: string;
  secularDate: string;
  relationship: string;
  kaddishRequested: boolean;
}
