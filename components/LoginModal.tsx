"use client";

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
      icon: <FileText className="w-5 h-5 text-[#004976]" />,
      title: "Charte Officielle 2026",
      description: "Gabarit conforme aux directives de la marque ESPI"
    },
    {
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
      title: "Sécurité Entreprise",
      description: "Authentification via Microsoft Azure AD"
    },
    {
      icon: <Mail className="w-5 h-5 text-[#47B5E0]" />,
      title: "1-Click Copie Outlook",
      description: "Code HTML optimisé avec liens interactifs"
    },
    {
      icon: <Zap className="w-5 h-5 text-[#FFB461]" />,
      title: "Auto-Détection Campus",
      description: "Pré-remplissage via Microsoft Graph API"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#001D30]/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#003A5E] via-[#004976] to-[#002D4A] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <Shield className="w-5 h-5 text-[#47B5E0]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Connexion Microsoft 365</h2>
                    <p className="text-xs text-[#E6EDF1] font-medium">Accédez à votre générateur de signature officiel ESPI</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Login Section */}
                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-base font-bold text-[#002D4A] mb-1">
                      Identifiez-vous
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Utilisez vos identifiants professionnels ESPI pour générer automatiquement votre signature.
                    </p>
                  </div>

                  <div>
                    <AzureLoginButton 
                      className="w-full justify-center"
                      size="md"
                    />
                  </div>

                  <div className="bg-[#F2F6F8] rounded-2xl p-4 border border-[#BFD2DD]">
                    <h4 className="font-bold text-[#004976] text-xs mb-2">
                      Avantages du compte connecté :
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Récupération automatique de votre poste</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Sélection instantanée de votre campus</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Envoi direct par email dans votre Outlook</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Features Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-start space-x-3"
                      >
                        <div className="p-2 bg-white rounded-xl shadow-sm shrink-0 border border-slate-200">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#002D4A] text-xs mb-0.5">
                            {feature.title}
                          </h4>
                          <p className="text-slate-500 text-[11px] font-medium leading-tight">
                            {feature.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Groupe ESPI • Direction Marketing &amp; DSIT</span>
              <div className="flex items-center space-x-1.5 text-emerald-600 font-semibold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span>Service actif</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
