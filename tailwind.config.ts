import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "deep-slate": "#0F172A",
        "surface-card": "#1E293B",
        "card-border": "#334155",
        "neon-cyan": "#06B6D4",
        "emerald-green": "#10B981",
      },
    },
  },
  plugins: [],
};

export default config;
