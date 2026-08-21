// Onglet "À faire" en DNA Embossed Saturé
// 4 écrans : Liste / Setup tâche / En retard / Filtres

const { MochiClay: MC, MochiIridescent: MI, IridTabBarV2: TB, GlowBgV2: GB, FrameES: FES, PillES: PE } = window;

function ShellAF({ children, intensity = 'normal' }) {
  return (
    <div style={{ width: 360, height: 760, background: '#FAFAF7', boxSizing: 'border-box', position: 'relative', overflow: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', color: '#1A1A1F' }}>
      <GB intensity={intensity} />
      <div style={{ padding: '54px 23px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, position: 'relative' }}>
        <span>9:41</span><span>•••</span>
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 1 · LISTE À FAIRE — groupes par jour, filtres, FAB
// ════════════════════════════════════════════════════════════════
function AFList() {
  const groups = [
    { day: "AUJOURD'HUI · LUN", count: 4, items: [
      { c: '🐕', l: 'Sortie chien matin', t: '8h00 · 15ʼ', who: 'V', whoColor: '#7DB3D5', done: true, bg: '#C9E0C5' },
      { c: '🛒', l: 'Courses Monoprix', t: 'en retard depuis 12h30', who: 'V', whoColor: '#7DB3D5', urgent: true, bg: '#F5A89A' },
      { c: '🍽', l: 'Vaisselle midi', t: '13h30 · 10ʼ', who: 'J', whoColor: '#B8A5D9', done: true },
      { c: '🍽', l: 'Vaisselle soir', t: '20h30 · 15ʼ', who: 'V', whoColor: '#7DB3D5' },
    ] },
    { day: 'DEMAIN · MAR', count: 2, items: [
      { c: '🗑', l: 'Sortir poubelles', t: '21h00 · 5ʼ', who: 'V', whoColor: '#7DB3D5' },
      { c: '🧺', l: 'Lessive blanc', t: '18h00 · 30ʼ', who: 'J', whoColor: '#B8A5D9' },
    ] },
  ];
  return (
    <ShellAF>
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.0 }}>À faire</div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>6 tâches · dont 1 en retard</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⌕</div>
      </div>

      {/* filtres */}
      <div style={{ padding: '8px 18px 14px', display: 'flex', gap: 6, position: 'relative' }}>
        {[
          { l: 'Tout', active: true, count: 6 },
          { l: 'Moi', active: false, count: 3 },
          { l: 'Jeanne', active: false, count: 3 },
          { l: 'En retard', active: false, count: 1, alert: true },
        ].map(f => (
          <div key={f.l} style={{
            padding: '8px 13px', borderRadius: 999,
            background: f.active ? '#1A1A1F' : (f.alert ? '#F5A89A' : 'rgba(255,255,255,0.55)'),
            backdropFilter: 'blur(10px)',
            color: f.active ? '#FFFCF5' : (f.alert ? '#1A1A1F' : '#1A1A1F'),
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: f.active ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
          }}>
            {f.l}
            <span style={{ fontSize: 11.5, opacity: f.active ? 0.6 : 0.55, fontWeight: 500 }}>{f.count}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px', overflow: 'hidden', position: 'relative' }}>
        {groups.map(g => (
          <div key={g.day} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
              <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>{g.day}</div>
              <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 500 }}>{g.count} tâches</div>
            </div>

            {g.items.map((it, idx) => {
              const colored = !!it.bg && !it.done;
              return colored ? (
                <FES key={idx} bg={it.bg} padding="11px 14px" radius={14} style={{ marginBottom: 6 }}>
                  <Row item={it} />
                </FES>
              ) : (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '10px 14px', marginBottom: 6, opacity: it.done ? 0.5 : 1 }}>
                  <Row item={it} />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* FAB */}
      <div style={{ position: 'absolute', bottom: 96, right: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 300, color: '#1A1A1F', boxShadow: '0 2px 8px rgba(26,26,31,0.10)' }}>+</div>
      </div>

      <TB active="todo" />
    </ShellAF>
  );
}

function Row({ item: it }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: `2px solid ${it.done ? '#9FC9A8' : 'rgba(26,26,31,0.28)'}`,
        background: it.done ? '#9FC9A8' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {it.done && <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </div>
      <span style={{ fontSize: 19 }}>{it.c}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#8A857C' : '#1A1A1F' }}>{it.l}</div>
        <div style={{ fontSize: 13, color: it.urgent ? '#1A1A1F' : '#8A857C', fontWeight: it.urgent ? 600 : 400, marginTop: 3 }}>{it.t}</div>
      </div>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: it.whoColor, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.who}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 2 · SETUP TÂCHE — créer / éditer
// ════════════════════════════════════════════════════════════════
function AFSetup({ variant = 'saturated' }) {
  const isCream = variant === 'cream';
  return (
    <ShellAF intensity="soft">
      <div style={{ padding: '14px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>×</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>NOUVELLE TÂCHE</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#8A857C' }}>Créer</div>
      </div>

      <div style={{ padding: '8px 23px 0', position: 'relative' }}>
        {/* HERO sage — nom de la tâche (commun aux deux variants) */}
        <FES bg="#C9E0C5" padding="22px 23px" radius={22} style={{ marginBottom: isCream ? 18 : 12 }}>
          <div style={{ marginBottom: 10 }}><PE>NOUVELLE TÂCHE</PE></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>🍽</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.05 }}>Vaisselle du soir</div>
              <div style={{ fontSize: 13, color: 'rgba(26,26,31,0.65)', fontWeight: 400, marginTop: 4 }}>Domestique{isCream ? ' · toucher pour modifier' : ''}</div>
            </div>
          </div>
        </FES>

        {isCream ? (
          <>
            {/* SECTION — Quand (cream) */}
            <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Quand</div>
            <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '14px 16px', marginBottom: 16, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>Tous les jours</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>20h00</div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8, background: '#1A1A1F', color: '#FFFCF5', fontSize: 13, fontWeight: 600 }}>{d}</div>
                ))}
              </div>
            </div>

            {/* SECTION — Détails (cream) */}
            <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Détails</div>
            <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '14px 10px', marginBottom: 16, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex' }}>
              {[
                { k: 'Durée', v: '15ʼ', accent: '#E97A6A' },
                { k: 'Pénibilité', v: '4 ★', accent: '#B8A5D9' },
                { k: 'Importance', v: '3/5', accent: '#7DB3D5' },
              ].map((s, i, arr) => (
                <div key={s.k} style={{ flex: 1, padding: '0 4px', borderRight: i < arr.length - 1 ? '1px solid rgba(26,26,31,0.06)' : 'none', textAlign: 'center' }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#8A857C', fontWeight: 500, marginBottom: 6 }}>{s.k.toUpperCase()}</div>
                  <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.4, color: s.accent }}>{s.v}</div>
                </div>
              ))}
            </div>

            {/* SECTION — Qui (cream) */}
            <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Qui ?</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { l: '✨ Mochi décide', active: true },
                { l: 'Toi', active: false },
                { l: 'Jeanne', active: false },
                { l: 'À tour de rôle', active: false },
              ].map(o => (
                <div key={o.l} style={{
                  padding: '8px 13px', borderRadius: 999,
                  background: o.active ? '#1A1A1F' : '#FFFCF5',
                  color: o.active ? '#FFFCF5' : '#1A1A1F',
                  fontSize: 14, fontWeight: 500,
                  boxShadow: o.active ? '0 4px 12px rgba(26,26,31,0.25)' : '0 0 0 1px rgba(26,26,31,0.05)',
                }}>{o.l}</div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* QUAND — card butter saturée */}
            <FES bg="#FBE49A" padding="14px 16px" radius={16} style={{ marginBottom: 9 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10.5, letterSpacing: 1.4, color: 'rgba(26,26,31,0.65)', fontWeight: 600, marginBottom: 6 }}>QUAND</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Tous les jours · 20h00</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', padding: '7px 0', borderRadius: 8, background: '#1A1A1F', color: '#FFFCF5', fontSize: 13, fontWeight: 600 }}>{d}</div>
                ))}
              </div>
            </FES>

            {/* DÉTAILS — 3 cards saturées */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 9 }}>
              {[
                { k: 'DURÉE', v: '15ʼ', bg: '#F5A89A' },
                { k: 'PÉNIB.', v: '4 ★', bg: '#E2D6F0' },
                { k: 'IMPORT.', v: '3/5', bg: '#C9DFEA' },
              ].map(s => (
                <FES key={s.k} bg={s.bg} padding="11px 13px" radius={14}>
                  <div style={{ fontSize: 9.5, letterSpacing: 1.2, color: 'rgba(26,26,31,0.65)', fontWeight: 600, marginBottom: 6 }}>{s.k}</div>
                  <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.5 }}>{s.v}</div>
                </FES>
              ))}
            </div>

            {/* QUI — card lavender saturée */}
            <FES bg="#E2D6F0" padding="13px 14px" radius={14}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.4, color: 'rgba(26,26,31,0.65)', fontWeight: 600, marginBottom: 9 }}>QUI ?</div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {[
                  { l: '✨ Mochi décide', active: true },
                  { l: 'Toi', active: false },
                  { l: 'Jeanne', active: false },
                  { l: 'À tour', active: false },
                ].map(o => (
                  <div key={o.l} style={{
                    padding: '8px 11px', borderRadius: 999,
                    background: o.active ? '#1A1A1F' : 'rgba(255,255,255,0.55)',
                    color: o.active ? '#FFFCF5' : '#1A1A1F',
                    fontSize: 13, fontWeight: 500,
                    boxShadow: o.active ? '0 2px 6px rgba(26,26,31,0.25)' : undefined,
                  }}>{o.l}</div>
                ))}
              </div>
            </FES>
          </>
        )}
      </div>

      {/* CTA bas */}
      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 6px 24px rgba(245,168,154,0.55)' }}>
          Créer la tâche
        </div>
      </div>
    </ShellAF>
  );
}

// ════════════════════════════════════════════════════════════════
// 3 · TÂCHE EN RETARD — malus & switch
// ════════════════════════════════════════════════════════════════
function AFOverdue() {
  return (
    <ShellAF intensity="soft">
      <div style={{ padding: '14px 18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>EN RETARD</div>
        <div style={{ width: 38 }} />
      </div>

      {/* HERO — un seul bloc saturé qui domine + Mochi inline + alerte intégrée */}
      <div style={{ padding: '0 22px', marginBottom: 21, position: 'relative' }}>
        <FES bg="#F5A89A" padding="18px 20px 18px" radius={22}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <MI size={64} mood="sad" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 600, color: 'rgba(26,26,31,0.65)', marginBottom: 6, textTransform: 'uppercase' }}>3H DE RETARD</div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.05 }}>Courses Monoprix</div>
              <div style={{ fontSize: 13, color: 'rgba(26,26,31,0.7)', fontWeight: 400, marginTop: 3 }}>Prévue 12h30 · maintenant 15h30</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', background: 'rgba(26,26,31,0.10)', borderRadius: 12 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>Si tu ne fais rien : <strong>+1 malus ce mois (3/5)</strong></div>
          </div>
        </FES>
      </div>

      {/* RECO — UNE option mise en avant, blanc + bordure sage + ombre */}
      <div style={{ padding: '0 22px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>RECOMMANDÉ</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,26,31,0.08)' }} />
      </div>
      <div style={{ padding: '0 22px', marginBottom: 19, position: 'relative' }}>
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '17px 18px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', gap: 14, border: '1.5px solid #9FC9A8' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#C9E0C5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Je le fais maintenant</div>
            <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>Aucun malus · ≈45 min</div>
          </div>
          <div style={{ fontSize: 19 }}>›</div>
        </div>
      </div>

      {/* ALTERNATIVES — secondaires, glass discret */}
      <div style={{ padding: '0 22px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>OU SINON</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,26,31,0.08)' }} />
      </div>
      <div style={{ padding: '0 22px', position: 'relative' }}>
        {[
          { ic: '⇄', t: 'Repasser à Jeanne', s: 'Elle décide · +1 dette pour toi' },
          { ic: '⏰', t: 'Décaler à demain', s: '+1 malus mais ça passe' },
        ].map((o, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '11px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19, opacity: 0.7 }}>{o.ic}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{o.t}</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{o.s}</div>
            </div>
            <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
          </div>
        ))}
      </div>

      <TB active="todo" />
    </ShellAF>
  );
}

// ════════════════════════════════════════════════════════════════
// 4 · FILTRES — modal de filtres avancés
// ════════════════════════════════════════════════════════════════
function AFFilters() {
  return (
    <ShellAF intensity="strong">
      {/* Liste en arrière-plan, opacité réduite */}
      <div style={{ position: 'absolute', top: 90, left: 18, right: 18, opacity: 0.30, pointerEvents: 'none' }}>
        <div style={{ height: 50, background: 'rgba(255,255,255,0.5)', borderRadius: 14, marginBottom: 6 }} />
        <div style={{ height: 50, background: 'rgba(255,255,255,0.5)', borderRadius: 14, marginBottom: 6 }} />
        <div style={{ height: 50, background: 'rgba(255,255,255,0.5)', borderRadius: 14, marginBottom: 6 }} />
      </div>

      {/* Modal sheet */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FAFAF7', borderRadius: '24px 24px 0 0', boxShadow: '0 -1px 0 rgba(26,26,31,0.08)', padding: '14px 18px 28px', maxHeight: '78%' }}>
        <div style={{ width: 44, height: 5, background: 'rgba(26,26,31,0.18)', borderRadius: 3, margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8 }}>Filtrer</div>
          <div style={{ fontSize: 14, color: '#C75744', fontWeight: 600 }}>Tout réinitialiser</div>
        </div>

        {/* Période */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9 }}>PÉRIODE</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { l: "Aujourd'hui", active: true },
              { l: 'Cette semaine', active: false },
              { l: 'Ce mois', active: false },
              { l: 'Tout', active: false },
            ].map(p => (
              <div key={p.l} style={{
                padding: '8px 14px', borderRadius: 999,
                background: p.active ? '#1A1A1F' : 'rgba(255,255,255,0.6)',
                color: p.active ? '#FFFCF5' : '#1A1A1F',
                fontSize: 14, fontWeight: 500,
                boxShadow: p.active ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
              }}>{p.l}</div>
            ))}
          </div>
        </div>

        {/* Catégories */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9 }}>CATÉGORIES</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {[
              { l: '★ Domestique', bg: '#F5A89A', active: true },
              { l: '🧠 Mental', bg: '#E2D6F0', active: true },
              { l: '👶 Enfants', bg: '#C9E0C5', active: false },
              { l: '🛠 Maintenance', bg: '#FBE49A', active: false },
              { l: '🎉 Social', bg: '#C9DFEA', active: false },
            ].map(c => (
              <div key={c.l} style={{
                padding: '8px 13px', borderRadius: 999,
                background: c.active ? c.bg : 'rgba(255,255,255,0.6)',
                color: '#1A1A1F',
                fontSize: 14, fontWeight: 500,
                opacity: c.active ? 1 : 0.5,
                boxShadow: c.active ? '0 0 0 1px rgba(26,26,31,0.05)' : undefined,
              }}>{c.l}</div>
            ))}
          </div>
        </div>

        {/* État */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9 }}>ÉTAT</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { l: 'À faire', active: true },
              { l: 'Faites', active: false },
              { l: 'En retard', active: true },
            ].map(s => (
              <div key={s.l} style={{
                flex: 1,
                padding: '10px 13px', borderRadius: 12,
                background: s.active ? '#1A1A1F' : 'rgba(255,255,255,0.6)',
                color: s.active ? '#FFFCF5' : '#1A1A1F',
                fontSize: 14, fontWeight: 500, textAlign: 'center',
              }}>{s.l}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '15px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 4px 16px rgba(245,168,154,0.28)', marginTop: 9 }}>
          Voir 4 tâches
        </div>
      </div>
    </ShellAF>
  );
}

Object.assign(window, { AFList, AFSetup, AFOverdue, AFFilters });
