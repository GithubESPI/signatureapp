"use client";

import { UserData } from "@/lib/word-template-processor";

interface SignaturePreviewProps {
  userData: UserData;
  className?: string;
}

export default function SignaturePreview({ userData, className = "" }: SignaturePreviewProps) {
  return (
    <div className={`relative w-full ${className}`}>
      {/* Image de fond */}
      <div 
        className="relative w-full h-auto bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/model-signature.png')",
          minHeight: "450px",
          aspectRatio: "1500/450"
        }}
      >
        {/* Overlay pour le contenu */}
        <div className="absolute inset-0 flex justify-between items-center px-8 py-8">
          {/* Section gauche - Vide (logo ESPI retiré) */}
          <div className="flex flex-col justify-center">
            {/* Logo ESPI retiré */}
          </div>

          {/* Section droite - Informations utilisateur */}
          <div className="flex flex-col justify-center text-left ml-auto" style={{ gap: '25px', maxWidth: 'none' }}>
            {/* Nom complet */}
            <div>
              <h2 
                className="text-3xl font-semibold text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '34px' }}
              >
                {userData.prenom} {userData.nom}
              </h2>
            </div>
            
            {/* Fonction */}
            {userData.fonction && (
              <div>
                <p 
                  className="font-medium text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px' }}
                >
                  {userData.fonction}
                </p>
              </div>
            )}
            
            {/* Téléphone */}
            {userData.telephone && (() => {
              // Formater le téléphone avec espaces
              const formatPhoneNumber = (phone: string, indicatifPays: string): string => {
                if (!phone) return '';
                const cleanPhone = phone.replace(/\s/g, '').replace(/[-.]/g, '');
                const phoneWithoutZero = cleanPhone.startsWith('0') ? cleanPhone.substring(1) : cleanPhone;
                
                if (indicatifPays === 'FR') {
                  if (phoneWithoutZero.length === 9) {
                    return phoneWithoutZero.match(/.{1,2}/g)?.join(' ') || phoneWithoutZero;
                  }
                  return phoneWithoutZero.match(/.{1,2}/g)?.join(' ') || phoneWithoutZero;
                } else if (indicatifPays === 'CA') {
                  if (phoneWithoutZero.length === 10) {
                    return `${phoneWithoutZero.slice(0, 3)} ${phoneWithoutZero.slice(3, 6)} ${phoneWithoutZero.slice(6)}`;
                  }
                  return phoneWithoutZero.match(/.{1,3}/g)?.join(' ') || phoneWithoutZero;
                }
                return phoneWithoutZero;
              };
              
              const cleanPhone = userData.telephone.startsWith('0') ? userData.telephone.substring(1) : userData.telephone;
              const formattedPhone = formatPhoneNumber(cleanPhone, userData.indicatifPays);
              const indicatif = userData.indicatifPays === 'FR' ? '+33' : '+1';
              
              return (
                <div>
                  <p 
                    className="text-white leading-tight"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px' }}
                  >
                    ({indicatif}) {formattedPhone}
                  </p>
                </div>
              );
            })()}
            
            {/* Adresse complète */}
            {(userData.adresse || userData.codePostal || userData.ville) && (
              <div>
                <p 
                  className="text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px' }}
                >
                  {[
                    userData.adresse,
                    userData.codePostal,
                    userData.ville
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            
            {/* Email retiré de la signature - ne pas afficher */}
            
            {/* Site web */}
            <div>
              <p 
                className="text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px' }}
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
