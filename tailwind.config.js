/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'industrial': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        'valve-open': '#10b981',
        'valve-closed': '#6b7280',
        'pressure-high': '#dc2626',
        'pressure-medium': '#f59e0b',
        'pressure-low': '#10b981',
        'equipment-on': '#3b82f6',
        'equipment-off': '#9ca3af',
      },
      animation: {
        'flow': 'flow 1s linear infinite',
        'flame': 'flame 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        flow: {
          '0%': { strokeDasharray: '0,10' },
          '100%': { strokeDasharray: '10,0' }
        },
        flame: {
          '0%': { transform: 'scale(1) rotate(-2deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1.2) rotate(2deg)', opacity: '1' }
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
