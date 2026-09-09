import { ShabbatTimesInfo } from '../types';

interface CuritibaScheduleEntry {
  parashaName: string;
  candleLighting: string;
  havdalah: string;
  hebrewDate: string;
  shabbatDatePt: string;
}

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

// Official Beit Chabad do Paraná verified luach calibration
const CURITIBA_OFFICIAL_SCHEDULE: Record<string, CuritibaScheduleEntry> = {
  '2026-09-11': {
    parashaName: 'Erev Rosh Hashaná 5787',
    candleLighting: '17:49',
    havdalah: '18:44',
    hebrewDate: '29 de Elul de 5786',
    shabbatDatePt: '11 de setembro de 2026',
  },
  '2026-09-18': {
    parashaName: "Parashat Ha'Azinu • Shabat Shuvá",
    candleLighting: '17:52',
    havdalah: '18:46',
    hebrewDate: '7 de Tishrei de 5787',
    shabbatDatePt: '18 de setembro de 2026',
  },
  '2026-09-25': {
    parashaName: 'Erev Sucot 5787',
    candleLighting: '17:55',
    havdalah: '18:49',
    hebrewDate: '14 de Tishrei de 5787',
    shabbatDatePt: '25 de setembro de 2026',
  }
};

// Fallback defaults (Erev Rosh Hashaná 5787)
const CURRENT_CURITIBA_TIMES: CuritibaScheduleEntry = {
  parashaName: 'Erev Rosh Hashaná 5787',
  candleLighting: '17:49',
  havdalah: '18:44',
  hebrewDate: '29 de Elul de 5786',
  shabbatDatePt: '11 de setembro de 2026',
};

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
            parasha = item.title ? item.title.replace(/^Parashat\s+/i, '') : '';
            if (item.hdate) hebrewDateStr = formatHebrewDatePt(item.hdate);
          } else if (item.category === 'holiday' && !parasha) {
            parasha = item.title;
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

      // Check if this date has a community calibrated entry
      if (candleIso) {
        const dateKey = candleIso.substring(0, 10);
        if (CURITIBA_OFFICIAL_SCHEDULE[dateKey]) {
          return getCuritibaShabbatTimes(CURITIBA_OFFICIAL_SCHEDULE[dateKey]);
        }
      }

      // Otherwise dynamically use Hebcal calculated astronomical times for Curitiba
      if (candleLightingStr && havdalahStr) {
        return getCuritibaShabbatTimes({
          parashaName: parasha || 'Shabat Kodesh',
          candleLighting: candleLightingStr,
          havdalah: havdalahStr,
          hebrewDate: hebrewDateStr || '',
          shabbatDatePt: candleIso ? formatShabbatDatePt(candleIso) : '',
        });
      }
    }
  } catch (err) {
    console.warn('Live Shabbat fetch fallback:', err);
  }

  return getCuritibaShabbatTimes();
}

export function getCuritibaShabbatTimes(override?: CuritibaScheduleEntry): ShabbatTimesInfo {
  const schedule = override || CURRENT_CURITIBA_TIMES;
  const now = new Date();
  
  // Find upcoming Friday
  const current = new Date();
  const dayOfWeek = current.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
  let daysUntilFriday = (5 - dayOfWeek + 7) % 7;
  if (dayOfWeek === 6) daysUntilFriday = 6;
  
  const fridayDate = new Date(current);
  fridayDate.setDate(current.getDate() + (dayOfWeek === 5 ? 0 : daysUntilFriday));

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const fallbackDateStr = fridayDate.toLocaleDateString('pt-BR', options);

  const [cHours, cMinutes] = (schedule.candleLighting || '17:49').split(':').map(Number);
  let candleTarget = new Date(fridayDate);
  candleTarget.setHours(cHours || 17, cMinutes || 49, 0, 0);

  let diffMs = candleTarget.getTime() - now.getTime();
  if (diffMs < 0) {
    candleTarget = new Date(candleTarget.getTime() + 7 * 24 * 60 * 60 * 1000);
    diffMs = candleTarget.getTime() - now.getTime();
  }

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    location: 'Curitiba, PR',
    parashaName: schedule.parashaName,
    hebrewDate: schedule.hebrewDate,
    candleLighting: schedule.candleLighting,
    havdalah: schedule.havdalah,
    nextShabbatDate: schedule.shabbatDatePt || fallbackDateStr,
    isShabbatNow: dayOfWeek === 5 && now.getHours() >= (cHours || 17),
    candlesCountdown: { days, hours, minutes, seconds },
  };
}
