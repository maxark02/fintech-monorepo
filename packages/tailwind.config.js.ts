/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Укажите пути ко всем вашим компонентам, где используется Tailwind
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Важно для монорепозитория: укажите путь к пакету ui
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Ключевые кадры для анимации (от полной видимости к полупрозрачности)
      keyframes: {
        customPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".3" },
        },
      },
      // Привязываем ключевые кадры к названию анимации
      animation: {
        customPulse: "customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
