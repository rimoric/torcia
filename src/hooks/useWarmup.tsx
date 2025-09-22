// useWarmup.tsx - Warmup Management Hook
import { useState, useRef } from 'react';

export function useWarmup() {
  const [warmup, setWarmup] = useState(0);
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const warmRef = useRef<number | null>(null);

  const startWarmup = (duration: number = 10, onComplete?: () => void) => {
    if (warmRef.current) window.clearInterval(warmRef.current);
    
    setWarmup(duration);
    setIsWarmingUp(true);
    
    warmRef.current = window.setInterval(() => {
      setWarmup((t) => {
        if (t <= 1) {
          if (warmRef.current) { 
            window.clearInterval(warmRef.current); 
            warmRef.current = null; 
          }
          setIsWarmingUp(false);
          onComplete?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stopWarmup = () => {
    if (warmRef.current) {
      window.clearInterval(warmRef.current);
      warmRef.current = null;
    }
    setWarmup(0);
    setIsWarmingUp(false);
  };

  const getWarmupProgress = (totalDuration: number) => {
    return totalDuration > 0 ? ((totalDuration - warmup) / totalDuration) * 100 : 0;
  };

  return { 
    warmup, 
    isWarmingUp, 
    startWarmup, 
    stopWarmup, 
    getWarmupProgress 
  };
}
