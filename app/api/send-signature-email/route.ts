import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Client } from '@microsoft/microsoft-graph-client';

export async function POST(request: NextRequest) {
  try {
    const { signatureImage, userEmail, userName, accessToken } = await request.json();

    console.log('📧 API - Email de destination:', userEmail);
    console.log('📧 API - Nom utilisateur:', userName);

    const base64Content = signatureImage ? signatureImage.split(',')[1] : '';
    const cleanFileName = `signature-${(userName || 'espi').replace(/\s+/g, '-')}.png`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #2563eb; margin-bottom: 20px;">Votre signature ESPI est prête !</h2>
        
        <p>Bonjour ${userName || 'collaborateur'},</p>
        
        <p>Votre signature personnalisée a été générée avec succès. Vous trouverez l'image de votre signature en pièce jointe.</p>
        
        <a href="https://groupe-espi.fr/" target="_blank">
          <img src="${signatureImage}" alt="Signature ESPI" style="width:100%; max-width:600px; height:auto; border-radius: 8px; margin: 15px 0;" />
        </a>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
          <h3 style="color: #1e40af; margin-top: 0;">Instructions d'installation Outlook :</h3>
          <ol style="color: #334155; padding-left: 20px; line-height: 1.6;">
            <li>Téléchargez l'image de signature ci-jointe.</li>
            <li>Dans Outlook, ouvrez <strong>Fichier &gt; Options &gt; Courrier &gt; Signatures</strong> (ou Paramètres sur Web).</li>
            <li>Créez une nouvelle signature et insérez la photo.</li>
            <li>Configurez-la par défaut pour vos nouveaux messages.</li>
          </ol>
        </div>
        
        <p style="color: #64748b; font-size: 13px; margin-top: 30px;">
          Cette signature a été générée automatiquement par l'application <strong>ESPI SignatureApp</strong>.
        </p>
      </div>
    `;

    // 1. Tenter l'envoi direct via Microsoft Graph API si accessToken est disponible
    if (accessToken) {
      try {
        console.log('📧 API - Tentative d\'envoi via Microsoft Graph API...');
        const graphClient = Client.init({
          authProvider: (done) => done(null, accessToken),
        });

        const graphMessage = {
          subject: `Votre signature ESPI - ${userName}`,
          body: {
            contentType: 'HTML',
            content: htmlBody,
          },
          toRecipients: [
            {
              emailAddress: {
                address: userEmail,
                name: userName,
              },
            },
          ],
          attachments: base64Content ? [
            {
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: cleanFileName,
              contentType: 'image/png',
              contentBytes: base64Content,
            },
          ] : [],
        };

        await graphClient.api('/me/sendMail').post({ message: graphMessage, saveToSentItems: true });
        console.log('✅ API - Email envoyé avec succès via Microsoft Graph API');

        return NextResponse.json({
          success: true,
          provider: 'graph',
          message: 'Signature envoyée par email avec succès via votre compte Microsoft',
        });
      } catch (graphError) {
        console.warn('⚠️ API - Échec d\'envoi via Graph API, fallback sur SMTP:', graphError);
      }
    }

    // 2. Fallback SMTP via Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      console.log('📧 API - Envoi via SMTP Nodemailer...');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: {
          name: 'Service Informatique ESPI',
          address: process.env.SMTP_USER || '',
        },
        to: userEmail,
        subject: `Votre signature ESPI - ${userName}`,
        html: htmlBody,
        attachments: base64Content ? [
          {
            filename: cleanFileName,
            content: base64Content,
            encoding: 'base64',
          },
        ] : [],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ API - Email envoyé avec succès via SMTP:', info.messageId);

      return NextResponse.json({
        success: true,
        provider: 'smtp',
        message: 'Signature envoyée par email avec succès (SMTP)',
      });
    }

    return NextResponse.json({
      success: false,
      message: "Impossible d'envoyer l'email : Token Microsoft expiré et aucun serveur SMTP configuré.",
    }, { status: 400 });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      },
      { status: 500 }
    );
  }
}
