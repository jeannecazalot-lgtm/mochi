// V3 · Core — TabBarV3 (4 onglets + FAB Mochi), Home 4 blocs, Planning, Budget (brief §3, §4)
// DNA Crème : réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent

const { FrameEmbossed: C3Fe, PillLabel: C3Pill, MochiIridescent: C3Mochi, IridShell: C3Shell } = window;

function C3Icon({ d, size = 21, color = 'currentColor', sw = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={d}></path>
    </svg>
  );
}

// ═══════════ TAB BAR V3 — 4 onglets + FAB central ═══════════
function TabBarV3({ active = 'home' }) {
  const tabs = [
    { k: 'home', l: 'Accueil', d: 'M4 11.5L12 4l8 7.5V20a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1v-8.5z' },
    { k: 'planning', l: 'Planning', d: 'M8 3v4M16 3v4M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z' },
    { k: 'fab' },
    { k: 'balance', l: 'Balance', d: 'M12 4v16M5 7h14M5 7l-2.5 6a3.5 3.5 0 007 0L7 7M19 7l-2.5 6a3.5 3.5 0 007 0L21 7' },
    { k: 'budget', l: 'Budget', d: 'M3 8a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM3 10h18M16 15h2' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#FFFFFF', borderTop: '1px solid #EBEBEB', padding: '8px 10px 24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 40 }}>
      {tabs.map(t => {
        if (t.k === 'fab') {
          return (
            <div key="fab" style={{ width: 54, height: 54, borderRadius: '50%', marginTop: -34, background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', boxShadow: '0 2px 8px rgba(26,26,31,0.10), 0 0 0 4px #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1F" strokeWidth="2.4" strokeLinecap="round"></path></svg>
            </div>
          );
        }
        const on = t.k === active;
        return (
          <div key={t.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: on ? '#E97A6A' : '#717171', minWidth: 52 }}>
            <C3Icon d={t.d} size={22} sw={on ? 2 : 1.7}></C3Icon>
            <span style={{ fontSize: 11, fontWeight: on ? 600 : 400 }}>{t.l}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════ HOME V3 — 4 blocs, lisible en 10 s ═══════════
function HomeV3() {
  const missions = [
    { c: '🍽', l: 'Vaisselle du soir', badge: null, done: true },
    { c: '🗑', l: 'Sortir les poubelles', badge: 'avant 20h', urgent: true },
    { c: '📅', l: 'Penser au RDV pédiatre', badge: 'mental', mental: true },
  ];
  return (
    <C3Shell intensity="soft">
      {/* Header : date + bulle activité + avatar */}
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500, textTransform: 'uppercase' }}>MAR 7 JUIL</div>
        </div>
        <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <C3Icon d="M4 5h16v11H8l-4 4V5z" size={17}></C3Icon>
          <div style={{ position: 'absolute', top: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#E97A6A', border: '2px solid #FAFAF7' }}></div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 600, color: '#fff' }}>V</div>
      </div>

      {/* Bloc 1 · Mochi qui penche + phrase interprétable */}
      <div style={{ padding: '10px 23px 0', display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        <div style={{ transform: 'rotate(-7deg)' }}><C3Mochi size={104} mood="neutral"></C3Mochi></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.15 }}>Jeanne est un peu plus chargée cette semaine.</div>
          <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>Rien de grave — Mochi rééquilibre demain.</div>
        </div>
      </div>

      {/* Bloc 2 · Mes missions du jour */}
      <div style={{ padding: '18px 23px 6px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', position: 'relative' }}>
        <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Aujourd'hui pour toi</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#8A857C' }}>3 missions · ≈ 55 min</span>
      </div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        <C3Fe padding="11px 14px" radius={16}>
          {missions.map((m, i) => (
            <div key={m.l} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 0', borderTop: i > 0 ? '1px solid rgba(26,26,31,0.06)' : 'none', opacity: m.done ? 0.45 : 1 }}>
              <span style={{ fontSize: 19 }}>{m.c}</span>
              <span style={{ flex: 1, fontSize: 16, fontWeight: 500, textDecoration: m.done ? 'line-through' : 'none' }}>{m.l}</span>
              {m.badge ? (
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', padding: '8px 10px', borderRadius: 999, background: m.urgent ? 'rgba(233,122,106,0.14)' : 'rgba(184,165,217,0.18)', color: m.urgent ? '#C75744' : '#9A7BC8' }}>{m.badge}</span>
              ) : null}
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: m.done ? 'none' : '2px solid rgba(26,26,31,0.22)', background: m.done ? '#9FC9A8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.done ? <svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg> : null}
              </div>
            </div>
          ))}
        </C3Fe>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8A857C', fontWeight: 400, marginTop: 6 }}>Glisser une mission pour la repasser ou la reporter</div>
      </div>

      {/* Bloc 3 · Côté Jeanne — lecture seule */}
      <div style={{ padding: '14px 18px 0', position: 'relative' }}>
        <div style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
          <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>Côté Jeanne <span style={{ color: '#8A857C', fontWeight: 400 }}>· 2 missions · 40 min</span></div>
          <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
        </div>
      </div>

      {/* Bloc 4 · Streak discret */}
      <div style={{ position: 'absolute', bottom: 100, left: 0, right: 0, textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#8A857C' }}>
        🔥 Streak : 6 jours · encore 1 jour pour « Première semaine fluide »
      </div>

      <TabBarV3 active="home"></TabBarV3>
    </C3Shell>
  );
}

// ═══════════ PLANNING ═══════════
function PlanningV3() {
  const days = [
    { d: 'MAR 7 · AUJOURD\'HUI', items: [
      { c: '🗑', l: 'Poubelles', t: 'avant 20h', who: 'V', wc: '#7DB3D5' },
      { c: '📅', l: 'Penser au RDV pédiatre', t: 'mental ×1,5', who: 'V', wc: '#7DB3D5' },
    ] },
    { d: 'MER 8', items: [
      { c: '🧺', l: 'Lessive blanc', t: '18h · 30 min', who: 'J', wc: '#B8A5D9' },
      { c: '🍽', l: 'Vaisselle du soir', t: '20h · 15 min', who: 'J', wc: '#B8A5D9' },
    ] },
    { d: 'JEU 9', items: [
      { c: '🛒', l: 'Courses de la semaine', t: '45 min · divisible', who: 'VJ', wc: null },
    ] },
  ];
  return (
    <C3Shell intensity="soft">
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, position: 'relative' }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1 }}>Planning</div>
        <div style={{ display: 'flex', background: '#FFFCF5', borderRadius: 999, padding: 11, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          <span style={{ padding: '8px 13px', borderRadius: 999, background: '#1A1A1F', color: '#FFFCF5', fontSize: 13, fontWeight: 600 }}>Semaine</span>
          <span style={{ padding: '8px 13px', fontSize: 13, fontWeight: 500, color: '#8A857C' }}>Mois</span>
        </div>
      </div>

      {/* Semainier compact */}
      <div style={{ padding: '0 18px 12px', display: 'flex', gap: 5, position: 'relative' }}>
        {['L 6', 'M 7', 'M 8', 'J 9', 'V 10', 'S 11', 'D 12'].map((d, i) => (
          <div key={d} style={{ flex: 1, textAlign: 'center', padding: '8px 0', borderRadius: 12, background: i === 1 ? '#1A1A1F' : '#FFFCF5', color: i === 1 ? '#FFFCF5' : '#1A1A1F', boxShadow: i === 1 ? '0 4px 12px rgba(26,26,31,0.25)' : '0 0 0 1px rgba(26,26,31,0.05)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.6 }}>{d.split(' ')[0]}</div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{d.split(' ')[1]}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 3 }}>
              {(i % 3 === 0 ? ['#7DB3D5'] : i % 3 === 1 ? ['#7DB3D5', '#B8A5D9'] : ['#B8A5D9']).map((c, j) => (
                <span key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: i === 1 ? '#FBE49A' : c }}></span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 18px', position: 'relative', overflow: 'hidden', maxHeight: 470 }}>
        {days.map(g => (
          <div key={g.d} style={{ marginBottom: 11 }}>
            <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, padding: '0 4px 7px' }}>{g.d}</div>
            {g.items.map(it => (
              <div key={it.l} style={{ background: '#FFFCF5', borderRadius: 14, padding: '10px 13px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(26,26,31,0.25)" strokeWidth="2.4" strokeLinecap="round"><path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01"></path></svg>
                <span style={{ fontSize: 18 }}>{it.c}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 500 }}>{it.l}</div>
                  <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{it.t}</div>
                </div>
                {it.who === 'VJ' ? (
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#7DB3D5', color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFCF5' }}>V</div>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFCF5', marginLeft: -7 }}>J</div>
                  </div>
                ) : (
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: it.wc, color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.who}</div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8A857C', fontWeight: 400 }}>Glisse une tâche sur l'avatar de l'autre pour la réattribuer</div>
      </div>

      <TabBarV3 active="planning"></TabBarV3>
    </C3Shell>
  );
}

// ═══════════ BUDGET (Tricount) ═══════════
function BudgetV3() {
  return (
    <C3Shell intensity="soft">
      <div style={{ padding: '14px 23px 0', marginBottom: 11, position: 'relative' }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1 }}>Budget</div>
        <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>Dépenses partagées · Juillet</div>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 11, position: 'relative' }}>
        <C3Fe padding="18px 20px" radius={20}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 9 }}><C3Pill color="#B8A5D9">SOLDE</C3Pill></div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -1.2, lineHeight: 1 }}>Jeanne te doit 23,50 €</div>
            <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 6 }}>142,80 € dépensés à deux ce mois</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <div style={{ flex: 1, background: '#1A1A1F', color: '#FFFCF5', borderRadius: 999, padding: '11px 14px', textAlign: 'center', fontSize: 14.5, fontWeight: 600 }}>On est à zéro</div>
            <div style={{ flex: 1, background: 'rgba(26,26,31,0.05)', borderRadius: 999, padding: '11px 14px', textAlign: 'center', fontSize: 14.5, fontWeight: 500 }}>Rappeler</div>
          </div>
        </C3Fe>
      </div>

      <div style={{ padding: '0 22px 8px', fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', position: 'relative' }}>Dernières dépenses</div>
      <div style={{ padding: '0 18px', position: 'relative' }}>
        {[
          { c: '🛒', l: 'Monoprix', d: 'hier · en cochant « Courses » · toi', v: '64,20 €', wc: '#7DB3D5', w: 'V', auto: true },
          { c: '🍕', l: 'Pizzas vendredi', d: 'ven 4 · payé par Jeanne', v: '31,00 €', wc: '#B8A5D9', w: 'J' },
          { c: '🐕', l: 'Véto Marcel', d: 'jeu 3 · en cochant « Véto » · toi', v: '47,60 €', wc: '#7DB3D5', w: 'V', auto: true },
        ].map(e => (
          <div key={e.l} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '11px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>{e.c}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15.5, fontWeight: 500 }}>{e.l}</span>
                {e.auto ? <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', padding: '8px 10px', borderRadius: 999, background: 'rgba(159,201,168,0.25)', color: '#4F7A57' }}>via tâche</span> : null}
              </div>
              <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{e.d}</div>
            </div>
            <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 15, fontWeight: 600 }}>{e.v}</div>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: e.wc, color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e.w}</div>
          </div>
        ))}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>Les tâches avec dépense arrivent ici toutes seules · le reste via le ➕</div>
      </div>

      <TabBarV3 active="budget"></TabBarV3>
    </C3Shell>
  );
}

Object.assign(window, { TabBarV3, HomeV3, PlanningV3, BudgetV3 });
