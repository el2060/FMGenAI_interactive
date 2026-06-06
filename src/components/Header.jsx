import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_META, CHAPTERS } from './Common';

export default function Header({ level, onHome, onJump }) {
  const meta = LEVEL_META[level];
  const [confirming, setConfirming] = useState(false);

  function handleHome() {
    if (confirming) {
      setConfirming(false);
      onHome?.();
      return;
    }
    setConfirming(true);
    setTimeout(() => setConfirming(false), 2500);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-3 sm:gap-4">
        {/* Brand — click to go home */}
        <button
          onClick={handleHome}
          className="group flex items-center gap-2 shrink-0 rounded-lg px-1.5 py-1 -ml-1.5 hover:bg-ink/[0.04] active:bg-ink/[0.07] transition"
          title={confirming ? 'Click again to confirm — restart module' : 'Restart module'}
        >
          <img src="/np-logo.png" alt="NP" className="h-6 w-auto" />
          <div className="hidden sm:block h-4 w-px bg-line" />
          <span className="hidden sm:inline font-display font-bold text-[14px] tracking-tight text-ink group-hover:text-ink/70 transition">
            Gen AI for FM
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 ml-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-soft group-hover:text-ink/70 transition">
            <span>↺</span>
            <AnimatePresence mode="wait">
              {confirming ? (
                <motion.span
                  key="confirm"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  className="text-red-500"
                >
                  Confirm?
                </motion.span>
              ) : (
                <motion.span
                  key="home"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                >
                  Home
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </button>

        {/* Current chapter + level — clickable dropdown for level jumping */}
        <div className="hidden md:flex items-baseline gap-1.5 text-[12px] text-zinc-500 shrink-0">
          <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-zinc-100 border border-zinc-200 text-zinc-900 text-[10px]">CH{meta.chapter}</span>
          <span className="font-medium text-zinc-800">{meta.chapterTitle}</span>
          <span className="text-zinc-400 px-1">·</span>
          <span className="text-zinc-400">{meta.name}</span>
        </div>

        <div className="flex-1" />

        {/* Chapter-grouped progress with optional jump */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {CHAPTERS.map((ch) => (
            <div key={ch.n} className="flex gap-1">
              {ch.levels.map((lvl) => {
                const filled = lvl <= level;
                const isCurrent = lvl === level;
                const m = LEVEL_META[lvl];
                const clickable = !!onJump;
                return (
                  <button
                    key={lvl}
                    onClick={clickable ? () => onJump(lvl) : undefined}
                    disabled={!clickable}
                    title={`L${lvl} · ${m.name}`}
                    className={`h-2.5 w-3 sm:w-5 rounded-full bg-line overflow-hidden relative ${
                      clickable ? 'cursor-pointer hover:scale-110 hover:shadow-md transition-transform' : 'cursor-default'
                    } ${isCurrent ? 'ring-2 ring-offset-1 ring-ink/20' : ''}`}
                  >
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: filled ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-0 origin-left rounded-full bg-zinc-800"
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
