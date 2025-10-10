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
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
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
      // Rediriger vers la page de succès après connexion
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/auth-success`;
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
