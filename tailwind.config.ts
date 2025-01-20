import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6", // Roxo vibrante
        secondary: "#1E1E2E", // Fundo escuro elegante
        accent: "#3F3F46", // Cinza estilizado
        dark: "#121212", // Preto suave para fundo
      },
    },
  },
  plugins: [],
};

export default config;
