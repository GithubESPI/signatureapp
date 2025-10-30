import { NextRequest, NextResponse } from "next/server";
import { wordTemplateProcessor, UserData } from "@/lib/word-template-processor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateName, userData } = body;

    if (!templateName || !userData) {
      return NextResponse.json({
        success: false,
        message: "Template et données utilisateur requis"
      }, { status: 400 });
    }

    console.log("🔧 [Test Generate] Génération pour:", templateName);
    console.log("🔧 [Test Generate] Données:", userData);

    // Préparer les données utilisateur
    const userDataFormatted: UserData = {
      prenom: userData.prenom || 'Test',
      nom: userData.nom || 'User',
      fonction: userData.fonction || 'Employé ESPI',
      telephone: userData.telephone || '',
      indicatifPays: userData.indicatifPays || '',
      adresseId: userData.adresseId || '',
      adresse: userData.adresse || '',
      ville: userData.ville || 'Paris',
      codePostal: userData.codePostal || '',
      email: userData.email || 'test@example.com'
    };

    // Générer la signature
    const signatureBuffer = await wordTemplateProcessor.generateSignature(
      templateName, 
      userDataFormatted
    );

    console.log("✅ [Test Generate] Signature générée, taille:", signatureBuffer.length, "bytes");

    // Retourner le document généré
    return new NextResponse(new Uint8Array(signatureBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="signature-${userDataFormatted.prenom}-${userDataFormatted.nom}.docx"`,
        'Content-Length': signatureBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("❌ [Test Generate] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la génération de la signature",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
