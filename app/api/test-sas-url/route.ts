import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const sasUrl = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    if (!sasUrl) {
      return NextResponse.json({
        success: false,
        message: "URL SAS non trouvée"
      }, { status: 500 });
    }
    
    console.log("🔧 [SAS Test] URL SAS:", sasUrl);
    
    // Tester l'URL SAS directement
    const testUrl = `${sasUrl}/model_signature.docx`;
    console.log("🔧 [SAS Test] URL de test:", testUrl);
    
    const response = await fetch(testUrl, {
      method: 'HEAD' // Utiliser HEAD pour tester sans télécharger
    });
    
    console.log("🔧 [SAS Test] Réponse:", response.status, response.statusText);
    console.log("🔧 [SAS Test] Headers:", Object.fromEntries(response.headers.entries()));
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: testUrl
    });
    
  } catch (error) {
    console.error("❌ [SAS Test] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors du test de l'URL SAS",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
