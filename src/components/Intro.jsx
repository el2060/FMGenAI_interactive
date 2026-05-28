import { motion } from 'framer-motion';
import { PrimaryButton, LEVEL_META, BG_COLORS, TEXT_COLORS } from './Common';

const CHAPTERS = [
  {
    n: 1, title: 'How AI Thinks', subtitle: 'Foundations',
    blurb: 'Understand what AI actually does under the hood — before you trust it with FM work.',
    levels: [1, 2],
  },
  {
    n: 2, title: 'How to Talk to AI', subtitle: 'Practice',
    blurb: 'Turn vague prompts into Singapore-ready outputs by anchoring AI with your context.',
    levels: [3, 4],
  },
  {
    n: 3, title: 'How to Stay Safe', subtitle: 'Defend',
    blurb: 'Protect tenants, equipment and your agency by spotting risk before it ships.',
    levels: [5, 6],
  },
];

export default function Intro({ onStart }) {
  return (
    <div className="pt-4 sm:pt-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center mb-9"
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-soft mb-3">
          A learning workshop by
        </div>
        <img src="/np-logo.png" alt="Ngee Ann Polytechnic" className="h-12 sm:h-14 w-auto" />
      </motion.div>

      <div className="inline-block px-3 py-1.5 rounded-full border border-line bg-white/80 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-5">
        🏗️ For FM teams · JTC & Singapore agencies
      </div>

      <h1 className="font-display text-[40px] leading-[1.04] sm:text-6xl font-bold tracking-tight mb-4">
        Generative AI,
        <br />
        <span className="shimmer-text">made practical for FM.</span>
      </h1>

      <p className="text-muted max-w-xl mx-auto mb-2 text-[15.5px] leading-relaxed">
        A self-paced workshop in <span className="font-semibold text-ink">six short levels</span>,
        scaffolded across three chapters. Type, drag, slide, click — no quizzes,
        no jargon, no rush.
      </p>
      <p className="text-soft text-[13px] mb-10">
        Take your time. Each level builds on the one before.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 max-w-3xl mx-auto mb-10 text-left">
        {CHAPTERS.map((ch, i) => (
          <motion.div
            key={ch.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + i * 0.08 }}
            className="card p-5 flex flex-col"
          >
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-soft font-mono">
                Chapter {ch.n}
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-soft">· {ch.subtitle}</div>
            </div>
            <div className="font-display font-bold text-[19px] leading-tight mb-2">{ch.title}</div>
            <div className="text-[13px] text-muted leading-relaxed mb-4 flex-1">{ch.blurb}</div>
            <div className="space-y-1.5">
              {ch.levels.map((lvl) => {
                const m = LEVEL_META[lvl];
                return (
                  <div key={lvl} className="flex items-center gap-2 text-[13px]">
                    <span className={`w-6 h-6 rounded-md ${BG_COLORS[m.color]} text-white font-mono font-bold text-[10.5px] flex items-center justify-center shrink-0`}>
                      L{lvl}
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <PrimaryButton onClick={onStart} className="px-9 py-4 text-base">
          Begin Chapter 1 →
        </PrimaryButton>
        <p className="mt-4 text-[12px] text-soft uppercase tracking-[0.18em]">
          ~10 minutes · Go at your own pace
        </p>
      </motion.div>
    </div>
  );
}
