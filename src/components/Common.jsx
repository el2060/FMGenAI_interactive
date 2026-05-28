export const LEVEL_META = {
  1: { chapter: 1, chapterTitle: 'AI Foundations', name: 'Types of AI',      emoji: '🧭', color: 'L1' },
  2: { chapter: 1, chapterTitle: 'AI Foundations', name: 'Tokens',           emoji: '🔤', color: 'L2' },
  3: { chapter: 1, chapterTitle: 'AI Foundations', name: 'Temperature',      emoji: '🎲', color: 'L3' },
  4: { chapter: 1, chapterTitle: 'AI Foundations', name: 'Context Anchoring', emoji: '⚓', color: 'L4' },
  5: { chapter: 2, chapterTitle: 'Prompting in FM', name: 'Grounding',       emoji: '📚', color: 'L5' },
  6: { chapter: 3, chapterTitle: 'Safety & Risk', name: 'PDPA Guardrails',   emoji: '🔒', color: 'L6' },
  7: { chapter: 3, chapterTitle: 'Safety & Risk', name: 'Hallucinations',    emoji: '🎯', color: 'L7' },
};

export const CHAPTERS = [
  { n: 1, title: 'AI Foundations', subtitle: 'Orient', levels: [1, 2, 3, 4] },
  { n: 2, title: 'Prompting in FM', subtitle: 'Craft', levels: [5] },
  { n: 3, title: 'Safety & Risk', subtitle: 'Defend', levels: [6, 7] },
];

const TOTAL_LEVELS = Object.keys(LEVEL_META).length;

const TEXT_COLORS    = { L1:'text-L1', L2:'text-L2', L3:'text-L3', L4:'text-L4', L5:'text-L5', L6:'text-L6', L7:'text-L7', L8:'text-L8', L9:'text-L9', L10:'text-L10', muted:'text-muted' };
const BG_COLORS      = { L1:'bg-L1',   L2:'bg-L2',   L3:'bg-L3',   L4:'bg-L4',   L5:'bg-L5',   L6:'bg-L6',   L7:'bg-L7',   L8:'bg-L8',   L9:'bg-L9',   L10:'bg-L10'   };
const BORDER_COLORS  = { L1:'border-L1', L2:'border-L2', L3:'border-L3', L4:'border-L4', L5:'border-L5', L6:'border-L6', L7:'border-L7', L8:'border-L8', L9:'border-L9', L10:'border-L10' };
const RING_PULSE     = { L1:'ring-pulse-L1', L2:'ring-pulse-L2', L3:'ring-pulse-L3', L4:'ring-pulse-L4', L5:'ring-pulse-L5', L6:'ring-pulse-L6', L7:'ring-pulse-L7', L8:'ring-pulse-L8', L9:'ring-pulse-L9', L10:'ring-pulse-L10' };
const HOVER_BG = {
  L1:'hover:bg-[#6D28D9]', L2:'hover:bg-[#DB2777]', L3:'hover:bg-[#4338CA]',
  L4:'hover:bg-[#D97706]', L5:'hover:bg-[#EA580C]', L6:'hover:bg-[#0D9488]',
  L7:'hover:bg-[#2563EB]', L8:'hover:bg-[#059669]', L9:'hover:bg-[#334155]',
  L10:'hover:bg-[#BE123C]', win:'hover:bg-[#4D7C0F]', ink:'hover:bg-black',
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
    <div className="mb-5">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted mb-3 flex-wrap">
        <span className={`${BG_COLORS[m.color]} text-white px-2 py-0.5 rounded-md font-mono tracking-normal`}>
          CH {m.chapter}
        </span>
        <span className="text-ink/70">{m.chapterTitle}</span>
        <span className="text-soft">·</span>
        <span className="text-soft font-mono tracking-normal">L{level}/{TOTAL_LEVELS}</span>
      </div>
      <div className="flex items-center gap-3 mb-1">
        <div className={`w-11 h-11 rounded-2xl ${BG_COLORS[m.color]} text-white flex items-center justify-center text-xl shadow-pop`}>
          {m.emoji}
        </div>
        <div>
          <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${TEXT_COLORS[m.color]}`}>{m.name}</div>
        </div>
      </div>
    </div>
  );
}

export function ConceptCard({ accent = 'L1', icon = '💡', title, children }) {
  return (
    <div className="card p-4 mb-5 relative overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${BG_COLORS[accent]}`} />
      <div className="flex gap-3 pl-2">
        <div className="text-xl shrink-0">{icon}</div>
        <div className="flex-1">
          <div className={`text-[10.5px] font-semibold uppercase tracking-[0.22em] ${TEXT_COLORS[accent]} mb-1.5`}>
            The Concept
          </div>
          <div className="text-[14px] text-ink/85 leading-relaxed">
            {title && <span className="font-semibold text-ink">{title} </span>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TakeawayCard({ accent = 'L1', application, children }) {
  return (
    <div className="card-strong p-5 mt-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${BG_COLORS[accent]}`} />
      <div className="flex gap-4">
        <div className={`shrink-0 w-10 h-10 rounded-xl ${BG_COLORS[accent]} text-white flex items-center justify-center text-lg shadow-pop`}>
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
    L8:'bg-L8 text-white', L9:'bg-L9 text-white', L10:'bg-L10 text-white', win:'bg-win text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-xl font-semibold text-[15px] transition-all ${
        disabled ? 'bg-line text-soft cursor-not-allowed' : `${accents[accent]} ${HOVER_BG[accent]} shadow-pop active:scale-[0.98]`
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
      <div className="bg-blob blob-a" style={{ background: '#C7B2FF', width: 520, height: 520, top: -180, left: -120 }} />
      <div className="bg-blob blob-b" style={{ background: '#FFC9A3', width: 460, height: 460, top: 160, right: -160 }} />
      <div className="bg-blob blob-c" style={{ background: '#A7E9DF', width: 420, height: 420, bottom: -180, left: '30%' }} />
    </>
  );
}

export { RING_PULSE, BG_COLORS, TEXT_COLORS, BORDER_COLORS };
