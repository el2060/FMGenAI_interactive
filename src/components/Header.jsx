import { motion } from 'framer-motion';
import { formatTime } from '../hooks/useTimer';

const LEVELS = [
  { label: 'Tokens', color: 'bg-L1' },
  { label: 'Context', color: 'bg-L2' },
  { label: 'Hallucinations', color: 'bg-L3' },
];

export default function Header({ level, elapsed }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/80 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3.5 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex w-7 h-7 rounded-lg bg-ink text-cream items-center justify-center text-sm font-bold">⚡</span>
          <span className="font-display font-bold text-[15px] tracking-tight">FM AI Sprint</span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-line" />

        <div className="hidden sm:flex items-baseline gap-1.5 text-[13px] text-muted shrink-0">
          <span>L</span>
          <span className="text-ink font-bold tabular-nums font-mono">{level}</span>
          <span>/3</span>
          <span className="text-soft px-1">·</span>
          <span className="font-medium text-ink/80">{LEVELS[level - 1].label}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1.5 text-[12px] font-mono font-bold text-ink tabular-nums bg-white border border-line rounded-lg px-2.5 py-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-L3 animate-pulse" />
          <span>{formatTime(elapsed)}</span>
        </div>

        <div className="flex gap-1.5 w-28 sm:w-40 shrink-0">
          {LEVELS.map((l, i) => {
            const idx = i + 1;
            const filled = idx <= level;
            return (
              <div key={i} className="h-2 flex-1 rounded-full bg-line overflow-hidden relative">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: filled ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`absolute inset-0 origin-left rounded-full ${l.color}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
