import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--route-canvas)",
        foreground: "var(--route-ink)",
        route: {
          peacock: "var(--route-peacock)",
          peacockDeep: "var(--route-peacock-deep)",
          peacockLight: "var(--route-peacock-light)",
          gold: "var(--route-gold)",
          goldSoft: "var(--route-gold-soft)",
          goldDeep: "var(--route-gold-deep)",
          amethyst: "var(--route-amethyst)",
          amethystSoft: "var(--route-amethyst-soft)",
          sage: "var(--route-sage)",
          sageDeep: "var(--route-sage-deep)",
          copper: "var(--route-copper)",
          copperSoft: "var(--route-copper-soft)",
          canvas: "var(--route-canvas)",
          ivory: "var(--route-ivory)",
          sand: "var(--route-sand)",
          parchment: "var(--route-parchment)",
          ink: "var(--route-ink)",
          inkSoft: "var(--route-ink-soft)",
          muted: "var(--route-muted)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        serif: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
