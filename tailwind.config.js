/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      base: "1.25rem", // Change the base font size to 20px (1.25rem)
      sm: "1rem",
      md: "1.5rem",
      lg: "1.875rem",
      xl: "2.25rem",
    },
    extend: {
      height: {
        128: "32rem",
      },
      minWidth: {
        half: "50%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
