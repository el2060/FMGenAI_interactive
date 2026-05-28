import { motion } from 'framer-motion';
import { LEVEL_META, CHAPTERS, BG_COLORS } from './Common';

export default function Header({ level }) {
  const meta = LEVEL_META[level];
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3.5 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <img src="/np-logo.png" alt="NP" className="h-6 w-auto" />
          <div className="hidden sm:block h-4 w-px bg-line" />
          <span className="hidden sm:inline font-display font-bold text-[14px] tracking-tight">Gen AI for FM</span>
        </div>

        <div className="hidden md:flex items-baseline gap-1.5 text-[12px] text-muted shrink-0 ml-2">
          <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-white text-[10px] ${BG_COLORS[meta.color]}`}>CH{meta.chapter}</span>
          <span className="font-medium text-ink/80">{meta.chapterTitle}</span>
          <span className="text-soft px-1">·</span>
          <span className="text-soft">{meta.name}</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2.5 shrink-0">
          {CHAPTERS.map((ch) => (
            <div key={ch.n} className="flex gap-1">
              {ch.levels.map((lvl) => {
                const filled = lvl <= level;
                const m = LEVEL_META[lvl];
                return (
                  <div key={lvl} className="h-2 w-3 sm:w-5 rounded-full bg-line overflow-hidden relative">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: filled ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`absolute inset-0 origin-left rounded-full ${BG_COLORS[m.color]}`}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
