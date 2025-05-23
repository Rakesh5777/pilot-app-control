/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'heading-main-menu': '#003035',
        'submenu': '#137978',
        'text-primary': '#0d3c48',
        'button-active': '#137978',
        'button-text': '#fbfcfc',
        'mouse-over': '#006e6c',
        'menu-item-selected': '#00cb7a',
      },
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
