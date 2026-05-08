/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#fdf6ee',
          dark: '#1a1218',
        },
        'warm-white': {
          DEFAULT: '#fffcf7',
          dark: '#2c2028',
        },
        blush: {
          DEFAULT: '#f2c4ce',
          dark: '#c0526a',
        },
        rose: {
          DEFAULT: '#e8899a',
          dark: '#e8899a',
        },
        'rose-deep': {
          DEFAULT: '#c0526a',
          dark: '#f2c4ce',
        },
        mauve: {
          DEFAULT: '#9b6b7a',
          dark: '#c4b8be',
        },
        sage: {
          DEFAULT: '#8aab96',
          dark: '#c5dcd0',
        },
        'sage-light': {
          DEFAULT: '#c5dcd0',
          dark: '#8aab96',
        },
        lavender: {
          DEFAULT: '#c4b5d4',
          dark: '#9b6b7a',
        },
        amber: {
          DEFAULT: '#e8b86d',
          dark: '#e8b86d',
        },
        charcoal: {
          DEFAULT: '#2c2028',
          dark: '#fdf6ee',
        },
        dark: {
          DEFAULT: '#1a1218',
          dark: '#fdf6ee',
        },
        muted: {
          DEFAULT: '#8a7880',
          dark: '#c4b8be',
        },
        'muted-light': {
          DEFAULT: '#c4b8be',
          dark: '#8a7880',
        },
        border: {
          DEFAULT: '#e8dde2',
          dark: '#9b6b7a',
        },
        'border-strong': {
          DEFAULT: '#d4c8ce',
          dark: '#c4b5d4',
        },
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