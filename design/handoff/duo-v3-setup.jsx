// V3 · Setup profil — 3 écrans (brief §1) : Identité / Dispos & énergie / Préférences
// DNA Crème : réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent

const { FrameEmbossed: S3Fe, PillLabel: S3Pill, MochiIridescent: S3Mochi, IridShell: S3Shell } = window;

const s3CTA = { background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, color: '#1A1A1F', boxShadow: '0 1px 2px rgba(26,26,31,0.06)' };

function S3Header({ step, title, sub }) {
  return (
    <React.Fragment>
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: i === Number(step) ? 18 : 6, height: 6, borderRadius: 999, background: i <= Number(step) ? '#1A1A1F' : 'rgba(26,26,31,0.15)' }}></div>
          ))}
        </div>
      </div>
      <div style={{ padding: '14px 23px 0', position: 'relative' }}>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontSize: 14, color: '#8A857C', fontWeight: 400, marginTop: 6, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </React.Fragment>
  );
}

// ═══════════ A · IDENTITÉ ═══════════
function SetupIdentiteV3() {
  return (
    <S3Shell intensity="soft">
      <S3Header step="1" title="C'est toi." sub="Ton prénom et ta photo — on les retrouve partout : balance, planning, historique."></S3Header>

      <div style={{ padding: '24px 23px 0', position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Ton prénom</div>
        <S3Fe padding="17px 18px" radius={16} style={{ marginBottom: 19 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.4 }}>Valentin</span>
            <span style={{ width: 2, height: 20, background: '#E97A6A', animation: 'blink 1.1s step-end infinite' }}></span>
          </div>
        </S3Fe>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Ta photo</div>
        <S3Fe padding="17px 18px" radius={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(26,26,31,0.04)', border: '1.5px dashed rgba(26,26,31,0.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8A857C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>Ajouter une photo</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3, lineHeight: 1.4 }}>Ou continue sans — on affichera ton initiale.</div>
            </div>
            <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
          </div>
        </S3Fe>
      </div>

      {/* Mochi en coin, discret, qui observe */}
      <div style={{ position: 'absolute', bottom: 84, right: -14, transform: 'rotate(-9deg)', opacity: 0.95 }}>
        <S3Mochi size={88} mood="wink"></S3Mochi>
      </div>

      <div style={{ position: 'absolute', bottom: 26, left: 18, right: 18 }}>
        <div style={s3CTA}>Continuer</div>
      </div>
    </S3Shell>
  );
}

// ═══════════ B · DISPOS & ÉNERGIE ═══════════
function SetupDisposV3() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  // 0 = rien, 1 = léger, 2 = à fond
  const matin = [0, 1, 0, 1, 0, 2, 2];
  const soir = [2, 1, 2, 0, 1, 2, 1];
  const cell = (v) => ({
    height: 34, borderRadius: 10,
    background: v === 2 ? '#9FC9A8' : v === 1 ? 'rgba(159,201,168,0.35)' : '#FFFCF5',
    boxShadow: v === 0 ? 'inset 0 0 0 1.5px rgba(26,26,31,0.10)' : '0 0 0 1px rgba(26,26,31,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, color: v === 2 ? '#1A1A1F' : '#4F7A57',
  });
  return (
    <S3Shell intensity="soft">
      <S3Header step="2" title="Tes dispos & ton énergie." sub="Tape un créneau pour cycler : 1 tap = dispo léger, 2 taps = à fond, rien = pas ce jour-là."></S3Header>

      <div style={{ padding: '18px 23px 0', position: 'relative' }}>
        <S3Fe padding="14px 16px" radius={18} style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '44px repeat(7, 1fr)', gap: 5, alignItems: 'center' }}>
            <div></div>
            {days.map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: 10.5, letterSpacing: 1, color: i >= 5 ? '#1A1A1F' : '#8A857C', fontWeight: 600 }}>{d}</div>
            ))}
            <div style={{ fontSize: 11, letterSpacing: 0.8, color: '#8A857C', fontWeight: 600 }}>MATIN</div>
            {matin.map((v, i) => <div key={i} style={cell(v)}>{v === 2 ? '●' : v === 1 ? '○' : ''}</div>)}
            <div style={{ fontSize: 11, letterSpacing: 0.8, color: '#8A857C', fontWeight: 600 }}>SOIR</div>
            {soir.map((v, i) => <div key={i} style={cell(v)}>{v === 2 ? '●' : v === 1 ? '○' : ''}</div>)}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 11, fontSize: 11.5, fontWeight: 500, color: '#8A857C' }}>
            <span><span style={{ color: '#4F7A57' }}>○</span> léger · petites tâches</span>
            <span><span style={{ color: '#1A1A1F' }}>●</span> à fond · grosses tâches</span>
          </div>
        </S3Fe>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, margin: '8px 0 8px', textTransform: 'uppercase' }}>Temps dispo par semaine</div>
        <S3Fe padding="11px 13px" radius={16}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {[
              { l: '2 h', s: 'le minimum' },
              { l: '5 h', s: 'raisonnable', on: true },
              { l: '8 h+', s: 'large' },
            ].map(o => (
              <div key={o.l} style={{ borderRadius: 12, padding: '13px 10px', textAlign: 'center', background: o.on ? '#1A1A1F' : 'transparent', color: o.on ? '#FFFCF5' : '#1A1A1F', boxShadow: o.on ? '0 4px 12px rgba(26,26,31,0.25)' : 'none' }}>
                <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>{o.l}</div>
                <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.6, marginTop: 3 }}>{o.s}</div>
              </div>
            ))}
          </div>
        </S3Fe>
      </div>

      <div style={{ position: 'absolute', bottom: 26, left: 18, right: 18 }}>
        <div style={s3CTA}>Continuer</div>
      </div>
    </S3Shell>
  );
}

// ═══════════ C · PRÉFÉRENCES ═══════════
function SetupPrefsV3() {
  const chip = (on, tone) => ({
    padding: '8px 13px', borderRadius: 999, fontSize: 14, fontWeight: 500,
    background: on ? (tone === 'like' ? '#C9E0C5' : '#F5A89A') : '#FFFCF5',
    boxShadow: on ? '0 0 0 1px rgba(26,26,31,0.05)' : 'inset 0 0 0 1.5px rgba(26,26,31,0.10)',
    color: '#1A1A1F',
  });
  return (
    <S3Shell intensity="soft">
      <S3Header step="3" title="Ce que tu aimes (ou pas)." sub="La pénibilité est personnelle : repasser peut être 1/5 pour toi et 5/5 pour l'autre. C'est ce qui rend Mochi intelligent."></S3Header>

      <div style={{ padding: '17px 23px 0', position: 'relative' }}>
        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#4F7A57', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>J'aime bien faire · 3 max</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {[
            { l: '🍳 Cuisiner', on: true }, { l: '🛒 Courses', on: true }, { l: '🐕 Le chien', on: true },
            { l: '🧺 Lessive' }, { l: '🪴 Plantes' },
          ].map(c => <div key={c.l} style={chip(c.on, 'like')}>{c.l}</div>)}
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#C75744', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Je déteste · 3 max</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 19 }}>
          {[
            { l: '👔 Repasser', on: true }, { l: '🚽 Salle de bain', on: true }, { l: '📞 Appels admin', on: true },
            { l: '🍽 Vaisselle' }, { l: '🗑 Poubelles' },
          ].map(c => <div key={c.l} style={chip(c.on, 'hate')}>{c.l}</div>)}
        </div>

        <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>Rappel quotidien</div>
        <S3Fe padding="14px 18px" radius={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>🔔</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 600 }}>Chaque jour à</div>
              <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>Ton récap de missions du jour</div>
            </div>
            <div style={{ background: 'rgba(26,26,31,0.06)', borderRadius: 10, padding: '8px 14px', fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', fontSize: 17, fontWeight: 600 }}>19:30</div>
          </div>
        </S3Fe>
      </div>

      <div style={{ position: 'absolute', bottom: 26, left: 18, right: 18 }}>
        <div style={s3CTA}>C'est parti</div>
      </div>
    </S3Shell>
  );
}

// ═══════════ D · DUO FORMÉ — l'autre a accepté ═══════════
function DuoFormeV3() {
  return (
    <S3Shell intensity="strong">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 26px 0', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 19 }}>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#7DB3D5', color: '#fff', fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #FAFAF7', boxShadow: 'none' }}>V</div>
          <div style={{ margin: '0 -4px', zIndex: 2 }}><S3Mochi size={84} mood="happy"></S3Mochi></div>
          <div style={{ width: 62, height: 62, borderRadius: '50%', background: '#B8A5D9', color: '#fff', fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #FAFAF7', boxShadow: 'none' }}>J</div>
        </div>
        <div style={{ marginBottom: 11 }}><S3Pill color="#4F7A57">DUO FORMÉ</S3Pill></div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.08 }}>Jeanne a rejoint<br></br>le duo.</div>
        <div style={{ fontSize: 14.5, color: '#8A857C', fontWeight: 400, marginTop: 10, lineHeight: 1.5, maxWidth: 240 }}>Elle remplit ses dispos et ses préférences de son côté. Prochaine étape : choisir vos tâches ensemble.</div>
      </div>
      <div style={{ position: 'absolute', bottom: 26, left: 18, right: 18 }}>
        <div style={s3CTA}>Choisir nos tâches</div>
      </div>
    </S3Shell>
  );
}

Object.assign(window, { SetupIdentiteV3, SetupDisposV3, SetupPrefsV3, DuoFormeV3 });
