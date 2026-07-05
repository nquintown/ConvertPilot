import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertPilot – Convertisseur de fichiers en ligne",
  description: "Convertissez vos fichiers image, vidéo, audio, document et bien plus encore – gratuitement et sans inscription.",
  other: {
    // AdSense site ownership verification — required for Google crawler
    "google-adsense-account": "ca-pub-8073783780020241",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-100 text-gray-900">
        {children}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8073783780020241"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
