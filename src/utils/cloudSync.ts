/**
 * Global Cross-Device Cloud Synchronization for Beit Chabad Curitiba
 * Powered by Supabase Cloud Database & Storage with automatic offline fallback.
 */

import { RsvpRecord, DonationRecord } from './formSubmit';
import { CommunityEvent } from '../types';
import {
  fetchSupabaseEvents,
  saveSupabaseEvent,
  deleteSupabaseEvent,
  getLocalEvents,
  fetchSupabaseRsvps,
  saveSupabaseRsvp,
  updateSupabaseRsvpStatus,
  deleteSupabaseRsvp,
  getLocalRsvps,
  fetchSupabaseDonations,
  saveSupabaseDonation,
  deleteSupabaseDonation,
  getLocalDonations,
  uploadToSupabaseStorage
} from './supabaseClient';

export {
  // Storage upload helper
  uploadToSupabaseStorage,
  // Events
  fetchSupabaseEvents as fetchRemoteEvents,
  saveSupabaseEvent as pushEventToCloud,
  deleteSupabaseEvent as deleteEventFromCloud,
  getLocalEvents,
  // RSVPs
  fetchSupabaseRsvps as fetchRemoteRsvps,
  saveSupabaseRsvp as pushRsvpToCloud,
  updateSupabaseRsvpStatus as updateRsvpStatusInCloud,
  deleteSupabaseRsvp as deleteRsvpFromCloud,
  getLocalRsvps,
  // Donations
  fetchSupabaseDonations as fetchRemoteDonations,
  saveSupabaseDonation as pushDonationToCloud,
  deleteSupabaseDonation as deleteDonationFromCloud,
  getLocalDonations
};
