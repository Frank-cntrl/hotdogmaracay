/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md}"],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0a",
          elevated: "#111111",
        },
        accent: {
          orange: "#FF6B00",
          yellow: "#FFB800",
          warm: "#5C1E00",
        },
        text: {
          primary: "#FFFFFF",
          muted: "#A0A0A0",
        },
      },
      fontFamily: {
        display: ["Anton", "Impact", "Arial Black", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cta: "0 8px 24px -6px rgba(255, 107, 0, 0.5)",
      },
    },
  },
};
