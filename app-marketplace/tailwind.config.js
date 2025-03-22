/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg) translateX(0) translateY(0)" },
          "25%": {
            transform: "rotate(90deg) translateX(5px) translateY(-5px)",
          },
          "50%": { transform: "rotate(180deg) translateX(0) translateY(0)" },
          "75%": {
            transform: "rotate(270deg) translateX(-5px) translateY(5px)",
          },
          "100%": { transform: "rotate(360deg) translateX(0) translateY(0)" },
        },
        "spin-slow-reverse": {
          "0%": { transform: "rotate(0deg) translateX(0) translateY(0)" },
          "25%": {
            transform: "rotate(-90deg) translateX(-5px) translateY(-5px)",
          },
          "50%": { transform: "rotate(-180deg) translateX(0) translateY(0)" },
          "75%": {
            transform: "rotate(-270deg) translateX(5px) translateY(5px)",
          },
          "100%": { transform: "rotate(-360deg) translateX(0) translateY(0)" },
        },
        streak: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        trail: {
          to: { "offset-distance": "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin-slow 12s ease-in-out infinite",
        "spin-slow-reverse": "spin-slow-reverse 12s ease-in-out infinite",
        streak: "streak 3s linear infinite",
        trail: "trail 6s infinite linear",
      },
    },
  },
  plugins: [],
};
