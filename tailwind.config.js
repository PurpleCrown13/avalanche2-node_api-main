const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {},
  },
  rippleui: {
    themes: [
      {
        themeName: "custom",
        colorScheme: "dark" | "light",
        prefersColorScheme: true,
        colors: {
          primary: "#634673",
          backgroundPrimary: "#282C34",
        },
      },
    ],
  },
  plugins: [nextui()],
};
