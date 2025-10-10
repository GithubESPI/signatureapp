"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Key, Eye, EyeOff, Copy, Check } from "lucide-react";

export default function TokenDebugger() {
  const { data: session } = useSession();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    if (session?.accessToken) {
      await navigator.clipboard.writeText(session.accessToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return { error: "Impossible de décoder le token" };
    }
  };

  const tokenData = session?.accessToken ? decodeToken(session.accessToken) : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Debug Token</h3>
        </div>
        <button
          onClick={() => setShowToken(!showToken)}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{showToken ? "Masquer" : "Afficher"}</span>
        </button>
      </div>

      {session?.accessToken ? (
        <div className="space-y-4">
          {/* Token brut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Token
            </label>
            <div className="flex items-center space-x-2">
              <textarea
                value={showToken ? session.accessToken : "••••••••••••••••••••••••••••••••"}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg font-mono text-sm"
                rows={3}
              />
              <button
                onClick={copyToken}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Informations du token */}
          {tokenData && !tokenData.error && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations du Token
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Issuer:</strong> {tokenData.iss}
                  </div>
                  <div>
                    <strong>Audience:</strong> {tokenData.aud}
                  </div>
                  <div>
                    <strong>Subject:</strong> {tokenData.sub}
                  </div>
                  <div>
                    <strong>Expires:</strong> {new Date(tokenData.exp * 1000).toLocaleString()}
                  </div>
                  <div className="md:col-span-2">
                    <strong>Scopes:</strong> 
                    <div className="mt-1 flex flex-wrap gap-1">
                      {tokenData.scp?.split(' ')?.map((scope: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {scope}
                        </span>
                      )) || "Aucun scope trouvé"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erreur de décodage */}
          {tokenData?.error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              <strong>Erreur:</strong> {tokenData.error}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Key className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Aucun token d'accès disponible</p>
          <p className="text-sm">Connectez-vous pour voir les informations du token</p>
        </div>
      )}
    </div>
  );
}
