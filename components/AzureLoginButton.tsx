"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { LogIn, LogOut, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AzureLoginButtonProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function AzureLoginButton({ 
  className = "", 
  variant = "default",
  size = "md" 
}: AzureLoginButtonProps) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("azure-ad", { 
        callbackUrl: "/dashboard",
        redirect: true 
      });
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ 
        callbackUrl: "/",
        redirect: true 
      });
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-xs",
    lg: "px-7 py-3.5 text-sm"
  };

  const variantClasses = {
    default: "bg-[#004976] text-white hover:bg-[#003a5e] shadow-md shadow-[#004976]/20 font-bold rounded-xl",
    outline: "border border-slate-200 text-slate-700 hover:text-[#004976] hover:bg-slate-50 font-bold rounded-xl",
    ghost: "text-[#004976] hover:bg-[#004976]/10 font-bold rounded-xl"
  };

  if (!mounted || status === "loading") {
    return (
      <div className={`inline-flex items-center justify-center rounded-xl ${sizeClasses[size]} ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin mr-1.5 text-[#004976]" />
        <span className="text-xs font-semibold text-slate-500">Chargement...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-3">
        {/* User Info */}
        <div className="flex items-center space-x-2.5 bg-white/90 rounded-xl px-3 py-1.5 border border-slate-200 shadow-sm">
          {session.user?.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gradient-to-tr from-[#004976] to-[#47B5E0] rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
          )}
          <div className="text-left leading-tight hidden sm:block">
            <p className="font-bold text-[#002D4A] text-xs">
              {session.user?.name || "Utilisateur"}
            </p>
            <p className="text-slate-500 text-[10px] truncate max-w-[140px]">
              {session.user?.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          disabled={isLoading}
          className={`inline-flex items-center justify-center text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Se déconnecter"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LogOut className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSignIn}
      disabled={isLoading}
      className={`inline-flex items-center justify-center transition-all ${sizeClasses[size]} ${variantClasses[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
      ) : (
        <LogIn className="w-4 h-4 mr-1.5 text-[#47B5E0]" />
      )}
      <span>Connexion Microsoft</span>
    </motion.button>
  );
}
