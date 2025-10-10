# Configuration des Variables d'Environnement

## Variables requises

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Azure AD Configuration
AZURE_CLIENT_ID=your-azure-client-id
AZURE_CLIENT_SECRET=your-azure-client-secret
AZURE_TENANT_ID=your-azure-tenant-id

# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=yourstorageaccount;AccountKey=yourstoragekey;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER_NAME=templatesignature
```

## Comment obtenir ces valeurs

### 1. NEXTAUTH_SECRET
Générez un secret sécurisé :
```bash
openssl rand -base64 32
```

### 2. Azure AD (Azure Active Directory)

1. **AZURE_CLIENT_ID** : ID de l'application dans Azure AD
2. **AZURE_CLIENT_SECRET** : Secret client de l'application
3. **AZURE_TENANT_ID** : ID du tenant Azure AD

**Étapes :**
1. Allez dans le portail Azure → Azure Active Directory
2. Cliquez sur "App registrations"
3. Créez une nouvelle inscription d'application
4. Notez l'**Application (client) ID** → `AZURE_CLIENT_ID`
5. Allez dans "Certificates & secrets" → Créez un nouveau secret client
6. Copiez la valeur du secret → `AZURE_CLIENT_SECRET`
7. Dans "Overview", copiez l'**Directory (tenant) ID** → `AZURE_TENANT_ID`

### 3. Azure Storage

1. **AZURE_STORAGE_CONNECTION_STRING** : Chaîne de connexion du compte de stockage
2. **AZURE_STORAGE_CONTAINER_NAME** : Nom du container (par défaut : "templatesignature")

**Étapes :**
1. Allez dans le portail Azure → Storage accounts
2. Sélectionnez votre compte de stockage
3. Allez dans "Access keys"
4. Copiez la "Connection string" → `AZURE_STORAGE_CONNECTION_STRING`
5. Créez un container nommé "templatesignature" (ou utilisez le nom de votre choix)

## Permissions Azure AD requises

Dans votre inscription d'application Azure AD, ajoutez ces permissions API :

- **Microsoft Graph** :
  - `User.Read` (Delegated)
  - `Mail.ReadWrite` (Delegated)
  - `MailboxSettings.ReadWrite` (Delegated)

## Configuration des Redirect URIs

Dans votre inscription d'application Azure AD, ajoutez ces Redirect URIs :

- `http://localhost:3000/api/auth/callback/azure-ad`
- `http://localhost:3000/auth-success`
- `http://localhost:3000/auth-error`

## Test de la configuration

1. Redémarrez le serveur de développement
2. Allez sur `/template-test` pour tester la connexion Azure Storage
3. Allez sur `/login` pour tester la connexion Azure AD
4. Vérifiez les logs dans le terminal pour voir si les variables sont correctement chargées
