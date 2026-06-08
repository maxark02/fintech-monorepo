/** @type {import('tailwindcss').Config} */
module.exports = {
  // Здесь больше ничего не нужно, кроме анимации, если она не перенесена в CSS
  theme: {
    extend: {
      keyframes: {
        customPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".3" },
        },
      },
      animation: {
        customPulse: "customPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
