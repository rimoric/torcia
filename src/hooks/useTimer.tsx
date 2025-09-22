// useTimer.tsx - Timer Management Hook
import { useState, useRef } from 'react';

export function useTimer() {
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<number | null>(null);

  const startTimer = (seconds: number) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setTimer(seconds);
    timerRef.current = window.setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          if (timerRef.current) { 
            window.clearInterval(timerRef.current); 
            timerRef.current = null; 
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
  };

  return { timer, startTimer, stopTimer };
}
