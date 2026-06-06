import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const DRAFT_PARTS = [
  { text: 'Hi ChatGPT, please help me draft a polite reply to Mr. Tan Wei Ming (NRIC: ' },
  { id: 'nric',   text: 'S1234567A',                  sensitive: true },
  { text: ', mobile ' },
  { id: 'mobile', text: '+65 9123 4567',              sensitive: true },
  { text: ') at Block 71 ' },
  { id: 'unit',   text: '#15-23',                     sensitive: true },
  { text: '. His CCTV footage at ' },
  { id: 'cctv',   text: '/cam/blk71/2024-09-24.mp4',  sensitive: true },
  { text: ' shows him entering the lift at 22:14. He has been asking about ' },
  { id: 'topic',  text: 'service charge calculations for his unit', sensitive: false, needed: true },
  { text: '. Please draft a courteous acknowledgment.' },
];

const FILTERS = [
  { id: 'nric',   icon: '🆔', label: 'NRIC',          desc: 'S-series national ID' },
  { id: 'mobile', icon: '📱', label: 'Mobile',        desc: 'Personal phone number' },
  { id: 'unit',   icon: '🏠', label: 'Unit address',  desc: 'Specific unit #' },
  { id: 'cctv',   icon: '📹', label: 'CCTV URL',      desc: 'Footage path' },
  { id: 'topic',  icon: '📋', label: 'Complaint topic', desc: 'Business context' },
];

export default function LevelPdpaGuardrails({ onComplete }) {
  const [filters, setFilters] = useState({});
  const [sent, setSent] = useState(false);

  function toggle(id) {
    if (sent) return;
    setFilters((f) => ({ ...f, [id]: !f[id] }));
  }

  const sensitiveHidden = ['nric','mobile','unit','cctv'].every((id) => filters[id]);
  const overRedacted = !!filters.topic;
  const safe = sensitiveHidden && !overRedacted;

  function send() { if (safe) setSent(true); }

  let score = 0;
  ['nric','mobile','unit','cctv'].forEach((id) => { if (filters[id]) score += 1; });
  if (filters.topic) score -= 1;
  const scoreMax = 4;
  const scoreLabel = score < 0 ? 'Broken (over-redacted)' : score === 0 ? 'Risky' : score <= 2 ? 'Improving' : score === 3 ? 'Almost safe' : safe ? 'PDPA Safe ✓' : 'Almost safe';
  const scoreColor = score < 0 ? 'text-L9' : score === 0 ? 'text-L9' : score <= 2 ? 'text-L3' : score === 3 ? 'text-L2' : safe ? 'text-win' : 'text-L2';

  return (
    <div>
      <LevelHeader level={9} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI prompts are not private. <span className="text-L9">Strip the sensitive bits first.</span>
      </h2>

      <ConceptCard accent="L9" icon="🔒" title="PDPA applies when you talk to AI.">
        Pasting NRICs into ChatGPT = data leak. But over-redact and AI can't help. Strip identifiers, <strong>keep context.</strong>
      </ConceptCard>



      <div className="card-strong p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-ink text-white flex items-center justify-center text-[11px] font-bold">→</div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted">Draft Prompt to ChatGPT</div>
          <div className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider">
            <span>Privacy Score:</span>
            <span className={scoreColor}>{scoreLabel}</span>
          </div>
        </div>
        <div className="bg-cream rounded-xl p-4 border border-line text-[14px] leading-[1.8] text-ink/85">
          {DRAFT_PARTS.map((p, i) => {
            if (!p.id) return <span key={i}>{p.text}</span>;
            const hidden = filters[p.id];
            if (hidden) {
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="redacted font-mono px-1.5"
                  title={p.needed ? 'You hid important context — AI cannot help' : 'Redacted'}
                >
                  {p.text}
                </motion.span>
              );
            }
            return (
              <span key={i} className={`font-mono px-1.5 py-0.5 rounded ${p.sensitive ? 'bg-L9/10 text-L9 font-semibold' : 'bg-L4/10 text-L4 font-semibold'}`}>
                {p.text}
              </span>
            );
          })}
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-3">🛡️ Privacy Filters</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FILTERS.map((f) => {
            const on = !!filters[f.id];
            return (
              <button
                key={f.id}
                onClick={() => toggle(f.id)}
                disabled={sent}
                className={`text-left p-3 rounded-xl border-2 transition-all ${
                  on ? 'border-L9 bg-L9/[0.07] shadow-pop' : 'border-line bg-white hover:border-L9/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">{f.icon}</span>
                  <span className={`w-8 h-4 rounded-full p-0.5 transition ${on ? 'bg-L9' : 'bg-line'}`}>
                    <motion.span
                      animate={{ x: on ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      className="block w-3 h-3 rounded-full bg-white"
                    />
                  </span>
                </div>
                <div className="text-[12.5px] font-semibold leading-tight">{f.label}</div>
                <div className="text-[10.5px] text-soft leading-tight">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {overRedacted && !sent && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border-2 border-L3/30 bg-L3/[0.06] p-3.5 mb-4 flex gap-3">
            <div className="text-xl">⚠️</div>
            <div className="text-[13px] text-ink/85 leading-relaxed">
              <strong className="text-L3">You hid the complaint topic.</strong>{' '}
              The AI now has no idea what to draft a reply about. Privacy ≠ removing everything — leave the business context in.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          onClick={send}
          disabled={!safe || sent}
          className={`px-5 py-3 rounded-xl font-semibold text-[15px] transition-all ${
            sent ? 'bg-win/10 text-win border border-win/30 cursor-default' :
            safe ? 'bg-L9 text-white hover:bg-[#0D9488] shadow-pop ring-pulse-L9' : 'bg-line text-soft cursor-not-allowed'
          }`}
        >
          {sent ? '✓ Sent safely to AI' : '🔒 Send to AI'}
        </button>
        <PrimaryButton onClick={onComplete} disabled={!sent} accent="L9">Next Level →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L9"
        application="Replace NRIC with 'tenant', unit # with 'a unit'. When in doubt, use approved enterprise AI."
      >
        <strong>Identifiers go. Context stays.</strong> Feed AI only what it needs.
      </TakeawayCard>
    </div>
  );
}
