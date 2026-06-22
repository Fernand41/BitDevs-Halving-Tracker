import './globals.css';

export const metadata = {
  title: 'BitDevs Halving Tracker',
  description: 'Suivi du Halving & Difficulté Bitcoin en temps réel — BitDevs Cotonou',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}