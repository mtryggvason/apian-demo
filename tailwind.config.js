/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "apian-yellow": "#ffc03a",
        "apian-panel-info": "#EFF6FF",
        "apian-panel-error": "#FEF2F2",
        "apian-nhs-blue": "#005EB8",
        "apian-green": "#78D16A",
        "apian-red": "#FF644F",
        "apian-soft-black": "#262626",
        "apian-dark-grey": "#737373",
        "apian-medium-grey": "#CBCAC9",
        "apian-light-grey": "#E9E9E7",
        "apian-menu-line-color": "#DCDCDC",
        "board-black": "#1e1e1e",
      },
    },
    fontFamily: {
      inter: ["var(--font-inter)"],
      poppins: ["var(--font-poppins)"],
      roboto: ["var(--font-roboto)"],
    },
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    lineHeight: {
      4.5: "calc(18 / 16 * 1rem)",
      15: "calc(60 / 16 * 1rem)",
    },
    boxShadow: {
      "apian-card": "0px 1px 3px rgba(0, 0, 0, 0.3)",
      "apian-modal": "0px 1px 3px 0px rgba(0, 0, 0, 0.15)",
    },
  },
  plugins: [],
};
