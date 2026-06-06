// Recurring fictional anchor — the same building threads through every level.
export const SITE = {
  name: 'JTC Block 71',
  area: 'Jurong East',
  blurb: 'Mixed-use light-industrial / office tower. ~200 tenants. The recurring building for every level.',
};

export const LEVEL_META = {
  1:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Types of AI',       emoji: '🧭', color: 'L1'  },
  2:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Tokens',            emoji: '🔤', color: 'L2'  },
  3:  { chapter: 1, chapterTitle: 'Meet the AI',         name: 'Temperature',       emoji: '🎲', color: 'L3'  },
  4:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Persona',           emoji: '🎭', color: 'L4'  },
  5:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Context Anchoring', emoji: '⚓', color: 'L5'  },
  6:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Grounding',         emoji: '📚', color: 'L6'  },
  7:  { chapter: 2, chapterTitle: 'Talk to the AI',      name: 'Iterate & Refine',  emoji: '🔁', color: 'L7'  },
  8:  { chapter: 3, chapterTitle: 'Shape the Output',    name: 'Structured Output', emoji: '📋', color: 'L8'  },
  9:  { chapter: 4, chapterTitle: 'Use it Safely',       name: 'PDPA Guardrails',   emoji: '🔒', color: 'L9'  },
  10: { chapter: 4, chapterTitle: 'Use it Safely',       name: 'Hallucinations',    emoji: '🎯', color: 'L10' },
  11: { chapter: 4, chapterTitle: 'Use it Safely',       name: 'When NOT to Use AI', emoji: '🛑', color: 'L11' },
};

export const CHAPTERS = [
  { n: 1, title: 'Meet the AI',      subtitle: 'Orient', levels: [1, 2, 3] },
  { n: 2, title: 'Talk to the AI',   subtitle: 'Craft',  levels: [4, 5, 6, 7] },
  { n: 3, title: 'Shape the Output', subtitle: 'Apply',  levels: [8] },
  { n: 4, title: 'Use it Safely',    subtitle: 'Defend', levels: [9, 10, 11] },
];

const TOTAL_LEVELS = Object.keys(LEVEL_META).length;

const TEXT_COLORS    = { L1:'text-L1', L2:'text-L2', L3:'text-L3', L4:'text-L4', L5:'text-L5', L6:'text-L6', L7:'text-L7', L8:'text-L8', L9:'text-L9', L10:'text-L10', L11:'text-L11', muted:'text-muted' };
const BG_COLORS      = { L1:'bg-L1',   L2:'bg-L2',   L3:'bg-L3',   L4:'bg-L4',   L5:'bg-L5',   L6:'bg-L6',   L7:'bg-L7',   L8:'bg-L8',   L9:'bg-L9',   L10:'bg-L10', L11:'bg-L11' };
const BORDER_COLORS  = { L1:'border-L1', L2:'border-L2', L3:'border-L3', L4:'border-L4', L5:'border-L5', L6:'border-L6', L7:'border-L7', L8:'border-L8', L9:'border-L9', L10:'border-L10', L11:'border-L11' };
const RING_PULSE     = { L1:'ring-pulse-L1', L2:'ring-pulse-L2', L3:'ring-pulse-L3', L4:'ring-pulse-L4', L5:'ring-pulse-L5', L6:'ring-pulse-L6', L7:'ring-pulse-L7', L8:'ring-pulse-L8', L9:'ring-pulse-L9', L10:'ring-pulse-L10', L11:'ring-pulse-L11' };
const HOVER_BG = {
  L1:'hover:bg-black', L2:'hover:bg-black', L3:'hover:bg-black',
  L4:'hover:bg-black', L5:'hover:bg-black', L6:'hover:bg-black',
  L7:'hover:bg-black', L8:'hover:bg-black', L9:'hover:bg-black',
  L10:'hover:bg-black', L11:'hover:bg-black', win:'hover:bg-black', ink:'hover:bg-black',
};

export function Eyebrow({ children, color = 'muted' }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${TEXT_COLORS[color] || color} mb-3`}>
      {children}
    </div>
  );
}

export function LevelHeader({ level }) {
  const m = LEVEL_META[level];
  return (
    <div className="flex items-center gap-2 mb-6">
      <div className={`w-8 h-8 rounded-xl ${BG_COLORS[m.color]} text-white flex items-center justify-center text-base`}>
        {m.emoji}
      </div>
      <div className={`text-[12px] font-bold uppercase tracking-[0.15em] ${TEXT_COLORS[m.color]}`}>
        LEVEL {level} · {m.name}
      </div>
      <div className="ml-auto">
        <SiteChip />
      </div>
    </div>
  );
}

export function TakeawayCard({ accent = 'L1', application, children }) {
  return (
    <div className="card-strong p-5 mt-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${BG_COLORS[accent]}`} />
      <div className="flex gap-4">
        <div className={`shrink-0 w-10 h-10 rounded-xl ${BG_COLORS[accent]} text-white flex items-center justify-center text-lg`}>
          ✨
        </div>
        <div className="flex-1">
          <div className={`text-[10.5px] font-semibold uppercase tracking-[0.22em] ${TEXT_COLORS[accent]} mb-1.5`}>
            Key Takeaway
          </div>
          <div className="text-[14.5px] text-ink leading-relaxed mb-3">
            {children}
          </div>
          {application && (
            <div className="text-[13px] text-muted bg-cream rounded-lg p-2.5 border border-line leading-relaxed">
              <span className="font-semibold text-ink">In your FM work: </span>
              {application}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function PrimaryButton({ children, disabled, onClick, accent = 'ink', className = '' }) {
  const accents = {
    ink:'bg-ink text-white', L1:'bg-L1 text-white', L2:'bg-L2 text-white', L3:'bg-L3 text-white',
    L4:'bg-L4 text-white', L5:'bg-L5 text-white', L6:'bg-L6 text-white', L7:'bg-L7 text-white',
    L8:'bg-L8 text-white', L9:'bg-L9 text-white', L10:'bg-L10 text-white', L11:'bg-L11 text-white', win:'bg-win text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-xl font-semibold text-[15px] transition-all ${
        disabled ? 'bg-line text-soft cursor-not-allowed' : `${accents[accent]} ${HOVER_BG[accent]} active:scale-[0.98]`
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Background() {
  return (
    <>
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-50 z-0" />
    </>
  );
}

// A subtle inline chip placeholder. Used inside scenarios to visually
// link every level back to the same recurring building.
export function SiteChip({ floor }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cream border border-line text-[11px] font-semibold text-ink/80 align-baseline">
      <span>🏢</span>
      <span className="font-mono tracking-tight">{SITE.name}</span>
      {floor && <span className="text-soft font-mono">· {floor}</span>}
    </span>
  );
}

export { RING_PULSE, BG_COLORS, TEXT_COLORS, BORDER_COLORS };
