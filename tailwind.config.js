/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        primary: '#00FF85',
        secondary: '#7000FF',
        card: '#1A1A1A',
        muted: '#9BA1A6',
      },
      borderRadius: {
        card: '24px',
        container: '24px',
      },
    },
  },
  plugins: [],
};
