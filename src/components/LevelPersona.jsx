import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton, SiteChip } from './Common';

const BASE_PROMPT = 'Write a 3-line internal note about tomorrow’s 2-hour power shutdown at Block 71 for lift maintenance.';

const PERSONAS = [
  {
    id: 'none',
    label: 'No persona',
    sub: '(default ChatGPT voice)',
    icon: '🤷',
    emoji: '',
    output: `Hello everyone! Just a friendly heads-up that tomorrow, there will be a planned power shutdown at Block 71 for around 2 hours due to scheduled lift maintenance work. We sincerely apologise for any inconvenience this might cause and we truly appreciate your kind patience and understanding during this time. Should you have any further queries or concerns, please feel free to reach out to us at any time. Thank you!`,
    critique: 'Default tone = wordy, generic, "thank you for your kind patience." Could be any building. Could be any topic.',
    tone: 'bg-line text-soft',
  },
  {
    id: 'engineer',
    label: 'Senior FM engineer',
    sub: '"Act as a senior FM engineer briefing your duty team."',
    icon: '👷‍♂️',
    output: `FYI team — tomorrow 0900–1100, Block 71 lift maintenance, mains off. Pre-shut: secure UPS for fire alarm panel and CCTV NVR. Standby genset on auto. Brief Tower A reception to redirect tenants to stairs B/C. Lift vendor on-site by 0830.`,
    critique: 'Operational. Bullets-of-the-mind voice. Specifies actions, times, equipment. This is what gets forwarded to a duty crew without edits.',
    tone: 'bg-L4/10 text-L4',
  },
  {
    id: 'comms',
    label: 'JTC corporate comms officer',
    sub: '"Act as a corporate communications officer for JTC tenants."',
    icon: '🎙️',
    output: `Dear Tenants, please be informed that a 2-hour scheduled power shutdown will be carried out at Block 71 on Saturday, 0900–1100, for essential lift maintenance. We kindly request that you save your work and switch off sensitive equipment in advance. For urgent matters, contact the FM Helpdesk at 6XXX-XXXX. Thank you for your kind understanding.`,
    critique: 'Polished, polite, agency-appropriate. The tone you would actually send to JTC tenants. Notice the action-oriented "save your work… switch off…" — directive but courteous.',
    tone: 'bg-L4/10 text-L4',
  },
  {
    id: 'concierge',
    label: 'Friendly concierge',
    sub: '"Act as a warm, plain-English building concierge."',
    icon: '🙂',
    output: `Hi all! Quick heads-up — the lifts at Block 71 will be down tomorrow (Sat) from 9 to 11am for a service. Power will be off in that window, so save your work and bring a coffee for the stairs 😄. Buzz the desk if you need anything.`,
    critique: 'Conversational. Works for younger startups or casual co-working tenants. Not appropriate for a formal government recipient list, but perfect for a tenant Telegram group.',
    tone: 'bg-L4/10 text-L4',
  },
];

const KEY_DIFFS = [
  { persona: 'engineer', highlight: 'Pre-shut: secure UPS', why: 'Operational specifics only an engineer would surface.' },
  { persona: 'comms',    highlight: 'save your work and switch off sensitive equipment', why: 'Comms framing — tells tenants what to DO.' },
  { persona: 'concierge', highlight: 'bring a coffee for the stairs 😄', why: 'Casual humour — would never appear in formal comms.' },
];

export default function LevelPersona({ onComplete }) {
  const [picked, setPicked] = useState(null);
  const [streamed, setStreamed] = useState('');
  const intervalRef = useRef(null);
  const [seen, setSeen] = useState(new Set());

  const current = picked ? PERSONAS.find((p) => p.id === picked) : null;
  const allSeen = seen.size === PERSONAS.length;

  useEffect(() => {
    if (!current) return;
    setStreamed('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 5;
      setStreamed(current.output.slice(0, i));
      if (i >= current.output.length) clearInterval(intervalRef.current);
    }, 12);
    return () => clearInterval(intervalRef.current);
  }, [picked, current]);

  function choose(id) {
    setPicked(id);
    setSeen((s) => new Set([...s, id]));
  }

  return (
    <div>
      <LevelHeader level={4} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Cast the role. <span className="text-L4">Watch the voice flip.</span>
      </h2>

      <ConceptCard accent="L4" icon="🎭" title="Persona is a free knob with huge effect.">
        Tell AI <em>who</em> it should be before you tell it what to do. Same prompt,
        same facts, totally different tone. <strong>The cheapest prompting upgrade you can make.</strong>
      </ConceptCard>

      <div className="card-strong p-4 sm:p-5 mb-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted mb-2">📝 Same prompt every time</div>
        <div className="font-mono text-[13px] bg-cream rounded-lg p-3 border border-line text-ink/85">
          "{BASE_PROMPT}"
        </div>
        <div className="mt-2 text-[12px] text-soft flex items-center gap-2">
          <span>Scenario:</span> <SiteChip /> <span>· Saturday lift maintenance</span>
        </div>
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-2.5">
        🎬 Cast a persona — tap to re-run
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {PERSONAS.map((p) => {
          const active = picked === p.id;
          const wasSeen = seen.has(p.id);
          return (
            <motion.button
              key={p.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(p.id)}
              className={`rounded-xl p-3 border-2 text-left transition-all ${
                active ? 'border-L4 bg-L4/[0.07] shadow-pop' : 'border-line bg-white hover:border-L4/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-2xl">{p.icon}</span>
                {wasSeen && !active && <span className="text-[10px] text-win font-bold">✓</span>}
              </div>
              <div className="font-semibold text-[12.5px] leading-tight mb-0.5">{p.label}</div>
              <div className="text-[10.5px] text-soft leading-tight">{p.sub}</div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="card-strong overflow-hidden mb-4"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-L4`} />
            <div className="px-4 sm:px-5 py-3 border-b border-line bg-gradient-to-r from-L4/5 to-transparent flex items-center gap-2.5">
              <span className="text-xl">{current.icon}</span>
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-L4">AI output as {current.label}</div>
                <div className="text-[10.5px] text-soft truncate">{current.sub}</div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[10px] text-soft font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />live
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-[13.5px] leading-relaxed text-ink whitespace-pre-wrap min-h-[80px] caret">
                {streamed}
              </div>
              {streamed === current.output && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 pt-3 border-t border-line text-[12.5px] text-muted leading-relaxed flex gap-2"
                >
                  <span className="text-base">💭</span>
                  <span><span className="font-semibold text-ink">Notice: </span>{current.critique}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!current && (
        <div className="card p-5 mb-4 border-dashed text-center text-soft text-[13.5px]">
          ↑ Pick any persona above to see the AI re-run with that role.
        </div>
      )}

      {/* Progress hint */}
      <div className="flex items-center justify-between mb-2 text-[12px] text-muted">
        <span>
          Try at least 3 to see the spread —{' '}
          <span className="font-semibold text-ink font-mono">{seen.size} / {PERSONAS.length}</span> explored
        </span>
        <div className="flex gap-1">
          {PERSONAS.map((p) => (
            <div key={p.id} className={`w-2 h-2 rounded-full transition ${seen.has(p.id) ? 'bg-L4' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={onComplete} disabled={seen.size < 3} accent="L4">
          {seen.size < 3 ? `Try ${3 - seen.size} more` : 'Next Level →'}
        </PrimaryButton>
      </div>

      <TakeawayCard
        accent="L4"
        application='Start every serious prompt with "Act as a [role]…". One sentence shifts tone, vocabulary and structure for free.'
      >
        <strong>Persona before instruction.</strong> Same prompt, four voices. Cast it on purpose.
      </TakeawayCard>
    </div>
  );
}
