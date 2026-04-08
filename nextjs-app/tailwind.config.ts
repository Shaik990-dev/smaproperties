import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F2342',
          light: '#1A3A5C',
          dark: '#0A1A30'
        },
        amber: {
          brand: '#E8A020',
          'brand-light': '#F5B942',
          'brand-dark': '#C8860A'
        },
        teal: {
          brand: '#0D7377'
        },
        cream: '#F8F4EE',
        wa: '#25D366'
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'Georgia', 'serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both'
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};

export default config;
