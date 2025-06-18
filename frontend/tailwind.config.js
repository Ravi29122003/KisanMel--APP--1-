/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'soft-off-white': '#FAF9F6',
        'kisan-green': '#4CAF50',
        'dark-brown': '#3E2723',
        'text-dark': '#222', // General dark text color
        'navbar-text': '#2E3A59', // Specific dark color for navbar text
        'box-bg': '#F0FDF4', // Light green/white for the info boxes
        'kisan-header-green': '#388E3C', // New specific green for headers
        'kisan-orange': '#FFB300', // For the Book a Free Consultation button
        'dashboard-accent-green': '#408000', // New green for headings and button hovers
        'dashboard-button-green': '#237804', // New green for buttons
        'setup-card-bg': '#f0fff0', // New light green for the setup card
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 