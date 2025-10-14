"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useGraphProfile } from "@/hooks/useGraphApi";
import { FileText, Download, Loader2, CheckCircle, XCircle, User, Phone, MapPin, Mail, Briefcase, Send, Eye, Save } from "lucide-react";
import OutlookSignatureManager from "./OutlookSignatureManager";
import SignaturePreview from "./SignaturePreview";
import { SignatureConverter } from "@/lib/signature-converter";

interface UserData {
  prenom: string;
  nom: string;
  fonction: string;
  telephone: string;
  indicatifPays: string;
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

const INDICATIFS_PAYS = [
  { code: 'FR', nom: 'France', indicatif: '+33' },
  { code: 'CA', nom: 'Canada', indicatif: '+1' }
];

export default function SignatureGenerator() {
  const { data: session } = useSession();
  const { profile, fetchProfile } = useGraphProfile();
  const [userData, setUserData] = useState<UserData>({
    prenom: '',
    nom: '',
    fonction: '',
    telephone: '',
    indicatifPays: 'FR',
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
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

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
        email: session.user?.email || '',
        // Pré-remplir avec les données du profil Microsoft Graph
        fonction: profile?.jobTitle || '',
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

  const generatePreviewHtml = () => {
    const { prenom, nom, fonction, telephone, indicatifPays, adresse, ville, codePostal, email } = userData;
    
    const fullName = `${prenom} ${nom}`;
    const fullAddress = [
      adresse,
      codePostal,
      ville
    ].filter(Boolean).join(', ');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signature ESPI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    .signature-container {
      font-family: 'Poppins', sans-serif;
      max-width: 800px;
      margin: 0 auto;
      background: linear-gradient(135deg, #2c5aa0 0%, #1e3a5f 100%);
      color: white;
      padding: 40px;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }
    
    .signature-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    
    .left-section {
      display: flex;
      flex-direction: column;
    }
    
    .logo {
      font-size: 2.5rem;
      font-weight: 300;
      letter-spacing: 0.2em;
      margin-bottom: 12px;
    }
    
    .tagline {
      font-size: 0.875rem;
      font-weight: 300;
      letter-spacing: 0.1em;
      line-height: 1.2;
    }
    
    .right-section {
      display: flex;
      flex-direction: column;
      text-align: right;
      gap: 4px;
    }
    
    .name {
      font-size: 1.25rem;
      font-weight: 600;
      line-height: 1.2;
    }
    
    .function {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.2;
    }
    
    .contact-info {
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.2;
    }
    
    .website {
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.2;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <div class="signature-content">
      <!-- Section gauche - Logo et tagline -->
      <div class="left-section">
        <div class="logo">ESPI</div>
        <div class="tagline">
          <div>FORMER</div>
          <div>À L'IMMOBILIER</div>
          <div>DE DEMAIN</div>
        </div>
      </div>
      
      <!-- Section droite - Informations utilisateur -->
      <div class="right-section">
        <div class="name">${fullName}</div>
        ${fonction ? `<div class="function">${fonction}</div>` : ''}
        ${telephone ? `<div class="contact-info">${indicatifPays === 'FR' ? '+33' : '+1'} ${telephone}</div>` : ''}
        ${fullAddress ? `<div class="contact-info">${fullAddress}</div>` : ''}
        ${email ? `<div class="contact-info">${email}</div>` : ''}
        <div class="website">www.groupe-espi.fr</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const generateSignature = async () => {
    setIsGenerating(true);
    setGenerationStatus('idle');
    
    try {
      // Générer la signature HTML basée sur la prévisualisation
      const signatureHtml = generatePreviewHtml();
      setSignatureHtml(signatureHtml);
      setShowOutlookManager(true);
      
      setGenerationStatus('success');
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setGenerationStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSignature = async () => {
    try {
      // Créer un canvas pour dessiner la signature
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Impossible de créer le contexte canvas');
      }

      // Dimensions de la signature (plus étroite)
      const width = 600;
      const height = 150;
      canvas.width = width * 2; // Haute qualité
      canvas.height = height * 2;
      ctx.scale(2, 2); // Mise à l'échelle pour la haute qualité

      // Charger l'image modèle
      const backgroundImage = new Image();
      backgroundImage.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        backgroundImage.onload = resolve;
        backgroundImage.onerror = reject;
        backgroundImage.src = '/images/model-signature.png';
      });

      // Dessiner l'image de fond (sans étirement)
      ctx.drawImage(backgroundImage, 0, 0, width, height);

      // Configuration de la police
      ctx.fillStyle = 'white';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Logo ESPI retiré (section gauche vide)

      // Dessiner les informations utilisateur (droite) - exactement comme dans la prévisualisation
      const { prenom, nom, fonction, telephone, indicatifPays, adresse, ville, codePostal, email } = userData;
      const fullName = `${prenom} ${nom}`;
      const fullAddress = [adresse, codePostal, ville].filter(Boolean).join(', ');

      ctx.textAlign = 'left';
      let yPosition = 30;
      const leftMargin = 20;

      // Nom
      ctx.font = '600 18px Poppins, sans-serif';
      ctx.fillText(fullName, leftMargin, yPosition);
      yPosition += 22;

      // Fonction
      if (fonction) {
        ctx.font = '500 12px Poppins, sans-serif';
        ctx.fillText(fonction, leftMargin, yPosition);
        yPosition += 18;
      }

      // Téléphone
      if (telephone) {
        ctx.font = '400 12px Poppins, sans-serif';
        const indicatif = indicatifPays === 'FR' ? '+33' : '+1';
        ctx.fillText(`${indicatif} ${telephone}`, leftMargin, yPosition);
        yPosition += 18;
      }

      // Adresse
      if (fullAddress) {
        ctx.font = '400 12px Poppins, sans-serif';
        ctx.fillText(fullAddress, leftMargin, yPosition);
        yPosition += 18;
      }

      // Email
      if (email) {
        ctx.font = '400 12px Poppins, sans-serif';
        ctx.fillText(email, leftMargin, yPosition);
        yPosition += 18;
      }

      // Site web
      ctx.font = '400 12px Poppins, sans-serif';
      ctx.fillText('www.groupe-espi.fr', leftMargin, yPosition);

      // Convertir en PNG et télécharger
      canvas.toBlob((blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `signature-${userData.prenom}-${userData.nom}.png`;
          document.body.appendChild(a);
          a.click();
          
          // Nettoyer
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erreur lors de la génération PNG:', error);
      alert('Erreur lors de la génération de l\'image. Veuillez réessayer.');
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
                Indicatif pays
              </label>
              <select
                value={userData.indicatifPays}
                onChange={(e) => handleInputChange('indicatifPays', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                {INDICATIFS_PAYS.map((pays) => (
                  <option key={pays.code} value={pays.code}>
                    {pays.nom} ({pays.indicatif})
                  </option>
                ))}
              </select>
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

          {/* Boutons d'action */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>{showPreview ? 'Masquer l\'aperçu' : 'Aperçu de la signature'}</span>
            </button>
            
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

            {generationStatus === 'success' && (
              <button
                onClick={downloadSignature}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Télécharger la signature (PNG)</span>
              </button>
            )}
          </div>

          {/* Zone de prévisualisation */}
          {showPreview && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Aperçu de votre signature
              </h3>
              <div className="flex justify-center">
                <div className="max-w-2xl w-full" ref={previewRef}>
                  <SignaturePreview userData={userData} />
                </div>
              </div>
            </div>
          )}

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
