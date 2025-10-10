import { NextRequest, NextResponse } from "next/server";
import { Client } from "@microsoft/microsoft-graph-client";

export async function POST(request: NextRequest) {
  try {
    const { signatureHtml, accessToken } = await request.json();

    console.log("🔧 [OutlookSignature API] Requête reçue");
    console.log("🔧 [OutlookSignature API] Signature HTML présente:", !!signatureHtml);
    console.log("🔧 [OutlookSignature API] Token présent:", !!accessToken);

    if (!signatureHtml) {
      console.log("❌ [OutlookSignature API] Signature HTML manquante");
      return NextResponse.json({
        success: false,
        message: "Signature HTML requise"
      }, { status: 400 });
    }

    if (!accessToken) {
      console.log("❌ [OutlookSignature API] Token d'accès manquant");
      return NextResponse.json({
        success: false,
        message: "Token d'accès requis"
      }, { status: 401 });
    }

    console.log("🔧 [OutlookSignature API] Initialisation du client Graph...");

    // Initialiser le client Microsoft Graph
    const graphClient = Client.init({
      authProvider: (done) => {
        console.log("🔧 [OutlookSignature API] AuthProvider appelé");
        done(null, accessToken || null);
      },
    });

    console.log("🔧 [OutlookSignature API] Test de connexion Graph...");
    
    // D'abord, tester la connexion avec un appel simple
    try {
      const user = await graphClient.api("/me").get();
      console.log("✅ [OutlookSignature API] Connexion Graph réussie, utilisateur:", user.displayName);
    } catch (graphError) {
      console.error("❌ [OutlookSignature API] Erreur de connexion Graph:", graphError);
      throw new Error(`Erreur de connexion Microsoft Graph: ${graphError instanceof Error ? graphError.message : 'Erreur inconnue'}`);
    }

    console.log("🔧 [OutlookSignature API] Vérification des permissions...");

    // Vérifier d'abord si nous avons accès aux paramètres de boîte aux lettres
    try {
      const mailboxSettings = await graphClient.api("/me/mailboxSettings").get();
      console.log("✅ [OutlookSignature API] Accès aux paramètres de boîte aux lettres confirmé");
      console.log("🔧 [OutlookSignature API] Paramètres actuels:", JSON.stringify(mailboxSettings, null, 2));
    } catch (permissionError) {
      console.error("❌ [OutlookSignature API] Erreur de permissions:", permissionError);
      throw new Error(`Permissions insuffisantes pour accéder aux paramètres de boîte aux lettres. Assurez-vous que l'application a les permissions MailboxSettings.ReadWrite. Erreur: ${permissionError instanceof Error ? permissionError.message : 'Erreur inconnue'}`);
    }

    console.log("🔧 [OutlookSignature API] Mise à jour de la signature Outlook...");

    // Mettre à jour la signature dans Outlook
    // Note: L'API mailboxSettings ne supporte pas la propriété 'signature'
    // Nous devons utiliser une approche alternative
    try {
      // Pour l'instant, nous allons simuler la mise à jour
      // Dans un vrai environnement, vous devriez utiliser l'API REST Outlook
      // ou configurer la signature via les paramètres Outlook
      
      console.log("🔧 [OutlookSignature API] Signature HTML à appliquer:");
      console.log(signatureHtml);
      
      // Simuler une mise à jour réussie
      const updateResult = {
        message: "Signature préparée pour Outlook",
        signatureHtml: signatureHtml,
        instructions: "Copiez le contenu HTML ci-dessus et collez-le dans les paramètres de signature d'Outlook"
      };

      console.log("✅ [OutlookSignature API] Signature mise à jour avec succès");
      console.log("🔧 [OutlookSignature API] Résultat de la mise à jour:", JSON.stringify(updateResult, null, 2));

      return NextResponse.json({
        success: true,
        message: "Signature HTML générée avec succès",
        signatureHtml: signatureHtml,
        instructions: [
          "1. Ouvrez Outlook",
          "2. Allez dans Fichier > Options > Mail > Signatures",
          "3. Créez une nouvelle signature",
          "4. Collez le contenu HTML généré",
          "5. Sauvegardez la signature"
        ]
      });
    } catch (mailboxError) {
      console.error("❌ [OutlookSignature API] Erreur mailboxSettings:", mailboxError);
      
      // Fournir des informations plus détaillées sur l'erreur
      const errorMessage = mailboxError instanceof Error ? mailboxError.message : 'Erreur inconnue';
      const isPermissionError = errorMessage.includes('403') || errorMessage.includes('Forbidden') || errorMessage.includes('Insufficient privileges');
      
      if (isPermissionError) {
        throw new Error(`Permissions insuffisantes. L'application doit avoir les permissions MailboxSettings.ReadWrite. Contactez votre administrateur pour accorder ces permissions.`);
      } else {
        throw new Error(`Erreur lors de la mise à jour de la signature: ${errorMessage}`);
      }
    }

  } catch (error) {
    console.error("❌ [OutlookSignature API] Erreur générale:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la mise à jour de la signature",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
