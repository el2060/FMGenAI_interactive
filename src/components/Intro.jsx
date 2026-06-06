import { motion } from 'framer-motion';
import { PrimaryButton, LEVEL_META, CHAPTERS, BG_COLORS, TEXT_COLORS } from './Common';

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
        <img src="https://www.np.edu.sg/_next/image?url=https%3A%2F%2Fassets.app.optical.gov.sg%2Fnp%2Fproduction%2Fpublished%2Fcollections%2Fpages%2F17c64bb4-8632-49e9-af16-047f7cabe99a%2Fab16008f-a6a0-466e-9193-e16e947261b0.png&w=1080&q=75" alt="Ngee Ann Polytechnic" className="h-7 sm:h-9 w-auto opacity-80" />
      </motion.div>

      <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-8">
        Intro to Gen AI
      </h1>



      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card max-w-3xl mx-auto p-4 sm:p-5 mb-10 text-left"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {CHAPTERS.map((ch, ci) => {
            const headColor = LEVEL_META[ch.levels[0]].color;
            return (
              <div
                key={ch.n}
                className="rounded-2xl border border-line bg-white shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex flex-col group hover:-translate-y-1"
              >
                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded ${BG_COLORS[headColor]} text-white tracking-wider`}>
                    CH {ch.n}
                  </span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-soft">{ch.subtitle}</span>
                </div>
                <div className="font-display font-bold text-[16px] leading-tight mb-4 text-ink">{ch.title}</div>
                <div className="flex flex-col gap-1.5 mt-auto">
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
                        <span className={`font-semibold text-[11.5px] ${TEXT_COLORS[m.color]} leading-tight`}>{m.name}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
