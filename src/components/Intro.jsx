import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { LEVEL_META, MODULES } from './Common';

export default function Intro({ onStart, onJump, completed = [] }) {
  const totalLevels = MODULES.reduce((sum, mod) => sum + mod.levels.length, 0);
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

      <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight mb-6 text-zinc-900">
        Intro to Gen AI
      </h1>

      <p className="text-zinc-500 text-[16px] sm:text-[17px] max-w-2xl mx-auto mb-10 leading-relaxed">
        Equip yourself with practical skills to use AI safely and effectively in facility management. 
        <strong> Work through the modules in sequence, or jump directly into any topic you need.</strong>
      </p>



      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card max-w-3xl mx-auto p-5 sm:p-8 mb-12 text-left"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {MODULES.map((mod, ci) => {
            const isModuleDone = mod.levels.every((l) => completed.includes(l));
            return (
              <motion.button
                key={mod.n}
                onClick={() => onJump(mod.levels[0])}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md hover:border-zinc-300 transition-all p-5 sm:p-7 flex flex-col group text-left w-full h-full"
              >
                <div className="flex items-center gap-2 mb-4 flex-wrap w-full">
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-900 tracking-wider">
                    MOD {mod.n}
                  </span>
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{mod.subtitle}</span>
                  {isModuleDone && (
                    <span className="ml-auto flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                      <CheckCircle2 size={10} strokeWidth={3} /> DONE
                    </span>
                  )}
                </div>
                <div className="font-display font-bold text-xl leading-tight mb-4 text-zinc-900">{mod.title}</div>
                <div className="mt-auto pt-2 border-t border-zinc-100 flex flex-wrap gap-2 w-full">
                  {mod.levels.map((lvl) => {
                    const m = LEVEL_META[lvl];
                    const Icon = m.icon;
                    return (
                      <div key={lvl} className="inline-flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-600">
                        <Icon size={12} strokeWidth={2.5} />
                        <span className="text-[12px] font-medium leading-tight">{m.name}</span>
                        {lvl !== mod.levels[mod.levels.length - 1] && <span className="text-zinc-300 mx-1">•</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.button>
            );
          })}
        </div>

      </motion.div>


    </div>
  );
}
