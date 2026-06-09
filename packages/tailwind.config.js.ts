/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <-- ОБЯЗАТЕЛЬНО
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}", // укажите путь к вашему провайдеру тоже
  ],
  theme: {
    extend: {
      // ваши анимации...
    },
  },
};
