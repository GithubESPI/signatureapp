import { NextRequest, NextResponse } from "next/server";
import { azureBlobService } from "@/lib/azure-blob-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file') || 'model_signature.docx';
    
    console.log("🔧 [Download Template] Téléchargement du fichier:", fileName);
    
    const fileBuffer = await azureBlobService.getWordTemplate(fileName);
    
    console.log("✅ [Download Template] Fichier téléchargé avec succès");
    console.log("📁 [Download Template] Taille du fichier:", fileBuffer.length, "bytes");
    
    // Convertir le Buffer en ArrayBuffer pour NextResponse
    const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength) as ArrayBuffer;
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error("❌ [Download Template] Erreur:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors du téléchargement du fichier",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
