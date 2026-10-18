/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC',
        surface: '#FFFFFF',
        nested: '#F1F5F9',
        borderLight: '#E2E8F0',
        borderHover: '#CBD5E1',
        ink: '#0F172A',
        inkHover: '#1E293B',
        inkMuted: '#475569',
        inkSubtle: '#64748B',
        emeraldSolid: '#059669',
        emeraldSurface: '#ECFDF5',
        emeraldBorder: '#A7F3D0',
        emeraldText: '#065F46',
        blueSolid: '#2563EB',
        blueSurface: '#EFF6FF',
        blueBorder: '#BFDBFE',
        blueText: '#1E40AF',
        amberSolid: '#D97706',
        amberSurface: '#FFFBEB',
        amberBorder: '#FDE68A',
        amberText: '#92400E',
        zinc: {
          850: '#1f1f23',
          925: '#121215',
          950: '#09090b',
        },
        brand: {
          emerald: '#10b981',
          cyan: '#06b6d4',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
