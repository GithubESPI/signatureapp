import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Client } from "@microsoft/microsoft-graph-client";

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({
        success: false,
        message: "Non authentifié ou token d'accès manquant"
      }, { status: 401 });
    }

    console.log("🔧 [Test Graph Permissions] Test des permissions Microsoft Graph...");

    // Initialiser le client Microsoft Graph
    const graphClient = Client.init({
      authProvider: (done) => {
        done(null, session.accessToken || null);
      },
    });

    const results: any = {};

    // Test 1: Informations utilisateur de base
    try {
      const user = await graphClient.api("/me").get();
      results.userInfo = {
        success: true,
        data: {
          displayName: user.displayName,
          email: user.mail || user.userPrincipalName,
          id: user.id
        }
      };
      console.log("✅ [Test Graph] Informations utilisateur récupérées");
    } catch (error) {
      results.userInfo = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      console.error("❌ [Test Graph] Erreur utilisateur:", error);
    }

    // Test 2: Paramètres de boîte aux lettres (lecture)
    try {
      const mailboxSettings = await graphClient.api("/me/mailboxSettings").get();
      results.mailboxSettings = {
        success: true,
        data: mailboxSettings
      };
      console.log("✅ [Test Graph] Paramètres de boîte aux lettres récupérés");
    } catch (error) {
      results.mailboxSettings = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      console.error("❌ [Test Graph] Erreur paramètres boîte aux lettres:", error);
    }

    // Test 3: Permissions de l'application
    try {
      const permissions = await graphClient.api("/me/oauth2PermissionGrants").get();
      results.permissions = {
        success: true,
        data: permissions
      };
      console.log("✅ [Test Graph] Permissions récupérées");
    } catch (error) {
      results.permissions = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      console.error("❌ [Test Graph] Erreur permissions:", error);
    }

    // Test 4: Messages (pour vérifier Mail.ReadWrite)
    try {
      const messages = await graphClient.api("/me/messages").top(1).get();
      results.messages = {
        success: true,
        data: { count: messages.value?.length || 0 }
      };
      console.log("✅ [Test Graph] Messages récupérés");
    } catch (error) {
      results.messages = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        details: error
      };
      console.error("❌ [Test Graph] Erreur messages:", error);
    }

    // Test 5: Vérifier les scopes du token
    try {
      const tokenInfo = await graphClient.api("/me").select("id,displayName").get();
      results.tokenInfo = {
        success: true,
        data: {
          hasToken: !!session.accessToken,
          tokenLength: session.accessToken?.length || 0,
          userInfo: tokenInfo
        }
      };
      console.log("✅ [Test Graph] Informations du token récupérées");
    } catch (error) {
      results.tokenInfo = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
      console.error("❌ [Test Graph] Erreur token info:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Test des permissions Microsoft Graph terminé",
      results
    });

  } catch (error) {
    console.error("❌ [Test Graph Permissions] Erreur générale:", error);
    
    return NextResponse.json({
      success: false,
      message: "Erreur lors du test des permissions",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}
