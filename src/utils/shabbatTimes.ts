import { ShabbatTimesInfo } from '../types';

export interface CuritibaScheduleEntry {
  parashaName: string;
  candleLighting: string;
  havdalah: string;
  hebrewDate: string;
  shabbatDatePt: string;
  candleIso?: string;
}

const LIVE_CACHE_KEY = 'chabad_curitiba_live_shabbat_v1';

// Hebrew months translation to Portuguese
function formatHebrewDatePt(hdateStr: string): string {
  if (!hdateStr) return '';
  return hdateStr
    .replace('Tishrei', 'de Tishrei de')
    .replace('Cheshvan', 'de Marcheshvan de')
    .replace('Kislev', 'de Kislev de')
    .replace('Tevet', 'de Tevet de')
    .replace('Shevat', 'de Shevat de')
    .replace('Adar I', 'de Adar I de')
    .replace('Adar II', 'de Adar II de')
    .replace('Adar', 'de Adar de')
    .replace('Nisan', 'de Nissan de')
    .replace('Nissan', 'de Nissan de')
    .replace('Iyyar', 'de Iyar de')
    .replace('Iyar', 'de Iyar de')
    .replace('Sivan', 'de Sivan de')
    .replace('Tamuz', 'de Tamuz de')
    .replace('Av', 'de Menachem Av de')
    .replace('Elul', 'de Elul de');
}

function formatHolidayTitlePt(title: string): string {
  if (!title) return '';
  return title
    .replace(/^Parashat\s+/i, '')
    .replace(/Yom Kippur/i, 'Iom Kipur')
    .replace(/Erev Rosh Hashana/i, 'Erev Rosh Hashaná')
    .replace(/Rosh Hashana/i, 'Rosh Hashaná')
    .replace(/Erev Sukkot/i, 'Erev Sucot')
    .replace(/Sukkot/i, 'Sucot')
    .replace(/Shemini Atzeret/i, 'Shemini Atseret')
    .replace(/Simchat Torah/i, 'Simchat Torá')
    .replace(/Chanukah|Hanukkah/i, 'Chanucá')
    .replace(/Purim/i, 'Purim')
    .replace(/Pesach|Passover/i, 'Pêssach')
    .replace(/Shavuot/i, 'Shavuot');
}

/**
 * Extracts exact HH:MM directly from ISO string "YYYY-MM-DDTHH:MM:SS-03:00"
 */
function extractLocalTime(isoStr: string): string {
  if (!isoStr) return '';
  const match = isoStr.match(/T(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  const d = new Date(isoStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatShabbatDatePt(isoStr: string): string {
  if (!isoStr) return '';
  const match = isoStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const [, y, m, d] = match;
    const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    return dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
  return '';
}

// Module-level cached schedule
let inMemoryCachedSchedule: CuritibaScheduleEntry | null = null;

function getStoredSchedule(): CuritibaScheduleEntry | null {
  if (inMemoryCachedSchedule) return inMemoryCachedSchedule;
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LIVE_CACHE_KEY);
      if (raw) {
        inMemoryCachedSchedule = JSON.parse(raw);
        return inMemoryCachedSchedule;
      }
    } catch (e) {}
  }
  return null;
}

function saveStoredSchedule(entry: CuritibaScheduleEntry): void {
  inMemoryCachedSchedule = entry;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LIVE_CACHE_KEY, JSON.stringify(entry));
      window.dispatchEvent(new CustomEvent('chabad_shabbat_updated', { detail: entry }));
    } catch (e) {}
  }
}

export async function fetchLiveCuritibaShabbatTimes(): Promise<ShabbatTimesInfo> {
  try {
    const res = await fetch(
      'https://www.hebcal.com/shabbat?cfg=json&geonameid=3464975&m=45&b=20'
    );
    if (res.ok) {
      const data = await res.json();
      let candleIso = '';
      let parasha = '';
      let candleLightingStr = '';
      let havdalahStr = '';
      let hebrewDateStr = '';

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          if (item.category === 'parashat') {
            parasha = formatHolidayTitlePt(item.title || '');
            if (item.hdate) hebrewDateStr = formatHebrewDatePt(item.hdate);
          } else if (item.category === 'holiday' && !parasha) {
            parasha = formatHolidayTitlePt(item.title || '');
            if (item.hdate) hebrewDateStr = formatHebrewDatePt(item.hdate);
          } else if (item.category === 'candles') {
            candleIso = item.date;
            candleLightingStr = extractLocalTime(item.date);
            if (item.hdate && !hebrewDateStr) hebrewDateStr = formatHebrewDatePt(item.hdate);
          } else if (item.category === 'havdalah') {
            havdalahStr = extractLocalTime(item.date);
          }
        }
      }

      if (candleLightingStr && havdalahStr) {
        const liveEntry: CuritibaScheduleEntry = {
          parashaName: parasha || 'Shabat Kodesh',
          candleLighting: candleLightingStr,
          havdalah: havdalahStr,
          hebrewDate: hebrewDateStr || '',
          shabbatDatePt: candleIso ? formatShabbatDatePt(candleIso) : '',
          candleIso: candleIso || undefined
        };

        saveStoredSchedule(liveEntry);
        return getCuritibaShabbatTimes(liveEntry);
      }
    }
  } catch (err) {
    console.warn('Live Shabbat fetch fallback:', err);
  }

  return getCuritibaShabbatTimes();
}

export function getCuritibaShabbatTimes(
  override?: CuritibaScheduleEntry,
  existingState?: ShabbatTimesInfo
): ShabbatTimesInfo {
  const schedule = override || getStoredSchedule() || {
    parashaName: 'Shabat Kodesh',
    candleLighting: '18:00',
    havdalah: '18:55',
    hebrewDate: '',
    shabbatDatePt: ''
  };

  const now = new Date();
  
  // Compute candle target date
  let candleTarget: Date;
  if (schedule.candleIso) {
    candleTarget = new Date(schedule.candleIso);
  } else {
    // Upcoming Friday
    const dayOfWeek = now.getDay();
    let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    if (dayOfWeek === 6) daysUntilFriday = 6;
    
    candleTarget = new Date(now);
    candleTarget.setDate(now.getDate() + (dayOfWeek === 5 ? 0 : daysUntilFriday));
    const [cHours, cMinutes] = (schedule.candleLighting || '18:00').split(':').map(Number);
    candleTarget.setHours(cHours || 18, cMinutes || 0, 0, 0);
  }

  let diffMs = candleTarget.getTime() - now.getTime();
  if (diffMs < 0 && Math.abs(diffMs) > 28 * 3600 * 1000) {
    // If target has passed by more than 28 hours, target next week
    candleTarget = new Date(candleTarget.getTime() + 7 * 24 * 60 * 60 * 1000);
    diffMs = candleTarget.getTime() - now.getTime();
  }

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const [cHours] = (schedule.candleLighting || '18:00').split(':').map(Number);
  const isShabbatNow = (now.getDay() === 5 && now.getHours() >= (cHours || 18)) || now.getDay() === 6;

  return {
    location: 'Curitiba, PR',
    parashaName: schedule.parashaName || existingState?.parashaName || 'Shabat Kodesh',
    hebrewDate: schedule.hebrewDate || existingState?.hebrewDate || '',
    candleLighting: schedule.candleLighting || existingState?.candleLighting || '18:00',
    havdalah: schedule.havdalah || existingState?.havdalah || '18:55',
    nextShabbatDate: schedule.shabbatDatePt || existingState?.nextShabbatDate || '',
    isShabbatNow,
    candlesCountdown: { days, hours, minutes, seconds },
  };
}
