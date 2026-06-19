import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConvertPilot – Convertisseur de fichiers en ligne",
  description: "Convertissez vos fichiers image, vidéo, audio, document et bien plus encore – gratuitement et sans inscription.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-100 text-gray-900">{children}</body>
    </html>
  );
}
