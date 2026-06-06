import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton, SiteChip } from './Common';
import { User, HardHat, Mic, Smile, Check } from 'lucide-react';

const BASE_PROMPT = 'Write a 3-line internal note about tomorrow’s 2-hour power shutdown at Block 71 for lift maintenance.';

const PERSONAS = [
  {
    id: 'none',
    label: 'No persona',
    sub: '(default ChatGPT voice)',
    icon: User,
    output: `Hello everyone! Just a friendly heads-up that tomorrow, there will be a planned power shutdown at Block 71 for around 2 hours due to scheduled lift maintenance work. We sincerely apologise for any inconvenience this might cause and we truly appreciate your kind patience and understanding during this time. Should you have any further queries or concerns, please feel free to reach out to us at any time. Thank you!`,
    critique: 'Generic, wordy. Could be any building. Lacks specific actionable details.',
  },
  {
    id: 'engineer',
    label: 'Senior FM engineer',
    sub: '"Act as a senior FM engineer briefing your duty team."',
    icon: HardHat,
    output: `FYI team — tomorrow 0900–1100, Block 71 lift maintenance, mains off. Pre-shut: secure UPS for fire alarm panel and CCTV NVR. Standby genset on auto. Brief Tower A reception to redirect tenants to stairs B/C. Lift vendor on-site by 0830.`,
    critique: 'Operational and action-oriented. Bulleted facts. Forwardable directly to a duty crew.',
  },
  {
    id: 'comms',
    label: 'JTC corporate comms officer',
    sub: '"Act as a corporate communications officer for JTC tenants."',
    icon: Mic,
    output: `Dear Tenants, please be informed that a 2-hour scheduled power shutdown will be carried out at Block 71 on Saturday, 0900–1100, for essential lift maintenance. We kindly request that you save your work and switch off sensitive equipment in advance. For urgent matters, contact the FM Helpdesk at 6XXX-XXXX. Thank you for your kind understanding.`,
    critique: 'Polished, polite, yet directive ("save your work... switch off"). Ideal for tenant communications.',
  },
  {
    id: 'concierge',
    label: 'Friendly concierge',
    sub: '"Act as a warm, plain-English building concierge."',
    icon: Smile,
    output: `Hi all! Quick heads-up — the lifts at Block 71 will be down tomorrow (Sat) from 9 to 11am for a service. Power will be off in that window, so save your work and bring a coffee for the stairs. Buzz the desk if you need anything.`,
    critique: 'Conversational. Suitable for casual tenant group chats, not for formal notices.',
  },
];

export default function LevelPersona({ onComplete }) {
  const [picked, setPicked] = useState(null);
  const [streamed, setStreamed] = useState('');
  const intervalRef = useRef(null);
  const [seen, setSeen] = useState(new Set());

  const current = picked ? PERSONAS.find((p) => p.id === picked) : null;
  const CurrentIcon = current?.icon;

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
      <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight mb-4 leading-[1.05] text-zinc-900">
        Give the AI a job. <span className="text-zinc-400">Set the Persona.</span>
      </h2>
      <p className="text-zinc-500 text-[17px] max-w-2xl mb-10 leading-relaxed">
        Toggle the role, audience, and tone modifiers to see how the AI's persona shifts. Same prompt, totally different tone. The cheapest prompting upgrade you can make.
      </p>

      <div className="bg-white border border-zinc-200 shadow-sm rounded-md p-4 sm:p-5 mb-4">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-2">📝 Same prompt every time</div>
        <div className="font-mono text-[13px] bg-zinc-50 rounded-md p-3 border border-zinc-200 text-zinc-800">
          "{BASE_PROMPT}"
        </div>
        <div className="mt-2 text-[12px] text-zinc-500 flex items-center gap-2">
          <span>Scenario:</span> <SiteChip /> <span>· Saturday lift maintenance</span>
        </div>
      </div>

      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-2.5">
        Cast a persona — tap to re-run
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {PERSONAS.map((p) => {
          const active = picked === p.id;
          const wasSeen = seen.has(p.id);
          const PIcon = p.icon;
          return (
            <motion.button
              key={p.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(p.id)}
              className={`rounded-md p-3 border text-left transition-all shadow-sm ${
                active ? 'border-zinc-800 bg-zinc-100 text-zinc-900' : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <PIcon size={20} className={active ? 'text-zinc-900' : 'text-zinc-600'} />
                {wasSeen && !active && <Check size={14} className="text-zinc-400" strokeWidth={3} />}
              </div>
              <div className="font-semibold text-[12.5px] leading-tight mb-0.5">{p.label}</div>
              <div className="text-[10.5px] text-zinc-500 leading-tight">{p.sub}</div>
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
            className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden mb-4 relative"
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-zinc-800`} />
            <div className="px-4 sm:px-5 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center gap-2.5">
              <CurrentIcon size={18} className="text-zinc-700" />
              <div className="min-w-0">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-900">AI output as {current.label}</div>
                <div className="text-[10.5px] text-zinc-500 truncate">{current.sub}</div>
              </div>
              <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />live
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 rounded-md bg-zinc-50 border border-zinc-200 p-6">
                <div className="text-[13.5px] leading-relaxed text-zinc-900 whitespace-pre-wrap min-h-[80px] caret">
                  {streamed}
                </div>
              </div>
              {streamed === current.output && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 pt-3 border-t border-zinc-200 text-[12.5px] text-zinc-600 leading-relaxed flex gap-2"
                >
                  <span className="font-semibold text-zinc-900 shrink-0">Notice: </span>
                  <span>{current.critique}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!current && (
        <div className="rounded-md border border-dashed border-zinc-300 p-5 mb-4 text-center text-zinc-500 text-[13.5px]">
          ↑ Pick any persona above to see the AI re-run with that role.
        </div>
      )}

      {/* Progress hint */}
      <div className="flex items-center justify-between mb-2 text-[12px] text-zinc-500">
        <span>
          Try at least 3 to see the spread —{' '}
          <span className="font-semibold text-zinc-900 font-mono">{seen.size} / {PERSONAS.length}</span> explored
        </span>
        <div className="flex gap-1">
          {PERSONAS.map((p) => (
            <div key={p.id} className={`w-2 h-2 rounded-full transition ${seen.has(p.id) ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          ))}
        </div>
      </div>

      {seen.size >= 3 && (
        <>
          <TakeawayCard
            application='Start every prompt with "Act as a [role]...". One sentence shifts tone, vocabulary, and structure.'
          >
            <strong>Persona before instruction.</strong> Cast the role on purpose.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Topic →</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
