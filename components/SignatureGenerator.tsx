"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useGraphProfile } from "@/hooks/useGraphApi";
import { 
  FileText, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  Briefcase, 
  Send, 
  Eye, 
  Save, 
  Copy, 
  Sparkles,
  Building2 
} from "lucide-react";
import SignaturePreview from "./SignaturePreview";
import SignatureExport from "./SignatureExport";
import EmailSimulator from "./EmailSimulator";
import ToastNotification, { ToastMessage, ToastType } from "./ToastNotification";
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

const INDICATIFS_PAYS = [
  { code: 'FR', nom: 'France', indicatif: '+33' },
  { code: 'CA', nom: 'Canada', indicatif: '+1' }
];

const formatPhoneNumber = (phone: string, indicatifPays: string): string => {
  if (!phone) return '';

  const cleanPhone = phone.replace(/\s/g, '').replace(/[-.]/g, '');

  if (indicatifPays === 'FR') {
    let phoneToFormat = cleanPhone;
    if (phoneToFormat.length === 9 && !phoneToFormat.startsWith('0')) {
      phoneToFormat = '0' + phoneToFormat;
    }
    if (phoneToFormat.length === 10 && phoneToFormat.startsWith('0')) {
      return `${phoneToFormat.slice(0, 2)} ${phoneToFormat.slice(2, 4)} ${phoneToFormat.slice(4, 6)} ${phoneToFormat.slice(6, 8)} ${phoneToFormat.slice(8)}`;
    }
    return phoneToFormat.match(/.{1,2}/g)?.join(' ') || phoneToFormat;
  } else if (indicatifPays === 'CA') {
    if (cleanPhone.length === 10) {
      return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
    }
    return cleanPhone.match(/.{1,3}/g)?.join(' ') || cleanPhone;
  }

  return cleanPhone;
};

const cleanPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/\s/g, '').replace(/[-.]/g, '');
};

const ADRESSES_REFERENCE = [
  { id: "levallois", label: "Levallois-Perret", adresse: "12 rue Belgrand", ville: "LEVALLOIS-PERRET", codePostal: "92300", pays: "FR" },
  { id: "paris", label: "Paris 15e", adresse: "23 rue Cronstadt", ville: "PARIS", codePostal: "75015", pays: "FR" },
  { id: "nantes", label: "Nantes", adresse: "285 rue Louis de Broglie, CS 62357", ville: "NANTES Cedex 3", codePostal: "44323", pays: "FR" },
  { id: "marseille-docks", label: "Marseille Docks", adresse: "Les Docks Village", ville: "MARSEILLE", codePostal: "13002", pays: "FR" },
  { id: "marseille-lazaret", label: "Marseille Lazaret", adresse: "20 quai du Lazaret", ville: "MARSEILLE", codePostal: "13002", pays: "FR" },
  { id: "bordeaux", label: "Bordeaux", adresse: "73 Av. Thiers", ville: "Bordeaux", codePostal: "33100", pays: "FR" },
  { id: "lyon", label: "Lyon 9e", adresse: "95 Rue Marietton", ville: "Lyon", codePostal: "69009", pays: "FR" },
  { id: "montpellier", label: "Montpellier", adresse: "53 avenue Georges Clémenceau", ville: "Montpellier", codePostal: "34000", pays: "FR" },
  { id: "lille", label: "Lille", adresse: "8 Rue de Tournai", ville: "Lille", codePostal: "59800", pays: "FR" },
  { id: "montreal", label: "Montréal (CA)", adresse: "507 Place d'Armes local 260", ville: "Montréal", codePostal: "H2Y 2W8", pays: "CA" },
  { id: "aix", label: "Aix-en-Provence", adresse: "10 Cours Sextius", ville: "Aix-en-Provence", codePostal: "13100", pays: "FR" }
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
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showPreview, setShowPreview] = useState(true);
  const [detectionMessage, setDetectionMessage] = useState<string>('');
  const [isBuildingSignature, setIsBuildingSignature] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isCopiedHtml, setIsCopiedHtml] = useState(false);
  const [previewTab, setPreviewTab] = useState<"simulator" | "direct">("simulator");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const previewRef = useRef<HTMLDivElement>(null);
  const hiddenPreviewRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Charger le profil utilisateur
  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session, fetchProfile]);

  // Pré-remplir avec les données de session et profil Microsoft + Auto-détection du campus
  useEffect(() => {
    if (session?.user) {
      const nameParts = session.user.name?.split(' ') || [];
      const userPrenom = nameParts[0] || '';
      const userNom = nameParts.slice(1).join(' ') || '';
      const userEmail = session.user?.email || '';
      const userFonction = profile?.jobTitle || '';
      const userPhone = profile?.mobilePhone || '';

      const defaultAddress = ADRESSES_REFERENCE[1] || ADRESSES_REFERENCE[0]; // Défaut Paris
      let matchedAddress = defaultAddress;
      const locText = `${profile?.officeLocation || ''} ${profile?.department || ''}`.toLowerCase();
      
      if (locText) {
        const found = ADRESSES_REFERENCE.find(addr => 
          locText.includes(addr.id) || 
          locText.includes(addr.ville.toLowerCase()) ||
          locText.includes(addr.label.toLowerCase())
        );
        if (found) {
          matchedAddress = found;
          setDetectionMessage(`✨ Campus ESPI ${found.label} auto-détecté depuis votre profil Microsoft`);
        }
      }

      setUserData(prev => ({
        ...prev,
        prenom: userPrenom,
        nom: userNom,
        email: userEmail,
        fonction: userFonction || prev.fonction,
        telephone: userPhone || prev.telephone,
        adresseId: matchedAddress.id,
        adresse: matchedAddress.adresse,
        ville: matchedAddress.ville,
        codePostal: matchedAddress.codePostal,
        indicatifPays: matchedAddress.pays
      }));
    }
  }, [session, profile]);

  const selectCampus = (campusId: string) => {
    const adresseSelectionnee = ADRESSES_REFERENCE.find(addr => addr.id === campusId);
    if (adresseSelectionnee) {
      setUserData(prev => ({
        ...prev,
        adresseId: adresseSelectionnee.id,
        adresse: adresseSelectionnee.adresse,
        ville: adresseSelectionnee.ville,
        codePostal: adresseSelectionnee.codePostal,
        indicatifPays: adresseSelectionnee.pays
      }));
      setDetectionMessage(`📍 Campus sélectionné : ${adresseSelectionnee.label}`);
      addToast("info", `Campus ${adresseSelectionnee.label}`, `${adresseSelectionnee.adresse}, ${adresseSelectionnee.ville}`);
    }
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
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

    if (field === 'adresseId' && value) {
      selectCampus(value);
    }
  };

  const generateOutlookHtml = () => {
    const { prenom, nom, fonction, telephone, indicatifPays, adresse, ville, codePostal, email } = userData;

    const fullName = `${prenom} ${nom}`;
    const cleanAdresse = adresse?.replace(/,/g, '')?.trim() || '';
    const cleanCodePostal = codePostal?.replace(/,/g, '')?.trim() || '';
    const cleanVille = ville?.replace(/,/g, '')?.trim() || '';
    const fullAddress = [cleanAdresse, cleanCodePostal, cleanVille].filter(Boolean).join(' ');

    let phoneDisplay = '';
    if (telephone) {
      const cleanPhone = telephone.replace(/\s/g, '').replace(/[-.]/g, '');
      let formattedPhone = '';

      if (indicatifPays === 'FR') {
        if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
          formattedPhone = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
        } else {
          formattedPhone = cleanPhone.match(/.{1,2}/g)?.join(' ') || cleanPhone;
        }
      } else if (indicatifPays === 'CA') {
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
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #ffffff; background-color: #004976; border-radius: 8px; border-collapse: collapse; min-width: 540px; max-width: 620px;">
  <tr>
    <td style="padding: 24px 18px 24px 24px; vertical-align: middle; text-align: center; width: 140px; border-right: 1px solid rgba(255,255,255,0.2);">
      <a href="https://www.groupe-espi.fr" target="_blank" style="text-decoration: none; display: block;">
        <img src="https://signature.groupe-espi.fr/charte/LOGO%20ESPI/Contour/PNG/ESPI_logo_vertical_CONTOUR.png" alt="ESPI" width="95" style="width: 95px; max-width: 95px; height: auto; display: block; margin: 0 auto 8px auto; border: 0;" />
      </a>
      <div style="font-size: 8.5px; color: #e6edf1; font-weight: 600; line-height: 1.25; margin-top: 4px;">École Supérieure des Professions Immobilières</div>
    </td>
    <td style="padding: 22px 30px 22px 32px; vertical-align: middle; color: #ffffff; font-family: Arial, Helvetica, sans-serif;">
      <div style="font-size: 18px; font-weight: bold; color: #ffffff; margin-bottom: 4px; letter-spacing: 0.2px;">${fullName}</div>
      ${fonction ? `<div style="font-size: 13px; color: #ffffff; opacity: 0.95; margin-bottom: 12px; line-height: 1.35;">${fonction}</div>` : ''}
      
      ${phoneDisplay ? `<div style="font-size: 12px; color: #ffffff; opacity: 0.95; margin-bottom: 4px;">📞 <a href="tel:${telephone}" style="color: #ffffff; text-decoration: none;">${phoneDisplay}</a></div>` : ''}
      ${fullAddress ? `<div style="font-size: 12px; color: #ffffff; opacity: 0.95; margin-bottom: 4px;">📍 ${fullAddress}</div>` : ''}
      ${email ? `<div style="font-size: 12px; color: #ffffff; opacity: 0.95; margin-bottom: 4px;">✉️ <a href="mailto:${email}" style="color: #ffffff; text-decoration: none;">${email}</a></div>` : ''}
      <div style="font-size: 12px; margin-top: 8px;">🌐 <a href="https://www.groupe-espi.fr" target="_blank" style="color: #ffffff; text-decoration: none; font-weight: bold;">www.groupe-espi.fr</a></div>
    </td>
  </tr>
</table>
`.trim();
  };

  const generatePlainText = () => {
    const { prenom, nom, fonction, telephone, adresse, ville, codePostal, email } = userData;
    const fullAddress = [adresse, codePostal, ville].filter(Boolean).join(' ');
    return `${prenom} ${nom}\n${fonction}\nTél: ${telephone}\nCampus: ${fullAddress}\nEmail: ${email}\nWeb: www.groupe-espi.fr`;
  };

  const copySignatureHtmlToClipboard = async () => {
    try {
      const htmlContent = generateOutlookHtml();
      const plainText = generatePlainText();

      if (navigator.clipboard && window.ClipboardItem) {
        const htmlBlob = new Blob([htmlContent], { type: "text/html" });
        const textBlob = new Blob([plainText], { type: "text/plain" });
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": htmlBlob,
            "text/plain": textBlob,
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(htmlContent);
      }

      setIsCopiedHtml(true);
      addToast("success", "Signature copiée !", "La signature HTML officielle ESPI 2026 a été copiée dans votre presse-papier.");
      setTimeout(() => setIsCopiedHtml(false), 3000);
    } catch (err) {
      console.error("Erreur de copie dans le presse-papier:", err);
      addToast("error", "Erreur lors de la copie", "Impossible d'accéder au presse-papier. Veuillez réessayer.");
    }
  };

  const generateSignature = async () => {
    setIsGenerating(true);
    setIsBuildingSignature(true);
    setGenerationStatus('idle');
    setBuildProgress(0);

    try {
      const buildSteps = [
        { progress: 20, message: "Préparation des données..." },
        { progress: 50, message: "Application de la charte ESPI 2026..." },
        { progress: 80, message: "Finalisation du rendu HD..." },
        { progress: 100, message: "Signature prête !" }
      ];

      for (const step of buildSteps) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setBuildProgress(step.progress);
      }

      setGenerationStatus('success');
      addToast("success", "Signature générée !", "Votre signature officielle ESPI 2026 est prête.");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      setGenerationStatus('error');
      addToast("error", "Erreur de génération", "Impossible de générer la signature. Vérifiez vos données.");
    } finally {
      setIsGenerating(false);
      setIsBuildingSignature(false);
    }
  };

  const downloadSignature = async () => {
    if (!hiddenPreviewRef.current) {
      addToast("error", "Erreur", "Génération de l'image impossible.");
      return;
    }

    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(hiddenPreviewRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#004976',
        width: 2200,
        height: 700,
        windowWidth: 2200,
        windowHeight: 700,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `signature-espi-${userData.prenom}-${userData.nom}.png`;
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          addToast("success", "Image PNG téléchargée !", "Fichier enregistré aux normes officielles.");

          // Envoyer automatiquement par email
          await sendSignatureByEmail(canvas.toDataURL('image/png'));
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Erreur lors de la génération PNG:', error);
      addToast("error", "Erreur lors du téléchargement PNG", "La création du fichier image a échoué.");
    } finally {
      setIsDownloading(false);
    }
  };

  const sendSignatureByEmail = async (signatureImage: string) => {
    setIsSendingEmail(true);
    setEmailSent(false);

    const emailToSend = session?.user?.email || userData.email;

    try {
      const response = await fetch('/api/send-signature-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureImage,
          userEmail: emailToSend,
          userName: `${userData.prenom} ${userData.nom}`,
          accessToken: (session as { accessToken?: string })?.accessToken
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEmailSent(true);
        addToast("success", "Email envoyé !", `Signature transmise à ${emailToSend}`);
        setTimeout(() => {
          setEmailSent(false);
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      addToast("error", "Erreur d'envoi email", error instanceof Error ? error.message : 'Échec de l\'envoi');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-slate-200/80 relative">
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Header Formulaire */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-[#004976]/10 rounded-2xl flex items-center justify-center mr-3.5 text-[#004976]">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#004976]">Générateur de Signature ESPI</h3>
            <p className="text-xs text-slate-500 font-medium">Nouvelle Charte Graphique Officielle 2026</p>
          </div>
        </div>

        {session?.user && (
          <div className="inline-flex items-center text-xs font-semibold text-[#004976] bg-[#004976]/10 border border-[#004976]/20 px-3.5 py-1.5 rounded-full shadow-sm">
            <CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[#47B5E0]" />
            Compte Microsoft connecté
          </div>
        )}
      </div>

      {detectionMessage && (
        <div className="mb-6 text-xs font-semibold text-[#004976] bg-[#E6EDF1] p-3.5 rounded-2xl border border-[#BFD2DD] flex items-center shadow-sm">
          <Sparkles className="w-4 h-4 mr-2 text-[#47B5E0] shrink-0" />
          <span>{detectionMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#004976]" />
          <span className="ml-3 text-slate-600 font-medium">Chargement du profil...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Champs de Saisie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                Prénom *
              </label>
              <input
                type="text"
                value={userData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 transition-all font-medium text-sm"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                <User className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                Nom *
              </label>
              <input
                type="text"
                value={userData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 transition-all font-medium text-sm"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                <Briefcase className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                Fonction / Titre
              </label>
              <input
                type="text"
                value={userData.fonction}
                onChange={(e) => handleInputChange('fonction', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 transition-all font-medium text-sm"
                placeholder="Ex: Directeur de Campus, Responsable Pédagogique..."
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Pays
                </label>
                <select
                  value={userData.indicatifPays}
                  onChange={(e) => handleInputChange('indicatifPays', e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 font-semibold transition-all text-sm"
                >
                  {INDICATIFS_PAYS.map((pays) => (
                    <option key={pays.code} value={pays.code}>
                      {pays.code} ({pays.indicatif})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  <Phone className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formatPhoneNumber(userData.telephone, userData.indicatifPays)}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 transition-all font-medium text-sm"
                  placeholder={userData.indicatifPays === 'FR' ? "06 12 34 56 78" : "514 555 1234"}
                />
              </div>
            </div>

            {/* Puces / Chips de Sélection Rapide du Campus */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                <Building2 className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                Campus ESPI
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ADRESSES_REFERENCE.map((campus) => {
                  const isSelected = userData.adresseId === campus.id;
                  return (
                    <button
                      key={campus.id}
                      type="button"
                      onClick={() => selectCampus(campus.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? "bg-[#004976] text-white border-[#004976] shadow-md shadow-[#004976]/20"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <MapPin className={`w-3 h-3 ${isSelected ? "text-[#47B5E0]" : "text-slate-400"}`} />
                      {campus.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                <Mail className="w-3.5 h-3.5 inline mr-1.5 text-[#47B5E0]" />
                Adresse Email Pro
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#004976] focus:border-transparent text-slate-900 transition-all font-medium text-sm"
                placeholder="prenom.nom@groupe-espi.fr"
              />
            </div>
          </div>

          {/* Animation de Construction */}
          {isBuildingSignature && (
            <div className="p-6 bg-gradient-to-r from-[#E6EDF1] to-[#F2F6F8] rounded-2xl border border-[#BFD2DD]">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Loader2 className="w-6 h-6 text-[#004976] animate-spin" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#004976] mb-1">Génération de la signature aux normes ESPI 2026</h3>
                  <div className="w-full bg-[#BFD2DD] rounded-full h-2 mb-1.5">
                    <div
                      className="bg-[#004976] h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${buildProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#336D91] font-semibold">{buildProgress}% terminé</p>
                </div>
              </div>
            </div>
          )}

          {/* Barre d'Actions Principales */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-5 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all flex items-center gap-2 text-xs"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{showPreview ? 'Masquer l\'aperçu' : 'Aperçu'}</span>
            </button>

            <button
              type="button"
              onClick={generateSignature}
              disabled={isGenerating || !userData.prenom || !userData.nom}
              className="px-6 py-3 bg-[#004976] text-white font-bold rounded-xl hover:bg-[#003a5e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#004976]/25 flex items-center gap-2 text-xs"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#47B5E0]" />
              )}
              <span>Générer ma signature</span>
            </button>

            {/* Bouton 1-Click Copie HTML Outlook */}
            <button
              type="button"
              onClick={copySignatureHtmlToClipboard}
              className={`px-6 py-3 font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs ${
                isCopiedHtml
                  ? "bg-emerald-600 text-white"
                  : "bg-[#002D4A] text-white hover:bg-[#001D30] shadow-[#002D4A]/20"
              }`}
            >
              {isCopiedHtml ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Copy className="w-4 h-4 text-[#47B5E0]" />
              )}
              <span>{isCopiedHtml ? 'Copié !' : 'Copier pour Outlook (HTML)'}</span>
            </button>

            {generationStatus === 'success' && (
              <button
                type="button"
                onClick={downloadSignature}
                disabled={isDownloading || isSendingEmail}
                className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-emerald-200 flex items-center gap-2 text-xs"
              >
                {isDownloading || isSendingEmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : emailSent ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>
                  {isDownloading ? 'Téléchargement...' :
                    isSendingEmail ? 'Envoi...' :
                      emailSent ? 'Email envoyé !' :
                        'Télécharger PNG + Email'}
                </span>
              </button>
            )}
          </div>

          {/* Zone de Prévisualisation Interactives */}
          {showPreview && (
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("simulator")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      previewTab === "simulator"
                        ? "bg-white text-[#004976] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    💌 Simulateur Mail (Mode Sombre / Clair)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("direct")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      previewTab === "direct"
                        ? "bg-white text-[#004976] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🖼️ Rendu Graphique Brut HD (2200x700)
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {previewTab === "simulator" ? "Rendu dans un vrai client mail Outlook" : "Gabarit officiel HD"}
                </div>
              </div>

              {previewTab === "simulator" ? (
                <EmailSimulator
                  userData={userData}
                  onCopyHtml={copySignatureHtmlToClipboard}
                  onDownloadPng={downloadSignature}
                />
              ) : (
                <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200" ref={previewRef}>
                  <SignaturePreview userData={userData} />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Conteneur caché pour le rendu PNG 2200x700 */}
      <div
        style={{
          position: 'fixed',
          left: '0px',
          top: '0px',
          width: '2200px',
          height: '700px',
          zIndex: -9999,
          opacity: 0,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
        data-hidden-preview
      >
        <div ref={hiddenPreviewRef} style={{ width: '2200px', height: '700px', backgroundColor: '#004976' }}>
          <SignatureExport userData={userData} />
        </div>
      </div>
    </div>
  );
}
