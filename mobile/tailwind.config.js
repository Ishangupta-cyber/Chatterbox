/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* BRAND */
        primary: {
          DEFAULT: "#4F8DF7", // chat bubbles, active tab
          light: "#7DB3FF",
          dark: "#2F6AE1",
          soft: "#E6F0FF",
        },

        /* BACKGROUNDS */
        surface: {
          DEFAULT: "#0B1220",
          dark: "#070C17",
          light: "#111A2E",
        },

        /* TEXT */
        foreground: "#F1F5F9",
        "muted-foreground": "#9AA7C7",
        "subtle-foreground": "#6B7AA6",

        /* OPTIONAL ACCENT */
        accent: "#8B5CF6", // illustration bubbles only
      },
    },
  },
  plugins: [],
};
