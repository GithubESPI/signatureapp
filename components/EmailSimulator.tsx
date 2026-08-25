"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Mail, 
  User, 
  Paperclip, 
  CornerUpLeft, 
  MoreHorizontal, 
  Copy, 
  Check, 
  Code, 
  Image as ImageIcon 
} from "lucide-react";
import SignaturePreview from "./SignaturePreview";

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

interface EmailSimulatorProps {
  userData: UserData;
  onCopyHtml?: () => void;
  onDownloadPng?: () => void;
}

export default function EmailSimulator({ userData, onCopyHtml, onDownloadPng }: EmailSimulatorProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<"html" | "image">("html");
  const [copied, setCopied] = useState(false);

  const fullName = `${userData.prenom || 'Jean'} ${userData.nom || 'DUPONT'}`;
  const emailAddr = userData.email || 'j.dupont@groupe-espi.fr';
  const cleanAdresse = (userData.adresse || '').replace(/,/g, '').trim();
  const cleanCP = (userData.codePostal || '').replace(/,/g, '').trim();
  const cleanVille = (userData.ville || '').replace(/,/g, '').trim();
  const fullAddress = [cleanAdresse, cleanCP, cleanVille].filter(Boolean).join(' ');

  let phoneDisplay = '';
  if (userData.telephone) {
    const cleanPhone = userData.telephone.replace(/\s/g, '').replace(/[-.]/g, '');
    let formattedPhone = cleanPhone;
    if (userData.indicatifPays === 'FR') {
      if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
        formattedPhone = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
      } else {
        formattedPhone = cleanPhone.match(/.{1,2}/g)?.join(' ') || cleanPhone;
      }
    }
    const indicatif = userData.indicatifPays === 'FR' ? '+33' : '+1';
    phoneDisplay = `(${indicatif}) ${formattedPhone}`;
  }

  const handleCopy = () => {
    if (onCopyHtml) {
      onCopyHtml();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden shadow-xl">
      {/* Simulation Bar Header (Barre d'outils Outlook) */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs font-mono text-slate-400 ml-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-blue-400" />
            Aperçu Client Email Outlook - ESPI
          </span>
        </div>

        {/* Contrôles du Simulateur : Mode Clair/Sombre & Rendu HTML/PNG */}
        <div className="flex items-center gap-2">
          {/* Toggle Type de Rendu */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex items-center text-xs font-medium border border-slate-700">
            <button
              onClick={() => setViewMode("html")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === "html" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              HTML Cliquable
            </button>
            <button
              onClick={() => setViewMode("image")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                viewMode === "image" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Image PNG
            </button>
          </div>

          {/* Toggle Mode Clair / Mode Sombre */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              isDarkMode
                ? "bg-slate-800 text-amber-400 border-amber-400/30 hover:bg-slate-700"
                : "bg-slate-100 text-slate-900 border-slate-300 hover:bg-white"
            }`}
          >
            {isDarkMode ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>Mode Sombre</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Mode Clair</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interface du Message Email */}
      <div className={`transition-colors duration-300 ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-white text-slate-900"}`}>
        {/* En-tête du Message */}
        <div className={`p-6 border-b ${isDarkMode ? "border-slate-800" : "border-gray-100"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={`text-lg font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                RE: Validation de votre signature officielle ESPI
              </h2>
              <div className="mt-2 flex items-center space-x-3 text-xs">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md">
                  {userData.prenom?.charAt(0) || 'J'}{userData.nom?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {fullName} <span className={`font-normal text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>&lt;{emailAddr}&gt;</span>
                  </div>
                  <div className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                    À : Direction de la Communication &lt;communication@groupe-espi.fr&gt;
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-gray-400"}`}>Aujourd'hui, 10:45</span>
              <button className={`p-1.5 rounded-lg ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <CornerUpLeft className="w-4 h-4" />
              </button>
              <button className={`p-1.5 rounded-lg ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Corps de l'Email & Signature */}
        <div className="p-6 space-y-6 text-sm leading-relaxed">
          <div className={`space-y-3 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
            <p>Bonjour,</p>
            <p>
              Veuillez trouver ci-dessous le rendu dynamique de ma signature d'email chartée aux couleurs du <strong>Groupe ESPI</strong>.
            </p>
            <p>
              Cette version a été générée automatiquement et intègre nos informations institutionnelles.
            </p>
            <p>Bien cordialement,</p>
          </div>

          {/* Emplacement de la Signature */}
          <div className="pt-4 border-t border-dashed border-gray-300 dark:border-slate-800">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>-- Début de la signature --</span>
              {viewMode === "html" && (
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <Code className="w-3 h-3" /> HTML Inline Cliquable (Compatible Outlook / Gmail)
                </span>
              )}
            </div>

            {/* Rendu Dynamique de la Signature dans le Thème Sélectionné */}
            {viewMode === "html" ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="py-2 overflow-x-auto"
              >
                <table 
                  cellPadding="0" 
                  cellSpacing="0" 
                  border={0} 
                  style={{
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: isDarkMode ? '#e2e8f0' : '#333333',
                    lineHeight: '1.4',
                    borderCollapse: 'collapse'
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{
                        padding: '12px 18px',
                        backgroundColor: '#2c5aa0',
                        color: '#ffffff',
                        borderRadius: '6px 6px 0 0'
                      }} colSpan={2}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>ESPI</div>
                        <div style={{ fontSize: '11px', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
                          FORMER À L'IMMOBILIER DE DEMAIN
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{
                        padding: '16px 18px',
                        backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                        borderLeft: '4px solid #2c5aa0',
                        borderRight: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        color: isDarkMode ? '#f8fafc' : '#1e293b'
                      }}>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: isDarkMode ? '#60a5fa' : '#1e3a8a', marginBottom: '4px' }}>
                          {fullName}
                        </div>
                        {userData.fonction && (
                          <div style={{ fontSize: '13px', color: isDarkMode ? '#cbd5e1' : '#475569', fontWeight: 500, marginBottom: '10px' }}>
                            {userData.fonction}
                          </div>
                        )}
                        {phoneDisplay && (
                          <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: '4px' }}>
                            📞 <a href={`tel:${userData.telephone}`} style={{ color: isDarkMode ? '#93c5fd' : '#2c5aa0', textDecoration: 'none', fontWeight: 500 }}>{phoneDisplay}</a>
                          </div>
                        )}
                        {fullAddress && (
                          <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: '4px' }}>
                            📍 {fullAddress}
                          </div>
                        )}
                        {emailAddr && (
                          <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#334155', marginBottom: '4px' }}>
                            ✉️ <a href={`mailto:${emailAddr}`} style={{ color: isDarkMode ? '#93c5fd' : '#2c5aa0', textDecoration: 'none' }}>{emailAddr}</a>
                          </div>
                        )}
                        <div style={{ fontSize: '12px', color: isDarkMode ? '#cbd5e1' : '#334155' }}>
                          🌐 <a href="https://www.groupe-espi.fr" target="_blank" rel="noreferrer" style={{ color: isDarkMode ? '#93c5fd' : '#2c5aa0', textDecoration: 'none', fontWeight: 'bold' }}>www.groupe-espi.fr</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="py-2"
              >
                <SignaturePreview userData={userData} />
              </motion.div>
            )}

            <div className="mt-2 text-xs text-slate-400 font-mono">
              <span>-- Fin de la signature --</span>
            </div>
          </div>
        </div>

        {/* Barre d'Action Inférieure */}
        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-gray-100"}`}>
          <div className="text-xs text-slate-400">
            💡 Astuce : Testez l'affichage en mode sombre pour garantir une lisibilité optimale auprès de vos destinataires.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Copier le HTML Outlook"}</span>
            </button>

            {onDownloadPng && (
              <button
                onClick={onDownloadPng}
                className={`px-4 py-2 rounded-xl font-semibold text-xs transition-all border flex items-center gap-1.5 ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
                    : "bg-white text-slate-700 border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Télécharger PNG</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
