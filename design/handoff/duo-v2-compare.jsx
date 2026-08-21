// Comparaison DNA — mêmes écrans en 2 variantes :
// « sat »  = Embossed Saturé (cards à fond couleur plein)
// « cream » = Iter B Embossed (cards crème #FFFCF5 + ombres profondes + pill labels)
// Réutilise : IridShell, FrameES, PillES, PillLabel, MochiIridescent, IridTabBarV2, DayStrip, AFSetup

const { FrameES: CFes, PillES: CPes, PillLabel: CPill, MochiIridescent: CMochi, IridTabBarV2: CTb, DayStrip: CDayStrip, IridShell: CShell } = window;

// ─── rangée de tâche commune
function CmpRow({ item: it }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${it.done ? '#9FC9A8' : 'rgba(26,26,31,0.28)'}`, background: it.done ? '#9FC9A8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {it.done ? <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg> : null}
      </div>
      <span style={{ fontSize: 19 }}>{it.c}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 500, textDecoration: it.done ? 'line-through' : 'none', color: it.done ? '#8A857C' : '#1A1A1F' }}>{it.l}</div>
        <div style={{ fontSize: 13, color: it.urgent ? '#C75744' : '#8A857C', fontWeight: it.urgent ? 600 : 400, marginTop: 2 }}>{it.t}</div>
      </div>
      <div style={{ width: 26, height: 26, borderRadius: '50%', background: it.whoColor, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{it.who}</div>
    </div>
  );
}

// ═══════════ HOME ═══════════
function CmpHome({ variant = 'sat' }) {
  const cream = variant === 'cream';
  return (
    <CShell>
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase' }}>DIM 28 AVR</div>
          <div style={{ fontSize: 17, fontWeight: 500 }}>Hello Valentin</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🔔</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, position: 'relative' }}>
        <CMochi size={124} mood="wink"></CMochi>
      </div>

      {/* Hero balance */}
      <div style={{ padding: '0 22px', marginBottom: 8, position: 'relative' }}>
        <CFes bg={cream ? '#FFFCF5' : '#F5A89A'} padding="12px 16px" radius={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 6 }}>
              {cream ? <CPill color="#E97A6A">CETTE SEMAINE</CPill> : <CPes>CETTE SEMAINE</CPes>}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.02 }}>Légèrement chez toi.</div>
            <div style={{ fontSize: 14, color: cream ? '#3A3A42' : 'rgba(26,26,31,0.7)', marginTop: 4, fontWeight: 400 }}>18 min d'écart</div>
          </div>
        </CFes>
      </div>

      <div style={{ padding: '0 18px', marginBottom: 6, position: 'relative' }}>
        <CDayStrip></CDayStrip>
      </div>

      <div style={{ padding: '6px 18px 4px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase', position: 'relative' }}>AUJOURD'HUI · 3 TÂCHES</div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        <CFes bg={cream ? '#FFFCF5' : '#C9E0C5'} padding="8px 11px" radius={14} style={{ marginBottom: 4 }}>
          <CmpRow item={{ c: '🍽', l: 'Vaisselle du soir', t: '20h00 · 15 min', who: 'V', whoColor: '#7DB3D5' }}></CmpRow>
        </CFes>
        {[
          { c: '🐕', l: 'Sortir le chien', t: '21h30 · 20 min', who: 'V', whoColor: '#7DB3D5' },
          { c: '🛒', l: 'Courses', t: 'demain · 45 min', who: 'J', whoColor: '#B8A5D9' },
        ].map(it => (
          <div key={it.l} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '7px 11px', marginBottom: 4 }}>
            <CmpRow item={it}></CmpRow>
          </div>
        ))}
      </div>

      <CTb active="home"></CTb>
    </CShell>
  );
}

// ═══════════ LISTE À FAIRE ═══════════
function CmpList({ variant = 'sat' }) {
  const cream = variant === 'cream';
  const groups = [
    { day: "AUJOURD'HUI · LUN", count: 4, items: [
      { c: '🐕', l: 'Sortie chien matin', t: '8h00 · 15ʼ', who: 'V', whoColor: '#7DB3D5', done: true },
      { c: '🛒', l: 'Courses Monoprix', t: 'en retard depuis 12h30', who: 'V', whoColor: '#7DB3D5', urgent: true, bg: '#F5A89A' },
      { c: '🍽', l: 'Vaisselle midi', t: '13h30 · 10ʼ', who: 'J', whoColor: '#B8A5D9', done: true },
      { c: '🍽', l: 'Vaisselle soir', t: '20h30 · 15ʼ', who: 'V', whoColor: '#7DB3D5', bg: '#C9E0C5' },
    ] },
    { day: 'DEMAIN · MAR', count: 2, items: [
      { c: '🗑', l: 'Sortir poubelles', t: '21h00 · 5ʼ', who: 'V', whoColor: '#7DB3D5' },
      { c: '🧺', l: 'Lessive blanc', t: '18h00 · 30ʼ', who: 'J', whoColor: '#B8A5D9' },
    ] },
  ];
  return (
    <CShell>
      <div style={{ padding: '10px 18px 0', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7, position: 'relative' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.0 }}>À faire</div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>6 tâches · dont 1 en retard</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⌕</div>
      </div>

      <div style={{ padding: '6px 14px 10px', display: 'flex', gap: 5, position: 'relative' }}>
        {[
          { l: 'Tout', active: true, count: 6 },
          { l: 'Moi', active: false, count: 3 },
          { l: 'Jeanne', active: false, count: 3 },
          { l: 'En retard', active: false, count: 1, alert: true },
        ].map(f => (
          <div key={f.l} style={{
            padding: '6px 10px', borderRadius: 999,
            background: f.active ? '#1A1A1F' : (f.alert ? (cream ? '#FFFCF5' : '#F5A89A') : 'rgba(255,255,255,0.55)'),
            backdropFilter: 'blur(10px)',
            color: f.active ? '#FFFCF5' : (f.alert && cream ? '#C75744' : '#1A1A1F'),
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 4,
            boxShadow: f.active ? '0 1px 2px rgba(26,26,31,0.10)' : '0 0 0 1px rgba(26,26,31,0.05)',
          }}>
            {f.l}
            <span style={{ fontSize: 11.5, opacity: 0.6, fontWeight: 500 }}>{f.count}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px', overflow: 'hidden', position: 'relative' }}>
        {groups.map(g => (
          <div key={g.day} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
              <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>{g.day}</div>
              <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 500 }}>{g.count} tâches</div>
            </div>

            {g.items.map((it, idx) => {
              const highlighted = !!it.bg && !it.done;
              if (highlighted) {
                return cream ? (
                  <div key={idx} style={{ position: 'relative', marginBottom: 4 }}>
                    <CFes padding="8px 11px" radius={14} style={{ border: it.urgent ? '1.5px solid #E97A6A' : '1.5px solid #9FC9A8' }}>
                      <CmpRow item={it}></CmpRow>
                    </CFes>
                  </div>
                ) : (
                  <CFes key={idx} bg={it.bg} padding="8px 11px" radius={14} style={{ marginBottom: 4 }}>
                    <CmpRow item={{ ...it, urgent: false, t: it.t }}></CmpRow>
                  </CFes>
                );
              }
              return (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '7px 11px', marginBottom: 4, opacity: it.done ? 0.5 : 1 }}>
                  <CmpRow item={it}></CmpRow>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 96, right: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 300, color: '#1A1A1F', boxShadow: '0 2px 8px rgba(26,26,31,0.10)' }}>+</div>
      </div>

      <CTb active="todo"></CTb>
    </CShell>
  );
}

// ═══════════ EN RETARD ═══════════
function CmpOverdue({ variant = 'sat' }) {
  const cream = variant === 'cream';
  return (
    <CShell intensity="soft">
      <div style={{ padding: '10px 14px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, position: 'relative' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>EN RETARD</div>
        <div style={{ width: 38 }}></div>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 15, position: 'relative' }}>
        <CFes bg={cream ? '#FFFCF5' : '#F5A89A'} padding="13px 16px 13px" radius={22}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
            <CMochi size={64} mood="sad"></CMochi>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 4 }}>
                {cream ? <CPill color="#E97A6A">3H DE RETARD</CPill> : <div style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 600, color: 'rgba(26,26,31,0.65)', textTransform: 'uppercase' }}>3H DE RETARD</div>}
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.05 }}>Courses Monoprix</div>
              <div style={{ fontSize: 13, color: cream ? '#8A857C' : 'rgba(26,26,31,0.7)', fontWeight: 400, marginTop: 2 }}>Prévue 12h30 · maintenant 15h30</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', background: cream ? 'rgba(233,122,106,0.12)' : 'rgba(26,26,31,0.10)', borderRadius: 12 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <div style={{ fontSize: 14, fontWeight: 500, flex: 1, color: cream ? '#C75744' : '#1A1A1F' }}>Si tu ne fais rien : <strong>+1 malus ce mois (3/5)</strong></div>
          </div>
        </CFes>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>RECOMMANDÉ</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,26,31,0.08)' }}></div>
      </div>
      <div style={{ padding: '0 22px', marginBottom: 13, position: 'relative' }}>
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '12px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', gap: 11, border: '1.5px solid #9FC9A8' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: cream ? 'rgba(159,201,168,0.25)' : '#C9E0C5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Je le fais maintenant</div>
            <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>Aucun malus · ≈45 min</div>
          </div>
          <div style={{ fontSize: 19 }}>›</div>
        </div>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600 }}>OU SINON</div>
        <div style={{ flex: 1, height: 1, background: 'rgba(26,26,31,0.08)' }}></div>
      </div>
      <div style={{ padding: '0 22px', position: 'relative' }}>
        {[
          { ic: '⇄', t: 'Repasser à Jeanne', s: 'Elle décide · +1 dette pour toi' },
          { ic: '⏰', t: 'Décaler à demain', s: '+1 malus mais ça passe' },
        ].map((o, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '8px 11px', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 19, opacity: 0.7 }}>{o.ic}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{o.t}</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>{o.s}</div>
            </div>
            <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
          </div>
        ))}
      </div>

      <CTb active="todo"></CTb>
    </CShell>
  );
}

Object.assign(window, { CmpHome, CmpList, CmpOverdue });
