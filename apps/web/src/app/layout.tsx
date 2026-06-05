import type { Metadata, Viewport } from "next";
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESC =
  "Local-first AI design and operations control center — a governed, token-driven design system for the Chromatic Harness ecosystem.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Chromatic Design Studios",
    template: "%s · Chromatic Design Studios",
  },
  description: SITE_DESC,
  applicationName: "Chromatic Design Studios",
  authors: [{ name: "Chromatic Harness" }],
  keywords: ["design system", "design tokens", "AI", "Next.js", "Tailwind"],
  icons: { icon: "/icon.svg", shortcut: "/icon.svg", apple: "/icon.svg" },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Chromatic Design Studios",
    description: SITE_DESC,
    siteName: "Chromatic Design Studios",
    url: SITE_URL,
  },
  twitter: { card: "summary", title: "Chromatic Design Studios", description: SITE_DESC },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#faf9fc" },
  ],
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
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
