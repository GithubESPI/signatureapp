"use client";

import { useState, useEffect } from "react";

const examples = [
  {
    prenom: "Souley",
    nom: "LITIE",
    fonction: "Gestionnaire exploitation système",
    telephone: "06 81 30 09 32",
    adresse: "23 rue Cronstadt, 75015 Paris",
    email: "s.litie@groupe-espi.fr"
  },
  {
    prenom: "Samuel",
    nom: "DEPRAZ",
    fonction: "Directeur de la recherche et de la prospective",
    telephone: "7 57 12 72 66",
    adresse: "23 rue de Cronstadt, 75015 Paris",
    email: "s.depraz@groupe-espi.fr"
  },
  {
    prenom: "Marie",
    nom: "LAURENT",
    fonction: "Responsable des Relations Entreprises",
    telephone: "04 72 00 11 22",
    adresse: "95 Rue Marietton, 69009 Lyon",
    email: "m.laurent@groupe-espi.fr"
  }
];

export default function AnimatedSignaturePreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedData, setDisplayedData] = useState({
    prenom: "",
    nom: "",
    fonction: "",
    telephone: "",
    adresse: "",
    email: ""
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentExample = examples[currentIndex];
    const fullText = {
      prenom: currentExample.prenom,
      nom: currentExample.nom,
      fonction: currentExample.fonction,
      telephone: currentExample.telephone,
      adresse: currentExample.adresse,
      email: currentExample.email
    };

    let typingSpeed = isDeleting ? 25 : 45;

    const maxLen = Math.max(
      fullText.prenom.length + fullText.nom.length + 1,
      fullText.fonction.length,
      fullText.telephone.length,
      fullText.adresse.length,
      fullText.email.length
    );

    if (!isDeleting && charIndex === maxLen) {
      typingSpeed = 2500;
    } else if (isDeleting && charIndex === 0) {
      typingSpeed = 400;
    }

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < maxLen) {
          setDisplayedData({
            prenom: fullText.prenom.slice(0, Math.max(0, charIndex)),
            nom: charIndex > fullText.prenom.length ? fullText.nom.slice(0, charIndex - fullText.prenom.length - 1) : "",
            fonction: fullText.fonction.slice(0, charIndex),
            telephone: fullText.telephone.slice(0, charIndex),
            adresse: fullText.adresse.slice(0, charIndex),
            email: fullText.email.slice(0, charIndex)
          });
          setCharIndex(prev => prev + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIndex > 0) {
          setDisplayedData({
            prenom: fullText.prenom.slice(0, Math.max(0, charIndex)),
            nom: charIndex > fullText.prenom.length ? fullText.nom.slice(0, charIndex - fullText.prenom.length - 1) : "",
            fonction: fullText.fonction.slice(0, charIndex),
            telephone: fullText.telephone.slice(0, charIndex),
            adresse: fullText.adresse.slice(0, charIndex),
            email: fullText.email.slice(0, charIndex)
          });
          setCharIndex(prev => prev - 1);
        } else {
          setIsDeleting(false);
          setCurrentIndex(prev => (prev + 1) % examples.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, currentIndex]);

  return (
    <div className="w-full select-none" style={{ containerType: "inline-size" }}>
      <div
        className="relative w-full overflow-hidden shadow-2xl rounded-2xl"
        style={{
          aspectRatio: "2200/700",
          backgroundColor: "#004976",
        }}
      >
        {/* Grille Principale */}
        <div className="absolute inset-0 flex items-center justify-between px-[6cqw] py-[3.5cqw]">

          {/* Section Gauche : Logo Vertical Contour ESPI + Slogans */}
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

          {/* Séparateur Vertical */}
          <div
            className="h-[75%] w-[1.5px] opacity-25"
            style={{
              background: "linear-gradient(180deg, transparent 0%, #FFFFFF 30%, #47B5E0 70%, transparent 100%)",
            }}
          />

          {/* Section Droite : Données Collaborateur Animées (Décalée vers la droite avec icônes) */}
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
                {displayedData.prenom} {displayedData.nom}
                <span className="text-[#FFB461] animate-pulse">|</span>
              </h2>
            </div>

            {/* Fonction */}
            <div>
              <p
                className="font-normal text-white leading-snug break-words drop-shadow-sm min-h-[1.75cqw]"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "1.75cqw",
                  opacity: 0.98,
                }}
              >
                {displayedData.fonction}
              </p>
            </div>

            {/* Téléphone */}
            <div className="flex items-center gap-[0.9cqw] min-h-[1.45cqw]">
              <span className="text-[#FFB461] text-[1.3cqw] shrink-0">📞</span>
              <p
                className="text-[#F2F6F8] font-normal leading-tight"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "1.45cqw",
                  whiteSpace: "nowrap",
                }}
              >
                (+33) {displayedData.telephone}
              </p>
            </div>

            {/* Adresse */}
            <div className="flex items-start gap-[0.9cqw] min-h-[1.4cqw]">
              <span className="text-[#47B5E0] text-[1.3cqw] shrink-0 mt-[0.1cqw]">📍</span>
              <p
                className="text-[#E6EDF1] font-normal leading-snug break-words"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "1.4cqw",
                  maxWidth: "94%",
                }}
              >
                {displayedData.adresse}
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-[0.9cqw] min-h-[1.4cqw]">
              <span className="text-[#FF7D97] text-[1.3cqw] shrink-0">✉️</span>
              <p
                className="text-[#F2F6F8] font-normal leading-tight"
                style={{
                  fontFamily: "var(--font-commissioner), sans-serif",
                  fontSize: "1.4cqw",
                  whiteSpace: "nowrap",
                }}
              >
                {displayedData.email}
              </p>
            </div>

            {/* Site Web */}
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
