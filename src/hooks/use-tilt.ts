"use client";

import { useEffect, useCallback, useRef } from 'react';

const TILT_DOWN_THRESHOLD = 40; // Tilt down (towards player)
const TILT_UP_THRESHOLD = -30; // Tilt up (away from player)
const NEUTRAL_ZONE_THRESHOLD = 15; // To reset state

type TiltState = 'neutral' | 'tilted_up' | 'tilted_down';

export function useTilt(onUp: () => void, onDown: () => void, enabled: boolean) {
  const tiltStateRef = useRef<TiltState>('neutral');

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    const beta = event.beta;
    if (beta === null) return;

    const currentState = tiltStateRef.current;

    if (currentState === 'neutral') {
      if (beta > TILT_DOWN_THRESHOLD) {
        tiltStateRef.current = 'tilted_down';
        onDown();
      } else if (beta < TILT_UP_THRESHOLD) {
        tiltStateRef.current = 'tilted_up';
        onUp();
      }
    } else {
      // Must return to neutral zone before another tilt can be registered
      if (Math.abs(beta) < NEUTRAL_ZONE_THRESHOLD) {
        tiltStateRef.current = 'neutral';
      }
    }
  }, [onUp, onDown]);

  useEffect(() => {
    if (!enabled) {
      tiltStateRef.current = 'neutral';
      return;
    }

    // iOS 13+ requires explicit permission for device orientation events
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // This function is meant to be called by a user gesture.
      // We rely on the game's "Start" button to trigger this.
      // We add the listener here, assuming permission will be granted.
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      // For other devices, add listener directly
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [enabled, handleOrientation]);
}
