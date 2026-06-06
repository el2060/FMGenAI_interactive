import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton, SiteChip } from './Common';

/**
 * The "AI Safe Lane" calls:
 * - 'ai-safe' = OK to draft with AI (still review before sending)
 * - 'human'   = Human-only. AI not appropriate.
 */
const ITEMS = [
  {
    id: 'i1',
    icon: '💬',
    from: 'Mr Tan (Tenant, #08-21)',
    subject: 'Hot office on level 8 — can someone check the aircon?',
    verdict: 'ai-safe',
    why: 'Tenant comms drafting. AI generates a polite holding reply, you verify SLA + send. Low risk.',
    nuance: 'Just don\'t paste his NRIC if it\'s in the email signature.',
  },
  {
    id: 'i2',
    icon: '⚠️',
    from: 'BCA / regulator',
    subject: 'Sign-off required: fire-safety variation for new partition layout in #15-23',
    verdict: 'human',
    why: 'Statutory sign-off. AI cannot bear legal responsibility.',
    nuance: 'AI may help summarise the request. It cannot approve it.',
  },
  {
    id: 'i3',
    icon: '📑',
    from: 'Procurement team',
    subject: 'Compare these 3 chiller maintenance quotes — which gives best value?',
    verdict: 'ai-safe',
    why: 'Vendor quote comparison. Paste the quotes (redact contact info), let AI tabulate scope vs. price. You decide.',
    nuance: 'AI shows the math. You judge vendor track record.',
  },
  {
    id: 'i4',
    icon: '🚨',
    from: 'PDPC notification queue',
    subject: 'Draft the breach notification — tenant CCTV footage leaked via misconfigured cloud share',
    verdict: 'human',
    why: 'PDPA breach notifications are legally specific. Wrong wording = bigger problem. DPO + legal own this.',
    nuance: 'AI may help draft the internal post-mortem. NOT the regulator-facing notification.',
  },
  {
    id: 'i5',
    icon: '🎉',
    from: 'Tenant engagement WG',
    subject: 'Brainstorm names for the Block 71 wellness corner',
    verdict: 'ai-safe',
    why: 'Pure creative brainstorming. Low stakes, high variety needed. Gen AI shines here.',
    nuance: 'Crank temperature up for this one (Level 3 callback).',
  },
  {
    id: 'i6',
    icon: '🛑',
    from: 'Duty officer (after-hours)',
    subject: 'Authorise emergency shutdown of B1 chiller — coolant leak suspected',
    verdict: 'human',
    why: 'Emergency decisions. AI gives advice, humans authorise.',
    nuance: 'AI may help interpret readings, but the shutdown call is yours.',
  },
  {
    id: 'i7',
    icon: '🗓️',
    from: 'Tenant relations',
    subject: 'Draft the monthly tenant newsletter — events, maintenance updates, reminders',
    verdict: 'ai-safe',
    why: 'Routine comms. AI saves 90 minutes. You review tone, facts and dates.',
    nuance: 'Ground it with the actual events calendar — see Level 6.',
  },
  {
    id: 'i8',
    icon: '⚖️',
    from: 'Legal',
    subject: 'Final language for the tenancy renewal agreement clause 14.2',
    verdict: 'human',
    why: 'Final legal text. Even commas matter. Lawyers own it end-to-end.',
    nuance: 'AI is fine for an early draft to argue over. Not the signed copy.',
  },
];

export default function LevelHumanInLoop({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(null);
  const [history, setHistory] = useState([]);
  const [shakeKey, setShakeKey] = useState(0);

  const item = ITEMS[idx];
  const done = idx >= ITEMS.length;

  const correctSoFar = history.filter((h) => h.correct).length;

  const accent = useMemo(() => {
    if (!pick) return null;
    return pick === item.verdict ? 'correct' : 'wrong';
  }, [pick, item]);

  function decide(call) {
    if (pick) return;
    setPick(call);
    if (call !== item.verdict) setShakeKey((k) => k + 1);
  }

  function next() {
    setHistory((h) => [...h, { id: item.id, correct: accent === 'correct' }]);
    setPick(null);
    setIdx((i) => i + 1);
  }

  return (
    <div>
      <LevelHeader level={11} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Speed of AI ≠ rightness of AI. <span className="text-L11">Some inboxes belong to humans.</span>
      </h2>

      <ConceptCard accent="L11" icon="🛑" title="Triage every task. Not everything is for AI.">
        AI accelerates routine work, but it also accelerates mistakes in high-stakes tasks (legal, life-safety, PDPA). <strong>Keep humans in the loop.</strong>
      </ConceptCard>

      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted font-mono">
          Inbox · {Math.min(idx + 1, ITEMS.length)} / {ITEMS.length}
        </div>
        <div className="flex items-center gap-1">
          {ITEMS.map((it, i) => {
            const past = history.find((h) => h.id === it.id);
            return (
              <div
                key={it.id}
                className={`h-1.5 rounded-full transition-all ${
                  past ? (past.correct ? 'bg-win w-5' : 'bg-L10 w-5') :
                  i === idx ? 'bg-L11 w-7' : 'bg-line w-3'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="relative" style={{ minHeight: 380 }}>
        <AnimatePresence mode="wait">
          {!done && (
            <motion.div
              key={item.id + '-' + shakeKey}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                x: accent === 'wrong' ? [0, -10, 10, -8, 8, 0] : 0,
              }}
              exit={{
                opacity: 0,
                x: accent === 'correct' ? (item.verdict === 'ai-safe' ? 400 : -400) : 0,
                transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="card-strong p-5 sm:p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-L11" />

              {/* email-like header */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-soft font-mono">FM Inbox · #{item.id.toUpperCase()}</span>
                <SiteChip />
              </div>

              <div className="rounded-xl border border-line bg-cream/60 p-4 mb-4">
                <div className="flex items-center gap-2 text-[11px] mb-2">
                  <span className="text-soft">From:</span>
                  <span className="font-semibold text-ink">{item.from}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="text-3xl shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-soft mb-0.5">Subject</div>
                    <div className="text-[14.5px] text-ink leading-relaxed font-medium">{item.subject}</div>
                  </div>
                </div>
              </div>

              {!pick && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2 text-center">
                    Route this where?
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => decide('ai-safe')}
                      className="rounded-xl p-3.5 border-2 border-L8/30 bg-white hover:bg-L8/5 hover:border-L8 transition flex flex-col items-center gap-1 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">🤖</span>
                      <span className="font-bold text-[13px] text-L8">Draft with AI</span>
                      <span className="text-[10.5px] text-soft text-center">routine · low stakes · I review before sending</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => decide('human')}
                      className="rounded-xl p-3.5 border-2 border-L11/30 bg-white hover:bg-L11/5 hover:border-L11 transition flex flex-col items-center gap-1 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">🧑‍⚖️</span>
                      <span className="font-bold text-[13px] text-L11">Human only</span>
                      <span className="text-[10.5px] text-soft text-center">statutory · legal · life-safety · PDPA</span>
                    </motion.button>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {pick && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border-2 p-3.5 ${
                      accent === 'correct' ? 'border-win/40 bg-win/[0.07]' : 'border-L10/40 bg-L10/[0.06]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold ${
                        accent === 'correct' ? 'bg-win' : 'bg-L10'
                      }`}>
                        {accent === 'correct' ? '✓' : '!'}
                      </div>
                      <div className="flex-1">
                        <div className={`text-[10.5px] font-bold uppercase tracking-[0.16em] mb-1 ${
                          accent === 'correct' ? 'text-win' : 'text-L10'
                        }`}>
                          {accent === 'correct' ? 'Right call' : 'Reconsider'}
                          <span className="ml-2 text-soft">→ {item.verdict === 'ai-safe' ? 'AI-safe lane' : 'Human only'}</span>
                        </div>
                        <div className="text-[13.5px] text-ink/85 leading-relaxed mb-1.5">{item.why}</div>
                        <div className="text-[12px] text-muted italic flex gap-1.5">
                          <span>💭</span><span>{item.nuance}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={next}
                        className="px-4 py-2 rounded-lg bg-ink text-white font-semibold text-[13px] hover:bg-black transition shadow-pop"
                      >
                        {idx === ITEMS.length - 1 ? 'See your judgement →' : 'Next inbox item →'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {done && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="card-strong p-6 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-L11 via-L10 to-win" />
              <div className="text-5xl mb-3">
                {correctSoFar === ITEMS.length ? '🛡️' : correctSoFar >= ITEMS.length - 2 ? '👍' : '🤔'}
              </div>
              <div className="font-display font-bold text-2xl mb-1">
                {correctSoFar} / {ITEMS.length} routed correctly
              </div>
              <div className="text-muted text-[14px] mb-4 max-w-sm mx-auto">
                {correctSoFar === ITEMS.length
                  ? 'Your judgement on what AI should and shouldn\'t touch is sharp.'
                  : correctSoFar >= ITEMS.length - 2
                  ? 'Strong instinct. A couple of edge cases to remember.'
                  : 'Worth re-reading the misses — they\'re the ones that matter in real shifts.'}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold ${
                      h.correct ? 'bg-win' : 'bg-L10'
                    }`}
                  >
                    {h.correct ? '✓' : '✗'}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end mt-5">
        <PrimaryButton onClick={onComplete} disabled={!done} accent="L11">
          🎓 Complete Module →
        </PrimaryButton>
      </div>

      <TakeawayCard
        accent="L11"
        application="Ask: is this routine + low-stakes? If yes, draft with AI. If it's legal, life-safety, or PDPA-sensitive → human owns it."
      >
        <strong>AI accelerates. Humans authorise.</strong> Knowing the line is a crucial skill.
      </TakeawayCard>
    </div>
  );
}
