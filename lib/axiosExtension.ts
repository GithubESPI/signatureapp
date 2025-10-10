import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuration de base pour Microsoft Graph API
const GRAPH_API_BASE_URL = process.env.NEXT_PUBLIC_GRAPH_API || 'https://graph.microsoft.com/v1.0';

// Interface pour les réponses Graph API
export interface GraphApiResponse<T = any> {
  value: T[];
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
}

// Interface pour les erreurs Graph API
export interface GraphApiError {
  error: {
    code: string;
    message: string;
    innerError?: {
      'request-id': string;
      date: string;
    };
  };
}

// Classe principale pour les appels Graph API
export class GraphApiClient {
  private axiosInstance: AxiosInstance;
  private accessToken: string | null = null;

  constructor(baseURL: string = GRAPH_API_BASE_URL) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.data?.error) {
          const graphError: GraphApiError = error.response.data;
          console.error('Graph API Error:', graphError.error);
          throw new Error(`Graph API Error: ${graphError.error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Définit le token d'accès pour l'authentification
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Récupère le profil de l'utilisateur connecté
   */
  async getMe(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/me');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }

  /**
   * Récupère les emails de l'utilisateur
   */
  async getMessages(folderId: string = 'inbox', top: number = 10): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/me/mailFolders/${folderId}/messages`, {
        params: {
          $top: top,
          $orderby: 'receivedDateTime desc',
          $select: 'id,subject,from,receivedDateTime,bodyPreview,hasAttachments',
        },
      });
      return response.data.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des emails:', error);
      throw error;
    }
  }

  /**
   * Envoie un email
   */
  async sendMail(message: {
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
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/me/sendMail', {
        message,
        saveToSentItems: true,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }

  /**
   * Marque un email comme lu
   */
  async markAsRead(messageId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.patch(`/me/messages/${messageId}`, {
        isRead: true,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  /**
   * Marque un email comme non lu
   */
  async markAsUnread(messageId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.patch(`/me/messages/${messageId}`, {
        isRead: false,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du marquage comme non lu:', error);
      throw error;
    }
  }

  /**
   * Supprime un email
   */
  async deleteMessage(messageId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/me/messages/${messageId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'email:', error);
      throw error;
    }
  }

  /**
   * Déplace un email vers un dossier
   */
  async moveMessage(messageId: string, destinationId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/me/messages/${messageId}/move`, {
        destinationId,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du déplacement de l\'email:', error);
      throw error;
    }
  }

  /**
   * Copie un email vers un dossier
   */
  async copyMessage(messageId: string, destinationId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.post(`/me/messages/${messageId}/copy`, {
        destinationId,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la copie de l\'email:', error);
      throw error;
    }
  }

  /**
   * Récupère les dossiers de l'utilisateur
   */
  async getMailFolders(): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/me/mailFolders');
      return response.data.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des dossiers:', error);
      throw error;
    }
  }

  /**
   * Récupère les paramètres de la boîte aux lettres
   */
  async getMailboxSettings(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/me/mailboxSettings');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres de boîte aux lettres:', error);
      throw error;
    }
  }

  /**
   * Met à jour les paramètres de la boîte aux lettres
   */
  async updateMailboxSettings(settings: {
    automaticRepliesSetting?: {
      status: 'disabled' | 'alwaysEnabled' | 'scheduled';
      externalAudience?: 'none' | 'contactsOnly' | 'all';
      internalReplyMessage?: string;
      externalReplyMessage?: string;
      scheduledStartDateTime?: {
        dateTime: string;
        timeZone: string;
      };
      scheduledEndDateTime?: {
        dateTime: string;
        timeZone: string;
      };
    };
    timeZone?: string;
    language?: {
      locale: string;
      displayName: string;
    };
    workingHours?: {
      daysOfWeek: string[];
      startTime: string;
      endTime: string;
      timeZone: {
        name: string;
      };
    };
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.patch('/me/mailboxSettings', settings);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de boîte aux lettres:', error);
      throw error;
    }
  }

  /**
   * Récupère les contacts de l'utilisateur
   */
  async getContacts(top: number = 50): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/me/contacts', {
        params: {
          $top: top,
          $orderby: 'displayName',
        },
      });
      return response.data.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des contacts:', error);
      throw error;
    }
  }

  /**
   * Récupère les événements du calendrier
   */
  async getEvents(top: number = 10): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get('/me/events', {
        params: {
          $top: top,
          $orderby: 'start/dateTime',
          $select: 'id,subject,start,end,location,attendees',
        },
      });
      return response.data.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  }

  /**
   * Crée un événement dans le calendrier
   */
  async createEvent(event: {
    subject: string;
    body: {
      contentType: 'Text' | 'HTML';
      content: string;
    };
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
    attendees?: Array<{
      emailAddress: {
        address: string;
        name?: string;
      };
      type: 'required' | 'optional' | 'resource';
    }>;
  }): Promise<any> {
    try {
      const response = await this.axiosInstance.post('/me/events', event);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  }

  /**
   * Récupère les fichiers OneDrive de l'utilisateur
   */
  async getDriveItems(folderId: string = 'root', top: number = 20): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/me/drive/items/${folderId}/children`, {
        params: {
          $top: top,
          $orderby: 'name',
        },
      });
      return response.data.value;
    } catch (error) {
      console.error('Erreur lors de la récupération des fichiers:', error);
      throw error;
    }
  }

  /**
   * Télécharge un fichier depuis OneDrive
   */
  async downloadFile(itemId: string): Promise<ArrayBuffer> {
    try {
      const response = await this.axiosInstance.get(`/me/drive/items/${itemId}/content`, {
        responseType: 'arraybuffer',
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier:', error);
      throw error;
    }
  }

  /**
   * Upload un fichier vers OneDrive
   */
  async uploadFile(
    fileName: string,
    fileContent: ArrayBuffer | Buffer,
    folderPath: string = '/'
  ): Promise<any> {
    try {
      const response = await this.axiosInstance.put(
        `/me/drive/root:${folderPath}${fileName}:/content`,
        fileContent,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'upload du fichier:', error);
      throw error;
    }
  }

  /**
   * Méthode générique pour les appels API personnalisés
   */
  async customRequest<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.axiosInstance.request({
        method,
        url: endpoint,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'appel ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie si le token est valide
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Instance singleton pour l'application
export const graphApiClient = new GraphApiClient();

// Fonctions utilitaires
export const graphApiUtils = {
  /**
   * Formate une adresse email pour Graph API
   */
  formatEmailAddress: (email: string, name?: string) => ({
    emailAddress: {
      address: email,
      name: name || email,
    },
  }),

  /**
   * Formate une date pour Graph API
   */
  formatDateTime: (date: Date, timeZone: string = 'UTC') => ({
    dateTime: date.toISOString(),
    timeZone,
  }),

  /**
   * Crée un objet de pièce jointe pour les emails
   */
  createAttachment: (name: string, contentType: string, content: string) => ({
    '@odata.type': '#microsoft.graph.fileAttachment',
    name,
    contentType,
    contentBytes: content,
  }),
};

// Export par défaut
export default GraphApiClient;
