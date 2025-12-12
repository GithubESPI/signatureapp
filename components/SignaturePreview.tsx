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
        <div
          className="absolute inset-0 flex justify-between items-start"
          style={{ padding: '3.6cqw 0.5cqw 3.6cqw 3.6cqw' }}
        >
          {/* Section gauche - Vide */}
          <div className="flex flex-col justify-center">
          </div>

          {/* Section droite - Informations utilisateur */}
          <div
            className="flex flex-col justify-center text-left ml-auto"
            style={{
              gap: '1.6cqw',
              maxWidth: 'none',
              width: '45%', // Ajusté à 45% pour décaler légèrement vers la gauche
              paddingTop: '0.5cqw' // Remonté au maximum
            }}
          >
            {/* Nom complet */}
            <div>
              <h2
                className="font-semibold text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.35cqw', whiteSpace: 'nowrap' }}
              >
                {userData.prenom} {userData.nom}
              </h2>
            </div>

            {/* Fonction */}
            {userData.fonction && (
              <div>
                <p
                  className="font-medium text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75cqw', whiteSpace: 'normal' }}
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
                    style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', whiteSpace: 'nowrap' }}
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
                  className="text-white leading-tight break-words"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', wordBreak: 'break-word', whiteSpace: 'normal' }}
                >
                  {[
                    userData.adresse?.replace(/,/g, '')?.trim(),
                    userData.codePostal?.replace(/,/g, '')?.trim(),
                    userData.ville?.replace(/,/g, '')?.trim()
                  ].filter(Boolean).join(' ')}
                </p>
              </div>
            )}

            {/* Site web */}
            <div>
              <p
                className="text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', whiteSpace: 'nowrap' }}
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
