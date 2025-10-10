"use client";

import { useState } from "react";
import WordTemplateManager from "@/components/WordTemplateManager";
import SasConnectionTest from "@/components/SasConnectionTest";

export default function TemplateTestPage() {
  const [loadedTemplate, setLoadedTemplate] = useState<Buffer | null>(null);
  const [error, setError] = useState<string>("");

  const handleTemplateLoaded = (templateBuffer: Buffer) => {
    setLoadedTemplate(templateBuffer);
    setError("");
    console.log("Template chargé avec succès:", {
      size: templateBuffer.length,
      type: "Buffer"
    });
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setLoadedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test de Récupération des Modèles Word
        </h1>

        {/* Test de connexion SAS */}
        <div className="mb-8">
          <SasConnectionTest />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Composant de gestion des modèles */}
          <div>
            <WordTemplateManager
              onTemplateLoaded={handleTemplateLoaded}
              onError={handleError}
            />
          </div>

          {/* Informations sur le template chargé */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">État du Template</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-medium">Erreur:</p>
                <p>{error}</p>
              </div>
            )}

            {loadedTemplate ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                <p className="font-medium">✅ Template chargé avec succès!</p>
                <div className="mt-2 text-sm">
                  <p><strong>Taille:</strong> {loadedTemplate.length} bytes</p>
                  <p><strong>Type:</strong> Buffer</p>
                  <p><strong>Statut:</strong> Prêt pour le traitement</p>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>Aucun template chargé</p>
                <p className="text-sm mt-2">Sélectionnez et chargez un modèle depuis Azure Storage</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Instructions de Configuration Azure Storage
          </h3>
          <div className="text-blue-800 space-y-2">
            <p><strong>1. Chaîne de connexion:</strong> Configurez <code>AZURE_STORAGE_CONNECTION_STRING</code> dans votre fichier <code>.env</code></p>
            <p><strong>2. Container:</strong> Votre container "templatesignature" doit contenir des fichiers .docx</p>
            <p><strong>3. Permissions:</strong> Assurez-vous que votre compte de stockage a les permissions de lecture</p>
            <p><strong>4. Test de connexion:</strong> Utilisez le test de connexion ci-dessus pour vérifier la configuration</p>
            <p><strong>5. Documentation:</strong> Consultez <code>ENVIRONMENT_SETUP.md</code> pour plus de détails</p>
          </div>
        </div>
      </div>
    </div>
  );
}
