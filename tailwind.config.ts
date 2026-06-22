import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "-apple-system", "sans-serif"],
        heading: ["var(--font-heading)", "Space Grotesk", "system-ui", "sans-serif"],
        serif:   ["var(--font-serif)", "DM Serif Display", "Georgia", "serif"],
        mono:    ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Minh Đoàn — cool/emerald system
        ali: {
          bg1:       "#FFFFFF",
          bg2:       "#F5F7F7",
          bg3:       "#ECEFEF",
          bg4:       "#E6EAEA",
          fg1:       "#14181A",
          fg2:       "#586063",
          fg3:       "#8C9496",
          fg4:       "#B8C0C0",
          primary:   "#1F8A5B",
          secondary: "#1F8A5B",
          tertiary:  "#ECF5F0",
          accent:    "#1F8A5B",
          accent2:   "#186F49",
          // emerald accent family
          ac:        "#1F8A5B",
          "ac-dark":  "#186F49",
          "ac-soft":  "#ECF5F0",
          "ac-border": "#CDE6DA",
        },
      },
      boxShadow: {
        "card-hover": "0 16px 40px rgba(20, 24, 26, 0.09)",
        "card-lift":  "0 10px 30px rgba(20, 24, 26, 0.06)",
      },
      borderRadius: {
        "2.5xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
