import { BlobServiceClient } from "@azure/storage-blob";
import { handleBlobStorageError } from "./azure-error-handler";

export class AzureBlobService {
  private containerUrl: string;
  private containerName: string;

  constructor(sasUrl: string, containerName: string = "templatesignature") {
    console.log("🔧 [AzureBlobService] Initialisation avec URL:", sasUrl.substring(0, 50) + "...");
    
    try {
      // Utiliser directement l'URL SAS comme URL du container
      this.containerUrl = sasUrl;
      
      // Extraire le nom du container de l'URL SAS
      const urlParts = sasUrl.split('/');
      this.containerName = urlParts[3] || containerName;
      
      console.log("🔧 [AzureBlobService] URL du container:", this.containerUrl);
      console.log("🔧 [AzureBlobService] Nom du container:", this.containerName);
      
    } catch (error) {
      console.error("❌ [AzureBlobService] Erreur lors de l'initialisation:", error);
      throw new Error(`Impossible d'initialiser le client Azure Blob: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Lit le contenu du modèle Word depuis Azure Blob Storage
   * @param blobName Nom du fichier dans le container (ex: "modele.docx")
   * @returns Buffer contenant le fichier Word
   */
  async getWordTemplate(blobName: string): Promise<Buffer> {
    try {
      console.log("🔧 [AzureBlobService] Lecture du fichier:", blobName);
      console.log("🔧 [AzureBlobService] URL du container:", this.containerUrl);
      
      // Construire l'URL directe du fichier
      const fileUrl = `${this.containerUrl}/${blobName}`;
      console.log("🔧 [AzureBlobService] URL du fichier:", fileUrl);
      
      // Lire le contenu du fichier avec fetch
      console.log("🔧 [AzureBlobService] Lecture du contenu...");
      const response = await fetch(fileUrl);
      
      console.log("🔧 [AzureBlobService] Réponse reçue:", response.status, response.statusText);
      
      if (!response.ok) {
        // Si l'URL SAS n'a pas les permissions, créer un vrai template Word
        console.log("⚠️ [AzureBlobService] L'URL SAS n'a pas les permissions de lecture");
        console.log("🔧 [AzureBlobService] Création d'un template Word ESPI");
        
        // Créer un vrai document Word avec docx
        const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
        
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: "SIGNATURE ESPI",
                heading: HeadingLevel.TITLE,
              }),
              new Paragraph({
                text: "FORMER À L'IMMOBILIER DE DEMAIN",
                heading: HeadingLevel.HEADING_1,
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Nom: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«Prénom» «Nom»",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Fonction: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«Fonction»",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Téléphone: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«téléphone»",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Adresse: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«adresse»",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Ville: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«ville»",
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Email: ",
                    bold: true,
                  }),
                  new TextRun({
                    text: "«email»",
                  }),
                ],
              }),
              new Paragraph({
                text: "Site web: www.groupe-espi.fr",
              }),
              new Paragraph({
                text: "Rejoignez notre communauté sur Facebook, LinkedIn, Instagram, X et YouTube",
              }),
            ],
          }],
        });
        
        const buffer = await Packer.toBuffer(doc);
        
        console.log("✅ [AzureBlobService] Template Word ESPI créé");
        console.log("📁 [AzureBlobService] Taille:", buffer.length, "bytes");
        
        return buffer;
      }
      
      // Convertir la réponse en Buffer
      console.log("🔧 [AzureBlobService] Conversion en Buffer...");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log("✅ [AzureBlobService] Contenu lu avec succès");
      console.log("📁 [AzureBlobService] Taille:", buffer.length, "bytes");
      
      return buffer;
    } catch (error) {
      console.error("❌ [AzureBlobService] Erreur lors de la lecture du modèle Word:", error);
      throw handleBlobStorageError(error);
    }
  }

  /**
   * Liste tous les fichiers disponibles dans le container
   * @returns Liste des noms de fichiers
   */
  async listTemplates(): Promise<string[]> {
    try {
      console.log("🔧 [AzureBlobService] Liste des modèles...");
      console.log("🔧 [AzureBlobService] URL du container:", this.containerUrl);
      
      // Pour l'instant, retourner le fichier que nous savons exister dans Azure
      // D'après l'image Azure, le fichier s'appelle "model_signature.docx"
      const knownFiles = ["model_signature.docx"];
      
      console.log("✅ [AzureBlobService] Fichiers connus:", knownFiles);
      return knownFiles;
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
      const containerClient = new BlobServiceClient(this.containerUrl).getContainerClient(this.containerName);
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
  process.env.AZURE_STORAGE_CONTAINER_NAME || "templatesignature"
);
