import { CommunityEvent } from '../types';
import { COMMUNITY_EVENTS as DEFAULT_EVENTS } from '../data/mockData';
import { 
  fetchRemoteEvents, pushEventToCloud, deleteEventFromCloud, getLocalEvents 
} from './cloudSync';

export { fetchRemoteEvents };

export function getCommunityEvents(): CommunityEvent[] {
  return getLocalEvents();
}

export type NewCommunityEventInput = Partial<CommunityEvent> & {
  title: string;
  date: string;
  time: string;
};

export function saveCommunityEvent(newEvent: NewCommunityEventInput): CommunityEvent {
  const created: CommunityEvent = {
    id: 'evt-' + Date.now(),
    title: newEvent.title,
    subtitle: newEvent.subtitle || 'Evento Comunitário Beit Chabad',
    category: newEvent.category || 'Festa & Chag',
    date: newEvent.date,
    time: newEvent.time,
    location: newEvent.location || 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)',
    price: newEvent.price ?? 0,
    memberPrice: newEvent.memberPrice,
    youthPrice: newEvent.youthPrice,
    childPrice: newEvent.childPrice,
    hasMealOptions: newEvent.hasMealOptions,
    meals: newEvent.meals,
    mealOptions: newEvent.mealOptions,
    lunchCount: newEvent.lunchCount,
    dinnerCount: newEvent.dinnerCount,
    lunchPrice: newEvent.lunchPrice,
    lunchMemberPrice: newEvent.lunchMemberPrice,
    lunchYouthPrice: newEvent.lunchYouthPrice,
    lunchChildPrice: newEvent.lunchChildPrice,
    dinnerPrice: newEvent.dinnerPrice,
    dinnerMemberPrice: newEvent.dinnerMemberPrice,
    dinnerYouthPrice: newEvent.dinnerYouthPrice,
    dinnerChildPrice: newEvent.dinnerChildPrice,
    description: newEvent.description || newEvent.subtitle || newEvent.title,
    highlights: newEvent.highlights || ['Aberto a toda a comunidade', 'Atmosfera calorosa e tradicional', 'Inscrições via PIX'],
    image: newEvent.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
    featured: newEvent.featured ?? true,
    registrationOpen: newEvent.registrationOpen ?? true
  };

  // Push to cloud and local cache
  pushEventToCloud(created).catch(e => console.warn('Cloud event push error:', e));
  return created;
}

export function updateCommunityEvent(id: string, updatedFields: Partial<CommunityEvent>): CommunityEvent {
  const current = getLocalEvents();
  const existing = current.find(e => e.id === id);

  const merged: CommunityEvent = {
    id,
    title: updatedFields.title ?? existing?.title ?? '',
    subtitle: updatedFields.subtitle ?? existing?.subtitle ?? '',
    category: updatedFields.category ?? existing?.category ?? 'Festa & Chag',
    date: updatedFields.date ?? existing?.date ?? '',
    time: updatedFields.time ?? existing?.time ?? '',
    location: updatedFields.location ?? existing?.location ?? 'Beit Chabad Curitiba - Rua Alferes Ângelo Sampaio, 370 (Água Verde)',
    price: updatedFields.price ?? existing?.price ?? 0,
    memberPrice: 'memberPrice' in updatedFields ? updatedFields.memberPrice : existing?.memberPrice,
    youthPrice: 'youthPrice' in updatedFields ? updatedFields.youthPrice : existing?.youthPrice,
    childPrice: 'childPrice' in updatedFields ? updatedFields.childPrice : existing?.childPrice,
    hasMealOptions: 'hasMealOptions' in updatedFields ? updatedFields.hasMealOptions : existing?.hasMealOptions,
    meals: 'meals' in updatedFields ? updatedFields.meals : existing?.meals,
    mealOptions: 'mealOptions' in updatedFields ? updatedFields.mealOptions : existing?.mealOptions,
    lunchCount: 'lunchCount' in updatedFields ? updatedFields.lunchCount : existing?.lunchCount,
    dinnerCount: 'dinnerCount' in updatedFields ? updatedFields.dinnerCount : existing?.dinnerCount,
    lunchPrice: 'lunchPrice' in updatedFields ? updatedFields.lunchPrice : existing?.lunchPrice,
    lunchMemberPrice: 'lunchMemberPrice' in updatedFields ? updatedFields.lunchMemberPrice : existing?.lunchMemberPrice,
    lunchYouthPrice: 'lunchYouthPrice' in updatedFields ? updatedFields.lunchYouthPrice : existing?.lunchYouthPrice,
    lunchChildPrice: 'lunchChildPrice' in updatedFields ? updatedFields.lunchChildPrice : existing?.lunchChildPrice,
    dinnerPrice: 'dinnerPrice' in updatedFields ? updatedFields.dinnerPrice : existing?.dinnerPrice,
    dinnerMemberPrice: 'dinnerMemberPrice' in updatedFields ? updatedFields.dinnerMemberPrice : existing?.dinnerMemberPrice,
    dinnerYouthPrice: 'dinnerYouthPrice' in updatedFields ? updatedFields.dinnerYouthPrice : existing?.dinnerYouthPrice,
    dinnerChildPrice: 'dinnerChildPrice' in updatedFields ? updatedFields.dinnerChildPrice : existing?.dinnerChildPrice,
    description: updatedFields.description ?? existing?.description ?? '',
    highlights: updatedFields.highlights ?? existing?.highlights ?? ['Aberto a toda a comunidade', 'Atmosfera calorosa e tradicional', 'Inscrições via PIX'],
    image: updatedFields.image ?? existing?.image ?? 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1000',
    featured: updatedFields.featured ?? existing?.featured ?? true,
    registrationOpen: updatedFields.registrationOpen ?? existing?.registrationOpen ?? true
  };

  // Push to cloud and local cache
  pushEventToCloud(merged).catch(e => console.warn('Cloud event update error:', e));
  return merged;
}

export function deleteCommunityEvent(id: string): CommunityEvent[] {
  deleteEventFromCloud(id).catch(e => console.warn('Cloud event delete error:', e));
  const current = getLocalEvents();
  return current.filter(e => e.id !== id);
}
