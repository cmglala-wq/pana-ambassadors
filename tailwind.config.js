/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pana: {
          lime: '#CFFF04',
          'lime-soft': '#E5FF6B',
          blue: '#1E7FE0',
          'blue-deep': '#0B5BD3',
          navy: '#0A1628',
          'navy-2': '#0F1F3D',
          'navy-3': '#162A4A',
          pink: '#E91E63',
          ice: '#E8F0FF',
          cream: '#FFFDF5'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        tightest: '-0.04em'
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(207,255,4,0)' },
          '50%': { boxShadow: '0 0 60px 8px rgba(207,255,4,0.35)' }
        }
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 2.4s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s ease-out both',
        spinSlow: 'spinSlow 24s linear infinite',
        glow: 'glow 3.6s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
