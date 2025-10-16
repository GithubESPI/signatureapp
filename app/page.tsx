"use client";

import { useSession } from "next-auth/react";
import WelcomeSection from "@/components/WelcomeSection";
import Navigation from "@/components/Navigation";
import { FileText, ArrowRight, CheckCircle, Sparkles, Zap, Shield, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Composant d'écran de chargement attractif
function LoadingScreen() {
  const [loadingText, setLoadingText] = useState("Initialisation...");
  const [currentStep, setCurrentStep] = useState(0);

  const loadingSteps = [
    "Initialisation...",
    "Connexion sécurisée...",
    "Chargement des modèles...",
    "Préparation de l'interface...",
    "Presque prêt..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % loadingSteps.length;
        setLoadingText(loadingSteps[nextStep]);
        return nextStep;
      });
    }, 1200); // Augmenté de 800ms à 1200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main loading content */}
      <div className="relative z-10 text-center">
        {/* Logo with animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative">
            {/* Main logo */}
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <FileText className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Sparkles around logo */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: `${50 + 40 * Math.cos((i * 45) * Math.PI / 180)}%`,
                  top: `${50 + 40 * Math.sin((i * 45) * Math.PI / 180)}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* App title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SignatureApp
          </h1>
          <p className="text-gray-600 mt-2">Powered by Groupe ESPI</p>
        </motion.div>

        {/* Loading steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <motion.div
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.2,
              }}
            />
            <motion.div
              className="w-2 h-2 bg-pink-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: 0.4,
              }}
            />
          </div>
          
          <motion.p
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-gray-700"
          >
            {loadingText}
          </motion.p>
        </motion.div>

        {/* Feature icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center space-x-8"
        >
          {[
            { icon: Shield, color: "text-green-500", label: "Sécurisé" },
            { icon: Zap, color: "text-yellow-500", label: "Rapide" },
            { icon: Mail, color: "text-blue-500", label: "Automatique" },
            { icon: Sparkles, color: "text-purple-500", label: "Moderne" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center space-y-2"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            >
              <div className={`w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-600 font-medium">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="mt-8 w-64 mx-auto"
        >
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}

function HomeContent() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Délai minimum pour afficher l'écran de chargement
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 4000); // 4 secondes minimum

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || status === "loading" || showLoading) {
    return <LoadingScreen />;
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