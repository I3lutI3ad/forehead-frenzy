"use client";

import { useEffect, useCallback, useRef } from 'react';

// For landscape mode, gamma is the relevant value.
// A positive gamma means tilting down (towards player's chest, "correct").
// A negative gamma means tilting up (away from player's chest, "skip").
const TILT_DOWN_THRESHOLD = 25;  // Tilt down (Correct)
const TILT_UP_THRESHOLD = -25; // Tilt up (Skip)
const NEUTRAL_ZONE_THRESHOLD = 10; // To reset state

type TiltState = 'neutral' | 'tilted_up' | 'tilted_down';

export function useTilt(onUp: () => void, onDown: () => void, enabled: boolean) {
  const tiltStateRef = useRef<TiltState>('neutral');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    // In landscape mode, the 'gamma' value corresponds to the front-to-back tilt.
    const gamma = event.gamma;
    if (gamma === null) return;

    const currentState = tiltStateRef.current;

    if (currentState === 'neutral') {
      if (gamma > TILT_DOWN_THRESHOLD) {
        tiltStateRef.current = 'tilted_down';
        onDown();
      } else if (gamma < TILT_UP_THRESHOLD) {
        tiltStateRef.current = 'tilted_up';
        onUp();
      }
    } else {
      // Must return to neutral zone before another tilt can be registered
      if (Math.abs(gamma) < NEUTRAL_ZONE_THRESHOLD) {
        tiltStateRef.current = 'neutral';
      }
    }
  }, [onUp, onDown]);

  useEffect(() => {
    if (!enabled) {
      tiltStateRef.current = 'neutral';
      return;
    }
    
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled, handleOrientation]);
}
