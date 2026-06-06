import { useState, useEffect, useRef } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton } from './Common';
import { Users, Target, Plug, Zap, Check } from 'lucide-react';

const TAGS = [
  { id: 'audience', label: 'Audience: JTC Tenants',           short: 'JTC Tenants',              icon: Users },
  { id: 'tone',     label: 'Tone: Urgent but professional',   short: 'Urgent but professional',  icon: Target },
  { id: 'details',  label: 'Details: 2-hour DB box maintenance', short: '2-hour DB box maintenance', icon: Plug },
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
  const baseCls = 'inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md text-[14px] font-semibold border transition select-none';
  const Icon = tag.icon;
  if (placed) {
    return (
      <div className={`${baseCls} bg-zinc-50 border-dashed border-zinc-300 text-zinc-400 line-through opacity-60`}>
        <Icon size={16} /><span>{tag.label}</span>
      </div>
    );
  }
  return (
    <div
      ref={draggableProps?.setNodeRef}
      {...(draggableProps?.listeners || {})}
      {...(draggableProps?.attributes || {})}
      style={{ touchAction: 'none' }}
      className={`${baseCls} bg-white border-zinc-200 text-zinc-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-400 hover:-translate-y-0.5 ${draggableProps?.isDragging ? 'opacity-0' : ''}`}
    >
      <Icon size={16} className="text-zinc-500" />
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
    const Icon = placedTag.icon;
    return (
      <motion.button
        layout
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
        onClick={() => onClear(slot.id)}
        disabled={locked}
        className="group inline-flex items-center gap-1.5 align-baseline mx-0.5 my-0.5 px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-300 text-zinc-900 text-[13.5px] font-semibold hover:bg-zinc-200 transition shadow-sm"
        title={locked ? '' : 'Click to remove'}
      >
        <Icon size={14} className="text-zinc-500" /><span>{placedTag.short}</span>
        {!locked && <span className="opacity-0 group-hover:opacity-60 text-[10px]">×</span>}
      </motion.button>
    );
  }
  return (
    <span
      ref={setNodeRef}
      className={`inline-flex items-center justify-center align-baseline mx-0.5 px-3 py-1 rounded-md text-[13.5px] font-mono transition-all ${
        isOver ? 'bg-zinc-100 border border-solid border-zinc-400 text-zinc-900 scale-110 shadow-sm' : 'border border-dashed border-zinc-300 text-zinc-400 bg-zinc-50'
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
      <LevelHeader level={5} />
      <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight mb-4 leading-[1.05] text-zinc-900">
        Ground it in reality. <span className="text-zinc-400">Use Context Anchors.</span>
      </h2>
      <p className="text-zinc-500 text-[17px] max-w-2xl mb-10 leading-relaxed">
        Provide specific equipment and location details to anchor the AI's response.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-white border border-zinc-200 rounded-md p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-400" />
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="px-2 py-0.5 rounded-sm bg-zinc-100 text-zinc-500 text-[10.5px] font-bold uppercase tracking-[0.15em] border border-zinc-200">Vague</div>
          </div>
          <div className="text-[13px] font-mono bg-zinc-50 rounded-md p-2.5 mb-3 border border-zinc-200 text-zinc-600">
            "Write an email about a power shutdown."
          </div>
          <div className="text-[13px] text-zinc-500 italic leading-relaxed">
            "Dear valued reader, in the bustling tapestry of modern Singaporean life..."
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-md p-5 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800" />
          <div className="flex items-center gap-2 mb-3 mt-1">
            <div className="px-2 py-0.5 rounded-sm bg-zinc-800 text-white text-[10.5px] font-bold uppercase tracking-[0.15em]">Anchored</div>
          </div>
          <div className="text-[13.5px] bg-zinc-50 rounded-md p-3 border border-zinc-200 leading-[2.2] text-zinc-800">
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

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-5 mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-3 flex items-center gap-1.5">
          Drag these tags into the prompt
        </div>
        <div className="flex flex-wrap gap-2.5">
          {TAGS.map((t) => <Draggable key={t.id} tag={t} placed={Object.values(placements).includes(t.id)} />)}
        </div>
      </div>

      <AnimatePresence>
        {generated && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden mb-5">
            <div className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-3 border-b border-zinc-200 bg-zinc-50">
                <div className="w-7 h-7 rounded-md bg-zinc-800 text-white flex items-center justify-center text-[11px] font-bold">AI</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-900">Streaming output</div>
                <div className="ml-auto flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />live
                </div>
              </div>
              <pre className="whitespace-pre-wrap font-sans text-[14.5px] leading-relaxed text-zinc-900 p-5 caret">
                <span className="text-zinc-900">{generatedText}</span>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <button
          disabled={!allPlaced || generated}
          onClick={handleGenerate}
          className={`px-5 py-3 rounded-md font-semibold text-[14px] flex items-center gap-2 transition-all ${
            allPlaced && !generated ? 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm' :
            generated ? 'bg-zinc-100 text-zinc-500 border border-zinc-200 cursor-default' : 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed'
          }`}
        >
          {generated ? <><Check size={16} /> Generated</> : <><Zap size={16} /> Generate Tenant Circular</>}
        </button>
      </div>

      {generated && (
        <>
          <TakeawayCard
            application="Before generating, specify: who reads it, what tone, what details? Three anchors save three rewrites."
          >
            <strong>Anchor with audience, tone, details.</strong> Vague in = vague out. Anchored in = ready to use.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Topic →</PrimaryButton>
          </div>
        </>
      )}

      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
        {activeTag ? (() => {
          const ActiveIcon = activeTag.icon;
          return (
            <div className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-md text-[14px] font-semibold bg-white border border-zinc-300 text-zinc-900 shadow-sm rotate-[-2deg] cursor-grabbing">
              <ActiveIcon size={16} className="text-zinc-500" /><span>{activeTag.label}</span>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}
