'use client';
import { useState, useEffect } from 'react';

export function useHalving(refreshInterval = 60000) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  async function load() {
    try {
      setError(null);
      const res    = await fetch('/api/halving');
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setData(result);
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

  return { data, loading, error, refresh: load };
}