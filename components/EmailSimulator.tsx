"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Mail, 
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
    <div className="w-full bg-slate-50 border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xl">
      {/* Simulation Bar Header (Barre d'outils Outlook) */}
      <div className="bg-[#002D4A] text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#001D30]">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          <span className="text-xs font-mono text-[#BFD2DD] ml-2 flex items-center gap-1.5 font-semibold">
            <Mail className="w-3.5 h-3.5 text-[#47B5E0]" />
            Aperçu Client Email Outlook - Charte ESPI 2026
          </span>
        </div>

        {/* Contrôles du Simulateur : Mode Clair/Sombre & Rendu HTML/PNG */}
        <div className="flex items-center gap-2">
          {/* Toggle Type de Rendu */}
          <div className="bg-[#003A5E] p-0.5 rounded-xl flex items-center text-xs font-semibold border border-[#004976]">
            <button
              onClick={() => setViewMode("html")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "html" ? "bg-[#004976] text-white shadow-sm" : "text-[#BFD2DD] hover:text-white"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-[#47B5E0]" />
              HTML Cliquable
            </button>
            <button
              onClick={() => setViewMode("image")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                viewMode === "image" ? "bg-[#004976] text-white shadow-sm" : "text-[#BFD2DD] hover:text-white"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#FFB461]" />
              Image PNG HD
            </button>
          </div>

          {/* Toggle Mode Clair / Mode Sombre */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isDarkMode
                ? "bg-[#003A5E] text-[#FFB461] border-[#FFB461]/30 hover:bg-[#004976]"
                : "bg-white text-[#002D4A] border-slate-200 hover:bg-slate-50"
            }`}
          >
            {isDarkMode ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#FFB461]" />
                <span>Mode Sombre</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FFB461]" />
                <span>Mode Clair</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interface du Message Email */}
      <div className={`transition-colors duration-300 ${isDarkMode ? "bg-[#091522] text-slate-100" : "bg-white text-slate-900"}`}>
        {/* En-tête du Message */}
        <div className={`p-6 border-b ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className={`text-base font-bold ${isDarkMode ? "text-slate-100" : "text-[#002D4A]"}`}>
                RE: Validation de votre signature officielle ESPI 2026
              </h2>
              <div className="mt-2.5 flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#004976] to-[#47B5E0] text-white font-bold flex items-center justify-center shadow-md">
                  {userData.prenom?.charAt(0) || 'J'}{userData.nom?.charAt(0) || 'D'}
                </div>
                <div>
                  <div className="font-bold text-sm">
                    {fullName} <span className={`font-normal text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>&lt;{emailAddr}&gt;</span>
                  </div>
                  <div className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                    À : Direction de la Communication &lt;communication@groupe-espi.fr&gt;
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Aujourd&apos;hui, 10:45</span>
              <button className={`p-1.5 rounded-lg ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <CornerUpLeft className="w-4 h-4" />
              </button>
              <button className={`p-1.5 rounded-lg ${isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
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
              Veuillez trouver ci-dessous le rendu dynamique de ma signature d&apos;email chartée aux couleurs de la <strong>Nouvelle Charte ESPI</strong>.
            </p>
            <p>
              Cette version a été générée automatiquement et intègre nos informations institutionnelles.
            </p>
            <p>Bien cordialement,</p>
          </div>

          {/* Emplacement de la Signature */}
          <div className="pt-4 border-t border-dashed border-slate-300 dark:border-slate-800">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>-- Début de la signature --</span>
              {viewMode === "html" && (
                <span className="text-[#47B5E0] flex items-center gap-1 font-bold">
                  <Code className="w-3.5 h-3.5" /> HTML Inline Cliquable (Outlook &amp; Gmail)
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
                    fontFamily: "'Commissioner', Arial, Helvetica, sans-serif",
                    fontSize: "13px",
                    color: "#ffffff",
                    backgroundColor: "#004976",
                    borderRadius: "8px",
                    borderCollapse: "collapse",
                    minWidth: "540px",
                    maxWidth: "620px",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{
                        padding: "24px 18px 24px 24px",
                        verticalAlign: "middle",
                        textAlign: "center",
                        width: "140px",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                      }}>
                        <a href="https://www.groupe-espi.fr" target="_blank" rel="noreferrer" style={{ textDecoration: "none", display: "block" }}>
                          <img 
                            src="/charte/LOGO ESPI/Contour/PNG/ESPI_logo_vertical_CONTOUR.png" 
                            alt="ESPI" 
                            width="95" 
                            style={{ width: "95px", maxWidth: "95px", height: "auto", display: "block", margin: "0 auto 8px auto", border: 0 }} 
                          />
                        </a>
                        <div style={{ fontSize: "8.5px", color: "#e6edf1", fontWeight: 600, lineHeight: 1.25, marginTop: "4px" }}>
                          École Supérieure des Professions Immobilières
                        </div>
                      </td>
                      <td style={{
                        padding: "22px 30px 22px 32px",
                        verticalAlign: "middle",
                        color: "#ffffff",
                        fontFamily: "'Commissioner', Arial, Helvetica, sans-serif",
                      }}>
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#ffffff", marginBottom: "4px", letterSpacing: "0.2px" }}>
                          {fullName}
                        </div>
                        {userData.fonction && (
                          <div style={{ fontSize: "13px", color: "#ffffff", opacity: 0.95, marginBottom: "12px", lineHeight: 1.35 }}>
                            {userData.fonction}
                          </div>
                        )}
                        {phoneDisplay && (
                          <div style={{ fontSize: "12px", color: "#ffffff", opacity: 0.95, marginBottom: "4px" }}>
                            📞 <a href={`tel:${userData.telephone}`} style={{ color: "#ffffff", textDecoration: "none" }}>{phoneDisplay}</a>
                          </div>
                        )}
                        {fullAddress && (
                          <div style={{ fontSize: "12px", color: "#ffffff", opacity: 0.95, marginBottom: "4px" }}>
                            📍 {fullAddress}
                          </div>
                        )}
                        {userData.email && (
                          <div style={{ fontSize: "12px", color: "#ffffff", opacity: 0.95, marginBottom: "4px" }}>
                            ✉️ <a href={`mailto:${userData.email}`} style={{ color: "#ffffff", textDecoration: "none" }}>{userData.email}</a>
                          </div>
                        )}
                        <div style={{ fontSize: "12px", marginTop: "8px" }}>
                          🌐 <a href="https://www.groupe-espi.fr" target="_blank" rel="noreferrer" style={{ color: "#ffffff", textDecoration: "none", fontWeight: "bold" }}>
                            www.groupe-espi.fr
                          </a>
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

            <div className="mt-3 text-xs text-slate-400 font-mono">
              <span>-- Fin de la signature --</span>
            </div>
          </div>
        </div>

        {/* Barre d'Action Inférieure */}
        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${isDarkMode ? "bg-[#001D30] border-slate-800" : "bg-slate-50 border-slate-100"}`}>
          <div className="text-xs text-slate-400">
            💡 Astuce : Testez l&apos;affichage en mode sombre pour garantir une lisibilité optimale auprès de vos destinataires.
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                copied
                  ? "bg-emerald-600 text-white"
                  : "bg-[#004976] text-white hover:bg-[#003a5e] shadow-md shadow-[#004976]/20"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-[#47B5E0]" />}
              <span>{copied ? "Copié !" : "Copier le HTML Outlook"}</span>
            </button>

            {onDownloadPng && (
              <button
                onClick={onDownloadPng}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border flex items-center gap-1.5 ${
                  isDarkMode
                    ? "bg-[#003A5E] text-white border-[#004976] hover:bg-[#004976]"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm"
                }`}
              >
                <Paperclip className="w-3.5 h-3.5 text-[#FFB461]" />
                <span>Télécharger PNG</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
