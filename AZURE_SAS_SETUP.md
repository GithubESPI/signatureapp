# Configuration Azure Storage avec SAS (Signature d'Accès Partagé)

## Qu'est-ce qu'une SAS ?

Une signature d'accès partagé (SAS) est un URI qui accorde un accès limité sur un blob de stockage Azure. Elle permet d'accorder l'accès à des ressources de compte de stockage sur un intervalle de temps spécifique sans partager votre clé de compte de stockage.

## Avantages de l'utilisation d'une SAS

- **Sécurité** : Pas besoin d'exposer la clé de compte de stockage
- **Contrôle d'accès** : Permissions limitées et temporaires
- **Flexibilité** : Peut être révoquée à tout moment
- **Audit** : Traçabilité des accès

## Comment générer une URL SAS

### 1. Via le Portail Azure

1. Accédez à votre **Storage Account** dans le portail Azure
2. Dans le menu de gauche, cliquez sur **Containers**
3. Sélectionnez votre container (ex: "signatures")
4. Cliquez sur **Generate SAS** dans la barre d'outils
5. Configurez les paramètres :
   - **Signing method** : Account key
   - **Signing key** : key1 ou key2
   - **Permissions** : Read, List (pour lire et lister les fichiers)
   - **Start time** : Date de début de validité
   - **Expiry time** : Date d'expiration
   - **Allowed IP addresses** : Optionnel, pour limiter l'accès par IP
6. Cliquez sur **Generate SAS token and URL**
7. Copiez l'**URL complète** générée

### 2. Via Azure CLI

```bash
# Générer une SAS pour un container
az storage container generate-sas \
  --account-name votrecomptestorage \
  --name signatures \
  --permissions rl \
  --expiry 2024-12-31T23:59:59Z \
  --auth-mode login
```

### 3. Via PowerShell

```powershell
# Générer une SAS pour un container
$context = New-AzStorageContext -StorageAccountName "votrecomptestorage" -UseConnectedAccount
New-AzStorageContainerSASToken -Name "signatures" -Permission "rl" -ExpiryTime (Get-Date).AddMonths(6) -Context $context
```

## Configuration dans l'application

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# URL SAS complète pour accéder au container
AZURE_STORAGE_SAS_URL=https://votrecomptestorage.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rl&se=2024-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=VOTRE_SIGNATURE_SAS

# Nom du container (optionnel, par défaut "signatures")
AZURE_STORAGE_CONTAINER_NAME=signatures
```

### 2. Structure de l'URL SAS

Une URL SAS complète ressemble à ceci :

```
https://votrecomptestorage.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rl&se=2024-12-31T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=VOTRE_SIGNATURE_SAS
```

**Composants :**
- `sv` : Version de l'API de stockage
- `ss` : Services autorisés (b = blob)
- `srt` : Types de ressources (sco = service, container, object)
- `sp` : Permissions (r = read, l = list)
- `se` : Date d'expiration
- `st` : Date de début
- `spr` : Protocoles autorisés (https)
- `sig` : Signature cryptographique

## Permissions recommandées

Pour l'application de signatures, utilisez ces permissions :

- **Read (r)** : Pour télécharger les modèles Word
- **List (l)** : Pour lister les fichiers disponibles

## Sécurité

### Bonnes pratiques

1. **Durée limitée** : Configurez une expiration raisonnable (6 mois max)
2. **Permissions minimales** : Accordez uniquement les permissions nécessaires
3. **Rotation régulière** : Renouvelez les SAS avant expiration
4. **Monitoring** : Surveillez l'utilisation via les logs Azure

### Exemple de configuration sécurisée

```env
# SAS avec permissions limitées et expiration dans 3 mois
AZURE_STORAGE_SAS_URL=https://votrecomptestorage.blob.core.windows.net/?sv=2022-11-02&ss=b&srt=sco&sp=rl&se=2024-06-30T23:59:59Z&st=2024-01-01T00:00:00Z&spr=https&sig=VOTRE_SIGNATURE_SAS
```

## Test de la configuration

Une fois configurée, vous pouvez tester l'accès via l'application :

1. Allez sur `/template-test` pour tester la connexion
2. Vérifiez que les modèles Word sont listés
3. Testez le téléchargement d'un modèle

## Dépannage

### Erreurs courantes

1. **403 Forbidden** : SAS expirée ou permissions insuffisantes
2. **404 Not Found** : Container ou fichier inexistant
3. **Signature mismatch** : URL SAS malformée

### Vérifications

1. Vérifiez que l'URL SAS est complète et valide
2. Confirmez que les permissions incluent `r` (read) et `l` (list)
3. Vérifiez que la date d'expiration n'est pas dépassée
4. Testez l'URL SAS directement dans un navigateur
