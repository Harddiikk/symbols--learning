/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        liquid: {
          bg: '#f8fafc',
          surface: 'rgba(255, 255, 255, 0.7)',
          primary: '#818cf8', // soft indigo
          primaryHover: '#6366f1',
          secondary: '#fbcfe8', // soft pink
          accent: '#c4b5fd', // soft purple
          success: '#a7f3d0', // pastel green
          successText: '#065f46',
          warning: '#fde68a', // pastel yellow
          warningText: '#92400e',
          text: '#334155',
          textMuted: '#64748b',
          border: 'rgba(255, 255, 255, 0.4)',
        }
      },
      boxShadow: {
        'liquid': '0 8px 32px 0 rgba(148, 163, 184, 0.15)',
        'liquid-hover': '0 12px 48px 0 rgba(148, 163, 184, 0.25)',
      },
      borderRadius: {
        'liquid': '20px',
      }
    },
  },
  plugins: [],
}
