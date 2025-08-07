/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-thai': ['Noto Sans Thai', 'sans-serif'],
      },
      colors: {
        emerald: {
          25: '#f0fdf4',
        },
        green: {
          25: '#f0fdf4',
        },
        white: {
          0: 'rgba(255, 255, 255, 0)',
        },
      },
    },
  },
  plugins: [],
} 