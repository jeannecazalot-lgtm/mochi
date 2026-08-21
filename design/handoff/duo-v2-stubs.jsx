// Stubs for components referenced by duo-v2-* files but not defined anywhere.
// Implementations are minimal but visually plausible so the prototype renders.

// ─────────── Glow background ──────────────────────────────────
function GlowBgV2({ intensity = 'normal' }) {
  const opa = intensity === 'soft' ? 0.5 : intensity === 'strong' ? 0.9 : 0.7;
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity: opa,
      background:
        'radial-gradient(60% 40% at 18% 12%, rgba(245,168,154,0.48), transparent 70%),' +
        'radial-gradient(50% 35% at 88% 22%, rgba(251,228,154,0.52), transparent 72%),' +
        'radial-gradient(70% 50% at 80% 90%, rgba(201,224,197,0.52), transparent 72%),' +
        'radial-gradient(55% 40% at 10% 88%, rgba(226,214,240,0.55), transparent 72%)',
    }} />
  );
}

// ─────────── Mochi Iridescent (copie de MochiClayIridescent v5) ──
function MochiIridescent({ size = 140, mood = 'happy' }) {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 220 220">
      <defs>
        <radialGradient id={`mi-main-${id}`} cx="38%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#FFF1E0" />
          <stop offset="20%" stopColor="#FBC9A4" />
          <stop offset="40%" stopColor="#F5A89A" />
          <stop offset="65%" stopColor="#E97A6A" />
          <stop offset="100%" stopColor="#C75744" />
        </radialGradient>
        <radialGradient id={`mi-glow-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBE49A" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#F5A89A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`mi-gloss-${id}`} cx="32%" cy="22%" r="28%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`mi-rim-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9FC9A8" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#FBE49A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F5A89A" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="106" fill={`url(#mi-glow-${id})`} />
      <circle cx="110" cy="110" r="82" fill={`url(#mi-main-${id})`} />
      <circle cx="110" cy="110" r="82" fill="none" stroke={`url(#mi-rim-${id})`} strokeWidth="6" />
      <ellipse cx="84" cy="76" rx="32" ry="24" fill={`url(#mi-gloss-${id})`} />
      <circle cx="76" cy="68" r="4" fill="#FFFFFF" />
      <circle cx="148" cy="92" r="2" fill="#FFFFFF" opacity="0.7" />
      {mood === 'wink' ? (
        <>
          <circle cx="92" cy="110" r="4" fill="#1A1A1F" />
          <path d="M 122 110 Q 128 106 134 110" stroke="#1A1A1F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 88 136 Q 110 150 132 136" stroke="#1A1A1F" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      ) : mood === 'sad' ? (
        <>
          <circle cx="92" cy="110" r="4" fill="#1A1A1F" />
          <circle cx="128" cy="110" r="4" fill="#1A1A1F" />
          <path d="M 88 146 Q 110 132 132 146" stroke="#1A1A1F" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="92" cy="110" r="4" fill="#1A1A1F" />
          <circle cx="128" cy="110" r="4" fill="#1A1A1F" />
          <path d="M 88 136 Q 110 150 132 136" stroke="#1A1A1F" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

const MochiClay = MochiIridescent;

// ─────────── IridTabBarV2 — restylée façon Airbnb (= TabBarV3) ──
// Nav v3 : Accueil / Planning / FAB / Balance / Budget.
// Anciennes clés mappées : todo→planning · pings/profile→aucun onglet actif.
function TBIcon({ k, on }) {
  const c = on ? '#E97A6A' : '#717171';
  const sw = on ? 2 : 1.7;
  if (k === 'home') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-8.5Z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
    </svg>
  );
  if (k === 'planning') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (k === 'balance') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 0 0 7 0L7 7M19 7l-2.5 6a3.5 3.5 0 0 0 7 0L21 7" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 20h8" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </svg>
  );
  // budget
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8ZM3 10h18M16 15h2" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IridTabBarV2({ active = 'home', onFab }) {
  const map = { home: 'home', todo: 'planning', planning: 'planning', balance: 'balance', budget: 'budget' };
  const act = map[active] || null;
  const tabs = [
    { k: 'home', l: 'Accueil' },
    { k: 'planning', l: 'Planning' },
    { k: 'fab' },
    { k: 'balance', l: 'Balance' },
    { k: 'budget', l: 'Budget' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#FFFFFF', borderTop: '1px solid #EBEBEB', padding: '8px 10px 24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 40 }}>
      {tabs.map(t => {
        if (t.k === 'fab') {
          return (
            <div key="fab" onClick={onFab} style={{ width: 54, height: 54, borderRadius: '50%', marginTop: -34, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', boxShadow: '0 2px 8px rgba(26,26,31,0.10), 0 0 0 4px #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1F" strokeWidth="2.4" strokeLinecap="round" /></svg>
            </div>
          );
        }
        const on = t.k === act;
        return (
          <div key={t.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: on ? '#E97A6A' : '#717171', minWidth: 52 }}>
            <TBIcon k={t.k} on={on} />
            <span style={{ fontSize: 11, fontWeight: on ? 600 : 400 }}>{t.l}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────── DayStrip (semainier en pastilles rondes) ─────────
function DayStrip({ today = 'D', days }) {
  const def = days || [
    { L: 'D', n: 28 },
    { L: 'L', n: 29 },
    { L: 'M', n: 30 },
    { L: 'M', n: 1 },
    { L: 'J', n: 2 },
    { L: 'V', n: 3 },
    { L: 'S', n: 4 },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
      {def.map((d, i) => {
        const isToday = i === 0 && d.L === today;
        return (
          <div key={i} style={{
            width: 38, height: 46, borderRadius: 999,
            background: isToday ? '#332F2D' : '#FFFCF5',
            color: isToday ? '#FFFCF5' : '#1A1A1F',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 5,
            boxShadow: isToday ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
          }}>
            <span style={{ fontSize: 10.5, letterSpacing: 0.6, fontWeight: 500, opacity: isToday ? 0.7 : 0.55, textTransform: 'uppercase' }}>{d.L}</span>
            <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1 }}>{d.n}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────── SemainierBar (weekly bar) ────────────────────────
function SemainierBar() {
  const days = [
    { d: 'L', v: 3, done: true },
    { d: 'M', v: 4, done: true },
    { d: 'M', v: 5, done: true, today: true },
    { d: 'J', v: 2 },
    { d: 'V', v: 4 },
    { d: 'S', v: 1 },
    { d: 'D', v: 0 },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 6 }}>
      {days.map((x, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
          <div style={{
            width: '100%', height: 32, borderRadius: 6,
            background: x.today ? '#1A1A1F' : (x.done ? 'rgba(26,26,31,0.55)' : 'rgba(26,26,31,0.14)'),
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              height: `${Math.min(100, x.v * 18)}%`,
              background: x.today ? '#FBE49A' : 'rgba(255,255,255,0.35)',
            }} />
          </div>
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: 0.8, color: x.today ? '#1A1A1F' : 'rgba(26,26,31,0.55)' }}>{x.d}</div>
        </div>
      ))}
    </div>
  );
}

const Semainier = SemainierBar;

// ─────────── FrameES (Embossed Saturé) ───────────────────────
function FrameES({ children, bg = '#FFFCF5', radius = 20, padding = 14, style = {} }) {
  return (
    <div style={{
      background: bg,
      borderRadius: radius,
      padding,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 -1px 0 rgba(26,26,31,0.08)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────── FrameRectIrid (iridescent rectangle) ────────────
function FrameRectIrid({ children, radius = 20, padding = 14, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FBE49A 0%, #F5A89A 40%, #E2D6F0 75%, #C9DFEA 100%)',
      borderRadius: radius,
      padding,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 -1px 0 rgba(26,26,31,0.08)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────── PillES (uppercase pill label) ───────────────────
function PillES({ children, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'rgba(26,26,31,0.10)',
      color: '#1A1A1F',
      fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4,
      padding: '8px 10px', borderRadius: 999, textTransform: 'uppercase',
    }}>
      {children}
    </span>
  );
}

Object.assign(window, {
  GlowBgV2, MochiIridescent, MochiClay, IridTabBarV2, TBIcon,
  SemainierBar, Semainier, DayStrip, FrameES, FrameRectIrid, PillES,
});
