// Embossed · Modaux & notifs (Phase 2)
// 5 écrans : EventSocial / Tricount / PenseBete / MoodCheckin / NotifLock

const {
  IridShell: MShell,
  FrameEmbossed: MFE,
  PillLabel: MPL,
  MochiIridescent: MMI,
  IridTabBarV2: MTB,
} = window;

// ─────────── Helpers ───────────
function SheetGrabber() {
  return (
    <div style={{ width: 44, height: 5, background: 'rgba(26,26,31,0.18)', borderRadius: 3, margin: '0 auto 12px' }} />
  );
}

function ModalShell({ children, peekContent, sheetHeight = '82%', dark = false }) {
  return (
    <MShell intensity="soft">
      {/* Fond peek — un aperçu de l'écran derrière (dimmé) */}
      <div style={{ position: 'absolute', top: 90, left: 18, right: 18, opacity: 0.35, pointerEvents: 'none' }}>
        {peekContent}
      </div>
      {/* Sheet bas */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: dark ? '#1A1A1F' : '#FAFAF7',
        color: dark ? '#FFFCF5' : '#1A1A1F',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -1px 0 rgba(26,26,31,0.08)',
        padding: '12px 0 28px', maxHeight: sheetHeight, overflow: 'hidden',
      }}>
        <SheetGrabber />
        {children}
      </div>
    </MShell>
  );
}

function PeekStub({ rows = 4 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ height: 50, background: 'rgba(255,255,255,0.55)', borderRadius: 14, marginBottom: 6 }} />
      ))}
    </div>
  );
}

function CtaModal({ children, style = {} }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)',
      borderRadius: 999, padding: '14px 18px',
      textAlign: 'center', fontSize: 15.5, fontWeight: 600, color: '#1A1A1F',
      boxShadow: '0 4px 16px rgba(245,168,154,0.32)',
      ...style,
    }}>{children}</div>
  );
}

// ════════════════════════════════════════════════════════════════
// 1 · EVENT SOCIAL — modal sheet : anniv avec split charge mentale
// ════════════════════════════════════════════════════════════════
function EventSocialEmbossed() {
  return (
    <ModalShell peekContent={<PeekStub rows={5} />}>
      <div style={{ padding: '0 22px' }}>
        {/* Eyebrow + close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <MPL color="#B8A5D9">● ÉVÉNEMENT SOCIAL</MPL>
          <div style={{ fontSize: 14, color: '#8A857C', fontWeight: 600 }}>Annuler</div>
        </div>

        {/* Hero card embossed avec ombre lavender */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#B8A5D9', opacity: 0.45, transform: 'translate(4px, 5px)' }} />
          <div style={{ position: 'relative' }}>
            <MFE padding="17px 18px" radius={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: '#E2D6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>🎂</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.7, lineHeight: 1.05 }}>Anniv de Sophie</div>
                  <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 4 }}>Sam. 30 avr · 20h · Chez elle</div>
                </div>
              </div>
            </MFE>
          </div>
        </div>

        {/* QUI PORTE QUOI */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Qui porte quoi</div>
        <MFE padding="6px 0" radius={16} style={{ marginBottom: 14 }}>
          {[
            { l: 'Cadeau (idée + achat)', who: 'J', c: '#B8A5D9', t: '45 min' },
            { l: 'Trouver babysitter', who: 'J', c: '#B8A5D9', t: '20 min' },
            { l: 'Réserver Uber retour', who: 'V', c: '#7DB3D5', t: '5 min' },
            { l: 'Carte de la part des deux', who: 'V', c: '#7DB3D5', t: '15 min' },
          ].map((r, i, arr) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '11px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(26,26,31,0.06)' : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: r.c, color: '#fff', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.who}</div>
              <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{r.l}</div>
              <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 13, color: '#8A857C', fontWeight: 500 }}>{r.t}</div>
            </div>
          ))}
        </MFE>

        {/* DEUX CARDS BUDGET + TENUE */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#F5C76E', opacity: 0.4, transform: 'translate(3px, 4px)' }} />
            <div style={{ position: 'relative' }}>
              <MFE padding="13px 14px" radius={14}>
                <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#8A857C', fontWeight: 600, marginBottom: 6 }}>BUDGET CADEAU</div>
                <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 20, fontWeight: 700, letterSpacing: -0.8 }}>40€</div>
                <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>→ Tricount</div>
              </MFE>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 14, background: '#7DB3D5', opacity: 0.35, transform: 'translate(3px, 4px)' }} />
            <div style={{ position: 'relative' }}>
              <MFE padding="13px 14px" radius={14}>
                <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#8A857C', fontWeight: 600, marginBottom: 6 }}>TENUE</div>
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.15 }}>Casual chic</div>
                <div style={{ fontSize: 11.5, color: '#8A857C', fontWeight: 400, marginTop: 3, fontStyle: 'italic' }}>"pas de jeans"</div>
              </MFE>
            </div>
          </div>
        </div>

        <CtaModal>Ajouter au calendrier</CtaModal>
      </div>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 2 · TRICOUNT — modal sheet : solde + dépenses récentes
// ════════════════════════════════════════════════════════════════
function TricountEmbossed() {
  return (
    <ModalShell peekContent={<PeekStub rows={5} />} sheetHeight="86%">
      <div style={{ padding: '0 22px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 11 }}>
          <div>
            <div style={{ marginBottom: 6 }}><MPL color="#F5C76E">COMPTES PARTAGÉS</MPL></div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.9, lineHeight: 1 }}>Argent</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: '#1A1A1F', color: '#FFFCF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 300 }}>+</div>
        </div>

        {/* Hero solde — dark embossed (vibe ledger) */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 20, background: '#F5C76E', opacity: 0.55, transform: 'translate(5px, 7px)' }} />
          <div style={{ position: 'relative', background: '#332F2D', color: '#FFFCF5', borderRadius: 20, padding: '17px 18px', boxShadow: '0 8px 22px rgba(50,40,30,0.28), 0 1px 0 rgba(255,255,255,0.06) inset' }}>
            <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: 'rgba(255,252,245,0.55)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6 }}>Solde de Jeanne envers toi</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 44, fontWeight: 700, color: '#F5C76E', letterSpacing: -2, lineHeight: 1 }}>+47,80</div>
              <div style={{ fontSize: 19, fontWeight: 600, color: '#F5C76E' }}>€</div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 11 }}>
              <div style={{ flex: 1, background: 'rgba(255,252,245,0.12)', borderRadius: 999, padding: '8px 13px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>Rappeler</div>
              <div style={{ flex: 1, background: '#F5C76E', color: '#1A1A1F', borderRadius: 999, padding: '8px 13px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Solder</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Récent</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {[
            { c: '🛒', l: 'Courses Monoprix', who: 'V', amt: '64,20€', d: 'hier' },
            { c: '🍕', l: 'Dîner livraison', who: 'J', amt: '28,50€', d: 'lundi' },
            { c: '⛽', l: 'Plein essence', who: 'V', amt: '72,00€', d: 'sam.' },
            { c: '🎂', l: 'Cadeau Sophie', who: 'J', amt: '40,00€', d: 'sam.' },
          ].map((t, i) => (
            <MFE key={i} padding="11px 14px" radius={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>{t.c}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{t.l}</div>
                  <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>payé par {t.who === 'V' ? 'toi' : 'Jeanne'} · {t.d}</div>
                </div>
                <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 14.5, fontWeight: 600 }}>{t.amt}</div>
              </div>
            </MFE>
          ))}
        </div>

        {/* astuce charge mentale */}
        <div style={{ marginTop: 11, padding: '10px 14px', background: '#FBE49A', borderRadius: 12, fontSize: 13.5, color: '#1A1A1F', fontWeight: 400, lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          <span style={{ fontSize: 16 }}>💡</span>
          Tu portes <strong>60% des courses</strong> ce mois — pèse aussi dans la charge mentale.
        </div>
      </div>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 3 · PENSE-BÊTE — full screen onglet, grille de notes embossed
// ════════════════════════════════════════════════════════════════
function PenseBeteEmbossed() {
  const notes = [
    { t: 'Pédiatre Léa', d: 'Dr Marchand · 01 42 88 12 34 · jeudi 14h', c: '#FBE49A' },
    { t: 'Chaudière', d: 'Révision avant 15 nov · Garantie ENGIE', c: '#C9DFEA' },
    { t: 'Mdp box internet', d: 'Free · CC91-7K2P-MV04', c: '#E2D6F0' },
    { t: 'Anniv Maman J.', d: '14 mai · idée : foulard Hermès', c: '#F5A89A' },
    { t: 'Vétérinaire Pixel', d: 'Vaccin rappel 22 juin', c: '#C9E0C5' },
    { t: 'Code Vélib', d: 'Borne 16ème · #4407', c: '#FBE49A' },
  ];
  return (
    <MShell intensity="soft">
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', position: 'relative' }}>
        <div>
          <div style={{ marginBottom: 6 }}><MPL color="#B8A5D9">LE CERVEAU EXTERNE</MPL></div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1 }}>Pense-bête</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 18, background: '#1A1A1F', color: '#FFFCF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 300, boxShadow: '0 4px 12px rgba(26,26,31,0.20)' }}>+</div>
      </div>

      {/* Recherche */}
      <div style={{ padding: '14px 18px 13px', position: 'relative' }}>
        <div style={{ background: '#FFFCF5', borderRadius: 999, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          <span style={{ fontSize: 15, opacity: 0.6 }}>🔍</span>
          <span style={{ fontSize: 14.5, color: '#8A857C', fontWeight: 400, flex: 1 }}>Rechercher dans le cerveau partagé…</span>
          <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 11, color: '#8A857C', fontWeight: 600, letterSpacing: 0.5 }}>{notes.length} NOTES</div>
        </div>
      </div>

      {/* Grille sticky notes embossed + tilted */}
      <div style={{ padding: '0 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, position: 'relative' }}>
        {notes.map((n, i) => (
          <div key={i} style={{
            background: n.c, borderRadius: 14, padding: '13px 14px',
            transform: `rotate(${i % 2 === 0 ? -0.8 : 0.6}deg)`,
            boxShadow: '0 0 0 1px rgba(26,26,31,0.05)',
            minHeight: 92, position: 'relative',
          }}>
            {/* tape effect */}
            <div style={{ position: 'absolute', top: -5, left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: 28, height: 10, background: 'rgba(255,255,255,0.5)', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }} />
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.15, color: '#1A1A1F', marginTop: 4 }}>{n.t}</div>
            <div style={{ fontSize: 12, color: 'rgba(26,26,31,0.65)', fontWeight: 400, marginTop: 4, lineHeight: 1.35 }}>{n.d}</div>
          </div>
        ))}
      </div>

      <MTB active="profile" />
    </MShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 4 · MOOD CHECK-IN — modal dimanche soir
// ════════════════════════════════════════════════════════════════
function MoodCheckinEmbossed() {
  return (
    <ModalShell peekContent={<PeekStub rows={4} />}>
      <div style={{ padding: '0 22px' }}>
        <div style={{ marginBottom: 6 }}><MPL color="#E97A6A">DIMANCHE SOIR · CHECK-IN</MPL></div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.0, lineHeight: 1.05 }}>Comment tu te sens ?</div>
        <div style={{ fontSize: 14, color: '#8A857C', fontWeight: 400, marginTop: 6, lineHeight: 1.4, marginBottom: 16 }}>Honnête. C'est privé. Jeanne voit juste un agrégat anonyme.</div>

        {/* Mood faces — 5 cercles embossed */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 19 }}>
          {[
            { e: '😄', l: 'Léger' },
            { e: '🙂', l: 'OK' },
            { e: '😐', l: 'Bof' },
            { e: '😣', l: 'Lourd', active: true },
            { e: '😩', l: 'Cramé' },
          ].map(m => (
            <div key={m.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: m.active ? '#F5A89A' : '#FFFCF5',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                boxShadow: m.active ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
              }}>{m.e}</div>
              <span style={{ fontSize: 12, color: m.active ? '#1A1A1F' : '#8A857C', fontWeight: m.active ? 600 : 400 }}>{m.l}</span>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Qu'est-ce qui pèse ?</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 19 }}>
          {[
            { l: 'Mental load', on: true },
            { l: 'Boulot', on: true },
            { l: 'Sommeil', on: false },
            { l: 'Social', on: false },
            { l: 'Argent', on: false },
            { l: 'Santé', on: false },
            { l: 'Famille', on: true },
          ].map(t => (
            <div key={t.l} style={{
              padding: '8px 13px', borderRadius: 999,
              background: t.on ? '#1A1A1F' : '#FFFCF5',
              color: t.on ? '#FFFCF5' : '#1A1A1F',
              fontSize: 13.5, fontWeight: 500,
              boxShadow: t.on ? '0 0 0 1px rgba(26,26,31,0.05)' : '0 0 0 1px rgba(26,26,31,0.05)',
            }}>{t.l}</div>
          ))}
        </div>

        {/* Note perso */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Une note pour toi (perso)</div>
        <MFE padding="14px 16px" radius={14} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontStyle: 'italic', color: '#3A3A42', lineHeight: 1.4, fontWeight: 400 }}>
            "Cette semaine c'était trop, j'ai du mal à demander de l'aide…"
            <span style={{ marginLeft: 1, animation: 'blink 1s steps(2) infinite', color: '#E97A6A', fontStyle: 'normal' }}>|</span>
          </div>
        </MFE>

        <CtaModal>Valider mon check-in</CtaModal>
      </div>
    </ModalShell>
  );
}

// ════════════════════════════════════════════════════════════════
// 5 · NOTIFS LOCKSCREEN — iOS lockscreen avec notifs Duo
// ════════════════════════════════════════════════════════════════
function NotifLockEmbossed() {
  return (
    <div style={{
      width: 360, height: 760,
      background: 'radial-gradient(circle at 50% 30%, #3A3A42 0%, #1A1A1F 65%, #0A0A0F 100%)',
      position: 'relative', overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', color: '#FFFCF5',
    }}>
      {/* status bar */}
      <div style={{ padding: '54px 24px 0', display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 500 }}>
        <span>9:41</span>
        <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
          <span style={{ fontSize: 11.5 }}>5G</span>
          <span style={{ fontSize: 13 }}>▮▮▮▯</span>
        </span>
      </div>

      {/* Lock indicator + date + time */}
      <div style={{ marginTop: 21, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,252,245,0.6)', fontWeight: 400 }}>
          <span>🔒</span> Verrouillé
        </div>
        <div style={{ marginTop: 10, fontSize: 15, color: 'rgba(255,252,245,0.7)', fontWeight: 400 }}>lundi 28 avril</div>
        <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 88, fontWeight: 200, lineHeight: 1, letterSpacing: -3, marginTop: 3 }}>20:30</div>
      </div>

      {/* Widget Duo — mini balance card */}
      <div style={{ margin: '24px 14px 0', background: 'rgba(255,252,245,0.10)', backdropFilter: 'blur(20px)', borderRadius: 18, padding: '13px 14px', border: '0.5px solid rgba(255,252,245,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg, #FFF1E0, #F5A89A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A1A1F' }}>D</div>
          <div style={{ fontSize: 11.5, letterSpacing: 1.2, color: 'rgba(255,252,245,0.55)', fontWeight: 600 }}>DUO · WIDGET</div>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11.5, color: 'rgba(255,252,245,0.45)', fontWeight: 400 }}>maintenant</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>Légèrement chez toi</div>
            <div style={{ fontSize: 13, color: 'rgba(255,252,245,0.55)', marginTop: 3, fontWeight: 400 }}>18 min d'écart · 12 🔥</div>
          </div>
          <div style={{ display: 'flex', gap: 5, height: 22, alignItems: 'flex-end' }}>
            {[10, 14, 16, 18, 12, 20, 16].map((h, i) => (
              <div key={i} style={{ width: 4, height: h, borderRadius: 2, background: i === 6 ? '#F5A89A' : 'rgba(255,252,245,0.35)' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Notif stack */}
      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Ping */}
        <div style={{ background: 'rgba(255,252,245,0.10)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '11px 14px', border: '0.5px solid rgba(255,252,245,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg, #FFF1E0, #F5A89A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A1A1F' }}>D</div>
            <div style={{ fontSize: 11.5, letterSpacing: 1.0, color: 'rgba(255,252,245,0.55)', fontWeight: 500 }}>DUO</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11.5, color: 'rgba(255,252,245,0.45)', fontWeight: 400 }}>à l'instant</div>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 500 }}>👀 Jeanne te ping</div>
          <div style={{ fontSize: 14, color: 'rgba(255,252,245,0.78)', marginTop: 3, lineHeight: 1.35 }}>"La vaisselle s'auto-fait pas chéri 😘"</div>
        </div>

        {/* Rappel tâche */}
        <div style={{ background: 'rgba(255,252,245,0.10)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '11px 14px', border: '0.5px solid rgba(255,252,245,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg, #FFF1E0, #F5A89A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A1A1F' }}>D</div>
            <div style={{ fontSize: 11.5, letterSpacing: 1.0, color: 'rgba(255,252,245,0.55)', fontWeight: 500 }}>DUO</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11.5, color: 'rgba(255,252,245,0.45)', fontWeight: 400 }}>il y a 5 min</div>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 500 }}>🍽 Vaisselle du soir</div>
          <div style={{ fontSize: 14, color: 'rgba(255,252,245,0.78)', marginTop: 3 }}>C'est l'heure. 15 min suffisent.</div>
        </div>

        {/* Milestone — sage accent */}
        <div style={{ background: 'rgba(159,201,168,0.18)', backdropFilter: 'blur(20px)', borderRadius: 16, padding: '11px 14px', border: '0.5px solid rgba(159,201,168,0.30)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 18, height: 18, borderRadius: 5, background: '#9FC9A8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1A1A1F' }}>D</div>
            <div style={{ fontSize: 11.5, letterSpacing: 1.0, color: 'rgba(159,201,168,0.85)', fontWeight: 600 }}>DUO · STREAK</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontSize: 11.5, color: 'rgba(255,252,245,0.45)', fontWeight: 400 }}>ce matin</div>
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 600 }}>🔥 12 jours d'équilibre</div>
          <div style={{ fontSize: 14, color: 'rgba(255,252,245,0.85)', marginTop: 3 }}>Nouveau record perso !</div>
        </div>
      </div>

      {/* Lockscreen bottom controls — torch + camera */}
      <div style={{ position: 'absolute', bottom: 30, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 28px' }}>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,252,245,0.10)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>🔦</div>
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,252,245,0.10)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>📷</div>
      </div>
    </div>
  );
}

Object.assign(window, { EventSocialEmbossed, TricountEmbossed, PenseBeteEmbossed, MoodCheckinEmbossed, NotifLockEmbossed });
