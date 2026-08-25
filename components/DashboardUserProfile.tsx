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
  Briefcase,
  Phone
} from "lucide-react";

export default function DashboardUserProfile() {
  const { data: session } = useSession();
  const { profile, fetchProfile } = useGraphProfile();
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
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-2/3"></div>
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
      className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 md:p-7"
    >
      {/* User Header */}
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mr-4 overflow-hidden border-2 border-[#47B5E0]/30 shadow-md">
          {profile?.photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={profile.photo} 
              alt="Photo de profil" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#004976] to-[#47B5E0] flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#002D4A] leading-tight">{session.user?.name}</h3>
          <p className="text-xs text-[#47B5E0] font-semibold mt-0.5">Microsoft 365 ESPI</p>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-3 text-xs">
        <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <Mail className="w-4 h-4 text-[#004976] mr-3 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-500 text-[11px]">Email</p>
            <p className="font-medium text-slate-900 truncate">{session.user?.email}</p>
          </div>
        </div>

        {profile?.jobTitle && (
          <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <Briefcase className="w-4 h-4 text-[#004976] mr-3 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-500 text-[11px]">Fonction</p>
              <p className="font-medium text-slate-900 truncate">{profile.jobTitle}</p>
            </div>
          </div>
        )}

        {profile?.mobilePhone && (
          <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <Phone className="w-4 h-4 text-[#004976] mr-3 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-500 text-[11px]">Mobile</p>
              <p className="font-medium text-slate-900 truncate">{profile.mobilePhone}</p>
            </div>
          </div>
        )}

        <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <Building className="w-4 h-4 text-[#004976] mr-3 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-500 text-[11px]">Organisation</p>
            <p className="font-medium text-slate-900 truncate">Groupe ESPI</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <Calendar className="w-4 h-4 text-[#004976] mr-3 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-500 text-[11px]">Dernière connexion</p>
            <p className="font-medium text-slate-900">{currentDate}</p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
          <CheckCircle className="w-4 h-4 text-emerald-600 mr-3 shrink-0" />
          <div>
            <p className="font-bold text-emerald-900 text-[11px]">Session active</p>
            <p className="text-emerald-700 text-[11px] font-medium">Synchronisation Graph API</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
