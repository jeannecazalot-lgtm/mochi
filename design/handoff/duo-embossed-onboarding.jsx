// Embossed · Onboarding 01-04 (Constat / Charge mentale / Projection 260h / Au-delà du temps)
// Reprise des copy v3, repeintes dans le vocabulaire Embossed (cream cards, accent shadows, mono labels)

const {
  IridShell: OShell,
  FrameEmbossed: OFE,
  PillLabel: OPL
} = window;

// ─────────── Helpers ───────────
function OnbHeader({ step }) {
  return (
    <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 5 }}>
        {[1, 2, 3, 4, 5].map((i) =>
        <div key={i} style={{
          width: 18, height: 4, borderRadius: 2,
          background: i <= step ? '#1A1A1F' : 'rgba(26,26,31,0.10)',
          boxShadow: undefined
        }} />
        )}
      </div>
      <span style={{ fontSize: 13, color: '#8A857C', fontWeight: 500 }}>Passer</span>
    </div>);

}

function StepPill({ children }) {
  return <OPL color="#E97A6A">{children}</OPL>;
}

function CtaOnb({ children, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)',
      borderRadius: 14, padding: '17px 20px',
      textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#1A1A1F',
      boxShadow: '0 1px 2px rgba(26,26,31,0.06)',
      ...style
    }}>{children}</div>);

}

function SourceLine({ children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 11,
      color: '#8A857C', letterSpacing: 1.2, fontWeight: 500,
      textTransform: 'uppercase'
    }}>
      <span style={{ width: 14, height: 1, background: 'rgba(138,133,124,0.5)' }} />
      {children}
    </div>);

}

// ════════════════════════════════════════════════════════════════
// 01 · LE CONSTAT — 10h d'écart par semaine
// ════════════════════════════════════════════════════════════════
function OnbEmbossed01() {
  return (
    <OShell intensity="strong">
      <OnbHeader step={1} />

      <div style={{ padding: '22px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 14 }}><StepPill>01 · LE CONSTAT</StepPill></div>

        {/* Hero — gros chiffre cream embossed */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 22, background: '#F5A89A', opacity: 0.55, transform: 'translate(6px, 8px)' }} />
          <div style={{ position: 'relative' }}>
            <OFE padding="22px 23px 18px" radius={22}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Portées par une seule tête</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 92, fontWeight: 700, letterSpacing: -5, lineHeight: 0.88 }}>10h</div>
                <div style={{ fontSize: 20, fontWeight: 500, color: '#E97A6A', fontStyle: 'italic' }}>/sem.</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(26,26,31,0.06)' }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(26,26,31,0.05)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ flex: 0.7, background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
                  <div style={{ flex: 0.3, background: 'rgba(26,26,31,0.12)' }} />
                </div>
                <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 500, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>+1h26/jour</div>
              </div>
            </OFE>
          </div>
        </div>

        {/* Bodycopy */}
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 10 }}>
          C'est ce que porte en plus<br />
          la personne qui prend<br />
          <span style={{ color: '#E97A6A' }}>la charge du foyer.</span>
        </div>
        <div style={{ fontSize: 14.5, color: '#3A3A42', lineHeight: 1.5, fontWeight: 400 }}>
          1h26 par jour de tâches domestiques et d'organisation, dans la plupart des couples. Sur l'année, l'équivalent d'un <em>mi-temps invisible.</em>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 78, left: 22, right: 22 }}>
        <SourceLine>Insee · Enquête emploi du temps</SourceLine>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaOnb>Continuer →</CtaOnb>
      </div>
    </OShell>);

}

// ════════════════════════════════════════════════════════════════
// 02 · LA CHARGE MENTALE — liste de pensées dans une seule tête
// ════════════════════════════════════════════════════════════════
function OnbEmbossed02() {
  const items = [
  { c: '🩺', t: 'RDV pédiatre Léa', s: 'mardi 14h' },
  { c: '☕', t: 'Racheter du café', s: 'avant demain' },
  { c: '🎁', t: 'Cadeau anniv. Marie', s: '30 ans' },
  { c: '🚗', t: "Renouveler l'assurance auto", s: 'avant le 12' },
  { c: '🔧', t: 'Appeler le plombier', s: 'pour la fuite' }];

  return (
    <OShell intensity="soft">
      <OnbHeader step={2} />

      <div style={{ padding: '19px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 14 }}><StepPill>02 · LA CHARGE MENTALE</StepPill></div>

        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.05, marginBottom: 16 }}>
          <span style={{ color: '#E97A6A' }}>Faire</span> est une chose.<br />
          <span style={{ color: '#E97A6A' }}>Y penser</span> en est une autre.
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>
          Une journée. Une seule tête.
        </div>

        {/* Stack de pensées — chaque pensée = mini bulle embossed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((it, i) =>
          <OFE key={i} padding="11px 13px" radius={12} style={{ transform: `rotate(${i % 2 ? -0.4 : 0.3}deg)` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{it.c}</span>
                <div style={{ flex: 1, fontSize: 15, fontWeight: 500, letterSpacing: -0.1 }}>{it.t}</div>
                <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}>{it.s}</div>
              </div>
            </OFE>
          )}
          {/* fade items */}
          <div style={{ background: 'rgba(255,252,245,0.55)', borderRadius: 12, padding: '8px 13px', fontSize: 14, fontWeight: 400, color: '#8A857C', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16, opacity: 0.5 }}>👕</span>
            Sortir le pull bleu pour la photo
          </div>
          <div style={{ fontSize: 19, color: 'rgba(138,133,124,0.55)', textAlign: 'center', fontWeight: 600, letterSpacing: 4, marginTop: -2 }}>···</div>
        </div>

        <div style={{ fontSize: 15, color: '#3A3A42', marginTop: 11, fontStyle: 'italic', fontWeight: 400 }}>
          C'est ce qu'on appelle <strong style={{ fontStyle: 'normal', color: '#1A1A1F' }}>la charge mentale.</strong>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaOnb>Continuer →</CtaOnb>
      </div>
    </OShell>);

}

// ════════════════════════════════════════════════════════════════
// 03 · À UN AN — 260h / 11 jours pleins
// ════════════════════════════════════════════════════════════════
function OnbEmbossed03() {
  return (
    <OShell intensity="strong">
      <OnbHeader step={3} />

      <div style={{ padding: '22px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 14 }}><StepPill>03 · À UN AN</StepPill></div>

        {/* Hero — 260h en grand */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 22, background: '#9FC9A8', opacity: 0.55, transform: 'translate(-5px, 7px)' }} />
          <div style={{ position: 'relative' }}>
            <OFE padding="22px 23px 18px" radius={22}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>À se réapproprier, par an</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 80, fontWeight: 700, letterSpacing: -4, lineHeight: 0.88 }}>260h</div>
                <div style={{ fontSize: 21, fontWeight: 500, color: '#E97A6A', fontStyle: 'italic' }}>/an</div>
              </div>
              <div style={{ fontSize: 15, color: '#3A3A42', marginTop: 11, lineHeight: 1.35, fontWeight: 400 }}>
                Soit <strong style={{ color: '#E97A6A' }}>11 jours pleins,</strong> juste pour vivre.
              </div>
            </OFE>
          </div>
        </div>

        {/* Breakdown — chaque ligne avec accent shadow */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', marginBottom: 9 }}>Ça pourrait être :</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
          { n: '×100', l: 'dîners ensemble, sans gérer le reste', accent: '#F5C76E' },
          { n: '×26', l: 'week-ends qui ne ressemblent pas à du rangement', accent: '#B8A5D9' },
          { n: '×1', l: 'voyage de trois semaines, peut-être', accent: '#7DB3D5' }].
          map((r, i) =>
          <div key={i} style={{ position: 'relative' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: r.accent, opacity: 0.4, transform: 'translate(3px, 4px)' }} />
              <div style={{ position: 'relative' }}>
                <OFE padding="11px 14px" radius={14}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: -0.8, color: '#E97A6A', fontStyle: 'italic', minWidth: 56 }}>{r.n}</div>
                    <div style={{ flex: 1, fontSize: 14.5, fontWeight: 500, lineHeight: 1.3 }}>{r.l}</div>
                  </div>
                </OFE>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 78, left: 22, right: 22 }}>
        <SourceLine>Calcul · 1h26/jour ÷ 2 × 365</SourceLine>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaOnb>Continuer →</CtaOnb>
      </div>
    </OShell>);

}

// ════════════════════════════════════════════════════════════════
// 04 · AU-DELÀ DU TEMPS — ledger de ce qu'on s'épargne
// ════════════════════════════════════════════════════════════════
function OnbEmbossed04() {
  return (
    <OShell intensity="soft">
      <OnbHeader step={4} />

      <div style={{ padding: '19px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 14 }}><StepPill>04 · AU-DELÀ DU TEMPS</StepPill></div>

        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.05, marginBottom: 14 }}>
          Et tout ce qu'on s'<span style={{ color: '#E97A6A' }}>épargne</span> au passage.
        </div>

        {/* Ledger — embossed avec header type registre comptable */}
        <OFE padding="14px 16px 13px" radius={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 8, borderBottom: '1.5px solid #1A1A1F', marginBottom: 6 }}>
            <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 10.5, letterSpacing: 1.4, color: '#1A1A1F', fontWeight: 600 }}>ÉVITÉ</div>
            <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 10.5, letterSpacing: 1.4, color: '#1A1A1F', fontWeight: 600 }}>~ / AN</div>
          </div>

          {[
          { l: 'Disputes pour rien', v: '47', accent: true },
          { l: "Bouquets d'excuses", v: '12', accent: true },
          { l: '« J\'avais oublié »', v: '156', accent: true },
          { l: 'Enquêtes sur le lave-vaisselle', v: '0', accent: false },
          { l: 'Œufs sur lesquels marcher', v: '0', accent: false }].
          map((r, i, arr) =>
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 0', borderBottom: i === arr.length - 1 ? '1.5px solid #1A1A1F' : '1px solid rgba(26,26,31,0.08)' }}>
              <div style={{ fontSize: 14.5, fontWeight: 400, lineHeight: 1.3 }}>{r.l}</div>
              <div style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: r.accent ? 700 : 500,
              fontSize: 19, color: r.accent ? '#E97A6A' : '#8A857C',
              fontStyle: r.accent ? 'italic' : 'normal',
              letterSpacing: -0.4
            }}>{r.v}</div>
            </div>
          )}

          {/* totaux */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '12px 0 0' }}>
            <div style={{ fontSize: 15, fontWeight: 600, fontStyle: 'italic' }}>Couple qui respire</div>
            <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontWeight: 700, fontSize: 22, letterSpacing: -1, color: '#9FC9A8' }}>+1</div>
          </div>
        </OFE>

        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 11, color: '#8A857C', marginTop: 10, lineHeight: 1.45, letterSpacing: 0.4, fontWeight: 400 }}>
          * Chiffres officieux. Bien-être : confirmé.
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaOnb>Continuer →</CtaOnb>
      </div>
    </OShell>);

}

Object.assign(window, { OnbEmbossed01, OnbEmbossed02, OnbEmbossed03, OnbEmbossed04 });