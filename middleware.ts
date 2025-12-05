import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    
    // Si l'utilisateur a un token et essaie d'accéder à /login, rediriger vers dashboard
    if (token && pathname === "/login") {
      console.log("🔧 [Middleware] Token présent sur /login, redirection vers /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Le middleware ne fait que vérifier l'autorisation
    // La redirection est gérée par NextAuth et les composants
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Toujours autoriser l'accès à /login (géré dans la fonction middleware ci-dessus)
        if (pathname === "/login") {
          return true;
        }
        
        // Pour les routes protégées, vérifier le token
        const isAuthorized = !!token;
        if (!isAuthorized) {
          console.log("🔧 [Middleware] Token manquant pour", pathname);
        }
        return isAuthorized;
      },
    },
  }
);

export const config = {
  // Ne protéger que les routes qui nécessitent une authentification
  // Inclure /login pour pouvoir rediriger si l'utilisateur est déjà connecté
  matcher: ["/dashboard/:path*", "/api/protected/:path*", "/login"],
};
