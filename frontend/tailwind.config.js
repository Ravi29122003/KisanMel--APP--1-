/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        'soft-off-white': '#F8F9FA',
        'brand-primary': '#2F7D32', // Primary kisan green
        'brand-accent': '#FFB300', // Mustard accent

        // Aliases preserved for backward-compatibility
        'kisan-green': '#2F7D32',
        'kisan-orange': '#FFB300',

        // Other colours
        'dark-brown': '#3E2723',
        'text-dark': '#333333', // Updated neutral text colour
        'navbar-text': '#2E3A59',
        'box-bg': '#F0FDF4',
        'kisan-header-green': '#2F7D32', // Re-align header green to primary
        'dashboard-accent-green': '#408000',
        'dashboard-button-green': '#237804',
        'setup-card-bg': '#f0fff0',
      },
      fontFamily: {
        // Use Inter for general body text
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Utility class: font-heading -> Poppins
        heading: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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