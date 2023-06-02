/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      container: {
        screens: {
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
        },
      },
      tableContainer: {
        width: "100%",
        height: "100vh",
        overflow: "auto",
      },
      table: {
        width: "100%",
        borderCollapse: "collapse",
      },
      colors: {
        primary: "#ea580c",
        dark: {
          light: "#5A7184",
          hard: "#0D2436",
          soft: "#183B56",
        },
      },
      fontFamily: {
        opensans: ["'Open Sans'", "sans-serif"],
        roboto: ["'Roboto'", "sans-serif"],
      },
      heightcarousel: {
        'custom-height': '500px', 
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
