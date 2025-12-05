"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function LoginForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isHydrated && status === "authenticated" && session && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log("🔧 [LoginForm] Utilisateur déjà connecté, redirection vers dashboard");
      
      // Récupérer le callbackUrl depuis les paramètres de l'URL ou utiliser /dashboard par défaut
      const callbackUrlParam = searchParams.get("callbackUrl");
      let redirectUrl = "/dashboard";
      
      if (callbackUrlParam) {
        try {
          // Si c'est une URL complète, extraire le chemin
          if (callbackUrlParam.startsWith("http")) {
            const url = new URL(callbackUrlParam);
            const path = url.pathname + url.search;
            // Ignorer si c'est /login pour éviter les boucles
            if (!path.includes("/login")) {
              redirectUrl = path;
            }
          } else {
            // Si c'est un chemin relatif, l'utiliser directement (sauf si c'est /login)
            if (!callbackUrlParam.includes("/login")) {
              redirectUrl = callbackUrlParam.startsWith("/") ? callbackUrlParam : `/${callbackUrlParam}`;
            }
          }
        } catch (e) {
          console.error("🔧 [LoginForm] Erreur lors du parsing du callbackUrl:", e);
          redirectUrl = "/dashboard";
        }
      }
      
      console.log("🔧 [LoginForm] Redirection vers:", redirectUrl);
      
      // Utiliser window.location.replace pour éviter d'ajouter une entrée dans l'historique
      // et forcer une redirection complète pour éviter les boucles
      setTimeout(() => {
        window.location.replace(redirectUrl);
      }, 50);
    }
  }, [isHydrated, status, session, searchParams]);

  const handleAzureLogin = () => {
    console.log("🔧 [LoginForm] Tentative de connexion Azure AD...");
    console.log("🔧 [LoginForm] Callback URL: /dashboard");
    signIn("azure-ad", { callbackUrl: "/dashboard", redirect: true });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              SignatureApp
            </h2>
            <p className="text-gray-600">
              Connectez-vous avec votre compte Microsoft
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleAzureLogin}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Se connecter avec Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
