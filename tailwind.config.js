/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        ivory: '#f7f2e8',
        graphite: '#1f2933',
        forest: '#0b3d2e'
      },
      fontFamily: {
        brand: ['Cinzel', 'serif'],
        display: ['Playfair Display', 'serif'],
        sans: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        luxe: '0 28px 70px rgba(0, 0, 0, 0.12)'
      }
    }
  },
  plugins: []
};
