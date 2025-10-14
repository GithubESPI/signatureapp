"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGraphProfile } from "@/hooks/useGraphApi";
import { FileText, Download, Loader2, CheckCircle, XCircle, User, Phone, MapPin, Mail, Briefcase, Send } from "lucide-react";
import OutlookSignatureManager from "./OutlookSignatureManager";
import { SignatureConverter } from "@/lib/signature-converter";

interface UserData {
  prenom: string;
  nom: string;
  fonction: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  email: string;
}

interface TemplateInfo {
  placeholders: string[];
  content: string;
}

const VILLES_OPTIONS = [
  'Lyon',
  'Paris', 
  'Bordeaux',
  'Levallois',
  'Marseille',
  'Montpellier',
  'Nantes',
  'Lille',
  'Canada'
];

export default function SignatureGenerator() {
  const { data: session } = useSession();
  const { profile, fetchProfile } = useGraphProfile();
  const [userData, setUserData] = useState<UserData>({
    prenom: '',
    nom: '',
    fonction: '',
    telephone: '',
    adresse: '',
    ville: '',
    codePostal: '',
    email: ''
  });
  const [templateInfo, setTemplateInfo] = useState<TemplateInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [signatureHtml, setSignatureHtml] = useState<string>('');
  const [showOutlookManager, setShowOutlookManager] = useState(false);

  // Charger les informations du template au montage
  useEffect(() => {
    loadTemplateInfo();
  }, []);

  // Charger le profil utilisateur
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session, fetchProfile]);

  // Pré-remplir avec les données de session et profil
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || [];
      setUserData(prev => ({
        ...prev,
        prenom: nameParts[0] || '',
        nom: nameParts.slice(1).join(' ') || '',
        email: session.user.email || '',
        // Pré-remplir avec les données du profil Microsoft Graph
        fonction: profile?.jobTitle || 'Employé ESPI',
        telephone: profile?.mobilePhone || '',
        adresse: '',
        ville: 'Paris'
      }));
    }
  }, [session, profile]);

  const loadTemplateInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-signature?template=model_signature.docx');
      const data = await response.json();
      
      if (data.success) {
        setTemplateInfo(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des informations du template:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateSignature = async () => {
    setIsGenerating(true);
    setGenerationStatus('idle');
    
    try {
      const response = await fetch('/api/generate-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateName: 'model_signature.docx',
          userData
        })
      });

      if (response.ok) {
        // Télécharger le fichier généré
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `signature-${userData.prenom}-${userData.nom}.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Générer la signature HTML pour Outlook
        const signatureHtml = SignatureConverter.convertToHtml(userData);
        setSignatureHtml(signatureHtml);
        setShowOutlookManager(true);
        
        setGenerationStatus('success');
      } else {
        throw new Error('Erreur lors de la génération');
      }
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusIcon = () => {
    switch (generationStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Download className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FileText className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-800">Générateur de Signature</h3>
        </div>
        {session?.user && (
          <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-lg">
            ✅ Données pré-remplies automatiquement
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement du template...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Prénom *
                {session?.user?.name && (
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Auto-rempli
                  </span>
                )}
              </label>
              <input
                type="text"
                value={userData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre prénom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nom *
                {session?.user?.name && (
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Auto-rempli
                  </span>
                )}
              </label>
              <input
                type="text"
                value={userData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-2" />
                Fonction
                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  Pré-rempli
                </span>
              </label>
              <input
                type="text"
                value={userData.fonction}
                onChange={(e) => handleInputChange('fonction', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre fonction"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Téléphone
              </label>
              <input
                type="tel"
                value={userData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre téléphone"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Adresse
              </label>
              <input
                type="text"
                value={userData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre adresse complète"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Code postal
              </label>
              <input
                type="text"
                value={userData.codePostal}
                onChange={(e) => handleInputChange('codePostal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Code postal"
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Ville d'appartenance
              </label>
              <select
                value={userData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Sélectionnez votre ville</option>
                {VILLES_OPTIONS.map((ville) => (
                  <option key={ville} value={ville}>
                    {ville}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
                {session?.user?.email && (
                  <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                    Auto-rempli
                  </span>
                )}
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Votre email"
              />
            </div>
          </div>

          {/* Bouton de génération */}
          <div className="flex justify-center">
            <button
              onClick={generateSignature}
              disabled={isGenerating || !userData.prenom || !userData.nom}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                getStatusIcon()
              )}
              <span>
                {isGenerating ? 'Génération...' : 
                 generationStatus === 'success' ? 'Signature générée !' :
                 generationStatus === 'error' ? 'Erreur de génération' :
                 'Générer ma signature'}
              </span>
            </button>
          </div>

          {/* Informations sur le template */}
          {templateInfo && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📋 Template utilisé</h4>
              <p className="text-sm text-blue-700">
                Modèle ESPI avec {templateInfo.placeholders.length} champs personnalisables
              </p>
            </div>
          )}

          {/* Informations sur le pré-remplissage */}
          {session?.user && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✨ Pré-remplissage automatique</h4>
              <p className="text-sm text-green-700">
                Vos informations de connexion Microsoft ont été utilisées pour pré-remplir automatiquement 
                les champs Prénom, Nom et Email. Vous pouvez modifier ces valeurs si nécessaire.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Gestionnaire de signature Outlook */}
      {showOutlookManager && signatureHtml && (
        <div className="mt-8">
          <OutlookSignatureManager 
            signatureHtml={signatureHtml}
            onSignatureSent={() => {
              console.log("Signature envoyée vers Outlook");
            }}
          />
        </div>
      )}
    </div>
  );
}
