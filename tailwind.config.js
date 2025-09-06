/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(190, 80%, 40%)',
        accent: 'hsl(30, 90%, 50%)',
        bg: 'hsl(210, 30%, 97%)',
        surface: 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'modal': '0 16px 48px hsla(0, 0%, 0%, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}