/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#37352F',
        muted: '#787774',
        soft: '#9B9A97',
        line: '#EDEDED',
        cream: '#FFFFFF',
        surface: '#F7F7F5',
        win: '#111111',
      },
      boxShadow: {
        pop: '0 1px 2px rgba(0,0,0,0.05)',
        ring: '0 8px 30px -10px rgba(10,10,18,0.15)',
      },
    },
  },
  plugins: [],
};
