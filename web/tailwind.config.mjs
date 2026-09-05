/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#17326b',
          800: '#122a5c',
          900: '#0e214a',
        },
        'brand-red': {
          DEFAULT: '#d82029',
          dark: '#b81a22',
        },
        'brand-gray': '#909090',
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
