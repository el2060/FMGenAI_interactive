import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton, SiteChip } from './Common';

const FIRST_DRAFT = `Dear Tenant,

Thank you for reaching out regarding the matter at hand. Please be advised that the lift maintenance scheduled for tomorrow is necessary for the continued safe operation of the building. We sincerely appreciate your patience and understanding during this period of inconvenience. Should you have further questions or concerns, kindly do not hesitate to contact us at your earliest convenience.

Yours sincerely,
Facilities Management Team`;

const REFINEMENTS = [
  {
    id: 'bullets',
    label: 'Make it 3 bullets',
    icon: '📍',
    follow: 'Reformat as 3 short bullet points. Skip the salutation block.',
    output: `• Lift maintenance tomorrow 0900–1100. Plan around it.
• Power off during this window — save your work in advance.
• Issues during the shutdown? Call FM Helpdesk 6XXX-XXXX.`,
    why: 'Action-first, scannable. Tenants get the gist in 3 seconds.',
  },
  {
    id: 'shorter',
    label: 'Cut by half',
    icon: '✂️',
    follow: 'Cut this in half. Keep facts, drop pleasantries.',
    output: `Lift maintenance at Block 71 tomorrow, 0900–1100. Power off in that window — save your work. Helpdesk: 6XXX-XXXX.`,
    why: 'Pure information density. Use this for SMS or Telegram broadcasts.',
  },
  {
    id: 'singlish',
    label: 'Add an SLA line',
    icon: '⏱️',
    follow: 'Add a clear "we will respond within 4 working hours" service-level line at the end.',
    output: `Dear Tenant,

Lift maintenance is scheduled for tomorrow, 0900–1100, at Block 71. Power will be off during this period — please save your work and switch off sensitive equipment.

For urgent matters, contact FM Helpdesk at 6XXX-XXXX. We commit to responding to all queries within 4 working hours.

Regards,
FM Team`,
    why: 'Adds accountability. Tenants stop chasing you when they know the SLA.',
  },
  {
    id: 'plain',
    label: 'Remove jargon',
    icon: '📖',
    follow: 'Rewrite for a non-technical tenant. No FM jargon.',
    output: `Hi everyone,

Tomorrow morning between 9am and 11am, the lifts at Block 71 will be off for a planned service. The power in your unit will be off during that 2 hours too — please save your work and switch off anything sensitive (PCs, lab equipment, etc.) before then.

Need help? Call the building office at 6XXX-XXXX.

Thanks,
FM Team`,
    why: 'Plain English. Most tenants are not engineers — write for them.',
  },
  {
    id: 'urgent',
    label: 'Make it more urgent',
    icon: '🚨',
    follow: 'Rewrite with urgency — this affects critical lab equipment in two units.',
    output: `URGENT — power shutdown tomorrow

Block 71 power will be OFF tomorrow 0900–1100 for lift maintenance. This affects critical lab equipment in #08-21 and #15-23.

ACTION BEFORE 0830:
1. Back up data and shut down workstations
2. Power down lab freezers? Confirm with PI first
3. Switch UPS to bypass if any

FM duty officer on-site from 0800. Hotline: 6XXX-XXXX.`,
    why: 'When stakes are real, ditch the politeness padding. Lead with the action list.',
  },
];

function streamInto(target, fullText, speed = 12) {
  let i = 0;
  return setInterval(() => {
    i += 6;
    target(fullText.slice(0, i));
    if (i >= fullText.length) {
      target(fullText);
    }
  }, speed);
}

export default function LevelIterate({ onComplete }) {
  const [draft, setDraft] = useState(FIRST_DRAFT);
  const [streaming, setStreaming] = useState(FIRST_DRAFT);
  const [turns, setTurns] = useState([{ role: 'ai', text: FIRST_DRAFT, refId: 'first' }]);
  const [active, setActive] = useState(null);
  const [used, setUsed] = useState(new Set());
  const intervalRef = useRef(null);
  const scrollerRef = useRef(null);

  function applyRefinement(r) {
    if (active) return;
    setActive(r.id);
    // Push the user's follow-up turn
    setTurns((t) => [...t, { role: 'user', text: r.follow }]);
    // Stream the new draft
    clearInterval(intervalRef.current);
    setDraft(r.output);
    setStreaming('');
    intervalRef.current = streamInto((s) => setStreaming(s), r.output);
    const totalMs = (r.output.length / 6) * 12 + 200;
    setTimeout(() => {
      setTurns((t) => [...t, { role: 'ai', text: r.output, refId: r.id }]);
      setUsed((u) => new Set([...u, r.id]));
      setActive(null);
    }, totalMs);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [turns.length, streaming]);

  const usedCount = used.size;
  const lastRefinement = turns.filter((t) => t.role === 'ai').slice(-1)[0];
  const lastWhy = lastRefinement?.refId && lastRefinement.refId !== 'first'
    ? REFINEMENTS.find((r) => r.id === lastRefinement.refId)?.why
    : null;

  return (
    <div>
      <LevelHeader level={7} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        First draft is a starting point. <span className="text-L7">Refine, don't restart.</span>
      </h2>

      <p className="text-muted text-[15px] max-w-2xl mb-6">
        <strong>Prompting is a conversation.</strong> New users accept the first draft and complain. Pros nudge the AI: "shorter", "drop jargon", "add SLA". Refining is faster than starting over.
      </p>

      <div className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-muted mb-2 flex items-center gap-2">
        <span>💬 Chat with AI</span>
        <SiteChip />
      </div>

      <div className="card-strong overflow-hidden mb-4">
        {/* Chat scroll */}
        <div ref={scrollerRef} className="max-h-[420px] overflow-y-auto p-4 space-y-3 bg-cream/40">
          {turns.map((t, i) => {
            const isAi = t.role === 'ai';
            const isLast = i === turns.length - 1;
            const isStreaming = isAi && isLast && active;
            const text = isStreaming ? streaming : t.text;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-2.5 ${isAi ? '' : 'flex-row-reverse'}`}
              >
                <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                  isAi ? 'bg-L7 text-white' : 'bg-ink text-white'
                }`}>
                  {isAi ? 'AI' : 'You'}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                  isAi ? 'bg-white border border-line text-ink' : 'bg-ink text-white'
                } ${isStreaming ? 'caret' : ''}`}>
                  {text}
                </div>
              </motion.div>
            );
          })}
          {active && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[11px] text-soft pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-L7 animate-pulse" />
              <span>AI is refining…</span>
            </motion.div>
          )}
        </div>

        {/* Why-it-changed (after each settle) */}
        <AnimatePresence>
          {lastWhy && !active && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-line bg-L7/5 px-4 py-2.5 text-[12.5px] text-ink/85 flex gap-2"
            >
              <span>💡</span>
              <span><span className="font-semibold">Why this works: </span>{lastWhy}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick-action chips */}
        <div className="border-t border-line p-3 bg-white">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted mb-2">
            Quick refinements
          </div>
          <div className="flex flex-wrap gap-2">
            {REFINEMENTS.map((r) => {
              const isUsed = used.has(r.id);
              return (
                <motion.button
                  key={r.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  disabled={!!active}
                  onClick={() => applyRefinement(r)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold border transition disabled:opacity-50 ${
                    isUsed ? 'border-line bg-cream text-soft' : 'border-L7/30 bg-white text-L7 hover:bg-L7/5 hover:border-L7'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                  {isUsed && <span className="text-win text-[10px]">✓</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 text-[12px] text-muted mb-3">
        <span>
          Try at least 3 refinements —{' '}
          <span className="font-semibold text-ink font-mono">{usedCount} / {REFINEMENTS.length}</span> tried
        </span>
        <div className="flex gap-1">
          {REFINEMENTS.map((r) => (
            <div key={r.id} className={`w-2 h-2 rounded-full ${used.has(r.id) ? 'bg-L7' : 'bg-line'}`} />
          ))}
        </div>
      </div>

      {usedCount >= 3 && (
        <>
          <TakeawayCard
            accent="L7"
            application='Stop rewriting. Send the draft back: "shorter", "direct", "no jargon".'
          >
            <strong>Iterate, don't restart.</strong> Five quick turns beats five fresh prompts.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete} accent="L7">Next Level →</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
