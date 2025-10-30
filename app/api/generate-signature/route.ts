import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { wordTemplateProcessor, UserData } from "@/lib/word-template-processor";

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        message: "Non authentifié"
      }, { status: 401 });
    }

    const body = await request.json();
    const { templateName, userData } = body;

    if (!templateName || !userData) {
      return NextResponse.json({
        success: false,
        message: "Template et données utilisateur requis"
      }, { status: 400 });
    }

    console.log("🔧 [Generate Signature] Génération pour:", templateName);
    console.log("🔧 [Generate Signature] Utilisateur:", session.user.name);
    console.log("🔧 [Generate Signature] Données:", userData);

    // Préparer les données utilisateur
    const userDataFormatted: UserData = {
      prenom: userData.prenom || session.user.name?.split(' ')[0] || '',
      nom: userData.nom || session.user.name?.split(' ').slice(1).join(' ') || '',
      fonction: userData.fonction || 'Employé',
      telephone: userData.telephone || '',
      indicatifPays: userData.indicatifPays || '',
      adresseId: userData.adresseId || '',
      adresse: userData.adresse || '',
      ville: userData.ville || '',
      codePostal: userData.codePostal || '',
      email: userData.email || session.user.email || ''
    };

    // Générer la signature
    const signatureBuffer = await wordTemplateProcessor.generateSignature(
      templateName, 
      userDataFormatted
    );

    console.log("✅ [Generate Signature] Signature générée, taille:", signatureBuffer.length, "bytes");

    // Retourner le document généré
    return new NextResponse(new Uint8Array(signatureBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="signature-${userDataFormatted.prenom}-${userDataFormatted.nom}.docx"`,
        'Content-Length': signatureBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error("❌ [Generate Signature] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la génération de la signature",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    console.log("🔧 [Generate Signature] Session:", session ? "Présente" : "Absente");
    
    if (!session?.user) {
      console.log("❌ [Generate Signature] Utilisateur non authentifié");
      return NextResponse.json({
        success: false,
        message: "Non authentifié"
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const templateName = searchParams.get('template') || 'model_signature.docx';

    console.log("🔧 [Generate Signature] Extraction des informations du template:", templateName);

    // Extraire les informations du template
    const templateInfo = await wordTemplateProcessor.extractTemplateInfo(templateName);

    return NextResponse.json({
      success: true,
      template: templateName,
      placeholders: templateInfo.placeholders,
      content: templateInfo.content,
      user: {
        name: session.user.name,
        email: session.user.email
      }
    });

  } catch (error) {
    console.error("❌ [Generate Signature] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors de l'extraction des informations du template",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
