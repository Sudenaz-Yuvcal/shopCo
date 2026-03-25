import("tailwindcss").Config;
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
        integral: ["Integral CF", "sans-serif"],
      },
      fontWeight: {
        heavy: "1000",
      },

      colors: {
        surface: "#F0EEED",
        red: "#FF3333",
        khaki: "#4F4631",
        denim: "#31344F",
        green: "#314F4A",
        lightgreen: "#54d518",
        offwhite: "#FAFAFA",
        soft: "#F9F9F9",
        neutral: "#F5F5F5",
      },

      animation: {
        "spin-slow": "spin 8s linear infinite",
        "shop-fade-in": "shopFadeIn 0.5s ease-out forwards",
        "shop-zoom-in": "shopZoomIn 0.5s ease-out forwards",
        "bounce-gentle": "bounce 3s infinite",
        "wheel-frisbee":
          "wheelFrisbeeIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "attention-shake": "attentionShake 0.5s ease-in-out infinite",
      },

      keyframes: {
        shopFadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shopZoomIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wheelFrisbeeIn: {
          "0%": { opacity: "0", transform: "scale(0.2) rotate(-720deg)" },
          "70%": { opacity: "1", transform: "scale(1.1) rotate(10deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
        attentionShake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(10deg)" },
          "75%": { transform: "rotate(-10deg)" },
        },
      },

      borderRadius: {
        shop: "40px",
      },
      boxShadow: {
        premium: "0 0 50px rgba(0,0,0,0.1)",
        "red-glow": "0 0 120px rgba(255,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
