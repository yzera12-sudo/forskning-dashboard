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
        surface: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          muted: "#f1f5f9",
        },
        brand: {
          DEFAULT: "#1e4d6b",
          light: "#2d6a8f",
          soft: "#e8f2f8",
        },
        accent: {
          DEFAULT: "#0d9488",
          soft: "#ccfbf1",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 4px 12px rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
