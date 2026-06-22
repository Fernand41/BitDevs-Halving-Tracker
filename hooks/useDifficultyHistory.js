'use client';
import { useState, useEffect } from 'react';

export function useDifficultyHistory() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  async function load() {
    try {
      setError(null);
      const res    = await fetch('/api/difficulty-history');
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setData(result.history);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 600000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refresh: load };
}