import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log("🔧 [Debug] Route API debug appelée");
  console.log("🔧 [Debug] URL:", request.url);
  console.log("🔧 [Debug] Method:", request.method);
  
  return NextResponse.json({ 
    message: 'Debug API working',
    timestamp: new Date().toISOString(),
    url: request.url,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✅ Défini" : "❌ Manquant",
      AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID ? "✅ Défini" : "❌ Manquant",
      AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET ? "✅ Défini" : "❌ Manquant",
      AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID ? "✅ Défini" : "❌ Manquant",
    }
  });
}
