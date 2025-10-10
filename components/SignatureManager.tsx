"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Send, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  size: string;
  lastModified: string;
  status: 'available' | 'processing' | 'error';
}

export default function SignatureManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Simuler le chargement des modèles
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTemplates([
        {
          id: '1',
          name: 'Signature Officielle.docx',
          size: '2.3 MB',
          lastModified: '2024-01-15',
          status: 'available'
        },
        {
          id: '2',
          name: 'Signature Commerciale.docx',
          size: '1.8 MB',
          lastModified: '2024-01-14',
          status: 'available'
        },
        {
          id: '3',
          name: 'Signature RH.docx',
          size: '2.1 MB',
          lastModified: '2024-01-13',
          status: 'available'
        }
      ]);
      setLoading(false);
    };

    loadTemplates();
  }, []);

  const handleCreateSignature = async () => {
    if (!selectedTemplate) return;
    
    setIsCreating(true);
    // Simulation de la création de signature
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCreating(false);
    
    // Afficher un message de succès
    alert('Signature créée avec succès !');
  };

  const handleDownloadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Simulation du téléchargement
      alert(`Téléchargement de ${template.name}...`);
    }
  };

  const handleSendEmail = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      // Simulation de l'envoi par email
      alert(`Envoi de ${template.name} par email...`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des modèles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Gestion des Signatures</h3>
          <p className="text-gray-600">Sélectionnez un modèle et créez votre signature</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau modèle
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <span className="font-medium text-gray-900">{template.name}</span>
              </div>
              {selectedTemplate === template.id && (
                <CheckCircle className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <div className="text-sm text-gray-500 mb-3">
              <p>Taille: {template.size}</p>
              <p>Modifié: {template.lastModified}</p>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTemplate(template.id);
                }}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4 mr-1" />
                Télécharger
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendEmail(template.id);
                }}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Send className="w-4 h-4 mr-1" />
                Envoyer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      {selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900">
                Modèle sélectionné: {templates.find(t => t.id === selectedTemplate)?.name}
              </h4>
              <p className="text-blue-700 text-sm">
                Prêt à créer votre signature personnalisée
              </p>
            </div>
            <button
              onClick={handleCreateSignature}
              disabled={isCreating}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer la signature
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
              <p className="text-sm text-gray-500">Modèles disponibles</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Signatures créées</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center">
            <Send className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-500">Emails envoyés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
