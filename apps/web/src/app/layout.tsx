import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Chromatic typography tokens: Inter (heading/UI), IBM Plex Sans (body),
// IBM Plex Mono (code). Exposed as CSS vars consumed by the token system.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chromatic Design Studios",
  description: "Local-first AI design and operations control center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${plexSans.variable} ${plexMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
