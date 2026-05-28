import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokenSegments } from '../utils/tokenize';
import { Eyebrow, Tip, PrimaryButton } from './Common';

const SAMPLE =
  'Aircon compressor at Block 71 requires top-up of R410A refrigerant and filter replacement.';
const TARGET = 25;
const COST_PER_TOKEN = 0.000003;

export default function LevelTokenizer({ onComplete }) {
  const [text, setText] = useState('');
  const segs = useMemo(() => tokenSegments(text), [text]);
  const tokens = segs.filter((s) => s.kind === 'tok');
  const tokenCount = tokens.length;
  const done = tokenCount === TARGET;
  const over = tokenCount > TARGET;
  const fillPct = Math.min(100, (tokenCount / TARGET) * 100);
  const cost = (tokenCount * COST_PER_TOKEN).toFixed(6);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-L1 text-white flex items-center justify-center font-mono font-bold text-sm shadow-pop">01</div>
        <Eyebrow color="text-L1">Level 1 of 3 · The Tokenizer</Eyebrow>
      </div>

      <h2 className="font-display text-3xl sm:text-[40px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI doesn't read words. <span className="text-L1">It reads tokens.</span>
      </h2>
      <p className="text-muted mb-8 leading-relaxed text-[15.5px] max-w-xl">
        Every token costs compute, time and money. Write a real FM update that
        lands at <span className="font-semibold text-ink">exactly {TARGET}</span> tokens.
      </p>

      <div className="card-strong p-5 sm:p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Live Token Preview
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-L1 animate-pulse" />
            <span>1 token ≈ ~4 chars</span>
          </div>
        </div>
        <div className="min-h-[110px] p-3.5 rounded-xl bg-cream border border-line text-[15px] leading-[2.1]">
          {segs.length === 0 ? (
            <span className="text-soft italic">
              Tokens will appear as coloured chips when you type below…
            </span>
          ) : (
            segs.map((s, i) =>
              s.kind === 'ws' ? (
                <span key={i}>{' '}</span>
              ) : (
                <motion.span
                  key={`${s.idx}-${s.text}`}
                  initial={{ opacity: 0, y: -6, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className={`tok-chip tok-${s.idx % 7}`}
                >
                  {s.text}
                </motion.span>
              )
            )
          )}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Try typing: ${SAMPLE}`}
        rows={3}
        className="w-full p-4 rounded-xl border border-line bg-white focus:outline-none focus:border-L1 focus:ring-4 focus:ring-L1/10 text-[15px] leading-relaxed resize-none transition shadow-sm"
      />

      <div className="grid sm:grid-cols-3 gap-3 mt-5">
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-1">
            Tokens
          </div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={tokenCount}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`font-mono text-3xl font-extrabold tabular-nums ${
                done ? 'text-win' : over ? 'text-L3' : 'text-ink'
              }`}
            >
              {tokenCount}
            </motion.span>
            <span className="text-soft text-sm font-mono">/ {TARGET}</span>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-1">
            Est. Cost (GPT-4o)
          </div>
          <div className="font-mono text-3xl font-extrabold tabular-nums">
            ${cost}
          </div>
        </div>
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-2">
            Budget Used
          </div>
          <div className="h-3 rounded-full bg-line overflow-hidden">
            <motion.div
              animate={{ width: `${fillPct}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className={`h-full rounded-full ${
                done ? 'bg-win' : over ? 'bg-L3' : 'bg-L1'
              }`}
            />
          </div>
          <div className="mt-1.5 text-[11px] font-mono text-soft tabular-nums">
            {Math.round(fillPct)}%
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
        <AnimatePresence mode="wait">
          {done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-win font-semibold text-sm"
            >
              <span className="w-6 h-6 rounded-full bg-win text-white text-xs flex items-center justify-center">✓</span>
              Bullseye — exactly {TARGET} tokens
            </motion.div>
          )}
          {over && (
            <motion.div
              key="over"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-L3 font-semibold text-sm"
            >
              <span className="text-base">✂️</span>
              Over budget — trim {tokenCount - TARGET}
            </motion.div>
          )}
          {!done && !over && tokenCount > 0 && (
            <motion.div
              key="short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-muted text-sm"
            >
              {TARGET - tokenCount} more to go…
            </motion.div>
          )}
          {tokenCount === 0 && <div key="empty" />}
        </AnimatePresence>
        <PrimaryButton onClick={onComplete} disabled={!done} accent="L1">
          Next Level →
        </PrimaryButton>
      </div>

      <Tip accent="L1">
        <span className="font-semibold text-ink">Why it matters:</span> FM
        jargon like <em>"refrigerant"</em> or <em>"replacement"</em> burns more
        tokens than short words. Tight prompts = faster responses + lower bills.
      </Tip>
    </div>
  );
}
