// V3 · Activité & pings (brief §5) + Profil / Réglages (brief §6)
// DNA Crème : réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent

const { FrameEmbossed: A3Fe, PillLabel: A3Pill, MochiIridescent: A3Mochi, IridShell: A3Shell, TabBarV3: A3Tb } = window;

// ═══════════ ACTIVITÉ — fil du duo (depuis la bulle du header) ═══════════
function ActiviteV3() {
  return (
    <A3Shell intensity="soft">
      <div style={{ padding: '14px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>←</div>
        <div style={{ fontSize: 11.5, letterSpacing: 1.6, fontWeight: 600 }}>ACTIVITÉ</div>
        <div style={{ width: 36 }}></div>
      </div>

      <div style={{ padding: '10px 18px 0', display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden', maxHeight: 560 }}>
        <div style={{ alignSelf: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 10.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 500 }}>AUJOURD'HUI</div>

        {/* Événement : tâche terminée + réponses préformatées */}
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '13px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>Jeanne a terminé <strong>les courses</strong> ✅</div>
            <span style={{ fontSize: 11, color: '#8A857C', fontWeight: 500 }}>14:12</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 9, marginLeft: 38, flexWrap: 'nowrap' }}>
            {['👍', 'Merci ❤️', 'T\'es la meilleure'].map(r => (
              <span key={r} style={{ fontSize: 13, fontWeight: 500, padding: '8px 10px', borderRadius: 999, background: 'rgba(26,26,31,0.05)', whiteSpace: 'nowrap', flexShrink: 0 }}>{r}</span>
            ))}
          </div>
        </div>

        {/* Ping reçu avec tâche attachée */}
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '13px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
            <div style={{ flex: 1, fontSize: 15.5, fontWeight: 500 }}>« C'est ton tour 🍽 »</div>
            <span style={{ fontSize: 11, color: '#8A857C', fontWeight: 500 }}>18:40</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, marginLeft: 38, background: 'rgba(26,26,31,0.04)', borderRadius: 10, padding: '8px 10px' }}>
            <span style={{ fontSize: 16 }}>🍽</span>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>Vaisselle du soir · 20h</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4F7A57' }}>Voir</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 9, marginLeft: 38, flexWrap: 'nowrap' }}>
            {['👍 Ok ce soir', 'Déjà fait ✓'].map(r => (
              <span key={r} style={{ fontSize: 13, fontWeight: 500, padding: '8px 10px', borderRadius: 999, background: 'rgba(26,26,31,0.05)', whiteSpace: 'nowrap', flexShrink: 0 }}>{r}</span>
            ))}
          </div>
        </div>

        {/* Proposition de repassage — action requise */}
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '13px 14px', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', border: '1.5px solid #B8A5D9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>Jeanne propose de te repasser <strong>la lessive</strong></div>
            <span style={{ fontSize: 11, color: '#8A857C', fontWeight: 500 }}>19:02</span>
          </div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 4, marginLeft: 38 }}>Si tu acceptes : +1 dette pour elle</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 9, marginLeft: 38 }}>
            <div style={{ flex: 1, background: '#1A1A1F', color: '#FFFCF5', borderRadius: 999, padding: '8px 13px', textAlign: 'center', fontSize: 14, fontWeight: 600 }}>Accepter</div>
            <div style={{ flex: 1, background: 'rgba(26,26,31,0.05)', borderRadius: 999, padding: '8px 13px', textAlign: 'center', fontSize: 14, fontWeight: 500 }}>Refuser</div>
          </div>
        </div>

        {/* Moment Mochi */}
        <A3Fe padding="11px 16px" radius={14} style={{ alignSelf: 'center', minWidth: 230, textAlign: 'center', border: '1.5px solid #F5C76E' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}><A3Mochi size={34} mood="happy"></A3Mochi></div>
          <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>Soirée équilibrée 🥳</div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3, whiteSpace: 'nowrap' }}>+1 jour à votre streak (6 🔥)</div>
        </A3Fe>

        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#8A857C', fontWeight: 400, marginTop: 3, lineHeight: 1.5 }}>
          Pas de messages libres ici — les détails vivent<br></br>dans les notes de tâches. On ne remplace pas WhatsApp.
        </div>
      </div>
    </A3Shell>
  );
}

// ═══════════ PING SHEET — long press sur une tâche de l'autre ═══════════
function PingSheetV3() {
  return (
    <A3Shell intensity="soft">
      {/* Home assombri derrière */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,31,0.35)', backdropFilter: 'blur(2px)', zIndex: 30 }}></div>

      {/* Tâche source, surélevée */}
      <div style={{ position: 'absolute', top: 150, left: 24, right: 24, zIndex: 31 }}>
        <div style={{ background: '#FFFCF5', borderRadius: 16, padding: '13px 16px', boxShadow: '0 20px 48px rgba(26,26,31,0.35)', display: 'flex', alignItems: 'center', gap: 13, transform: 'scale(1.02)' }}>
          <span style={{ fontSize: 19 }}>🍽</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>Vaisselle du soir</div>
            <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>20h · chez Jeanne ce soir</div>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>J</div>
        </div>
      </div>

      {/* Sheet pings préformatés */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#FAFAF7', borderRadius: '26px 26px 0 0', padding: '10px 18px 31px', zIndex: 32, boxShadow: '0 -12px 40px rgba(26,26,31,0.25)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(26,26,31,0.15)', margin: '0 auto 14px' }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 11 }}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, textTransform: 'uppercase', flex: 1 }}>Envoyer un ping à Jeanne</div>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '8px 10px', borderRadius: 999, background: 'rgba(26,26,31,0.05)', color: '#8A857C', whiteSpace: 'nowrap', flexShrink: 0 }}>🍽 tâche attachée</span>
        </div>
        {[
          { e: '🌷', l: 'Rappel doux', s: '« Quand tu as un moment… »' },
          { e: '🍽', l: 'C\'est ton tour', s: 'Direct mais gentil' },
          { e: '⏰', l: 'Avant 21h idéalement', s: 'Avec la deadline attachée' },
          { e: '🤝', l: 'Je peux la prendre si tu veux', s: 'Proposition de repassage inversé' },
        ].map((p, i) => (
          <div key={p.l} style={{ background: '#FFFCF5', borderRadius: 14, padding: '13px 14px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 13, boxShadow: '0 0 0 1px rgba(26,26,31,0.05)' }}>
            <span style={{ fontSize: 19 }}>{p.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>{p.l}</div>
              <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{p.s}</div>
            </div>
            <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
          </div>
        ))}
      </div>
    </A3Shell>
  );
}

// ═══════════ PROFIL / RÉGLAGES V3 — préférences perso vs règles du duo ═══════════
function ProfilV3() {
  const row = (e, l, s, extra) => (
    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '10px 0', borderTop: '1px solid rgba(26,26,31,0.06)' }}>
      <span style={{ fontSize: 17 }}>{e}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500 }}>{l}</div>
        <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{s}</div>
      </div>
      {extra || <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>}
    </div>
  );
  const toggleOff = (
    <div style={{ width: 40, height: 24, borderRadius: 999, background: 'rgba(26,26,31,0.12)', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
    </div>
  );
  return (
    <A3Shell intensity="soft">
      <div style={{ padding: '17px 23px 0', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 21, fontWeight: 600, color: '#fff', boxShadow: 'none' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.6 }}>Valentin</div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>En duo avec <span style={{ color: '#9A7BC8', fontWeight: 600 }}>Jeanne</span> · 92 jours</div>
        </div>
        <A3Pill color="#F5C76E">DUO+</A3Pill>
      </div>

      <div style={{ padding: '0 22px', position: 'relative', overflow: 'hidden', maxHeight: 580, boxSizing: 'border-box' }}>
        {/* Mes préférences */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#4C7FA3', fontWeight: 600, marginBottom: 7, textTransform: 'uppercase' }}>Mes préférences · perso</div>
        <A3Fe padding="11px 14px" radius={16} style={{ marginBottom: 14 }}>
          {row('🎨', 'Identité', 'Valentin · bleu ciel')}
          {row('🗓', 'Disponibilités & énergie', 'Soirs + week-end · 5 h/sem')}
          {row('❤️', 'Tâches aimées / détestées', 'Cuisiner, courses · repasser, admin')}
          {row('🔔', 'Rappels', 'Quotidien 19h30 · 30 min avant deadline')}
        </A3Fe>

        {/* Nos règles du duo */}
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#9A7BC8', fontWeight: 600, marginBottom: 7, textTransform: 'uppercase' }}>Nos règles du duo · décidées ensemble</div>
        <A3Fe padding="11px 14px" radius={16} style={{ marginBottom: 14 }}>
          {row('⇄', 'Repassage', 'Max 3 refus/sem · critiques non repassables')}
          {row('🎯', 'Malus', 'Activés · réglés chaque semaine au point')}
          {row('📣', 'Rappel croisé', 'Prévenir si une tâche de l\'autre est en retard', toggleOff)}
          {row('💳', 'Abonnement Duo+', 'Annuel · renouvelé le 3 sept')}
          {row('👥', 'Session', 'Valentin + Jeanne · gérer')}
        </A3Fe>

        <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, textAlign: 'center', marginBottom: 10, lineHeight: 1.5 }}>Les seuils d'équilibre (10 % / 25 %) sont communs à tous les duos.</div>
        <div style={{ textAlign: 'center', fontSize: 14.5, fontWeight: 600, color: '#C75744' }}>Se déconnecter</div>
      </div>
    </A3Shell>
  );
}

Object.assign(window, { ActiviteV3, PingSheetV3, ProfilV3 });
