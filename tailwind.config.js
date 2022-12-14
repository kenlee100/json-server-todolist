/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["web/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

// cli
// npx tailwindcss -i web/src/css/style.css -o web/dist/style.css --watch
