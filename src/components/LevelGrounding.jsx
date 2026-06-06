import { useState } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton } from './Common';
import { BarChart, Wrench, Building, TreePine, Clipboard, Check, BookOpen, AlertTriangle } from 'lucide-react';

const QUESTION = 'What caused the energy spike at Block 71 last Tuesday?';

const DOCS = [
  { id: 'bms',   icon: BarChart, title: 'Block 71 BMS Log — Sep 24',     sub: 'Building management readings', relevant: true,
    citation: '[BMS log shows chiller plant ran 22% above baseline 14:00–18:00 on Sep 24]' },
  { id: 'maint', icon: Wrench, title: 'Chiller Maintenance Schedule',   sub: 'Vendor service plan',         relevant: true,
    citation: '[Sep 21 condenser tube cleaning was deferred to Oct 8]' },
  { id: 'tenant',icon: Building, title: 'Block 71 Tenant Roster (Q3)',    sub: 'Active occupancy report',     relevant: true,
    citation: '[no new high-load tenants moved in during week of Sep 23]' },
  { id: 'xmas',  icon: TreePine, title: 'Staff Christmas Party Memo',     sub: 'HR announcement, all blocks', relevant: false,
    citation: '[however, the staff Christmas party budget memo mentions bulk LED purchases — possibly relevant?]' },
  { id: 'codes', icon: Clipboard, title: 'BCA Building Codes 2019',        sub: 'General compliance reference', relevant: false,
    citation: '[per BCA 2019 §4.3, all chiller plants must maintain 0.65 kW/RT efficiency — your spike may breach this]' },
];

function DocCard({ doc, placed, draggableProps }) {
  if (placed) return null;
  const Icon = doc.icon;
  return (
    <div
      ref={draggableProps?.setNodeRef}
      {...(draggableProps?.listeners || {})}
      {...(draggableProps?.attributes || {})}
      style={{ touchAction: 'none' }}
      className={`select-none cursor-grab active:cursor-grabbing bg-white border border-zinc-200 rounded-md p-3 flex items-center gap-3 hover:border-zinc-400 hover:-translate-y-0.5 transition shadow-sm ${draggableProps?.isDragging ? 'opacity-0' : ''}`}
    >
      <div className="text-zinc-500 shrink-0"><Icon size={20} /></div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-semibold leading-tight truncate text-zinc-900">{doc.title}</div>
        <div className="text-[11.5px] text-zinc-500 leading-tight truncate">{doc.sub}</div>
      </div>
      <div className="text-[18px] text-zinc-300 font-serif">⠿</div>
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
      className={`rounded-md border border-dashed p-4 min-h-[180px] transition ${
        isOver ? 'border-zinc-800 bg-zinc-100' : placed.length > 0 ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-300 bg-white'
      }`}
    >
      <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-800 mb-2 flex items-center gap-1.5">
        <BookOpen size={14} className="text-zinc-500" />
        <span>Knowledge Base</span>
        <span className="text-zinc-500 font-mono">({placed.length})</span>
      </div>
      {placed.length === 0 ? (
        <div className="text-[13px] text-zinc-400 italic py-8 text-center">
          Drop FM documents here to ground the AI's answer ↓
        </div>
      ) : (
        <div className="space-y-2">
          {placed.map((doc) => {
            const Icon = doc.icon;
            return (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-2.5 p-2.5 rounded-md border bg-white shadow-sm ${doc.relevant ? 'border-zinc-200' : 'border-red-200 bg-red-50/30'}`}
              >
                <Icon size={18} className={doc.relevant ? 'text-zinc-500' : 'text-red-500'} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold truncate text-zinc-900">{doc.title}</div>
                  {!doc.relevant && <div className="text-[10.5px] text-red-600 font-semibold uppercase tracking-wider flex items-center gap-1"><AlertTriangle size={12}/> irrelevant — poisons output</div>}
                </div>
                <button onClick={() => onRemove(doc.id)} className="text-zinc-400 hover:text-zinc-900 text-sm w-5 h-5 rounded flex items-center justify-center hover:bg-zinc-100 transition">×</button>
              </motion.div>
            );
          })}
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
      <LevelHeader level={6} />
      <h2 className="font-display text-3xl sm:text-[38px] font-bold tracking-tight mb-3 leading-[1.05]">
        AI doesn't know your buildings. <span className="text-zinc-500">Until you ground it.</span>
      </h2>

      <p className="text-muted text-[15px] max-w-2xl mb-6">
        Paste the relevant SOP text to ground the AI so it doesn't invent answers.
      </p>

      <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-5 mb-5">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-2">❓ User question</div>
        <div className="text-[15px] font-medium text-zinc-900 mb-4">"{QUESTION}"</div>

        <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-start">
          <div className={`rounded-md p-4 border ${response.grounded ? 'border-zinc-300 bg-zinc-50' : placed.length > 0 ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-200 bg-zinc-50/50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-zinc-800 text-white flex items-center justify-center text-[10px] font-bold">AI</div>
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-800">Grounded Response</div>
              {response.grounded && <span className="ml-auto text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-green-200"><Check size={12}/> verified</span>}
              {!response.grounded && placed.length > 0 && <span className="ml-auto text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-red-200"><AlertTriangle size={12}/> polluted</span>}
            </div>
            <motion.div key={response.text.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="text-[13.5px] text-zinc-800 leading-relaxed whitespace-pre-wrap">
              {response.text}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-zinc-200 rounded-md shadow-sm p-4">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-3 flex items-center gap-1.5">
            <Clipboard size={14} /> Available Documents
          </div>
          <div className="space-y-2">
            {DOCS.map((d) => <Draggable key={d.id} doc={d} placed={placedIds.includes(d.id)} />)}
          </div>
        </div>
        <KnowledgeBase placed={placed} onRemove={remove} />
      </div>

      <div className="flex justify-between items-center flex-wrap gap-3">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
              <span className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center"><Check size={12} /></span>
              All 3 relevant docs grounded · no noise
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 text-sm">
              Goal: ground all 3 relevant docs, exclude the irrelevant ones.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {done && (
        <>
          <TakeawayCard
            application="Curate what your bots read. A stale 2019 memo wrecks a 2026 answer."
          >
            <strong>Rubbish in = rubbish out.</strong> Grounding works, but only with clean docs.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Level →</PrimaryButton>
          </div>
        </>
      )}

      <DragOverlay dropAnimation={{ duration: 200 }}>
        {activeDoc ? (() => {
          const ActiveIcon = activeDoc.icon;
          return (
            <div className="bg-white border border-zinc-300 rounded-md p-3 flex items-center gap-3 shadow-sm rotate-[-2deg]">
              <div className="text-zinc-500 shrink-0"><ActiveIcon size={20} /></div>
              <div>
                <div className="text-[13.5px] font-semibold leading-tight text-zinc-900">{activeDoc.title}</div>
                <div className="text-[11.5px] text-zinc-500 leading-tight">{activeDoc.sub}</div>
              </div>
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}
