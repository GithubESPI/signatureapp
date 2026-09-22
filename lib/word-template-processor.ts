import { createReport } from 'docx-templates';
import { azureBlobService } from './azure-blob-service';

export interface UserData {
  prenom: string;
  nom: string;
  fonction: string;
  telephone: string;
  indicatifPays: string;
  adresseId: string;
  adresse: string;
  ville: string;
  codePostal: string;
  email: string;
  nomService?: string;
}

export class WordTemplateProcessor {
  /**
   * Génère une signature personnalisée à partir du template
   * @param templateName Nom du fichier template
   * @param userData Données de l'utilisateur
   * @returns Buffer du document Word généré
   */
  async generateSignature(templateName: string, userData: UserData): Promise<Buffer> {
    try {
      console.log("🔧 [TemplateProcessor] Génération de signature pour:", templateName);
      console.log("🔧 [TemplateProcessor] Données utilisateur:", userData);
      
      // Récupérer le template depuis Azure
      console.log("🔧 [TemplateProcessor] Récupération du template depuis Azure...");
      const templateBuffer = await azureBlobService.getWordTemplate(templateName);
      console.log("✅ [TemplateProcessor] Template récupéré, taille:", templateBuffer.length, "bytes");
      
      // Préparer les données pour le template
      // Nettoyer les virgules des valeurs individuelles
      const cleanAdresse = (userData.adresse || '').replace(/,/g, '').trim();
      const cleanCodePostal = (userData.codePostal || '').replace(/,/g, '').trim();
      const cleanVille = (userData.ville || '').replace(/,/g, '').trim();
      
      // Formater l'adresse complète sans virgules
      const adresseComplete = [cleanAdresse, cleanCodePostal, cleanVille]
        .filter(Boolean)
        .join(' ');
      
      const templateData = {
        prenom: userData.prenom,
        nom: userData.nom,
        nomComplet: `${userData.prenom} ${userData.nom}`,
        fonction: userData.fonction,
        telephone: userData.telephone,
        adresse: cleanAdresse,
        codePostal: cleanCodePostal,
        ville: cleanVille,
        adresseComplete: adresseComplete,
        email: userData.email,
        siteWeb: "www.groupe-espi.fr",
        tagline: "FORMER À L'IMMOBILIER DE DEMAIN",
        reseauxSociaux: "Rejoignez notre communauté sur Facebook, LinkedIn, Instagram, X et YouTube"
      };
      
      console.log("🔧 [TemplateProcessor] Données du template:", templateData);
      
      // Générer le document avec docx-templates
      const report = await createReport({
        template: templateBuffer,
        data: templateData,
        additionalJsContext: {
          // Fonctions utilitaires pour le template
          formatPhone: (phone: string) => phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5'),
          formatAddress: (address: string, city: string) => `${address} ${city}`,
          formatFullAddress: (address: string, codePostal: string, city: string) => {
            const cleanAddr = (address || '').replace(/,/g, '').trim();
            const cleanCP = (codePostal || '').replace(/,/g, '').trim();
            const cleanCity = (city || '').replace(/,/g, '').trim();
            return [cleanAddr, cleanCP, cleanCity].filter(Boolean).join(' ');
          },
          getInitials: (prenom: string, nom: string) => `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
        }
      });
      
      console.log("✅ [TemplateProcessor - generateSignature] Document généré avec succès");
      return Buffer.from(report);
      
    } catch (error) {
      console.error("❌ [TemplateProcessor] Erreur lors de la génération:", error);
      throw new Error(`Impossible de générer la signature: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
  
  /**
   * Extrait les informations d'un document Word existant
   * @param templateName Nom du fichier template
   * @returns Informations extraites du document
   */
  async extractTemplateInfo(templateName: string): Promise<{
    placeholders: string[];
    content: string;
  }> {
    try {
      console.log("🔧 [TemplateProcessor] Extraction des informations du template:", templateName);
      
      // Récupérer le template
      const templateBuffer = await azureBlobService.getWordTemplate(templateName);
      
      // Pour l'instant, retourner les placeholders connus du modèle ESPI
      const placeholders = [
        'prenom',
        'nom', 
        'fonction',
        'telephone',
        'adresse',
        'ville',
        'email'
      ];
      
      const content = new TextDecoder().decode(templateBuffer);
      
      console.log("✅ [TemplateProcessor] Informations extraites");
      return {
        placeholders,
        content
      };
      
    } catch (error) {
      console.error("❌ [TemplateProcessor] Erreur lors de l'extraction:", error);
      throw new Error(`Impossible d'extraire les informations: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }
}

// Instance singleton
export const wordTemplateProcessor = new WordTemplateProcessor();
