import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Set 'Inter' as the default font family
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Define a custom color palette for our app
      colors: {
        'primary': '#0052cc', // A nice, professional blue
        'primary-hover': '#0041a3',
        'secondary': '#f0f4f8', // A very light gray for backgrounds
        'card-bg': '#ffffff',
        'text-main': '#172b4d',
        'text-light': '#5e6c84',
      },
    },
  },
  plugins: [],
}