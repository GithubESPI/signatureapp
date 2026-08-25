"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Shield, Zap, ArrowRight, CheckCircle, PlayCircle, LogIn, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import LoginModal from "@/components/LoginModal";
import AnimatedSignaturePreview from "@/components/AnimatedSignaturePreview";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // --- VUE CONNECTÉE (Dashboard d'accueil) ---
  if (session) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section de Bienvenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#004976]/10 text-[#004976] text-xs font-bold mb-4 border border-[#004976]/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#47B5E0]" />
              Charte Graphique Officielle 2026
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#002D4A] tracking-tight">
              Bienvenue, <span className="text-[#004976]">{session.user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-600 mt-2 font-medium">
              Générez votre signature officielle chartée et exportez-la directement pour Outlook.
            </p>
          </motion.div>

          {/* Grille d'actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Carte 1 : Générer une signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-7 border border-slate-200/80 group cursor-pointer"
              onClick={() => router.push('/dashboard')}
            >
              <div className="w-12 h-12 bg-[#004976]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#004976] transition-colors">
                <FileText className="w-6 h-6 text-[#004976] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#002D4A] mb-2">Générer ma signature</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-5 font-medium">
                Générez votre signature officielle ESPI 2026 en 1 clic grâce à votre compte Microsoft 365.
              </p>
              <div className="flex items-center text-[#004976] font-bold text-xs">
                Accéder au générateur <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>

            {/* Carte 2 : Tutoriel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-7 border border-slate-200/80 group cursor-pointer"
              onClick={() => router.push('/tutorial')}
            >
              <div className="w-12 h-12 bg-[#47B5E0]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#47B5E0] transition-colors">
                <PlayCircle className="w-6 h-6 text-[#47B5E0] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#002D4A] mb-2">Guide d&apos;installation</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-5 font-medium">
                Consultez le guide étape par étape pour installer votre signature dans Outlook Web et Desktop.
              </p>
              <div className="flex items-center text-[#47B5E0] font-bold text-xs">
                Voir le tutoriel <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>

            {/* Carte 3 : Mon Profil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all p-7 border border-slate-200/80 group cursor-pointer"
            >
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-emerald-600 transition-colors">
                <CheckCircle className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-[#002D4A] mb-2">Compte Microsoft</h3>
              <p className="text-slate-500 text-xs leading-relaxed mb-5 font-medium">
                Connecté en tant que <span className="font-semibold text-slate-800">{session.user?.email}</span>. Données synchronisées.
              </p>
              <div className="flex items-center text-emerald-600 font-bold text-xs">
                Sécurisé par Azure AD <Shield className="w-3.5 h-3.5 ml-1.5" />
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
      <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/charte/LOGO ESPI/Bleu/RVB/PNG/ESPI_logos_horizontal_bleu_RVB.png" 
                alt="Groupe ESPI" 
                className="h-9 w-auto object-contain"
              />
              <span className="hidden sm:inline-block text-xs font-bold text-[#004976] pl-2 border-l border-slate-300">
                SignatureApp
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/tutorial" className="text-xs font-bold text-slate-600 hover:text-[#004976]">
                Tutoriel
              </Link>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-[#004976] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#003a5e] transition-all shadow-md shadow-[#004976]/20"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F2F6F8] via-white to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#004976]/10 text-[#004976] text-xs font-bold mb-6 border border-[#004976]/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2 text-[#47B5E0]" />
              Nouvelle Charte Graphique ESPI 2026
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#002D4A] mb-6 tracking-tight">
              Vos signatures d&apos;email officielles,<br />
              <span className="text-[#004976]">
                chartées et unifiées.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Générez instantanément votre signature Outlook aux normes officielles du Groupe ESPI en vous connectant simplement avec votre compte Microsoft 365.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-2xl text-white bg-[#004976] hover:bg-[#003a5e] transition-all shadow-xl shadow-[#004976]/30 hover:scale-102"
              >
                <LogIn className="w-4 h-4 mr-2 text-[#47B5E0]" />
                Connexion Microsoft
              </button>
              <Link
                href="/tutorial"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold rounded-2xl text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm"
              >
                <PlayCircle className="w-4 h-4 mr-2 text-[#004976]" />
                Voir le tutoriel
              </Link>
            </div>
          </motion.div>

          {/* Aperçu Visuel Animé */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative max-w-4xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#004976] to-[#47B5E0] blur-3xl opacity-15 rounded-full transform scale-75"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-2.5 overflow-hidden">
              <AnimatedSignaturePreview />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-[#F8FAFC] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Sécurisé",
                desc: "Authentification directe via Microsoft Azure AD. Aucune conservation de mot de passe."
              },
              {
                icon: Zap,
                title: "Instantané & Automatisé",
                desc: "Auto-détection de vos coordonnées et de votre campus ESPI via Microsoft Graph API."
              },
              {
                icon: CheckCircle,
                title: "100% Conforme 2026",
                desc: "Respecte scrupuleusement le guide de marque et les normes officielles du Groupe ESPI."
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 bg-[#004976]/10 rounded-2xl flex items-center justify-center mb-4 text-[#004976]">
                  <feature.icon className="w-6 h-6 text-[#004976]" />
                </div>
                <h3 className="text-base font-bold text-[#002D4A] mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
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