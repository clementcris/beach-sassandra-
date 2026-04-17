import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sassandra Solaire | Votre Escale Akwaba à Sassandra",
  description: "Découvrez l'art de vivre au bord de l'eau. Réservez votre sésame pour une évasion sauvage et chic entre l'écume et le soleil de Sassandra.",
};

import AudioLounge from "@/components/AudioLounge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-body">
        {children}
        <AudioLounge />
      </body>
    </html>
  );
}
