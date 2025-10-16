"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Mail, Zap } from "lucide-react";
import LoginModal from "./LoginModal";

export default function WelcomeSection() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Modèles Personnalisés",
      description: "Utilisez vos modèles Word personnalisés depuis Azure Storage"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Sécurité Azure AD",
      description: "Connexion sécurisée avec votre compte Microsoft professionnel"
    },
    {
      icon: <Mail className="w-8 h-8 text-purple-600" />,
      title: "Envoi Automatique",
      description: "Envoi direct dans votre boîte Outlook via Microsoft Graph"
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-600" />,
      title: "Rapide & Efficace",
      description: "Génération et envoi de signatures en quelques clics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header avec navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SignatureApp</h1>
            </div>
            <div className="text-sm text-gray-600">
              Powered by Groupe ESPI
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Générez vos{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  signatures
                </span>{" "}
                en un clic
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Créez et envoyez automatiquement vos signatures personnalisées 
                depuis vos modèles Word stockés dans Azure, directement dans votre boîte Outlook.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Commencer maintenant
              </button>
              <button 
                onClick={() => window.location.href = '/tutorial'}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
              >
                En savoir plus
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-white rounded-full shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à simplifier vos signatures ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Connectez-vous avec votre compte Microsoft et commencez dès maintenant
            </p>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Se connecter avec Microsoft
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SignatureApp</span>
            </div>
            <p className="text-gray-400 mb-4">
              Solution de génération de signatures powered by Groupe ESPI
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} propulsé par <a href="https://groupe-espi.fr/" className="text-white hover:text-gray-200">Groupe ESPi</a></span>
              <span>•</span>
              <span>Groupe ESPi</span>
              <span>•</span>
              <span>Groupe ESPi</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
