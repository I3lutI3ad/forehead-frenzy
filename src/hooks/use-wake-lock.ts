
'use client';

import { useEffect, useRef } from 'react';

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled) {
      // Release the wake lock if it's active and the component is no longer enabled
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      return;
    }
    
    if (!('wakeLock' in navigator)) {
        console.warn('Screen Wake Lock API not supported');
        return;
    }
    
    let isReleased = false;

    const requestWakeLock = async () => {
      // Don't request if it's already active or has been released by the component
      if (wakeLockRef.current || isReleased) return;

      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        
        wakeLockRef.current.addEventListener('release', () => {
          // Check if release was intentional (from component unmount/disable)
          if (!isReleased) {
            // If not, it was released by the system, so we nullify the ref
            // but don't set isReleased, allowing re-acquisition on visibility change.
            wakeLockRef.current = null;
          }
        });

      } catch (err: any) {
        console.error(`Screen Wake Lock failed: ${err.name}, ${err.message}`);
      }
    };

    requestWakeLock();
    
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            requestWakeLock();
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isReleased = true;
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);
}
