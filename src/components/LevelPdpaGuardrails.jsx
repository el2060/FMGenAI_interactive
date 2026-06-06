import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton } from './Common';
import { IdCard, Smartphone, Home, Video, ClipboardList, AlertTriangle, ShieldCheck, Lock, ArrowRight } from 'lucide-react';

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
  { id: 'nric',   icon: IdCard, label: 'NRIC',          desc: 'S-series national ID' },
  { id: 'mobile', icon: Smartphone, label: 'Mobile',        desc: 'Personal phone number' },
  { id: 'unit',   icon: Home, label: 'Unit address',  desc: 'Specific unit #' },
  { id: 'cctv',   icon: Video, label: 'CCTV URL',      desc: 'Footage path' },
  { id: 'topic',  icon: ClipboardList, label: 'Complaint topic', desc: 'Business context' },
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
  const scoreColor = score < 0 ? 'text-red-600' : score === 0 ? 'text-red-600' : score <= 2 ? 'text-amber-600' : score === 3 ? 'text-blue-600' : safe ? 'text-green-600' : 'text-blue-600';

  return (
    <div>
      <LevelHeader level={9} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI prompts are not private. <span className="text-zinc-500">Strip the sensitive bits first.</span>
      </h2>

      <p className="text-muted text-[15px] max-w-2xl mb-6">
        Toggle the privacy filters to strip sensitive identifiers before sending to the AI.
      </p>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-zinc-800 text-white flex items-center justify-center text-[11px] font-bold"><ArrowRight size={14} /></div>
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500">Draft Prompt to ChatGPT</div>
          <div className="ml-auto flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider">
            <span className="text-zinc-500">Privacy Score:</span>
            <span className={scoreColor}>{scoreLabel}</span>
          </div>
        </div>
        <div className="bg-zinc-50 rounded-md p-4 border border-zinc-200 text-[14px] leading-[1.8] text-zinc-800 shadow-inner">
          {DRAFT_PARTS.map((p, i) => {
            if (!p.id) return <span key={i}>{p.text}</span>;
            const hidden = filters[p.id];
            if (hidden) {
              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-zinc-200 text-zinc-500 line-through font-mono px-1.5 rounded"
                  title={p.needed ? 'You hid important context — AI cannot help' : 'Redacted'}
                >
                  {p.text}
                </motion.span>
              );
            }
            return (
              <span key={i} className={`font-mono px-1.5 py-0.5 rounded ${p.sensitive ? 'bg-red-50 text-red-600 font-semibold border border-red-200' : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'}`}>
                {p.text}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-3 flex items-center gap-1.5">
          <ShieldCheck size={14} /> Privacy Filters
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {FILTERS.map((f) => {
            const on = !!filters[f.id];
            const FIcon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => toggle(f.id)}
                disabled={sent}
                className={`text-left p-3 rounded-md border transition-all ${
                  on ? 'border-zinc-800 bg-zinc-100 shadow-sm' : 'border-zinc-200 bg-white hover:border-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <FIcon size={18} className={on ? 'text-zinc-900' : 'text-zinc-500'} />
                  <span className={`w-8 h-4 rounded-full p-0.5 transition ${on ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <motion.span
                      animate={{ x: on ? 16 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                      className="block w-3 h-3 rounded-full bg-white"
                    />
                  </span>
                </div>
                <div className={`text-[12.5px] font-semibold leading-tight ${on ? 'text-zinc-900' : 'text-zinc-700'}`}>{f.label}</div>
                <div className="text-[10.5px] text-zinc-500 leading-tight mt-0.5">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {overRedacted && !sent && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-md border border-red-200 bg-red-50 p-4 mb-4 flex gap-3 shadow-sm">
            <AlertTriangle size={20} className="text-red-500 shrink-0" />
            <div className="text-[13px] text-red-900 leading-relaxed">
              <strong className="text-red-700">You hid the complaint topic.</strong>{' '}
              The AI now has no idea what to draft a reply about. Privacy ≠ removing everything — leave the business context in.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          onClick={send}
          disabled={!safe || sent}
          className={`px-5 py-3 rounded-md font-semibold text-[14px] flex items-center gap-2 transition-all ${
            sent ? 'bg-zinc-100 text-zinc-500 border border-zinc-200 cursor-default' :
            safe ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm' : 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
          }`}
        >
          {sent ? <><ShieldCheck size={16} /> Sent safely to AI</> : <><Lock size={16} /> Send to AI</>}
        </button>
      </div>

      {sent && (
        <>
          <TakeawayCard
            application="Replace NRIC with 'tenant', unit # with 'a unit'. When in doubt, use approved enterprise AI."
          >
            <strong>Identifiers go. Context stays.</strong> Feed AI only what it needs.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Level →</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
