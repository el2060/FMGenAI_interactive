/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-L1','bg-L2','bg-L3','bg-L4','bg-L5','bg-L6',
    'text-L1','text-L2','text-L3','text-L4','text-L5','text-L6',
    'border-L1','border-L2','border-L3','border-L4','border-L5','border-L6',
  ],
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
        L2: '#EC4899',
        L3: '#F97316',
        L4: '#14B8A6',
        L5: '#4F46E5',
        L6: '#E11D48',
        win: '#65A30D',
      },
      boxShadow: {
        pop: '0 1px 0 rgba(10,10,18,0.04), 0 2px 6px rgba(10,10,18,0.05), 0 12px 24px -10px rgba(10,10,18,0.08)',
        ring: '0 8px 30px -10px rgba(10,10,18,0.35)',
      },
    },
  },
  plugins: [],
};
