"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Building, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Non connecté
        </h3>
        <p className="text-gray-600 text-sm">
          Connectez-vous avec votre compte Microsoft pour accéder à vos signatures
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center space-x-4 mb-6">
        {session.user?.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-16 h-16 rounded-full border-4 border-white shadow-md"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        )}
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {session.user?.name || "Utilisateur"}
          </h3>
          <p className="text-gray-600 text-sm">
            Compte Microsoft connecté
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600">{session.user?.email}</p>
          </div>
        </div>

        {session.user?.email && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Building className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Organisation</p>
              <p className="text-sm text-gray-600">
                {session.user.email.split('@')[1]}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dernière connexion</p>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Statut de la session</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>
            Actif
          </span>
        </div>
      </div>
    </motion.div>
  );
}
