/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#1e3a8a',
          600: '#002868',
          700: '#001d4d',
          800: '#001433',
          900: '#000a1a',
        },
        mx: {
          green: '#006847',
          red: '#CE1126',
        },
        us: {
          blue: '#002868',
          red: '#BF0A30',
        },
        ca: {
          red: '#FF0000',
        },
        pitch: {
          deepest: '#0a1f14',
          DEFAULT: '#14532d',
          light: '#166534',
          line: '#22c55e33',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      backgroundImage: {
        'pitch-pattern':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'host-gradient':
          'linear-gradient(135deg, #006847 0%, #002868 50%, #BF0A30 100%)',
        'hero-gradient':
          'linear-gradient(160deg, #0a1f14 0%, #001433 40%, #0a2e1a 70%, #1a0a0a 100%)',
      },
      backgroundSize: {
        pitch: '48px 48px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255,255,255,0.06)',
        glow: '0 0 40px rgba(34, 197, 94, 0.15)',
      },
      fontFamily: {
        display: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
