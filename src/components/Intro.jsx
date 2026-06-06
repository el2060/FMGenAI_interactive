import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { PrimaryButton, LEVEL_META, CHAPTERS } from './Common';

export default function Intro({ onStart, onJump, completed = [] }) {
  const totalLevels = CHAPTERS.reduce((sum, ch) => sum + ch.levels.length, 0);
  return (
    <div className="pt-2 sm:pt-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center mb-8"
      >
        <img src={`${import.meta.env.BASE_URL}np-logo.png`} alt="Ngee Ann Polytechnic" className="h-7 sm:h-9 w-auto opacity-80" />
      </motion.div>

      <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-10 text-zinc-900">
        Intro to Gen AI
      </h1>



      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card max-w-3xl mx-auto p-5 sm:p-8 mb-12 text-left"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {CHAPTERS.map((ch, ci) => {
            const isChapterDone = ch.levels.every((l) => completed.includes(l));
            const headColor = LEVEL_META[ch.levels[0]].color;
            return (
              <div
                key={ch.n}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all p-5 sm:p-7 flex flex-col group hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 tracking-wider">
                    CH {ch.n}
                  </span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{ch.subtitle}</span>
                  {isChapterDone && (
                    <span className="ml-auto flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                      <CheckCircle2 size={10} strokeWidth={3} /> COMPLETED
                    </span>
                  )}
                </div>
                <div className="font-display font-bold text-xl leading-tight mb-5 text-zinc-900">{ch.title}</div>
                <div className="flex flex-col gap-2 mt-auto">
                  {ch.levels.map((lvl) => {
                    const m = LEVEL_META[lvl];
                    const Icon = m.icon;
                    return (
                      <motion.button
                        key={lvl}
                        onClick={() => onJump(lvl)}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ delay: 0.25 + ci * 0.06 + lvl * 0.02 }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 hover:bg-zinc-50 text-left cursor-pointer group"
                      >
                        <span className="w-4 h-4 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono font-bold text-[9px] flex items-center justify-center shrink-0">
                          {lvl}
                        </span>
                        <span className="text-zinc-500 shrink-0"><Icon size={14} strokeWidth={2.5} /></span>
                        <span className="font-semibold text-[13px] text-zinc-900 leading-tight flex-1">{m.name}</span>
                        {completed.includes(lvl) && (
                          <CheckCircle2 size={16} strokeWidth={2.5} className="text-green-600 shrink-0" />
                        )}
                      </motion.button>
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
        <PrimaryButton onClick={onStart} className="px-10 h-14 text-[17px] font-bold">
          Begin Chapter 1 →
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
