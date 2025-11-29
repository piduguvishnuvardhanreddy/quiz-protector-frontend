import { useEffect, useRef, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

// Simple countdown timer in seconds; calls onExpire when reaches 0
export default function Timer({ totalSeconds, onExpire }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          onExpire?.();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [onExpire]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  
  // Warning colors based on remaining time
  const isUrgent = seconds <= 60; // Last minute
  const isWarning = seconds <= 300; // Last 5 minutes
  
  const colorClass = isUrgent 
    ? 'text-red-600 bg-red-50 border-red-300 animate-pulse' 
    : isWarning 
    ? 'text-orange-600 bg-orange-50 border-orange-300' 
    : 'text-indigo-600 bg-indigo-50 border-indigo-300';

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${colorClass} transition-all`}>
      <ClockIcon className="h-5 w-5" />
      <span className="font-mono text-xl font-bold">{mm}:{ss}</span>
      <span className="text-xs font-medium">remaining</span>
    </div>
  );
}
