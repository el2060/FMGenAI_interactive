import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const PROMPT = 'Acknowledge a tenant complaint about a faulty aircon at Block 71.';
const TARGET_MIN = 0.2;
const TARGET_MAX = 0.5;

const BANK = {
  cold: [
    'Acknowledged. Your aircon complaint at Block 71 has been logged. Our team will respond within 24 hours.',
    'Acknowledged. Your aircon complaint at Block 71 has been logged. Our team will respond within 24 hours.',
    'Acknowledged. Your aircon complaint at Block 71 has been logged. Our team will respond within 24 hours.',
  ],
  cool: [
    'Thank you for reporting the aircon fault at Block 71. We have logged your case and an FM technician will attend to it within 24 hours.',
    'We acknowledge your aircon complaint at Block 71. Our technician has been dispatched and will follow up by tomorrow.',
    'Noted on the faulty aircon at Block 71. The case has been raised with our HVAC team and you can expect an update within one working day.',
  ],
  warm: [
    'Hi! Thanks for flagging the aircon trouble at Block 71 — sorry for the inconvenience. We have a tech heading over and should have an update for you shortly.',
    'Hey, appreciate you letting us know about the aircon at Block 71. Already passed it to the HVAC crew. Hang tight, an update is coming your way today.',
    'Thanks for reporting the Block 71 aircon hiccup! No worries, we are already on it. Expect a tech visit by tomorrow at the latest.',
  ],
  hot: [
    'Ah, the symphony of broken air-conditioning sings a sorrowful song through Block 71! Worry not, brave tenant, for our HVAC heroes shall ride forth at dawn.',
    'Greetings, valued occupant of Block 71! Your cry against the rebellious aircon has been heard across the realm — relief is summoned!',
    'The cosmic balance of comfort has tilted at Block 71. We shall restore the gentle hum of cool air by means most mysterious and prompt.',
  ],
};

function bucket(t) {
  if (t <= 0.1) return 'cold';
  if (t <= 0.5) return 'cool';
  if (t <= 0.8) return 'warm';
  return 'hot';
}

const BUCKET_LABEL = {
  cold: { label: 'Robotic',     color: 'text-sky-600',   tint: 'bg-sky-50' },
  cool: { label: 'Professional', color: 'text-L2',        tint: 'bg-L2/5' },
  warm: { label: 'Casual',      color: 'text-L3',        tint: 'bg-L3/5' },
  hot:  { label: 'Wild',        color: 'text-L6',        tint: 'bg-L6/5' },
};

export default function LevelTemperature({ onComplete }) {
  const [temp, setTemp] = useState(0.8);
  const [locked, setLocked] = useState(false);
  const [dwellMs, setDwellMs] = useState(0);

  const inSweet = temp >= TARGET_MIN && temp <= TARGET_MAX;
  const b = bucket(temp);
  const outputs = useMemo(() => BANK[b], [b]);

  useEffect(() => {
    if (locked) return;
    if (!inSweet) { setDwellMs(0); return; }
    const start = Date.now();
    const id = setInterval(() => setDwellMs(Date.now() - start), 80);
    return () => clearInterval(id);
  }, [inSweet, locked]);

  useEffect(() => {
    if (!locked && dwellMs >= 1200) setLocked(true);
  }, [dwellMs, locked]);

  return (
    <div>
      <LevelHeader level={3} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Same prompt. <span className="text-L2">Different vibes.</span>
      </h2>

      <ConceptCard accent="L2" icon="🎲" title="Temperature is the creativity dial.">
        Low (≈0): strict and repetitive. High (≈1): creative and wild. For FM docs,
        use <strong>0.2–0.5</strong>.
      </ConceptCard>



      <div className="card p-5 mb-4 bg-white">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-soft mb-2">📝 Fixed Prompt</div>
        <div className="font-mono text-[13.5px] bg-cream rounded-lg p-3 border border-line text-ink/85">
          "{PROMPT}"
        </div>
      </div>

      <div className="card-strong p-5 sm:p-6 mb-4">
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Temperature</div>
          <div className="flex items-baseline gap-2">
            <motion.span
              key={temp.toFixed(1)}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`font-mono text-3xl font-extrabold tabular-nums ${inSweet ? 'text-win' : 'text-ink'}`}
            >
              {temp.toFixed(2)}
            </motion.span>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${BUCKET_LABEL[b].color}`}>
              {BUCKET_LABEL[b].label}
            </span>
          </div>
        </div>

        <div className="relative mb-2">
          <div
            className="absolute h-3.5 bg-win/20 border-y-2 border-win rounded pointer-events-none"
            style={{ left: `${TARGET_MIN * 100}%`, width: `${(TARGET_MAX - TARGET_MIN) * 100}%`, top: 5 }}
          />
          <input
            type="range"
            min="0" max="1" step="0.01"
            value={temp}
            onChange={(e) => setTemp(parseFloat(e.target.value))}
            disabled={locked}
            className="temp-slider w-full relative z-10"
          />
        </div>
        <div className="flex justify-between text-[10.5px] font-mono text-soft px-0.5">
          <span>0.0 · cold</span>
          <span className="text-win font-bold">sweet spot</span>
          <span>1.0 · wild</span>
        </div>

        <AnimatePresence>
          {inSweet && !locked && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 flex items-center gap-2 text-[13px] text-win font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />
              Hold for {Math.max(0, Math.ceil((1200 - dwellMs) / 100) / 10).toFixed(1)}s to lock in…
            </motion.div>
          )}
          {locked && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-3 flex items-center gap-2 text-[13px] text-win font-semibold">
              <span className="w-6 h-6 rounded-full bg-win text-white text-xs flex items-center justify-center">✓</span>
              Locked in — perfect professional setting.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-5">
        {outputs.map((o, i) => (
          <motion.div
            key={`${b}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`card p-4 ${BUCKET_LABEL[b].tint}`}
          >
            <div className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${BUCKET_LABEL[b].color}`}>
              Draft {i + 1}
            </div>
            <div className="text-[13px] text-ink leading-relaxed">{o}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={onComplete} disabled={!locked} accent="L2">Next Level →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L2"
        application="In ChatGPT/Copilot, choose 'precise' for SOPs and circulars. Avoid 'creative' for tenant comms."
      >
        <strong>Match temperature to the task.</strong> Ops = cool. Brainstorm = warm.
      </TakeawayCard>
    </div>
  );
}
