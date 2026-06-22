'use client';
import { useState, useEffect } from 'react';
import { useHalving } from '../../hooks/useHalving';
import { secondsToCountdown, formatNumber, formatDate } from '../../utils/format';
import styles from './HalvingCountdown.module.css';

export default function HalvingCountdown() {
  const { data, loading, error, refresh } = useHalving(60000);
  const [countdown, setCountdown] = useState(null);
  const [elapsed, setElapsed]     = useState(0);

  useEffect(() => {
    if (!data) return;
    setElapsed(0);
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const remaining = Math.max(0, data.seconds_remaining - elapsed);
    setCountdown(secondsToCountdown(remaining));
  }, [elapsed, data]);

  if (loading) return <div className={styles.card}>Chargement...</div>;
  if (error)   return <div className={styles.card}>Erreur : {error} <button onClick={refresh}>Réessayer</button></div>;
  if (!data)   return null;

  const progress = ((210000 - data.blocks_remaining) / 210000) * 100;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Halving #{data.halving_number}</span>
        <h2>Prochain Halving Bitcoin</h2>
        <p className={styles.subtext}>Bloc cible : <strong>{formatNumber(data.next_halving_block)}</strong></p>
      </div>

      {countdown && (
        <div className={styles.countdown}>
          {[
            [countdown.days,    'jours'],
            [countdown.hours,   'heures'],
            [countdown.minutes, 'min'],
            [countdown.seconds, 'sec'],
          ].map(([val, label], i) => (
            <div key={label} className={styles.countdownGroup}>
              <div className={styles.unit}>
                <span className={styles.num}>
                  {String(val).padStart(i === 0 ? 3 : 2, '0')}
                </span>
                <span className={styles.label}>{label}</span>
              </div>
              {i < 3 && <span className={styles.sep}>:</span>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.progressLabels}>
          <span>Bloc {formatNumber(data.current_height)}</span>
          <span>{progress.toFixed(2)}%</span>
          <span>Bloc {formatNumber(data.next_halving_block)}</span>
        </div>
      </div>

      <div className={styles.infos}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Blocs restants</span>
          <span className={styles.infoVal}>{formatNumber(data.blocks_remaining)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Date estimée</span>
          <span className={styles.infoVal}>{formatDate(data.estimated_date)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Date théorique</span>
          <span className={`${styles.infoVal} ${styles.muted}`}>{formatDate(data.theoretical_date)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Récompense actuelle</span>
          <span className={styles.infoVal}>{data.current_reward_btc} BTC</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Après halving</span>
          <span className={`${styles.infoVal} ${styles.orange}`}>{data.next_reward_btc} BTC</span>
        </div>
      </div>

      <div className={`${styles.timing} ${styles[data.early_or_late]}`}>
        {data.early_or_late === 'early'
          ? `⚡ Halving précoce — ${data.diff_days} jours avant la date théorique`
          : `🐢 Halving tardif — ${data.diff_days} jours après la date théorique`}
      </div>

      <div className={styles.footer}>
        Temps moyen : <strong>{(data.avg_block_time_sec / 60).toFixed(1)} min/bloc</strong>
        &nbsp;· Mise à jour toutes les 60s
      </div>
    </div>
  );
}