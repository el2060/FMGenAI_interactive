import {
  Cpu, Type, Dices, VenetianMask, Anchor, BookOpen, Repeat,
  ClipboardList, Lock, Target, Ban, Building2, Sparkles
} from 'lucide-react';

export const SITE = {
  name: 'JTC Block 71',
  area: 'Jurong East',
  blurb: 'Mixed-use light-industrial / office tower. ~200 tenants.',
};

export const LEVEL_META = {
  1:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Types of AI',       icon: Cpu  },
  2:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Tokens',            icon: Type  },
  3:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Temperature',       icon: Dices  },
  4:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Persona',           icon: VenetianMask  },
  5:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Context Anchoring', icon: Anchor  },
  6:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Grounding',         icon: BookOpen  },
  7:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Iterate & Refine',  icon: Repeat  },
  8:  { chapter: 3, chapterTitle: 'Shape the Output',    name: 'Structured Output', icon: ClipboardList  },
  9:  { chapter: 4, chapterTitle: 'Use it Safely',       name: 'PDPA Guardrails',   icon: Lock  },
  10: { chapter: 4, chapterTitle: 'Use it Safely',       name: 'Hallucinations',    icon: Target },
  11: { chapter: 4, chapterTitle: 'Use it Safely',       name: 'When NOT to Use AI', icon: Ban },
};

export const CHAPTERS = [
  { n: 1, title: 'Meet the AI',      subtitle: 'Orient', levels: [1, 2, 3] },
  { n: 2, title: 'Talk to the AI',   subtitle: 'Craft',  levels: [4, 5, 6, 7] },
  { n: 3, title: 'Shape the Output', subtitle: 'Apply',  levels: [8] },
  { n: 4, title: 'Use it Safely',    subtitle: 'Defend', levels: [9, 10, 11] },
];

export function Eyebrow({ children }) {
  return (
    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-3">
      {children}
    </div>
  );
}

export function LevelHeader({ level }) {
  const m = LEVEL_META[level];
  const Icon = m.icon;
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center">
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-zinc-900">
        LEVEL {level} · {m.name}
      </div>
      <div className="ml-auto">
        <SiteChip />
      </div>
    </div>
  );
}

export function TakeawayCard({ application, children }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-white shadow-sm p-5 mt-6 flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-900 flex items-center justify-center">
        <Sparkles size={18} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-zinc-500 mb-1.5">
          Key Takeaway
        </div>
        <div className="text-[14.5px] text-zinc-900 leading-relaxed mb-3">
          {children}
        </div>
        {application && (
          <div className="text-[13px] text-zinc-600 bg-zinc-50 rounded-md p-2.5 border border-zinc-200 leading-relaxed">
            <span className="font-semibold text-zinc-900">In your FM work: </span>
            {application}
          </div>
        )}
      </div>
    </div>
  );
}

export function PrimaryButton({ children, disabled, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`h-10 px-5 rounded-md font-medium text-sm transition-all inline-flex items-center justify-center ${
        disabled 
          ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed' 
          : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm active:scale-[0.98]'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Background() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
    </>
  );
}

export function SiteChip({ floor }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-[11px] font-semibold text-zinc-700 align-baseline shadow-sm">
      <Building2 size={12} strokeWidth={2.5} className="text-zinc-500" />
      <span className="font-mono tracking-tight">{SITE.name}</span>
      {floor && <span className="text-zinc-400 font-mono">· {floor}</span>}
    </span>
  );
}

// Proxies to avoid crashing levels that still import these before they are updated
export const BG_COLORS = new Proxy({}, { get: () => 'bg-zinc-100' });
export const TEXT_COLORS = new Proxy({}, { get: () => 'text-zinc-900' });
export const BORDER_COLORS = new Proxy({}, { get: () => 'border-zinc-200' });
export const RING_PULSE = new Proxy({}, { get: () => 'ring-zinc-200' });
