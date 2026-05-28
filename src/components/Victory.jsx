import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { formatTime } from '../hooks/useTimer';

const VICTORY_CODE = 'FM-AI-SECURED';
const PALETTE = ['#7C3AED', '#F97316', '#E11D48', '#65A30D', '#0A0A12'];

function fireConfetti() {
  confetti({
    particleCount: 160,
    spread: 80,
    origin: { y: 0.5 },
    colors: PALETTE,
    scalar: 1.15,
  });
  setTimeout(() =>
    confetti({
      particleCount: 100,
      spread: 110,
      angle: 60,
      origin: { x: 0, y: 0.7 },
      colors: PALETTE,
    }), 220);
  setTimeout(() =>
    confetti({
      particleCount: 100,
      spread: 110,
      angle: 120,
      origin: { x: 1, y: 0.7 },
      colors: PALETTE,
    }), 420);
  setTimeout(() =>
    confetti({
      particleCount: 80,
      spread: 360,
      startVelocity: 28,
      origin: { y: 0.4 },
      colors: PALETTE,
      scalar: 0.75,
    }), 700);
}

export default function Victory({ elapsedMs = 0 }) {
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
    <div className="pt-8 sm:pt-12 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 12 }}
        className="text-7xl sm:text-8xl mb-4 inline-block"
      >
        🏆
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="inline-block px-3 py-1.5 rounded-full border border-line bg-white/80 backdrop-blur text-[11px] font-semibold uppercase tracking-[0.25em] text-muted mb-4"
      >
        ✨ Sprint Complete ✨
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="font-display text-4xl sm:text-6xl font-bold tracking-tight mb-2 leading-[1.02]"
      >
        Show this screen
        <br />
        to the facilitator
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="flex items-center justify-center gap-2.5 text-sm text-muted mb-8"
      >
        <span>Finished in</span>
        <span className="font-mono text-base font-bold text-ink tabular-nums px-2.5 py-1 rounded-md bg-white border border-line shadow-sm">
          {formatTime(elapsedMs, true)}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 180, damping: 16 }}
        className="card-strong inline-block px-8 sm:px-16 py-7 sm:py-10 mb-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-L1/8 via-L2/5 to-L3/8 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-L1 via-L2 to-L3" />
        <div className="relative">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-soft mb-3">
            Victory Code
          </div>
          <div className={`font-mono font-extrabold text-3xl sm:text-6xl tracking-[0.1em] text-ink select-all ${reveal ? 'glitch-once' : ''}`}>
            {VICTORY_CODE}
          </div>
          <button
            onClick={copyCode}
            className="mt-4 text-xs text-muted hover:text-ink transition inline-flex items-center gap-1.5 underline underline-offset-4 decoration-line hover:decoration-ink"
          >
            <span>{copied ? '✓ Copied' : '📋 Copy code'}</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-strong max-w-md mx-auto p-5 text-left mb-6 border-2 border-win/30"
      >
        <div className="flex gap-4 items-start">
          <motion.div
            animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.6 }}
            className="text-4xl leading-none"
          >
            🙋
          </motion.div>
          <div className="flex-1">
            <div className="font-display font-bold text-ink text-lg mb-1">
              Raise your hand now!
            </div>
            <div className="text-sm text-muted leading-relaxed">
              Shout{' '}
              <span className="font-mono font-bold text-ink">
                "FM-AI-SECURED!"
              </span>{' '}
              and claim <strong className="text-win">1st place</strong>.
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center justify-center gap-2 text-xs text-soft uppercase tracking-[0.18em] mb-6"
      >
        <span>🥇 Be first</span>
        <span className="text-line">·</span>
        <span>📢 Shout the phrase</span>
        <span className="text-line">·</span>
        <span>🏆 Win the sprint</span>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        onClick={fireConfetti}
        className="text-xs text-muted hover:text-ink transition underline underline-offset-4 decoration-line hover:decoration-ink"
      >
        🎊 More confetti
      </motion.button>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        className="mt-12 pt-8 border-t border-line/70 flex flex-col items-center"
      >
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-soft mb-3">
          Workshop by
        </div>
        <img
          src="/np-logo.png"
          alt="Ngee Ann Polytechnic"
          className="h-10 w-auto opacity-90"
        />
      </motion.div>
    </div>
  );
}
