"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  FileText,
  User,
  Download,
  Mail,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    {
      id: 1,
      title: "Connexion",
      description: "Connectez-vous avec votre compte Microsoft professionnel",
      icon: <User className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Étape 1 : Connexion</h3>
            <p className="text-blue-800 mb-4">
              Cliquez sur le bouton "Commencer maintenant" pour vous connecter avec votre compte Microsoft.
            </p>
            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Connexion Microsoft</p>
                  <p className="text-sm text-gray-600">Authentification sécurisée</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Remplir le formulaire",
      description: "Complétez vos informations personnelles",
      icon: <FileText className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Étape 2 : Informations personnelles</h3>
            <p className="text-green-800 mb-4">
              Remplissez le formulaire avec vos informations professionnelles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <h4 className="font-medium text-gray-900 mb-2">Informations de base</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Prénom et nom</li>
                  <li>• Fonction/Poste</li>
                  <li>• Téléphone</li>
                  <li>• Email</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <h4 className="font-medium text-gray-900 mb-2">Adresse</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Sélectionnez votre ville</li>
                  <li>• Adresse automatiquement remplie</li>
                  <li>• Code postal et pays</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Prévisualisation",
      description: "Visualisez votre signature en temps réel",
      icon: <Sparkles className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Étape 3 : Prévisualisation</h3>
            <p className="text-purple-800 mb-4">
              Votre signature se met à jour automatiquement pendant que vous tapez.
            </p>
            <div className="bg-white rounded-lg p-6 border border-purple-300">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <div className="bg-white rounded border-2 border-dashed border-gray-300 p-6 text-center">
                  <div className="text-sm text-gray-500">Aperçu de votre signature</div>
                  <div className="mt-2 text-xs text-gray-400">Se met à jour en temps réel</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-700">
                <Sparkles className="w-4 h-4" />
                <span>Prévisualisation automatique</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Génération",
      description: "Générez votre signature personnalisée",
      icon: <CheckCircle className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Étape 4 : Génération</h3>
            <p className="text-orange-800 mb-4">
              Cliquez sur "Générer ma signature" pour créer votre signature personnalisée.
            </p>
            <div className="bg-white rounded-lg p-4 border border-orange-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Génération en cours...</p>
                  <p className="text-sm text-gray-600">Traitement de votre signature</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-600">
                  ✓ Validation des données<br/>
                  ✓ Génération de l'image<br/>
                  ✓ Préparation de l'envoi
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Téléchargement",
      description: "Téléchargez votre signature en PNG",
      icon: <Download className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Étape 5 : Téléchargement</h3>
            <p className="text-indigo-800 mb-4">
              Téléchargez votre signature au format PNG haute qualité.
            </p>
            <div className="bg-white rounded-lg p-4 border border-indigo-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Téléchargement automatique</p>
                  <p className="text-sm text-gray-600">Fichier PNG haute résolution</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-600">
                  📁 signature-[nom]-[prenom].png<br/>
                  🎨 Qualité optimale pour Outlook<br/>
                  📧 Envoi automatique par email
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "Envoi par email",
      description: "Recevez votre signature dans votre boîte mail",
      icon: <Mail className="w-8 h-8" />,
      content: (
        <div className="space-y-6">
          <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Étape 6 : Envoi automatique</h3>
            <p className="text-emerald-800 mb-4">
              Votre signature est automatiquement envoyée dans votre boîte mail avec les instructions d'installation.
            </p>
            <div className="bg-white rounded-lg p-4 border border-emerald-300">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-emerald-600 animate-pulse" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Envoi par email...</p>
                  <p className="text-sm text-gray-600">Signature envoyée automatiquement</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-600">
                  📧 Email avec pièce jointe<br/>
                  📋 Instructions d'installation<br/>
                  ✅ Confirmation d'envoi
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTutorial = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setIsPlaying(true);
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    setIsPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isCompleted) {
      interval = setInterval(() => {
        setCurrentStep(prevStep => {
          if (prevStep < steps.length - 1) {
            return prevStep + 1;
          } else {
            setIsCompleted(true);
            setIsPlaying(false);
            return prevStep;
          }
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isCompleted, steps.length]);

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
              <h1 className="text-2xl font-bold text-gray-900">Tutoriel SignatureApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetTutorial}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recommencer</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {steps.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Steps Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Étapes du tutoriel</h2>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <motion.button
                      key={step.id}
                      onClick={() => setCurrentStep(index)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        currentStep === index
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        currentStep === index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index < currentStep ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-sm">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {/* Controls */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isPlaying 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause (3s)' : 'Lecture automatique'}</span>
                  </button>
                  
                  {isPlaying && (
                    <div className="mt-2 text-center">
                      <div className="inline-flex items-center space-x-2 text-sm text-purple-600">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                        <span>Lecture automatique active</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white">
                      {steps[currentStep].icon}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {steps[currentStep].title}
                      </h1>
                      <p className="text-gray-600">
                        {steps[currentStep].description}
                      </p>
                    </div>
                  </div>

                  {steps[currentStep].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Tutoriel terminé ! 🎉
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Vous savez maintenant comment utiliser SignatureApp pour créer et envoyer vos signatures personnalisées.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={startTutorial}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refaire le tutoriel</span>
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <span>Commencer maintenant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
