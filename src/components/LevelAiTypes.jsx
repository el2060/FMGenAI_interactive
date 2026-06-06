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
    job: 'Forecast tomorrow\'s chilled-water demand from weather and occupancy patterns.',
    correctAnswer: 'predictive',
    why: 'Historical numbers and forecasts require Predictive AI. Gen AI only writes text.',
  },
  {
    id: 't2',
    location: 'Tampines',
    icon: Trash2,
    job: 'Scan CCTV frames to flag overflowing bins and corridor obstructions.',
    correctAnswer: 'vision',
    why: 'Analyzing camera feeds and physical objects is the domain of Vision AI.',
  },
  {
    id: 't3',
    location: 'One-North',
    icon: Mail,
    job: 'Draft a polite tenant circular for tomorrow\'s scheduled lift maintenance.',
    correctAnswer: 'genai',
    why: 'Drafting messages and writing text is exactly what Gen AI is built for.',
  },
  {
    id: 't4',
    location: 'Jurong East',
    icon: Thermometer,
    job: 'Auto-escalate to a technician when the AHU room crosses 30°C for 10 minutes.',
    correctAnswer: 'rules',
    why: 'A simple threshold trigger (If X happens, do Y) is best kept as a hard-coded Rule-Based system.',
  },
  {
    id: 't5',
    location: 'CBD Tower',
    icon: Search,
    job: 'Detect rust spots on chiller pipework from monthly inspection photos.',
    correctAnswer: 'vision',
    why: 'Image analysis for defects requires Vision AI.',
  },
  {
    id: 't6',
    location: 'Marina Bay',
    icon: Zap,
    job: 'Forecast next-month energy usage from 24 months of meter data + tenant load.',
    correctAnswer: 'predictive',
    why: 'Pattern-spotting in historical numerical data is where Predictive AI thrives.',
  },
  {
    id: 't7',
    location: 'Changi Hub',
    icon: ArrowUpToLine,
    job: 'Reply to a tenant\'s polite query about Saturday\'s lift maintenance window.',
    correctAnswer: 'genai',
    why: 'Composing a polite, natural-language reply requires Gen AI.',
  },
  {
    id: 't8',
    location: 'Woodlands',
    icon: Bell,
    job: 'Trigger fire-zone lockdown the moment smoke detector reads above threshold.',
    correctAnswer: 'rules',
    why: 'Life-safety threshold actions must be hard-coded Rule-Based systems, not probabilistic AI models.',
  },
];

export default function LevelAiTypes({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [judgement, setJudgement] = useState(null); // stores the key the user clicked, e.g. 'rules'
  const [history, setHistory] = useState([]); // { id, correct }
  const [shakeKey, setShakeKey] = useState(0);

  const ticket = TICKETS[idx];
  const done = idx >= TICKETS.length;

  const correctSoFar = history.filter((h) => h.correct).length;

  const accent = useMemo(() => {
    if (!judgement) return null;
    return judgement === ticket.correctAnswer ? 'correct' : 'wrong';
  }, [judgement, ticket]);

  function judge(choiceKey) {
    if (judgement) return;
    const isCorrect = choiceKey === ticket.correctAnswer;
    setJudgement(choiceKey);
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
      <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight mb-4 leading-[1.05] text-zinc-900">
        Not all AI is Gen AI. <span className="text-zinc-400">Match the tools.</span>
      </h2>

      <p className="text-zinc-500 text-[17px] max-w-2xl mb-10 leading-relaxed">
        Click the correct AI tool to solve each facility management ticket below.
      </p>

      {/* Score strip */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400 font-mono">
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
                x: accent === 'correct' ? 400 : -400,
                rotate: accent === 'correct' ? 15 : -15,
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
              transition={{ type: 'spring', stiffness: 230, damping: 22 }}
              className="bg-white border border-zinc-200 shadow-sm rounded-md p-5 sm:p-6 relative overflow-hidden"
              style={{ zIndex: 10 }}
            >
              {/* top color bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800" />

              {/* Ticket header */}
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono">
                  FM Ticket #{ticket.id.toUpperCase()}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-semibold">
                  {ticket.location}
                </span>
                <span className="ml-auto text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  live
                </span>
              </div>

              {/* Job */}
              <div className="rounded-md bg-zinc-50 border border-zinc-200 p-4 mb-6 flex items-start gap-3">
                <div className="shrink-0 mt-0.5 text-zinc-500"><ticket.icon size={20} /></div>
                <div className="text-[16px] text-zinc-900 leading-relaxed font-medium">
                  {ticket.job}
                </div>
              </div>

              {/* Judgement pad (4 options) */}
              {!judgement && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400 mb-2">
                    Select the right tool
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {Object.entries(AI_TYPES).map(([key, t]) => {
                      const TIcon = t.icon;
                      return (
                        <motion.button
                          key={key}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => judge(key)}
                          className="rounded-md px-3 py-3 border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 transition flex flex-col items-center justify-center gap-1.5 group shadow-[0_1px_2px_rgba(0,0,0,0.02)] text-zinc-700"
                        >
                          <TIcon size={20} className="group-hover:scale-110 transition text-zinc-500" strokeWidth={2} />
                          <span className="font-bold text-[14.5px] text-zinc-900 leading-tight">{t.name}</span>
                          <span className="text-[11px] text-zinc-400 leading-tight hidden sm:block">{t.blurb}</span>
                        </motion.button>
                      );
                    })}
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
                    className={`rounded-md border p-4 ${
                      accent === 'correct' ? 'border-zinc-200 bg-zinc-50' : 'border-red-200 bg-red-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 w-8 h-8 rounded flex items-center justify-center text-white text-base font-bold shadow-sm ${
                        accent === 'correct' ? 'bg-zinc-800' : 'bg-red-500'
                      }`}>
                        {accent === 'correct' ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[10.5px] font-bold uppercase tracking-[0.16em] mb-1.5 ${
                          accent === 'correct' ? 'text-zinc-800' : 'text-red-600'
                        }`}>
                          {accent === 'correct' ? 'Spot on' : 'Not quite right'}
                        </div>
                        <div className="text-[13.5px] text-zinc-800 leading-relaxed">
                          {ticket.why}
                        </div>
                        
                        {accent === 'wrong' && (() => {
                          const RealIcon = AI_TYPES[ticket.correctAnswer].icon;
                          return (
                            <div className="mt-3 inline-flex items-center gap-2 text-[12.5px] bg-white border border-zinc-200 shadow-sm rounded p-1.5 pr-3">
                              <span className="w-6 h-6 rounded flex items-center justify-center bg-zinc-100 text-zinc-600"><RealIcon size={14} /></span>
                              <span className="text-zinc-500">Correct tool:</span>
                              <span className="font-bold text-zinc-900">
                                {AI_TYPES[ticket.correctAnswer].name}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex justify-end mt-4">
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
              className="bg-white border border-zinc-200 shadow-sm rounded-md p-6 sm:p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800" />
              <div className="flex justify-center mb-5 text-zinc-800">
                {correctSoFar === TICKETS.length ? <Trophy size={48} strokeWidth={1.5} /> : correctSoFar >= TICKETS.length - 2 ? <Target size={48} strokeWidth={1.5} /> : <BookOpen size={48} strokeWidth={1.5} />}
              </div>
              <div className="font-display font-bold text-2xl mb-2 text-zinc-900">
                {correctSoFar} / {TICKETS.length} tickets cleared
              </div>
              <div className="text-zinc-500 text-[14px] mb-6 max-w-sm mx-auto leading-relaxed">
                {correctSoFar === TICKETS.length
                  ? 'Flawless. You clearly know your FM AI tools.'
                  : correctSoFar >= TICKETS.length - 2
                  ? 'Solid job. A few sneaked by, but you get the idea.'
                  : 'Basics covered. Remember: use the right tool for the job.'}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {history.map((h) => (
                  <div
                    key={h.id}
                    className={`w-7 h-7 rounded flex items-center justify-center text-white text-xs font-bold shadow-sm ${
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <TakeawayCard
            application="Predictive/vision/rules for ops data. Gen AI for text. Pick the right tool."
          >
            <strong>Gen AI isn't for everything.</strong> It writes and summarizes.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>
              Complete & Return →
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </div>
  );
}
