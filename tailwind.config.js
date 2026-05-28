/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-L1','bg-L2','bg-L3','bg-L4','bg-L5','bg-L6','bg-L7','bg-L8','bg-L9','bg-L10','bg-L11',
    'bg-L1/10','bg-L2/10','bg-L3/10','bg-L4/10','bg-L5/10','bg-L6/10','bg-L7/10','bg-L8/10','bg-L9/10','bg-L10/10','bg-L11/10',
    'text-L1','text-L2','text-L3','text-L4','text-L5','text-L6','text-L7','text-L8','text-L9','text-L10','text-L11',
    'border-L1','border-L2','border-L3','border-L4','border-L5','border-L6','border-L7','border-L8','border-L9','border-L10','border-L11',
    'border-L1/40','border-L2/40','border-L3/40','border-L4/40','border-L5/40','border-L6/40','border-L7/40','border-L8/40','border-L9/40','border-L10/40','border-L11/40',
    'ring-pulse-L1','ring-pulse-L2','ring-pulse-L3','ring-pulse-L4','ring-pulse-L5','ring-pulse-L6','ring-pulse-L7','ring-pulse-L8','ring-pulse-L9','ring-pulse-L10','ring-pulse-L11',
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
        L1:  '#7C3AED',
        L2:  '#EC4899',
        L3:  '#4F46E5',
        L4:  '#F59E0B',
        L5:  '#F97316',
        L6:  '#14B8A6',
        L7:  '#3B82F6',
        L8:  '#10B981',
        L9:  '#475569',
        L10: '#E11D48',
        L11: '#7C2D8E',
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
