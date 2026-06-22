'use client';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell
} from 'recharts';
import { useDifficultyHistory } from '../../hooks/useDifficultyHistory';
import styles from './DifficultyHistoryChart.module.css';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0].value;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{label}</p>
      <p className={styles.tooltipVal} style={{ color: value >= 0 ? '#22c55e' : '#ef4444' }}>
        {value >= 0 ? '+' : ''}{value}%
      </p>
    </div>
  );
}

export default function DifficultyHistoryChart() {
  const { data, loading, error, refresh } = useDifficultyHistory();

  if (loading) return <div className={styles.card}>Chargement historique...</div>;
  if (error)   return <div className={styles.card}>Erreur : {error} <button onClick={refresh}>Réessayer</button></div>;
  if (!data || data.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.badge}>Historique</span>
        <h2>Évolution des Ajustements de Difficulté</h2>
        <p className={styles.subtext}>
          {data.length} derniers epochs (~{(data.length * 2016 / 144).toFixed(0)} jours)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={{ stroke: '#1f2937' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f293780' }} />
          <ReferenceLine y={0} stroke="#374151" />
          <Bar dataKey="adjustment" radius={[4, 4, 4, 4]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.adjustment >= 0 ? '#22c55e' : '#ef4444'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotGreen}`} />
          Difficulté augmentée (blocs rapides)
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          Difficulté baissée (blocs lents)
        </span>
      </div>

      <div className={styles.footer}>
        Chaque barre = un epoch de 2016 blocs · Données mempool.space
      </div>
    </div>
  );
}