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
        heading: ["var(--font-heading)", "Georgia", "serif"],
      },
      colors: {
        // Ali Abdaal design system
        ali: {
          bg1:       "#FFFFFF",
          bg2:       "#F9F6F3",
          bg3:       "#F3EDE9",
          bg4:       "#ECE5E1",
          fg1:       "#1B1624",
          fg2:       "#54505B",
          fg3:       "#76737C",
          fg4:       "#8D8A91",
          primary:   "#5DCDF1",
          secondary: "#FD976D",
          tertiary:  "#38BD37",
          accent:    "#C9B1FB",
          accent2:   "#79D287",
        },
      },
      boxShadow: {
        "card-hover": "0px 30px 40px -15px rgba(194, 179, 164, 0.6)",
        "card-lift":  "0px 20px 40px -12px rgba(194, 179, 164, 0.5)",
      },
      borderRadius: {
        "2.5xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
