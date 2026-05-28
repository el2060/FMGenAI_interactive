import { useState } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, ConceptCard, TakeawayCard, PrimaryButton } from './Common';

const QUESTION = 'What caused the energy spike at Block 71 last Tuesday?';

const DOCS = [
  { id: 'bms',   emoji: '📊', title: 'Block 71 BMS Log — Sep 24',     sub: 'Building management readings', relevant: true,
    citation: '[BMS log shows chiller plant ran 22% above baseline 14:00–18:00 on Sep 24]' },
  { id: 'maint', emoji: '🔧', title: 'Chiller Maintenance Schedule',   sub: 'Vendor service plan',         relevant: true,
    citation: '[Sep 21 condenser tube cleaning was deferred to Oct 8]' },
  { id: 'tenant',emoji: '🏢', title: 'Block 71 Tenant Roster (Q3)',    sub: 'Active occupancy report',     relevant: true,
    citation: '[no new high-load tenants moved in during week of Sep 23]' },
  { id: 'xmas',  emoji: '🎄', title: 'Staff Christmas Party Memo',     sub: 'HR announcement, all blocks', relevant: false,
    citation: '[however, the staff Christmas party budget memo mentions bulk LED purchases — possibly relevant?]' },
  { id: 'codes', emoji: '📋', title: 'BCA Building Codes 2019',        sub: 'General compliance reference', relevant: false,
    citation: '[per BCA 2019 §4.3, all chiller plants must maintain 0.65 kW/RT efficiency — your spike may breach this]' },
];

function DocCard({ doc, placed, draggableProps }) {
  if (placed) return null;
  return (
    <div
      ref={draggableProps?.setNodeRef}
      {...(draggableProps?.listeners || {})}
      {...(draggableProps?.attributes || {})}
      style={{ touchAction: 'none' }}
      className={`select-none cursor-grab active:cursor-grabbing card p-3 flex items-center gap-3 hover:border-L4 hover:-translate-y-0.5 transition ${draggableProps?.isDragging ? 'opacity-0' : ''}`}
    >
      <div className="text-2xl shrink-0">{doc.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold leading-tight truncate">{doc.title}</div>
        <div className="text-[11.5px] text-soft leading-tight truncate">{doc.sub}</div>
      </div>
      <div className="text-[18px] text-soft">⠿</div>
    </div>
  );
}
function Draggable({ doc, placed }) {
  const props = useDraggable({ id: doc.id });
  return <DocCard doc={doc} placed={placed} draggableProps={props} />;
}

function KnowledgeBase({ placed, onRemove }) {
  const { isOver, setNodeRef } = useDroppable({ id: 'kb' });
  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed p-4 min-h-[180px] transition ${
        isOver ? 'border-L4 bg-L4/5' : placed.length > 0 ? 'border-L4/40 bg-L4/[0.03]' : 'border-line bg-white/40'
      }`}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-L4 mb-2 flex items-center gap-1.5">
        <span>📚 Knowledge Base</span>
        <span className="text-soft font-mono">({placed.length})</span>
      </div>
      {placed.length === 0 ? (
        <div className="text-[13px] text-soft italic py-8 text-center">
          Drop FM documents here to ground the AI's answer ↓
        </div>
      ) : (
        <div className="space-y-2">
          {placed.map((doc) => (
            <motion.div
              key={doc.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border bg-white ${doc.relevant ? 'border-L4/30' : 'border-L6/40'}`}
            >
              <span className="text-lg">{doc.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold truncate">{doc.title}</div>
                {!doc.relevant && <div className="text-[10.5px] text-L6 font-semibold uppercase tracking-wider">⚠ irrelevant — poisons output</div>}
              </div>
              <button onClick={() => onRemove(doc.id)} className="text-soft hover:text-L6 text-sm w-5 h-5 rounded hover:bg-L6/10 transition">×</button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildResponse(placed) {
  const has = (id) => placed.some((d) => d.id === id);
  if (placed.length === 0) {
    return {
      text: "I don't have access to Block 71's specific records. Generally, energy spikes can be caused by HVAC equipment running outside design conditions, lighting left on overnight, or new high-load tenants. Without your actual logs I can only speculate.",
      grounded: false,
    };
  }

  let parts = ['Based on the documents you provided:\n\n'];
  if (has('bms'))    parts.push('• ' + DOCS.find(d=>d.id==='bms').citation    + '\n');
  if (has('maint'))  parts.push('• ' + DOCS.find(d=>d.id==='maint').citation  + '\n');
  if (has('tenant')) parts.push('• ' + DOCS.find(d=>d.id==='tenant').citation + '\n');
  if (has('xmas'))   parts.push('• ' + DOCS.find(d=>d.id==='xmas').citation   + '\n');
  if (has('codes'))  parts.push('• ' + DOCS.find(d=>d.id==='codes').citation  + '\n');
  parts.push('\n');

  const relevantCount = ['bms','maint','tenant'].filter(has).length;
  const irrelevantCount = ['xmas','codes'].filter(has).length;

  if (relevantCount === 3 && irrelevantCount === 0) {
    parts.push('Conclusion: The Sep 24 spike at Block 71 (+22% above baseline) coincides with the deferred Sep 21 condenser tube cleaning. With no new high-load tenants that week, fouled tubes are the most likely cause. Recommended: expedite the cleaning that was pushed to Oct 8.');
  } else if (relevantCount === 3 && irrelevantCount > 0) {
    parts.push('Conclusion: The chiller maintenance gap likely caused the spike — but I have also factored in the Christmas memo / BCA reference you supplied, which may not be relevant. Please filter your knowledge base.');
  } else {
    parts.push('Partial answer. Add more relevant FM documents (BMS log, maintenance schedule, tenant roster) for a complete grounded analysis.');
  }
  return { text: parts.join(''), grounded: relevantCount === 3 && irrelevantCount === 0 };
}

export default function LevelGrounding({ onComplete }) {
  const [placedIds, setPlacedIds] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  const placed = placedIds.map((id) => DOCS.find((d) => d.id === id));
  const response = buildResponse(placed);
  const done = response.grounded;

  function handleDragEnd(e) {
    setActiveId(null);
    if (e.over?.id === 'kb' && !placedIds.includes(e.active.id)) {
      setPlacedIds((p) => [...p, e.active.id]);
    }
  }
  function remove(id) { setPlacedIds((p) => p.filter((x) => x !== id)); }
  const activeDoc = activeId ? DOCS.find((d) => d.id === activeId) : null;

  return (
    <DndContext sensors={sensors} onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={handleDragEnd}>
      <LevelHeader level={5} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI doesn't know your buildings. <span className="text-L4">Until you ground it.</span>
      </h2>

      <ConceptCard accent="L4" icon="📚" title="Grounding (a.k.a. RAG) is how AI uses YOUR data.">
        Out of the box, AI only knows what's on the public internet — not your
        BMS logs, vendor reports or tenant records. <strong>Grounding</strong>{' '}
        means feeding it your real documents at the moment you ask, so the
        answer is specific and citable. But beware: bad documents poison the
        output just as easily.
      </ConceptCard>

      <p className="text-muted mb-5 text-[14.5px] leading-relaxed">
        Drag FM documents into the Knowledge Base on the right. Watch the AI's
        answer transform — and notice what happens if you include irrelevant
        files.
      </p>

      <div className="card-strong p-5 mb-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-soft mb-2">❓ User question</div>
        <div className="text-[15px] font-medium text-ink mb-4">"{QUESTION}"</div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
          <div className={`rounded-xl p-4 border-2 ${response.grounded ? 'border-L4/30 bg-L4/[0.03]' : placed.length > 0 ? 'border-L6/30 bg-L6/[0.03]' : 'border-line bg-cream'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-L4 text-white flex items-center justify-center text-[10px] font-bold">AI</div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-L4">Grounded Response</div>
              {response.grounded && <span className="ml-auto text-[10px] font-bold text-win bg-win/10 px-2 py-0.5 rounded-full uppercase tracking-wider">✓ verified</span>}
              {!response.grounded && placed.length > 0 && <span className="ml-auto text-[10px] font-bold text-L6 bg-L6/10 px-2 py-0.5 rounded-full uppercase tracking-wider">⚠ polluted</span>}
            </div>
            <motion.div key={response.text.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="text-[13.5px] text-ink/85 leading-relaxed whitespace-pre-wrap">
              {response.text}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="card p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-muted mb-3">📁 Available Documents</div>
          <div className="space-y-2">
            {DOCS.map((d) => <Draggable key={d.id} doc={d} placed={placedIds.includes(d.id)} />)}
          </div>
        </div>
        <KnowledgeBase placed={placed} onRemove={remove} />
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-win font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-win text-white text-xs flex items-center justify-center">✓</span>
              All 3 relevant docs grounded · no noise
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-muted text-sm">
              Goal: ground all 3 relevant docs, exclude the irrelevant ones.
            </motion.div>
          )}
        </AnimatePresence>
        <PrimaryButton onClick={onComplete} disabled={!done} accent="L4">Next Level →</PrimaryButton>
      </div>

      <TakeawayCard
        accent="L4"
        application="Tools like Copilot for Microsoft 365, custom GPTs, and SharePoint-connected chatbots all use grounding. Curate which documents AI can access — irrelevant ones do real damage."
      >
        <strong>Garbage in = garbage out.</strong> Grounding is what makes AI
        useful for FM, but only if the documents are accurate, current and
        relevant. A 2019 memo can wreck an answer about 2024 operations.
      </TakeawayCard>

      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeDoc ? (
          <div className="card p-3 flex items-center gap-3 shadow-ring rotate-[-1deg]">
            <div className="text-2xl shrink-0">{activeDoc.emoji}</div>
            <div>
              <div className="text-[13.5px] font-semibold leading-tight">{activeDoc.title}</div>
              <div className="text-[11.5px] text-soft leading-tight">{activeDoc.sub}</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
