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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          navy: "#102C57",
          darkNavy: "#091A36",
          coral: "#EA5C2B",
          coralLight: "#FF7745",
          gold: "#D4AF37",
          goldLight: "#FDF6E2",
          green: "#17B978",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
