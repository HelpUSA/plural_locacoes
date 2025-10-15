/** 📄 tailwind.config.js — Plural Locações */
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        helpusNavy: "#0B132B",
        helpusBlue: "#1C2541",
        helpusSky: "#3A506B",
        helpusOrange: "#F2542D",
        pluralBrown: "#4b1e17",
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(242,84,45,.5)" },
          "50%": { boxShadow: "0 0 24px 4px rgba(242,84,45,.7)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.4s ease-in-out infinite",
        fadeIn: "fadeIn 1.2s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [forms, typography],
};
