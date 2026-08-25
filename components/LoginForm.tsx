"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Shield, Sparkles } from "lucide-react";

export default function LoginForm() {
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const hasRedirected = useRef(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Rediriger vers le dashboard si l'utilisateur est déjà connecté
  useEffect(() => {
    if (isHydrated && status === "authenticated" && session && !hasRedirected.current) {
      hasRedirected.current = true;
      
      const callbackUrlParam = searchParams.get("callbackUrl");
      let redirectUrl = "/dashboard";
      
      if (callbackUrlParam) {
        try {
          if (callbackUrlParam.startsWith("http")) {
            const url = new URL(callbackUrlParam);
            const path = url.pathname + url.search;
            if (!path.includes("/login")) {
              redirectUrl = path;
            }
          } else {
            if (!callbackUrlParam.includes("/login")) {
              redirectUrl = callbackUrlParam.startsWith("/") ? callbackUrlParam : `/${callbackUrlParam}`;
            }
          }
        } catch {
          redirectUrl = "/dashboard";
        }
      }
      
      window.location.replace(redirectUrl);
    }
  }, [isHydrated, status, session, searchParams]);

  const handleAzureLogin = () => {
    signIn("azure-ad", { callbackUrl: "/dashboard", redirect: true });
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6EDF1] to-[#F2F6F8]">
        <div className="w-8 h-8 border-4 border-[#004976] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003A5E] via-[#004976] to-[#002D4A] px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-100 relative overflow-hidden">
          {/* Ligne d'accent supérieure */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#47B5E0] via-[#FF7D97] to-[#FFB461]"></div>

          <div className="text-center mb-8">
            <img 
              src="/charte/LOGO ESPI/Bleu/RVB/PNG/ESPI_logos_horizontal_bleu_RVB.png" 
              alt="Groupe ESPI" 
              className="h-12 w-auto mx-auto mb-4 object-contain"
            />
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#004976]/10 text-[#004976] text-xs font-bold mb-3 border border-[#004976]/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#47B5E0]" />
              SignatureApp 2026
            </div>
            <h2 className="text-xl font-bold text-[#002D4A] mb-1">
              Espace Collaborateur
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Connectez-vous avec votre compte Microsoft 365 pour générer votre signature
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAzureLogin}
              className="w-full flex justify-center items-center px-5 py-3.5 border border-slate-200 rounded-2xl shadow-sm bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-xs"
            >
              <svg className="w-4 h-4 mr-2.5 shrink-0" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              Se connecter avec Microsoft
            </button>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Authentification sécurisée par Azure Active Directory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
