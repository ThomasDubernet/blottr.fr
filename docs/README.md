# 📚 Blottr Documentation

Bienvenue dans la documentation complète du projet Blottr - Plateforme de découverte et réservation d'artistes tatoueurs.

## 🗂️ Structure de la documentation

### 📊 [Database](/docs/database/)
Documentation complète de la base de données PostgreSQL.

- **[DATABASE_DOCUMENTATION.md](/docs/database/DATABASE_DOCUMENTATION.md)** - Documentation détaillée du schéma de base de données
  - Architecture et design principles
  - Description complète des 13 tables
  - Relations et contraintes
  - Business logic et workflows
  - Guide de migration depuis Bubble.io
  - Optimisation et performance
  - Exemples de requêtes SQL et Lucid ORM

- **[DB_VISUALIZATION.md](/docs/database/DB_VISUALIZATION.md)** - Guide d'utilisation de pgAdmin
  - Configuration Docker avec pgAdmin
  - Navigation dans l'interface
  - Visualisation du schéma
  - Commandes utiles

### 🏗️ [Architecture](/docs/architecture/)
Documentation de l'architecture et concepts du projet.

- **[KNOWLEDGE_BASE.md](/docs/architecture/KNOWLEDGE_BASE.md)** - Base de connaissances du projet
  - Vision et objectifs
  - User stories détaillées
  - Architecture technique
  - Intégration Instagram
  - Workflows automatisés
  - Concepts d'IA et LLM

### ⚙️ [Setup](/docs/setup/)
Guides de configuration et installation.

- **[CLAUDE.md](/docs/setup/CLAUDE.md)** - Configuration pour Claude Code
  - Commandes essentielles
  - Architecture AdonisJS v6
  - Patterns de code
  - Workflow de développement
  - Configuration Context7

### 🚀 [API](/docs/api/)
Documentation API (à venir).

---

## 🔍 Navigation rapide

### Pour commencer
1. **Installation** : Consultez [CLAUDE.md](/docs/setup/CLAUDE.md) pour setup le projet
2. **Database** : Référez-vous à [DATABASE_DOCUMENTATION.md](/docs/database/DATABASE_DOCUMENTATION.md)
3. **Visualisation** : Utilisez [DB_VISUALIZATION.md](/docs/database/DB_VISUALIZATION.md) pour pgAdmin

### Concepts clés
- **Multi-salon** : Support des artistes travaillant dans plusieurs salons
- **Instagram Scraping** : Intégration automatique des profils Instagram
- **Onboarding automatisé** : Workflow scraped → contacted → onboarding → verified
- **Recherche géographique** : Système de villes avec coordonnées GPS
- **SEO optimisé** : Slugs automatiques et meta descriptions

### Technologies
- **Backend** : AdonisJS v6 (TypeScript)
- **Frontend** : React 19 + Inertia.js
- **Database** : PostgreSQL 16 avec Lucid ORM
- **Validation** : VineJS
- **Testing** : Japa
- **Build** : Vite
- **Container** : Docker & Docker Compose

---

## 📝 Conventions de documentation

### Structure des fichiers
```
docs/
├── README.md              # Index principal (ce fichier)
├── database/             # Documentation base de données
│   ├── DATABASE_DOCUMENTATION.md
│   └── DB_VISUALIZATION.md
├── architecture/         # Architecture et concepts
│   └── KNOWLEDGE_BASE.md
├── setup/               # Guides d'installation
│   └── CLAUDE.md
└── api/                # Documentation API (future)
```

### Format des documents
- **Titres** : Utilisation d'émojis pour identification rapide
- **Tables** : Format Markdown pour clarté
- **Code** : Blocs avec syntax highlighting
- **Diagrammes** : Mermaid pour visualisation

---

## 🛠️ Maintenance de la documentation

### Mise à jour automatique
Le fichier KNOWLEDGE_BASE est mis à jour automatiquement via :
- Git hooks (husky)
- GitHub Actions
- Script `scripts/update-knowledge-base.sh`

### Contribution
Pour contribuer à la documentation :
1. Suivre la structure existante
2. Utiliser le format Markdown
3. Inclure des exemples pratiques
4. Maintenir l'index à jour

---

## 📞 Support

Pour questions ou clarifications :
1. Consulter d'abord cette documentation
2. Vérifier les exemples de code
3. Utiliser pgAdmin pour exploration visuelle
4. Référencer les migrations dans `/database/migrations/`

---

*Documentation Version: 1.0.0*
*Dernière mise à jour: Septembre 2025*
*AdonisJS v6 | PostgreSQL 16 | React 19*