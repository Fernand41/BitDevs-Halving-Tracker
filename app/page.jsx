import HalvingCountdown from '../components/HalvingCountdown/HalvingCountdown';
import DifficultyTracker from '../components/DifficultyTracker/DifficultyTracker';
import DifficultyHistoryChart from '../components/DifficultyTracker/DifficultyHistoryChart';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <h1>BitDevs Cotonou</h1>
          <p>Halving Tracker & Difficulty Monitor</p>
        </div>
        <div className={styles.network}>
          <span className={styles.dot} />
          Mainnet
        </div>
      </header>

      <main className={styles.grid}>
        <HalvingCountdown />
        <DifficultyTracker />
        <DifficultyHistoryChart />
      </main>

    <footer className={styles.footer}>
  Données : <a href="https://mempool.space" target="_blank" rel="noreferrer">mempool.space</a>
  &nbsp;· BitDevs Cotonou 🇧🇯
  &nbsp;· Produit par{' '}
  <a href="https://github.com/Fernand41" target="_blank" rel="noreferrer">Fernand</a>
</footer>
    </div>
  );
}