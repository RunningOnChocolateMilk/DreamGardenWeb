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
        'dg-primary': '#10B981',
        'dg-secondary': '#059669',
        'dg-accent': '#34D399',
        'dg-primaryText': '#1F2937',
        'dg-secondaryText': '#6B7280',
        'dg-background': '#F9FAFB',
        'dg-card': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
