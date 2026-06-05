import type { MetadataRoute } from "next";

/**
 * Web App Manifest (Next metadata route → /manifest.webmanifest).
 * Dark-first per Design Law #4; theme/background use the canonical void tokens.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chromatic Design Studios",
    short_name: "Chromatic",
    description:
      "Local-first AI design and operations control center — a governed, token-driven design system.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
