/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: [
    "./components/**/*.{js,vue,ts}",
    "./views/**/*.vue",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./utils/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        logo: "#F75889",
        customError: '#F76858',
        customDarkText: "#06172A",
        greyText: "#595959",
        grayButtons: "#828282",
        customGreyButton: "#B5B5B5",

        primary: {
          custom: "#58BAF7",
          custom2: "#7cb8de",
          50: "#f0f8ff",
          100: "#e0f0fe",
          200: "#bbe1fc",
          300: "#7fc9fa",
          400: "#58baf7",
          500: "#1194e6",
          600: "#0474c5",
          700: "#055c9f",
          800: "#095083",
          900: "#0d436d",
        },
        neutral: {
          50: "#F7F9FC",
          100: "#E8ECF2",
          200: "#DADDE5",
          300: "#BEC2CC",
          400: "#A1A7B3",
          500: "#858C99",
          600: "#6C7380",
          700: "#555A66",
          800: "#3D424D",
          900: "#262B33",
          950: "#11141A",
        },
        gray: {
          DEFAULT: "#f7f7f7",
          secondary: "#75808a",
          input: "#edeff2",
          "input-focus": "#dfe3e7",
        },
        error: {
          50: "#fef3f2",
          100: "#fee5e2",
          200: "#fecfca",
          300: "#fcaea5",
          400: "#f76858",
          500: "#ef5544",
          600: "#dc3826",
          700: "#b92c1c",
          800: "#99281b",
          900: "#7f271d",
        },
        warning: {
          400: "#FFC81A",
          600: "#E5AF00",
        },
        success: {
          400: "#33FF99",
          600: "#00CC66",
        },
      },
      spacing: {
        "block-padding": "32px",
        "block-padding-1/2": "16px",
        "block-padding-1/4": "8px",
        "block-gap": "24px",
        "block-gap-2/3": "16px",
        "block-gap-1/2": "12px",
      },
    },
    screens: {
      xxs: "320px",
      xs: "480px",
      sm: "640px",
      md: "720px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1920px",
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities, theme }) {
      addBase({
        ".h1": {
          fontSize: "36px",
          fontWeight: "400",
          lineHeight: "1.15",
          marginBottom: theme("spacing.block-gap-2/3"),
        },
        "@screen sm": {
          ".h1": {
            fontSize: "40px",
            lineHeight: "1.4",
            marginBottom: theme("spacing.block-gap"),
          },
        },
        ".h2": {
          fontSize: "26px",
          fontWeight: theme("fontWeight.bold"),
          lineHeight: theme("lineHeight.tight"),
          paddingTop: theme("padding.5"),
        },
      });
      addUtilities({
        ".wrap-balance": {
          textWrap: "balance",
        },
      });
    }),
  ],
};
