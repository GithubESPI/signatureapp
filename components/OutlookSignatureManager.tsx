"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Mail, Send, CheckCircle, XCircle, Loader2, Settings } from "lucide-react";

interface OutlookSignatureManagerProps {
  signatureHtml?: string;
  onSignatureSent?: () => void;
}

export default function OutlookSignatureManager({ 
  signatureHtml, 
  onSignatureSent 
}: OutlookSignatureManagerProps) {
  const { data: session } = useSession();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [generatedSignature, setGeneratedSignature] = useState<string>('');
  const [instructions, setInstructions] = useState<string[]>([]);

  const testPermissions = async () => {
    if (!session?.accessToken) {
      setErrorMessage("Token d'accès non disponible");
      setStatus('error');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      console.log("🔧 [OutlookSignature] Test des permissions Microsoft Graph...");
      
      const response = await fetch('/api/test-graph-permissions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ [OutlookSignature] Test des permissions terminé:", data);
        setStatus('success');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors du test des permissions');
      }
    } catch (error: any) {
      console.error("❌ [OutlookSignature] Erreur test permissions:", error);
      setErrorMessage(error.message || "Erreur lors du test des permissions");
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const sendSignatureToOutlook = async () => {
    if (!session?.accessToken) {
      setErrorMessage("Token d'accès non disponible");
      setStatus('error');
      return;
    }

    if (!signatureHtml) {
      setErrorMessage("Aucune signature à envoyer");
      setStatus('error');
      return;
    }

    setIsSending(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      console.log("🔧 [OutlookSignature] Envoi de la signature vers Outlook...");
      
      const response = await fetch('/api/outlook-signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signatureHtml,
          accessToken: session.accessToken
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ [OutlookSignature] Signature générée avec succès:", data);
        setGeneratedSignature(data.signatureHtml || '');
        setInstructions(data.instructions || []);
        setStatus('success');
        onSignatureSent?.();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }
    } catch (error: any) {
      console.error("❌ [OutlookSignature] Erreur:", error);
      setErrorMessage(error.message || "Erreur lors de l'envoi de la signature");
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Send className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'success':
        return "Signature envoyée avec succès !";
      case 'error':
        return "Erreur lors de l'envoi";
      default:
        return "Envoyer vers Outlook";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Signature Outlook</h2>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Settings className="w-4 h-4" />
          <span>Microsoft Graph</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Informations sur la signature */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">📧 Signature générée</h4>
          <p className="text-sm text-blue-700">
            {signatureHtml ? 
              "Votre signature est prête à être envoyée vers Outlook." : 
              "Aucune signature générée. Créez d'abord une signature."
            }
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={testPermissions}
            disabled={isSending || !session?.accessToken}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Tester les permissions</span>
          </button>
          
          <button
            onClick={sendSignatureToOutlook}
            disabled={isSending || !signatureHtml || !session?.accessToken}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${
              isSending || !signatureHtml || !session?.accessToken
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : status === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : status === 'error'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              getStatusIcon()
            )}
            <span>
              {isSending ? "Envoi en cours..." : getStatusText()}
            </span>
          </button>
        </div>

        {/* Message d'erreur */}
        {status === 'error' && errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center space-x-2">
            <XCircle className="w-5 h-5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Message de succès */}
        {status === 'success' && (
          <div className="mt-4 space-y-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Signature HTML générée avec succès !</span>
            </div>

            {/* Instructions */}
            {instructions.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">📋 Instructions pour Outlook</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                  {instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </div>
            )}

            {/* Signature HTML générée */}
            {generatedSignature && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3">📄 Signature HTML</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Copiez le code HTML ci-dessous :</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedSignature);
                      alert('Signature HTML copiée dans le presse-papiers !');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Copier
                  </button>
                </div>
                <textarea
                  value={generatedSignature}
                  readOnly
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-xs"
                />
              </div>
            )}
          </div>
        )}

        {/* Informations sur les permissions */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ Permissions requises</h4>
          <p className="text-sm text-yellow-700">
            Cette fonctionnalité nécessite les permissions MailboxSettings.ReadWrite 
            pour modifier votre signature Outlook.
          </p>
        </div>
      </div>
    </div>
  );
}
