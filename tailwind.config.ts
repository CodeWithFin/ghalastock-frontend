import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          muted: "#B7E4C7",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FDE68A",
        },
        surface: {
          DEFAULT: "#F9FAFB",
          raised: "#FFFFFF",
        },
        border: "#E5E7EB",
        foreground: "#111827",
        muted: {
          DEFAULT: "#6B7280",
          foreground: "#9CA3AF",
        },
        danger: "#DC2626",
        warning: "#D97706",
        success: "#16A34A",
        background: "#080805",
        card: "#121212",
        "card-foreground": "#ffffff",
        "landing-border": "#2A2A2A",
        "landing-muted": "#888888",
        "landing-accent": "#D4D414",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
        figtree: ["var(--font-figtree)", "Figtree", "sans-serif"],
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      keyframes: {
        "scan-line": {
          "0%, 100%": { top: "10%" },
          "50%": { top: "90%" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "scan-line": "scan-line 2s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
