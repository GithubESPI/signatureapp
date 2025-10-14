"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { graphApiClient, GraphApiClient } from '@/lib/axiosExtension';

interface UseGraphApiReturn {
  client: GraphApiClient;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  validateConnection: () => Promise<boolean>;
}

export function useGraphApi(): UseGraphApiReturn {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mettre à jour le token d'accès quand la session change
  useEffect(() => {
    if (session?.accessToken) {
      graphApiClient.setAccessToken(session.accessToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  // Valider la connexion Graph API
  const validateConnection = useCallback(async (): Promise<boolean> => {
    if (!session?.accessToken) {
      setError('Aucun token d\'accès disponible');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isValid = await graphApiClient.validateToken();
      setIsAuthenticated(isValid);
      
      if (!isValid) {
        setError('Token d\'accès invalide ou expiré');
      }
      
      return isValid;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion Graph API';
      setError(errorMessage);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  return {
    client: graphApiClient,
    isLoading,
    error,
    isAuthenticated,
    validateConnection,
  };
}

// Hook spécialisé pour les emails
export function useGraphEmails() {
  const { client, isLoading, error, isAuthenticated } = useGraphApi();
  const [emails, setEmails] = useState<any[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const fetchEmails = useCallback(async (folderId: string = 'inbox', top: number = 10) => {
    if (!isAuthenticated) return;

    setLoadingEmails(true);
    try {
      const messages = await client.getMessages(folderId, top);
      setEmails(messages);
    } catch (err) {
      console.error('Erreur lors de la récupération des emails:', err);
    } finally {
      setLoadingEmails(false);
    }
  }, [client, isAuthenticated]);

  const sendEmail = useCallback(async (message: {
    toRecipients: Array<{ emailAddress: { address: string; name?: string } }>;
    subject: string;
    body: {
      contentType: 'Text' | 'HTML';
      content: string;
    };
    attachments?: Array<{
      '@odata.type': string;
      name: string;
      contentType: string;
      contentBytes: string;
    }>;
  }) => {
    if (!isAuthenticated) throw new Error('Non authentifié');

    try {
      const result = await client.sendMail(message);
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email:', err);
      throw err;
    }
  }, [client, isAuthenticated]);

  return {
    emails,
    loadingEmails,
    fetchEmails,
    sendEmail,
    isLoading,
    error,
    isAuthenticated,
  };
}

// Hook spécialisé pour le profil utilisateur
export function useGraphProfile() {
  const { client, isLoading, error, isAuthenticated } = useGraphApi();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingProfile(true);
    try {
      const userProfile = await client.getMe();
      console.log('🔧 [Profile] Données récupérées:', userProfile);
      console.log('🔧 [Profile] jobTitle:', userProfile.jobTitle);
      console.log('🔧 [Profile] mobilePhone:', userProfile.mobilePhone);
      
      // Récupérer la photo de profil si disponible
      try {
        const photoResponse = await client.axiosInstance.get('/me/photo/$value', {
          responseType: 'blob'
        });
        if (photoResponse.data) {
          // Créer une URL blob pour l'affichage
          const photoUrl = URL.createObjectURL(photoResponse.data);
          userProfile.photo = photoUrl;
        }
      } catch (photoError) {
        console.log('Photo de profil non disponible:', photoError);
        // La photo n'est pas disponible, on continue sans
      }
      
      setProfile(userProfile);
    } catch (err) {
      console.error('Erreur lors de la récupération du profil:', err);
    } finally {
      setLoadingProfile(false);
    }
  }, [client, isAuthenticated]);

  return {
    profile,
    loadingProfile,
    fetchProfile,
    isLoading,
    error,
    isAuthenticated,
  };
}

// Hook spécialisé pour les fichiers OneDrive
export function useGraphFiles() {
  const { client, isLoading, error, isAuthenticated } = useGraphApi();
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  const fetchFiles = useCallback(async (folderId: string = 'root', top: number = 20) => {
    if (!isAuthenticated) return;

    setLoadingFiles(true);
    try {
      const driveItems = await client.getDriveItems(folderId, top);
      setFiles(driveItems);
    } catch (err) {
      console.error('Erreur lors de la récupération des fichiers:', err);
    } finally {
      setLoadingFiles(false);
    }
  }, [client, isAuthenticated]);

  const downloadFile = useCallback(async (itemId: string) => {
    if (!isAuthenticated) throw new Error('Non authentifié');

    try {
      const fileContent = await client.downloadFile(itemId);
      return fileContent;
    } catch (err) {
      console.error('Erreur lors du téléchargement du fichier:', err);
      throw err;
    }
  }, [client, isAuthenticated]);

  const uploadFile = useCallback(async (
    fileName: string,
    fileContent: ArrayBuffer | Buffer,
    folderPath: string = '/'
  ) => {
    if (!isAuthenticated) throw new Error('Non authentifié');

    try {
      const result = await client.uploadFile(fileName, fileContent, folderPath);
      return result;
    } catch (err) {
      console.error('Erreur lors de l\'upload du fichier:', err);
      throw err;
    }
  }, [client, isAuthenticated]);

  return {
    files,
    loadingFiles,
    fetchFiles,
    downloadFile,
    uploadFile,
    isLoading,
    error,
    isAuthenticated,
  };
}

// Hook spécialisé pour les paramètres de boîte aux lettres
export function useGraphMailboxSettings() {
  const { client, isLoading, error, isAuthenticated } = useGraphApi();
  const [settings, setSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  const fetchSettings = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingSettings(true);
    try {
      const mailboxSettings = await client.getMailboxSettings();
      setSettings(mailboxSettings);
    } catch (err) {
      console.error('Erreur lors de la récupération des paramètres:', err);
    } finally {
      setLoadingSettings(false);
    }
  }, [client, isAuthenticated]);

  const updateSettings = useCallback(async (newSettings: any) => {
    if (!isAuthenticated) throw new Error('Non authentifié');

    try {
      const result = await client.updateMailboxSettings(newSettings);
      setSettings(result);
      return result;
    } catch (err) {
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      throw err;
    }
  }, [client, isAuthenticated]);

  return {
    settings,
    loadingSettings,
    fetchSettings,
    updateSettings,
    isLoading,
    error,
    isAuthenticated,
  };
}
