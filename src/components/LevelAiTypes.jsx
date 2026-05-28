import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const AI_TYPES = [
  { id: 'rules',      name: 'Rule-Based', emoji: '📏', blurb: 'If-this-then-that. No learning.' },
  { id: 'predictive', name: 'Predictive', emoji: '📈', blurb: 'Forecasts from past data.' },
  { id: 'vision',     name: 'Vision',     emoji: '👁️', blurb: 'Reads images & video.' },
  { id: 'genai',      name: 'Gen AI',     emoji: '✨', blurb: 'Writes new content.' },
];

const CARDS = [
  {
    id: 's1',
    location: 'Jurong East',
    icon: '🌡️',
    prompt: 'Auto-escalate to technician when the AHU room crosses 30°C for 10 minutes.',
    answer: 'rules',
    correct: 'Classic if-this-then-that. Like a very strict auntie — no debate, just action.',
    wrong: { rules: '', predictive: 'No forecasting here — it just reacts to a threshold.', vision: 'No image involved, just a temperature reading.', genai: 'No writing required — just trigger an alert.' },
  },
  {
    id: 's2',
    location: 'Punggol',
    icon: '❄️',
    prompt: 'Forecast tomorrow\'s chilled-water demand from weather, occupancy and past logs.',
    answer: 'predictive',
    correct: 'Spot on. Pattern-spotting from history. Weather-app energy for your chiller plant.',
    wrong: { rules: 'Rules can\'t learn from patterns — they only follow fixed thresholds.', predictive: '', vision: 'No images here, just numbers and timestamps.', genai: 'Gen AI writes prose — it doesn\'t forecast load.' },
  },
  {
    id: 's3',
    location: 'Tampines',
    icon: '🗑️',
    prompt: 'Scan CCTV frames to flag overflowing bins and corridor obstruction.',
    answer: 'vision',
    correct: 'Eyes on-site without 200 eyeballs on payroll.',
    wrong: { rules: 'A rule needs a clean signal — pixels aren\'t one.', predictive: 'Not forecasting — this is detection on live footage.', vision: '', genai: 'Gen AI doesn\'t look at CCTV. It writes text.' },
  },
  {
    id: 's4',
    location: 'One-North',
    icon: '✉️',
    prompt: 'Draft a tenant circular for lift maintenance — concise, polite, professional.',
    answer: 'genai',
    correct: 'Yup, Gen AI. It writes. (It does NOT magically verify facts though — that\'s on you.)',
    wrong: { rules: 'A rule can\'t compose prose.', predictive: 'No forecasting — just drafting copy.', vision: 'No image, just words.', genai: '' },
  },
];

export default function LevelAiTypes({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]); // { cardId, firstTry: boolean }
  const [shakeKey, setShakeKey] = useState(0);

  const card = CARDS[idx];
  const done = idx >= CARDS.length;

  function choose(typeId) {
    if (picked) return;
    const isCorrect = typeId === card.answer;
    setPicked(typeId);
    setFeedback({ correct: isCorrect, message: isCorrect ? card.correct : card.wrong[typeId] });
    if (!isCorrect) {
      setShakeKey((k) => k + 1);
    }
  }

  function next() {
    const wasFirstTry = picked === card.answer && !history.find((h) => h.cardId === card.id);
    setHistory((h) => [...h, { cardId: card.id, firstTry: wasFirstTry, choice: card.answer }]);
    setPicked(null);
    setFeedback(null);
    setIdx((i) => i + 1);
  }

  function tryAgain() {
    setPicked(null);
    setFeedback(null);
  }

  const firstTryCount = history.filter((h) => h.firstTry).length;

  return (
    <div>
      <LevelHeader level={1} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Not all AI is Gen AI. <span className="text-L1">Pick the right brain.</span>
      </h2>

      <ConceptCard accent="L1" icon="🧭" title="AI is a toolbox, not one magic button.">
        Rules for triggers. Predictive for forecasting. Vision for eyes. Gen AI for words.
        <strong> Pick the right one.</strong>
      </ConceptCard>

      {/* Type legend — compact horizontal */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {AI_TYPES.map((t) => (
          <div key={t.id} className="rounded-xl border border-line bg-white p-2.5">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-base">{t.emoji}</span>
              <span className="font-semibold text-[12.5px] text-ink">{t.name}</span>
            </div>
            <div className="text-[11px] text-muted leading-snug">{t.blurb}</div>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          Scenario {Math.min(idx + 1, CARDS.length)} of {CARDS.length}
        </div>
        <div className="flex items-center gap-1.5">
          {CARDS.map((c, i) => {
            const past = history.find((h) => h.cardId === c.id);
            return (
              <div
                key={c.id}
                className={`h-1.5 rounded-full transition-all ${
                  past ? (past.firstTry ? 'bg-win w-6' : 'bg-L3 w-6') :
                  i === idx ? 'bg-L1 w-8' : 'bg-line w-4'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Card stack */}
      <div className="relative" style={{ minHeight: 340 }}>
        <AnimatePresence mode="wait">
          {!done && (
            <motion.div
              key={card.id + '-' + shakeKey}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{
                opacity: 1, y: 0, scale: 1,
                x: feedback && !feedback.correct ? [0, -8, 8, -6, 6, 0] : 0,
              }}
              exit={{ opacity: 0, y: -40, scale: 0.96, transition: { duration: 0.28 } }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="card-strong p-5 sm:p-6 relative overflow-hidden"
            >
              {/* decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-L1 via-L2 to-L3" />

              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cream border border-line flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-soft">FM Scenario</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream border border-line text-muted font-semibold">
                      🇸🇬 {card.location}
                    </span>
                  </div>
                  <div className="text-[15px] sm:text-[16px] text-ink leading-relaxed font-medium">
                    "{card.prompt}"
                  </div>
                </div>
              </div>

              {/* Choice chips */}
              {!feedback && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted mb-2.5 text-center">
                    👇 Which AI fits?
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AI_TYPES.map((t) => (
                      <motion.button
                        key={t.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => choose(t.id)}
                        className="rounded-xl px-2 py-3 border-2 border-line bg-white text-ink font-semibold text-[12.5px] hover:border-L1 hover:bg-L1/5 transition flex flex-col items-center gap-1"
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <span>{t.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`rounded-xl border-2 p-3.5 ${
                      feedback.correct ? 'border-win/40 bg-win/[0.07]' : 'border-L3/40 bg-L3/[0.06]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        feedback.correct ? 'bg-win' : 'bg-L3'
                      }`}>
                        {feedback.correct ? '✓' : '↻'}
                      </div>
                      <div className="flex-1">
                        <div className={`text-[10.5px] font-bold uppercase tracking-[0.16em] mb-0.5 ${
                          feedback.correct ? 'text-win' : 'text-L3'
                        }`}>
                          {feedback.correct ? 'Got it' : 'Try again'}
                        </div>
                        <div className="text-[13.5px] text-ink/85 leading-relaxed">
                          {feedback.correct
                            ? feedback.message
                            : <>That's <strong>{AI_TYPES.find((t) => t.id === picked).name}</strong> territory. {feedback.message}</>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      {feedback.correct ? (
                        <button
                          onClick={next}
                          className="px-4 py-2 rounded-lg bg-ink text-white font-semibold text-[13px] hover:bg-black transition shadow-pop"
                        >
                          {idx === CARDS.length - 1 ? 'Finish →' : 'Next scenario →'}
                        </button>
                      ) : (
                        <button
                          onClick={tryAgain}
                          className="px-4 py-2 rounded-lg bg-L3 text-white font-semibold text-[13px] hover:bg-[#4338CA] transition shadow-pop"
                        >
                          ↻ Try again
                        </button>
                      )}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-win to-L1" />
              <div className="text-5xl mb-3">🎉</div>
              <div className="font-display font-bold text-2xl mb-1">All four sorted.</div>
              <div className="text-muted text-[14px] mb-4">
                {firstTryCount === CARDS.length
                  ? 'Clean sweep — first try on every one. Pro.'
                  : firstTryCount >= CARDS.length - 1
                  ? 'Almost a clean sweep. Well done.'
                  : 'Sorted. That second-try learning sticks too.'}
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cream border border-line text-[12px] font-mono">
                <span className="text-soft">First-try score:</span>
                <span className="font-bold text-ink">{firstTryCount} / {CARDS.length}</span>
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
        application="Predictive/vision/rules for ops decisions. Gen AI for words. Don't use a chainsaw to butter toast."
      >
        <strong>Gen AI is one slice of the AI pie.</strong> Right brain, right job.
      </TakeawayCard>
    </div>
  );
}
