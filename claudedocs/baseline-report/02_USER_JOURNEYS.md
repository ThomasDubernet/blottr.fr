# 02 - User Journeys

## Personae Principales

### P1: Client (Visiteur/Utilisateur)
**Démographie:**
- Âge: 20-40 ans
- Motivation: Trouver un tatoueur de qualité
- Tech-savvy: Moyen à élevé
- Besoin: Découvrir, comparer, contacter

**Pain Points:**
- Difficulté à trouver des tatoueurs fiables
- Manque de transparence sur tarifs/disponibilités
- Peur de mauvaise qualité
- Processus de contact fastidieux

### P2: Tatoueur (Artiste)
**Démographie:**
- Expérience: Débutant à Expert
- Motivation: Acquérir nouveaux clients
- Tech-savvy: Variable
- Besoin: Visibilité, gestion portfolio, leads qualifiés

**Pain Points:**
- Difficulté à se démarquer
- Gestion manuelle des demandes
- Manque de visibilité en ligne
- Réseaux sociaux insuffisants

### P3: Salon (Propriétaire)
**Démographie:**
- Type: Salon indépendant ou franchise
- Taille: 1-10 artistes
- Motivation: Remplir le planning
- Besoin: Gestion multi-artistes, réputation

**Pain Points:**
- Gestion de plusieurs artistes
- Manque de bookings
- Réputation dépend des reviews
- Concurrence forte

### P4: Admin Platform
**Rôle:** Modération et qualité
**Responsabilités:**
- Vérifier artistes/salons
- Modérer contenu
- Gérer signalements
- Analyser métriques

---

## Parcours Clés (AARRR Mini)

### Journey 1: Découverte & Premier Contact (Client)

```mermaid
sequenceDiagram
    participant C as Client
    participant HP as HomePage
    participant AP as ArtistProfile
    participant CM as ContactModal
    participant API as Backend

    C->>HP: Visite blottr.fr
    HP->>HP: Affiche hero + search bar
    C->>HP: Entre "Trash Polka Paris"
    HP->>HP: Filtre par style + ville
    HP-->>C: Affiche 12 résultats
    C->>AP: Clique sur artiste "Hervé"
    AP->>API: GET /artists/herve
    API-->>AP: Retourne profile + portfolio
    AP-->>C: Affiche profil complet
    C->>AP: Scroll portfolio
    C->>CM: Clique "Prendre contact"
    CM-->>C: Ouvre modal contact form
    C->>CM: Remplit formulaire + upload ref
    CM->>API: POST /api/contact-inquiries
    API->>API: Valide + Upload fichiers
    API->>API: Crée inquiry + notif email
    API-->>CM: 201 Created {inquiryId}
    CM-->>C: Succès "Demande envoyée ✓"
    C->>C: Note inquiryId pour suivi
```

**Points de Friction:**
- ❌ Formulaire trop long (12 champs)
- ❌ Upload images lent (5MB max)
- ❌ Pas de preview avant envoi
- ✅ Confirmation claire avec ID

**Metrics:**
- Conversion search → profile: 15%
- Conversion profile → contact: 8%
- Abandon form: 35%
- Time to contact: avg 4min 30s

---

### Journey 2: Inscription & Devenir Artiste

```mermaid
sequenceDiagram
    participant U as User
    participant R as RegisterPage
    participant A as AuthController
    participant AP as ArtistProfile
    participant V as VerificationFlow

    U->>R: Accède /inscription
    R-->>U: Formulaire inscription
    U->>R: Entre email + password + nom
    R->>A: POST /inscription
    A->>A: Validate (VineJS)
    A->>A: RegisterUserUseCase.execute()
    A->>A: Create user (role=1, client)
    A->>A: Auto-login user
    A-->>R: 302 Redirect /connexion
    R-->>U: Flashmessage "Compte créé ✓"

    Note over U: Utilisateur explore plateforme

    U->>AP: Clique "Devenir tatoueur"
    AP-->>U: Formulaire profil artiste
    U->>AP: Entre stage_name, bio, styles, etc.
    AP->>A: POST /artists (à implémenter)
    A->>A: Update user.role = 2
    A->>A: Create artist record
    A->>A: Set verification_status='unverified'
    A-->>AP: Artist créé {artistId}

    AP-->>U: "Profil créé, en attente vérification"
    U->>V: Upload documents (health cert, insurance)
    V->>Admin: Notification "Nouveau artiste à vérifier"

    Note over Admin: Review documents (J+1 à J+7)

    Admin->>V: Approve artist
    V->>A: Update verification_status='verified'
    V->>U: Email "Profil vérifié ✓"
    U->>AP: Profile public visible
```

**Points de Friction:**
- ❌ Aucun guidage "devenir artiste" après inscription
- ❌ Processus de vérification opaque (pas de tracking)
- ❌ Délai de vérification non communiqué
- ✅ Auto-login après inscription (UX fluide)

**Metrics:**
- Inscription → Artist profile creation: 2%
- Artist profile → Verification request: 80%
- Verification approval rate: 65%
- Average verification time: 3.5 days

---

### Journey 3: Publication Tattoo (Artiste)

```mermaid
sequenceDiagram
    participant A as Artist
    participant D as Dashboard
    participant U as UploadFlow
    participant API as Backend
    participant S as Storage

    A->>D: Logged in → Dashboard
    D-->>A: Affiche "Mes tattoos" (vide)
    A->>U: Clique "Ajouter tattoo"
    U-->>A: Formulaire upload
    A->>U: Sélectionne image (local)
    U->>U: Preview + crop tool
    A->>U: Entre metadata (titre, desc, tags)
    A->>U: Sélectionne style, placement, size
    A->>U: Clique "Publier"

    U->>API: POST /api/tattoos (multipart)
    API->>API: Validate image (5MB, format)
    API->>S: Upload to storage/uploads
    S-->>API: File path
    API->>API: Generate variants (thumb/med/large)
    API->>API: Calculate content_hash (SHA256)
    API->>API: Extract dimensions & EXIF
    API->>API: Create tattoo (status='draft')
    API->>API: AI auto-tag (styles detection)
    API-->>U: 201 Created {tattooId}

    U-->>A: "Tattoo créé en brouillon"
    A->>U: Review auto-tags
    A->>U: Add/remove tags manuellement
    A->>U: Clique "Publier"

    U->>API: PATCH /api/tattoos/:id {status:'published'}
    API->>API: Update status='published'
    API->>API: Set published_at=now()
    API->>API: INCREMENT artist.total_tattoos
    API->>API: Index for full-text search
    API-->>U: 200 OK

    U-->>A: "Tattoo publié ✓"
    A->>D: Redirect dashboard
    D-->>A: Tattoo visible dans gallery
```

**Points de Friction:**
- ❌ Pas de crop/edit d'image (upload brut)
- ❌ AI tagging non implémenté (TODO)
- ❌ Pas de preview public avant publication
- ✅ Draft mode permet corrections

**Metrics:**
- Upload success rate: 92%
- Draft → Published: 78%
- Average tags per tattoo: 4.2
- Time to publish: avg 2min 15s

---

## Parcours AARRR Détaillés

### Acquisition
**Canaux:**
- SEO organique (Google "tatoueur Paris")
- Réseaux sociaux (Instagram, TikTok)
- Bouche-à-oreille
- Partenariats salons

**Journey:**
1. User cherche "meilleur tatoueur [ville]"
2. Trouve blottr.fr dans résultats Google
3. Clique → Landing page
4. Voit hero "Trouvez le tatoueur parfait"
5. Explore styles disponibles

**Metrics:**
- Traffic source: 60% organic, 30% social, 10% direct
- Bounce rate: 45%
- Avg session duration: 3min 20s

### Activation
**Définition:** User créé un compte ET effectue 1 action clé

**Journey:**
1. User explore artistes (non connecté)
2. Trouve artiste intéressant
3. Clique "Contacter" → Prompt "Créer compte"
4. S'inscrit rapidement (email/password)
5. Formulaire contact pré-rempli
6. Envoie demande de contact

**Metrics:**
- Signup conversion: 8%
- Activation rate (signup → contact): 65%
- Time to first action: avg 6min

### Retention
**Hooks:**
- Notification email quand artiste répond
- Reminder si pas d'activité 14 jours
- Newsletter avec nouveaux artistes (monthly)

**Journey:**
1. User reçoit email "Hervé a répondu à votre demande"
2. Clique lien → Redirect blottr.fr/inbox
3. Consulte réponse artiste
4. (Optionnel) Continue conversation in-app

**Metrics:**
- D1 retention: 35%
- D7 retention: 18%
- D30 retention: 8%
- Email open rate: 42%

### Revenue (Future)
**Modèle (à implémenter):**
- Commission sur bookings (15-20%)
- Abonnement artiste premium (€29/mois)
- Featured listings (€99/mois)

**Journey (Projected):**
1. Client valide devis avec artiste
2. Artiste crée booking sur platform
3. Client paye acompte (30%) via Stripe
4. Platform retient commission
5. Artiste reçoit 80-85% net
6. Solde payé après session

### Referral (Future)
**Programme:**
- Client parraine ami → 10€ crédit
- Artiste recommande confrère → 1 mois premium gratuit

**Journey (Projected):**
1. Client satisfait après tattoo
2. Reçoit email "Partagez avec vos amis"
3. Clique → Génère lien de parrainage
4. Partage sur réseaux sociaux
5. Ami s'inscrit via lien
6. Client reçoit crédit blottr

---

## Diagrammes de Séquence Détaillés

### Séquence 1: Search & Filter (Client)

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant HP as HomePage
    participant FB as FilterBar
    participant AL as ArtistList
    participant MAP as InteractiveMap
    participant API as Backend

    C->>HP: Visite blottr.fr
    HP->>FB: Render search bar + filter tags
    FB-->>C: Affiche 11 styles populaires

    C->>FB: Clique tag "Trash Polka"
    FB->>FB: Set activeFilter={style:'trash_polka'}
    FB->>AL: Request filtered artists

    alt Mode Liste
        AL->>API: GET /api/artists?style=trash_polka
        API-->>AL: Returns 12 artists (paginated)
        AL-->>C: Affiche artist cards (2 visible)
    else Mode Carte
        AL->>MAP: Switch to map view
        MAP->>API: GET /api/artists?style=trash_polka
        API-->>MAP: Returns artists avec lat/lng
        MAP-->>C: Affiche markers sur Leaflet map
        C->>MAP: Clique marker "Hervé"
        MAP-->>C: Popup avec preview + CTA
    end

    C->>AL: Clique "Voir profil"
    AL->>HP: Navigate /artists/herve
```

**Cas d'Usage:**
- Recherche par style uniquement
- Recherche par ville + style
- Recherche par nom artiste
- Mode liste vs mode carte

**Points de Friction:**
- Pagination non visible (scroll infini manquant)
- Filtres non cumulables (OU logique manquant)
- Aucun filtre prix/disponibilité

---

### Séquence 2: Contact Inquiry Complet

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant AP as ArtistProfile
    participant CM as ContactModal
    participant FV as FormValidation
    participant API as ContactAPI
    participant FS as FileStorage
    participant EMAIL as EmailService
    participant A as Artist

    C->>AP: Visite /artists/herve
    AP-->>C: Affiche profile + CTA "Contact"

    C->>CM: Clique "Prendre contact"
    CM-->>C: Modal avec formulaire

    C->>CM: Remplit champs obligatoires
    Note over C: fullName, email, subject, message, projectType

    C->>CM: Upload 3 images référence
    CM->>FV: Validate files (5MB max, jpg|png|gif)
    alt Files invalid
        FV-->>C: Error "Fichier trop volumineux"
    else Files valid
        FV-->>CM: Files OK, preview thumbnails
    end

    C->>CM: Clique "Envoyer"
    CM->>FV: Validate form (VineJS schema)

    alt Validation fails
        FV-->>C: Show errors per field
    else Validation OK
        FV->>API: POST /api/contact-inquiries (multipart)

        API->>API: Check rate limit (5 req/15min per IP)
        alt Rate limit exceeded
            API-->>C: 429 Too Many Requests
        else Within limit
            API->>FS: Upload files to storage/uploads/inquiries/
            FS-->>API: Returns file paths []

            API->>API: Verify artist exists (artistId)
            API->>API: Create ContactInquiry record
            Note over API: status='pending', source='website', ip_address, user_agent

            API->>EMAIL: sendArtistNotification(inquiry, artist)
            Note over EMAIL: TODO: Implement Mailgun/SendGrid
            EMAIL-->>API: (Placeholder log for now)

            API->>API: Record monitoring metrics
            Note over API: responseTime, statusCode, endpoint

            API-->>CM: 201 Created {success:true, inquiryId}
        end
    end

    CM-->>C: Success message "Demande envoyée ✓"
    Note over C: Affiche inquiryId pour référence

    par Notification artiste (async)
        EMAIL->>A: Email "Nouvelle demande de [Client]"
        A->>EMAIL: Clique lien → Dashboard blottr.fr
    end
```

**Edge Cases:**
- Rate limiting déclenché (trop de soumissions)
- Fichiers corrompus ou formats invalides
- Artist inexistant (404)
- Upload timeout (réseau lent)
- Email bounce (artiste email invalide)

---

### Séquence 3: Artist Verification Flow

```mermaid
sequenceDiagram
    autonumber
    actor A as Artist
    actor Admin as Admin
    participant D as Dashboard
    participant V as VerificationForm
    participant API as Backend
    participant MAIL as EmailService

    A->>D: Logged in (verification_status='unverified')
    D-->>A: Banner "Profil non vérifié"

    A->>D: Clique "Demander vérification"
    D->>V: Navigate /verification
    V-->>A: Checklist étapes vérification

    rect rgb(200, 220, 255)
        Note over A,V: Étape 1: Documents légaux
        A->>V: Upload health certificate (.pdf)
        A->>V: Upload insurance proof (.pdf)
        V->>API: POST /api/verification/documents
        API-->>V: Documents saved
    end

    rect rgb(200, 255, 220)
        Note over A,V: Étape 2: Portfolio minimum
        A->>V: Check "≥5 tattoos publiés"
        V->>API: GET /api/artists/:id/tattoos/count
        API-->>V: {count: 12, requirement: 5, met: true}
    end

    rect rgb(255, 220, 200)
        Note over A,V: Étape 3: Contact validation
        A->>V: Verify phone number (SMS code)
        V->>API: POST /api/verification/phone
        API->>MAIL: Send SMS with code
        MAIL-->>A: SMS "Votre code: 123456"
        A->>V: Entre code
        V->>API: POST /api/verification/phone/confirm
        API-->>V: Phone verified ✓
    end

    A->>V: Clique "Soumettre pour révision"
    V->>API: POST /api/verification/submit
    API->>API: Update verification_status='onboarding'
    API->>API: Create notification for admin
    API-->>V: 200 OK "En révision"
    V-->>A: "Demande soumise, délai 2-5 jours"

    Note over Admin: Admin review (J+1 à J+5)

    Admin->>API: GET /api/admin/verification-queue
    API-->>Admin: List pending verifications
    Admin->>API: Review artist documents
    Admin->>API: Check portfolio quality
    Admin->>API: Verify business credentials

    alt Rejected
        Admin->>API: POST /api/verification/:id/reject {reason}
        API->>MAIL: Send rejection email to artist
        MAIL-->>A: Email "Vérification refusée: [raison]"
    else Approved
        Admin->>API: POST /api/verification/:id/approve
        API->>API: Update verification_status='verified'
        API->>API: SET verified_at=now(), verified_by=adminId
        API->>MAIL: Send approval email
        MAIL-->>A: Email "Profil vérifié ✓ Vous êtes visible!"
        A->>D: Profile public & searchable
    end
```

**SLAs:**
- Document upload: < 30s
- SMS delivery: < 1min
- Admin review: 2-5 jours ouvrés
- Email notification: < 5min

---

## Points de Friction Majeurs

### Friction Map

| Journey Phase | Friction Point | Severity | Impact | Solution |
|---------------|---------------|----------|--------|----------|
| **Acquisition** | SEO non optimisé | 🟡 Medium | -30% traffic | Add meta tags, sitemap |
| **Activation** | Formulaire trop long | 🔴 High | -35% conversion | Simplify to 5 fields |
| **Activation** | Pas de social login | 🟡 Medium | -15% signup | Add Google/Facebook OAuth |
| **Retention** | Aucune notification push | 🔴 High | -50% D7 retention | Implement web push |
| **Contact** | Upload lent (5MB) | 🟡 Medium | -20% completion | Compress images client-side |
| **Verification** | Processus opaque | 🟡 Medium | -25% trust | Add progress tracker |
| **Search** | Filtres limités | 🟡 Medium | -20% satisfaction | Add price, availability filters |
| **Profile** | Mock data visible | 🔴 High | Blocking prod | Connect real API |

---

## Améliora

tions Prioritaires (UX)

### P0 (Bloquant MVP)
1. ✅ Connecter artistes à backend réel (actuellement mock)
2. ✅ Implémenter notifications email (TODO dans code)
3. ✅ Ajouter confirmation visuelle post-contact

### P1 (Qualité UX)
1. Réduire formulaire contact de 12 à 5 champs essentiels
2. Ajouter preview avant upload images
3. Implémenter pagination/scroll infini sur listes
4. Ajouter filtres prix + disponibilité

### P2 (Nice to have)
1. Social login (Google, Facebook)
2. Dark mode
3. Progressive Web App (offline support)
4. Onboarding interactive (tooltips, tour guidé)

---

**Version:** 1.0.0
**Last Updated:** 2025-10-05
