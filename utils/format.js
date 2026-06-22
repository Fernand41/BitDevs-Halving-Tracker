export function secondsToCountdown(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  return {
    days:    Math.floor(s / 86400),
    hours:   Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function formatNumber(n) {
  return Number(n).toLocaleString('fr-FR');
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function deviationColor(percent) {
  const abs = Math.abs(percent);
  if (abs < 5)  return '#22c55e';
  if (abs < 10) return '#f59e0b';
  return '#ef4444';
}