"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";

export default function AuthSuccessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === "authenticated" && session && !redirecting) {
      setRedirecting(true);
      // Rediriger vers le dashboard après 1 seconde
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } else if (mounted && status === "unauthenticated" && !redirecting) {
      setRedirecting(true);
      // Rediriger vers la page de connexion
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    }
  }, [mounted, status, session, router, redirecting]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de la connexion...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion réussie !</h2>
          <p className="text-gray-600 mb-4">Bienvenue, {session.user?.name} !</p>
          <p className="text-sm text-gray-500">Redirection vers le dashboard...</p>
          
          <div className="mt-6">
            <a 
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Aller au Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session expirée</h2>
          <p className="text-gray-600 mb-4">Redirection vers la page de connexion...</p>
          
          <div className="mt-6">
            <a 
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <p className="text-gray-600">Redirection...</p>
      </div>
    </div>
  );
}