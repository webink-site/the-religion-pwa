/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './error.vue',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1025px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        md: '1360px',
        lg: '1360px',
        xl: '1600px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        spectral: ['Spectral', 'serif'],
      },
      colors: {
        ink: '#202020',
        muted: 'rgba(0, 0, 0, 0.4)',
        line: '#e5e5e5',
        surface: {
          DEFAULT: '#f3f3f3',
          hover: '#e8e8e8',
        },
        page: '#ffffff',
        danger: '#e64646',
      },
      borderRadius: {
        'ui': '6px',
        'ui-lg': '8px',
      },
      boxShadow: {
        'float': '0 2px 16px rgba(0, 0, 0, 0.08)',
        'inset-line': 'inset 0 0 0 1px #e5e5e5',
        'inset-ink': 'inset 0 0 0 1px #202020',
        'inset-danger': 'inset 0 0 0 1px #e64646',
        'input-line': 'inset 0 -1px 0 0 #202020',
        'input-line-focus': 'inset 0 -2px 0 0 #202020',
        'input-line-error': 'inset 0 -2px 0 0 #e64646',
      },
      letterSpacing: {
        ui: '0.03em',
      },
      width: {
        calendar: '320px',
      },
      minWidth: {
        calendar: '320px',
      },
      maxWidth: {
        calendar: '320px',
      },
    },
  },
  plugins: [],
}
