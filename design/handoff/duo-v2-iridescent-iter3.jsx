// Duo v2 — Iridescent v2 : 3 itérations du flow
// Variante A : "Watercolor" — encadrés très tintés (50%+), pas de blur, vibe gouache
// Variante B : "Embossed" — encadrés crème + ombres profondes, label couleur en pastille
// Variante C : "Asymmetric" — encadrés tilt légers, decals texte coral, accents typo serif (light, pas bold)

const D = window.DUO;
const { MochiClay, MochiIridescent, FrameRectIrid, IridTabBarV2, GlowBgV2, SemainierBar, Semainier, DayStrip } = window;

// ─────────── Helper : page wrapper iridescent ──
function IridShell({ children, intensity = 'normal' }) {
  return (
    <div style={{ width: 360, height: 760, background: '#FAFAF7', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', color: '#1A1A1F' }}>
      <GlowBgV2 intensity={intensity} />
      <div style={{ padding: '54px 23px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, position: 'relative' }}>
        <span>9:41</span><span>•••</span>
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANTE A · WATERCOLOR — encadrés saturés, pas de blur, gouache
// ════════════════════════════════════════════════════════════════

function FrameWatercolor({ children, color = '#F5A89A', radius = 20, padding = 14, style = {} }) {
  const grainId = React.useId().replace(/:/g, '');
  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{
        background: color,
        borderRadius: radius,
        padding,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
      }}>
        {/* watercolor — soft noise (sans fibre papier) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.14 }}>
          <filter id={`fw${grainId}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="6" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#fw${grainId})`} />
        </svg>
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
}

function HomeWatercolor() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase' }}>DIM 28 AVR</div>
          <div style={{ fontSize: 17, fontWeight: 500 }}>Hello Valentin</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FBE49A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 11, position: 'relative' }}>
        <MochiIridescent size={130} mood="wink" />
      </div>

      <div style={{ padding: '0 22px', marginBottom: 11, position: 'relative' }}>
        <FrameWatercolor color="#F5A89A" padding="17px 18px" radius={20}>
          <div style={{ textAlign: 'center', color: '#1A1A1F' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.02 }}>Légèrement chez toi.</div>
            <div style={{ fontSize: 14, marginTop: 6, fontWeight: 400, opacity: 0.75 }}>18 min d'écart cette semaine.</div>
          </div>
        </FrameWatercolor>
      </div>

      <div style={{ padding: '0 18px', marginBottom: 9, position: 'relative' }}>
        <FrameWatercolor color="#FBE49A" padding="14px 16px" radius={18}>
          <SemainierBar />
        </FrameWatercolor>
      </div>

      <div style={{ padding: '8px 23px 6px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase', position: 'relative' }}>AUJOURD'HUI · 3 TÂCHES</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        <FrameWatercolor color="#C9E0C5" padding="11px 14px" radius={14} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>🍽</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Vaisselle du soir</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 3, opacity: 0.7 }}>20h00 · 15 min</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.28)' }} />
          </div>
        </FrameWatercolor>
        {[
          { e: '🐕', n: 'Sortir le chien', t: '21h30 · 20 min' },
          { e: '🛒', n: 'Courses', t: 'demain · 45 min' },
        ].map(t => (
          <div key={t.n} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>{t.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{t.n}</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{t.t}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.18)' }} />
          </div>
        ))}
      </div>

      <IridTabBarV2 active="home" />
    </IridShell>
  );
}

function TaskWatercolor() {
  return (
    <IridShell intensity="soft">
      <div style={{ padding: '14px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FBE49A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 500 }}>TÂCHE</div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FBE49A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>···</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 14px', position: 'relative' }}>
        <MochiIridescent size={120} mood="happy" />
      </div>

      <div style={{ padding: '0 22px', marginBottom: 16, position: 'relative' }}>
        <FrameWatercolor color="#F5A89A" padding="19px 23px" radius={22}>
          <div style={{ textAlign: 'center', color: '#1A1A1F' }}>
            <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', opacity: 0.7 }}>DOMESTIQUE</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.0 }}>Vaisselle du soir</div>
            <div style={{ fontSize: 13.5, marginTop: 6, fontWeight: 400, opacity: 0.7 }}>Tous les jours · 20h00 · Toi cette semaine</div>
          </div>
        </FrameWatercolor>
      </div>

      <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14, position: 'relative' }}>
        {[
          { k: 'DURÉE', v: '15ʼ', c: '#FBE49A' },
          { k: 'PÉNIB.', v: '4 ★', c: '#C9E0C5' },
          { k: 'IMPORT.', v: '3/5', c: '#C9DFEA' },
        ].map(s => (
          <FrameWatercolor key={s.k} color={s.c} padding="13px 13px" radius={14}>
            <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#3A3A42', fontWeight: 500, marginBottom: 6 }}>{s.k}</div>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.6 }}>{s.v}</div>
          </FrameWatercolor>
        ))}
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 500, marginBottom: 9, textTransform: 'uppercase', position: 'relative' }}>HISTORIQUE</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { who: 'V', day: 'Hier', tag: 'Fait', tagBg: '#C9E0C5', color: '#7DB3D5' },
          { who: 'J', day: 'Avant-hier', tag: 'Fait', tagBg: '#C9E0C5', color: '#B8A5D9' },
          { who: 'V', day: 'Lun 22', tag: 'Repassé', tagBg: '#F5A89A', color: '#7DB3D5' },
        ].map((h, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: h.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{h.who}</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{h.day}</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, background: h.tagBg, padding: '8px 10px', borderRadius: 999 }}>{h.tag}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: '#FBE49A', borderRadius: 999, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Repasser</div>
        <div style={{ flex: 1.6, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, boxShadow: '0 4px 16px rgba(245,168,154,0.28)' }}>✓ Marquer fait</div>
      </div>
    </IridShell>
  );
}

function BalanceWatercolor() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', marginBottom: 14, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>SEM. 17 · 22-28 AVR</div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.0, letterSpacing: -1.2 }}>Balance</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
        <MochiClay size={64} mood="happy" color="sky" />
        <div style={{ alignSelf: 'center', fontSize: 13, color: '#8A857C', fontWeight: 500 }}>vs</div>
        <MochiClay size={64} mood="happy" color="coral" />
      </div>

      <div style={{ margin: '0 18px 12px', position: 'relative' }}>
        <FrameWatercolor color="#C9DFEA" padding="18px 18px" radius={20}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginBottom: 11 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#1F5A82', fontWeight: 600, marginBottom: 6 }}>Valentin</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h30</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>48% · 12 tâches</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#C75744', fontWeight: 600, marginBottom: 6 }}>Jeanne</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h48</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>52% · 14 tâches</div>
            </div>
          </div>
          <div style={{ height: 8, background: 'rgba(26,26,31,0.10)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '48%', background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
            <div style={{ width: '52%', background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
          </div>
        </FrameWatercolor>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 500, margin: '8px 0 8px', textTransform: 'uppercase', position: 'relative' }}>PAR CATÉGORIE</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { cat: 'Domestique', v: 65, j: 35, hours: '6h12', bg: '#FBE49A' },
          { cat: 'Mental', v: 30, j: 70, hours: '2h08', bg: '#F5A89A' },
          { cat: 'Enfants', v: 50, j: 50, hours: '1h30', bg: '#C9E0C5' },
        ].map(c => (
          <FrameWatercolor key={c.cat} color={c.bg} padding="13px 14px" radius={14} style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{c.cat}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.hours}</div>
            </div>
            <div style={{ height: 6, background: 'rgba(26,26,31,0.12)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${c.v}%`, background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
              <div style={{ width: `${c.j}%`, background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
            </div>
          </FrameWatercolor>
        ))}
      </div>

      <IridTabBarV2 active="balance" />
    </IridShell>
  );
}

function OnboardingWatercolor() {
  return (
    <IridShell intensity="strong">
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
        <div style={{ fontSize: 13, letterSpacing: 1.6, fontWeight: 600 }}>DUO ●</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}>Passer</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 29, position: 'relative' }}>
        <MochiIridescent size={210} mood="happy" />
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <FrameWatercolor color="#FBE49A" padding="22px 24px" radius={22}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.2, marginBottom: 11 }}>
              Vous êtes deux à porter le foyer.
            </div>
            <div style={{ fontSize: 15.5, lineHeight: 1.5, fontWeight: 400, opacity: 0.78 }}>
              Duo aide les couples à répartir équitablement la charge mentale, sans se prendre la tête.
            </div>
          </div>
        </FrameWatercolor>
      </div>

      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 6, borderRadius: 3, background: '#1A1A1F' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Commencer →
        </div>
      </div>
    </IridShell>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANTE B · EMBOSSED — encadrés crème + ombres profondes + label couleur
// ════════════════════════════════════════════════════════════════

function FrameEmbossed({ children, bg = '#FFFCF5', radius = 20, padding = 14, style = {} }) {
  return (
    <div style={{ position: 'relative', ...style }}>
      <div style={{
        background: bg,
        borderRadius: radius,
        padding,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 0 0 1px rgba(26,26,31,0.05)`,
      }}>
        {children}
      </div>
    </div>
  );
}

function PillLabel({ color = '#E97A6A', tone = 'auto', children }) {
  // tone='dark' → label sombre sur fond clair de l'embossed (mieux contraste sur fonds saturés)
  const dark = tone === 'dark';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', background: dark ? 'rgba(26,26,31,0.10)' : `${color}28`, color: dark ? '#1A1A1F' : color, fontSize: 10.5, fontWeight: 600, letterSpacing: 1.4, padding: '8px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
      {children}
    </div>
  );
}

function HomeEmbossed() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase' }}>DIM 28 AVR</div>
          <div style={{ fontSize: 17, fontWeight: 500 }}>Hello Valentin</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14, position: 'relative' }}>
        <MochiIridescent size={130} mood="wink" />
      </div>

      <div style={{ padding: '0 22px', marginBottom: 11, position: 'relative' }}>
        <FrameEmbossed accent="#E97A6A" padding="17px 20px" radius={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 9 }}><PillLabel color="#E97A6A">CETTE SEMAINE</PillLabel></div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.02 }}>Légèrement chez toi.</div>
            <div style={{ fontSize: 14, color: '#3A3A42', marginTop: 6, fontWeight: 400 }}>18 min d'écart</div>
          </div>
        </FrameEmbossed>
      </div>

      <div style={{ padding: '0 18px', marginBottom: 9, position: 'relative' }}>
        <DayStrip />
      </div>

      <div style={{ padding: '8px 23px 6px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase', position: 'relative' }}>AUJOURD'HUI · 3 TÂCHES</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        <FrameEmbossed accent="#9FC9A8" padding="11px 14px" radius={14} style={{ marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>🍽</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Vaisselle du soir</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>20h00 · 15 min</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.22)' }} />
          </div>
        </FrameEmbossed>
        {[
          { e: '🐕', n: 'Sortir le chien', t: '21h30 · 20 min' },
          { e: '🛒', n: 'Courses', t: 'demain · 45 min' },
        ].map(t => (
          <div key={t.n} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>{t.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{t.n}</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{t.t}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.18)' }} />
          </div>
        ))}
      </div>

      <IridTabBarV2 active="home" />
    </IridShell>
  );
}

function TaskEmbossed() {
  return (
    <IridShell intensity="soft">
      <div style={{ padding: '14px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>TÂCHE</div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>···</div>
      </div>

      <div style={{ padding: '0 22px', margin: '18px 0 16px', position: 'relative' }}>
        <FrameEmbossed padding="24px 23px" radius={22}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 10 }}><PillLabel color="#E97A6A">DOMESTIQUE</PillLabel></div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.0 }}>Vaisselle du soir</div>
            <div style={{ fontSize: 13.5, color: '#3A3A42', marginTop: 9, fontWeight: 400 }}>Tous les jours · 20h00 · Toi cette semaine</div>
          </div>
        </FrameEmbossed>
      </div>

      <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16, position: 'relative' }}>
        {[
          { k: 'DURÉE', v: '15ʼ', sh: '#F5A89A' },     // coral
          { k: 'PÉNIB.', v: '4 ★', sh: '#E2D6F0' },    // lavender
          { k: 'IMPORT.', v: '3/5', sh: '#C9DFEA' },   // sky
        ].map(s => (
          <div key={s.k} style={{ position: 'relative' }}>
            {/* ombre colorée décalée */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, borderRadius: 14,
              background: s.sh, transform: 'translate(4px, 5px)', zIndex: 0,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <FrameEmbossed padding="14px 13px" radius={14}>
                <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#8A857C', fontWeight: 500, marginBottom: 6 }}>{s.k}</div>
                <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.6 }}>{s.v}</div>
              </FrameEmbossed>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase', position: 'relative' }}>HISTORIQUE</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { who: 'V', day: 'Hier', tag: 'Fait', tagBg: '#C9E0C5', color: '#7DB3D5' },
          { who: 'J', day: 'Avant-hier', tag: 'Fait', tagBg: '#C9E0C5', color: '#B8A5D9' },
          { who: 'V', day: 'Lun 22', tag: 'Repassé', tagBg: '#F5A89A', color: '#7DB3D5' },
        ].map((h, i) => (
          <div key={i} style={{ background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', borderRadius: 12, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: h.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{h.who}</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{h.day}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, background: h.tagBg, padding: '8px 10px', borderRadius: 999 }}>{h.tag}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', borderRadius: 999, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Repasser</div>
        <div style={{ flex: 1.6, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1A1A1F', boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>✓ Marquer fait</div>
      </div>
    </IridShell>
  );
}

function BalanceEmbossed() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', marginBottom: 14, position: 'relative' }}>
        <div style={{ marginBottom: 6 }}><PillLabel color="#7DB3D5">SEM. 17 · 22-28 AVR</PillLabel></div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.0, letterSpacing: -1.2 }}>Balance</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
        <MochiClay size={64} mood="happy" color="sky" />
        <div style={{ alignSelf: 'center', fontSize: 13, color: '#8A857C', fontWeight: 500 }}>vs</div>
        <MochiClay size={64} mood="happy" color="coral" />
      </div>

      <div style={{ margin: '0 18px 12px', position: 'relative' }}>
        <FrameEmbossed accent="#B8A5D9" padding="18px 18px" radius={20}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginBottom: 11 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#7DB3D5', fontWeight: 600, marginBottom: 6 }}>Valentin</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h30</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>48% · 12 tâches</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#C75744', fontWeight: 600, marginBottom: 6 }}>Jeanne</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h48</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>52% · 14 tâches</div>
            </div>
          </div>
          <div style={{ height: 8, background: 'rgba(26,26,31,0.06)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '48%', background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
            <div style={{ width: '52%', background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
          </div>
        </FrameEmbossed>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 500, margin: '8px 0 8px', textTransform: 'uppercase', position: 'relative' }}>PAR CATÉGORIE</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { cat: 'Domestique', v: 65, j: 35, hours: '6h12', a: '#F5C76E' },
          { cat: 'Mental', v: 30, j: 70, hours: '2h08', a: '#E97A6A' },
          { cat: 'Enfants', v: 50, j: 50, hours: '1h30', a: '#9FC9A8' },
        ].map(c => (
          <FrameEmbossed key={c.cat} accent={c.a} padding="13px 14px" radius={14} style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{c.cat}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.hours}</div>
            </div>
            <div style={{ height: 6, background: 'rgba(26,26,31,0.06)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${c.v}%`, background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
              <div style={{ width: `${c.j}%`, background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
            </div>
          </FrameEmbossed>
        ))}
      </div>

      <IridTabBarV2 active="balance" />
    </IridShell>
  );
}

function OnboardingEmbossed() {
  return (
    <IridShell intensity="strong">
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
        <div style={{ fontSize: 13, letterSpacing: 1.6, fontWeight: 600 }}>DUO ●</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}>Passer</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 29, position: 'relative' }}>
        <MochiIridescent size={210} mood="happy" />
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <FrameEmbossed accent="#E97A6A" padding="24px 24px" radius={22}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}><PillLabel color="#E97A6A">BIENVENUE</PillLabel></div>
            <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.2, marginBottom: 11 }}>
              Vous êtes deux à porter le foyer.
            </div>
            <div style={{ fontSize: 15.5, color: '#3A3A42', lineHeight: 1.5, fontWeight: 400 }}>
              Duo aide les couples à répartir équitablement la charge mentale, sans se prendre la tête.
            </div>
          </div>
        </FrameEmbossed>
      </div>

      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 6, borderRadius: 3, background: '#1A1A1F' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Commencer →
        </div>
      </div>
    </IridShell>
  );
}

// ════════════════════════════════════════════════════════════════
// VARIANTE C · ASYMMETRIC — encadrés tilt légers + decals coral
// ════════════════════════════════════════════════════════════════

function FrameAsym({ children, color = '#F5A89A', tilt = 0, radius = 18, padding = 14, style = {} }) {
  const grainId = React.useId().replace(/:/g, '');
  return (
    <div style={{ position: 'relative', transform: tilt ? `rotate(${tilt}deg)` : undefined, ...style }}>
      <div style={{
        background: color,
        borderRadius: radius,
        padding,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.18 }}>
          <filter id={`fa${grainId}`}>
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="5" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0.18  0 0 0 0 0.10  0 0 0 0 0.06  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#fa${grainId})`} />
        </svg>
        <div style={{ position: 'relative' }}>{children}</div>
      </div>
    </div>
  );
}

function HomeAsym() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase' }}>DIM 28 AVR</div>
          <div style={{ fontSize: 17, fontWeight: 500 }}>Hello Valentin</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 9, position: 'relative' }}>
        <MochiIridescent size={130} mood="wink" />
      </div>

      {/* "Légèrement chez toi" — encadré pastel coral légèrement tilté */}
      <div style={{ padding: '0 22px', marginBottom: 14, position: 'relative' }}>
        <FrameAsym color="#FFD4C4" tilt={-0.6} padding="17px 18px" radius={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.02 }}>Légèrement chez toi.</div>
            <div style={{ fontSize: 14, color: '#3A3A42', marginTop: 6, fontWeight: 400 }}>18 min d'écart cette semaine.</div>
          </div>
        </FrameAsym>
      </div>

      <div style={{ padding: '0 18px', marginBottom: 6, position: 'relative' }}>
        <FrameAsym color="#FBE49A" padding="13px 14px" radius={16}>
          <SemainierBar />
        </FrameAsym>
      </div>

      <div style={{ padding: '8px 23px 6px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase', position: 'relative' }}>AUJOURD'HUI · 3 TÂCHES</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        <FrameAsym color="#FFD4C4" tilt={-0.6} padding="11px 14px" radius={14} style={{ marginBottom: 9 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>🍽</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Vaisselle du soir</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 3, opacity: 0.7 }}>20h00 · 15 min</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.28)' }} />
          </div>
        </FrameAsym>
        {[
          { e: '🐕', n: 'Sortir le chien', t: '21h30 · 20 min', tilt: 0.4 },
          { e: '🛒', n: 'Courses', t: 'demain · 45 min', tilt: -0.3 },
        ].map(t => (
          <div key={t.n} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>{t.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{t.n}</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{t.t}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid rgba(26,26,31,0.18)' }} />
          </div>
        ))}
      </div>

      <IridTabBarV2 active="home" />
    </IridShell>
  );
}

function TaskAsym() {
  return (
    <IridShell intensity="soft">
      <div style={{ padding: '14px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 500 }}>TÂCHE</div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>···</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 14px', position: 'relative' }}>
        <MochiIridescent size={120} mood="happy" />
      </div>

      <div style={{ padding: '0 22px', marginBottom: 16, position: 'relative' }}>
        <FrameAsym color="#FFD4C4" tilt={-0.5} padding="22px 23px 18px" radius={22}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600, color: '#3A3A42', marginBottom: 9, textTransform: 'uppercase', opacity: 0.7 }}>DOMESTIQUE</div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.0 }}>Vaisselle du soir</div>
            <div style={{ fontSize: 13.5, marginTop: 9, fontWeight: 400, opacity: 0.7 }}>Tous les jours · 20h00 · Toi cette semaine</div>
          </div>
        </FrameAsym>
      </div>

      <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14, position: 'relative' }}>
        {[
          { k: 'DURÉE', v: '15ʼ', c: '#FBE49A', t: -1 },
          { k: 'PÉNIB.', v: '4 ★', c: '#C9E0C5', t: 1 },
          { k: 'IMPORT.', v: '3/5', c: '#C9DFEA', t: -0.5 },
        ].map(s => (
          <FrameAsym key={s.k} color={s.c} tilt={s.t} padding="13px 13px" radius={14}>
            <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#3A3A42', fontWeight: 500, marginBottom: 6 }}>{s.k}</div>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.6 }}>{s.v}</div>
          </FrameAsym>
        ))}
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 500, marginBottom: 9, textTransform: 'uppercase', position: 'relative' }}>HISTORIQUE</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { who: 'V', day: 'Hier', tag: 'Fait', tagBg: '#9FC9A8', color: '#7DB3D5' },
          { who: 'J', day: 'Avant-hier', tag: 'Fait', tagBg: '#9FC9A8', color: '#B8A5D9' },
          { who: 'V', day: 'Lun 22', tag: 'Repassé', tagBg: '#F5A89A', color: '#7DB3D5' },
        ].map((h, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 12, padding: '10px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: h.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>{h.who}</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{h.day}</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, background: h.tagBg, padding: '8px 10px', borderRadius: 999 }}>{h.tag}</div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', gap: 8 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.08)', borderRadius: 999, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 500 }}>Repasser</div>
        <div style={{ flex: 1.6, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '14px 16px', textAlign: 'center', fontSize: 15, fontWeight: 600, boxShadow: '0 4px 16px rgba(245,168,154,0.28)' }}>✓ Marquer fait</div>
      </div>
    </IridShell>
  );
}

function BalanceAsym() {
  return (
    <IridShell>
      <div style={{ padding: '14px 23px 0', marginBottom: 14, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>SEM. 17 · 22-28 AVR</div>
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.0, letterSpacing: -1.2 }}>Votre balance</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
        <MochiClay size={64} mood="happy" color="sky" />
        <div style={{ alignSelf: 'center', fontSize: 13, color: '#8A857C', fontWeight: 500 }}>vs</div>
        <MochiClay size={64} mood="happy" color="coral" />
      </div>

      <div style={{ margin: '0 18px 12px', position: 'relative' }}>
        <FrameAsym color="#E2D6F0" padding="18px 18px" radius={20}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginBottom: 11 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#1F5A82', fontWeight: 600, marginBottom: 6 }}>Valentin</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h30</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>48% · 12 tâches</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#C75744', fontWeight: 600, marginBottom: 6 }}>Jeanne</div>
              <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>4h48</div>
              <div style={{ fontSize: 13, fontWeight: 400, marginTop: 4, opacity: 0.7 }}>52% · 14 tâches</div>
            </div>
          </div>
          <div style={{ height: 8, background: 'rgba(26,26,31,0.10)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '48%', background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
            <div style={{ width: '52%', background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
          </div>
        </FrameAsym>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 500, margin: '8px 0 8px', textTransform: 'uppercase', position: 'relative' }}>PAR CATÉGORIE</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { cat: 'Domestique', v: 65, j: 35, hours: '6h12', c: '#FBE49A', t: -0.5 },
          { cat: 'Mental', v: 30, j: 70, hours: '2h08', c: '#FFD4C4', t: 0.5 },
          { cat: 'Enfants', v: 50, j: 50, hours: '1h30', c: '#C9E0C5', t: -0.3 },
        ].map(c => (
          <FrameAsym key={c.cat} color={c.c} tilt={c.t} padding="13px 14px" radius={14} style={{ marginBottom: 9 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 9 }}>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{c.cat}</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.hours}</div>
            </div>
            <div style={{ height: 6, background: 'rgba(26,26,31,0.12)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${c.v}%`, background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
              <div style={{ width: `${c.j}%`, background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
            </div>
          </FrameAsym>
        ))}
      </div>

      <IridTabBarV2 active="balance" />
    </IridShell>
  );
}

function OnboardingAsym() {
  return (
    <IridShell intensity="strong">
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
        <div style={{ fontSize: 13, letterSpacing: 1.6, fontWeight: 600 }}>DUO ●</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}>Passer</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 29, position: 'relative' }}>
        <MochiIridescent size={210} mood="happy" />
      </div>

      <div style={{ padding: '0 28px', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.2, marginBottom: 14 }}>
          Vous êtes deux à porter le foyer.
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.5, color: '#3A3A42', fontWeight: 400, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          Duo aide les couples à répartir équitablement la charge mentale, sans se prendre la tête.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 24, height: 6, borderRadius: 3, background: '#1A1A1F' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
        <div style={{ width: 6, height: 6, borderRadius: 3, background: 'rgba(26,26,31,0.18)' }} />
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Commencer →
        </div>
      </div>
    </IridShell>
  );
}

Object.assign(window, {
  HomeWatercolor, TaskWatercolor, BalanceWatercolor, OnboardingWatercolor,
  HomeEmbossed, TaskEmbossed, BalanceEmbossed, OnboardingEmbossed,
  HomeAsym, TaskAsym, BalanceAsym, OnboardingAsym,
  IridShell, FrameEmbossed, FrameWatercolor, FrameAsym, PillLabel,
});
