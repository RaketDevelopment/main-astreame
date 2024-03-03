import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    backgroundImage: {
      'day-gradient': 'linear-gradient(90deg, #219FBA 0%, #3A7BD5 100%)',
      'night-gradient': 'linear-gradient(90deg, #536976 0%, #292E49 100%)',
      'red-gradient': 'linear-gradient(90deg, #FF243D 0%, #BD0016 100%)',
      'green-gradient': 'linear-gradient(90deg, #55B70A 0%, #2B5C05 100%)'
    },
    colors: {
      white: "#FFFFFF",
      "charcoal": {
        10: "#FAFAFA",
        50: "#E6E6E6",
        100: "#CCCCCC",
        200: "#9C9C9C",
        300: "#696969",
        400: "#383838",
        500: "#050505",
        600: "#050505",
        700: "#030303",
        800: "#030303",
        900: "#000000",
        950: "#000000"
      },
      blue: {
        50: "#EAF1FB",
        100: "#D9E6F7",
        200: "#AFC9EE",
        300: "#89B0E6",
        400: "#5F94DD",
        500: "#3A7BD5",
        600: "#2660B1",
        700: "#1D4987",
        800: "#133058",
        900: "#0A192E",
        950: "#040B15"
      },
      red: {
        50: "#FFE5E8",
        100: "#FFC7CD",
        200: "#FF8F9C",
        300: "#FF5C6F",
        400: "#FF243D",
        500: "#EA001C",
        600: "#BD0016",
        700: "#8F0011",
        800: "#5C000B",
        900: "#2E0005",
        950: "#190003"
      },
      green: {
        50: "#F1FEE7",
        100: "#E2FCCF",
        200: "#C3F99A",
        300: "#A7F769",
        400: "#87F434",
        500: "#6CE60D",
        600: "#55B70A",
        700: "#418C08",
        800: "#2B5C05",
        900: "#163003",
        950: "#0B1801"
      }
    },
    fontFamily: {
      'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
    },
    extend: {},
  },
  plugins: [],
} satisfies Config

