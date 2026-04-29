/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: '#fdf6ee',
        'warm-white': '#fffcf7',
        blush: '#f2c4ce',
        rose: '#e8899a',
        'rose-deep': '#c0526a',
        mauve: '#9b6b7a',
        sage: '#8aab96',
        'sage-light': '#c5dcd0',
        lavender: '#c4b5d4',
        amber: '#e8b86d',
        charcoal: '#2c2028',
        dark: '#1a1218',
        muted: '#8a7880',
        'muted-light': '#c4b8be',
        border: '#e8dde2',
        'border-strong': '#d4c8ce',
      },
      borderRadius: {
        sm: '10px',
        DEFAULT: '16px',
        lg: '24px',
      },
      boxShadow: {
        sm: '0 2px 8px rgba(44,32,40,0.06)',
        md: '0 4px 20px rgba(44,32,40,0.10)',
        lg: '0 8px 40px rgba(44,32,40,0.14)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        spin: 'spin 0.7s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}