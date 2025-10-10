import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// S'assurer que les variables d'environnement sont disponibles
// NextAuth a besoin de ces variables au moment de l'exécution
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required");
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error("NEXTAUTH_URL is required");
}

console.log("🔧 [NextAuth Route] Variables d'environnement chargées depuis .env");
console.log("🔧 [NextAuth Route] NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ Présent" : "❌ Manquant");
console.log("🔧 [NextAuth Route] NEXTAUTH_URL:", process.env.NEXTAUTH_URL ? "✅ Présent" : "❌ Manquant");

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
