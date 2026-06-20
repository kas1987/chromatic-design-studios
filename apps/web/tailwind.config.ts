import type { Config } from "tailwindcss";
import { chromaticTheme } from "./src/styles/chromatic-theme";

/**
 * Tailwind is driven entirely by the Chromatic token system.
 * theme.extend is generated from 02_design_tokens/*.json by
 * scripts/build-tokens.mjs (run via `npm run tokens`). Do not hardcode
 * colors/spacing here — edit the source tokens and regenerate.
 */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Chromatic UI package — keep its token classes from being purged.
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: chromaticTheme,
  plugins: [],
} satisfies Config;
