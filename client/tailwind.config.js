export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0b1f3a",
        ink: "#172033",
        mint: "#16a34a",
        mist: "#f5f7fb"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(11, 31, 58, 0.12)"
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        fadeUp: "fadeUp .7s ease both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        fadeUp: {
          from: { opacity: 0, transform: "translateY(18px)" },
          to: { opacity: 1, transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
