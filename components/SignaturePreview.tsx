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
          <div className="flex flex-col justify-center text-left ml-auto" style={{ gap: '35px', maxWidth: 'none' }}>
            {/* Nom complet */}
            <div>
              <h2 
                className="text-3xl font-semibold text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '48px' }}
              >
                {userData.prenom} {userData.nom}
              </h2>
            </div>
            
            {/* Fonction - avec retour à la ligne automatique si nécessaire */}
            {userData.fonction && (
              <div className="max-w-md">
                <p 
                  className="font-medium text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '36px', wordBreak: 'break-word', whiteSpace: 'normal' }}
                >
                  {userData.fonction}
                </p>
              </div>
            )}
            
            {/* Téléphone */}
            {userData.telephone && (() => {
              // Formater le téléphone avec 0 et espaces réduits
              const cleanPhone = userData.telephone.replace(/\s/g, '').replace(/[-.]/g, '');
              let formattedPhone = '';
              
              if (userData.indicatifPays === 'FR') {
                // Format français avec 0 : 0X XX XX XX XX
                if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
                  formattedPhone = `${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2, 4)} ${cleanPhone.slice(4, 6)} ${cleanPhone.slice(6, 8)} ${cleanPhone.slice(8)}`;
                } else {
                  formattedPhone = cleanPhone.match(/.{1,2}/g)?.join(' ') || cleanPhone;
                }
              } else if (userData.indicatifPays === 'CA') {
                // Format canadien : XXX XXX XXXX
                if (cleanPhone.length === 10) {
                  formattedPhone = `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
                } else {
                  formattedPhone = cleanPhone.match(/.{1,3}/g)?.join(' ') || cleanPhone;
                }
              } else {
                formattedPhone = cleanPhone;
              }
              
              const indicatif = userData.indicatifPays === 'FR' ? '+33' : '+1';
              
              return (
                <div>
                  <p 
                    className="text-white leading-tight"
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '34px' }}
                  >
                    ({indicatif}) {formattedPhone}
                  </p>
                </div>
              );
            })()}
            
            {/* Adresse complète - avec retour à la ligne automatique si nécessaire */}
            {(userData.adresse || userData.codePostal || userData.ville) && (
              <div className="max-w-md">
                <p 
                  className="text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '34px', wordBreak: 'break-word', whiteSpace: 'normal' }}
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
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '34px' }}
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
