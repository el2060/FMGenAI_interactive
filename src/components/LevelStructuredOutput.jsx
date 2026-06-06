import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LevelHeader, TakeawayCard, PrimaryButton, SiteChip } from './Common';
import { FileText, List, TableProperties, CheckSquare, Check, Lightbulb, Copy, CheckCircle2 } from 'lucide-react';

const SOURCE = `Quarterly inspection — Block 71, Jurong East
Inspector: K. Ramesh   |   Date: 28 Mar 2026

AHU-3 on level 6 showed minor refrigerant under-charge during the inspection. Pressure on the suction side read 58 psig vs. design 65 psig. No active alarm but coil approach temperature has crept up over the past 3 weeks. Recommend top-up by certified vendor within 7 days.

Chiller plant on B1 was within parameters. Condenser approach 3.2°C, well within the 4°C threshold. Routine tube cleaning was completed 14 Mar 2026 by Vendor A.

The lift lobby on level 1 had two ceiling tiles with visible water staining near the planter box, likely from a slow drip behind. Severity low but should be opened up before the next quarterly. Estimated 2 hours work.

Fire alarm panel: monthly self-test passed. Next external audit due 12 May 2026. Spare smoke detectors stock at 18 units (target buffer 20).`;

const FORMATS = [
  {
    id: 'prose',
    label: 'Prose summary',
    icon: FileText,
    sub: '"Summarise in a short paragraph."',
    output: `Block 71 Q1 inspection identified one minor refrigerant under-charge on AHU-3 (level 6) requiring vendor top-up within 7 days, and two water-stained ceiling tiles in the level 1 lift lobby pending repair before the next quarterly. Chiller plant and fire alarm panel were both within parameters; spare smoke detector stock is 2 units below buffer target.`,
    why: 'Good for executive emails. Bad for action tracking — you can\'t tick off a paragraph.',
    note: 'Use when: emailing your manager. Avoid when: dispatching to a duty crew.',
  },
  {
    id: 'bullets',
    label: 'Action bullets',
    icon: List,
    sub: '"List as action items, one per line."',
    output: `• Top-up AHU-3 refrigerant (level 6) — vendor visit within 7 days
• Open up & repair 2 ceiling tiles in level 1 lift lobby — 2 hours work
• Replenish spare smoke detectors from 18 → 20 units
• Prep documentation for 12 May 2026 fire alarm external audit`,
    why: 'Now it\'s a punch list. Each line owns one verb + one object.',
    note: 'Use when: handing to a team. Avoid when: stakeholders need context.',
  },
  {
    id: 'table',
    label: 'Action table',
    icon: TableProperties,
    sub: '"Format as a table: Asset · Issue · Action · Due."',
    table: {
      headers: ['Asset', 'Issue', 'Action', 'Due'],
      rows: [
        ['AHU-3 · L6',           'Refrigerant under-charge (58 vs 65 psig)', 'Vendor top-up',         '4 Apr 2026'],
        ['Lift lobby · L1',      '2 water-stained ceiling tiles',            'Open up & repair',      'Before Q2'],
        ['Smoke detector stock', '18 units (target 20)',                     'Order 2 more',          '15 Apr 2026'],
        ['Fire alarm panel',     'External audit scheduled',                 'Prep documentation',    '12 May 2026'],
      ],
    },
    why: 'Maximum density. Sortable, filterable, paste-into-Excel ready.',
    note: 'Use when: tracking in a register. The format every FM team eventually adopts.',
  },
  {
    id: 'checklist',
    label: 'Tomorrow\'s checklist',
    icon: CheckSquare,
    sub: '"Give me a checklist of things to do tomorrow."',
    output: `□ 0830 — Call HVAC vendor, schedule AHU-3 refrigerant top-up by 4 Apr
□ 0900 — Site walk to level 1 lift lobby, photograph the 2 stained tiles
□ 1000 — Raise repair ticket in CMMS with photos + 2-hour estimate
□ 1100 — Order 2 spare smoke detectors from approved supplier
□ 1500 — Pull audit documentation pack for 12 May fire alarm review`,
    why: 'Time-blocked. Becomes tomorrow\'s WhatsApp message to your duty officer.',
    note: 'Use when: handing off at end-of-day. The most operational format.',
  },
];

export default function LevelStructuredOutput({ onComplete }) {
  const [picked, setPicked] = useState('bullets');
  const [seen, setSeen] = useState(new Set(['bullets']));
  const [copied, setCopied] = useState(false);

  const current = FORMATS.find((f) => f.id === picked);

  function choose(id) {
    setPicked(id);
    setSeen((s) => new Set([...s, id]));
  }

  function copyOutput() {
    const text = current.table
      ? [current.table.headers.join('\t'), ...current.table.rows.map((r) => r.join('\t'))].join('\n')
      : current.output;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div>
      <LevelHeader level={8} />
      <h2 className="font-display text-4xl sm:text-[44px] font-bold tracking-tight mb-4 leading-[1.05] text-zinc-900">
        Don't just ask. <span className="text-zinc-500">Tell AI the shape.</span>
      </h2>

      <p className="text-zinc-500 text-[17px] max-w-2xl mb-10 leading-relaxed">
        Click through all 4 output formats to see how specifying the shape changes utility.
      </p>

      {/* Source */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-zinc-500 font-mono">Source · Inspection Report</span>
          <SiteChip />
        </div>
        <div className="bg-zinc-50 rounded-md p-3 border border-zinc-200 text-[12.5px] text-zinc-700 leading-relaxed max-h-[180px] overflow-y-auto whitespace-pre-wrap font-mono shadow-inner">
          {SOURCE}
        </div>
      </div>

      {/* Shape selector */}
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-2">
        Tell AI the output shape
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {FORMATS.map((f) => {
          const active = picked === f.id;
          const wasSeen = seen.has(f.id);
          const FIcon = f.icon;
          return (
            <motion.button
              key={f.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => choose(f.id)}
              className={`rounded-md p-3 border text-left transition-all shadow-sm ${
                active ? 'border-zinc-800 bg-zinc-100 text-zinc-900' : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FIcon size={20} strokeWidth={2} />
                {wasSeen && !active && <Check size={14} className="text-zinc-400" strokeWidth={3} />}
              </div>
              <div className="font-semibold text-[12.5px] leading-tight">{f.label}</div>
            </motion.button>
          );
        })}
      </div>

      {/* Output */}
      <AnimatePresence mode="wait">
        <motion.div
          key={picked}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="bg-white border border-zinc-200 rounded-md shadow-sm overflow-hidden mb-4"
        >
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-800 text-white flex items-center justify-center text-[11px] font-bold">AI</div>
            <div className="min-w-0">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-zinc-900">Output as {current.label}</div>
              <div className="text-[10.5px] text-zinc-500 truncate">{current.sub}</div>
            </div>
            <button
              onClick={copyOutput}
              className="ml-auto text-[11px] font-semibold text-zinc-600 hover:text-zinc-900 transition px-2 py-1.5 rounded-md border border-zinc-200 bg-white shadow-sm flex items-center gap-1.5"
            >
              {copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="p-4">
            {current.table ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200">
                      {current.table.headers.map((h) => (
                        <th key={h} className="text-left px-2.5 py-2 font-semibold text-zinc-900 uppercase tracking-wider text-[10.5px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {current.table.rows.map((row, ri) => (
                      <tr key={ri} className={ri % 2 ? 'bg-white' : 'bg-zinc-50/50'}>
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-2.5 py-2 align-top border-b border-zinc-100 text-zinc-800">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-zinc-800">{current.output}</div>
            )}
          </div>

          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 text-[12px] text-zinc-800 flex gap-2.5 items-start">
            <Lightbulb size={16} className="text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Why it works: </span>{current.why} <span className="text-zinc-500">— {current.note}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between flex-wrap gap-2 text-[12px] text-zinc-500 mb-3">
        <span>
          Try all 4 shapes — <span className="font-semibold text-zinc-900 font-mono">{seen.size} / {FORMATS.length}</span>
        </span>
        <div className="flex gap-1">
          {FORMATS.map((f) => (
            <div key={f.id} className={`w-2 h-2 rounded-full ${seen.has(f.id) ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
          ))}
        </div>
      </div>

      {seen.size >= FORMATS.length && (
        <>
          <TakeawayCard
            application='Add format rules: "Table with these columns" or "5-bullet list".'
          >
            <strong>Specify the shape.</strong> Tables for tracking, bullets for teams.
          </TakeawayCard>
          <div className="flex justify-end mt-5 mb-8">
            <PrimaryButton onClick={onComplete}>Next Level →</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
