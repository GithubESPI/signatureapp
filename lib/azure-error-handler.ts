/**
 * Gestionnaire d'erreurs spécialisé pour les opérations Azure
 */

export class AzureError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'AzureError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class AzureBlobError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message, code, statusCode, details);
    this.name = 'AzureBlobError';
  }
}

export class AzureAuthError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message, code, statusCode, details);
    this.name = 'AzureAuthError';
  }
}

export class AzureGraphError extends AzureError {
  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message, code, statusCode, details);
    this.name = 'AzureGraphError';
  }
}

interface GenericErrorObj {
  code?: string;
  statusCode?: number;
  message?: string;
  [key: string]: unknown;
}

/**
 * Gestionnaire d'erreurs pour les opérations Azure Blob Storage
 */
export function handleBlobStorageError(error: unknown): AzureBlobError {
  console.error('Azure Blob Storage Error:', error);

  const errObj = (typeof error === 'object' && error !== null ? error : {}) as GenericErrorObj;

  // Erreurs de connexion
  if (errObj.code === 'ENOTFOUND' || errObj.code === 'ECONNREFUSED') {
    return new AzureBlobError(
      'Impossible de se connecter au service Azure Storage. Vérifiez votre connexion internet et la configuration.',
      'CONNECTION_ERROR',
      undefined,
      error
    );
  }

  // Erreurs d'authentification
  if (errObj.statusCode === 401 || errObj.statusCode === 403) {
    return new AzureBlobError(
      'Erreur d\'authentification avec Azure Storage. Vérifiez vos credentials.',
      'AUTH_ERROR',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de container/blob non trouvé
  if (errObj.statusCode === 404) {
    return new AzureBlobError(
      'Le container ou le fichier demandé n\'existe pas.',
      'NOT_FOUND',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de quota/dépassement
  if (errObj.statusCode === 413) {
    return new AzureBlobError(
      'Le fichier est trop volumineux pour être traité.',
      'FILE_TOO_LARGE',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de service indisponible
  if (errObj.statusCode === 503 || errObj.statusCode === 500) {
    return new AzureBlobError(
      'Le service Azure Storage est temporairement indisponible. Réessayez plus tard.',
      'SERVICE_UNAVAILABLE',
      errObj.statusCode,
      error
    );
  }

  // Erreur générique
  return new AzureBlobError(
    errObj.message || 'Une erreur inattendue s\'est produite avec Azure Storage.',
    'UNKNOWN_ERROR',
    errObj.statusCode,
    error
  );
}

/**
 * Gestionnaire d'erreurs pour Microsoft Graph API
 */
export function handleGraphError(error: unknown): AzureGraphError {
  console.error('Microsoft Graph Error:', error);

  const errObj = (typeof error === 'object' && error !== null ? error : {}) as GenericErrorObj;

  // Erreurs d'authentification
  if (errObj.statusCode === 401) {
    return new AzureGraphError(
      'Token d\'accès expiré ou invalide. Veuillez vous reconnecter.',
      'TOKEN_EXPIRED',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de permissions
  if (errObj.statusCode === 403) {
    return new AzureGraphError(
      'Permissions insuffisantes pour effectuer cette action.',
      'INSUFFICIENT_PERMISSIONS',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de quota
  if (errObj.statusCode === 429) {
    return new AzureGraphError(
      'Limite de taux dépassée. Veuillez patienter avant de réessayer.',
      'RATE_LIMIT_EXCEEDED',
      errObj.statusCode,
      error
    );
  }

  // Erreurs de service
  if (errObj.statusCode && errObj.statusCode >= 500) {
    return new AzureGraphError(
      'Le service Microsoft Graph est temporairement indisponible.',
      'SERVICE_ERROR',
      errObj.statusCode,
      error
    );
  }

  return new AzureGraphError(
    errObj.message || 'Erreur lors de l\'appel à Microsoft Graph.',
    'UNKNOWN_ERROR',
    errObj.statusCode,
    error
  );
}

/**
 * Gestionnaire d'erreurs pour NextAuth/Azure AD
 */
export function handleAuthError(error: unknown): AzureAuthError {
  console.error('Azure AD Authentication Error:', error);

  const errObj = (typeof error === 'object' && error !== null ? error : {}) as GenericErrorObj;

  if (errObj.code === 'Configuration') {
    return new AzureAuthError(
      'Configuration Azure AD incorrecte. Vérifiez vos variables d\'environnement.',
      'CONFIG_ERROR',
      undefined,
      error
    );
  }

  if (errObj.code === 'AccessDenied') {
    return new AzureAuthError(
      'Accès refusé. Vérifiez que votre compte a les permissions nécessaires.',
      'ACCESS_DENIED',
      undefined,
      error
    );
  }

  return new AzureAuthError(
    errObj.message || 'Erreur d\'authentification Azure AD.',
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

  console.error('Azure Error Log:', logData);
}
