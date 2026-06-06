import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton } from './Common';
import { Gauge, TrendingUp, Eye, Sparkles, Snowflake, Trash2, Mail, Thermometer, Search, Zap, ArrowUpToLine, Bell, Check, X, Target, Trophy, BookOpen } from 'lucide-react';

const AI_TYPES = {
  rules:      { name: 'Rule-Based', icon: Gauge, blurb: 'If-this-then-that' },
  predictive: { name: 'Predictive', icon: TrendingUp, blurb: 'Forecasts from data' },
  vision:     { name: 'Vision',     icon: Eye, blurb: 'Reads images' },
  genai:      { name: 'Gen AI',     icon: Sparkles, blurb: 'Writes content' },
};

const TICKETS = [
  {
    id: 't1',
    location: 'Punggol DC',
    icon: Snowflake,
    proposed: 'genai',
    job: 'Forecast tomorrow\'s chilled-water demand from weather and occupancy patterns.',
    verdict: false,
    realAnswer: 'predictive',
    why: 'Gen AI writes text, not forecasts. Historical numbers = Predictive AI.',
  },
  {
    id: 't2',
    location: 'Tampines',
    icon: Trash2,
    proposed: 'vision',
    job: 'Scan CCTV frames to flag overflowing bins and corridor obstructions.',
    verdict: true,
    why: 'Correct. Camera analysis for physical objects = Vision AI.',
  },
  {
    id: 't3',
    location: 'One-North',
    icon: Mail,
    proposed: 'rules',
    job: 'Draft a polite tenant circular for tomorrow\'s scheduled lift maintenance.',
    verdict: false,
    realAnswer: 'genai',
    why: 'Rules trigger actions, they don\'t draft messages. Writing = Gen AI.',
  },
  {
    id: 't4',
    location: 'Jurong East',
    icon: Thermometer,
    proposed: 'rules',
    job: 'Auto-escalate to a technician when the AHU room crosses 30°C for 10 minutes.',
    verdict: true,
    why: 'Simple threshold trigger. If X happens, do Y = Rule-Based.',
  },
  {
    id: 't5',
    location: 'CBD Tower',
    icon: Search,
    proposed: 'genai',
    job: 'Detect rust spots on chiller pipework from monthly inspection photos.',
    verdict: false,
    realAnswer: 'vision',
    why: 'Gen AI cannot process photos. Image analysis = Vision AI.',
  },
  {
    id: 't6',
    location: 'Marina Bay',
    icon: Zap,
    proposed: 'predictive',
    job: 'Forecast next-month energy usage from 24 months of meter data + tenant load.',
    verdict: true,
    why: 'Pattern-spotting at its finest. Predictive thrives on historical signal.',
  },
  {
    id: 't7',
    location: 'Changi Hub',
    icon: ArrowUpToLine,
    proposed: 'predictive',
    job: 'Reply to a tenant\'s polite query about Saturday\'s lift maintenance window.',
    verdict: false,
    realAnswer: 'genai',
    why: 'Predictive finds patterns in numbers, not language. Writing a reply = Gen AI.',
  },
  {
    id: 't8',
    location: 'Woodlands',
    icon: Bell,
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
  const PropIcon = proposed?.icon;

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
        Not all AI is Gen AI. <span className="text-zinc-500">Spot the mismatches.</span>
      </h2>

      <p className="text-muted text-[15px] max-w-2xl mb-6">
        Match the correct AI type to each facility management job below.
      </p>

      {/* Compact type legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {Object.entries(AI_TYPES).map(([k, t]) => {
          const TIcon = t.icon;
          return (
            <div key={k} className="rounded-md border border-zinc-200 bg-white p-2.5 flex items-center gap-2 shadow-sm">
              <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0 border border-zinc-200">
                <TIcon size={16} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[12.5px] text-zinc-900 leading-tight">{t.name}</div>
                <div className="text-[10.5px] text-zinc-500 leading-tight truncate">{t.blurb}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score strip */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 font-mono">
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
                  past ? (past.correct ? 'bg-zinc-800 w-5' : 'bg-red-500 w-5') :
                  i === idx ? 'bg-zinc-800 w-7' : 'bg-zinc-200 w-3'
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
            <div className="absolute inset-x-3 top-2 h-full bg-white rounded-md border border-zinc-200 opacity-50 scale-[0.97] origin-top shadow-sm" style={{ zIndex: 0 }} />
            {idx < TICKETS.length - 2 && (
              <div className="absolute inset-x-6 top-4 h-full bg-white rounded-md border border-zinc-200 opacity-25 scale-[0.94] origin-top shadow-sm" style={{ zIndex: -1 }} />
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
              className="bg-white border border-zinc-200 shadow-sm rounded-md p-5 sm:p-6 relative overflow-hidden"
              style={{ zIndex: 10 }}
            >
              {/* top color bar reflects proposed AI type */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800" />

              {/* Ticket header */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
                  FM Ticket #{ticket.id.toUpperCase()}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 font-semibold">
                  {ticket.location}
                </span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  live
                </span>
              </div>

              {/* Job */}
              <div className="rounded-md bg-zinc-50 border border-zinc-200 p-3.5 mb-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5 text-zinc-500"><ticket.icon size={20} /></div>
                <div className="text-[14.5px] text-zinc-900 leading-relaxed">
                  {ticket.job}
                </div>
              </div>

              {/* Proposed AI */}
              <div className="mb-5">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-500 mb-1.5">
                  Proposed solution
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-100 border border-zinc-200">
                  <span className="text-zinc-700"><PropIcon size={16} /></span>
                  <span className="font-bold text-[14px] text-zinc-900">{proposed.name}</span>
                  <span className="text-zinc-500 text-[12px]">— {proposed.blurb}</span>
                </div>
              </div>

              {/* Judgement pad */}
              {!judgement && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 mb-2 text-center">
                    Your call?
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => judge('wrong')}
                      className="rounded-md px-4 py-3.5 border border-zinc-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition flex items-center justify-center gap-2 group shadow-sm text-zinc-700"
                    >
                      <X size={18} className="group-hover:scale-110 transition" />
                      <span className="font-bold text-[14px]">Wrong tool</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => judge('right')}
                      className="rounded-md px-4 py-3.5 border border-zinc-200 bg-white hover:bg-zinc-100 hover:border-zinc-300 transition flex items-center justify-center gap-2 group shadow-sm text-zinc-700"
                    >
                      <Check size={18} className="group-hover:scale-110 transition" />
                      <span className="font-bold text-[14px]">Right fit</span>
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
                    className={`rounded-md border p-3.5 ${
                      accent === 'correct' ? 'border-zinc-300 bg-zinc-100' : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-base font-bold ${
                        accent === 'correct' ? 'bg-zinc-800' : 'bg-red-500'
                      }`}>
                        {accent === 'correct' ? <Check size={16} /> : <X size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10.5px] font-bold uppercase tracking-[0.16em] mb-1 ${
                          accent === 'correct' ? 'text-zinc-800' : 'text-red-600'
                        }`}>
                          {accent === 'correct'
                            ? (ticket.verdict ? 'Right call — it IS a fit' : 'Right call — it\'s a mismatch')
                            : (ticket.verdict ? 'Actually a fit' : 'Actually a mismatch')}
                        </div>
                        <div className="text-[13.5px] text-zinc-800 leading-relaxed">
                          {ticket.why}
                        </div>
                        {!ticket.verdict && (() => {
                          const RealIcon = AI_TYPES[ticket.realAnswer].icon;
                          return (
                            <div className="mt-2 inline-flex items-center gap-2 text-[12.5px] bg-white border border-zinc-200 rounded-md px-2.5 py-1.5">
                              <span className="text-zinc-500">Better fit:</span>
                              <span className="text-zinc-700"><RealIcon size={14} /></span>
                              <span className="font-bold text-zinc-900">
                                {AI_TYPES[ticket.realAnswer].name}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <PrimaryButton onClick={advance}>
                        {idx === TICKETS.length - 1 ? 'See your score →' : 'Next ticket →'}
                      </PrimaryButton>
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
              className="bg-white border border-zinc-200 shadow-sm rounded-md p-6 sm:p-7 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800" />
              <div className="flex justify-center mb-4 text-zinc-800">
                {correctSoFar === TICKETS.length ? <Trophy size={48} strokeWidth={1.5} /> : correctSoFar >= TICKETS.length - 2 ? <Target size={48} strokeWidth={1.5} /> : <BookOpen size={48} strokeWidth={1.5} />}
              </div>
              <div className="font-display font-bold text-2xl mb-1 text-zinc-900">
                {correctSoFar} / {TICKETS.length} tickets cleared
              </div>
              <div className="text-zinc-500 text-[14px] mb-4 max-w-sm mx-auto">
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
                      h.correct ? 'bg-zinc-800' : 'bg-red-500'
                    }`}
                  >
                    {h.correct ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {done && (
        <>
          <TakeawayCard
            application="Predictive/vision/rules for ops data. Gen AI for text. Pick the right tool."
          >
            <strong>Gen AI isn't for everything.</strong> It writes and summarizes.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>
              Next Level →
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
