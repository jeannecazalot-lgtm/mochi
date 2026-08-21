// DNA Crème · Moments gamifiés — Wrapped solo, Wrapped couple, Bilan mensuel, Streak célébration
// Réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent, IridTabBarV2

const { FrameEmbossed: GFes, PillLabel: GPill, MochiIridescent: GMochi, IridShell: GShell, IridTabBarV2: GTb } = window;

// ─── Shell sombre pour les stories Wrapped
function GShellDark({ children, step = 0 }) {
  return (
    <div style={{ width: 360, height: 760, background: '#1A1A1F', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', color: '#FFFCF5' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5, background: 'radial-gradient(55% 38% at 20% 10%, rgba(245,168,154,0.25), transparent 70%), radial-gradient(60% 42% at 85% 88%, rgba(226,214,240,0.22), transparent 72%), radial-gradient(45% 30% at 85% 15%, rgba(251,228,154,0.18), transparent 70%)' }}></div>
      <div style={{ padding: '54px 23px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, position: 'relative', color: 'rgba(255,252,245,0.9)' }}>
        <span>9:41</span><span>•••</span>
      </div>
      {/* progress stories */}
      <div style={{ display: 'flex', gap: 5, padding: '13px 18px 0', position: 'relative' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#FFFCF5' : 'rgba(255,252,245,0.25)' }}></div>
        ))}
      </div>
      {children}
    </div>
  );
}

function GDarkRow({ ic, l, v }) {
  return (
    <div style={{ background: 'rgba(255,252,245,0.08)', border: '0.5px solid rgba(255,252,245,0.10)', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 13 }}>
      <span style={{ fontSize: 19 }}>{ic}</span>
      <div style={{ flex: 1, fontSize: 15.5, fontWeight: 500, color: 'rgba(255,252,245,0.9)' }}>{l}</div>
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>{v}</div>
    </div>
  );
}

// ═══════════ WRAPPED SOLO ═══════════
function WrappedSoloCreme() {
  return (
    <GShellDark step={0}>
      <div style={{ padding: '26px 26px 0', position: 'relative', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 11 }}><GPill color="#F5C76E">TA SEMAINE · SEM. 17</GPill></div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 9 }}>
          <GMochi size={110} mood="wink"></GMochi>
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 45%, #F5A89A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4h30</div>
        <div style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,252,245,0.7)', marginTop: 6, marginBottom: 21 }}>portées pour le foyer cette semaine</div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative', marginBottom: 10 }}>
        <GFes padding="17px 18px" radius={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#1A1A1F' }}>
            <span style={{ fontSize: 24 }}>🍽</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>Roi de la vaisselle</div>
              <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>5 fois cette semaine — Jeanne te dit merci</div>
            </div>
          </div>
        </GFes>
      </div>

      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
        <GDarkRow ic="✓" l="Tâches faites" v="12"></GDarkRow>
        <GDarkRow ic="🧠" l="Charges mentales absorbées" v="2"></GDarkRow>
        <GDarkRow ic="⇄" l="Repassages acceptés" v="1"></GDarkRow>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,252,245,0.5)', fontWeight: 500 }}>Suite : votre semaine à deux →</div>
      </div>
    </GShellDark>
  );
}

// ═══════════ WRAPPED COUPLE ═══════════
function WrappedCoupleCreme() {
  return (
    <GShellDark step={1}>
      <div style={{ padding: '31px 26px 0', position: 'relative', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 19 }}><GPill color="#B8A5D9">VOTRE SEMAINE À DEUX</GPill></div>
        <div style={{ fontSize: 54, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1 }}>
          <span style={{ color: '#7DB3D5' }}>52</span>
          <span style={{ color: 'rgba(255,252,245,0.4)', fontWeight: 400 }}> / </span>
          <span style={{ color: '#B8A5D9' }}>48</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,252,245,0.7)', marginTop: 9, marginBottom: 9 }}>Légèrement chez Valentin — 18 min d'écart.</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginBottom: 20, fontSize: 13, fontWeight: 600 }}>
          <span style={{ color: '#7DB3D5' }}>● Valentin</span>
          <span style={{ color: '#B8A5D9' }}>● Jeanne</span>
        </div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative', marginBottom: 10 }}>
        <GFes padding="17px 18px" radius={18}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#1A1A1F' }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>12 jours équilibrés</div>
              <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>C'est votre record ! Encore 2 jours pour « Duo huilé »</div>
            </div>
          </div>
        </GFes>
      </div>

      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
        <GDarkRow ic="🧺" l="Reine de la lessive : Jeanne" v="×3"></GDarkRow>
        <GDarkRow ic="😬" l="Poubelle oubliée mardi" v="−1"></GDarkRow>
        <GDarkRow ic="⏱" l="Temps de coordination épargné" v="≈2h"></GDarkRow>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 22, right: 22 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#1A1A1F', boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Partager en stories
        </div>
      </div>
    </GShellDark>
  );
}

// ═══════════ BILAN MENSUEL ═══════════
function BilanMensuelCreme() {
  return (
    <GShell intensity="soft">
      <div style={{ padding: '14px 23px 0', marginBottom: 14, position: 'relative' }}>
        <div style={{ marginBottom: 6 }}><GPill color="#F5C76E">AVRIL · CLÔTURE</GPill></div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.0, letterSpacing: -1.2 }}>Bilan du mois</div>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 11, position: 'relative' }}>
        <GFes padding="18px 20px" radius={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.9, lineHeight: 1.05 }}>Mois équilibré.</div>
            <div style={{ fontSize: 14, color: '#8A857C', fontWeight: 400, marginTop: 6, marginBottom: 11 }}>51 / 49 sur 30 jours · 21 jours équilibrés</div>
            <div style={{ height: 8, background: 'rgba(26,26,31,0.06)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '51%', background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }}></div>
              <div style={{ width: '49%', background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }}></div>
            </div>
          </div>
        </GFes>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, margin: '4px 0 8px', textTransform: 'uppercase', position: 'relative' }}>BADGES DU MOIS</div>
      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14, position: 'relative' }}>
        <GFes padding="13px 14px" radius={14}>
          <div style={{ fontSize: 21, marginBottom: 6 }}>🥇</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Première semaine fluide</div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>7 jours · débloqué le 8 avr</div>
        </GFes>
        <div style={{ background: 'rgba(255,255,255,0.45)', border: '1px dashed rgba(26,26,31,0.15)', borderRadius: 14, padding: '13px 14px', opacity: 0.7 }}>
          <div style={{ fontSize: 21, marginBottom: 6 }}>🔒</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Duo huilé</div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>14 jours · plus que 2 jours</div>
        </div>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, margin: '0 0 8px', textTransform: 'uppercase', position: 'relative' }}>MALUS DU MOIS</div>
      <div style={{ padding: '0 22px', position: 'relative' }}>
        <GFes padding="14px 16px" radius={16} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ fontSize: 20 }}>✓</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Tout est réglé.</div>
            <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>2 points hebdo soldés aux points du dimanche — rien à reporter.</div>
          </div>
        </GFes>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Clore avril → démarrer mai
        </div>
      </div>
    </GShell>
  );
}

// ═══════════ STREAK CÉLÉBRATION ═══════════
function StreakCelebrationCreme() {
  const confetti = [
    { x: 40, y: 130, c: '#F5A89A', s: 8 }, { x: 300, y: 110, c: '#FBE49A', s: 10 }, { x: 70, y: 300, c: '#C9E0C5', s: 7 },
    { x: 310, y: 280, c: '#E2D6F0', s: 9 }, { x: 30, y: 430, c: '#C9DFEA', s: 8 }, { x: 320, y: 420, c: '#F5A89A', s: 6 },
    { x: 120, y: 90, c: '#E2D6F0', s: 6 }, { x: 250, y: 170, c: '#C9E0C5', s: 7 },
  ];
  return (
    <GShell intensity="strong">
      {confetti.map((c, i) => (
        <div key={i} style={{ position: 'absolute', left: c.x, top: c.y, width: c.s, height: c.s, borderRadius: '50%', background: c.c, opacity: 0.9 }}></div>
      ))}
      <div style={{ padding: '40px 26px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 19 }}>
          <GMochi size={180} mood="happy"></GMochi>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 11 }}><GPill color="#4F7A57">STREAK</GPill></div>
        <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: -1.5, lineHeight: 1.05 }}>14 jours équilibrés<br></br>d'affilée.</div>
        <div style={{ fontSize: 15, color: '#8A857C', fontWeight: 400, marginTop: 10 }}>Personne n'a rien lâché. Nouveau record du duo.</div>
      </div>

      <div style={{ padding: '0 22px', marginTop: 21, position: 'relative' }}>
        <GFes padding="17px 18px" radius={18} style={{ border: '1.5px solid #F5C76E' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 24 }}>🏅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 600, color: '#8A6A1F', textTransform: 'uppercase', marginBottom: 6 }}>BADGE DÉBLOQUÉ</div>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.4 }}>Duo huilé</div>
            </div>
          </div>
        </GFes>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', flexDirection: 'column', gap: 13, alignItems: 'center' }}>
        <div style={{ alignSelf: 'stretch', background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Continuer
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}>Partager le badge</div>
      </div>
    </GShell>
  );
}

Object.assign(window, { WrappedSoloCreme, WrappedCoupleCreme, BilanMensuelCreme, StreakCelebrationCreme });
