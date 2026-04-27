/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E1306C',
        secondary: '#833AB4',
        accent: '#FD1D1D',
        dark: '#0a0e27',
      },
    },
  },
  plugins: [],
};
