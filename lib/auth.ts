import AzureADProvider from "next-auth/providers/azure-ad";
import type { NextAuthOptions } from "next-auth";

console.log("🔧 [Auth] Configuration NextAuth chargée");
console.log("🔧 [Auth] NODE_ENV:", process.env.NODE_ENV);
console.log("🔧 [Auth] NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_CLIENT_ID:", process.env.AZURE_AD_CLIENT_ID ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_CLIENT_SECRET:", process.env.AZURE_AD_CLIENT_SECRET ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [Auth] AZURE_AD_TENANT_ID:", process.env.AZURE_AD_TENANT_ID ? "✅ Présent" : "❌ Manquant");

// Vérifier la configuration des cookies
const isProduction = process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https://');
console.log("🔧 [Auth] Production mode:", isProduction);
console.log("🔧 [Auth] Secure cookies:", isProduction);

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
      
      // RÈGLE ABSOLUE: Si l'URL contient /login, TOUJOURS rediriger vers /dashboard
      // Cela évite toute boucle de redirection
      if (url.includes("/login")) {
        console.log("🔧 [Auth] URL contient /login, redirection FORCÉE vers dashboard");
        return `${baseUrl}/dashboard`;
      }
      
      try {
        // Construire l'URL complète pour l'analyser
        let urlObj: URL;
        if (url.startsWith("http://") || url.startsWith("https://")) {
          urlObj = new URL(url);
        } else {
          // Si c'est une URL relative, la construire avec baseUrl
          urlObj = new URL(url.startsWith("/") ? url : `/${url}`, baseUrl);
        }
        
        // PRIORITÉ 1: Extraire le callbackUrl depuis les paramètres de requête
        const callbackUrl = urlObj.searchParams.get("callbackUrl");
        if (callbackUrl) {
          console.log("🔧 [Auth] CallbackUrl trouvé dans les paramètres:", callbackUrl);
          
          try {
            // Décoder le callbackUrl s'il est encodé
            const decodedCallbackUrl = decodeURIComponent(callbackUrl);
            
            // Ignorer complètement si c'est /login
            if (decodedCallbackUrl.includes("/login")) {
              console.log("🔧 [Auth] CallbackUrl pointe vers /login, redirection vers dashboard");
              return `${baseUrl}/dashboard`;
            }
            
            // Si le callbackUrl est relatif, le construire avec baseUrl
            if (decodedCallbackUrl.startsWith("/")) {
              const redirectUrl = `${baseUrl}${decodedCallbackUrl}`;
              console.log("🔧 [Auth] Redirection vers callbackUrl (relatif):", redirectUrl);
              return redirectUrl;
            }
            
            // Si c'est une URL complète du même domaine, extraire le chemin
            const callbackUrlObj = new URL(decodedCallbackUrl);
            if (callbackUrlObj.origin === baseUrl) {
              const path = callbackUrlObj.pathname + callbackUrlObj.search;
              // Ignorer si c'est /login
              if (path.includes("/login")) {
                console.log("🔧 [Auth] CallbackUrl pointe vers /login, redirection vers dashboard");
                return `${baseUrl}/dashboard`;
              }
              console.log("🔧 [Auth] Redirection vers callbackUrl (même domaine):", path);
              return `${baseUrl}${path}`;
            }
          } catch (e) {
            console.error("🔧 [Auth] Erreur lors du parsing du callbackUrl:", e);
          }
        }
        
        // PRIORITÉ 2: Si l'URL est déjà le dashboard, la retourner directement
        const pathname = urlObj.pathname;
        if (pathname === "/dashboard" || url === `${baseUrl}/dashboard` || url === "/dashboard") {
          console.log("🔧 [Auth] Redirection directe vers dashboard");
          return `${baseUrl}/dashboard`;
        }
        
        // PRIORITÉ 3: Si l'URL est du même domaine que baseUrl, extraire le chemin
        if (urlObj.origin === baseUrl) {
          const path = urlObj.pathname + urlObj.search;
          // Toujours éviter /login
          if (path.includes("/login")) {
            console.log("🔧 [Auth] Path contient /login, redirection vers dashboard");
            return `${baseUrl}/dashboard`;
          }
          console.log("🔧 [Auth] Redirection vers (même domaine):", `${baseUrl}${path}`);
          return `${baseUrl}${path}`;
        }
        
        // PRIORITÉ 4: Si l'URL est relative et n'est pas /login, l'utiliser
        if (url.startsWith("/") && !url.includes("/login")) {
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
  // Détecter si on est en production (HTTPS) ou en développement (HTTP)
  // En production, les cookies doivent être sécurisés pour fonctionner avec HTTPS
  useSecureCookies: process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https://'),
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // En production avec HTTPS, secure doit être true
        secure: process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https://')
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https://')
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' || process.env.NEXTAUTH_URL?.startsWith('https://')
      }
    }
  }
};
