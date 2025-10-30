"use client";

import { useState, useEffect } from "react";
import { Download, FileText, CheckCircle, XCircle, Loader2, Eye, X } from "lucide-react";

interface Template {
  name: string;
  size?: number;
  lastModified?: string;
}

interface WordTemplateManagerProps {
  onTemplateLoaded?: (templateBuffer: Uint8Array) => void;
  onError?: (errorMessage: string) => void;
}

export default function WordTemplateManager({ onTemplateLoaded, onError }: WordTemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [downloadStatus, setDownloadStatus] = useState<{
    [key: string]: 'idle' | 'downloading' | 'success' | 'error';
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  // Charger la liste des modèles au montage du composant
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/test-azure');
      const data = await response.json();
      
      if (data.success) {
        const templateList = data.files.map((fileName: string) => ({
          name: fileName,
        }));
        setTemplates(templateList);
        
        // Sélectionner le premier modèle par défaut
        if (templateList.length > 0) {
          setSelectedTemplate(templateList[0].name);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des modèles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const readTemplate = async (templateName: string) => {
    setDownloadStatus(prev => ({ ...prev, [templateName]: 'downloading' }));
    
    try {
      const response = await fetch(`/api/download-template?file=${templateName}`);
      
      if (response.ok) {
        // Lire le contenu du fichier
        const buffer = await response.arrayBuffer();
        const templateBuffer = new Uint8Array(buffer);
        const content = new TextDecoder().decode(buffer);
        
        // Appel du callback si présent
        if(onTemplateLoaded) onTemplateLoaded(templateBuffer);
        console.log("📄 Contenu du fichier:", content);
        
        // Afficher le contenu dans une modal
        setModalTitle(`Modèle ${templateName}`);
        setModalContent(content);
        setShowModal(true);
        
        setDownloadStatus(prev => ({ ...prev, [templateName]: 'success' }));
      } else {
        throw new Error('Erreur lors de la lecture');
      }
    } catch (error: any) {
      console.error("Erreur lors de la lecture:", error);
      setDownloadStatus(prev => ({ ...prev, [templateName]: 'error' }));
      if(onError) onError(error?.message || 'Erreur inconnue');
    }
  };

  const getStatusIcon = (templateName: string) => {
    const status = downloadStatus[templateName];
    switch (status) {
      case 'downloading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Modèles Word</h3>
        </div>
        <button
          onClick={loadTemplates}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : null}
          <span>Actualiser</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des modèles...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun modèle trouvé</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-800">{template.name}</p>
                        <p className="text-sm text-gray-500">
                          {template.size ? `${(template.size / 1024).toFixed(1)} KB` : 'Taille inconnue'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => readTemplate(template.name)}
                        disabled={downloadStatus[template.name] === 'downloading'}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                      >
                        {getStatusIcon(template.name)}
                        <span>
                          {downloadStatus[template.name] === 'downloading' ? 'Lecture...' : 'Lire le contenu'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">💡 Information</h4>
        <p className="text-sm text-blue-700">
          Les modèles Word sont stockés dans Azure Blob Storage. Vous pouvez lire le contenu de ces modèles 
          pour créer vos documents de signature.
        </p>
      </div>

      {/* Modal pour afficher le contenu */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{modalTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {modalContent}
                </pre>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}