import AzureADProvider from "next-auth/providers/azure-ad";
import type { NextAuthOptions } from "next-auth";

console.log("🔧 [Auth] Configuration NextAuth chargée");
console.log("🔧 [Auth] NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] NEXTAUTH_URL:", process.env.NEXTAUTH_URL ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_CLIENT_ID:", process.env.AZURE_AD_CLIENT_ID ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_CLIENT_SECRET:", process.env.AZURE_AD_CLIENT_SECRET ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_TENANT_ID:", process.env.AZURE_AD_TENANT_ID ? "✅ Présent" : "❌ Manquant");

export const authOptions: NextAuthOptions = {
        providers: [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID || "",
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
            tenantId: process.env.AZURE_AD_TENANT_ID || "",
            authorization: {
              params: {
                scope: "openid profile email User.Read Mail.ReadWrite MailboxSettings.ReadWrite"
              }
            },
            // Ajouter des logs pour vérifier les scopes
            profile(profile) {
              console.log("🔧 [Auth] Profile reçu:", profile);
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
              };
            }
          }),
        ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("🔧 [Auth] Token reçu avec scopes:", account.scope);
        console.log("🔧 [Auth] Access token présent:", !!account.access_token);
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("🔧 [Auth] Redirection:", { url, baseUrl });
      
      try {
        // Si l'URL est une URL complète, essayer de l'analyser
        let urlObj: URL;
        if (url.startsWith("http://") || url.startsWith("https://")) {
          urlObj = new URL(url);
        } else {
          // Si c'est une URL relative, la construire avec baseUrl
          urlObj = new URL(url.startsWith("/") ? url : `/${url}`, baseUrl);
        }
        
        // Vérifier si l'URL contient un paramètre callbackUrl
        const callbackUrl = urlObj.searchParams.get("callbackUrl");
        if (callbackUrl) {
          console.log("🔧 [Auth] CallbackUrl trouvé dans les paramètres:", callbackUrl);
          // Si le callbackUrl est relatif, le construire avec baseUrl
          if (callbackUrl.startsWith("/")) {
            const redirectUrl = `${baseUrl}${callbackUrl}`;
            console.log("🔧 [Auth] Redirection vers callbackUrl:", redirectUrl);
            return redirectUrl;
          }
          // Si c'est une URL complète du même domaine, l'utiliser
          try {
            const callbackUrlObj = new URL(callbackUrl);
            if (callbackUrlObj.origin === baseUrl) {
              console.log("🔧 [Auth] Redirection vers callbackUrl (même domaine):", callbackUrl);
              return callbackUrl;
            }
          } catch (e) {
            // callbackUrl invalide, continuer
          }
        }
        
        // Si l'URL est du même domaine que baseUrl, l'utiliser
        if (urlObj.origin === baseUrl) {
          console.log("🔧 [Auth] Redirection vers (même domaine):", urlObj.href);
          return urlObj.href;
        }
        
        // Si l'URL est relative, la construire avec baseUrl
        if (url.startsWith("/")) {
          const fullUrl = `${baseUrl}${url}`;
          console.log("🔧 [Auth] Redirection vers (relative):", fullUrl);
          return fullUrl;
        }
      } catch (e) {
        console.error("🔧 [Auth] Erreur lors du parsing de l'URL:", e);
      }
      
      // Par défaut, rediriger vers le dashboard
      console.log("🔧 [Auth] Redirection par défaut vers dashboard");
      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth-error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "CCDtuslb47m68jql1f17EXGvn7H/6TAkiRz0kayQOTw=",
  debug: true,
  // Ajouter des options supplémentaires pour résoudre le problème de secret
  useSecureCookies: false,
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false
      }
    }
  }
};
