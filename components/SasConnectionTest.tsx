"use client";

import { useState } from "react";
import { azureBlobService } from "@/lib/azure-blob-service";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SasConnectionTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{
    connection: boolean | null;
    containerAccess: boolean | null;
    fileList: string[];
    error: string | null;
  }>({
    connection: null,
    containerAccess: null,
    fileList: [],
    error: null,
  });

  const runTests = async () => {
    setIsLoading(true);
    setTestResults({
      connection: null,
      containerAccess: null,
      fileList: [],
      error: null,
    });

    try {
      // Test 1: Connexion au service
      console.log("🔧 [SAS Test] Test de connexion...");
      setTestResults(prev => ({ ...prev, connection: true }));

      // Test 2: Accès au container et liste des fichiers
      console.log("🔧 [SAS Test] Test d'accès au container...");
      const templates = await azureBlobService.listTemplates();
      setTestResults(prev => ({ 
        ...prev, 
        containerAccess: true,
        fileList: templates 
      }));

      console.log("✅ [SAS Test] Tous les tests réussis");
    } catch (error) {
      console.error("❌ [SAS Test] Erreur:", error);
      setTestResults(prev => ({ 
        ...prev, 
        connection: false,
        containerAccess: false,
        error: error instanceof Error ? error.message : "Erreur inconnue"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: boolean | null) => {
    if (status === null) return <AlertCircle className="w-5 h-5 text-gray-400" />;
    if (status) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const getStatusText = (status: boolean | null) => {
    if (status === null) return "En attente";
    if (status) return "Réussi";
    return "Échec";
  };

  const getStatusColor = (status: boolean | null) => {
    if (status === null) return "text-gray-500";
    if (status) return "text-green-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Test de Connexion Azure Storage
          </h3>
          <p className="text-gray-600 text-sm">
            Vérification de la connexion Azure Storage avec chaîne de connexion
          </p>
        </div>
        <button
          onClick={runTests}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span>{isLoading ? "Test en cours..." : "Tester la connexion"}</span>
        </button>
      </div>

      {/* Résultats des tests */}
      <div className="space-y-4">
        {/* Test de connexion */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(testResults.connection)}
            <div>
              <p className="font-medium text-gray-900">Connexion au service</p>
              <p className="text-sm text-gray-600">Initialisation du client Azure Storage</p>
            </div>
          </div>
          <span className={`font-medium ${getStatusColor(testResults.connection)}`}>
            {getStatusText(testResults.connection)}
          </span>
        </div>

        {/* Test d'accès au container */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {getStatusIcon(testResults.containerAccess)}
            <div>
              <p className="font-medium text-gray-900">Accès au container</p>
              <p className="text-sm text-gray-600">Lecture et liste des fichiers</p>
            </div>
          </div>
          <span className={`font-medium ${getStatusColor(testResults.containerAccess)}`}>
            {getStatusText(testResults.containerAccess)}
          </span>
        </div>

        {/* Liste des fichiers trouvés */}
        {testResults.fileList.length > 0 && (
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">
                Fichiers trouvés ({testResults.fileList.length})
              </h4>
            </div>
            <div className="space-y-2">
              {testResults.fileList.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-800 font-mono">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {testResults.error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-900">Erreur détectée</h4>
            </div>
            <p className="text-red-800 text-sm font-mono">{testResults.error}</p>
          </div>
        )}

        {/* Instructions de configuration */}
        {testResults.connection === false && (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h4 className="font-medium text-yellow-900">Configuration requise</h4>
            </div>
            <div className="text-sm text-yellow-800 space-y-2">
              <p>Pour configurer l'accès Azure Storage :</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Récupérez la chaîne de connexion dans le portail Azure</li>
                <li>Ajoutez <code className="bg-yellow-100 px-1 rounded">AZURE_STORAGE_CONNECTION_STRING</code> à votre fichier .env</li>
                <li>Configurez <code className="bg-yellow-100 px-1 rounded">AZURE_STORAGE_CONTAINER_NAME</code> (par défaut : "templatesignature")</li>
                <li>Relancez l'application</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
