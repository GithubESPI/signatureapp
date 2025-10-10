import { BlobServiceClient, ContainerClient, BlobClient } from "@azure/storage-blob";
import { handleBlobStorageError, AzureBlobError } from "./azure-error-handler";

export class AzureBlobService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(connectionString: string, containerName: string = "signatures") {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    this.containerName = containerName;
  }

  /**
   * Récupère le modèle Word depuis Azure Blob Storage
   * @param blobName Nom du fichier dans le container (ex: "modele.docx")
   * @returns Buffer contenant le fichier Word
   */
  async getWordTemplate(blobName: string): Promise<Buffer> {
    try {
      const containerClient: ContainerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobClient: BlobClient = containerClient.getBlobClient(blobName);
      
      // Vérifier si le blob existe
      const exists = await blobClient.exists();
      if (!exists) {
        throw new Error(`Le fichier ${blobName} n'existe pas dans le container ${this.containerName}`);
      }

      // Télécharger le blob
      const downloadBlockBlobResponse = await blobClient.download();
      
      if (!downloadBlockBlobResponse.readableStreamBody) {
        throw new Error("Impossible de télécharger le fichier");
      }

      // Convertir le stream en Buffer
      const chunks: Uint8Array[] = [];
      const reader = (downloadBlockBlobResponse.readableStreamBody as any).getReader();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }

      // Concaténer tous les chunks en un seul Buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return Buffer.from(result);
    } catch (error) {
      console.error("Erreur lors de la récupération du modèle Word:", error);
      throw handleBlobStorageError(error);
    }
  }

  /**
   * Liste tous les fichiers disponibles dans le container
   * @returns Liste des noms de fichiers
   */
  async listTemplates(): Promise<string[]> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const templates: string[] = [];
      
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.endsWith('.docx')) {
          templates.push(blob.name);
        }
      }
      
      return templates;
    } catch (error) {
      console.error("Erreur lors de la liste des modèles:", error);
      throw handleBlobStorageError(error);
    }
  }

  /**
   * Vérifie si un fichier existe dans le container
   * @param blobName Nom du fichier
   * @returns true si le fichier existe
   */
  async templateExists(blobName: string): Promise<boolean> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blobClient = containerClient.getBlobClient(blobName);
      return await blobClient.exists();
    } catch (error) {
      console.error("Erreur lors de la vérification de l'existence du fichier:", error);
      // Pour la vérification d'existence, on retourne false plutôt que de lancer une erreur
      return false;
    }
  }
}

// Instance singleton pour l'application
export const azureBlobService = new AzureBlobService(
  process.env.AZURE_STORAGE_CONNECTION_STRING || "",
  process.env.AZURE_STORAGE_CONTAINER_NAME || "signatures"
);
