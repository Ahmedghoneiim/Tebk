/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#213360',
          50:  '#e8ebf2',
          100: '#c5cedf',
          200: '#9faec8',
          300: '#798eb0',
          400: '#5e779f',
          500: '#436090',
          600: '#354d7a',
          700: '#273a64',
          800: '#213360',
          900: '#16234a',
        },
        secondary: {
          DEFAULT: '#21cdc0',
          50:  '#e4faf9',
          100: '#bcf2ef',
          200: '#87e8e3',
          300: '#52ded7',
          400: '#21cdc0',
          500: '#1bb3a7',
          600: '#14988d',
          700: '#0d7d74',
          800: '#07625b',
          900: '#034743',
        },
        background: '#f9f9f9',
        ink:      '#0e204d',
        clinical: '#e4faf9',
        subtitle: '#435ba1',
        success:  '#16A34A',
        warning:  '#F59E0B',
        danger:   '#E11D48',
        muted:    '#848e9f',
        border:   '#e7ebef',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft:  '0 2px 12px 0 rgba(33,51,96,0.08)',
        card:  '0 4px 24px 0 rgba(33,51,96,0.10)',
        modal: '0 8px 40px 0 rgba(33,51,96,0.16)',
      },
      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [],
}
