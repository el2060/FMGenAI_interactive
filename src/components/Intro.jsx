import { motion } from 'framer-motion';
import { PrimaryButton, LEVEL_META, CHAPTERS, BG_COLORS, TEXT_COLORS } from './Common';
import { SgSkyline } from './SgVisuals';

export default function Intro({ onStart }) {
  const totalLevels = CHAPTERS.reduce((sum, ch) => sum + ch.levels.length, 0);
  return (
    <div className="pt-2 sm:pt-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-soft mb-3">
          A learning workshop by
        </div>
        <img src="/np-logo.png" alt="Ngee Ann Polytechnic" className="h-12 sm:h-14 w-auto" />
      </motion.div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-line bg-white/80 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-5">
        <span>🇸🇬</span>
        <span>For Singapore FM teams</span>
      </div>

      <h1 className="font-display text-[40px] leading-[1.04] sm:text-6xl font-bold tracking-tight mb-4">
        Generative AI,
        <br />
        <span className="shimmer-text">made practical for FM.</span>
      </h1>

      <p className="text-muted max-w-md mx-auto mb-6 text-[15.5px] leading-relaxed">
        {totalLevels} bite-sized levels. <span className="font-semibold text-ink">Learn by doing.</span>
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative mb-10 max-w-2xl mx-auto"
      >
        <SgSkyline className="w-full h-auto opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-cream to-transparent pointer-events-none" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card max-w-3xl mx-auto p-4 sm:p-5 mb-10 text-left"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {CHAPTERS.map((ch, ci) => {
            const headColor = LEVEL_META[ch.levels[0]].color;
            return (
              <div
                key={ch.n}
                className="rounded-xl border border-line bg-cream/50 p-3 flex flex-col"
              >
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${BG_COLORS[headColor]} text-white tracking-wider`}>
                    CH {ch.n}
                  </span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-soft">{ch.subtitle}</span>
                </div>
                <div className="font-display font-bold text-[14px] leading-tight mb-3 text-ink">{ch.title}</div>
                <div className="flex flex-col gap-1 mt-auto">
                  {ch.levels.map((lvl) => {
                    const m = LEVEL_META[lvl];
                    return (
                      <motion.div
                        key={lvl}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + ci * 0.06 + lvl * 0.02 }}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-white border border-line/70"
                      >
                        <span className={`w-4 h-4 rounded ${BG_COLORS[m.color]} text-white font-mono font-bold text-[9px] flex items-center justify-center shrink-0`}>
                          {lvl}
                        </span>
                        <span className="text-[12px] shrink-0">{m.emoji}</span>
                        <span className={`font-semibold text-[11px] ${TEXT_COLORS[m.color]} truncate`}>{m.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-5 sm:gap-7 mt-4 pt-3.5 border-t border-line/70 text-[12px] text-muted">
          <span className="flex items-center gap-1.5"><span>💡</span><span className="font-semibold text-ink">Read</span></span>
          <span className="text-soft">→</span>
          <span className="flex items-center gap-1.5"><span>🎮</span><span className="font-semibold text-ink">Try</span></span>
          <span className="text-soft">→</span>
          <span className="flex items-center gap-1.5"><span>🎯</span><span className="font-semibold text-ink">Lock in</span></span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PrimaryButton onClick={onStart} className="px-9 py-4 text-base">
          Begin Chapter 1 →
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
