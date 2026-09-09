/**
 * Form Dispatch & Data Management Helper for Beit Chabad Curitiba
 * - General forms route automatically via HTTP POST to chabad@chabadcuritiba.com
 * - Event RSVPs / Inscrições route to mendys@gmail.com (with CC to chabad@chabadcuritiba.com)
 * - Local persistence for Administrator Dashboard
 */

export const CHABAD_OFFICIAL_EMAIL = 'chabad@chabadcuritiba.com';
export const RSVP_ADMIN_EMAIL = 'mendys@gmail.com';

export interface EmailPayload {
  subject: string;
  fields: Record<string, string | number | boolean | undefined>;
  toEmail?: string;
  ccEmail?: string;
}

export interface RsvpRecord {
  id: string;
  ticketCode: string;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  ticketCount: number;
  ticketType: string;
  selectedMeals?: string[]; // e.g. ['Almoço', 'Jantar']
  totalPrice: number;
  dietaryNotes?: string;
  paymentMethod: string;
  payerName?: string;
  payerBank?: string;
  receiptUrl?: string;
  receiptFileName?: string;
  status: 'Confirmado' | 'Pendente' | 'Presente';
  createdAt: string;
  timestamp?: number;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  hebrewName?: string;
  amount: number;
  purpose: string;
  paymentMethod: string;
  receiptUrl?: string;
  status: 'Recebido' | 'Pendente';
  createdAt: string;
}

export async function submitToChabadEmail({ 
  subject, 
  fields, 
  toEmail = CHABAD_OFFICIAL_EMAIL, 
  ccEmail 
}: EmailPayload): Promise<{ success: boolean; message?: string }> {
  const cleanFields: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== '') {
      cleanFields[key] = value;
    }
  }

  const payload: Record<string, any> = {
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    'Portal': 'https://chabadcuritiba.web.app',
    'Data e Hora': new Date().toLocaleString('pt-BR'),
    ...cleanFields
  };

  if (ccEmail) {
    payload._cc = ccEmail;
  } else if (toEmail === RSVP_ADMIN_EMAIL) {
    payload._cc = CHABAD_OFFICIAL_EMAIL;
  }

  // Dual Dispatch: 1. FormSubmit AJAX + 2. Web3Forms Public Gateway
  try {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(err => console.warn('[FormSubmit] Background send notice:', err));

    // Also dispatch to Web3Forms backup endpoint if available
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: 'e9be88a1-c692-4ce0-a8d1-7a6e1150cf71',
        from_name: 'Beit Chabad Curitiba Portal',
        subject: subject,
        to_email: toEmail,
        ...payload
      }),
      keepalive: true
    }).catch(err => console.warn('[Web3Forms] Notice:', err));

    return { success: true };
  } catch (error) {
    console.error('[FormSubmit] Error dispatching email:', error);
    return { success: true };
  }
}

export function submitRsvpEmail(payload: {
  eventTitle: string;
  ticketCode: string;
  fullName: string;
  email: string;
  phone: string;
  ticketCount: number;
  ticketType: string;
  selectedMeals?: string[];
  totalPrice: number;
  dietaryNotes?: string;
  receiptUploaded?: boolean;
}) {
  const mealStr = payload.selectedMeals && payload.selectedMeals.length > 0 
    ? payload.selectedMeals.join(', ') 
    : undefined;

  return submitToChabadEmail({
    toEmail: RSVP_ADMIN_EMAIL,
    ccEmail: CHABAD_OFFICIAL_EMAIL,
    subject: `[RSVP Inscrição - ${payload.eventTitle}] ${payload.fullName} (Voucher #${payload.ticketCode})`,
    fields: {
      'Evento': payload.eventTitle,
      'Código do Voucher': `#${payload.ticketCode}`,
      'Nome do Inscrito': payload.fullName,
      'E-mail': payload.email,
      'WhatsApp / Telefone': payload.phone,
      'Quantidade de Ingressos': payload.ticketCount,
      'Tipo de Ingresso': payload.ticketType,
      'Refeições Escolhidas': mealStr || 'Não aplicável / Geral',
      'Valor Total PIX': `R$ ${payload.totalPrice.toFixed(2)}`,
      'Comprovante Anexado': payload.receiptUploaded ? 'Sim (Disponível no Painel Admin por 7 dias)' : 'Não anexado',
      'Restrições Alimentares / Observações': payload.dietaryNotes || 'Nenhuma',
      'Status': payload.totalPrice === 0 ? 'Gratuito (Confirmado)' : 'Pendente de Conferência Bancária (kitov@chabadcuritiba.com)'
    }
  });
}

// STORAGE HELPERS WITH CLOUD SYNC FOR CROSS-DEVICE PERSISTENCE
import { 
  fetchRemoteRsvps, pushRsvpToCloud, deleteRsvpFromCloud, updateRsvpStatusInCloud, getLocalRsvps,
  fetchRemoteDonations, pushDonationToCloud, deleteDonationFromCloud, getLocalDonations 
} from './cloudSync';

export { fetchRemoteRsvps, fetchRemoteDonations };

export function getRsvpRecords(): RsvpRecord[] {
  return getLocalRsvps();
}

export function saveRsvpRecord(record: Omit<RsvpRecord, 'id' | 'createdAt' | 'status'> & { status?: 'Confirmado' | 'Pendente' | 'Presente' }): RsvpRecord {
  const newRecord: RsvpRecord = {
    ...record,
    id: 'rsvp-' + Date.now(),
    timestamp: Date.now(),
    status: record.status || (record.totalPrice === 0 ? 'Confirmado' : 'Pendente'),
    createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  
  // Push to cloud and local storage
  pushRsvpToCloud(newRecord).catch(e => console.warn('Cloud sync background error:', e));
  return newRecord;
}

export function deleteRsvpRecord(id: string): RsvpRecord[] {
  deleteRsvpFromCloud(id).catch(e => console.warn('Cloud delete error:', e));
  const list = getLocalRsvps().filter(item => item.id !== id);
  return list;
}

export function clearAllRsvps(): RsvpRecord[] {
  const list = getLocalRsvps();
  list.forEach(item => deleteRsvpFromCloud(item.id));
  localStorage.setItem('chabad_curitiba_rsvps_v2', JSON.stringify([]));
  return [];
}

export function updateRsvpStatus(id: string, status: 'Confirmado' | 'Pendente' | 'Presente'): RsvpRecord[] {
  updateRsvpStatusInCloud(id, status).catch(e => console.warn('Cloud status update error:', e));
  const list = getLocalRsvps().map(item => item.id === id ? { ...item, status } : item);
  return list;
}

export function getDonationRecords(): DonationRecord[] {
  return getLocalDonations();
}

export function saveDonationRecord(record: Omit<DonationRecord, 'id' | 'createdAt' | 'status'>): DonationRecord {
  const newRecord: DonationRecord = {
    ...record,
    id: 'don-' + Date.now(),
    status: 'Recebido',
    createdAt: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  
  // Push to cloud and local storage
  pushDonationToCloud(newRecord).catch((e: any) => console.warn('Cloud donation push error:', e));
  return newRecord;
}

export function deleteDonationRecord(id: string): DonationRecord[] {
  deleteDonationFromCloud(id).catch((e: any) => console.warn('Cloud delete donation error:', e));
  const list = getLocalDonations().filter(item => item.id !== id);
  return list;
}

export function clearAllDonations(): DonationRecord[] {
  const list = getLocalDonations();
  list.forEach(item => deleteDonationFromCloud(item.id));
  localStorage.setItem('chabad_curitiba_donations_v2', JSON.stringify([]));
  return [];
}
