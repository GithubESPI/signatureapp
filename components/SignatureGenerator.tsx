"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useGraphProfile } from "@/hooks/useGraphApi";
import { FileText, Download, Loader2, CheckCircle, XCircle, User, Phone, MapPin, Mail, Briefcase, Send, Eye, Save } from "lucide-react";
import OutlookSignatureManager from "./OutlookSignatureManager";
import SignaturePreview from "./SignaturePreview";
import { SignatureConverter } from "@/lib/signature-converter";
import html2canvas from "html2canvas";

interface UserData {
  prenom: string;
  nom: string;
  fonction: string;
  telephone: string;
  indicatifPays: string;
  adresseId: string;
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

// Fonction pour formater un numéro de téléphone avec des espaces pour une meilleure lisibilité
const formatPhoneNumber = (phone: string, indicatifPays: string): string => {
  if (!phone) return '';

  // Nettoyer le numéro (enlever les espaces, tirets, points)
  let cleanPhone = phone.replace(/\s/g, '').replace(/[-.]/g, '');

  if (indicatifPays === 'FR') {
    // Si le numéro ne commence pas par 0, on l'ajoute (sauf s'il est vide)
    if (cleanPhone.length > 0 && !cleanPhone.startsWith('0')) {
      cleanPhone = '0' + cleanPhone;
    }

    // Format français : XX XX XX XX XX
    return cleanPhone.match(/.{1,2}/g)?.join(' ') || cleanPhone;
  } else if (indicatifPays === 'CA') {
    // Retirer le 0 au début si présent pour le Canada (peu probable mais par sécurité)
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

    // Format canadien : XXX XXX XXXX (10 chiffres)
    if (cleanPhone.length === 10) {
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
    }
    // Si le format n'est pas standard, retourner avec espaces
    return cleanPhone.match(/.{1,3}/g)?.join(' ') || cleanPhone;
  }

  return cleanPhone;
};

// Fonction pour nettoyer le numéro de téléphone (enlever les espaces pour stockage)
const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/\s/g, '').replace(/[-.]/g, '');
};

// Base de données des adresses avec villes et codes postaux correspondants
const ADRESSES_REFERENCE = [
  { id: "levallois", adresse: "12 rue Belgrand", ville: "LEVALLOIS-PERRET", codePostal: "92300", pays: "FR" },
  { id: "paris", adresse: "23 rue Cronstadt", ville: "PARIS", codePostal: "75015", pays: "FR" },
  { id: "nantes", adresse: "285 rue Louis de Broglie, CS 62357", ville: "NANTES Cedex 3", codePostal: "44323", pays: "FR" },
  { id: "marseille-docks", adresse: "Les Docks Village", ville: "MARSEILLE", codePostal: "13002", pays: "FR" },
  { id: "marseille-lazaret", adresse: "20 quai du Lazaret", ville: "MARSEILLE", codePostal: "13002", pays: "FR" },
  { id: "bordeaux", adresse: "73 Av. Thiers", ville: "Bordeaux", codePostal: "33100", pays: "FR" },
  { id: "lyon", adresse: "95 Rue Marietton", ville: "Lyon", codePostal: "69009", pays: "FR" },
  { id: "montpellier", adresse: "53 avenue Georges Clémenceau", ville: "Montpellier", codePostal: "34000", pays: "FR" },
  { id: "lille", adresse: "8 Rue de Tournai", ville: "Lille", codePostal: "59800", pays: "FR" },
  { id: "montreal", adresse: "507 Place d'Armes local 260", ville: "Montréal", codePostal: "H2Y 2W8", pays: "CA" },
  { id: "aix", adresse: "10 cours Sextius", ville: "Aix-en-Provence", codePostal: "13800", pays: "FR" }
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
    adresseId: '',
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
  const [detectionMessage, setDetectionMessage] = useState<string>('');
  const [isBuildingSignature, setIsBuildingSignature] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const hiddenPreviewRef = useRef<HTMLDivElement>(null);

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
    // Pour le téléphone, formater avec des espaces à l'affichage mais stocker sans espaces
    if (field === 'telephone') {
      const cleanedValue = cleanPhoneNumber(value);
      setUserData(prev => ({
        ...prev,
        telephone: cleanedValue
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Gestion automatique de la sélection d'adresse
    if (field === 'adresseId' && value) {
      const adresseSelectionnee = ADRESSES_REFERENCE.find(addr => addr.id === value);
      if (adresseSelectionnee) {
        setUserData(prev => ({
          ...prev,
          adresse: adresseSelectionnee.adresse,
          ville: adresseSelectionnee.ville,
          codePostal: adresseSelectionnee.codePostal,
          indicatifPays: adresseSelectionnee.pays
        }));
        setDetectionMessage(`✅ Adresse sélectionnée: ${adresseSelectionnee.ville} (${adresseSelectionnee.codePostal})`);
        // Effacer le message après 3 secondes
        setTimeout(() => setDetectionMessage(''), 3000);
      }
    }
  };


  const generatePreviewHtml = () => {
    const { prenom, nom, fonction, telephone, indicatifPays, adresse, ville, codePostal, email } = userData;

    const fullName = `${prenom} ${nom}`;
    // Nettoyer les virgules des valeurs individuelles avant de les joindre
    const cleanAdresse = adresse?.replace(/,/g, '')?.trim() || '';
    const cleanCodePostal = codePostal?.replace(/,/g, '')?.trim() || '';
    const cleanVille = ville?.replace(/,/g, '')?.trim() || '';
    const fullAddress = [cleanAdresse, cleanCodePostal, cleanVille].filter(Boolean).join(' ');

    // Calculer les positions comme dans le PNG (mêmes dimensions 2200x700)
    const width = 2200;
    const height = 700;
    const leftMargin = 1550; // Position ajustée vers la droite (environ 61%)

    // Formater le téléphone avec 0 et espaces réduits
    let phoneDisplay = '';
    if (telephone) {
      const cleanPhone = telephone.replace(/\s/g, '').replace(/[-.]/g, '');
      let formattedPhone = '';

      if (indicatifPays === 'FR') {
        // Format français avec 0 : 0X XX XX XX XX
        if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
          formattedPhone = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
        } else {
          formattedPhone = cleanPhone.match(/.{1,2}/g)?.join(' ') || cleanPhone;
        }
      } else if (indicatifPays === 'CA') {
        // Format canadien : XXX XXX XXXX
        if (cleanPhone.length === 10) {
          formattedPhone = `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
        } else {
          formattedPhone = cleanPhone.match(/.{1,3}/g)?.join(' ') || cleanPhone;
        }
      } else {
        formattedPhone = cleanPhone;
      }

      const indicatif = indicatifPays === 'FR' ? '+33' : '+1';
      phoneDisplay = `(${indicatif}) ${formattedPhone}`;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Signature ESPI</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
    }
    
    .signature-container {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      background-image: url('/images/model-signature.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      overflow: hidden;
    }
    
    .signature-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
    }
    
    .right-section {
      position: absolute;
      left: ${leftMargin}px;
      top: 130px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      color: white;
    }
    
    .name {
      font-size: 48px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      color: white;
      margin-bottom: 70px;
      line-height: 1;
    }
    
    .function {
      font-size: 36px;
      font-weight: 500;
      font-family: 'Poppins', sans-serif;
      color: white;
      margin-bottom: 65px;
      line-height: 1;
    }
    
    .contact-info {
      font-size: 34px;
      font-weight: 400;
      font-family: 'Poppins', sans-serif;
      color: white;
      margin-bottom: 65px;
      line-height: 1;
    }
    
    .website {
      font-size: 34px;
      font-weight: 400;
      font-family: 'Poppins', sans-serif;
      color: white;
      line-height: 1;
    }
    
    .website a {
      color: white;
      text-decoration: none;
    }
    
    .website a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="signature-container">
    <div class="signature-content">
      <!-- Section droite - Informations utilisateur (alignée comme le PNG) -->
      <div class="right-section">
        <div class="name">${fullName}</div>
        ${fonction ? `<div class="function">${fonction}</div>` : ''}
        ${telephone ? `<div class="contact-info">${phoneDisplay}</div>` : ''}
        ${fullAddress ? `<div class="contact-info">${fullAddress}</div>` : ''}
        <div class="website"><a href="https://www.groupe-espi.fr">www.groupe-espi.fr</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const generateSignature = async () => {
    setIsGenerating(true);
    setIsBuildingSignature(true);
    setGenerationStatus('idle');
    setBuildProgress(0);

    try {
      // Animation de construction de la signature
      const buildSteps = [
        { progress: 20, message: "Préparation des données..." },
        { progress: 40, message: "Construction du design..." },
        { progress: 60, message: "Application des styles..." },
        { progress: 80, message: "Finalisation de la signature..." },
        { progress: 100, message: "Signature prête !" }
      ];

      for (const step of buildSteps) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setBuildProgress(step.progress);
      }

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
      setIsBuildingSignature(false);
    }
  };

  const downloadSignature = async () => {
    if (!hiddenPreviewRef.current) {
      alert("Erreur lors de la génération de l'image.");
      return;
    }

    setIsDownloading(true);
    try {
      // Attendre un court instant pour s'assurer que le rendu est terminé
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(hiddenPreviewRef.current, {
        scale: 1, // Échelle 1 car le conteneur a déjà la bonne taille (2200px)
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: 2200,
        height: 700,
        windowWidth: 2200,
        windowHeight: 700,
        onclone: (clonedDoc) => {
          // S'assurer que les éléments sont visibles dans le clone
          const element = clonedDoc.querySelector('[data-hidden-preview]') as HTMLElement;
          if (element) {
            element.style.display = 'block';
            element.style.visibility = 'visible';
          }
        }
      });

      // Convertir en PNG et télécharger
      canvas.toBlob(async (blob) => {
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

          // Envoyer automatiquement par email
          await sendSignatureByEmail(canvas.toDataURL('image/png'));
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erreur lors de la génération PNG avec html2canvas:', error);
      alert('Erreur lors de la génération de l\'image. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Fonction pour envoyer la signature par email
  const sendSignatureByEmail = async (signatureImage: string) => {
    setIsSendingEmail(true);
    setEmailSent(false);

    const emailToSend = session?.user?.email || userData.email;
    console.log('📧 Email de destination:', emailToSend);
    console.log('📧 Session user:', session?.user);

    try {
      const response = await fetch('/api/send-signature-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureImage,
          userEmail: emailToSend,
          userName: `${userData.prenom} ${userData.nom}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        // Réinitialiser l'état après 3 secondes
        setTimeout(() => {
          setEmailSent(false);
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      alert('Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Fonction pour télécharger la signature en HTML (avec liens cliquables)
  const downloadSignatureHtml = () => {
    try {
      const htmlContent = generatePreviewHtml();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signature-${userData.prenom}-${userData.nom}.html`;
      document.body.appendChild(a);
      a.click();

      // Nettoyer
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erreur lors du téléchargement HTML:', error);
      alert('Erreur lors du téléchargement du fichier HTML. Veuillez réessayer.');
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
                value={formatPhoneNumber(userData.telephone, userData.indicatifPays)}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder={userData.indicatifPays === 'FR' ? "06 12 34 56 78" : "514 555 1234"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Adresse de l'entreprise
              </label>
              <select
                value={userData.adresseId}
                onChange={(e) => handleInputChange('adresseId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              >
                <option value="">Sélectionnez votre adresse</option>
                {ADRESSES_REFERENCE.map((adresse) => (
                  <option key={adresse.id} value={adresse.id}>
                    {adresse.adresse} - {adresse.ville} ({adresse.codePostal})
                  </option>
                ))}
              </select>
              {detectionMessage && (
                <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-lg border border-green-200">
                  {detectionMessage}
                </div>
              )}
            </div>

            {/* Champs automatiquement remplis - en lecture seule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Adresse (automatique)
              </label>
              <input
                type="text"
                value={userData.adresse}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Sélectionnez une adresse ci-dessus"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Code postal (automatique)
              </label>
              <input
                type="text"
                value={userData.codePostal}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Sélectionnez une adresse ci-dessus"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Ville d'appartenance (automatique)
              </label>
              <input
                type="text"
                value={userData.ville}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                placeholder="Sélectionnez une adresse ci-dessus"
              />
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
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>{showPreview ? 'Masquer l\'aperçu' : 'Aperçu de la signature'}</span>
            </button>

            {/* Animation de construction de la signature */}
            {isBuildingSignature && (
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Construction de votre signature</h3>
                    <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${buildProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-blue-700">
                      {buildProgress < 20 && "Préparation des données..."}
                      {buildProgress >= 20 && buildProgress < 40 && "Construction du design..."}
                      {buildProgress >= 40 && buildProgress < 60 && "Application des styles..."}
                      {buildProgress >= 60 && buildProgress < 80 && "Finalisation de la signature..."}
                      {buildProgress >= 80 && buildProgress < 100 && "Finalisation de la signature..."}
                      {buildProgress === 100 && "Signature prête !"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">{buildProgress}% terminé</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={generateSignature}
              disabled={isGenerating || !userData.prenom || !userData.nom}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                disabled={isDownloading || isSendingEmail}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSendingEmail ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : emailSent ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>
                  {isDownloading ? 'Téléchargement en cours...' :
                    isSendingEmail ? 'Envoi par email...' :
                      emailSent ? 'Email envoyé !' :
                        'Télécharger la signature (PNG)'}
                </span>
              </button>
            )}

            {/* Animation de téléchargement */}
            {isDownloading && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Génération de l'image PNG...</p>
                    <p className="text-xs text-green-600">Veuillez patienter, votre signature est en cours de téléchargement</p>
                  </div>
                </div>
              </div>
            )}

            {/* Animation d'envoi d'email */}
            {isSendingEmail && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Send className="w-4 h-4 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800">Envoi de votre signature par email...</p>
                    <p className="text-xs text-blue-600">Votre signature sera automatiquement envoyée dans votre boîte mail</p>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation d'envoi d'email */}
            {emailSent && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800">Email envoyé avec succès !</p>
                    <p className="text-xs text-green-600">Votre signature a été envoyée dans votre boîte mail</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zone de prévisualisation */}
          {showPreview && (
            <div className="mt-8 w-full overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Aperçu de votre signature
              </h3>
              <div className="w-full" ref={previewRef}>
                <SignaturePreview userData={userData} />
              </div>
            </div>
          )}


        </div>
      )}

      {/* Conteneur caché pour la génération d'image haute résolution */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '2200px',
          height: '700px',
          overflow: 'hidden'
        }}
        data-hidden-preview
      >
        <div ref={hiddenPreviewRef} style={{ width: '2200px', height: '700px' }}>
          <SignaturePreview userData={userData} />
        </div>
      </div>


    </div>
  );
}
