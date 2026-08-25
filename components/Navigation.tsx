"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FileText, Home } from "lucide-react";
import AzureLoginButton from "./AzureLoginButton";

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const isHomePage = pathname === "/";
  const isLoggedInOnHome = session && isHomePage;

  const allNavItems = [
    { href: "/", label: "Accueil", icon: <Home className="w-4 h-4" /> },
    { href: "/dashboard", label: "Dashboard", icon: <FileText className="w-4 h-4" /> },
  ];

  const navItems = isLoggedInOnHome
    ? [] 
    : allNavItems;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3.5">
          {/* Logo Officiel ESPI 2026 */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img 
              src="/charte/LOGO ESPI/Bleu/RVB/PNG/ESPI_logos_horizontal_bleu_RVB.png" 
              alt="Groupe ESPI" 
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block pl-2.5 border-l border-slate-300">
              <span className="text-xs font-bold text-[#004976] tracking-wider uppercase block leading-none">
                SignatureApp
              </span>
              <span className="text-[10px] text-[#47B5E0] font-semibold italic block leading-none mt-0.5">
                Charte Officielle
              </span>
            </div>
          </Link>

          {/* Liens de Navigation */}
          {navItems.length > 0 && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 text-xs font-bold transition-all px-3 py-1.5 rounded-lg ${
                      isActive
                        ? "text-[#004976] bg-[#004976]/10"
                        : "text-slate-600 hover:text-[#004976] hover:bg-slate-100"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Boutons d'Action / Profil */}
          <div className="flex items-center space-x-3">
            {session ? (
              <AzureLoginButton variant="outline" size="sm" />
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-xs text-slate-700 hover:text-[#004976] font-bold transition-colors"
                >
                  Se connecter
                </Link>
                <AzureLoginButton size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Mobile */}
        {navItems.length > 0 && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-100 flex gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 hover:text-[#004976] p-1.5 rounded"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
