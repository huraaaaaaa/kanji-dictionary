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
      },
      keyframes: {
        'stroke-draw': {
          from: { strokeDashoffset: 'var(--stroke-len)' },
          to:   { strokeDashoffset: '0' },
        },
      },
      animation: {
        'stroke-draw': 'stroke-draw 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
export default config;
