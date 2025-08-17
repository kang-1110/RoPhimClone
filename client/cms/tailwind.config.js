/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // borderDefault: '#C8D0D0',
        // error: '#FF453A',
        // tertiary: '#8E9393',
        // secondary: '#5B5D5F',
        // coolgray20: '#DDE1E6',
        // coolgray60: '#697077',
        // primaryhover: '#8C6B5A',
        // primary: '#A88371',
        // bglightbrand: '#F5F1EF',
      },
      fontFamily: {
        // roboto: ['Roboto', 'sans-serif'],
      },
    },
    container: {
      center: true, // Center the container by default
      screens: {
        // sm: '640px',
        // md: '768px',
        // lg: '1024px',
        // xl: '1440px',
        // xxl: '1680px',
      },
    },
    plugins: [],
  },
};
