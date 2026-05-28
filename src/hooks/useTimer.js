import { useEffect, useState } from 'react';

export function useTimer(startedAt, finishedAt) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!startedAt || finishedAt) return;
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, [startedAt, finishedAt]);
  if (!startedAt) return 0;
  const end = finishedAt || now;
  return Math.max(0, end - startedAt);
}

export function formatTime(ms, includeCs = false) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  const cs = Math.floor((ms % 1000) / 10);
  const base = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return includeCs ? `${base}.${String(cs).padStart(2, '0')}` : base;
}
