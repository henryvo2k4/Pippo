/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito"', '"Quicksand"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Baloo 2"', '"Nunito"', '"Quicksand"', 'system-ui', 'sans-serif'],
        mono: ['"Nunito"', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
      scale: {
        '102': '1.02',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-once': 'popIn 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0px)' },
        },
      }
    },
  },
  plugins: [],
}
