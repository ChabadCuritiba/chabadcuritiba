/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chabad: {
          dark: '#082517',
          pine: '#0d4a2b',
          emerald: '#136c3e',
          DEFAULT: '#105e38',
          light: '#e8f5ed',
          gold: '#cba135',
          goldLight: '#f6eed6',
          goldDark: '#997316',
          navy: '#0c1e33',
          slate: '#f8fafc',
          warm: '#fbfaf6',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        hebrew: ['David Libre', 'Frank Ruhl Libre', 'serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -5px rgba(16, 94, 56, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'gold': '0 10px 25px -3px rgba(203, 161, 53, 0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #dfb743 0%, #cba135 50%, #9e7518 100%)',
        'chabad-gradient': 'linear-gradient(135deg, #0d4a2b 0%, #105e38 60%, #177a4b 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0a192f 0%, #132742 100%)',
      }
    },
  },
  plugins: [],
}
