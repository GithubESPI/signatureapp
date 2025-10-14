"use client";

import { UserData } from "@/lib/word-template-processor";

interface SignaturePreviewProps {
  userData: UserData;
  className?: string;
}

export default function SignaturePreview({ userData, className = "" }: SignaturePreviewProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Image de fond */}
      <div 
        className="relative w-full h-auto bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/model-signature.png')",
          minHeight: "180px",
          aspectRatio: "3/1"
        }}
      >
        {/* Overlay pour le contenu */}
        <div className="absolute inset-0 flex justify-between items-center px-12 py-8">
          {/* Section gauche - Vide (logo ESPI retiré) */}
          <div className="flex flex-col justify-center">
            {/* Logo ESPI retiré */}
          </div>

          {/* Section droite - Informations utilisateur */}
          <div className="flex flex-col justify-center text-left space-y-1">
            {/* Nom complet */}
            <div>
              <h2 
                className="text-xl font-semibold text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {userData.prenom} {userData.nom}
              </h2>
            </div>
            
            {/* Fonction */}
            {userData.fonction && (
              <div>
                <p 
                  className="text-sm font-medium text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {userData.fonction}
                </p>
              </div>
            )}
            
            {/* Téléphone */}
            {userData.telephone && (
              <div>
                <p 
                  className="text-sm text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {userData.indicatifPays === 'FR' ? '+33' : '+1'} {userData.telephone}
                </p>
              </div>
            )}
            
            {/* Adresse complète */}
            {(userData.adresse || userData.codePostal || userData.ville) && (
              <div>
                <p 
                  className="text-sm text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {[
                    userData.adresse,
                    userData.codePostal,
                    userData.ville
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
            )}
            
            {/* Email */}
            {userData.email && (
              <div>
                <p 
                  className="text-sm text-white leading-tight"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {userData.email}
                </p>
              </div>
            )}
            
            {/* Site web */}
            <div>
              <p 
                className="text-sm text-white leading-tight"
                style={{ fontFamily: 'Poppins, sans-serif' }}
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
