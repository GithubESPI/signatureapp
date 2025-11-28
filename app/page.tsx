"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Shield, Zap, ArrowRight, CheckCircle, PlayCircle, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import LoginModal from "@/components/LoginModal";
import AnimatedSignaturePreview from "@/components/AnimatedSignaturePreview";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- VUE CONNECTÉE (Dashboard d'accueil) ---
  if (session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section de Bienvenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue, <span className="text-blue-600">{session.user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Ravi de vous revoir. Que souhaitez-vous faire aujourd'hui ?
            </p>
          </motion.div>

          {/* Grille d'actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte 1 : Générer une signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 group cursor-pointer"
              onClick={() => window.location.href = '/dashboard'}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <FileText className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Générer ma signature</h3>
              <p className="text-gray-500 text-sm mb-4">
                Créez votre signature officielle ESPI en quelques secondes à partir de vos données.
              </p>
              <div className="flex items-center text-blue-600 font-medium text-sm">
                Commencer <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>

            {/* Carte 2 : Tutoriel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 group cursor-pointer"
              onClick={() => window.location.href = '/tutorial'}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
                <PlayCircle className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment ça marche ?</h3>
              <p className="text-gray-500 text-sm mb-4">
                Consultez le guide étape par étape pour installer votre signature dans Outlook.
              </p>
              <div className="flex items-center text-purple-600 font-medium text-sm">
                Voir le tutoriel <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </motion.div>

            {/* Carte 3 : Mon Profil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                <CheckCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mon Compte</h3>
              <p className="text-gray-500 text-sm mb-4">
                Connecté en tant que {session.user?.email}. Votre session est active et sécurisée.
              </p>
              <div className="flex items-center text-green-600 font-medium text-sm">
                Géré par Microsoft <Shield className="w-3 h-3 ml-1" />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // --- VUE NON CONNECTÉE (Landing Page) ---
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SignatureApp</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/tutorial" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Tutoriel
              </Link>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
              <Zap className="w-4 h-4 mr-2" />
              Nouvelle version disponible
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Vos signatures email,<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                professionnelles et unifiées.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Générez automatiquement votre signature Outlook chartée Groupe ESPI en connectant simplement votre compte Microsoft.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Connexion Microsoft
              </button>
              <Link
                href="/tutorial"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Voir le tutoriel
              </Link>
            </div>
          </motion.div>

          {/* Preview Image / Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-10 rounded-full transform scale-75"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden">
              <AnimatedSignaturePreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "100% Sécurisé",
                desc: "Connexion via Microsoft Azure AD. Vos données restent confidentielles."
              },
              {
                icon: Zap,
                title: "Instantané",
                desc: "Génération automatique à partir de votre profil. Pas de saisie manuelle."
              },
              {
                icon: CheckCircle,
                title: "Conforme",
                desc: "Respecte scrupuleusement la charte graphique du Groupe ESPI."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-blue-600">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}