/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        myntra: {
          pink: '#ff3f6c',
          pinkHover: '#e0325b',
          pinkLight: '#fff0f3',
          dark: '#282c3f',
          grayText: '#535766',
          border: '#eaeaec',
          bg: '#f5f5f6',
          green: '#03a685',
          greenLight: '#e6f7f3',
        },
      },
      fontFamily: {
        sans: ['Assistant', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
