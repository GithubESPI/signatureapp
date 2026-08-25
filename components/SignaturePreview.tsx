"use client";

import { UserData } from "@/lib/word-template-processor";

interface SignaturePreviewProps {
  userData: UserData;
  className?: string;
}

export default function SignaturePreview({ userData, className = "" }: SignaturePreviewProps) {
  const fullName = `${userData.prenom || 'Prénom'} ${userData.nom || 'NOM'}`.trim();
  
  // Formatage propre de l'adresse
  const cleanAdresse = userData.adresse?.replace(/,/g, '')?.trim() || '';
  const cleanCodePostal = userData.codePostal?.replace(/,/g, '')?.trim() || '';
  const cleanVille = userData.ville?.replace(/,/g, '')?.trim() || '';
  const fullAddress = [cleanAdresse, cleanCodePostal, cleanVille].filter(Boolean).join(' ');

  // Formatage du numéro de téléphone
  let formattedPhone = '';
  if (userData.telephone) {
    const cleanPhone = userData.telephone.replace(/\s/g, '').replace(/[-.]/g, '');
    if (userData.indicatifPays === 'FR') {
      let phoneToFormat = cleanPhone;
      if (phoneToFormat.length === 9 && !phoneToFormat.startsWith('0')) {
        phoneToFormat = '0' + phoneToFormat;
      }
      if (phoneToFormat.length === 10 && phoneToFormat.startsWith('0')) {
        formattedPhone = `${phoneToFormat.slice(0, 2)} ${phoneToFormat.slice(2, 4)} ${phoneToFormat.slice(4, 6)} ${phoneToFormat.slice(6, 8)} ${phoneToFormat.slice(8)}`;
      } else {
        formattedPhone = phoneToFormat.match(/.{1,2}/g)?.join(' ') || phoneToFormat;
      }
    } else if (userData.indicatifPays === 'CA') {
      if (cleanPhone.length === 10) {
        formattedPhone = `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      } else {
        formattedPhone = cleanPhone.match(/.{1,3}/g)?.join(' ') || cleanPhone;
      }
    } else {
      formattedPhone = cleanPhone;
    }
  }

  const indicatif = userData.indicatifPays === 'FR' ? '+33' : '+1';

  return (
    <div className={`w-full select-none ${className}`} style={{ containerType: 'inline-size' }}>
      {/* Conteneur Haute Définition 2200x700 - Fond Bleu Élévation Pur (#004976) */}
      <div
        className="relative w-full overflow-hidden shadow-2xl"
        style={{
          aspectRatio: "2200/700",
          backgroundColor: "#004976",
        }}
      >
        {/* Grille Principale */}
        <div className="absolute inset-0 flex items-center justify-between px-[6cqw] py-[3.5cqw]">
          
          {/* Section Gauche : Logo Vertical Contour ESPI + Slogans Officiels en dessous */}
          <div className="flex flex-col justify-center items-center w-[30%] shrink-0">
            <img
              src="/charte/LOGO ESPI/Contour/PNG/ESPI_logo_vertical_CONTOUR.png"
              alt="Logo ESPI"
              className="w-[62%] max-w-[250px] h-auto object-contain drop-shadow-sm mb-[1.2cqw]"
            />
            <div className="text-center px-1">
              <p
                className="text-[#E6EDF1] font-semibold leading-tight"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "0.95cqw",
                  letterSpacing: "0.04em",
                }}
              >
                École Supérieure des Professions Immobilières
              </p>
            </div>
          </div>

          {/* Séparateur Vertical Biseauté Subtil */}
          <div
            className="h-[75%] w-[1.5px] opacity-25"
            style={{
              background: "linear-gradient(180deg, transparent 0%, #FFFFFF 30%, #47B5E0 70%, transparent 100%)",
            }}
          />

          {/* Section Droite : Informations Collaborateur (Décalée vers la droite avec icônes) */}
          <div
            className="flex flex-col justify-center text-left w-[62%] pl-[7cqw] pr-[1cqw]"
            style={{
              gap: "1.15cqw",
            }}
          >
            {/* Nom & Prénom */}
            <div>
              <h2
                className="font-bold text-white tracking-wide leading-none drop-shadow-sm"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "2.65cqw",
                  whiteSpace: "nowrap",
                }}
              >
                {fullName}
              </h2>
            </div>

            {/* Fonction / Poste (Bien visible en blanc éclatant) */}
            {userData.fonction && (
              <div>
                <p
                  className="font-normal text-white leading-snug break-words drop-shadow-sm"
                  style={{
                    fontFamily: "var(--font-commissioner), sans-serif",
                    fontSize: "1.75cqw",
                    opacity: 0.98,
                  }}
                >
                  {userData.fonction}
                </p>
              </div>
            )}

            {/* Téléphone avec icône */}
            {formattedPhone && (
              <div className="flex items-center gap-[0.9cqw]">
                <span className="text-[#FFB461] text-[1.3cqw] shrink-0">📞</span>
                <p
                  className="text-[#F2F6F8] font-normal leading-tight"
                  style={{
                    fontFamily: "var(--font-commissioner), sans-serif",
                    fontSize: "1.45cqw",
                    whiteSpace: "nowrap",
                  }}
                >
                  ({indicatif}) {formattedPhone}
                </p>
              </div>
            )}

            {/* Adresse Campus ESPI avec icône */}
            {fullAddress && (
              <div className="flex items-start gap-[0.9cqw]">
                <span className="text-[#47B5E0] text-[1.3cqw] shrink-0 mt-[0.1cqw]">📍</span>
                <p
                  className="text-[#E6EDF1] font-normal leading-snug break-words"
                  style={{
                    fontFamily: "var(--font-commissioner), sans-serif",
                    fontSize: "1.4cqw",
                    maxWidth: "94%",
                  }}
                >
                  {fullAddress}
                </p>
              </div>
            )}

            {/* Email Professionnel avec icône */}
            {userData.email && (
              <div className="flex items-center gap-[0.9cqw]">
                <span className="text-[#FF7D97] text-[1.3cqw] shrink-0">✉️</span>
                <p
                  className="text-[#F2F6F8] font-normal leading-tight"
                  style={{
                    fontFamily: "var(--font-commissioner), sans-serif",
                    fontSize: "1.4cqw",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userData.email}
                </p>
              </div>
            )}

            {/* Site Web Officiel ESPI avec icône */}
            <div className="flex items-center gap-[0.9cqw] pt-[0.1cqw]">
              <span className="text-[#47B5E0] text-[1.3cqw] shrink-0">🌐</span>
              <p
                className="text-white font-semibold leading-tight tracking-wider"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "1.45cqw",
                  whiteSpace: "nowrap",
                }}
              >
                www.groupe-espi.fr
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
