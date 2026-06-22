'use client';
import { useState, useEffect, useRef } from 'react';

export function useDifficulty(refreshInterval = 60000) {
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [notifPerm, setNotifPerm] = useState('default');
  const lastAlertRef              = useRef(null);

  useEffect(() => {
    setNotifPerm(Notification.permission);
  }, []);

  async function requestNotifPermission() {
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    return perm;
  }

  function sendNotification(title, body) {
    if (Notification.permission !== 'granted') return;
    const now = Date.now();
    if (lastAlertRef.current && now - lastAlertRef.current < 600000) return;
    lastAlertRef.current = now;
    new Notification(title, { body });
  }

  async function load() {
    try {
      setError(null);
      const res    = await fetch('/api/difficulty');
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setData(result);

      if (result.alert_triggered) {
        const direction = result.direction === 'faster'
          ? '🚀 Blocs plus rapides que prévu'
          : '🐢 Blocs plus lents que prévu';
        sendNotification(
          '⚡ Alerte difficulté Bitcoin',
          `${direction} (${result.avg_block_time_min} min/bloc)`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error, notifPerm, requestNotifPermission, refresh: load };
}