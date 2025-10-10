import { NextRequest, NextResponse } from "next/server";
import { azureBlobService } from "@/lib/azure-blob-service";

export async function GET(request: NextRequest) {
  try {
    console.log("🔧 [Azure Test] Test de connexion Azure Blob Storage...");
    
    // Test de connexion et liste des fichiers
    const templates = await azureBlobService.listTemplates();
    
    console.log("✅ [Azure Test] Connexion réussie");
    console.log("📁 [Azure Test] Fichiers trouvés:", templates);
    
    return NextResponse.json({
      success: true,
      message: "Connexion Azure Blob Storage réussie",
      files: templates,
      count: templates.length
    });
    
  } catch (error) {
    console.error("❌ [Azure Test] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur de connexion Azure Blob Storage",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
