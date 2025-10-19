/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a90e2',
          light: '#eaf2fa',
        },
        secondary: '#f5f7fa',
        'light-gray': '#f0f0f0',
        'font-color': '#333',
        'border-color': '#e0e0e0',
        danger: '#d7685b',
        success: '#27ae60',
        warning: '#f39c12',
        logo: '#e49732',
        'action-icon': '#6d6d6d',
        'slate-gray': '#778899',
        'turquoise': '#16a085',
        'carrot-orange': '#e67e22',
        'wisteria': '#8e44ad',
        'peter-river': '#3498db',
        'pomegranate': '#c0392b',
        'wet-asphalt': '#34495e',
        'belize-hole': '#2980b9',
        'emerald': '#2ecc71',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'tiny': '0.75rem',
        'xs': '0.8rem',
        'sm': '0.85rem',
        'base': '0.8rem',
        'md': '1rem',
        'lg': '1.2rem',
        'xl': '1.5rem',
        '2xl': '1.6rem',
      },
      spacing: {
        '15': '60px',
      },
      boxShadow: {
        'custom': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'none': '0px',
      },
    },
  },
  plugins: [],
}
