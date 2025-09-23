# Database Visualization avec pgAdmin

## 🚀 Démarrage

1. **Lancer les services Docker** :
```bash
docker-compose up -d
```

2. **Accéder à pgAdmin** :
- URL : http://localhost:5050
- Email : `admin@blottr.fr`
- Password : `admin`

## 📊 Connection à la base de données

La connexion est pré-configurée ! Après login, vous verrez :
- **Server** : Blottr Database
- **Database** : blottr
- **Username** : postgres
- **Password** : password (déjà enregistré)

## 🔍 Navigation dans pgAdmin

### Voir les tables
1. Servers → Blottr Database → Databases → blottr → Schemas → public → Tables

### Explorer les données
- **Clic droit sur une table** → View/Edit Data → All Rows
- **SQL Query Tool** : Tools → Query Tool pour exécuter des requêtes SQL

### Visualiser le schéma
- **ERD Tool** : Clic droit sur database → Generate ERD

## 🛠️ Commandes Docker utiles

```bash
# Démarrer les services
docker-compose up -d

# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f pgadmin

# Redémarrer pgAdmin
docker-compose restart pgadmin

# Supprimer les données pgAdmin (reset config)
docker volume rm blottrfr_pgadmin_data
```

## 📋 Tables disponibles

- **users** - Utilisateurs (clients et artistes)
- **artists** - Profils d'artistes avec données Instagram
- **salons** - Salons de tatouage
- **shops** - Shops additionnels
- **cities** - Villes pour recherche géographique
- **tattoos** - Portfolio de tatouages
- **tags** - Tags et catégories
- **appointments** - Rendez-vous
- **contact_requests** - Demandes de contact
- **artist_onboarding** - Process d'onboarding
- **artist_salon** - Relation many-to-many artistes/salons
- **tag_tattoo** - Relation many-to-many tags/tattoos
- **auth_access_tokens** - Tokens d'authentification

## 🔐 Sécurité

⚠️ **En production** :
- Changer les mots de passe par défaut
- Utiliser des variables d'environnement
- Configurer SSL/TLS
- Restreindre l'accès réseau

## 🎨 Alternative : Adminer

Si vous préférez une interface plus légère, ajoutez Adminer :

```yaml
adminer:
  image: adminer:latest
  container_name: blottr_adminer
  ports:
    - "8080:8080"
  depends_on:
    - postgres
  restart: unless-stopped
  networks:
    - blottr-network
```

Accès : http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: password
- Database: blottr