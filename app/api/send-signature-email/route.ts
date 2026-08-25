import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { Client } from '@microsoft/microsoft-graph-client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { signatureImage, userEmail, userName, accessToken: clientAccessToken } = body;

    const targetEmail = userEmail || session?.user?.email;
    const targetName = userName || session?.user?.name || 'Collaborateur ESPI';
    const effectiveToken = (session as { accessToken?: string })?.accessToken || clientAccessToken;

    console.log('📧 API - Email de destination:', targetEmail);
    console.log('📧 API - Nom utilisateur:', targetName);

    if (!targetEmail) {
      return NextResponse.json(
        { success: false, message: "Adresse email manquante" },
        { status: 400 }
      );
    }

    const base64Content = signatureImage && signatureImage.includes(',') 
      ? signatureImage.split(',')[1] 
      : signatureImage || '';

    const cleanFileName = `signature-espi-${targetName.toLowerCase().replace(/\s+/g, '-')}.png`;

    // Gabarit de l'email officiel aux couleurs de la Charte ESPI 2026
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Commissioner', -apple-system, BlinkMacSystemFont, Arial, sans-serif; color: #002d4a;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; padding: 30px 10px;">
          <tr>
            <td align="center">
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 640px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 73, 118, 0.08); border: 1px solid #d9e5ec;">
                <!-- En-tête officiel Bleu Élévation -->
                <tr>
                  <td style="background: linear-gradient(135deg, #003a5e 0%, #004976 100%); background-color: #004976; padding: 25px 30px; text-align: left;">
                    <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 1px;">GROUPE ESPI</div>
                    <div style="font-size: 11px; color: #47b5e0; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px;">L'EXCELLENCE ACADÉMIQUE</div>
                  </td>
                </tr>

                <!-- Contenu Principal -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="font-size: 19px; font-weight: bold; color: #004976; margin: 0 0 15px 0;">
                      Votre signature officielle ESPI est prête !
                    </h2>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
                      Bonjour <strong>${targetName}</strong>,
                    </p>
                    
                    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                      Votre signature d'email aux normes de la nouvelle charte graphique a été générée avec succès. Vous trouverez votre signature intégrée ci-dessous ainsi qu'en pièce jointe haute définition.
                    </p>

                    <!-- Aperçu de la Signature -->
                    <div style="margin: 20px 0; text-align: center;">
                      <img src="cid:signature-image" alt="Signature Officielle ESPI" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border: 1px solid #d9e5ec;" />
                    </div>

                    <!-- Guide d'installation rapide -->
                    <div style="background-color: #f2f6f8; border-left: 4px solid #004976; padding: 18px 20px; border-radius: 0 12px 12px 0; margin: 25px 0;">
                      <h3 style="font-size: 14px; font-weight: bold; color: #004976; margin: 0 0 10px 0;">
                        Guide d'installation rapide dans Outlook :
                      </h3>
                      <ol style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.6; color: #334155;">
                        <li style="margin-bottom: 6px;">Enregistrez l'image jointe <strong>${cleanFileName}</strong> sur votre ordinateur.</li>
                        <li style="margin-bottom: 6px;">Dans Outlook, accédez à <strong>Fichier &gt; Options &gt; Courrier &gt; Signatures</strong> (ou Paramètres &gt; Courrier &gt; Composer pour Outlook Web).</li>
                        <li style="margin-bottom: 6px;">Créez une nouvelle signature, insérez l'image et appliquez-la par défaut à vos nouveaux messages.</li>
                      </ol>
                    </div>

                    <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
                      Email généré automatiquement par la plateforme <strong>ESPI SignatureApp</strong>.
                    </p>
                  </td>
                </tr>

                <!-- Pied de page -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 15px 30px; border-top: 1px solid #d9e5ec; text-align: center; font-size: 12px; color: #64748b;">
                    Groupe ESPI • Direction Marketing &amp; Direction des Systèmes d'Information
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `.trim();

    // 1. Tenter l'envoi direct via Microsoft Graph API si un token est disponible
    if (effectiveToken) {
      try {
        console.log('📧 API - Tentative d\'envoi via Microsoft Graph API...');
        const graphClient = Client.init({
          authProvider: (done) => done(null, effectiveToken),
        });

        const graphAttachments = base64Content ? [
          {
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: cleanFileName,
            contentType: 'image/png',
            contentBytes: base64Content,
            isInline: true,
            contentId: 'signature-image',
          },
          {
            '@odata.type': '#microsoft.graph.fileAttachment',
            name: cleanFileName,
            contentType: 'image/png',
            contentBytes: base64Content,
            isInline: false,
          }
        ] : [];

        const graphMessage = {
          subject: `Votre nouvelle signature officielle ESPI - ${targetName}`,
          body: {
            contentType: 'HTML',
            content: htmlBody,
          },
          toRecipients: [
            {
              emailAddress: {
                address: targetEmail,
                name: targetName,
              },
            },
          ],
          attachments: graphAttachments,
        };

        await graphClient.api('/me/sendMail').post({ message: graphMessage, saveToSentItems: true });
        console.log('✅ API - Email envoyé avec succès via Microsoft Graph API');

        return NextResponse.json({
          success: true,
          provider: 'graph',
          message: `Signature transmise avec succès à ${targetEmail} via Microsoft 365`,
        });
      } catch (graphError: unknown) {
        console.warn('⚠️ API - Échec d\'envoi via Graph API, fallback sur SMTP:', graphError);
      }
    }

    // 2. Fallback SMTP via Nodemailer
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
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
          name: 'Direction ESPI - SignatureApp',
          address: process.env.SMTP_USER || '',
        },
        to: targetEmail,
        subject: `Votre nouvelle signature officielle ESPI - ${targetName}`,
        html: htmlBody,
        attachments: base64Content ? [
          {
            filename: cleanFileName,
            content: base64Content,
            encoding: 'base64',
            cid: 'signature-image',
          },
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
        message: `Signature transmise avec succès à ${targetEmail} (SMTP)`,
      });
    }

    return NextResponse.json({
      success: false,
      message: "Pour activer l'envoi d'email, reconnectez-vous avec Microsoft 365 pour valider la permission d'envoi.",
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
