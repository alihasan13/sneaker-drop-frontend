import React, { useEffect, useState, useCallback } from 'react';

interface ReservationTimerProps {
  expiresAt: string;
  onExpire: () => void;
}

export const ReservationTimer: React.FC<ReservationTimerProps> = ({ expiresAt, onExpire }) => {
  const getRemaining = useCallback(() => {
    const ms = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.floor(ms / 1000));
  }, [expiresAt]);

  const [seconds, setSeconds] = useState(getRemaining);

  useEffect(() => {
    const tick = () => {
      const remaining = getRemaining();
      setSeconds(remaining);
      if (remaining === 0) onExpire();
    };

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [getRemaining, onExpire]);

  const isUrgent = seconds <= 15;
  const pct = Math.min(100, (seconds / 60) * 100);

  return (
    <div aria-live="polite" aria-label={`Reservation expires in ${seconds} seconds`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-400">Reservation expires in</span>
        <span className={`text-2xl font-mono font-bold tabular-nums transition-colors ${isUrgent ? 'text-red-400 animate-pulse-fast' : 'text-white'}`}>
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={seconds} aria-valuemax={60}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isUrgent ? 'bg-red-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
