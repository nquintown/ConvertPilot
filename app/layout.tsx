import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertPilot – Convertisseur de fichiers en ligne",
  description: "Convertissez vos fichiers image, vidéo, audio, document et bien plus encore – gratuitement et sans inscription.",
  other: {
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
      <head>
        {/* AdSense script placed directly in <head> so Google's crawler sees it
            in the raw HTML response without needing to execute JavaScript */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8073783780020241"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
