/**
 * Gestionnaire d'erreurs spécialisé pour les opérations Azure
 */

export class AzureError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: any;

  constructor(message: string, code: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'AzureError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AzureBlobError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: any) {
    super(message, code, statusCode, details);
    this.name = 'AzureBlobError';
  }
}

export class AzureAuthError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: any) {
    super(message, code, statusCode, details);
    this.name = 'AzureAuthError';
  }
}

export class AzureGraphError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: any) {
    super(message, code, statusCode, details);
    this.name = 'AzureGraphError';
  }
}

/**
 * Gestionnaire d'erreurs pour les opérations Azure Blob Storage
 */
export function handleBlobStorageError(error: any): AzureBlobError {
  console.error('Azure Blob Storage Error:', error);

  // Erreurs de connexion
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return new AzureBlobError(
      'Impossible de se connecter au service Azure Storage. Vérifiez votre connexion internet et la configuration.',
      'CONNECTION_ERROR',
      undefined,
      error
    );
  }

  // Erreurs d'authentification
  if (error.statusCode === 401 || error.statusCode === 403) {
    return new AzureBlobError(
      'Erreur d\'authentification avec Azure Storage. Vérifiez vos credentials.',
      'AUTH_ERROR',
      error.statusCode,
      error
    );
  }

  // Erreurs de container/blob non trouvé
  if (error.statusCode === 404) {
    return new AzureBlobError(
      'Le container ou le fichier demandé n\'existe pas.',
      'NOT_FOUND',
      error.statusCode,
      error
    );
  }

  // Erreurs de quota/dépassement
  if (error.statusCode === 413) {
    return new AzureBlobError(
      'Le fichier est trop volumineux pour être traité.',
      'FILE_TOO_LARGE',
      error.statusCode,
      error
    );
  }

  // Erreurs de service indisponible
  if (error.statusCode === 503 || error.statusCode === 500) {
    return new AzureBlobError(
      'Le service Azure Storage est temporairement indisponible. Réessayez plus tard.',
      'SERVICE_UNAVAILABLE',
      error.statusCode,
      error
    );
  }

  // Erreur générique
  return new AzureBlobError(
    error.message || 'Une erreur inattendue s\'est produite avec Azure Storage.',
    'UNKNOWN_ERROR',
    error.statusCode,
    error
  );
}

/**
 * Gestionnaire d'erreurs pour Microsoft Graph API
 */
export function handleGraphError(error: any): AzureGraphError {
  console.error('Microsoft Graph Error:', error);

  // Erreurs d'authentification
  if (error.statusCode === 401) {
    return new AzureGraphError(
      'Token d\'accès expiré ou invalide. Veuillez vous reconnecter.',
      'TOKEN_EXPIRED',
      error.statusCode,
      error
    );
  }

  // Erreurs de permissions
  if (error.statusCode === 403) {
    return new AzureGraphError(
      'Permissions insuffisantes pour effectuer cette action.',
      'INSUFFICIENT_PERMISSIONS',
      error.statusCode,
      error
    );
  }

  // Erreurs de quota
  if (error.statusCode === 429) {
    return new AzureGraphError(
      'Limite de taux dépassée. Veuillez patienter avant de réessayer.',
      'RATE_LIMIT_EXCEEDED',
      error.statusCode,
      error
    );
  }

  // Erreurs de service
  if (error.statusCode >= 500) {
    return new AzureGraphError(
      'Le service Microsoft Graph est temporairement indisponible.',
      'SERVICE_ERROR',
      error.statusCode,
      error
    );
  }

  return new AzureGraphError(
    error.message || 'Erreur lors de l\'appel à Microsoft Graph.',
    'UNKNOWN_ERROR',
    error.statusCode,
    error
  );
}

/**
 * Gestionnaire d'erreurs pour NextAuth/Azure AD
 */
export function handleAuthError(error: any): AzureAuthError {
  console.error('Azure AD Authentication Error:', error);

  if (error.code === 'Configuration') {
    return new AzureAuthError(
      'Configuration Azure AD incorrecte. Vérifiez vos variables d\'environnement.',
      'CONFIG_ERROR',
      undefined,
      error
    );
  }

  if (error.code === 'AccessDenied') {
    return new AzureAuthError(
      'Accès refusé. Vérifiez que votre compte a les permissions nécessaires.',
      'ACCESS_DENIED',
      undefined,
      error
    );
  }

  return new AzureAuthError(
    error.message || 'Erreur d\'authentification Azure AD.',
    'AUTH_ERROR',
    undefined,
    error
  );
}

/**
 * Fonction utilitaire pour logger les erreurs de manière sécurisée
 */
export function logError(error: AzureError, context?: string): void {
  const logData = {
    name: error.name,
    code: error.code,
    message: error.message,
    statusCode: error.statusCode,
    context,
    timestamp: new Date().toISOString()
  };

  // En production, vous pourriez envoyer ces logs vers un service comme Application Insights
  console.error('Azure Error Log:', logData);
}
