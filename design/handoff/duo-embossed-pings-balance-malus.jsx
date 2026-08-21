// Embossed · Onglet Pings + Balance détail + Malus + Malus customs
// Réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent, IridTabBarV2

const {
  IridShell: PShell,
  FrameEmbossed: PFE,
  PillLabel: PPL,
  MochiIridescent: PMI,
  MochiClay: PMC,
  IridTabBarV2: PTB,
} = window;

// ════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════
function ScreenHeader({ left, title, right, sub }) {
  return (
    <div style={{ padding: '14px 18px 0', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {left ?? <div style={{ width: 38 }} />}
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600, textTransform: 'uppercase' }}>{title}</div>
        {right ?? <div style={{ width: 38 }} />}
      </div>
      {sub && <div style={{ marginTop: 6, fontSize: 13, color: '#8A857C', fontWeight: 400, textAlign: 'center' }}>{sub}</div>}
    </div>
  );
}

function RoundBtn({ children, light = false }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: light ? '#FFFCF5' : '#FFFCF5',
      boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════
// ONGLET · PINGS — conversation embossée + presets + composer
// ════════════════════════════════════════════════════════════════
function PingsEmbossed() {
  return (
    <PShell intensity="soft">
      <ScreenHeader
        left={<RoundBtn>←</RoundBtn>}
        title="PINGS"
        right={
          <div style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', background: '#B8A5D9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
            J
            <span style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderRadius: '50%', background: '#9FC9A8', border: '2px solid #FAFAF7' }} />
          </div>
        }
      />

      {/* Hero · contexte du couple */}
      <div style={{ padding: '14px 23px 0', position: 'relative' }}>
        <PFE padding="14px 16px" radius={18} style={{ marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <PMI size={48} mood="wink" />
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 6 }}><PPL color="#9FC9A8">EN LIGNE</PPL></div>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3 }}>Jeanne</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>2 pings cette semaine · paisible</div>
            </div>
          </div>
        </PFE>
      </div>

      {/* Conversation */}
      <div style={{ padding: '8px 18px 0', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
        <div style={{ alignSelf: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 10.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500 }}>HIER · 20:35</div>

        {/* received — bulle crème embossed */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '78%' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>J</div>
          <div style={{ background: '#FFFCF5', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 400, lineHeight: 1.35 }}>"La vaisselle s'auto-fait pas chéri 😘"</div>
            <div style={{ fontSize: 11.5, color: '#8A857C', marginTop: 4, fontWeight: 400 }}>à propos de <strong style={{ color: '#1A1A1F', fontWeight: 500 }}>Vaisselle</strong></div>
          </div>
        </div>

        {/* sent — bulle sombre */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '78%', alignSelf: 'flex-end' }}>
          <div style={{ background: '#332F2D', color: '#FFFCF5', borderRadius: '16px 16px 4px 16px', padding: '10px 14px', boxShadow: '0 4px 12px rgba(50,40,30,0.20)' }}>
            <div style={{ fontSize: 15, fontWeight: 400 }}>J'arriiive 🏃‍♂️</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,252,245,0.55)', marginTop: 3, fontWeight: 400 }}>20:36 · vu</div>
          </div>
        </div>

        {/* system event — pill embossed */}
        <div style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 6, background: '#C9E0C5', borderRadius: 999, padding: '8px 13px', fontSize: 11.5, fontWeight: 600, letterSpacing: 0.3, color: '#1A1A1F', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          ✓ Vaisselle marquée faite · 20:52
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
          <div style={{ background: '#FFFCF5', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
            <div style={{ fontSize: 15, fontWeight: 400 }}>Merci 💚</div>
          </div>
        </div>

        <div style={{ alignSelf: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 10.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, marginTop: 4 }}>AUJOURD'HUI</div>

        {/* milestone — cream card + accent butter */}
        <PFE padding="11px 14px" radius={14} style={{ alignSelf: 'center', maxWidth: 240, textAlign: 'center', border: '1.5px solid #F5C76E' }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>Soirée équilibrée 🥳</div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>+1 jour à votre streak (12 🔥)</div>
        </PFE>
      </div>

      {/* Presets — flottants au-dessus du composer */}
      <div style={{ position: 'absolute', bottom: 142, left: 18, right: 18 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Rappels rapides</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'hidden' }}>
          {[
            { l: '🌷 Rappel doux', bg: '#FFFCF5' },
            { l: '🐕 Le chien…', bg: '#FFFCF5' },
            { l: '❤️ Ton tour', bg: '#FFFCF5' },
          ].map(p => (
            <div key={p.l} style={{
              background: p.bg, borderRadius: 999, padding: '8px 11px',
              fontSize: 13.5, fontWeight: 500,
              boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
              whiteSpace: 'nowrap',
            }}>{p.l}</div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div style={{ position: 'absolute', bottom: 86, left: 18, right: 18 }}>
        <div style={{
          background: '#FFFCF5', borderRadius: 999, padding: '9px 9px 9px 16px',
          display: 'flex', gap: 9, alignItems: 'center',
          boxShadow: '0 -1px 0 rgba(26,26,31,0.08)',
        }}>
          <span style={{ fontSize: 15, color: '#8A857C', fontWeight: 400, flex: 1 }}>Écrire à Jeanne…</span>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(245,168,154,0.32)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l14-7-5 14-3-5-6-2z" stroke="#1A1A1F" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <PTB active="balance" />
    </PShell>
  );
}

// ════════════════════════════════════════════════════════════════
// BALANCE · DÉTAIL — déséquilibre + chart + breakdown par tâche
// ════════════════════════════════════════════════════════════════
function BalanceDetailEmbossed() {
  return (
    <PShell intensity="soft">
      <ScreenHeader
        left={<RoundBtn>←</RoundBtn>}
        title="DÉTAIL"
        right={<RoundBtn>···</RoundBtn>}
      />

      <div style={{ padding: '14px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 6 }}><PPL color="#E97A6A">DÉSÉQUILIBRE · 28% D'ÉCART</PPL></div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.0 }}>Jeanne porte plus<br/>cette semaine.</div>
      </div>

      {/* Hero — comparatif avec deux Mochis qui s'inclinent */}
      <div style={{ padding: '17px 18px 0', position: 'relative' }}>
        <PFE padding="18px 18px" radius={20} style={{ marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, color: '#7DB3D5', fontWeight: 600, letterSpacing: 0.4, marginBottom: 6 }}>VALENTIN</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1 }}>3h12</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>36% · 9 tâches</div>
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ fontSize: 11.5, color: '#C75744', fontWeight: 600, letterSpacing: 0.4, marginBottom: 6 }}>JEANNE</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1 }}>5h44</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>64% · 17 tâches</div>
            </div>
          </div>
          <div style={{ height: 10, background: 'rgba(26,26,31,0.06)', borderRadius: 5, overflow: 'hidden', display: 'flex', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
            <div style={{ width: '36%', background: 'linear-gradient(90deg, #7DB3D5, #B8A5D9)' }} />
            <div style={{ width: '64%', background: 'linear-gradient(90deg, #F5A89A, #E97A6A)' }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'rgba(233,122,106,0.10)', borderRadius: 10 }}>
            <span style={{ fontSize: 15 }}>⚠️</span>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: '#1A1A1F', flex: 1, lineHeight: 1.35 }}>
              Si ça dure 2 semaines : <strong>Mochi suggérera un re-dispatch.</strong>
            </div>
          </div>
        </PFE>
      </div>

      {/* Chart 7 jours */}
      <div style={{ padding: '0 18px 10px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '0 4px 8px' }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase' }}>7 derniers jours</div>
          <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 500 }}>en min/jour</div>
        </div>
        <PFE padding="14px 14px" radius={16}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90 }}>
            {[
              { d: 'L', v: 42, j: 55 },
              { d: 'M', v: 28, j: 60 },
              { d: 'M', v: 35, j: 50 },
              { d: 'J', v: 30, j: 72 },
              { d: 'V', v: 18, j: 80 },
              { d: 'S', v: 25, j: 70 },
              { d: 'D', v: 15, j: 45 },
            ].map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 70 }}>
                  <div style={{ width: 8, height: `${b.v}%`, background: 'linear-gradient(180deg, #7DB3D5, #5C95BA)', borderRadius: '3px 3px 0 0' }} />
                  <div style={{ width: 8, height: `${b.j}%`, background: 'linear-gradient(180deg, #F5A89A, #E97A6A)', borderRadius: '3px 3px 0 0' }} />
                </div>
                <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 600 }}>{b.d}</div>
              </div>
            ))}
          </div>
        </PFE>
      </div>

      {/* Top contributeurs déséquilibre */}
      <div style={{ padding: '8px 23px 8px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', position: 'relative' }}>Ce qui pèse</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { c: '🧠', l: 'Charge mentale', s: 'RDV pédiatre, anniv belle-mère…', who: 'J', whoColor: '#B8A5D9', delta: '+58 min', accent: '#E97A6A' },
          { c: '🧺', l: 'Lessive', s: '3 cycles vs 0 · cette semaine', who: 'J', whoColor: '#B8A5D9', delta: '+45 min', accent: '#B8A5D9' },
        ].map((r, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 6 }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: r.accent, opacity: 0.35, transform: 'translate(3px, 4px)' }} />
            <div style={{ position: 'relative' }}>
              <PFE padding="9px 13px" radius={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <span style={{ fontSize: 19 }}>{r.c}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 500 }}>{r.l}</div>
                    <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{r.s}</div>
                  </div>
                  <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 13, fontWeight: 600, color: '#C75744' }}>{r.delta}</div>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: r.whoColor, color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.who}</div>
                </div>
              </PFE>
            </div>
          </div>
        ))}
      </div>

      {/* CTA bas — repassage suggéré */}
      <div style={{ position: 'absolute', bottom: 86, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 4px 16px rgba(245,168,154,0.32)' }}>
          <span style={{ fontSize: 18 }}>✨</span>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#1A1A1F' }}>Rééquilibrer avec Mochi</div>
          <span style={{ fontSize: 18, color: '#1A1A1F' }}>›</span>
        </div>
      </div>

      <PTB active="balance" />
    </PShell>
  );
}

// ════════════════════════════════════════════════════════════════
// MALUS · BILAN DU MOIS — points + détail + proposition custom
// ════════════════════════════════════════════════════════════════
function MalusEmbossed() {
  return (
    <PShell intensity="soft">
      <ScreenHeader left={<RoundBtn>←</RoundBtn>} title="MALUS" right={<RoundBtn>···</RoundBtn>} />

      <div style={{ padding: '14px 23px 0', position: 'relative' }}>
        <div style={{ marginBottom: 6 }}><PPL color="#E97A6A">POINT HEBDO · DIM 28</PPL></div>
        <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.0 }}>Tes petits malus.</div>
        <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 6, lineHeight: 1.35 }}>On fait le point chaque semaine. Pas de punition — un geste et on repart à zéro.</div>
      </div>

      {/* Hero — score en card crème + bordure coral, Mochi triste */}
      <div style={{ padding: '13px 18px 0', position: 'relative' }}>
        <PFE padding="14px 18px" radius={20} style={{ marginBottom: 10, border: '1.5px solid #E97A6A' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <PMI size={56} mood="sad" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.4, color: '#C75744', fontWeight: 600, marginBottom: 6 }}>POINTS DE MALUS</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -1.4, lineHeight: 1 }}>5</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#8A857C' }}>pts</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1A1F', marginTop: 3 }}>cette semaine</div>
            </div>
          </div>
          {/* mini progress */}
          <div style={{ marginTop: 10, display: 'flex', gap: 5 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= 5 ? '#E97A6A' : 'rgba(26,26,31,0.10)' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10.5, fontWeight: 600, color: '#8A857C' }}>
            <span>0</span><span>SEUIL · 10</span>
          </div>
        </PFE>
      </div>

      {/* DÉTAIL */}
      <div style={{ padding: '8px 23px 6px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', position: 'relative' }}>Détail</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { c: '🍽', l: 'Vaisselle ratée', d: '2 fois · importance 2', pts: 3, accent: '#F5C76E' },
          { c: '🛒', l: 'Courses repassées', d: '1 fois · importance 1', pts: 2, accent: '#B8A5D9' },
        ].map((m, i) => (
          <div key={i} style={{ position: 'relative', marginBottom: 6 }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: m.accent, opacity: 0.35, transform: 'translate(3px, 4px)' }} />
            <div style={{ position: 'relative' }}>
              <PFE padding="11px 14px" radius={14}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <span style={{ fontSize: 19 }}>{m.c}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 500 }}>{m.l}</div>
                    <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{m.d}</div>
                  </div>
                  <div style={{ background: '#1A1A1F', color: '#FFFCF5', padding: '8px 10px', borderRadius: 999, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 13.5, fontWeight: 600 }}>+{m.pts}</div>
                </div>
              </PFE>
            </div>
          </div>
        ))}
      </div>

      {/* Proposition custom — encadré sage, contre-proposition */}
      <div style={{ padding: '10px 18px 0', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 16, background: '#9FC9A8', opacity: 0.45, transform: 'translate(4px, 5px)' }} />
          <div style={{ position: 'relative' }}>
            <PFE padding="13px 16px" radius={16}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <span style={{ fontSize: 18 }}>💡</span>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, color: '#4F7A57', textTransform: 'uppercase', flex: 1 }}>Jeanne te propose</div>
                <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 12, color: '#8A857C', fontWeight: 600 }}>et on efface tout</div>
              </div>
              <div style={{ fontSize: 16.5, fontWeight: 600, fontStyle: 'italic', color: '#1A1A1F', letterSpacing: -0.2, lineHeight: 1.25, marginBottom: 10 }}>
                “Massage 10 min ce week-end…”
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ flex: 1.4, background: '#1A1A1F', color: '#FFFCF5', borderRadius: 999, padding: '8px 14px', textAlign: 'center', fontSize: 14.5, fontWeight: 600, boxShadow: '0 4px 12px rgba(26,26,31,0.20)' }}>Accepter</div>
                <div style={{ flex: 1, background: '#FFFCF5', borderRadius: 999, padding: '8px 14px', textAlign: 'center', fontSize: 14.5, fontWeight: 500, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>Refuser</div>
              </div>
            </PFE>
          </div>
        </div>
      </div>

      {/* Exemples de gages — suggérés au moment du point, rien à configurer */}
      <div style={{ position: 'absolute', bottom: 86, left: 22, right: 22 }}>
        <div style={{ fontSize: 10.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Ou pioche une idée</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[
            { l: 'Repas dim.' },
            { l: 'Petit-déj au lit' },
            { l: 'Ciné à son choix' },
          ].map(c => (
            <div key={c.l} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: '#FFFCF5',
              borderRadius: 999, padding: '8px 10px',
              fontSize: 13, fontWeight: 500,
              boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
            }}>
              <span>{c.l}</span>
            </div>
          ))}
        </div>
      </div>

      <PTB active="balance" />
    </PShell>
  );
}

Object.assign(window, { PingsEmbossed, BalanceDetailEmbossed, MalusEmbossed });
