import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const AI_TYPES = [
  {
    id: 'rules',
    name: 'Rule-Based AI',
    emoji: '📏',
    blurb: 'If this happens, do that. No learning, just logic and guardrails.',
  },
  {
    id: 'predictive',
    name: 'Predictive AI',
    emoji: '📈',
    blurb: 'Learns patterns from historical data to forecast what is likely next.',
  },
  {
    id: 'vision',
    name: 'Computer Vision AI',
    emoji: '👁️',
    blurb: 'Reads images and video to detect objects, defects, and events.',
  },
  {
    id: 'genai',
    name: 'Generative AI',
    emoji: '✨',
    blurb: 'Creates new content like emails, summaries, SOP drafts, and chatbot replies.',
  },
];

const SCENARIOS = [
  {
    id: 's1',
    location: 'Jurong East',
    prompt: 'Auto-escalate to technician if the AHU room crosses 30°C for 10 minutes.',
    answer: 'rules',
    fun: 'Classic rule engine. Like a very strict auntie: no discussion, just action.',
  },
  {
    id: 's2',
    location: 'Punggol',
    prompt: 'Forecast tomorrow chilled-water demand from weather, occupancy, and past logs.',
    answer: 'predictive',
    fun: 'This is pattern spotting. Think weather app for your chiller plant.',
  },
  {
    id: 's3',
    location: 'Tampines',
    prompt: 'Scan CCTV frames to flag overflowing bins and corridor obstruction.',
    answer: 'vision',
    fun: 'Eyes on-site without 200 eyeballs on payroll.',
  },
  {
    id: 's4',
    location: 'One-North',
    prompt: 'Draft a tenant circular for lift maintenance in concise, polite Singlish-lite tone.',
    answer: 'genai',
    fun: 'Yup, this is Gen AI. It writes. It does not magically verify facts though.',
  },
];

export default function LevelAiTypes({ onComplete }) {
  const [answers, setAnswers] = useState({});

  const score = useMemo(
    () => SCENARIOS.filter((s) => answers[s.id] === s.answer).length,
    [answers]
  );
  const done = score === SCENARIOS.length;

  function choose(scenarioId, typeId) {
    setAnswers((prev) => ({ ...prev, [scenarioId]: typeId }));
  }

  return (
    <div>
      <LevelHeader level={1} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Not all AI is Gen AI. <span className="text-L1">Know the species first.</span>
      </h2>

      <ConceptCard accent="L1" icon="🧭" title="AI is a toolbox, not one magic button.">
        Different jobs, different brains. Rules for triggers, predictive for forecasting,
        vision for eyes, Gen AI for words. <strong>Pick the right one.</strong>
      </ConceptCard>

      <p className="text-muted mb-5 text-[14.5px] leading-relaxed">
        Match each scenario to its AI type. Wrong? Just tap again — no scorecard, no shame.
      </p>

      <div className="card p-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-3">🧩 AI Type Legend</div>
        <div className="grid sm:grid-cols-2 gap-3">
          {AI_TYPES.map((t) => (
            <div key={t.id} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-lg">{t.emoji}</span>
                <span className="font-semibold text-[14px] text-ink">{t.name}</span>
              </div>
              <div className="text-[12.5px] text-muted leading-relaxed">{t.blurb}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3.5 mb-5">
        {SCENARIOS.map((s, idx) => {
          const picked = answers[s.id];
          const correct = picked === s.answer;
          return (
            <motion.div
              key={s.id}
              layout
              className={`card p-4 border-2 ${
                !picked ? 'border-line' : correct ? 'border-win/40 bg-win/[0.04]' : 'border-L6/30 bg-L6/[0.04]'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-soft">Scenario {idx + 1}</span>
                <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-cream border border-line text-muted font-semibold">
                  🇸🇬 {s.location}
                </span>
              </div>

              <div className="text-[14px] text-ink leading-relaxed mb-3">{s.prompt}</div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AI_TYPES.map((t) => {
                  const isPicked = picked === t.id;
                  const isAnswer = s.answer === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => choose(s.id, t.id)}
                      className={`rounded-lg px-2.5 py-2 text-[12px] font-semibold border transition ${
                        isPicked && isAnswer
                          ? 'border-win bg-win/10 text-win'
                          : isPicked && !isAnswer
                          ? 'border-L6 bg-L6/10 text-L6'
                          : 'border-line bg-white text-ink hover:border-L1'
                      }`}
                    >
                      <span className="mr-1">{t.emoji}</span>
                      {t.name}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {picked && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-3 text-[12.5px] leading-relaxed rounded-lg p-2.5 border ${
                      correct ? 'border-win/30 bg-win/10 text-ink' : 'border-L6/30 bg-L6/10 text-ink'
                    }`}
                  >
                    {correct ? (
                      <span>
                        <strong className="text-win">Correct.</strong> {s.fun}
                      </span>
                    ) : (
                      <span>
                        <strong className="text-L6">Close, but not this one.</strong> This scenario maps best to{' '}
                        <strong>{AI_TYPES.find((t) => t.id === s.answer).name}</strong>. Try again.
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Matched:</span>
          <span className={`font-mono text-2xl font-extrabold ${done ? 'text-win' : 'text-L1'}`}>
            {score}/{SCENARIOS.length}
          </span>
        </div>
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
