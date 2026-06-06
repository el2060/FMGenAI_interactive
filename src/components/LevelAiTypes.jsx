import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const AI_TYPES = {
  rules:      { name: 'Rule-Based', emoji: '📏', color: 'L1', blurb: 'If-this-then-that' },
  predictive: { name: 'Predictive', emoji: '📈', color: 'L2', blurb: 'Forecasts from data' },
  vision:     { name: 'Vision',     emoji: '👁️', color: 'L3', blurb: 'Reads images' },
  genai:      { name: 'Gen AI',     emoji: '✨', color: 'L4', blurb: 'Writes content' },
};

/**
 * Each ticket proposes an AI type for a job.
 * `verdict`: true = right fit; false = mismatch.
 * `realAnswer`: when wrong, this is the AI type that SHOULD do this job.
 */
const TICKETS = [
  {
    id: 't1',
    location: 'Punggol DC',
    icon: '❄️',
    proposed: 'genai',
    job: 'Forecast tomorrow\'s chilled-water demand from weather and occupancy patterns.',
    verdict: false,
    realAnswer: 'predictive',
    why: 'Gen AI writes text, not forecasts. Historical numbers = Predictive AI.',
  },
  {
    id: 't2',
    location: 'Tampines',
    icon: '🗑️',
    proposed: 'vision',
    job: 'Scan CCTV frames to flag overflowing bins and corridor obstructions.',
    verdict: true,
    why: 'Correct. Camera analysis for physical objects = Vision AI.',
  },
  {
    id: 't3',
    location: 'One-North',
    icon: '✉️',
    proposed: 'rules',
    job: 'Draft a polite tenant circular for tomorrow\'s scheduled lift maintenance.',
    verdict: false,
    realAnswer: 'genai',
    why: 'Rules trigger actions, they don\'t draft messages. Writing = Gen AI.',
  },
  {
    id: 't4',
    location: 'Jurong East',
    icon: '🌡️',
    proposed: 'rules',
    job: 'Auto-escalate to a technician when the AHU room crosses 30°C for 10 minutes.',
    verdict: true,
    why: 'Simple threshold trigger. If X happens, do Y = Rule-Based.',
  },
  {
    id: 't5',
    location: 'CBD Tower',
    icon: '🔍',
    proposed: 'genai',
    job: 'Detect rust spots on chiller pipework from monthly inspection photos.',
    verdict: false,
    realAnswer: 'vision',
    why: 'Gen AI cannot process photos. Image analysis = Vision AI.',
  },
  {
    id: 't6',
    location: 'Marina Bay',
    icon: '⚡',
    proposed: 'predictive',
    job: 'Forecast next-month energy usage from 24 months of meter data + tenant load.',
    verdict: true,
    why: 'Pattern-spotting at its finest. Predictive thrives on historical signal.',
  },
  {
    id: 't7',
    location: 'Changi Hub',
    icon: '🛗',
    proposed: 'predictive',
    job: 'Reply to a tenant\'s polite query about Saturday\'s lift maintenance window.',
    verdict: false,
    realAnswer: 'genai',
    why: 'Predictive finds patterns in numbers, not language. Writing a reply = Gen AI.',
  },
  {
    id: 't8',
    location: 'Woodlands',
    icon: '🚨',
    proposed: 'vision',
    job: 'Trigger fire-zone lockdown the moment smoke detector reads above threshold.',
    verdict: false,
    realAnswer: 'rules',
    why: 'No images involved. Threshold + action = Rules. Keep this hard-coded.',
  },
];

export default function LevelAiTypes({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [judgement, setJudgement] = useState(null); // 'right' | 'wrong' | null
  const [history, setHistory] = useState([]); // { id, correct }
  const [shakeKey, setShakeKey] = useState(0);

  const ticket = TICKETS[idx];
  const done = idx >= TICKETS.length;
  const proposed = ticket && AI_TYPES[ticket.proposed];

  const correctSoFar = history.filter((h) => h.correct).length;

  const accent = useMemo(() => {
    if (!judgement) return null;
    const userSaidRight = judgement === 'right';
    return userSaidRight === ticket.verdict ? 'correct' : 'wrong';
  }, [judgement, ticket]);

  function judge(call) {
    if (judgement) return;
    const userSaidRight = call === 'right';
    const isCorrect = userSaidRight === ticket.verdict;
    setJudgement(call);
    if (!isCorrect) setShakeKey((k) => k + 1);
  }

  function advance() {
    setHistory((h) => [...h, { id: ticket.id, correct: accent === 'correct' }]);
    setJudgement(null);
    setIdx((i) => i + 1);
  }

  return (
    <div>
      <LevelHeader level={1} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Not all AI is Gen AI. <span className="text-L1">Spot the mismatches.</span>
      </h2>

      <ConceptCard accent="L1" icon="🧭" title="AI is a toolbox, not one magic button.">
        Rules trigger. Predictive forecasts. Vision sees. Gen AI writes.
        <strong> Wrong tool, wrong outcome.</strong>
      </ConceptCard>

      {/* Compact type legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {Object.entries(AI_TYPES).map(([k, t]) => (
          <div key={k} className="rounded-xl border border-line bg-white p-2.5 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg bg-${t.color}/10 flex items-center justify-center text-base shrink-0`}>
              {t.emoji}
            </div>
            <div className="min-w-0">
              <div className={`font-semibold text-[12.5px] text-${t.color} leading-tight`}>{t.name}</div>
              <div className="text-[10.5px] text-muted leading-tight truncate">{t.blurb}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Score strip */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted font-mono">
          Ticket {Math.min(idx + 1, TICKETS.length)} / {TICKETS.length}
        </div>
        <div className="flex items-center gap-1">
          {TICKETS.map((t, i) => {
            const past = history.find((h) => h.id === t.id);
            return (
              <motion.div
                key={t.id}
                animate={{ scale: past ? [1, 1.4, 1] : 1 }}
                transition={{ duration: 0.35 }}
                className={`h-1.5 rounded-full transition-all ${
                  past ? (past.correct ? 'bg-win w-5' : 'bg-L6 w-5') :
                  i === idx ? 'bg-L1 w-7' : 'bg-line w-3'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Card stack */}
      <div className="relative" style={{ minHeight: 380 }}>
        {/* ghost cards behind (peek effect) */}
        {!done && idx < TICKETS.length - 1 && (
          <>
            <div className="absolute inset-x-3 top-2 h-full card opacity-50 scale-[0.97] origin-top" style={{ zIndex: 0 }} />
            {idx < TICKETS.length - 2 && (
              <div className="absolute inset-x-6 top-4 h-full card opacity-25 scale-[0.94] origin-top" style={{ zIndex: -1 }} />
            )}
          </>
        )}

        <AnimatePresence mode="wait">
          {!done && (
            <motion.div
              key={ticket.id + '-' + shakeKey}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                x: accent === 'wrong' ? [0, -10, 10, -8, 8, 0] : 0,
              }}
              exit={{
                opacity: 0,
                x: accent === 'correct' ? (ticket.verdict ? 400 : -400) : 0,
                rotate: accent === 'correct' ? (ticket.verdict ? 15 : -15) : 0,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ type: 'spring', stiffness: 230, damping: 22 }}
              className="card-strong p-5 sm:p-6 relative overflow-hidden"
              style={{ zIndex: 10 }}
            >
              {/* top color bar reflects proposed AI type */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-${proposed.color}`} />

              {/* Ticket header */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-soft font-mono">
                  FM Ticket #{ticket.id.toUpperCase()}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cream border border-line text-muted font-semibold">
                  🇸🇬 {ticket.location}
                </span>
                <span className="ml-auto text-[10px] font-mono text-soft flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />
                  live
                </span>
              </div>

              {/* Job */}
              <div className="rounded-xl bg-cream border border-line p-3.5 mb-4 flex items-start gap-3">
                <div className="text-3xl shrink-0">{ticket.icon}</div>
                <div className="text-[14.5px] text-ink leading-relaxed">
                  {ticket.job}
                </div>
              </div>

              {/* Proposed AI */}
              <div className="mb-5">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted mb-1.5">
                  Proposed solution
                </div>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-${proposed.color}/10 border-2 border-${proposed.color}/40`}>
                  <span className="text-xl">{proposed.emoji}</span>
                  <span className={`font-bold text-[14px] text-${proposed.color}`}>{proposed.name}</span>
                  <span className="text-soft text-[12px]">— {proposed.blurb}</span>
                </div>
              </div>

              {/* Judgement pad */}
              {!judgement && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2 text-center">
                    Your call?
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => judge('wrong')}
                      className="rounded-xl px-4 py-3.5 border-2 border-L6/30 bg-white hover:bg-L6/5 hover:border-L6 transition flex items-center justify-center gap-2 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">✗</span>
                      <span className="font-bold text-[14px] text-L6">Wrong tool</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => judge('right')}
                      className="rounded-xl px-4 py-3.5 border-2 border-win/30 bg-white hover:bg-win/5 hover:border-win transition flex items-center justify-center gap-2 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition">✓</span>
                      <span className="font-bold text-[14px] text-win">Right fit</span>
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Verdict feedback */}
              <AnimatePresence>
                {judgement && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border-2 p-3.5 ${
                      accent === 'correct' ? 'border-win/40 bg-win/[0.07]' : 'border-L6/40 bg-L6/[0.06]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold ${
                        accent === 'correct' ? 'bg-win' : 'bg-L6'
                      }`}>
                        {accent === 'correct' ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10.5px] font-bold uppercase tracking-[0.16em] mb-1 ${
                          accent === 'correct' ? 'text-win' : 'text-L6'
                        }`}>
                          {accent === 'correct'
                            ? (ticket.verdict ? 'Right call — it IS a fit' : 'Right call — it\'s a mismatch')
                            : (ticket.verdict ? 'Actually a fit' : 'Actually a mismatch')}
                        </div>
                        <div className="text-[13.5px] text-ink/85 leading-relaxed">
                          {ticket.why}
                        </div>
                        {!ticket.verdict && (
                          <div className="mt-2 inline-flex items-center gap-2 text-[12.5px] bg-white border border-line rounded-lg px-2.5 py-1.5">
                            <span className="text-soft">Better fit:</span>
                            <span className="text-base">{AI_TYPES[ticket.realAnswer].emoji}</span>
                            <span className={`font-bold text-${AI_TYPES[ticket.realAnswer].color}`}>
                              {AI_TYPES[ticket.realAnswer].name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={advance}
                        className="px-4 py-2 rounded-lg bg-ink text-white font-semibold text-[13px] hover:bg-black transition shadow-pop"
                      >
                        {idx === TICKETS.length - 1 ? 'See your score →' : 'Next ticket →'}
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
              className="card-strong p-6 sm:p-7 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-win via-L1 to-L4" />
              <div className="text-5xl mb-3">
                {correctSoFar === TICKETS.length ? '🎯' : correctSoFar >= TICKETS.length - 2 ? '👏' : '📚'}
              </div>
              <div className="font-display font-bold text-2xl mb-1">
                {correctSoFar} / {TICKETS.length} tickets cleared
              </div>
              <div className="text-muted text-[14px] mb-4 max-w-sm mx-auto">
                {correctSoFar === TICKETS.length
                  ? 'Flawless. You know your tools.'
                  : correctSoFar >= TICKETS.length - 2
                  ? 'Good job. A few sneaked by, but you get the idea.'
                  : 'Basics covered. Remember: use the right tool for the job.'}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold ${
                      h.correct ? 'bg-win' : 'bg-L6'
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
        <PrimaryButton onClick={onComplete} disabled={!done} accent="L1">
          Next Level →
        </PrimaryButton>
      </div>

      <TakeawayCard
        accent="L1"
        application="Predictive/vision/rules for ops data. Gen AI for text. Pick the right tool."
      >
        <strong>Gen AI isn't for everything.</strong> It writes and summarizes.
      </TakeawayCard>
    </div>
  );
}
