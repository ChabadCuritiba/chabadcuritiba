/**
 * Supabase Client & Storage Integration for Beit Chabad Curitiba
 * Project URL: https://flsxfjqpknlhdxevmyhl.supabase.co
 */

import { CommunityEvent, EventMealItem } from '../types';
import { RsvpRecord, DonationRecord } from './formSubmit';
import { COMMUNITY_EVENTS as DEFAULT_EVENTS } from '../data/mockData';

export const SUPABASE_URL = 'https://flsxfjqpknlhdxevmyhl.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc3hmanFwa25saGR4ZXZteWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NDYxMzUsImV4cCI6MjEwNDMyMjEzNX0.KD1eWhsfTZ5SwTmYWVpPFXuvvbKI_0ZvvJa7xxYioxE';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Local storage fallback keys
const LOCAL_EVENTS_KEY = 'chabad_curitiba_events_v2';
const LOCAL_RSVPS_KEY = 'chabad_curitiba_rsvps_v2';
const LOCAL_DONATIONS_KEY = 'chabad_curitiba_donations_v2';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

// ================================================================
// 1. STORAGE HELPER (Receipts & Event Flyers)
// ================================================================

/**
 * Upload a binary File, Blob, or base64 DataURL directly to Supabase Storage
 */
export async function uploadToSupabaseStorage(
  bucket: 'receipts' | 'event-images',
  filePath: string,
  fileOrBase64: File | Blob | string
): Promise<string | null> {
  try {
    let bodyData: BodyInit;
    let contentType = 'image/jpeg';

    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('data:')) {
        const parts = fileOrBase64.split(';base64,');
        contentType = parts[0].replace('data:', '');
        const byteCharacters = atob(parts[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        bodyData = new Uint8Array(byteNumbers);
      } else {
        return fileOrBase64; // Already a URL
      }
    } else {
      bodyData = fileOrBase64;
      contentType = fileOrBase64.type || contentType;
    }

    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePath}`;
    const res = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: bodyData
    });

    if (res.ok) {
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePath}`;
    } else {
      console.warn(`[Supabase Storage] Upload returned ${res.status}:`, await res.text());
      return null;
    }
  } catch (err) {
    console.warn('[Supabase Storage] Upload error:', err);
    return null;
  }
}

// ================================================================
// 2. EVENTS API (Supabase PostgreSQL + Realtime Sync)
// ================================================================

export async function fetchSupabaseEvents(): Promise<CommunityEvent[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/events?select=*&order=created_at.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: CommunityEvent[] = rows
          .filter(r => r.category !== 'Notificacao' && r.id !== 'live_broadcast_notice')
          .map(r => {
          let youthPriceVal: number | undefined = undefined;
          if (r.youth_price !== null && r.youth_price !== undefined) {
            youthPriceVal = Number(r.youth_price);
          } else if (r.jovem_price !== null && r.jovem_price !== undefined) {
            youthPriceVal = Number(r.jovem_price);
          } else if (Array.isArray(r.highlights)) {
            const ypTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__youth_price:'));
            if (ypTag) {
              const parsed = Number(ypTag.replace('__youth_price:', ''));
              if (!isNaN(parsed)) youthPriceVal = parsed;
            }
          }

          let mealsVal: EventMealItem[] | undefined = undefined;
          let lunchPriceVal: number | undefined = undefined;
          let lunchMemberPriceVal: number | undefined = undefined;
          let lunchYouthPriceVal: number | undefined = undefined;
          let lunchChildPriceVal: number | undefined = undefined;
          let lunchCountVal: number | undefined = undefined;

          let dinnerPriceVal: number | undefined = undefined;
          let dinnerMemberPriceVal: number | undefined = undefined;
          let dinnerYouthPriceVal: number | undefined = undefined;
          let dinnerChildPriceVal: number | undefined = undefined;
          let dinnerCountVal: number | undefined = undefined;

          let hasMealOptionsVal = false;
          let mealOptionsVal: string[] | undefined = undefined;
          
          if (Array.isArray(r.highlights)) {
            const mealsTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__event_meals:'));
            if (mealsTag) {
              try {
                const parsedMeals = JSON.parse(mealsTag.replace('__event_meals:', ''));
                if (Array.isArray(parsedMeals)) {
                  hasMealOptionsVal = true;
                  mealsVal = parsedMeals;
                }
              } catch (e) {
                console.warn('[Supabase] Failed to parse __event_meals:', e);
              }
            }

            const mealTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__meals:'));
            if (mealTag) {
              hasMealOptionsVal = true;
              mealOptionsVal = mealTag.replace('__meals:', '').split(',').map((m: string) => m.trim()).filter(Boolean);
            }

            const lcTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__lunch_count:'));
            if (lcTag) {
              const parsed = Number(lcTag.replace('__lunch_count:', ''));
              if (!isNaN(parsed)) lunchCountVal = parsed;
            }

            const lpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__lunch_price:'));
            if (lpTag) {
              const parsed = Number(lpTag.replace('__lunch_price:', ''));
              if (!isNaN(parsed)) lunchPriceVal = parsed;
            }

            const lmpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__lunch_member_price:'));
            if (lmpTag) {
              const parsed = Number(lmpTag.replace('__lunch_member_price:', ''));
              if (!isNaN(parsed)) lunchMemberPriceVal = parsed;
            }

            const lypTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__lunch_youth_price:'));
            if (lypTag) {
              const parsed = Number(lypTag.replace('__lunch_youth_price:', ''));
              if (!isNaN(parsed)) lunchYouthPriceVal = parsed;
            }

            const lcpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__lunch_child_price:'));
            if (lcpTag) {
              const parsed = Number(lcpTag.replace('__lunch_child_price:', ''));
              if (!isNaN(parsed)) lunchChildPriceVal = parsed;
            }

            const dcTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__dinner_count:'));
            if (dcTag) {
              const parsed = Number(dcTag.replace('__dinner_count:', ''));
              if (!isNaN(parsed)) dinnerCountVal = parsed;
            }

            const dpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__dinner_price:'));
            if (dpTag) {
              const parsed = Number(dpTag.replace('__dinner_price:', ''));
              if (!isNaN(parsed)) dinnerPriceVal = parsed;
            }

            const dmpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__dinner_member_price:'));
            if (dmpTag) {
              const parsed = Number(dmpTag.replace('__dinner_member_price:', ''));
              if (!isNaN(parsed)) dinnerMemberPriceVal = parsed;
            }

            const dypTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__dinner_youth_price:'));
            if (dypTag) {
              const parsed = Number(dypTag.replace('__dinner_youth_price:', ''));
              if (!isNaN(parsed)) dinnerYouthPriceVal = parsed;
            }

            const dcpTag = r.highlights.find((h: string) => typeof h === 'string' && h.startsWith('__dinner_child_price:'));
            if (dcpTag) {
              const parsed = Number(dcpTag.replace('__dinner_child_price:', ''));
              if (!isNaN(parsed)) dinnerChildPriceVal = parsed;
            }
          }

          const cleanHighlights = Array.isArray(r.highlights)
            ? r.highlights.filter((h: string) => typeof h === 'string' && 
                !h.startsWith('__youth_price:') && 
                !h.startsWith('__meals:') && 
                !h.startsWith('__event_meals:') &&
                !h.startsWith('__lunch_count:') &&
                !h.startsWith('__lunch_price:') && 
                !h.startsWith('__lunch_member_price:') && 
                !h.startsWith('__lunch_youth_price:') && 
                !h.startsWith('__lunch_child_price:') && 
                !h.startsWith('__dinner_count:') &&
                !h.startsWith('__dinner_price:') &&
                !h.startsWith('__dinner_member_price:') &&
                !h.startsWith('__dinner_youth_price:') &&
                !h.startsWith('__dinner_child_price:')
              )
            : [];

          return {
            id: r.id,
            title: r.title,
            subtitle: r.subtitle || '',
            category: r.category || 'Festa & Chag',
            date: r.date,
            time: r.time,
            location: (r.location || '').replace(/Batel/g, 'Água Verde'),
            price: Number(r.price) || 0,
            memberPrice: (r.member_price !== null && r.member_price !== undefined) ? Number(r.member_price) : undefined,
            youthPrice: youthPriceVal,
            childPrice: (r.child_price !== null && r.child_price !== undefined) ? Number(r.child_price) : undefined,
            hasMealOptions: hasMealOptionsVal,
            meals: mealsVal,
            mealOptions: mealOptionsVal,
            lunchCount: lunchCountVal,
            dinnerCount: dinnerCountVal,
            lunchPrice: lunchPriceVal,
            lunchMemberPrice: lunchMemberPriceVal,
            lunchYouthPrice: lunchYouthPriceVal,
            lunchChildPrice: lunchChildPriceVal,
            dinnerPrice: dinnerPriceVal,
            dinnerMemberPrice: dinnerMemberPriceVal,
            dinnerYouthPrice: dinnerYouthPriceVal,
            dinnerChildPrice: dinnerChildPriceVal,
            description: r.description || '',
            highlights: cleanHighlights,
            image: r.image,
            featured: r.featured ?? true,
            registrationOpen: r.registration_open ?? true
          };
        });
        localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[Supabase] Error fetching events:', err);
  }

  // Fallback to local cache
  return getLocalEvents();
}

export async function saveSupabaseEvent(event: CommunityEvent): Promise<void> {
  // 1. Update local cache immediately
  const current = getLocalEvents();
  const updated = [event, ...current.filter(e => e.id !== event.id)];
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));

  // 2. Upsert to Supabase with exact database columns
  try {
    const memberVal = (event.memberPrice !== undefined && event.memberPrice !== null) ? Number(event.memberPrice) : null;
    const childVal = (event.childPrice !== undefined && event.childPrice !== null) ? Number(event.childPrice) : null;

    // Preserve youthPrice, custom meals, and meal options safely inside highlights array to avoid PGRST204 column missing error in Postgres
    const rawHighlights = Array.isArray(event.highlights) ? event.highlights : [];
    const encodedHighlights = rawHighlights.filter(h => typeof h === 'string' && 
      !h.startsWith('__youth_price:') && 
      !h.startsWith('__meals:') &&
      !h.startsWith('__event_meals:') &&
      !h.startsWith('__lunch_count:') &&
      !h.startsWith('__lunch_price:') &&
      !h.startsWith('__lunch_member_price:') &&
      !h.startsWith('__lunch_youth_price:') &&
      !h.startsWith('__lunch_child_price:') &&
      !h.startsWith('__dinner_count:') &&
      !h.startsWith('__dinner_price:') &&
      !h.startsWith('__dinner_member_price:') &&
      !h.startsWith('__dinner_youth_price:') &&
      !h.startsWith('__dinner_child_price:')
    );
    
    if (event.youthPrice !== undefined && event.youthPrice !== null) {
      encodedHighlights.push(`__youth_price:${event.youthPrice}`);
    }

    if (event.hasMealOptions && event.meals && event.meals.length > 0) {
      encodedHighlights.push(`__event_meals:${JSON.stringify(event.meals)}`);
    }

    if (event.hasMealOptions && event.mealOptions && event.mealOptions.length > 0) {
      encodedHighlights.push(`__meals:${event.mealOptions.join(',')}`);
    }

    if (event.lunchCount !== undefined && event.lunchCount !== null) {
      encodedHighlights.push(`__lunch_count:${event.lunchCount}`);
    }

    if (event.lunchPrice !== undefined && event.lunchPrice !== null) {
      encodedHighlights.push(`__lunch_price:${event.lunchPrice}`);
    }

    if (event.lunchMemberPrice !== undefined && event.lunchMemberPrice !== null) {
      encodedHighlights.push(`__lunch_member_price:${event.lunchMemberPrice}`);
    }

    if (event.lunchYouthPrice !== undefined && event.lunchYouthPrice !== null) {
      encodedHighlights.push(`__lunch_youth_price:${event.lunchYouthPrice}`);
    }

    if (event.lunchChildPrice !== undefined && event.lunchChildPrice !== null) {
      encodedHighlights.push(`__lunch_child_price:${event.lunchChildPrice}`);
    }

    if (event.dinnerCount !== undefined && event.dinnerCount !== null) {
      encodedHighlights.push(`__dinner_count:${event.dinnerCount}`);
    }

    if (event.dinnerPrice !== undefined && event.dinnerPrice !== null) {
      encodedHighlights.push(`__dinner_price:${event.dinnerPrice}`);
    }

    if (event.dinnerMemberPrice !== undefined && event.dinnerMemberPrice !== null) {
      encodedHighlights.push(`__dinner_member_price:${event.dinnerMemberPrice}`);
    }

    if (event.dinnerYouthPrice !== undefined && event.dinnerYouthPrice !== null) {
      encodedHighlights.push(`__dinner_youth_price:${event.dinnerYouthPrice}`);
    }

    if (event.dinnerChildPrice !== undefined && event.dinnerChildPrice !== null) {
      encodedHighlights.push(`__dinner_child_price:${event.dinnerChildPrice}`);
    }

    const row: Record<string, any> = {
      id: event.id,
      title: event.title,
      subtitle: event.subtitle || '',
      category: event.category || 'Festa & Chag',
      date: event.date,
      time: event.time,
      location: event.location,
      price: Number(event.price) || 0,
      member_price: memberVal,
      child_price: childVal,
      description: event.description || '',
      highlights: encodedHighlights,
      image: event.image,
      featured: event.featured ?? true,
      registration_open: event.registrationOpen ?? true
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/events`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });

    if (!res.ok) {
      console.warn('[Supabase] Error saving event:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('[Supabase] Error saving event:', err);
  }
}

export async function deleteSupabaseEvent(id: string): Promise<CommunityEvent[]> {
  const current = getLocalEvents();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/events?id=eq.${id}`, {
      method: 'DELETE',
      headers: HEADERS
    });
  } catch (err) {
    console.warn('[Supabase] Error deleting event:', err);
  }

  return updated;
}

export function getLocalEvents(): CommunityEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(e => ({
          ...e,
          location: (e.location || '').replace(/Batel/g, 'Água Verde')
        }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

// ================================================================
// 3. RSVPS API (Supabase PostgreSQL + 7-Day Receipt Expiration)
// ================================================================

export async function fetchSupabaseRsvps(): Promise<RsvpRecord[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rsvps?select=*&order=created_at.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: RsvpRecord[] = rows.map(r => {
          let selectedMealsVal: string[] | undefined = undefined;
          if (Array.isArray(r.selected_meals)) {
            selectedMealsVal = r.selected_meals;
          } else if (typeof r.ticket_type === 'string' && r.ticket_type.includes('[Refeições:')) {
            const match = r.ticket_type.match(/\[Refeições:\s*([^\]]+)\]/);
            if (match) {
              selectedMealsVal = match[1].split(',').map((m: string) => m.trim()).filter(Boolean);
            }
          }

          return {
            id: r.id,
            ticketCode: r.ticket_code || r.voucher || r.id,
            eventTitle: r.event_title || 'Evento Comunitário',
            fullName: r.full_name || r.name || 'Participante',
            email: r.email || '',
            phone: r.phone || '',
            ticketCount: Number(r.ticket_count) || 1,
            ticketType: r.ticket_type || 'Geral',
            selectedMeals: selectedMealsVal,
            totalPrice: Number(r.total_price) || 0,
            dietaryNotes: r.dietary_notes || r.notes || '',
            paymentMethod: r.payment_method || 'PIX',
            receiptUrl: r.receipt_url,
            receiptFileName: r.receipt_file_name,
            status: r.status || 'Pendente',
            createdAt: r.created_at_formatted || r.created_at || new Date().toLocaleString('pt-BR'),
            timestamp: r.timestamp ? Number(r.timestamp) : undefined
          };
        });

        const { cleaned, hasChanges } = cleanExpiredReceipts(mapped);
        localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(cleaned));

        // Purge expired receipts on cloud as well
        if (hasChanges) {
          cleaned.forEach(r => {
            if (!r.receiptUrl) {
              fetch(`${SUPABASE_URL}/rest/v1/rsvps?id=eq.${r.id}`, {
                method: 'PATCH',
                headers: HEADERS,
                body: JSON.stringify({ receipt_url: null, receipt_file_name: null })
              }).catch(() => {});
            }
          });
        }

        return cleaned;
      }
    }
  } catch (err) {
    console.warn('[Supabase] Error fetching RSVPs:', err);
  }

  return getLocalRsvps();
}

export async function saveSupabaseRsvp(record: RsvpRecord): Promise<void> {
  // If receipt is a base64 string, upload to Supabase Storage first for high performance
  let receiptFinalUrl = record.receiptUrl;
  if (record.receiptUrl && record.receiptUrl.startsWith('data:')) {
    const ext = record.receiptFileName?.split('.').pop() || 'jpg';
    const filePath = `receipt_${record.id}_${Date.now()}.${ext}`;
    const uploaded = await uploadToSupabaseStorage('receipts', filePath, record.receiptUrl);
    if (uploaded) {
      receiptFinalUrl = uploaded;
    }
  }

  const cleanRecord: RsvpRecord = {
    ...record,
    receiptUrl: receiptFinalUrl
  };

  // 1. Update local cache
  const current = getLocalRsvps();
  const updated = [cleanRecord, ...current.filter(r => r.id !== cleanRecord.id)];
  localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(updated));

  // 2. Upsert to Supabase
  try {
    let fullTicketType = cleanRecord.ticketType;
    if (cleanRecord.selectedMeals && cleanRecord.selectedMeals.length > 0 && !fullTicketType.includes('[Refeições:')) {
      fullTicketType = `${fullTicketType} [Refeições: ${cleanRecord.selectedMeals.join(', ')}]`;
    }

    const row = {
      id: cleanRecord.id,
      ticket_code: cleanRecord.ticketCode,
      event_title: cleanRecord.eventTitle,
      full_name: cleanRecord.fullName,
      email: cleanRecord.email,
      phone: cleanRecord.phone,
      total_price: cleanRecord.totalPrice,
      ticket_count: cleanRecord.ticketCount,
      ticket_type: fullTicketType,
      dietary_notes: cleanRecord.dietaryNotes,
      payment_method: cleanRecord.paymentMethod,
      receipt_url: cleanRecord.receiptUrl,
      receipt_file_name: cleanRecord.receiptFileName,
      status: cleanRecord.status,
      timestamp: cleanRecord.timestamp || Date.now(),
      created_at_formatted: cleanRecord.createdAt
    };

    await fetch(`${SUPABASE_URL}/rest/v1/rsvps`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
  } catch (err) {
    console.warn('[Supabase] Error saving RSVP:', err);
  }
}

export async function updateSupabaseRsvpStatus(id: string, status: 'Confirmado' | 'Pendente' | 'Presente'): Promise<RsvpRecord[]> {
  const current = getLocalRsvps();
  const updated = current.map(r => r.id === id ? { ...r, status } : r);
  localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(updated));

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rsvps?id=eq.${id}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify({ status })
    });
  } catch (err) {
    console.warn('[Supabase] Error updating RSVP status:', err);
  }

  return updated;
}

export async function deleteSupabaseRsvp(id: string): Promise<RsvpRecord[]> {
  const current = getLocalRsvps();
  const updated = current.filter(r => r.id !== id);
  localStorage.setItem(LOCAL_RSVPS_KEY, JSON.stringify(updated));

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rsvps?id=eq.${id}`, {
      method: 'DELETE',
      headers: HEADERS
    });
  } catch (err) {
    console.warn('[Supabase] Error deleting RSVP:', err);
  }

  return updated;
}

export function getLocalRsvps(): RsvpRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_RSVPS_KEY);
    if (!raw) return [];
    const list: RsvpRecord[] = JSON.parse(raw);
    const { cleaned } = cleanExpiredReceipts(list);
    return cleaned;
  } catch {
    return [];
  }
}

function cleanExpiredReceipts(records: RsvpRecord[]): { cleaned: RsvpRecord[]; hasChanges: boolean } {
  const now = Date.now();
  let hasChanges = false;

  const cleaned = records.map(record => {
    let createdTime = record.timestamp;
    if (!createdTime && record.id.startsWith('rsvp-')) {
      const parsed = parseInt(record.id.replace('rsvp-', ''), 10);
      if (!isNaN(parsed)) createdTime = parsed;
    }

    if (createdTime && (now - createdTime > ONE_WEEK_MS) && (record.receiptUrl || record.receiptFileName)) {
      hasChanges = true;
      return {
        ...record,
        receiptUrl: undefined,
        receiptFileName: undefined
      };
    }
    return record;
  });

  return { cleaned, hasChanges };
}

// ================================================================
// 4. DONATIONS API (Supabase PostgreSQL)
// ================================================================

export async function fetchSupabaseDonations(): Promise<DonationRecord[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/donations?select=*&order=created_at.desc`, {
      headers: HEADERS
    });

    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows)) {
        const mapped: DonationRecord[] = rows.map(r => ({
          id: r.id,
          donorName: r.donor_name || 'Doador Anônimo',
          email: r.email || '',
          hebrewName: r.hebrew_name || undefined,
          amount: Number(r.amount) || 0,
          purpose: r.purpose || r.category || 'Geral / Beit Chabad Curitiba',
          paymentMethod: r.payment_method || 'PIX',
          receiptUrl: r.receipt_url || undefined,
          status: r.status || 'Recebido',
          createdAt: r.created_at_formatted || r.created_at || new Date().toLocaleString('pt-BR')
        }));
        localStorage.setItem(LOCAL_DONATIONS_KEY, JSON.stringify(mapped));
        return mapped;
      }
    }
  } catch (err) {
    console.warn('[Supabase] Error fetching donations:', err);
  }

  return getLocalDonations();
}

export async function saveSupabaseDonation(donation: DonationRecord): Promise<void> {
  const current = getLocalDonations();
  const updated = [donation, ...current.filter(d => d.id !== donation.id)];
  localStorage.setItem(LOCAL_DONATIONS_KEY, JSON.stringify(updated));

  try {
    const row = {
      id: donation.id,
      donor_name: donation.donorName,
      email: donation.email,
      hebrew_name: donation.hebrewName,
      amount: donation.amount,
      purpose: donation.purpose,
      payment_method: donation.paymentMethod,
      receipt_url: donation.receiptUrl,
      status: donation.status,
      created_at_formatted: donation.createdAt
    };

    await fetch(`${SUPABASE_URL}/rest/v1/donations`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(row)
    });
  } catch (err) {
    console.warn('[Supabase] Error saving donation:', err);
  }
}

export async function deleteSupabaseDonation(id: string): Promise<DonationRecord[]> {
  const current = getLocalDonations();
  const updated = current.filter(d => d.id !== id);
  localStorage.setItem(LOCAL_DONATIONS_KEY, JSON.stringify(updated));

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/donations?id=eq.${id}`, {
      method: 'DELETE',
      headers: HEADERS
    });
  } catch (err) {
    console.warn('[Supabase] Error deleting donation:', err);
  }

  return updated;
}

export function getLocalDonations(): DonationRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_DONATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
