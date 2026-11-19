'use client';

import { useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabaseClient';

export default function VisitorTracker() {
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // Generate or retrieve persistent visitor tab session ID
    let visitorId = '';
    try {
      visitorId = sessionStorage.getItem('rz_visitor_id') || '';
      if (!visitorId) {
        visitorId = 'vis_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
        sessionStorage.setItem('rz_visitor_id', visitorId);
      }
    } catch {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 11);
    }

    const channel = supabase.channel('rezoni-live-presence', {
      config: {
        presence: {
          key: visitorId,
        },
      },
    });

    let isSubscribed = false;

    const trackPresence = async () => {
      if (!isSubscribed) return;
      try {
        await channel.track({
          page: window.location.pathname,
          onlineAt: Date.now(),
        });
      } catch (err) {
        // Silently swallow network hiccups
      }
    };

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        isSubscribed = true;
        await trackPresence();
      }
    });

    // Handle tab visibility (when user minimizes or switches tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await trackPresence();
      } else {
        try {
          await channel.untrack();
        } catch {}
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      try {
        channel.untrack().catch(() => {});
        channel.unsubscribe();
      } catch {}
    };
  }, []);

  return null;
}
