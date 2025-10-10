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
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variantClasses = {
    default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:bg-blue-50"
  };

  if (!mounted || status === "loading") {
    return (
      <div className={`inline-flex items-center justify-center rounded-lg ${sizeClasses[size]} ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span>Chargement...</span>
      </div>
    );
  }

  if (session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        {/* User Info */}
        <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="text-sm">
            <p className="font-semibold text-gray-900">
              {session.user?.name || "Utilisateur"}
            </p>
            <p className="text-gray-600 text-xs">
              {session.user?.email}
            </p>
          </div>
        </div>

        {/* Sign Out Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSignOut}
          disabled={isLoading}
          className={`inline-flex items-center justify-center rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${sizeClasses[size]} ${variantClasses[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <LogOut className="w-5 h-5 mr-2" />
          )}
          <span>Se déconnecter</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSignIn}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-300 transform hover:-translate-y-1 ${sizeClasses[size]} ${variantClasses[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <LogIn className="w-5 h-5 mr-2" />
      )}
      <span>Se connecter avec Microsoft</span>
    </motion.button>
  );
}
