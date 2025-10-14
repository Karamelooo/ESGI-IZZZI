**ESGI‑IZZZI**

Monorepo front/back prêt pour le dev local et Docker.
- Front: Vue 3 + TypeScript + Vite.
- Back: NestJS 11 (Node 20).
- DB: PostgreSQL (via Docker Compose, optionnel pour le dev initial).

**Arborescence**
- `front/` Vue 3 + Vite (port `5173`).
- `back/` NestJS (port `3500`).
- `docker-compose.yml` Services front, back, db.

**Prérequis**
- Node 20+ et npm 10+ si exécution locale sans Docker.
- Docker + Docker Compose si exécution conteneurisée.

**Démarrage rapide (Docker)**
- `docker compose up --build`
- Front: http://localhost:5173
- API: http://localhost:3500 (GET `/` → `Hello World!`)

**Exécution locale (sans Docker)**
- Back
  - `cd back`
  - `npm ci`
  - `npm run start:dev` (écoute sur `PORT` ou `3000`; en Docker: `3500`)
- Front
  - `cd front`
  - `npm ci`
  - Optionnel: définir `VITE_ALLOWED_HOST` si accès via un domaine/IP spécifique
  - `npm run dev` (http://localhost:5173)

**Scripts utiles**
- Front (`front/package.json`)
  - `dev`: lance Vite
  - `build`: type-check + build
  - `preview`: preview du build
- Back (`back/package.json`)
  - `start`: Nest
  - `start:dev`: Nest en watch mode
  - `start:prod`: `node dist/main`
  - `test`, `test:e2e`, `test:cov`: tests Jest

**Variables d’environnement**
- Front
  - `VITE_ALLOWED_HOST`: autorise un host spécifique pour le serveur Vite
- Back
  - `PORT`: port HTTP de l’API (Dockerfile: `3500`, défaut `3000`)
  - `CHOKIDAR_USEPOLLING=true`: améliore le watch en environnement Docker
- DB (Compose)
  - `POSTGRES_USER=postgres`, `POSTGRES_PASSWORD=password` (port `5432`)

**Dockerfiles**
- `front/Dockerfile.front`: Vite dev server exposé sur `5173`.
- `back/Dockerfile.back`: Nest en watch, `PORT=3500`, `EXPOSE 3500`.

**Points d’entrée**
- API Nest: `back/src/main.ts`, `GET /` dans `back/src/app.controller.ts` → `Hello World!`.
- Front: `front/src/main.ts`, `front/src/App.vue`.

**Tests (Back)**
- `cd back && npm run test` (unit)
- `npm run test:e2e` (e2e) • `npm run test:cov` (coverage)

**Dépannage**
- Port déjà utilisé: ajuster `PORT` (back) ou `--port` Vite (front).
- Accès via un nom de domaine/VM: définir `VITE_ALLOWED_HOST`.
- Changement non détecté en Docker: `CHOKIDAR_USEPOLLING=true` déjà activé côté back.

**Licence**
- Ce projet est distribué sous une licence propriétaire restreinte. Voir `LICENSE`.
- Usage interne uniquement, diffusion et exploitation commerciale interdites sans accord écrit.
- Les composants tiers (ex. Vue, NestJS) restent soumis à leurs licences respectives.
