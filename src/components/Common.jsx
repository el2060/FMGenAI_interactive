export function Eyebrow({ children, color = 'text-muted' }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${color} mb-3`}>
      {children}
    </div>
  );
}

export function Tip({ children, accent = 'L1' }) {
  const bar = { L1: 'bg-L1', L2: 'bg-L2', L3: 'bg-L3' }[accent];
  return (
    <div className="mt-6 flex gap-3 items-stretch text-sm text-muted rounded-xl bg-white/60 border border-line p-3.5 leading-relaxed">
      <div className={`w-1 rounded-full ${bar}`} />
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function PrimaryButton({ children, disabled, onClick, accent = 'ink', className = '' }) {
  const accents = {
    ink: 'bg-ink text-white hover:bg-black',
    L1: 'bg-L1 text-white hover:bg-[#6D28D9]',
    L2: 'bg-L2 text-white hover:bg-[#EA580C]',
    L3: 'bg-L3 text-white hover:bg-[#BE123C]',
    win: 'bg-win text-white hover:bg-[#4D7C0F]',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 rounded-xl font-semibold text-[15px] transition-all ${
        disabled ? 'bg-line text-soft cursor-not-allowed' : `${accents[accent]} shadow-pop active:scale-[0.98]`
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Background() {
  return (
    <>
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-60 z-0" />
      <div className="bg-blob blob-a" style={{ background: '#C7B2FF', width: 520, height: 520, top: -180, left: -120 }} />
      <div className="bg-blob blob-b" style={{ background: '#FFC9A3', width: 460, height: 460, top: 160, right: -160 }} />
      <div className="bg-blob blob-c" style={{ background: '#FFB7C9', width: 420, height: 420, bottom: -180, left: '30%' }} />
    </>
  );
}
