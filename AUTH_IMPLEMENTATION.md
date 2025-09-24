# 🔐 Système d'Authentification - Client Only

## ✅ Implémentation Complète

### Configuration AdonisJS v6
- **Mode Session** configuré dans `config/auth.ts`
- **Modèle User** avec AuthFinder mixin pour authentication
- **Hachage Scrypt** pour les mots de passe
- **Middleware** guest et auth configurés

### Backend (SOLID + DDD)
- **AuthController** : Responsabilité unique pour l'authentification
  - `showLogin()` : Afficher page de connexion
  - `login()` : Gérer la connexion avec validation
  - `showRegister()` : Afficher page d'inscription
  - `register()` : Créer un client (rôle=1) uniquement
  - `logout()` : Déconnexion et redirection

### Validation (VineJS)
- **loginValidator** : Email + mot de passe (8+ caractères)
- **registerValidator** : Email + mot de passe + confirmation

### Frontend (React + Inertia)
- **Page login** : `/inertia/pages/auth/login.tsx`
  - Formulaire avec shadcn/ui components
  - Gestion d'erreurs temps réel
  - Redirection vers inscription

- **Page register** : `/inertia/pages/auth/register.tsx`
  - Validation côté client
  - Confirmation mot de passe
  - Interface cohérente avec login

### Routes
```typescript
// Protégées par middleware guest (utilisateurs non connectés)
GET  /login      -> AuthController.showLogin
POST /login      -> AuthController.login
GET  /register   -> AuthController.showRegister
POST /register   -> AuthController.register

// Accessible aux utilisateurs connectés
POST /logout     -> AuthController.logout
```

### Tests TDD
- **Tests fonctionnels** dans `/tests/functional/auth/`
  - Tests end-to-end du workflow complet
  - Navigation et intégration Inertia
  - Middleware et routes

- **Tests unitaires** dans `/tests/unit/`
  - `validators/` : Tests isolés VineJS
  - `controllers/` : Tests AuthController avec mocks
  - `models/` : Tests User model et logique métier

- **Approche RED-GREEN-REFACTOR** respectée
- **Couverture complète** :
  - ✅ Validation email/password
  - ✅ Logique contrôleur isolée
  - ✅ Sérialisation modèle
  - ✅ Gestion erreurs
  - ✅ Rôles utilisateur

## 🎯 Fonctionnalités

### Pour les Clients (role=1)
✅ **Inscription** : Email + mot de passe + confirmation
✅ **Connexion** : Email + mot de passe
✅ **Déconnexion** : Destruction de session
✅ **Validation** : Côté client et serveur
✅ **Sécurité** : Hachage Scrypt, protection CSRF

### Restrictions Actuelles
❌ **Artistes** : Pas d'inscription directe (système onboarding séparé)
❌ **Reset mot de passe** : Pas encore implémenté
❌ **Validation email** : Pas encore implémentée
❌ **2FA** : Pas encore implémentée

## 🔧 Utilisation

### Développement
```bash
# Démarrer PostgreSQL
docker-compose up -d

# Exécuter les migrations
node ace migration:run

# Démarrer le serveur
npm run dev
```

### Accès
- **Login** : http://localhost:3333/login
- **Inscription** : http://localhost:3333/register

### Test
```bash
# Tous les tests
npm test

# Tests unitaires uniquement
node ace test unit

# Tests fonctionnels uniquement
node ace test functional

# Tests spécifiques auth
node ace test --files="tests/functional/auth/authentication.spec.ts"
node ace test --files="tests/unit/validators/login_validator.spec.ts"
node ace test --files="tests/unit/controllers/auth_controller.spec.ts"
node ace test --files="tests/unit/models/user.spec.ts"
```

## 🏗️ Architecture (SOLID + DDD)

### Entités du Domaine
- **User** : Entité principale avec identité UUID
- **Email** : Value Object (validation intégrée)
- **Password** : Value Object (hachage sécurisé)

### Séparation des Responsabilités
- **Controller** : HTTP et orchestration
- **Validator** : Validation métier
- **Model** : Persistance et relations
- **Middleware** : Contrôle d'accès

### Tests First (TDD)
1. **RED** : Tests écrits avant implémentation
2. **GREEN** : Code minimum pour passer les tests
3. **REFACTOR** : Amélioration continue du code

## 🚀 Prochaines Étapes

1. **Reset mot de passe** avec emails
2. **Validation d'email** obligatoire
3. **Middleware auth** pour routes protégées
4. **Dashboard client** post-connexion
5. **Integration avec système Artist onboarding**