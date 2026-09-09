/**
 * Digital Pushka (e-Tzedaká) Manager for Beit Chabad Curitiba
 */

const PUSHKA_STORAGE_KEY = 'chabad_pushka_state_v1';

export interface PushkaDrop {
  id: string;
  amount: number;
  date: string;
  timestamp: number;
}

export interface PushkaState {
  balance: number;
  totalGivenLifetime: number;
  lastDropDate: string | null;
  currentStreak: number;
  drops: PushkaDrop[];
}

export function getInitialPushkaState(): PushkaState {
  if (typeof window === 'undefined') {
    return {
      balance: 0,
      totalGivenLifetime: 0,
      lastDropDate: null,
      currentStreak: 0,
      drops: []
    };
  }

  try {
    const raw = localStorage.getItem(PUSHKA_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error loading pushka state:', e);
  }

  return {
    balance: 0,
    totalGivenLifetime: 0,
    lastDropDate: null,
    currentStreak: 0,
    drops: []
  };
}

export function savePushkaState(state: PushkaState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PUSHKA_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('chabad_pushka_updated', { detail: state }));
  } catch (e) {
    console.warn('Error saving pushka state:', e);
  }
}

export function dropCoinIntoPushka(amount: number): PushkaState {
  const current = getInitialPushkaState();
  const todayIso = new Date().toISOString().slice(0, 10);
  
  let newStreak = current.currentStreak || 0;
  if (current.lastDropDate) {
    const lastDate = new Date(current.lastDropDate);
    const today = new Date(todayIso);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  const drop: PushkaDrop = {
    id: 'drop_' + Date.now(),
    amount,
    date: todayIso,
    timestamp: Date.now()
  };

  const updated: PushkaState = {
    balance: Math.round((current.balance + amount) * 100) / 100,
    totalGivenLifetime: Math.round((current.totalGivenLifetime + amount) * 100) / 100,
    lastDropDate: todayIso,
    currentStreak: newStreak,
    drops: [drop, ...(current.drops || []).slice(0, 50)]
  };

  savePushkaState(updated);
  playCoinClinkSound();
  triggerHapticFeedback();

  return updated;
}

export function emptyPushka(): PushkaState {
  const current = getInitialPushkaState();
  const updated: PushkaState = {
    ...current,
    balance: 0
  };
  savePushkaState(updated);
  return updated;
}

export function playCoinClinkSound(): void {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2489, now);
    osc1.frequency.exponentialRampToValueAtTime(1864, now + 0.08);

    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(4186, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(3135, now + 0.12);

    gain2.gain.setValueAtTime(0.3, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.28);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(440, now + 0.06);
    osc3.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain3.gain.setValueAtTime(0.25, now + 0.06);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.06);
    osc3.stop(now + 0.3);

  } catch (err) {
    // Non-fatal
  }
}

export function triggerHapticFeedback(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([80, 40, 120]);
    } catch (e) {}
  }
}

export const REBBE_TZEDAKA_QUOTES = [
  'A mitzvá de Tsedacá apressa a redenção de todo o povo de Israel e do mundo inteiro.',
  'É um costume sagrado colocar uma moeda na Pushka antes de cada oração da manhã e da tarde.',
  'As mulheres e moças costumam dar Tsedacá antes do acendimento das velas de Shabat e Yom Tov.',
  'Tsedacá significa Justiça: compartilhamos aquilo que Deus nos confiou para abençoar o próximo.',
  'Mesmo uma única moeda diária tem o poder de abrir os portais celestiais de saúde e bênção.'
];
