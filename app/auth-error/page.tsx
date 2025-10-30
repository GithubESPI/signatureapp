"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AuthErrorPageWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthErrorPage />
    </Suspense>
  );
}

function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const error = searchParams.get("error");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Erreur de configuration",
          message: "Il y a un problème avec la configuration de l'authentification.",
          solution: "Veuillez contacter l'administrateur ou réessayer plus tard."
        };
      case "AccessDenied":
        return {
          title: "Accès refusé",
          message: "Vous n'avez pas les permissions nécessaires pour accéder à cette application.",
          solution: "Contactez votre administrateur pour obtenir les permissions."
        };
      case "Verification":
        return {
          title: "Erreur de vérification",
          message: "Le lien de vérification a expiré ou est invalide.",
          solution: "Veuillez réessayer la connexion."
        };
      default:
        return {
          title: "Erreur d'authentification",
          message: "Une erreur inattendue s'est produite lors de la connexion.",
          solution: "Veuillez réessayer ou contacter le support."
        };
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {errorInfo.title}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {errorInfo.message}
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Solution :</strong> {errorInfo.solution}
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer la connexion
            </Link>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>

          {error && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-gray-500">
                Code d'erreur : <code className="bg-gray-200 px-1 rounded">{error}</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
