# Permissions Microsoft Graph API

## Permissions configurées

L'application utilise les permissions suivantes pour Microsoft Graph API :

### 1. **User.Read**
- **Description** : Lecture du profil utilisateur
- **Utilisation** : Récupération des informations de base de l'utilisateur connecté
- **Endpoints utilisés** :
  - `GET /me` - Profil utilisateur
  - `GET /me/contacts` - Contacts de l'utilisateur
  - `GET /me/events` - Événements du calendrier

### 2. **Mail.ReadWrite**
- **Description** : Lecture et écriture des emails
- **Utilisation** : Gestion complète des emails (lecture, envoi, modification)
- **Endpoints utilisés** :
  - `GET /me/messages` - Récupération des emails
  - `POST /me/sendMail` - Envoi d'emails
  - `PATCH /me/messages/{id}` - Modification des emails (marquer comme lu/non lu)
  - `DELETE /me/messages/{id}` - Suppression d'emails
  - `POST /me/messages/{id}/move` - Déplacement d'emails
  - `POST /me/messages/{id}/copy` - Copie d'emails
  - `GET /me/mailFolders` - Dossiers email

### 3. **MailboxSettings.ReadWrite**
- **Description** : Lecture et écriture des paramètres de boîte aux lettres
- **Utilisation** : Gestion des paramètres de la boîte aux lettres utilisateur
- **Endpoints utilisés** :
  - `GET /me/mailboxSettings` - Récupération des paramètres
  - `PATCH /me/mailboxSettings` - Mise à jour des paramètres

## Fonctionnalités disponibles

### 📧 **Gestion des emails**
- ✅ Lecture des emails
- ✅ Envoi d'emails avec pièces jointes
- ✅ Marquage comme lu/non lu
- ✅ Suppression d'emails
- ✅ Déplacement et copie d'emails
- ✅ Gestion des dossiers

### 👤 **Profil utilisateur**
- ✅ Informations de base (nom, email, titre)
- ✅ Contacts
- ✅ Événements du calendrier

### ⚙️ **Paramètres de boîte aux lettres**
- ✅ Fuseau horaire
- ✅ Langue
- ✅ Réponses automatiques
- ✅ Heures de travail

### 📁 **Fichiers OneDrive**
- ✅ Liste des fichiers
- ✅ Téléchargement
- ✅ Upload

## Configuration Azure AD

### 1. **App Registration**
Dans le portail Azure AD, configurez votre application avec :

```json
{
  "requiredResourceAccess": [
    {
      "resourceAppId": "00000003-0000-0000-c000-000000000000",
      "resourceAccess": [
        {
          "id": "e1fe6dd8-ba31-4d61-89e7-88639da4683d",
          "type": "Scope"
        },
        {
          "id": "024d486e-b451-40bb-833d-3e66d98c5c73",
          "type": "Scope"
        },
        {
          "id": "818c620a-0794-4589-89b3-0c2bd4d34836",
          "type": "Scope"
        }
      ]
    }
  ]
}
```

### 2. **Permissions détaillées**
- **User.Read** : `e1fe6dd8-ba31-4d61-89e7-88639da4683d`
- **Mail.ReadWrite** : `024d486e-b451-40bb-833d-3e66d98c5c73`
- **MailboxSettings.ReadWrite** : `818c620a-0794-4589-89b3-0c2bd4d34836`

### 3. **Consentement administrateur**
Certaines permissions peuvent nécessiter le consentement administrateur :
- **Mail.ReadWrite** (si l'organisation l'exige)
- **MailboxSettings.ReadWrite** (si l'organisation l'exige)

## Utilisation dans le code

### Hook principal
```typescript
import { useGraphApi } from '@/hooks/useGraphApi';

const { client, isAuthenticated } = useGraphApi();
```

### Hooks spécialisés
```typescript
import { 
  useGraphEmails, 
  useGraphProfile, 
  useGraphFiles, 
  useGraphMailboxSettings 
} from '@/hooks/useGraphApi';

// Emails
const { emails, sendEmail } = useGraphEmails();

// Profil
const { profile } = useGraphProfile();

// Fichiers
const { files, downloadFile } = useGraphFiles();

// Paramètres
const { settings, updateSettings } = useGraphMailboxSettings();
```

### Client direct
```typescript
import { graphApiClient } from '@/lib/axiosExtension';

// Configuration du token
graphApiClient.setAccessToken(session.accessToken);

// Utilisation
const profile = await graphApiClient.getMe();
const emails = await graphApiClient.getMessages();
```

## Sécurité

### 🔒 **Bonnes pratiques**
- ✅ Token d'accès stocké de manière sécurisée
- ✅ Validation des permissions avant utilisation
- ✅ Gestion des erreurs d'authentification
- ✅ Refresh automatique des tokens

### 🛡️ **Gestion des erreurs**
- ✅ Intercepteurs Axios pour les erreurs Graph API
- ✅ Messages d'erreur utilisateur-friendly
- ✅ Logging des erreurs pour le debugging

## Tests

### Page de test
Visitez `/graph-api-test` pour tester toutes les fonctionnalités :
- ✅ Connexion et authentification
- ✅ Récupération du profil
- ✅ Gestion des emails
- ✅ Paramètres de boîte aux lettres
- ✅ Fichiers OneDrive

### Variables d'environnement requises
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
AZURE_AD_TENANT_ID=your_tenant_id
NEXT_PUBLIC_GRAPH_API=https://graph.microsoft.com/v1.0
```
