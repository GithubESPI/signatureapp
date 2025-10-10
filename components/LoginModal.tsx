"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, FileText, Mail, Zap, CheckCircle } from "lucide-react";
import AzureLoginButton from "./AzureLoginButton";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "Modèles Personnalisés",
      description: "Accédez à vos modèles Word depuis Azure Storage"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Sécurité Enterprise",
      description: "Authentification sécurisée avec Azure AD"
    },
    {
      icon: <Mail className="w-6 h-6 text-purple-600" />,
      title: "Envoi Automatique",
      description: "Envoi direct dans votre boîte Outlook"
    },
    {
      icon: <Zap className="w-6 h-6 text-orange-600" />,
      title: "Rapide & Efficace",
      description: "Génération de signatures en quelques clics"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Connexion Sécurisée</h2>
                    <p className="text-blue-100">Accédez à vos signatures personnalisées</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Login Section */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Connectez-vous avec Microsoft
                    </h3>
                    <p className="text-gray-600">
                      Utilisez votre compte professionnel Microsoft pour accéder à l'application
                    </p>
                  </div>

                  <div className="space-y-4">
                    <AzureLoginButton 
                      className="w-full justify-center"
                      size="lg"
                    />

                    <div className="text-center">
                      <p className="text-sm text-gray-500">
                        En vous connectant, vous acceptez nos conditions d'utilisation
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Pourquoi se connecter ?
                    </h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Accès à vos modèles Word personnalisés</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Envoi automatique dans votre Outlook</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span>Sécurité et conformité enterprise</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Fonctionnalités Avancées
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Découvrez comment SignatureApp peut transformer votre workflow
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
                            {feature.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">
                              {feature.title}
                            </h4>
                            <p className="text-gray-600 text-xs">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Prêt à commencer ?
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Rejoignez des milliers d'utilisateurs qui font confiance à SignatureApp
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>Powered by Microsoft Azure</span>
                  <span>•</span>
                  <span>Next.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Service actif</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
