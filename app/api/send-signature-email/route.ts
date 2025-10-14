import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { signatureImage, userEmail, userName } = await request.json();
    
    console.log('📧 API - Email de destination:', userEmail);
    console.log('📧 API - Nom utilisateur:', userName);
    console.log('📧 API - SMTP_HOST:', process.env.SMTP_HOST);
    console.log('📧 API - SMTP_USER:', process.env.SMTP_USER);

    // Configuration SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Créer l'email avec la signature en pièce jointe
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: userEmail,
      subject: `Votre signature ESPI - ${userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">Votre signature ESPI est prête !</h2>
          
          <p>Bonjour ${userName},</p>
          
          <p>Votre signature personnalisée a été générée avec succès. Vous trouverez l'image de votre signature en pièce jointe.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Instructions d'installation :</h3>
            <ol style="color: #374151;">
              <li>Téléchargez l'image de signature en pièce jointe</li>
              <li>Dans Outlook, allez dans Paramètres > Signatures</li>
              <li>Créez une nouvelle signature et insérez l'image</li>
              <li>Configurez la signature pour les nouveaux messages et réponses</li>
            </ol>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Cette signature a été générée automatiquement par l'application ESPI Signature.
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `signature-${userName.replace(/\s+/g, '-')}.png`,
          content: signatureImage.split(',')[1], // Retirer le préfixe data:image/png;base64,
          encoding: 'base64'
        }
      ]
    };

    // Envoyer l'email
    console.log('📧 Envoi de l\'email en cours...');
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Email envoyé avec succès:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      message: 'Signature envoyée par email avec succès' 
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors de l\'envoi de l\'email',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
