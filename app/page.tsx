"use client";

import { useSession } from "next-auth/react";
import WelcomeSection from "@/components/WelcomeSection";
import Navigation from "@/components/Navigation";
import { FileText, ArrowRight, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  return <HomeContent />;
}

function HomeContent() {
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

  // Si l'utilisateur n'est pas connecté, afficher la page de bienvenue
  if (!session) {
    return <WelcomeSection />;
  }

  // Si l'utilisateur est connecté, afficher la page d'accueil avec option de redirection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{session.user?.name}</h3>
                  <p className="text-sm text-gray-500">Compte Microsoft connecté</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Statut de la session</p>
                    <p className="text-sm text-green-600">Actif</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a 
                  href="/dashboard"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center"
                >
                  Accéder au Dashboard
                  <ArrowRight className="w-4 h-4 inline ml-2" />
                </a>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Bienvenue, {session.user?.name?.split(' ')[0]} !
                  </h2>
                  <p className="text-gray-600">
                    Vous êtes connecté avec votre compte Microsoft
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Prêt à créer vos signatures
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Accédez à vos modèles Word depuis Azure Storage et générez vos signatures personnalisées.
                  </p>
                  <a 
                    href="/signatures"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    Commencer
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </a>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    Envoi automatique
                  </h3>
                  <p className="text-purple-700 text-sm mb-4">
                    Vos signatures seront automatiquement envoyées dans votre boîte Outlook.
                  </p>
                  <a 
                    href="/graph-api-test"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-flex items-center"
                  >
                    Configurer
                    <ArrowRight className="w-4 h-4 inline ml-2" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Actions rapides
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="/signatures"
                  className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <FileText className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-gray-600 group-hover:text-blue-600 font-medium">
                    Nouveau modèle
                  </span>
                </a>

                <a 
                  href="/signatures"
                  className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
                >
                  <CheckCircle className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                  <span className="text-gray-600 group-hover:text-green-600 font-medium">
                    Générer signature
                  </span>
                </a>

                <a 
                  href="/graph-api-test"
                  className="flex items-center justify-center space-x-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-purple-600" />
                  <span className="text-gray-600 group-hover:text-purple-600 font-medium">
                    Envoyer par email
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}