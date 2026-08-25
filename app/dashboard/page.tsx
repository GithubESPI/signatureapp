"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LogOut,
  Sparkles,
  AlertCircle
} from "lucide-react";
import DashboardUserProfile from "@/components/DashboardUserProfile";
import SignatureGenerator from "@/components/SignatureGenerator";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-4 border-[#004976] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#004976] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xs font-semibold text-slate-500">Chargement de votre session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
        <div className="text-center bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200/80 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#002D4A] mb-2">Accès non autorisé</h2>
          <p className="text-xs text-slate-500 mb-6 font-medium">Vous devez être connecté avec votre compte Microsoft ESPI pour accéder au dashboard.</p>
          <a
            href="/login"
            className="inline-flex items-center justify-center w-full px-5 py-3 bg-[#004976] text-white text-xs font-bold rounded-xl hover:bg-[#003a5e] transition-all shadow-md shadow-[#004976]/20"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3.5">
            <div className="flex items-center space-x-3">
              <img 
                src="/charte/LOGO ESPI/Bleu/RVB/PNG/ESPI_logos_horizontal_bleu_RVB.png" 
                alt="Groupe ESPI" 
                className="h-9 w-auto object-contain"
              />
              <div className="hidden sm:block pl-2.5 border-l border-slate-300">
                <span className="text-xs font-bold text-[#004976] tracking-wider uppercase block leading-none">
                  SignatureApp
                </span>
                <span className="text-[10px] text-[#47B5E0] font-semibold italic block leading-none mt-0.5">
                  Espace Collaborateur
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#002D4A] leading-tight">{session.user?.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">{session.user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 w-full">
          {/* User Profile Sidebar */}
          <div className="lg:col-span-1">
            <DashboardUserProfile />
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-3 space-y-8 w-full overflow-x-hidden">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-[#003A5E] via-[#004976] to-[#002D4A] rounded-3xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden"
            >
              {/* Motifs géométriques */}
              <div
                className="absolute -right-10 -bottom-10 w-60 h-60 opacity-10 pointer-events-none rounded-full"
                style={{
                  background: "radial-gradient(circle, #47B5E0 0%, transparent 70%)"
                }}
              />
              
              <div className="flex items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-3 backdrop-blur-sm border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#47B5E0]" />
                    Nouvelle Charte Graphique 2026
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1">
                    Bonjour, {session.user?.name?.split(' ')[0]} !
                  </h2>
                  <p className="text-xs md:text-sm text-[#E6EDF1] font-medium max-w-xl">
                    Personnalisez votre signature d&apos;email officielle chartée et exportez-la en 1 clic pour Outlook.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Signature Generator Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SignatureGenerator />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}