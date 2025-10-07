## 🎯 Contexte

On veut des **routes client FR** garanties à la compil’ (pas de liens cassés), et des **appels API typés** côté front. **Tuyau** génère une définition d’API depuis les routes Adonis et fournit un client + des helpers Inertia typés. [adonisjs.com+2tuyau.julr.dev+2](https://adonisjs.com/blog/introducing-tuyau?utm_source=chatgpt.com)

## ✅ Objectifs

- Générer un **schéma de routes** depuis Adonis.
- Utiliser un **client typé** pour `fetch` côté React.
- Remplacer nos `<Link>`/URLs par des **helpers Inertia typés**. [adonisjs.com+1](https://adonisjs.com/blog/introducing-tuyau?utm_source=chatgpt.com)

## 🔧 Implémentation (pas à pas)

### 1) Backend Adonis — définir et générer l’API

```bash
# Backend
node ace add -D @tuyau/core
```

- Exposer correctement **toutes** les routes web + API (les FR côté web, les `/api/*` pour l’API).
- Générer les types :

```bash
node ace tuyau:generate
# produit .adonisjs/api.ts (la source de vérité des routes)
```

> À relancer à chaque ajout/modif de route (on l’automatise en CI plus bas). tuyau.julr.dev
>

### 2) Front React/Inertia — client & helpers

```bash
# Front (app Inertia)
pnpm add @tuyau/client @tuyau/inertia
```

**Configurer le client** (une seule fois, ex. `resources/ts/tuyau.ts`):

```tsx
import { createClient } from '@tuyau/client'
import * as api from '../../.adonisjs/api' // chemin vers le fichier généré

export const tuyau = createClient(api, {
  baseURL: import.meta.env.VITE_APP_URL ?? 'http://localhost:3333',
  // option: credentials, headers (auth...), etc.
})
```

**Helpers Inertia** (URLs & `<Link>` typés) :

```tsx
import { createInertiaHelpers } from '@tuyau/inertia'
import { tuyau } from './tuyau'

export const { LinkT, route } = createInertiaHelpers(tuyau)
```

- `route.*` te propose **toutes les pages FR** avec **params typés**.
- `LinkT` remplace `<Link>` et **checke les chemins/params à la compil’**. [tuyau.julr.dev](https://tuyau.julr.dev/docs/inertia?utm_source=chatgpt.com)

### 3) Remplacer les URLs en dur par Tuyau (pages FR)

Exemples (client-side) :

```tsx
// Avant
<Link href="/favoris">Mes favoris</Link>

// Après (typé)
<LinkT to={(r) => r.favoris.$url()}>Mes favoris</LinkT>

// Avec params
<LinkT to={(r) => r['artistes/:slug'].$url({ params: { slug } })}>
  Voir le profil
</LinkT>
```

### 4) Appels API typés (fetch E2E)

```tsx
// GET /api/artists?q=...&styles[]=...
const { data, error } = await tuyau.api.artists.$get({
  query: { q, styles, page, pageSize } // typé par le schéma généré
})

// POST /api/favorites
await tuyau.api.favorites.$post({ body: { artist_id } })
```

> Note : les query params passés via $url({ query }) ne sont pas tous inférables selon la route ambiguë (GET/POST même chemin) — garde les appels via $get/$post pour la sécurité maximale. tuyau.julr.dev
>

### 5) Navigation FR : mapping des routes web

Déclare/nomme tes routes **FR** côté Adonis (exemple) :

```tsx
router.get('/tableau-de-bord', 'DashboardController.index').as('tableau-de-bord')
router.get('/favoris', 'FavoritesController.index').as('favoris')
router.get('/mes-demandes', 'InquiriesController.index').as('mes-demandes')
router.get('/explorer', 'ExploreController.index').as('explorer')
router.get('/tatouages', 'TattoosController.index').as('tatouages')
router.get('/artistes/:slug', 'ArtistsController.show').as('artistes/:slug')
```

Puis **régénère** : `node ace tuyau:generate`. Les helpers Inertia te proposeront **ces noms FR**. [adonisjs.com](https://adonisjs.com/blog/introducing-tuyau?utm_source=chatgpt.com)

### 6) DX & CI

**Scripts package.json (backend)**

```json
{
  "scripts": {
    "tuyau:gen": "node ace tuyau:generate",
    "build": "pnpm tuyau:gen && node ace build"
  }
}
```

**CI GitHub Actions** : ajoute une étape “generate tuyau” avant build/test pour éviter tout drift. [adonisjs.com](https://adonisjs.com/blog/introducing-tuyau?utm_source=chatgpt.com)

## 🧪 QA & Tests (minimum)

- **Type-check compile** : casser volontairement un param (`/artistes/:slug` sans slug) → **TS error** ✅
- **E2E client** : `tuyau.api.artists.$get()` avec mauvais type (ex. `page: '2'`) → **TS error** ✅
- **Routing FR** : tous les liens du header (Favoris, Mes demandes, Profil, Paramètres, Déconnexion) migrés vers `LinkT/route` et **résolus à la compil’** ✅
- **Build CI** : échoue si `tuyau:generate` pas lancé → on l’inclut dans `build` ✅

## 🔒 Notes & limites

- **Secrets** : rien n’est exposé par Tuyau, uniquement les **shapes** des routes.
- **Query typing** : préfère `$get/$post` aux `$url({ query })` si un chemin existe en plusieurs verbes. [tuyau.julr.dev](https://tuyau.julr.dev/docs/client?utm_source=chatgpt.com)
- **Inertia** : la doc officiel Inertia recommande de passer les URLs en props si pas d’aide côté client — ici **Tuyau comble ce manque** avec des helpers typés. [inertiajs.com](https://inertiajs.com/routing?utm_source=chatgpt.com)
