# Template des Variables d'Environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Azure AD Configuration
AZURE_AD_CLIENT_ID=your-azure-ad-client-id
AZURE_AD_CLIENT_SECRET=your-azure-ad-client-secret
AZURE_AD_TENANT_ID=your-azure-ad-tenant-id

# Azure Storage Configuration
AZURE_STORAGE_CONNECTION_STRING=your-azure-storage-connection-string
AZURE_STORAGE_CONTAINER_NAME=templatesignature
```

## ⚠️ IMPORTANT - Sécurité

- **NE JAMAIS** commiter le fichier `.env` dans Git
- **NE JAMAIS** mettre de secrets dans le code source
- Utilisez toujours des variables d'environnement pour les secrets
- Le fichier `.env` est déjà exclu par `.gitignore`

## Comment obtenir ces valeurs

### 1. NEXTAUTH_SECRET
Générez un secret sécurisé :
```bash
openssl rand -base64 32
```

### 2. Azure AD
- Allez dans le portail Azure → Azure Active Directory → App registrations
- Créez une nouvelle inscription d'application
- Copiez l'Application (client) ID → `AZURE_AD_CLIENT_ID`
- Allez dans "Certificates & secrets" → Créez un nouveau secret client → `AZURE_AD_CLIENT_SECRET`
- Dans "Overview", copiez le Directory (tenant) ID → `AZURE_AD_TENANT_ID`

### 3. Azure Storage
- Allez dans le portail Azure → Storage accounts → Votre compte
- Allez dans "Access keys" → Copiez la "Connection string" → `AZURE_STORAGE_CONNECTION_STRING`
- Créez un container nommé "templatesignature" → `AZURE_STORAGE_CONTAINER_NAME`
