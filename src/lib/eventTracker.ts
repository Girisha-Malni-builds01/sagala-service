// First-Party Event Tracker (Section 6)
// Zero personal data, anonymous session_id in localStorage, 30s rate-limiting
import { EventType, AnalyticsEvent } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const SESSION_KEY = 'sagala_anonymous_session_id';
const RATE_LIMIT_WINDOW_MS = 30 * 1000; // 30 seconds duplicate guard

// In-memory rate-limit cache: "eventType:targetId" -> timestamp
const lastEventMap: Map<string, number> = new Map();

export function getAnonymousSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sgl_sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export interface TrackEventPayload {
  eventType: EventType;
  offerId?: string;
  shopId?: string;
  productId?: string;
  metadata?: Record<string, any>;
}

export async function trackEvent(payload: TrackEventPayload): Promise<AnalyticsEvent | null> {
  const sessionId = getAnonymousSessionId();
  const targetKey = `${payload.eventType}:${payload.offerId || payload.shopId || payload.productId || 'global'}`;
  const now = Date.now();

  // Rate-limit check: same session + type + target within 30 seconds
  const lastTime = lastEventMap.get(targetKey);
  if (lastTime && now - lastTime < RATE_LIMIT_WINDOW_MS) {
    // Suppress duplicate spam
    return null;
  }
  lastEventMap.set(targetKey, now);

  const event: AnalyticsEvent = {
    id: 'ev_' + Math.random().toString(36).substring(2, 9),
    event_type: payload.eventType,
    offer_id: payload.offerId,
    shop_id: payload.shopId,
    product_id: payload.productId,
    session_id: sessionId,
    metadata: payload.metadata,
    created_at: new Date().toISOString()
  };

  // If Supabase is configured, record in PostgreSQL
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('events').insert({
        event_type: event.event_type,
        offer_id: event.offer_id,
        shop_id: event.shop_id,
        product_id: event.product_id,
        session_id: event.session_id,
        metadata: event.metadata
      });
    } catch (err) {
      console.warn('Could not sync event to Supabase, continuing locally:', err);
    }
  }

  // Also notify window for AppContext local state updates
  window.dispatchEvent(new CustomEvent('sagala_event_tracked', { detail: event }));

  return event;
}
