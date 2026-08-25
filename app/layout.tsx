import type { Metadata } from "next";
import { Commissioner, PT_Serif } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ESPI SignatureApp - Générateur Officiel de Signatures",
  description: "Générez et installez votre signature d'email officielle aux couleurs de la nouvelle charte ESPI",
  icons: {
    icon: "/charte/LOGO ESPI/Bleu/RVB/PNG/ESPI_emblème_élévation_bleu_RVB.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${commissioner.variable} ${ptSerif.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
