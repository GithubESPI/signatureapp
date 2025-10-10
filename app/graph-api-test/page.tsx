"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import GraphApiDemo from "@/components/GraphApiDemo";
import AzureLoginButton from "@/components/AzureLoginButton";
import { FileText, Shield, Mail, User } from "lucide-react";

export default function GraphApiTestPage() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">SignatureApp</h1>
              </div>
              <AzureLoginButton variant="outline" size="sm" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Test Graph API
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Testez les fonctionnalités Microsoft Graph API
            </p>
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connexion requise
              </h2>
              <p className="text-gray-600 mb-6">
                Connectez-vous avec votre compte Microsoft pour accéder aux fonctionnalités Graph API
              </p>
              <AzureLoginButton size="lg" className="w-full justify-center" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SignatureApp</h1>
            </div>
            <AzureLoginButton variant="outline" size="sm" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test Microsoft Graph API
          </h1>
          <p className="text-gray-600">
            Testez les fonctionnalités Graph API avec votre compte Microsoft connecté
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-8 h-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Profil utilisateur</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Récupération des informations du profil utilisateur connecté
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-8 h-8 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Gestion des emails</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Lecture et envoi d'emails via Microsoft Graph API
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-8 h-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Fichiers OneDrive</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Accès et gestion des fichiers OneDrive de l'utilisateur
            </p>
          </div>
        </div>

        {/* Graph API Demo Component */}
        <GraphApiDemo />
      </main>
    </div>
  );
}
