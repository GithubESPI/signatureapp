/**
 * Convertisseur de signature Word vers HTML pour Outlook
 */

export interface SignatureData {
  prenom: string;
  nom: string;
  fonction: string;
  telephone: string;
  adresse: string;
  ville: string;
  email: string;
  siteWeb?: string;
  tagline?: string;
  reseauxSociaux?: string;
}

export class SignatureConverter {
  /**
   * Convertit les données de signature en HTML pour Outlook
   * @param data Données de la signature
   * @returns HTML de la signature
   */
  static convertToHtml(data: SignatureData): string {
    const {
      prenom,
      nom,
      fonction,
      telephone,
      adresse,
      ville,
      email,
      siteWeb = "www.groupe-espi.fr",
      tagline = "FORMER À L'IMMOBILIER DE DEMAIN",
      reseauxSociaux = "Rejoignez notre communauté sur Facebook, LinkedIn, Instagram, X et YouTube"
    } = data;

    const fullName = `${prenom} ${nom}`;
    const fullAddress = adresse ? `${adresse}, ${ville}` : ville;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signature ESPI</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <!-- Header ESPI -->
    <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 24px; font-weight: bold;">ESPI</h1>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">${tagline}</p>
    </div>

    <!-- Informations de contact -->
    <div style="padding: 20px; background-color: #f8f9fa; border-left: 4px solid #2c5aa0;">
      <h2 style="margin: 0 0 15px 0; color: #2c5aa0; font-size: 18px;">${fullName}</h2>
      
      <div style="margin-bottom: 10px;">
        <strong style="color: #2c5aa0;">Fonction:</strong> ${fonction}
      </div>
      
      ${telephone ? `
      <div style="margin-bottom: 10px;">
        <strong style="color: #2c5aa0;">Téléphone:</strong> 
        <a href="tel:${telephone}" style="color: #2c5aa0; text-decoration: none;">${telephone}</a>
      </div>
      ` : ''}
      
      ${fullAddress ? `
      <div style="margin-bottom: 10px;">
        <strong style="color: #2c5aa0;">Adresse:</strong> ${fullAddress}
      </div>
      ` : ''}
      
      <div style="margin-bottom: 10px;">
        <strong style="color: #2c5aa0;">Email:</strong> 
        <a href="mailto:${email}" style="color: #2c5aa0; text-decoration: none;">${email}</a>
      </div>
      
      <div style="margin-bottom: 10px;">
        <strong style="color: #2c5aa0;">Site web:</strong> 
        <a href="https://${siteWeb}" style="color: #2c5aa0; text-decoration: none;">${siteWeb}</a>
      </div>
    </div>

    <!-- Réseaux sociaux -->
    <div style="padding: 15px; text-align: center; background-color: #e9ecef; margin-top: 20px;">
      <p style="margin: 0; color: #6c757d; font-size: 14px;">
        <strong>Réseaux sociaux:</strong><br>
        ${reseauxSociaux}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 20px; padding: 10px; border-top: 2px solid #2c5aa0;">
      <p style="margin: 0; color: #6c757d; font-size: 12px;">
        © ${new Date().getFullYear()} ESPI - École Supérieure des Professions Immobilières
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Génère une version simplifiée de la signature (texte uniquement)
   * @param data Données de la signature
   * @returns Signature en texte simple
   */
  static convertToText(data: SignatureData): string {
    const {
      prenom,
      nom,
      fonction,
      telephone,
      adresse,
      ville,
      email,
      siteWeb = "www.groupe-espi.fr",
      tagline = "FORMER À L'IMMOBILIER DE DEMAIN"
    } = data;

    const fullName = `${prenom} ${nom}`;
    const fullAddress = adresse ? `${adresse}, ${ville}` : ville;

    return `
${fullName}
${fonction}

${telephone ? `Téléphone: ${telephone}` : ''}
${fullAddress ? `Adresse: ${fullAddress}` : ''}
Email: ${email}
Site web: ${siteWeb}

${tagline}
    `.trim();
  }
}
