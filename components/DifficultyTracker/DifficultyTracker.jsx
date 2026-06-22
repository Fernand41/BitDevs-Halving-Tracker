'use client';
import { useDifficulty } from '../../hooks/useDifficulty';
import { formatNumber, deviationColor } from '../../utils/format';
import styles from './DifficultyTracker.module.css';

export default function DifficultyTracker() {
  const { data, loading, error, notifPerm, requestNotifPermission, refresh } = useDifficulty(60000);

  if (loading) return <div className={styles.card}>Chargement difficulté...</div>;
  if (error)   return <div className={styles.card}>Erreur : {error} <button onClick={refresh}>Réessayer</button></div>;
  if (!data)   return null;

  const epochProgress = (data.blocks_into_epoch / 2016) * 100;
  const devColor      = deviationColor(data.deviation_percent);
  const isFaster      = data.direction === 'faster';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Epoch #{data.epoch_number}</span>
        <h2>Ajustement de Difficulté</h2>
        <p className={styles.subtext}>Toutes les 2016 blocs (~2 semaines)</p>
      </div>

      {notifPerm !== 'granted' && (
        <div className={styles.notifBanner}>
          <span>🔔 Activez les notifications pour les alertes</span>
          <button onClick={requestNotifPermission}>Activer</button>
        </div>
      )}

      {data.alert_triggered && (
        <div className={`${styles.alert} ${isFaster ? styles.alertFast : styles.alertSlow}`}>
          {isFaster ? '🚀' : '🐢'} {data.message}
        </div>
      )}

      <div className={styles.gaugeWrap}>
        <div className={styles.gaugeLabel}>
          <span>Temps moyen par bloc</span>
          <span style={{ color: devColor, fontWeight: 700 }}>
            {data.avg_block_time_min} min
          </span>
        </div>
        <div className={styles.gaugeBar}>
          <div className={styles.gaugeTarget} />
          <div
            className={styles.gaugeFill}
            style={{
              width: `${Math.min(100, (data.avg_block_time_sec / 1200) * 100)}%`,
              background: devColor
            }}
          />
        </div>
        <div className={styles.gaugeScale}>
          <span>0 min</span>
          <span>10 min ← cible</span>
          <span>20 min</span>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Déviation</span>
          <span className={styles.statVal} style={{ color: devColor }}>
            {data.deviation_percent > 0 ? '+' : ''}{data.deviation_percent}%
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Ajustement prévu</span>
          <span className={styles.statVal} style={{ color: data.estimated_adjustment > 0 ? '#22c55e' : '#ef4444' }}>
            {data.estimated_adjustment > 0 ? '+' : ''}{data.estimated_adjustment}%
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Blocs dans l'epoch</span>
          <span className={styles.statVal}>{formatNumber(data.blocks_into_epoch)} / 2016</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Avant ajustement</span>
          <span className={styles.statVal}>{formatNumber(data.blocks_until_adjust)} blocs</span>
        </div>
      </div>

      <div className={styles.epochWrap}>
        <div className={styles.epochLabel}>
          <span>Progression epoch</span>
          <span>{epochProgress.toFixed(1)}%</span>
        </div>
        <div className={styles.epochBar}>
          <div className={styles.epochFill} style={{ width: `${epochProgress}%` }} />
        </div>
      </div>

      <div className={styles.explain}>
        <span className={styles.explainIcon}>{isFaster ? '📈' : '📉'}</span>
        <p>
          {isFaster
            ? `Les mineurs produisent des blocs plus vite que 10 min. La difficulté va augmenter d'environ ${Math.abs(data.estimated_adjustment).toFixed(1)}% au prochain epoch.`
            : `Les blocs sortent plus lentement que prévu. La difficulté va baisser d'environ ${Math.abs(data.estimated_adjustment).toFixed(1)}% pour revenir à 10 min/bloc.`
          }
        </p>
      </div>

      <div className={styles.footer}>
        Bloc actuel : <strong>{formatNumber(data.current_height)}</strong>
        &nbsp;· Seuil d'alerte : {data.alert_threshold}% de déviation
      </div>
    </div>
  );
}