"use client";

import { useState, useEffect } from 'react';
import { useGraphApi, useGraphEmails, useGraphProfile, useGraphFiles, useGraphMailboxSettings } from '@/hooks/useGraphApi';
import { Mail, User, FileText, Send, Download, Upload, RefreshCw, Settings, Eye, EyeOff, Trash2, Move } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GraphApiDemo() {
  const { isAuthenticated, validateConnection } = useGraphApi();
  const { profile, fetchProfile } = useGraphProfile();
  const { emails, fetchEmails, sendEmail, loadingEmails } = useGraphEmails();
  const { files, fetchFiles, downloadFile, uploadFile, loadingFiles } = useGraphFiles();
  const { settings, fetchSettings, updateSettings, loadingSettings } = useGraphMailboxSettings();
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchEmails();
      fetchFiles();
      fetchSettings();
    }
  }, [isAuthenticated, fetchProfile, fetchEmails, fetchFiles, fetchSettings]);

  const handleValidateConnection = async () => {
    setIsLoading(true);
    try {
      await validateConnection();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!profile?.mail) {
      alert('Adresse email non disponible');
      return;
    }

    try {
      await sendEmail({
        toRecipients: [{
          emailAddress: {
            address: profile.mail,
            name: profile.displayName,
          },
        }],
        subject: 'Test depuis SignatureApp',
        body: {
          contentType: 'HTML',
          content: `
            <h2>Test d'envoi d'email</h2>
            <p>Ce message a été envoyé depuis SignatureApp via Microsoft Graph API.</p>
            <p>Date: ${new Date().toLocaleString()}</p>
          `,
        },
      });
      setMessage('Email envoyé avec succès !');
    } catch (error) {
      setMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleDownloadFile = async (itemId: string, fileName: string) => {
    try {
      const fileContent = await downloadFile(itemId);
      const blob = new Blob([fileContent]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setMessage(`Fichier ${fileName} téléchargé avec succès !`);
    } catch (error) {
      setMessage(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Connexion Graph API requise
          </h3>
          <p className="text-gray-600 mb-4">
            Connectez-vous avec votre compte Microsoft pour accéder aux fonctionnalités Graph API
          </p>
          <button
            onClick={handleValidateConnection}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Vérification...' : 'Vérifier la connexion'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profil utilisateur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <User className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Profil utilisateur</h3>
        </div>
        
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nom</p>
              <p className="font-medium">{profile.displayName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{profile.mail || profile.userPrincipalName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Titre</p>
              <p className="font-medium">{profile.jobTitle || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Département</p>
              <p className="font-medium">{profile.department || 'Non spécifié'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Téléphone mobile</p>
              <p className="font-medium">{profile.mobilePhone || 'Non spécifié'}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        )}
      </motion.div>

      {/* Emails */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Emails récents</h3>
          </div>
          <button
            onClick={handleSendTestEmail}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer test</span>
          </button>
        </div>
        
        {loadingEmails ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Chargement des emails...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {emails.slice(0, 5).map((email, index) => (
              <div key={email.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{email.subject}</p>
                    <p className="text-sm text-gray-600">
                      De: {email.from?.emailAddress?.name || email.from?.emailAddress?.address}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(email.receivedDateTime).toLocaleString()}
                    </p>
                  </div>
                  {email.hasAttachments && (
                    <FileText className="w-4 h-4 text-blue-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Fichiers OneDrive */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <FileText className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fichiers OneDrive</h3>
        </div>
        
        {loadingFiles ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Chargement des fichiers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.slice(0, 6).map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size ? `${Math.round(file.size / 1024)} KB` : 'Dossier'}
                    </p>
                  </div>
                  {file.file && (
                    <button
                      onClick={() => handleDownloadFile(file.id, file.name)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Paramètres de boîte aux lettres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <Settings className="w-6 h-6 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Paramètres de boîte aux lettres</h3>
        </div>
        
        {loadingSettings ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Chargement des paramètres...</p>
          </div>
        ) : settings ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fuseau horaire</p>
                <p className="font-medium">{settings.timeZone || 'Non défini'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Langue</p>
                <p className="font-medium">
                  {settings.language?.displayName || settings.language?.locale || 'Non défini'}
                </p>
              </div>
            </div>
            
            {settings.automaticRepliesSetting && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Réponses automatiques</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-600">Statut:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      settings.automaticRepliesSetting.status === 'disabled' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {settings.automaticRepliesSetting.status === 'disabled' ? 'Désactivé' : 'Activé'}
                    </span>
                  </p>
                  {settings.automaticRepliesSetting.internalReplyMessage && (
                    <p className="text-sm text-gray-600">
                      Message interne: {settings.automaticRepliesSetting.internalReplyMessage}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600">Aucun paramètre disponible</p>
          </div>
        )}
      </motion.div>

      {/* Message de statut */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg"
        >
          <p>{message}</p>
        </motion.div>
      )}
    </div>
  );
}
