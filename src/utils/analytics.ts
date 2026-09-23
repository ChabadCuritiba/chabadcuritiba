/**
 * Google Analytics & Firebase Analytics Integration for Beit Chabad Curitiba
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  projectId: "chabadcuritiba",
  appId: "1:943793109445:web:bde4d5bc46c0ce9c9a33ac",
  storageBucket: "chabadcuritiba.firebasestorage.app",
  apiKey: "AIzaSyAhMuU1SRxAk7KmuRZTb2wJNQrF9uSHYP4",
  authDomain: "chabadcuritiba.firebaseapp.com",
  messagingSenderId: "943793109445"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let analyticsInstance: Analytics | null = null;

// Initialize Firebase Google Analytics SDK
export async function initAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') return null;
  if (analyticsInstance) return analyticsInstance;

  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch (err) {
    console.warn('[Analytics] Google Analytics init note:', err);
  }
  return null;
}

// Automatically init in browser
if (typeof window !== 'undefined') {
  initAnalytics().catch(() => {});
}

/**
 * Log custom analytics event
 */
export function trackEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  // 1. Firebase Analytics SDK
  if (analyticsInstance) {
    try {
      logEvent(analyticsInstance, eventName, params);
    } catch (e) {}
  }

  // 2. Global gtag.js fallback if present
  if ((window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, params);
    } catch (e) {}
  }
}

/**
 * Track Page Views
 */
export function trackPageView(pageName: string): void {
  trackEvent('page_view', {
    page_title: pageName,
    page_path: window.location.hash || '/#' + pageName,
    page_location: window.location.href
  });
}
