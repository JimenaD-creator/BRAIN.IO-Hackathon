// hooks/useHeadGesture.ts (versión simplificada)
import { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useHeadGesture() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastGesture, setLastGesture] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    let lastX = 0;
    let gestureCooldown = false;

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (gestureCooldown) return;

      const deltaX = x - lastX;
      lastX = x;

      // Umbral para detectar movimiento significativo
      if (Math.abs(deltaX) > 0.8) {
        const detectedGesture = deltaX > 0 ? 'right' : 'left';
        setLastGesture(detectedGesture);
        
        // Cooldown para evitar detecciones múltiples
        gestureCooldown = true;
        setTimeout(() => {
          gestureCooldown = false;
          setLastGesture(null);
        }, 1000);
      }
    });

    Accelerometer.setUpdateInterval(100);

    return () => subscription.remove();
  }, [isEnabled]);

  return {
    headGesture: lastGesture,
    isEnabled,
    enableGestureControl: () => setIsEnabled(true),
    disableGestureControl: () => {
      setIsEnabled(false);
      setLastGesture(null);
    },
  };
}