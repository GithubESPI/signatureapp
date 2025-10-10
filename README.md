# SignatureApp - Générateur de Signatures

Application Next.js pour la génération et l'envoi automatique de signatures personnalisées via Azure et Microsoft Graph.

## 🚀 Fonctionnalités

- **Authentification Azure AD** : Connexion sécurisée avec NextAuth
- **Récupération de modèles** : Accès aux modèles Word depuis Azure Blob Storage
- **Génération de signatures** : Création de signatures personnalisées
- **Envoi automatique** : Envoi direct dans Outlook via Microsoft Graph API
- **Interface moderne** : Design responsive avec Framer Motion

## 🛠️ Technologies

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icons** : Lucide React
- **Authentification** : NextAuth.js avec Azure AD
- **Storage** : Azure Blob Storage
- **Email** : Microsoft Graph API

## 📋 Prérequis

- Node.js 18+
- Compte Azure avec :
  - Azure AD (pour l'authentification)
  - Storage Account (pour les modèles Word)
  - Permissions Microsoft Graph (pour l'envoi d'emails)

## ⚙️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd signature-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
Créez un fichier `.env.local` basé sur `env.example` :

```bash
# Azure AD Configuration (NextAuth)
AZURE_AD_CLIENT_ID=your_azure_ad_client_id
AZURE_AD_CLIENT_SECRET=your_azure_ad_client_secret
AZURE_AD_TENANT_ID=your_azure_ad_tenant_id

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your_storage_account;AccountKey=your_storage_key;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=signatures

# Microsoft Graph API (pour l'envoi d'emails)
MICROSOFT_GRAPH_CLIENT_ID=your_graph_client_id
MICROSOFT_GRAPH_CLIENT_SECRET=your_graph_client_secret
```

4. **Démarrer l'application**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

```
app/
├── api/auth/[...nextauth].ts    # Configuration NextAuth
├── page.tsx                     # Page d'accueil
├── login/page.tsx              # Page de connexion
├── dashboard/page.tsx          # Tableau de bord
└── template-test/page.tsx      # Test des modèles

components/
├── WelcomeSection.tsx          # Section d'accueil
├── AzureLoginButton.tsx        # Bouton de connexion
├── UserProfile.tsx             # Profil utilisateur
└── WordTemplateManager.tsx     # Gestion des modèles

lib/
├── azure-blob-service.ts       # Service Azure Blob Storage
└── azure-error-handler.ts      # Gestion d'erreurs
```

## 🔧 Configuration Azure

### 1. Azure AD App Registration
1. Créez une nouvelle app registration dans Azure AD
2. Configurez les redirect URIs : `http://localhost:3000/api/auth/callback/azure-ad`
3. Générez un client secret
4. Notez le Client ID et Tenant ID

### 2. Azure Storage Account
1. Créez un Storage Account
2. Créez un container nommé "signatures"
3. Uploadez vos modèles Word (.docx)
4. Récupérez la connection string

### 3. Microsoft Graph API
1. Ajoutez les permissions Graph API nécessaires
2. Configurez les scopes : `Mail.Send`, `User.Read`

## 📱 Pages de l'Application

- **/** : Page d'accueil avec présentation
- **/login** : Page de connexion dédiée
- **/dashboard** : Tableau de bord utilisateur
- **/template-test** : Test de récupération des modèles

## 🎨 Design

- **Design System** : Interface moderne avec gradients
- **Responsive** : Adaptatif mobile/desktop
- **Animations** : Transitions fluides avec Framer Motion
- **Accessibilité** : Navigation clavier et screen readers

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repository GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes
- Azure App Service
- Netlify
- AWS Amplify

## 🔒 Sécurité

- Authentification OAuth 2.0 avec Azure AD
- Sessions sécurisées avec NextAuth
- Variables d'environnement protégées
- HTTPS obligatoire en production

## 📊 Monitoring

- Logs d'erreurs Azure
- Métriques d'utilisation
- Monitoring des performances

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Consultez la documentation Azure
- Contactez l'équipe de développement

---

**SignatureApp** - Powered by Microsoft Azure & Next.js