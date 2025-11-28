"use client";

import { UserData } from "@/lib/word-template-processor";

interface SignaturePreviewProps {
  userData: UserData;
  className?: string;
}

export default function SignaturePreview({ userData, className = "" }: SignaturePreviewProps) {
  return (
    <div className={`w-full ${className}`} style={{ containerType: 'inline-size' }}>
      {/* Image de fond */}
      <div
        className="relative w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/model-signature.png')",
          aspectRatio: "2200/700",
        }}
      >
        {/* Overlay pour le contenu */}
        <div className="absolute inset-0 flex justify-between items-center" style={{ padding: '3.6cqw' }}>
          {/* Section gauche - Vide */}
          <div className="flex flex-col justify-center">
          </div>

          {/* Section droite - Informations utilisateur */}
          <div
            className="flex flex-col justify-center text-left ml-auto"
            style={{
              gap: '1.6cqw',
              maxWidth: 'none',
              width: '33%', // Ajusté pour décaler vers la droite (environ 1350px sur 2200px)
              paddingTop: '6cqw' // Ajustement pour aligner avec le design
            }}
          >
            {/* Nom complet */}
            <div>
              <h2
                className="font-semibold text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.2cqw' }}
              >
                {userData.prenom} {userData.nom}
              </h2>
            </div>

            {/* Fonction */}
            {userData.fonction && (
              <div className="max-w-md">
                <p
                  className="font-medium text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', wordBreak: 'break-word', whiteSpace: 'normal' }}
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
                let phoneToFormat = cleanPhone;
                // Ajouter le 0 si manquant (9 chiffres)
                if (phoneToFormat.length === 9 && !phoneToFormat.startsWith('0')) {
                  phoneToFormat = '0' + phoneToFormat;
                }

                // Format français avec 0 : 0X XX XX XX XX
                if (phoneToFormat.length === 10 && phoneToFormat.startsWith('0')) {
                  formattedPhone = `${phoneToFormat.slice(0, 2)} ${phoneToFormat.slice(2, 4)} ${phoneToFormat.slice(4, 6)} ${phoneToFormat.slice(6, 8)} ${phoneToFormat.slice(8)}`;
                } else {
                  formattedPhone = phoneToFormat.match(/.{1,2}/g)?.join(' ') || phoneToFormat;
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
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.55cqw' }}
                  >
                    ({indicatif}) {formattedPhone}
                  </p>
                </div>
              );
            })()}

            {/* Adresse complète */}
            {(userData.adresse || userData.codePostal || userData.ville) && (
              <div className="max-w-md">
                <p
                  className="text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.55cqw', wordBreak: 'break-word', whiteSpace: 'normal' }}
                >
                  {[
                    userData.adresse,
                    userData.codePostal,
                    userData.ville
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Site web */}
            <div>
              <p
                className="text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.55cqw' }}
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
