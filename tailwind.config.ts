import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: "#5b4fe4" },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.10)",
        btn: "0 18px 45px rgba(91, 79, 228, 0.28)",
      },
      borderRadius: { xl2: "22px" },
    },
  },
  plugins: [],
} satisfies Config;
