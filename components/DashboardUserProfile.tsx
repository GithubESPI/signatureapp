"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGraphProfile } from "@/hooks/useGraphApi";
import { 
  User, 
  Mail, 
  Building, 
  Calendar,
  CheckCircle,
  Clock,
  Briefcase,
  Phone
} from "lucide-react";

export default function DashboardUserProfile() {
  const { data: session } = useSession();
  const { profile, loadingProfile, fetchProfile } = useGraphProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session) {
      fetchProfile();
    }
  }, [mounted, session, fetchProfile]);

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      {/* User Header */}
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mr-4 overflow-hidden">
          {profile?.photo ? (
            <img 
              src={profile.photo} 
              alt="Photo de profil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{session.user?.name}</h3>
          <p className="text-sm text-gray-500">Compte Microsoft connecté</p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-gray-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Email</p>
            <p className="text-sm text-gray-600">{session.user?.email}</p>
          </div>
        </div>

        {profile?.jobTitle && (
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Poste</p>
              <p className="text-sm text-gray-600">{profile.jobTitle}</p>
            </div>
          </div>
        )}

        {profile?.mobilePhone && (
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Téléphone mobile</p>
              <p className="text-sm text-gray-600">{profile.mobilePhone}</p>
            </div>
          </div>
        )}

        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Building className="w-5 h-5 text-gray-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Organisation</p>
            <p className="text-sm text-gray-600">groupe-espi.fr</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-600 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">Dernière connexion</p>
            <p className="text-sm text-gray-600">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-900">Statut de la session</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm text-green-700">Actif</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
