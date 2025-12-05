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
    
    // Laisser passer toutes les autres routes
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Toujours autoriser l'accès à /login
        if (pathname === "/login") {
          return true;
        }
        
        // Toujours autoriser l'accès à /dashboard - l'authentification sera gérée côté client
        // car les cookies chunkés peuvent ne pas être lus correctement par le middleware
        if (pathname.startsWith("/dashboard")) {
          console.log("🔧 [Middleware] /dashboard autorisé (gestion côté client)");
          return true;
        }
        
        // Pour les routes API protégées, vérifier le token
        if (pathname.startsWith("/api/protected")) {
          const isAuthorized = !!token;
          if (!isAuthorized) {
            console.log("🔧 [Middleware] Token manquant pour", pathname);
          }
          return isAuthorized;
        }
        
        // Pour toutes les autres routes, autoriser
        return true;
      },
    },
  }
);

export const config = {
  // Ne protéger que les routes API qui nécessitent une authentification
  // /dashboard et /login sont gérés différemment pour éviter les problèmes avec les cookies chunkés
  matcher: ["/api/protected/:path*", "/login"],
};
