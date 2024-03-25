/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pBlue: "#0DBFD1",
        pStdBlue: "#3B82F6",
        pGreen: "#73CA04",
        pDarkBlue: "#0A0631",
        pGray: "#F4F4F4",
        pBlack: "#090723",
        pYellow: "#FF8B20",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/line-clamp")],
};
