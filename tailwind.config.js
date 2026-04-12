/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B00',
        'primary-hover': '#E65F00',
        secondary: '#1a1a1a',
        'text-muted': '#6b7280',
        'bg-light': '#FAFBFF',
      },
      borderRadius: {
        '3xl': '20px',
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0,0,0,0.05)',
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
};
