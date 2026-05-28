import { useState, useEffect, useRef } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const TAGS = [
  { id: 'audience', label: 'Audience: JTC Tenants',           short: 'JTC Tenants',              emoji: '👥' },
  { id: 'tone',     label: 'Tone: Urgent but professional',   short: 'Urgent but professional',  emoji: '🎯' },
  { id: 'details',  label: 'Details: 2-hour DB box maintenance', short: '2-hour DB box maintenance', emoji: '🔌' },
];

const SLOTS = [
  { id: 'audience', placeholder: 'audience' },
  { id: 'tone',     placeholder: 'tone' },
  { id: 'details',  placeholder: 'details' },
];

const FINAL_OUTPUT = `Subject: [Scheduled] 2-Hour Power Shutdown for DB Box Maintenance — Action Required

Dear JTC Tenant,

Please be informed that a scheduled power shutdown will be carried out at your premises for essential DB (Distribution Board) box maintenance.

  • Duration: Approx. 2 hours
  • Affected: Lighting, lifts, aircon and office equipment
  • Action: Save your work, back up data and switch off sensitive equipment in advance

This maintenance is necessary to ensure continued electrical safety and reliability. We sincerely apologise for the inconvenience caused and appreciate your kind cooperation.

For urgent queries, please contact the FM Helpdesk.

Regards,
Facilities Management Team`;

function TagChip({ tag, placed, draggableProps }) {
  const baseCls = 'inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold border-2 transition select-none';
  if (placed) {
    return (
      <div className={`${baseCls} bg-cream border-dashed border-line text-soft line-through opacity-60`}>
        <span>{tag.emoji}</span><span>{tag.label}</span>
      </div>
    );
  }
  return (
    <div
      ref={draggableProps?.setNodeRef}
      {...(draggableProps?.listeners || {})}
      {...(draggableProps?.attributes || {})}
      style={{ touchAction: 'none' }}
      className={`${baseCls} bg-white border-ink/15 text-ink shadow-pop cursor-grab active:cursor-grabbing hover:border-L5 hover:-translate-y-0.5 ${draggableProps?.isDragging ? 'opacity-0' : ''}`}
    >
      <span className="text-base">{tag.emoji}</span>
      <span>{tag.label}</span>
    </div>
  );
}

function Draggable({ tag, placed }) {
  const props = useDraggable({ id: tag.id });
  return <TagChip tag={tag} placed={placed} draggableProps={props} />;
}

function DropSlot({ slot, placedTag, onClear, locked }) {
  const { isOver, setNodeRef } = useDroppable({ id: slot.id, disabled: locked });
  if (placedTag) {
    return (
      <motion.button
        layout
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
        onClick={() => onClear(slot.id)}
        disabled={locked}
        className="group inline-flex items-center gap-1.5 align-baseline mx-0.5 my-0.5 px-2.5 py-1 rounded-lg bg-L5/10 border-2 border-L5 text-L5 text-[13.5px] font-semibold hover:bg-L5/15 transition"
        title={locked ? '' : 'Click to remove'}
      >
        <span>{placedTag.emoji}</span><span>{placedTag.short}</span>
        {!locked && <span className="opacity-0 group-hover:opacity-60 text-[10px]">×</span>}
      </motion.button>
    );
  }
  return (
    <span
      ref={setNodeRef}
      className={`inline-flex items-center align-baseline mx-0.5 px-3 py-1 rounded-lg text-[13.5px] font-mono transition-all ${
        isOver ? 'bg-L5/15 border-2 border-solid border-L5 text-L5 scale-110' : 'border-2 border-dashed border-line text-soft bg-white/60'
      }`}
    >
      [{slot.placeholder}]
    </span>
  );
}

export default function LevelContextAnchor({ onComplete }) {
  const [placements, setPlacements] = useState({});
  const [generated, setGenerated] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [activeId, setActiveId] = useState(null);
  const intervalRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const allPlaced = SLOTS.every((s) => placements[s.id]);

  function handleDragStart(e) { setActiveId(e.active.id); }
  function handleDragEnd(e) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    setPlacements((prev) => {
      const next = { ...prev };
      for (const slotId of Object.keys(next)) if (next[slotId] === active.id) delete next[slotId];
      next[over.id] = active.id;
      return next;
    });
  }
  function clearSlot(slotId) {
    if (generated) return;
    setPlacements((prev) => { const n = { ...prev }; delete n[slotId]; return n; });
  }

  function handleGenerate() {
    if (generated) return;
    setGenerated(true);
    setGeneratedText('');
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 4;
      setGeneratedText(FINAL_OUTPUT.slice(0, i));
      if (i >= FINAL_OUTPUT.length) clearInterval(intervalRef.current);
    }, 12);
  }

  useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

  const activeTag = activeId ? TAGS.find((t) => t.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <LevelHeader level={4} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        Vague prompts give junk. <span className="text-L5">Anchor it.</span>
      </h2>

      <ConceptCard accent="L5" icon="⚓" title="Prompts need anchors.">
        AI can write almost anything, but without specifics it defaults to
        generic, flowery filler. The fix: tell it{' '}
        <strong>who, in what tone, about what</strong>. These are the three
        anchors that turn an AI dump into a usable SOP.
      </ConceptCard>

      <p className="text-muted mb-5 text-[14.5px] leading-relaxed">
        Watch the difference: a vague prompt on the left, your anchored prompt
        on the right. Drag each tag into the slot where it belongs.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="card p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-L6" />
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2 py-0.5 rounded-md bg-L6/10 text-L6 text-[10.5px] font-bold uppercase tracking-[0.15em]">Vague</div>
          </div>
          <div className="text-[13px] font-mono bg-cream rounded-lg p-2.5 mb-3 border border-line text-ink/70">
            "Write an email about a power shutdown."
          </div>
          <div className="text-[13px] text-soft italic leading-relaxed">
            "Dear valued reader, in the bustling tapestry of modern Singaporean
            life, we sometimes face the inevitable interruptions that remind us
            of our shared interconnectedness…"
          </div>
        </div>

        <div className="card-strong p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-L5" />
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2 py-0.5 rounded-md bg-L5/10 text-L5 text-[10.5px] font-bold uppercase tracking-[0.15em]">Anchored</div>
          </div>
          <div className="text-[13.5px] bg-cream rounded-lg p-3 border border-line leading-[2.2]">
            <span>Write an email to </span>
            <DropSlot slot={SLOTS[0]} placedTag={placements.audience && TAGS.find((t) => t.id === placements.audience)} onClear={clearSlot} locked={generated} />
            <span> in a </span>
            <DropSlot slot={SLOTS[1]} placedTag={placements.tone && TAGS.find((t) => t.id === placements.tone)} onClear={clearSlot} locked={generated} />
            <span> tone about </span>
            <DropSlot slot={SLOTS[2]} placedTag={placements.details && TAGS.find((t) => t.id === placements.details)} onClear={clearSlot} locked={generated} />
            <span>.</span>
          </div>
        </div>
      </div>

      <div className="card p-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-3">🏷️ Drag these tags into the prompt</div>
        <div className="flex flex-wrap gap-2.5">
          {TAGS.map((t) => <Draggable key={t.id} tag={t} placed={Object.values(placements).includes(t.id)} />)}
        </div>
      </div>

      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden mb-5">
            <div className="card-strong overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3 border-b border-line bg-gradient-to-r from-L5/5 to-transparent">
                <div className="w-7 h-7 rounded-lg bg-L5 text-white flex items-center justify-center text-[11px] font-bold">AI</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-L5">Streaming output</div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-soft font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-win animate-pulse" />live
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[14.5px] leading-relaxed text-ink p-5 text-L5 caret">
                <span className="text-ink">{generatedText}</span>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          disabled={!allPlaced || generated}
          onClick={handleGenerate}
          className={`px-5 py-3 rounded-xl font-semibold text-[15px] transition-all ${
            allPlaced && !generated ? 'bg-L5 text-white hover:bg-[#EA580C] shadow-pop ring-pulse-L5' :
            generated ? 'bg-win/10 text-win border border-win/30 cursor-default' : 'bg-line text-soft cursor-not-allowed'
          }`}
        >
          {generated ? '✓ Generated' : '⚡ Generate Tenant Circular'}
        </button>
        <PrimaryButton onClick={onComplete} disabled={!generated} accent="L5">Next Level →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L5"
        application="Before pasting any prompt to ChatGPT or Copilot, ask: who reads this, in what tone, about what specifically? Three lines of context save you a full round of edits."
      >
        <strong>Anchor every prompt with audience, tone and details.</strong>{' '}
        AI mirrors the specificity you give it. Generic in → generic out.
        Anchored in → ready-to-send out.
      </TakeawayCard>

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
        {activeTag ? (
          <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[14px] font-semibold bg-white border-2 border-L5 text-ink shadow-ring rotate-[-2deg] cursor-grabbing">
            <span className="text-base">{activeTag.emoji}</span><span>{activeTag.label}</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
