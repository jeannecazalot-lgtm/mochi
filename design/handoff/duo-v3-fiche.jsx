// V3 · Fiche tâche (brief §2) + Détail avec mini-historique
// DNA Crème : réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent

const { FrameEmbossed: T3Fe, PillLabel: T3Pill, MochiIridescent: T3Mochi, IridShell: T3Shell } = window;

function T3Section({ label, children }) {
  return (
    <React.Fragment>
      <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, margin: '0 0 7px', textTransform: 'uppercase' }}>{label}</div>
      {children}
    </React.Fragment>
  );
}

function T3Toggle({ on }) {
  return (
    <div style={{ width: 40, height: 24, borderRadius: 999, background: on ? '#9FC9A8' : 'rgba(26,26,31,0.12)', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
    </div>
  );
}

// ═══════════ FICHE TÂCHE V3 — création / édition ═══════════
function FicheTacheV3() {
  return (
    <T3Shell intensity="soft">
      <div style={{ padding: '10px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>FICHE TÂCHE</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative', overflow: 'hidden', maxHeight: 560, boxSizing: 'border-box' }}>
        {/* Hero */}
        <T3Fe padding="10px 12px" radius={18} style={{ marginBottom: 6, border: '1.5px solid #9FC9A8' }}>
          <div style={{ marginBottom: 6 }}><T3Pill color="#4F7A57">DOMESTIQUE</T3Pill></div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.05 }}>Sortir les poubelles</div>
        </T3Fe>

        {/* Quand + fenêtre d'exécution */}
        <T3Section label="Quand">
          <T3Fe padding="9px 11px" radius={14} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 0 6px', borderBottom: '1px solid rgba(26,26,31,0.06)' }}>
              <span style={{ fontSize: 15, fontWeight: 500 }}>Fréquence</span>
              <span style={{ fontSize: 14.5, fontWeight: 600, background: 'rgba(26,26,31,0.05)', padding: '6px 9px', borderRadius: 999 }}>2× / semaine</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Fenêtre d'exécution</div>
                <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>Rappels et malus s'alignent dessus</div>
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 600, background: 'rgba(233,122,106,0.12)', color: '#C75744', padding: '6px 9px', borderRadius: 999 }}>mar + ven · avant 20h</span>
            </div>
          </T3Fe>
        </T3Section>

        {/* Détails */}
        <T3Section label="Détails">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 8 }}>
            {[
              { k: 'DURÉE', v: '5ʼ' },
              { k: 'TA PÉNIB.', v: '2 ★', hint: 'Jeanne : 4 ★' },
              { k: 'IMPORT.', v: '4/5' },
            ].map(s => (
              <T3Fe key={s.k} padding="6px 10px" radius={13}>
                <div style={{ fontSize: 9.5, letterSpacing: 1, color: '#8A857C', fontWeight: 600, marginBottom: 4 }}>{s.k}</div>
                <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>{s.v}</div>
                {s.hint ? <div style={{ fontSize: 9.5, color: '#9A7BC8', fontWeight: 500, marginTop: 2 }}>{s.hint}</div> : null}
              </T3Fe>
            ))}
          </div>
        </T3Section>

        {/* Assignation */}
        <T3Section label="Assignation">
          <T3Fe padding="8px 10px" radius={14} style={{ marginBottom: 8 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {[
                { l: 'Auto', s: 'Mochi décide', on: true },
                { l: 'Fixe', s: 'toujours pareil' },
                { l: 'Alternance', s: 'stricte' },
              ].map(o => (
                <div key={o.l} style={{ borderRadius: 10, padding: '6px 8px', textAlign: 'center', background: o.on ? '#1A1A1F' : 'transparent', color: o.on ? '#FFFCF5' : '#1A1A1F' }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{o.l}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 400, opacity: 0.6, marginTop: 2 }}>{o.s}</div>
                </div>
              ))}
            </div>
          </T3Fe>
        </T3Section>

        {/* Options */}
        <T3Section label="Options">
          <T3Fe padding="8px 11px" radius={14} style={{ marginBottom: 10 }}>
            {[
              { l: 'Divisible', s: 'Peut se partager à deux', on: false },
              { l: 'Charge mentale', s: 'Compte ×1,5 dans la balance', on: false },
              { l: 'Dépense associée', s: 'Au moment de cocher, indique le prix payé → Budget', on: true },
              { l: 'Note / checklist', s: '« Sortir aussi le verre » · modifier', on: true, link: true },
            ].map((o, i) => (
              <div key={o.l} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', borderTop: i > 0 ? '1px solid rgba(26,26,31,0.06)' : 'none' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{o.l}</div>
                  <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>{o.s}</div>
                </div>
                {o.link ? <div style={{ fontSize: 16, color: '#8A857C' }}>›</div> : <T3Toggle on={o.on}></T3Toggle>}
              </div>
            ))}
          </T3Fe>
        </T3Section>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #EBEBEB', padding: '9px 14px 19px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '11px 16px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>Enregistrer</div>
      </div>
    </T3Shell>
  );
}

// ═══════════ FICHE TÂCHE MENTALE — planifier ≠ exécuter ═══════════
function FicheMentaleV3() {
  return (
    <T3Shell intensity="soft">
      <div style={{ padding: '10px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>TÂCHE MENTALE</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <T3Fe padding="12px 14px" radius={18} style={{ marginBottom: 10, border: '1.5px solid #B8A5D9' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            <T3Pill color="#9A7BC8">MENTAL · ×1,5</T3Pill>
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.8, lineHeight: 1.05 }}>RDV pédiatre</div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>Mochi la coupe en deux — penser et faire, ce sont deux charges.</div>
        </T3Fe>

        {/* Les deux moitiés */}
        {[
          { n: '1', l: 'Planifier', d: 'Y penser, appeler, choisir le créneau', who: 'J', wc: '#B8A5D9', tag: 'mental ×1,5', win: 'avant ven 11' },
          { n: '2', l: 'Exécuter', d: 'Emmener Zoé au rendez-vous', who: 'V', wc: '#7DB3D5', tag: '45 min', win: 'le jour J' },
        ].map((p, i) => (
          <div key={p.n} style={{ position: 'relative' }}>
            <T3Fe padding="9px 11px" radius={15} style={{ marginBottom: i === 0 ? 6 : 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(26,26,31,0.06)', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.n}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16.5, fontWeight: 600 }}>{p.l}</div>
                  <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>{p.d}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '6px 8px', borderRadius: 999, background: 'rgba(26,26,31,0.05)', color: '#8A857C' }}>{p.tag}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '6px 8px', borderRadius: 999, background: 'rgba(233,122,106,0.10)', color: '#C75744' }}>{p.win}</span>
                  </div>
                </div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: p.wc, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{p.who}</div>
              </div>
            </T3Fe>
            {i === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                <div style={{ width: 1.5, height: 10, background: 'rgba(26,26,31,0.15)' }}></div>
              </div>
            ) : null}
          </div>
        ))}

        <div style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📝</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>Note attachée</div>
            <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>« Dr Lemoine · carnet de santé dans le tiroir »</div>
          </div>
          <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #EBEBEB', padding: '9px 14px 19px' }}>
        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '11px 16px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>Enregistrer les deux</div>
      </div>
    </T3Shell>
  );
}

// ═══════════ DÉTAIL TÂCHE V3 — avec mini-historique ═══════════
function TaskDetailV3() {
  return (
    <T3Shell intensity="soft">
      <div style={{ padding: '10px 16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>TÂCHE</div>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>···</div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <T3Fe padding="12px 14px" radius={18} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <T3Mochi size={56} mood="happy"></T3Mochi>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 4 }}><T3Pill color="#4F7A57">DOMESTIQUE</T3Pill></div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.7, lineHeight: 1.05 }}>Courses de la semaine</div>
              <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 2 }}>Toi cette semaine · jeudi · ≈ 45 min · divisible</div>
            </div>
          </div>
        </T3Fe>

        {/* Checklist attachée */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase' }}>Checklist · par Jeanne</div>
        <T3Fe padding="8px 11px" radius={14} style={{ marginBottom: 8 }}>
          {[
            { l: 'Lessive (la verte, pas la bleue)', done: true },
            { l: 'Croquettes Marcel · réf. senior', done: false },
            { l: 'Cadeau anniv Zoé — voir note', done: false },
          ].map((c, i) => (
            <div key={c.l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderTop: i > 0 ? '1px solid rgba(26,26,31,0.06)' : 'none' }}>
              <div style={{ width: 18, height: 18, borderRadius: 6, border: c.done ? 'none' : '1.5px solid rgba(26,26,31,0.22)', background: c.done ? '#9FC9A8' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {c.done ? <svg width="9" height="9" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg> : null}
              </div>
              <span style={{ fontSize: 14.5, fontWeight: 400, textDecoration: c.done ? 'line-through' : 'none', opacity: c.done ? 0.5 : 1 }}>{c.l}</span>
            </div>
          ))}
        </T3Fe>

        {/* Mini-historique : 5 dernières fois */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase' }}>Les 5 dernières fois</div>
        <T3Fe padding="9px 13px" radius={14} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {[
              { w: 'J', c: '#B8A5D9', d: '12 juin' }, { w: 'V', c: '#7DB3D5', d: '19 juin' }, { w: 'J', c: '#B8A5D9', d: '26 juin' }, { w: 'V', c: '#7DB3D5', d: '30 juin' }, { w: 'J', c: '#B8A5D9', d: '3 juil' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: h.c, color: '#fff', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{h.w}</div>
                <span style={{ fontSize: 9.5, color: '#8A857C', fontWeight: 500 }}>{h.d}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 7, textAlign: 'center' }}>Plutôt équilibré — 3 Jeanne · 2 toi</div>
        </T3Fe>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FFFFFF', borderTop: '1px solid #EBEBEB', padding: '9px 14px 16px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        <div style={{ alignSelf: 'stretch', background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '11px 16px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>Marquer fait</div>
        <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400 }}>Repasser ou reporter : glisse la tâche depuis la liste</div>
      </div>
    </T3Shell>
  );
}

Object.assign(window, { FicheTacheV3, FicheMentaleV3, TaskDetailV3 });
