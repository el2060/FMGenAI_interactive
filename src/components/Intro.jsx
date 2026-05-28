import { motion } from 'framer-motion';
import { PrimaryButton, LEVEL_META, CHAPTERS, BG_COLORS, TEXT_COLORS } from './Common';
import { SgSkyline } from './SgVisuals';

export default function Intro({ onStart }) {
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
        <span>For FM teams · JTC & Singapore agencies</span>
      </div>

      <h1 className="font-display text-[40px] leading-[1.04] sm:text-6xl font-bold tracking-tight mb-4">
        Generative AI,
        <br />
        <span className="shimmer-text">made practical for FM.</span>
      </h1>

      <p className="text-muted max-w-xl mx-auto mb-2 text-[15.5px] leading-relaxed">
        A self-paced workshop in <span className="font-semibold text-ink">seven short levels</span>{' '}
        across <span className="font-semibold text-ink">three chapters</span>. Type, drag, slide,
        click and match your way through real Singapore FM scenarios. Learn by doing.
      </p>
      <p className="text-soft text-[13px] mb-6">
        Take as long as you need on each level. There's no clock.
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left">
        {CHAPTERS.map((ch, i) => (
          <motion.div
            key={ch.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + i * 0.07 }}
            className="card p-5 flex flex-col"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-soft font-mono">
                Ch {ch.n}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-soft">· {ch.subtitle}</div>
            </div>
            <div className="font-display font-bold text-[17px] leading-tight mb-3">{ch.title}</div>
            <div className="space-y-1.5 mt-auto">
              {ch.levels.map((lvl) => {
                const m = LEVEL_META[lvl];
                return (
                  <div key={lvl} className="flex items-center gap-2 text-[12.5px]">
                    <span className={`w-5 h-5 rounded ${BG_COLORS[m.color]} text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0`}>
                      {lvl}
                    </span>
                    <span className="text-base">{m.emoji}</span>
                    <span className={`font-semibold ${TEXT_COLORS[m.color]}`}>{m.name}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card max-w-2xl mx-auto p-5 text-left mb-10">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted mb-3">📚 How this works</div>
        <div className="grid sm:grid-cols-3 gap-4 text-[13.5px]">
          <div>
            <div className="font-semibold text-ink mb-1">1. Read the concept</div>
            <div className="text-muted leading-relaxed">Every level opens with a short plain-English explainer.</div>
          </div>
          <div>
            <div className="font-semibold text-ink mb-1">2. Try the interaction</div>
            <div className="text-muted leading-relaxed">Type, drag, click or slide your way through real FM scenarios.</div>
          </div>
          <div>
            <div className="font-semibold text-ink mb-1">3. Lock in the takeaway</div>
            <div className="text-muted leading-relaxed">Each level closes with what to remember and how to apply it.</div>
          </div>
        </div>
      </div>

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
