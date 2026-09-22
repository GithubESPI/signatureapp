"use client";

import { UserData } from "@/lib/word-template-processor";

interface SignatureExportProps {
  userData: UserData;
}

export default function SignatureExport({ userData }: SignatureExportProps) {
  const fullName = userData.nomService ? userData.nomService : `${userData.prenom || 'Prénom'} ${userData.nom || 'NOM'}`.trim();

  // Formatage propre de l'adresse
  const cleanAdresse = userData.adresse?.replace(/,/g, '')?.trim() || '';
  const cleanCodePostal = userData.codePostal?.replace(/,/g, '')?.trim() || '';
  const cleanVille = userData.ville?.replace(/,/g, '')?.trim() || '';
  const fullAddress = [cleanAdresse, cleanCodePostal, cleanVille].filter(Boolean).join(' - ');

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
    <div
      style={{
        width: "2200px",
        height: "700px",
        backgroundColor: "#004976",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "77px 132px",
        boxSizing: "border-box",
        fontFamily: "'Commissioner', Arial, Helvetica, sans-serif",
      }}
    >
      {/* Section Gauche : Logo Vertical Contour ESPI + Slogans */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "550px",
          flexShrink: 0,
        }}
      >
        <img
          src="/charte/LOGO ESPI/Contour/PNG/ESPI_logo_vertical_CONTOUR.png"
          alt="Logo ESPI"
          style={{
            width: "300px",
            height: "auto",
            display: "block",
            marginBottom: "26px",
          }}
        />
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <div
            style={{
              color: "#E6EDF1",
              fontWeight: 600,
              fontSize: "21px",
              letterSpacing: "0.8px",
              lineHeight: 1.25,
            }}
          >
            École Supérieure des Professions Immobilières
          </div>
        </div>
      </div>

      {/* Séparateur Vertical */}
      <div
        style={{
          width: "2px",
          height: "480px",
          background: "linear-gradient(180deg, transparent 0%, #FFFFFF 30%, #47B5E0 70%, transparent 100%)",
          opacity: 0.3,
        }}
      />

      {/* Section Droite : Informations Collaborateur */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          textAlign: "left",
          width: "1350px",
          paddingLeft: "140px",
          gap: "24px",
          boxSizing: "border-box",
        }}
      >
        {/* Nom & Prénom */}
        <div>
          <div
            style={{
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "58px",
              lineHeight: 1,
              whiteSpace: "nowrap",
              letterSpacing: "0.5px",
            }}
          >
            {fullName}
          </div>
        </div>

        {/* Fonction */}
        {userData.fonction && (
          <div>
            <div
              style={{
                fontWeight: 400,
                color: "#FFFFFF",
                fontSize: "38px",
                lineHeight: 1.25,
              }}
            >
              {userData.fonction}
            </div>
          </div>
        )}

        {/* Téléphone */}
        {formattedPhone && (
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ fontSize: "30px" }}>📞</span>
            <div
              style={{
                color: "#F2F6F8",
                fontWeight: 400,
                fontSize: "32px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              ({indicatif}) {formattedPhone}
            </div>
          </div>
        )}

        {/* Adresse Campus ESPI */}
        {fullAddress && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: "18px" }}>
            <span style={{ fontSize: "30px", marginTop: "2px" }}>📍</span>
            <div
              style={{
                color: "#E6EDF1",
                fontWeight: 400,
                fontSize: "30px",
                lineHeight: 1.25,
                maxWidth: "96%",
              }}
            >
              {fullAddress}
            </div>
          </div>
        )}

        {/* Email */}
        {userData.email && (
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <span style={{ fontSize: "30px" }}>✉️</span>
            <div
              style={{
                color: "#F2F6F8",
                fontWeight: 400,
                fontSize: "30px",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {userData.email}
            </div>
          </div>
        )}

        {/* Site Web Officiel */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", paddingTop: "4px" }}>
          <span style={{ fontSize: "30px" }}>🌐</span>
          <div
            style={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: 1,
              letterSpacing: "1px",
              whiteSpace: "nowrap",
            }}
          >
            www.groupe-espi.fr
          </div>
        </div>
      </div>
    </div>
  );
}
