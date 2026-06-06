import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton } from './Common';
import { Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';

const HALLUCINATIONS = ['h1', 'h2', 'h3'];

const RESPONSE = [
  { text: "Hi! I've reviewed the chilled water plant efficiency drop you reported at Block 71. Here are the recommended diagnostic steps:\n\n" },
  { text: '1. ' },
  { text: 'Verify chilled water supply and return temperatures against design conditions (typically 7°C supply, 12.5°C return).\n' },
  { text: '2. ' },
  { text: 'Check the condenser approach temperature — values above 4°C usually indicate tube fouling.\n' },
  { text: '3. ' },
  { id: 'h1', text: 'Mix household bleach directly into the cooling tower basin to instantly clear algae buildup.', why: 'Toxic & corrosive', correction: 'NEVER add household bleach. It corrodes copper, brass and stainless steel — destroying tower fill, condenser tubes and pumps. Use only approved biocides dosed by certified water-treatment vendors.' },
  { text: '\n4. ' },
  { text: 'Inspect strainers and clean them if differential pressure exceeds the OEM threshold.\n' },
  { text: '5. ' },
  { id: 'h2', text: 'Temporarily bypass the BCA-mandated safety pressure relief valve to maintain steady flow during testing.', why: 'Fabricated authority + unsafe', correction: 'BCA does not mandate a specific "pressure relief valve" — the regulation is fabricated. Bypassing any safety valve is illegal under SS 530 / BCA regulations and risks catastrophic pressure-vessel failure.' },
  { text: '\n6. ' },
  { text: 'Review compressor amp readings against the nameplate full-load amps for each stage.\n' },
  { text: '7. ' },
  { id: 'h3', text: 'Set the chilled water supply temperature to -5°C for maximum cooling efficiency.', why: 'Will rupture the system', correction: 'Chilled water at -5°C freezes inside the evaporator and ruptures the tubes. Design supply is around 6–7°C; going colder destroys equipment without saving any energy.' },
  { text: '\n8. Schedule annual eddy-current testing for the evaporator tubes.\n\nLet me know which step you would like to begin with.' },
];

export default function LevelHallucinationHunt({ onComplete }) {
  const [found, setFound] = useState({});
  const [revealed, setRevealed] = useState([]);
  const allFound = HALLUCINATIONS.every((k) => found[k]);

  function handleClick(seg) {
    if (!seg.id || found[seg.id]) return;
    setFound((f) => ({ ...f, [seg.id]: true }));
    setRevealed((r) => [...r, seg]);
  }

  return (
    <div>
      <LevelHeader level={10} />
      <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight mb-4 leading-[1.05] text-zinc-900">
        AI is confident. <span className="text-zinc-500">Sometimes wrong.</span>
      </h2>

      <p className="text-zinc-500 text-[17px] max-w-2xl mb-10 leading-relaxed">
        Find and click the 3 hallucinated, dangerous facts in the AI's response.
      </p>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-0 mb-5 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center gap-3 bg-zinc-50">
          <div className="w-9 h-9 rounded-md bg-zinc-800 text-white flex items-center justify-center shadow-sm">
            <Bot size={18} />
          </div>
          <div>
            <div className="text-[13.5px] font-semibold leading-tight text-zinc-900">FM-GPT Assistant</div>
            <div className="text-[11px] text-zinc-500">Troubleshooting · Chiller Plant Efficiency</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-600 bg-white px-2.5 py-1 rounded-md border border-zinc-200 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="uppercase tracking-wider">Confident</span>
          </div>
        </div>
        <div className="p-5 sm:p-6 text-[15px] leading-[1.85] whitespace-pre-wrap text-zinc-800">
          {RESPONSE.map((seg, i) => {
            if (!seg.id) return <span key={i}>{seg.text}</span>;
            const isFound = !!found[seg.id];
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                disabled={isFound}
                onClick={() => handleClick(seg)}
                className={`inline text-left align-baseline px-1.5 -mx-1 py-0.5 rounded transition-all ${
                  isFound ? 'bg-red-50 text-red-600 line-through decoration-red-300' : 'cursor-pointer hover:bg-zinc-100 border border-transparent hover:border-zinc-200 hover:shadow-sm'
                }`}
              >
                {seg.text}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {revealed.length > 0 && (
          <div className="space-y-2.5 mb-5">
            {revealed.map((seg) => (
              <motion.div
                key={seg.id}
                initial={{ opacity: 0, x: 30, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="rounded-md border border-red-200 bg-red-50 p-4 flex gap-3 shadow-sm"
              >
                <div className="shrink-0 w-8 h-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-red-700">Hallucination caught</div>
                    <div className="text-[10px] font-semibold text-red-600 bg-white border border-red-100 px-2 py-0.5 rounded-sm">{seg.why}</div>
                  </div>
                  <div className="text-[13px] text-red-900 leading-relaxed">{seg.correction}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-zinc-500 text-[12px] font-semibold uppercase tracking-wider">Found</span>
            <motion.span key={Object.keys(found).length} initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className={`font-mono text-2xl font-extrabold tabular-nums ${allFound ? 'text-green-600' : 'text-zinc-900'}`}>
              {Object.keys(found).length}
            </motion.span>
            <span className="text-zinc-400 text-sm font-mono">/ 3</span>
          </div>
          <div className="flex gap-1.5">
            {HALLUCINATIONS.map((h) => (
              <motion.div key={h} animate={{ scale: found[h] ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.4 }} className={`w-2.5 h-2.5 rounded-full transition ${found[h] ? 'bg-red-500' : 'bg-zinc-200'}`} />
            ))}
          </div>
        </div>
      </div>

      {allFound && (
        <>
          <TakeawayCard
            application="Cross-check AI procedures with vendor manuals and engineers. Fast ≠ right."
          >
            <strong>Confidence ≠ correctness.</strong> The reasonable-sounding ones bite hardest. Verify.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Level →</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
