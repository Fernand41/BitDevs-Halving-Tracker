# ₿ BitDevs Halving Tracker

> Application web en temps réel pour suivre le prochain Halving Bitcoin et l'ajustement de difficulté du réseau — construite pour la communauté **BitDevs Cotonou** 🇧🇯

![Bitcoin](https://img.shields.io/badge/Bitcoin-F7931A?style=for-the-badge&logo=bitcoin&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

---

## 📸 Aperçu

L'application comporte **3 modules** :

| Module | Description |
|--------|-------------|
| ⏱️ **Halving Countdown** | Décompte live jusqu'au prochain halving, date estimée vs théorique |
| 📊 **Difficulty Tracker** | Suivi de la déviation du temps moyen par bloc + notifications push |
| 📈 **Graphique historique** | Évolution des ajustements de difficulté sur les derniers epochs |

---

## 🛠️ Stack technique

- **Framework** : [Next.js 15](https://nextjs.org/) (App Router)
- **Frontend** : React 18
- **Backend** : API Routes Next.js (pas besoin de PHP ni XAMPP)
- **Données** : [mempool.space](https://mempool.space) API (gratuite, sans clé)
- **Graphiques** : Recharts

---

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir installé :

- [Node.js](https://nodejs.org/) v18 ou supérieur
- [Git](https://git-scm.com/)

Vérifie tes versions dans le terminal :

```bash
node -v    # doit afficher v18.x ou supérieur
npm -v     # doit afficher v9.x ou supérieur
git --version
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Fernand41/BitDevs-Halving-Tracker.git
cd BitDevs-Halving-Tracker
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer le fichier d'environnement

Crée un fichier `.env.local` à la racine du projet :

```bash
# Windows (PowerShell)
New-Item .env.local

# macOS / Linux
touch .env.local
```

Puis colle ce contenu dans `.env.local` :

```env
MEMPOOL_API=https://mempool.space/api
HALVING_INTERVAL=210000
TARGET_BLOCK_TIME=600
DIFFICULTY_EPOCH=2016
DEVIATION_THRESHOLD=10
```

### 4. Démarrer l'application

```bash
npm run dev
```

### 5. Ouvrir dans le navigateur

```
http://localhost:3000
```

---

## 🔌 API Routes

Toutes les routes sont accessibles directement depuis le navigateur pour tester :

| Route | Description |
|-------|-------------|
| `GET /api/blocks` | Hauteur actuelle du bloc, temps moyen |
| `GET /api/halving` | Blocs restants, date estimée, récompenses |
| `GET /api/difficulty` | Déviation, ajustement prévu, alerte |
| `GET /api/difficulty-history` | Historique des 12 derniers epochs |

**Exemple de test :**
```
http://localhost:3000/api/halving
```

Tu dois recevoir un JSON avec `"success": true`.

---

## 🔔 Notifications push

L'app envoie des **notifications navigateur** quand la déviation de difficulté dépasse 10%.

- Clique sur **"Activer"** dans le module Difficulty Tracker
- Le navigateur demande l'autorisation
- Maximum 1 notification toutes les 10 minutes (anti-spam)

> Fonctionne sur Chrome, Edge, Firefox (desktop).

---

## 🐛 Dépannage

### Les modules affichent "Chargement..." indéfiniment

1. Vérifie que le fichier `.env.local` existe bien à la racine
2. Teste une API Route directement : `http://localhost:3000/api/halving`
3. Redémarre le serveur : `Ctrl+C` puis `npm run dev`
---
