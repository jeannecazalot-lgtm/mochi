// Setup initial flow (8 écrans) — DNA Embossed
// 06 Toi · 07 Dispos · 08 Inviter · 09 Tâches · 10 Setup tâche · 11 Mochi calcule · 12 Proposition · 13 Réattribuer

const { IridShell: SShell, FrameEmbossed: SFE, PillLabel: SPL, MochiIridescent: SMI } = window;

// ─────────── Helpers ───────────
function SetupHeader({ step, total = 4 }) {
  return (
    <div style={{ padding: '14px 23px 0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <SPL color="#E97A6A">ÉTAPE {step}/{total}</SPL>
      <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 500 }}>Passer</div>
    </div>
  );
}

function CtaPrimary({ children, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)',
      borderRadius: 14, padding: '17px 20px',
      textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#1A1A1F',
      boxShadow: '0 1px 2px rgba(26,26,31,0.06)',
      ...style,
    }}>{children}</div>
  );
}

function CtaSecondary({ children, style = {} }) {
  return (
    <div style={{
      background: '#FFFCF5', borderRadius: 14, padding: '17px 20px',
      textAlign: 'center', fontSize: 16, fontWeight: 500,
      boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
      ...style,
    }}>{children}</div>
  );
}

function StepTitle({ children, sub }) {
  return (
    <div style={{ padding: '14px 23px 0', position: 'relative' }}>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1.05 }}>{children}</div>
      {sub && <div style={{ fontSize: 14, color: '#8A857C', marginTop: 6, fontWeight: 400, lineHeight: 1.4 }}>{sub}</div>}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// 06 · Toi — prénom, couleur, statut
// ════════════════════════════════════════════════════════════════
function SetupProfile() {
  const colors = [
    { c: '#7DB3D5', name: 'sky' },
    { c: '#9FC9A8', name: 'sage' },
    { c: '#F5A89A', name: 'coral' },
    { c: '#F5C76E', name: 'butter' },
    { c: '#B8A5D9', name: 'lavender' },
  ];
  return (
    <SShell intensity="soft">
      <SetupHeader step={1} />
      <StepTitle sub="Pour qu'on sache à qui on parle dans Duo.">On commence par toi.</StepTitle>

      <div style={{ padding: '22px 23px 0', position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Ton prénom</div>
        <SFE padding="14px 16px" radius={14} style={{ marginBottom: 19 }}>
          <div style={{ fontSize: 19, fontWeight: 500 }}>Valentin<span style={{ marginLeft: 1, animation: 'blink 1s steps(2) infinite', color: '#E97A6A' }}>|</span></div>
        </SFE>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Ta couleur</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 19 }}>
          {colors.map((col, i) => (
            <div key={col.name} style={{
              width: 44, height: 44, borderRadius: '50%', background: col.c,
              boxShadow: i === 0 ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Tu travailles ?</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Temps plein', 'Temps partiel', 'Indépendant', 'Étudiant', 'Sans'].map((o, i) => (
            <div key={o} style={{
              padding: '10px 14px', borderRadius: 999,
              background: i === 0 ? '#332F2D' : '#FFFCF5',
              color: i === 0 ? '#FFFCF5' : '#1A1A1F',
              fontSize: 15, fontWeight: 500,
              boxShadow: i === 0 ? '0 4px 12px rgba(50,40,30,0.25)' : '0 0 0 1px rgba(26,26,31,0.05)',
            }}>{o}</div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaPrimary>Suivant →</CtaPrimary>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 07 · Tes dispos — semaine × créneaux + charge ressentie
// ════════════════════════════════════════════════════════════════
function SetupAvailability() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const slots = [7, 9, 12, 14, 17, 19, 21];
  return (
    <SShell intensity="soft">
      <SetupHeader step={2} />
      <StepTitle sub="Pour pas qu'on te demande de sortir le chien en pleine réu.">Tes plages de dispo.</StepTitle>

      <div style={{ padding: '19px 23px 0', position: 'relative' }}>
        <SFE padding="14px 13px" radius={18} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: '#8A857C', marginBottom: 6 }}>{d}</div>
                {slots.map(h => {
                  const sleep = h < 8 || h > 22;
                  const busy = (i < 5 && h >= 9 && h <= 17);
                  return (
                    <div key={h} style={{
                      width: '100%', height: 16, borderRadius: 4,
                      background: sleep ? 'rgba(26,26,31,0.08)' : busy ? '#332F2D' : '#C9E0C5',
                      boxShadow: busy ? '0 1px 2px rgba(50,40,30,0.15)' : undefined,
                    }} />
                  );
                })}
              </div>
            ))}
          </div>
        </SFE>

        <div style={{ display: 'flex', gap: 14, marginBottom: 20, fontSize: 13, color: '#8A857C', fontWeight: 400 }}>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#C9E0C5' }} />Dispo</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#332F2D' }} />Indispo</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(26,26,31,0.08)' }} />Sommeil</span>
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Charge mentale ressentie</div>
        <SFE padding="17px 16px" radius={14}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8A857C', marginBottom: 10, fontWeight: 400 }}>
            <span>Tranquille</span><span>Au taquet</span>
          </div>
          <div style={{ height: 8, background: 'rgba(26,26,31,0.08)', borderRadius: 4, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '70%', background: 'linear-gradient(90deg, #9FC9A8, #F5A89A)', borderRadius: 4 }} />
            <div style={{ position: 'absolute', left: 'calc(70% - 10px)', top: -6, width: 20, height: 20, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', border: '2px solid #332F2D' }} />
          </div>
        </SFE>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaPrimary>Suivant →</CtaPrimary>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 08 · Inviter Jeanne
// ════════════════════════════════════════════════════════════════
function SetupInvite() {
  return (
    <SShell intensity="soft">
      <SetupHeader step={3} />
      <StepTitle sub="Sans l'autre, pas de balance. Un lien suffit.">Invite ton binôme.</StepTitle>

      <div style={{ padding: '19px 23px 0', position: 'relative' }}>
        {/* Carte « faire-part » crème : Mochi tend la main entre les deux places */}
        <SFE padding="22px 20px 18px" radius={22} style={{ marginBottom: 16, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 11 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 600, border: '3px solid #FFFCF5', boxShadow: 'none' }}>V</div>
            <div style={{ margin: '0 -6px', zIndex: 2 }}><SMI size={64} mood="happy" /></div>
            <div style={{ width: 54, height: 54, borderRadius: '50%', border: '2px dashed rgba(26,26,31,0.25)', background: 'rgba(26,26,31,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A857C', fontSize: 21, fontWeight: 600 }}>?</div>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.3 }}>Une place t'attend.</div>
          <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 3, marginBottom: 14 }}>C'est ce que l'autre verra en ouvrant ton lien.</div>
          {/* Le lien, prêt à partir */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(26,26,31,0.05)', borderRadius: 12, padding: '11px 14px' }}>
            <span style={{ flex: 1, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 14, color: '#1A1A1F', fontWeight: 500, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>mentalfree.app/j/VL-7K2P</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#4F7A57', flexShrink: 0 }}>Copier</span>
          </div>
        </SFE>

        <div style={{ background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '15px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#1A1A1F', boxShadow: '0 1px 2px rgba(26,26,31,0.06)', marginBottom: 10 }}>Envoyer le lien</div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[
            { i: '▦', l: 'QR code' },
            { i: '🔢', l: 'Saisir un code' },
          ].map(o => (
            <div key={o.l} style={{ flex: 1, background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 999, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14.5, fontWeight: 500 }}>
              <span style={{ fontSize: 16 }}>{o.i}</span>{o.l}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>Vous êtes côte à côte ? Montre le QR, c'est instantané.</div>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 09 · Choisir les tâches
// ════════════════════════════════════════════════════════════════
function SetupTasks() {
  const tasks = [
    { c: '🍽', l: 'Vaisselle', f: 'Quotidien', on: true },
    { c: '🧹', l: 'Ménage', f: '1×/sem', on: true },
    { c: '🛒', l: 'Courses', f: '1×/sem', on: true },
    { c: '🐕', l: 'Sortie chien', f: '3×/jour', on: true },
    { c: '🧺', l: 'Lessive', f: '2×/sem', on: true },
    { c: '👨‍🍳', l: 'Cuisiner', f: 'Quotidien', on: false },
    { c: '🌱', l: 'Plantes', f: '1×/sem', on: false },
    { c: '🗑', l: 'Poubelles', f: '2×/sem', on: true },
  ];
  return (
    <SShell intensity="soft">
      <SetupHeader step={4} />
      <StepTitle sub="On a préparé une liste. Coche, décoche, ajoute.">Choisis vos tâches.</StepTitle>

      <div style={{ padding: '18px 18px 110px', position: 'relative', overflow: 'hidden', maxHeight: 540 }}>
        {tasks.map(t => (
          <SFE key={t.l} padding="11px 14px" radius={14} style={{ marginBottom: 6, opacity: t.on ? 1 : 0.55 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(26,26,31,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{t.c}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{t.l}</div>
                <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{t.f}</div>
              </div>
              <div style={{ width: 42, height: 24, borderRadius: 12, background: t.on ? '#332F2D' : 'rgba(26,26,31,0.10)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: t.on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
              </div>
            </div>
          </SFE>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', gap: 8 }}>
        <CtaSecondary style={{ flex: 1, padding: '14px 16px' }}>+ Ajouter</CtaSecondary>
        <CtaPrimary style={{ flex: 1.6, padding: '14px 16px' }}>Lancer</CtaPrimary>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 10 · Setup d'une tâche — réutilise AFSetup (variant saturated)
// déjà importé via duo-v2-onglet-afaire.jsx, exposé sur window
// ════════════════════════════════════════════════════════════════

// ════════════════════════════════════════════════════════════════
// 11 · Mochi calcule — analyse en cours (iridescent moment doux)
// ════════════════════════════════════════════════════════════════
function SetupAnalysis() {
  return (
    <SShell intensity="strong">
      <div style={{ padding: '54px 23px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500, position: 'relative' }}></div>

      <div style={{ padding: '60px 24px 0', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Mochi iridescent + halo animé */}
        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 29 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid rgba(245,199,110,0.20)' }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid transparent', borderTopColor: '#F5C76E', borderRightColor: '#F5C76E', transform: 'rotate(135deg)' }} />
          <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', border: '2px solid rgba(159,201,168,0.20)' }} />
          <div style={{ position: 'absolute', inset: 26, borderRadius: '50%', border: '2px solid transparent', borderBottomColor: '#9FC9A8', borderLeftColor: '#9FC9A8', transform: 'rotate(45deg)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SMI size={130} mood="happy" />
          </div>
        </div>

        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.0, textAlign: 'center' }}>Mochi calcule…</div>
        <div style={{ fontSize: 15, color: '#8A857C', marginTop: 10, textAlign: 'center', maxWidth: 240, lineHeight: 1.5, fontWeight: 400 }}>
          Croisement des dispos, fréquences, charge ressentie…
        </div>

        <SFE padding="14px 18px" radius={14} style={{ marginTop: 29, width: 260 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 13, color: '#5A554C' }}>
            <div>✓ 8 tâches identifiées</div>
            <div>✓ 18 plages horaires</div>
            <div style={{ color: '#E97A6A', fontWeight: 500 }}>→ Optimisation en cours…</div>
          </div>
        </SFE>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 12 · Proposition de dispatch
// ════════════════════════════════════════════════════════════════
function SetupDispatch() {
  const items = [
    { c: '🍽', l: 'Vaisselle', who: 'V', tag: 'soir', mins: 15, color: '#7DB3D5' },
    { c: '🧹', l: 'Ménage', who: 'J', tag: 'samedi', mins: 60, color: '#B8A5D9' },
    { c: '🛒', l: 'Courses', who: 'V', tag: 'mercredi', mins: 45, color: '#7DB3D5' },
    { c: '🐕', l: 'Sortie chien', who: 'split', tag: 'matin/soir', mins: 20 },
    { c: '🧺', l: 'Lessive', who: 'J', tag: '2×/sem', mins: 30, color: '#B8A5D9' },
    { c: '🗑', l: 'Poubelles', who: 'V', tag: 'mar/ven', mins: 5, color: '#7DB3D5' },
  ];
  return (
    <SShell intensity="soft">
      <StepTitle sub="Tout est ajustable. Promis.">Mochi a réparti vos tâches.</StepTitle>

      {/* Balance preview */}
      <div style={{ padding: '18px 23px 0', position: 'relative' }}>
        <SFE padding="17px 18px" radius={20} style={{ marginBottom: 14, border: '1.5px solid #9FC9A8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.0 }}>Équilibré</div>
              <div style={{ fontSize: 13, color: '#8A857C', marginTop: 6, fontWeight: 400 }}>
                <strong style={{ color: '#1A1A1F' }}>4h30</strong> Valentin · <strong style={{ color: '#1A1A1F' }}>4h48</strong> Jeanne / sem
              </div>
            </div>
            <div style={{ height: 8, width: 80, background: 'rgba(26,26,31,0.10)', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: '48%', background: '#7DB3D5' }} />
              <div style={{ width: '52%', background: '#B8A5D9' }} />
            </div>
          </div>
        </SFE>
      </div>

      <div style={{ padding: '0 18px 110px', position: 'relative', overflow: 'hidden', maxHeight: 420 }}>
        {items.map((it, idx) => (
          <SFE key={idx} padding="11px 14px" radius={12} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 19 }}>{it.c}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 500 }}>{it.l}</div>
                <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{it.tag} · {it.mins}min</div>
              </div>
              {it.who === 'split' ? (
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#7DB3D5', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFCF5' }}>V</div>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFCF5', marginLeft: -8 }}>J</div>
                </div>
              ) : (
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: it.color, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{it.who}</div>
              )}
            </div>
          </SFE>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18, display: 'flex', gap: 8 }}>
        <CtaSecondary style={{ flex: 1, padding: '14px 16px' }}>Modifier</CtaSecondary>
        <CtaPrimary style={{ flex: 1.6, padding: '14px 16px' }}>C'est parti →</CtaPrimary>
      </div>
    </SShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 13 · Glisser pour réattribuer
// ════════════════════════════════════════════════════════════════
function SetupReassign() {
  const cols = [
    { who: 'V', name: 'Valentin', c: '#7DB3D5', items: [
      { c: '🍽', l: 'Vaisselle' },
      { c: '🛒', l: 'Courses' },
      { c: '🗑', l: 'Poubelles' },
    ] },
    { who: 'J', name: 'Jeanne', c: '#B8A5D9', items: [
      { c: '🧹', l: 'Ménage' },
      { c: '🧺', l: 'Lessive' },
    ] },
  ];
  return (
    <SShell intensity="soft">
      <SetupHeader step="·" total="" />
      <StepTitle sub="Glisse une tâche d'une colonne à l'autre.">Réattribuer.</StepTitle>

      <div style={{ padding: '18px 18px 110px', position: 'relative', display: 'flex', gap: 8 }}>
        {cols.map(col => (
          <SFE key={col.who} padding="13px 13px" radius={18} style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: col.c, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{col.who}</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{col.name}</div>
            </div>
            {col.items.map(it => (
              <div key={it.l} style={{ background: 'rgba(255,252,245,0.55)', borderRadius: 10, padding: '10px 10px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 500, boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset' }}>
                <span style={{ color: '#8A857C', fontSize: 11.5 }}>≡</span>
                <span>{it.c}</span>
                <span>{it.l}</span>
              </div>
            ))}
          </SFE>
        ))}
      </div>

      {/* tâche en cours de drag */}
      <div style={{ position: 'absolute', top: 360, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', background: '#FFFCF5', borderRadius: 12, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 12px 28px rgba(50,40,30,0.22)', fontSize: 15, fontWeight: 600, border: '2px solid #F5A89A' }}>
        <span>🐕</span>
        <span>Sortie chien</span>
      </div>

      <div style={{ position: 'absolute', bottom: 24, left: 18, right: 18 }}>
        <CtaPrimary>Valider →</CtaPrimary>
      </div>
    </SShell>
  );
}

Object.assign(window, {
  SetupProfile, SetupAvailability, SetupInvite, SetupTasks, SetupAnalysis, SetupDispatch, SetupReassign,
});
