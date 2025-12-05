import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Le middleware ne fait que vérifier l'autorisation
    // La redirection est gérée par NextAuth et les composants
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Vérifier simplement si le token existe
        // Si pas de token, withAuth redirigera vers /login
        return !!token;
      },
    },
  }
);

export const config = {
  // Ne protéger que les routes qui nécessitent une authentification
  // Ne pas inclure /login pour éviter les boucles
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
