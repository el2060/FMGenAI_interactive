import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { LEVEL_META, BG_COLORS, TEXT_COLORS } from './Common';

const VICTORY_CODE = 'FM-AI-SECURED';
const PALETTE = ['#7C3AED', '#EC4899', '#F97316', '#14B8A6', '#4F46E5', '#E11D48', '#65A30D'];

function fireConfetti() {
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.5 }, colors: PALETTE, scalar: 1.15 });
  setTimeout(() => confetti({ particleCount: 100, spread: 110, angle: 60, origin: { x: 0, y: 0.7 }, colors: PALETTE }), 220);
  setTimeout(() => confetti({ particleCount: 100, spread: 110, angle: 120, origin: { x: 1, y: 0.7 }, colors: PALETTE }), 420);
  setTimeout(() => confetti({ particleCount: 80, spread: 360, startVelocity: 28, origin: { y: 0.4 }, colors: PALETTE, scalar: 0.75 }), 700);
}

const TAKEAWAYS = [
  { lvl: 1, line: 'Gen AI is one slice. Pick the right brain for the job.' },
  { lvl: 2, line: 'Tokens = currency. Tight prompts are cheap and fast.' },
  { lvl: 3, line: 'Cool temperatures for FM ops. Warm only for brainstorming.' },
  { lvl: 4, line: 'Anchor every prompt: audience, tone, details.' },
  { lvl: 5, line: 'Ground AI with clean FM docs. Curate or it poisons.' },
  { lvl: 6, line: 'Strip identifiers, keep context. PDPA still applies.' },
  { lvl: 7, line: 'Confidence ≠ correctness. Always verify.' },
];

export default function Victory({ onRestart }) {
  const [copied, setCopied] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    fireConfetti();
    const t = setTimeout(() => setReveal(true), 350);
    return () => clearTimeout(t);
  }, []);

  function copyCode() {
    navigator.clipboard?.writeText(VICTORY_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="pt-6 sm:pt-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 12 }}
        className="text-6xl sm:text-7xl mb-4 inline-block"
      >
        🎓
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="inline-block px-3 py-1.5 rounded-full border border-line bg-white/80 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.25em] text-muted mb-4">
        ✨ Workshop Complete ✨
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="font-display text-3xl sm:text-5xl font-bold tracking-tight mb-3 leading-[1.04]">
        You've covered the
        <br />
        <span className="shimmer-text">seven AI foundations</span>
      </motion.h1>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        className="text-muted text-[15px] max-w-md mx-auto mb-8">
        Steady lah. You can now pick the right AI for the job, and use Gen AI safely in FM.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 16 }}
        className="card-strong inline-block px-8 sm:px-14 py-6 sm:py-8 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-L1/8 via-L3/5 to-L6/8 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-L1 via-L2 via-L3 via-L4 via-L5 to-L6" />
        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-soft mb-3">Completion Badge</div>
          <div className={`font-mono font-extrabold text-3xl sm:text-5xl tracking-[0.1em] text-ink select-all ${reveal ? 'glitch-once' : ''}`}>
            {VICTORY_CODE}
          </div>
          <button onClick={copyCode} className="mt-4 text-xs text-muted hover:text-ink transition inline-flex items-center gap-1.5 underline underline-offset-4 decoration-line hover:decoration-ink">
            <span>{copied ? '✓ Copied' : '📋 Copy code'}</span>
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="card max-w-md mx-auto p-5 text-left mb-6">
        <div className="flex gap-3 items-start">
          <div className="text-2xl">🙋</div>
          <div className="flex-1">
            <div className="font-display font-bold text-ink text-[15px] mb-1">Show this screen to the facilitator</div>
            <div className="text-[13px] text-muted leading-relaxed">
              The completion code <span className="font-mono font-semibold text-ink">FM-AI-SECURED</span> confirms you've worked through all seven levels.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        className="card-strong max-w-2xl mx-auto p-5 text-left mb-8">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted mb-4">📌 What you covered</div>
        <div className="space-y-2.5">
          {TAKEAWAYS.map((t) => {
            const m = LEVEL_META[t.lvl];
            return (
              <div key={t.lvl} className="flex gap-3 items-start">
                <span className={`shrink-0 w-7 h-7 rounded-md ${BG_COLORS[m.color]} text-white font-mono font-bold text-[11px] flex items-center justify-center`}>
                  L{t.lvl}
                </span>
                <div className="flex-1">
                  <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${TEXT_COLORS[m.color]} mb-0.5`}>
                    {m.emoji} {m.name}
                  </div>
                  <div className="text-[13.5px] text-ink/85 leading-snug">{t.line}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }}
        className="flex items-center justify-center gap-3 mb-10 flex-wrap">
        <button onClick={fireConfetti} className="text-[13px] text-muted hover:text-ink transition underline underline-offset-4 decoration-line hover:decoration-ink">
          🎊 Replay confetti
        </button>
        <span className="text-line">·</span>
        <button onClick={onRestart} className="text-[13px] text-muted hover:text-ink transition underline underline-offset-4 decoration-line hover:decoration-ink">
          ↺ Restart workshop
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        className="pt-8 border-t border-line/70 flex flex-col items-center">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-soft mb-3">Workshop by</div>
        <img src="/np-logo.png" alt="Ngee Ann Polytechnic" className="h-10 w-auto opacity-90" />
      </motion.div>
    </div>
  );
}
