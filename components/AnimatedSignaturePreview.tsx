"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const examples = [
    {
        prenom: "Jean",
        nom: "DUPONT",
        fonction: "Directeur Commercial",
        telephone: "(+33) 06 12 34 56 78",
        adresse: "285 rue Louis de Broglie, CS 89000, 13090 Aix-en-Provence Cedex 3"
    },
    {
        prenom: "Marie",
        nom: "MARTIN",
        fonction: "Responsable RH",
        telephone: "(+33) 07 98 76 54 32",
        adresse: "20-22 rue du Théâtre, 75015 Paris"
    },
    {
        prenom: "Thomas",
        nom: "DUBOIS",
        fonction: "Chef de Projet",
        telephone: "(+33) 06 11 22 33 44",
        adresse: "40 rue du Docteur Roux, 75015 Paris"
    }
];

export default function AnimatedSignaturePreview() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedData, setDisplayedData] = useState({
        prenom: "",
        nom: "",
        fonction: "",
        telephone: "",
        adresse: ""
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
            adresse: currentExample.adresse
        };

        let typingSpeed = isDeleting ? 30 : 50;

        // Pause before deleting or moving to next
        if (!isDeleting && charIndex === Math.max(
            fullText.prenom.length + fullText.nom.length + 1,
            fullText.fonction.length,
            fullText.telephone.length,
            fullText.adresse.length
        )) {
            typingSpeed = 2000; // Wait 2s before deleting
        } else if (isDeleting && charIndex === 0) {
            typingSpeed = 500; // Wait 0.5s before typing next
        }

        const timer = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (charIndex < Math.max(
                    fullText.prenom.length + fullText.nom.length + 1,
                    fullText.fonction.length,
                    fullText.telephone.length,
                    fullText.adresse.length
                )) {
                    setDisplayedData({
                        prenom: fullText.prenom.slice(0, Math.max(0, charIndex)),
                        nom: charIndex > fullText.prenom.length ? fullText.nom.slice(0, charIndex - fullText.prenom.length - 1) : "",
                        fonction: fullText.fonction.slice(0, charIndex),
                        telephone: fullText.telephone.slice(0, charIndex),
                        adresse: fullText.adresse.slice(0, charIndex)
                    });
                    setCharIndex(prev => prev + 1);
                } else {
                    setIsDeleting(true);
                }
            } else {
                // Deleting
                if (charIndex > 0) {
                    setDisplayedData({
                        prenom: fullText.prenom.slice(0, Math.max(0, charIndex)),
                        nom: charIndex > fullText.prenom.length ? fullText.nom.slice(0, charIndex - fullText.prenom.length - 1) : "",
                        fonction: fullText.fonction.slice(0, charIndex),
                        telephone: fullText.telephone.slice(0, charIndex),
                        adresse: fullText.adresse.slice(0, charIndex)
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
        <div className="w-full" style={{ containerType: 'inline-size' }}>
            <div
                className="relative w-full bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden shadow-2xl"
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
                    <div className="flex flex-col justify-center"></div>

                    {/* Section droite - Informations utilisateur animées */}
                    <div
                        className="flex flex-col justify-center text-left ml-auto"
                        style={{
                            gap: '1.6cqw',
                            maxWidth: 'none',
                            width: '45%',
                            paddingTop: '0.5cqw'
                        }}
                    >
                        {/* Nom complet */}
                        <div>
                            <h2
                                className="font-semibold text-white leading-tight"
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '2.35cqw', whiteSpace: 'nowrap' }}
                            >
                                {displayedData.prenom} {displayedData.nom}
                                <span className="animate-pulse">|</span>
                            </h2>
                        </div>

                        {/* Fonction */}
                        <div>
                            <p
                                className="font-medium text-white leading-tight break-words"
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.75cqw', whiteSpace: 'normal' }}
                            >
                                {displayedData.fonction}
                            </p>
                        </div>

                        {/* Téléphone */}
                        <div>
                            <p
                                className="text-white leading-tight"
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', whiteSpace: 'nowrap' }}
                            >
                                {displayedData.telephone}
                            </p>
                        </div>

                        {/* Adresse complète */}
                        <div>
                            <p
                                className="text-white leading-tight break-words"
                                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.65cqw', wordBreak: 'break-word', whiteSpace: 'normal' }}
                            >
                                {displayedData.adresse}
                            </p>
                        </div>

                        {/* Site web (Statique) */}
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
