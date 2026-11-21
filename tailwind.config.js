/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1D4ED8', // Primary blue
          deep: '#0B2A6F',    // Deep navy blue
          light: '#EAF2FF',   // Light ice blue
          accent: '#FF8A00',  // Accent orange for badges/offers
          gold: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 42, 111, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)',
        'float': '0 10px 30px rgba(29, 78, 216, 0.18)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
}
