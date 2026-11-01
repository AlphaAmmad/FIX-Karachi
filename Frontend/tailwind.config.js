/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9f5',
          100: '#d4f0e1',
          200: '#a7e0c6',
          300: '#74caa6',
          400: '#3aa97e',
          500: '#167a58',
          600: '#0f5e45',
          700: '#0d4c3a',
          800: '#0d3b2f',
          900: '#0b2d25',
        },
        sand: '#f5f1e8',
        ink: {
          DEFAULT: '#10281f',
          800: '#1a3d31',
          900: '#153227',
          950: '#10281f',
        },
        accent: '#d97706',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(16, 40, 31, 0.12)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(circle at top left, rgba(58,169,126,.18), transparent 32%), radial-gradient(circle at top right, rgba(217,119,6,.18), transparent 25%), linear-gradient(180deg, #f7faf8 0%, #eef6f2 100%)',
      },
    },
  },
  plugins: [],
};