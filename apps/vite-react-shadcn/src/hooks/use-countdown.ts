import { useEffect, useState } from 'react';

type DateInput = Date | string | number | null | undefined;

const toMs = (value: DateInput): number | null => {
  if (value === null || value === undefined || value === '') return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
};

const pad = (n: number) => String(n).padStart(2, '0');

function useCountdown(
  target: DateInput,
  { onExpire }: { onExpire?: () => void } = {}
) {
  const targetMs = toMs(target);

  const [remaining, setRemaining] = useState(() =>
    targetMs === null ? 0 : Math.max(0, targetMs - Date.now())
  );

  useEffect(() => {
    if (targetMs === null) {
      setRemaining(0);
      return;
    }

    const tick = () => {
      const next = Math.max(0, targetMs - Date.now());
      setRemaining(next);
      return next;
    };

    if (tick() === 0) return;

    const id = setInterval(() => {
      if (tick() === 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [targetMs, onExpire]);

  const totalSeconds = Math.ceil(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    remaining,
    hours,
    minutes,
    seconds,
    isExpired: remaining === 0,
    formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    formattedShort:
      hours > 0
        ? `${hours}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`,
  };
}

export { useCountdown };
