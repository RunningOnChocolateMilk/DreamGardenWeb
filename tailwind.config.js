/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // DreamGarden Color Scheme
        dg: {
          background: '#F8FAFC',
          cardBackground: '#FFFFFF',
          primary: '#10B981',
          primaryLight: '#34D399',
          accent: '#059669',
          accentLight: '#10B981',
          secondary: '#F59E0B',
          secondaryLight: '#FBBF24',
          sunlight: '#F97316',
          shadow: 'rgba(0, 0, 0, 0.1)',
          primaryText: '#1F2937',
          secondaryText: '#6B7280',
          tertiaryText: '#9CA3AF',
          buttonTextOnAccent: '#FFFFFF',
          buttonTextDisabled: '#9CA3AF',
          gradientStart: '#10B981',
          gradientEnd: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
