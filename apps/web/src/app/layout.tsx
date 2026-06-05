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

// No-flash theme init: runs before paint, applies the persisted choice to
// <html> so the correct token set is active on first frame. Dark is default.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('chromatic-theme');var r=document.documentElement;if(t==='light'){r.classList.add('light');r.classList.remove('dark');}else{r.classList.add('dark');r.classList.remove('light');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body
        className={`${inter.variable} ${plexSans.variable} ${plexMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
