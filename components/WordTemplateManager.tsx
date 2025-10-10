"use client";

import { useState, useEffect } from "react";
import { azureBlobService } from "@/lib/azure-blob-service";

interface WordTemplateManagerProps {
  onTemplateLoaded?: (templateBuffer: Buffer) => void;
  onError?: (error: string) => void;
}

export default function WordTemplateManager({ 
  onTemplateLoaded, 
  onError 
}: WordTemplateManagerProps) {
  const [templates, setTemplates] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Charger la liste des modèles disponibles
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const availableTemplates = await azureBlobService.listTemplates();
      setTemplates(availableTemplates);
      
      // Sélectionner le premier template par défaut
      if (availableTemplates.length > 0) {
        setSelectedTemplate(availableTemplates[0]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement des modèles";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = async (templateName: string) => {
    try {
      setLoading(true);
      setError("");
      
      // Vérifier que le template existe
      const exists = await azureBlobService.templateExists(templateName);
      if (!exists) {
        throw new Error(`Le modèle ${templateName} n'existe pas`);
      }

      // Récupérer le template
      const templateBuffer = await azureBlobService.getWordTemplate(templateName);
      onTemplateLoaded?.(templateBuffer);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du chargement du modèle";
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
  };

  const handleLoadTemplate = () => {
    if (selectedTemplate) {
      loadTemplate(selectedTemplate);
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des modèles...</span>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Modèles de Signature Disponibles</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-medium">Erreur:</p>
          <p>{error}</p>
        </div>
      )}

      {templates.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Aucun modèle de signature trouvé dans le container Azure.
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="template-select" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un modèle:
            </label>
            <select
              id="template-select"
              value={selectedTemplate}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {templates.map((template) => (
                <option key={template} value={template}>
                  {template}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLoadTemplate}
              disabled={loading || !selectedTemplate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Chargement...
                </>
              ) : (
                "Charger le Modèle"
              )}
            </button>

            <button
              onClick={loadTemplates}
              disabled={loading}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Actualiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
