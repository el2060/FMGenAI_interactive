import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokenSegments } from '../utils/tokenize';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const SAMPLE = 'Aircon compressor at Block 71 requires top-up of R410A refrigerant and filter replacement.';
const TARGET = 25;
// Claude Opus 4.7 input pricing: USD 15 per 1M tokens → 0.000015 per token.
// Frontier-tier reasoning model; FM teams typically use Sonnet/Haiku for
// routine drafting (cheaper), but Opus is the "ceiling" reference point.
const MODEL_NAME = 'Claude Opus 4.7';
const COST_PER_TOKEN = 0.000015;

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
      <LevelHeader level={2} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI doesn't read words. <span className="text-L1">It reads tokens.</span>
      </h2>

      <ConceptCard accent="L1" icon="🧠" title="Tokens are AI's units of thought.">
        AI chops your text into <strong>tokens</strong> (~4 chars each) before reading. Every token
        burns time and money. Leaner prompts → faster, cheaper, sharper replies.
      </ConceptCard>

      <p className="text-muted mb-5 text-[14.5px] leading-relaxed">
        Type an FM update below. Aim for{' '}
        <span className="font-semibold text-ink">exactly {TARGET} tokens</span>. Watch them snap apart.
      </p>

      <div className="card-strong p-5 sm:p-6 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">Live Token Preview</div>
          <div className="flex items-center gap-1.5 text-[11px] text-soft">
            <span className="w-1.5 h-1.5 rounded-full bg-L1 animate-pulse" />
            <span>1 token ≈ ~4 chars</span>
          </div>
        </div>
        <div className="min-h-[110px] p-3.5 rounded-xl bg-cream border border-line text-[15px] leading-[2.1]">
          {segs.length === 0 ? (
            <span className="text-soft italic">Tokens will appear as coloured chips when you type below…</span>
          ) : (
            segs.map((s, i) =>
              s.kind === 'ws' ? <span key={i}>{' '}</span> : (
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
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-1">Tokens</div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={tokenCount}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={`font-mono text-3xl font-extrabold tabular-nums ${done ? 'text-win' : over ? 'text-L6' : 'text-ink'}`}
            >
              {tokenCount}
            </motion.span>
            <span className="text-soft text-sm font-mono">/ {TARGET}</span>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-1">Est. Cost ({MODEL_NAME})</div>
          <div className="font-mono text-3xl font-extrabold tabular-nums">${cost}</div>
        </div>
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-soft mb-2">Budget</div>
          <div className="h-3 rounded-full bg-line overflow-hidden">
            <motion.div
              animate={{ width: `${fillPct}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className={`h-full rounded-full ${done ? 'bg-win' : over ? 'bg-L6' : 'bg-L1'}`}
            />
          </div>
          <div className="mt-1.5 text-[11px] font-mono text-soft tabular-nums">{Math.round(fillPct)}%</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 flex-wrap gap-3">
        <AnimatePresence mode="wait">
          {done && (
            <motion.div key="done" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-win font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-win text-white text-xs flex items-center justify-center">✓</span>
              Exactly {TARGET} tokens — nicely tuned
            </motion.div>
          )}
          {over && (
            <motion.div key="over" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-L6 font-semibold text-sm">
              <span className="text-base">✂️</span>
              Over by {tokenCount - TARGET} — try trimming
            </motion.div>
          )}
          {!done && !over && tokenCount > 0 && (
            <motion.div key="short" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-muted text-sm">
              {TARGET - tokenCount} more to go…
            </motion.div>
          )}
          {tokenCount === 0 && <div key="empty" />}
        </AnimatePresence>
        <PrimaryButton onClick={onComplete} disabled={!done} accent="L1">Next Level →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L1"
        application="Skip 'please' and 'kindly.' Lead with the block, equipment and action. AI doesn't have feelings — save the tokens."
      >
        <strong>Tokens = AI currency.</strong> Concise prompts = cheaper, faster, better answers.
      </TakeawayCard>
    </div>
  );
}
