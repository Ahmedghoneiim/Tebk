/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar:    '#1a1d2e',
        primary:    '#6366f1',
        'primary-dark': '#4f46e5',
        ink:        '#0f172a',
        muted:      '#64748b',
        border:     '#e2e8f0',
        background: '#f1f5f9',
        card:       '#ffffff',
        success:    '#22c55e',
        warning:    '#f59e0b',
        danger:     '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        panel: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
