import { motion } from 'framer-motion';
import { PrimaryButton } from './Common';

const ICONS = ['🏗️', '⚡', '🏢', '🤖'];

export default function Intro({ onStart }) {
  return (
    <div className="pt-8 sm:pt-12 text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="flex justify-center gap-2 mb-6"
      >
        {ICONS.map((c, i) => (
          <motion.span
            key={i}
            variants={{
              hidden: { opacity: 0, y: 14, rotate: -10 },
              visible: { opacity: 1, y: 0, rotate: 0 },
            }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="text-4xl sm:text-5xl"
          >
            {c}
          </motion.span>
        ))}
      </motion.div>

      <div className="inline-block px-3 py-1.5 rounded-full border border-line bg-white/80 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-5">
        ⏱ 5–10 min · 3 levels · 1 winner
      </div>

      <h1 className="font-display text-[44px] leading-[1.02] sm:text-6xl font-bold tracking-tight mb-4">
        Sprint your way through
        <br />
        <span className="shimmer-text">Generative AI basics</span>
      </h1>

      <p className="text-muted max-w-md mx-auto mb-10 text-[15.5px] leading-relaxed">
        A hands-on race built for FM teams across JTC and Singapore agencies.
        Type, drag, click — no quizzes, no jargon. First to finish takes the
        crown.
      </p>

      <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-10">
        {[
          { bg: 'bg-L1', emoji: '🔤', label: 'Tokens', sub: 'How AI reads text' },
          { bg: 'bg-L2', emoji: '⚓', label: 'Context', sub: 'Anchor great prompts' },
          { bg: 'bg-L3', emoji: '🎯', label: 'Hallucinations', sub: 'Catch dangerous AI' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.06 }}
            className="card p-4 text-left"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-6 h-6 rounded-md ${s.bg} text-white font-mono font-bold text-[11px] flex items-center justify-center`}>
                {i + 1}
              </div>
              <div className="font-semibold text-[14px]">{s.label}</div>
              <div className="ml-auto text-lg">{s.emoji}</div>
            </div>
            <div className="text-[12.5px] text-muted leading-snug">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <PrimaryButton onClick={onStart} className="px-9 py-4 text-base">
          Start the Sprint →
        </PrimaryButton>
        <p className="mt-4 text-[12px] text-soft uppercase tracking-[0.18em]">
          Timer starts the moment you click
        </p>
      </motion.div>
    </div>
  );
}
