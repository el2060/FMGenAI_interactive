/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#0A0A12',
        muted: '#5D5D6B',
        soft: '#9999A3',
        line: '#E7E7DF',
        cream: '#FAFAF5',
        surface: '#FFFFFF',
        L1: '#7C3AED',
        L2: '#F97316',
        L3: '#E11D48',
        win: '#65A30D',
      },
      boxShadow: {
        pop: '0 1px 0 rgba(10,10,18,0.04), 0 2px 6px rgba(10,10,18,0.05), 0 12px 24px -10px rgba(10,10,18,0.08)',
        glow: '0 0 0 4px rgba(124,58,237,0.12)',
        glowO: '0 0 0 4px rgba(249,115,22,0.14)',
        glowR: '0 0 0 4px rgba(225,29,72,0.14)',
        ring: '0 8px 30px -10px rgba(10,10,18,0.35)',
      },
    },
  },
  plugins: [],
};
