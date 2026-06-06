import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

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
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI is confident. <span className="text-L10">Sometimes wrong.</span>
      </h2>

      <ConceptCard accent="L10" icon="🎯" title="AI bluffs with full conviction.">
        AI invents regulations and procedures that sound legit. Your only defence:
        a <strong>human in the loop</strong>.
      </ConceptCard>

      <p className="text-muted mb-5 text-[14.5px] leading-relaxed">
        Three steps below sound right but are{' '}
        <span className="text-L10 font-semibold">dangerously wrong</span>. Find and tap them.
      </p>

      <div className="card-strong p-0 mb-5 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-line flex items-center gap-3 bg-gradient-to-r from-ink/5 to-transparent">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-ink to-[#2a2a3a] text-white flex items-center justify-center text-[11px] font-bold shadow-pop">AI</div>
          <div>
            <div className="text-sm font-semibold leading-tight font-display">FM-GPT Assistant</div>
            <div className="text-[11px] text-muted">Troubleshooting · Chiller Plant Efficiency</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold text-win bg-win/10 px-2.5 py-1 rounded-full border border-win/20">
            <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />
            <span className="uppercase tracking-wider">Confident</span>
          </div>
        </div>
        <div className="p-5 sm:p-6 text-[15px] leading-[1.85] whitespace-pre-wrap">
          {RESPONSE.map((seg, i) => {
            if (!seg.id) return <span key={i}>{seg.text}</span>;
            const isFound = !!found[seg.id];
            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                disabled={isFound}
                onClick={() => handleClick(seg)}
                className={`inline text-left align-baseline px-1 -mx-1 py-0.5 rounded transition-all ${
                  isFound ? 'bg-L10/15 text-L10 line-through decoration-L10/60' : 'cursor-pointer hover:bg-yellow-100 hover:shadow-sm'
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
                className="rounded-xl border-2 border-L10/30 bg-gradient-to-r from-L6/5 to-transparent p-4 flex gap-3"
              >
                <div className="shrink-0 w-9 h-9 rounded-lg bg-L10 text-white flex items-center justify-center font-bold text-sm shadow-pop">⚠</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-L10">Hallucination caught</div>
                    <div className="text-[10.5px] font-semibold text-L10 bg-L10/10 px-2 py-0.5 rounded-full">{seg.why}</div>
                  </div>
                  <div className="text-[13.5px] text-ink/85 leading-relaxed">{seg.correction}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-muted text-sm">Found</span>
            <motion.span key={Object.keys(found).length} initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className={`font-mono text-2xl font-extrabold tabular-nums ${allFound ? 'text-win' : 'text-L10'}`}>
              {Object.keys(found).length}
            </motion.span>
            <span className="text-soft text-sm font-mono">/ 3</span>
          </div>
          <div className="flex gap-1.5">
            {HALLUCINATIONS.map((h) => (
              <motion.div key={h} animate={{ scale: found[h] ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.4 }} className={`w-3 h-3 rounded-full transition ${found[h] ? 'bg-L10' : 'bg-line border border-line'}`} />
            ))}
          </div>
        </div>
        <PrimaryButton onClick={onComplete} disabled={!allFound} accent="L10">🏆 Complete Workshop →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L10"
        application="Cross-check AI procedures with vendor manuals and engineers. Fast ≠ right."
      >
        <strong>Confidence ≠ correctness.</strong> The reasonable-sounding ones bite hardest. Verify.
      </TakeawayCard>
    </div>
  );
}
