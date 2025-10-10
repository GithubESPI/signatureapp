import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const envVars = {
    AZURE_STORAGE_CONNECTION_STRING: process.env.AZURE_STORAGE_CONNECTION_STRING ? "✅ Présent" : "❌ Manquant",
    AZURE_STORAGE_CONTAINER_NAME: process.env.AZURE_STORAGE_CONTAINER_NAME ? "✅ Présent" : "❌ Manquant",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Présent" : "❌ Manquant",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✅ Présent" : "❌ Manquant",
    AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID ? "✅ Présent" : "❌ Manquant",
    AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? "✅ Présent" : "❌ Manquant",
    AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID ? "✅ Présent" : "❌ Manquant",
  };

  return NextResponse.json({
    message: "État des variables d'environnement",
    variables: envVars,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.includes('AZURE') || key.includes('NEXTAUTH')
    )
  });
}
