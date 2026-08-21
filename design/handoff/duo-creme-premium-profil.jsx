// DNA Crème · Premium (Calendrier mois, Analyse charge mentale, Paywall) + Profil
// Réutilise IridShell, FrameEmbossed, PillLabel, MochiIridescent, IridTabBarV2

const { FrameEmbossed: PFes, PillLabel: PPill, MochiIridescent: PMochi, IridShell: PShell2, IridTabBarV2: PTb2 } = window;

// ═══════════ CALENDRIER MOIS (DUO+) ═══════════
function CalendrierMoisCreme() {
  const dows = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  // avril : 30 jours, commence un lundi (fictif)
  const cells = Array.from({ length: 35 }, (_, i) => {
    const d = i + 1;
    if (d > 30) return null;
    return {
      d,
      dots: d % 7 === 0 ? [] : d % 3 === 0 ? ['#7DB3D5', '#B8A5D9'] : d % 2 === 0 ? ['#7DB3D5'] : ['#B8A5D9'],
      missed: d === 9,
      today: d === 28,
    };
  });
  return (
    <PShell2 intensity="soft">
      <div style={{ padding: '14px 23px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11, position: 'relative' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <PPill color="#F5C76E">DUO+</PPill>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1 }}>Avril</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>‹</div>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>›</div>
        </div>
      </div>

      <div style={{ padding: '0 18px', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, marginBottom: 6 }}>
          {dows.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10.5, letterSpacing: 1, color: '#8A857C', fontWeight: 600 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {cells.map((c, i) => c ? (
            <div key={i} style={{
              height: 44, borderRadius: 10, position: 'relative',
              background: c.today ? '#1A1A1F' : '#FFFCF5',
              color: c.today ? '#FFFCF5' : '#1A1A1F',
              boxShadow: c.today ? '0 6px 14px rgba(26,26,31,0.28)' : '0 0 0 1px rgba(26,26,31,0.05)',
              border: c.missed ? '1.5px solid #E97A6A' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{c.d}</span>
              <span style={{ display: 'flex', gap: 5 }}>
                {c.dots.map((dc, j) => <span key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: c.today ? '#FBE49A' : dc }}></span>)}
              </span>
            </div>
          ) : <div key={i}></div>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, margin: '10px 0 12px', fontSize: 12, fontWeight: 500, color: '#8A857C' }}>
          <span><span style={{ color: '#7DB3D5' }}>●</span> Valentin</span>
          <span><span style={{ color: '#B8A5D9' }}>●</span> Jeanne</span>
          <span><span style={{ color: '#E97A6A' }}>◻</span> jour raté</span>
        </div>
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <PFes padding="13px 16px" radius={16}>
          <div style={{ fontSize: 11.5, letterSpacing: 1.4, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase' }}>DIM 28 · AUJOURD'HUI</div>
          {[
            { e: '🍽', l: 'Vaisselle du soir · 20h', who: 'V', c: '#7DB3D5' },
            { e: '🧺', l: 'Lessive blanc · 18h', who: 'J', c: '#B8A5D9' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i > 0 ? '1px solid rgba(26,26,31,0.06)' : 'none' }}>
              <span style={{ fontSize: 17 }}>{t.e}</span>
              <div style={{ flex: 1, fontSize: 14.5, fontWeight: 500 }}>{t.l}</div>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: t.c, color: '#fff', fontSize: 11.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.who}</div>
            </div>
          ))}
        </PFes>
      </div>

      <PTb2 active="balance"></PTb2>
    </PShell2>
  );
}

// ═══════════ ANALYSE CHARGE MENTALE (DUO+) ═══════════
function AnalyseChargeCreme() {
  return (
    <PShell2 intensity="soft">
      <div style={{ padding: '14px 23px 0', marginBottom: 11, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <PPill color="#B8A5D9">CHARGE MENTALE</PPill>
          <PPill color="#F5C76E">DUO+</PPill>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.1, lineHeight: 1.05 }}>L'invisible pèse<br></br>sur Jeanne.</div>
      </div>

      <div style={{ padding: '0 22px', marginBottom: 11, position: 'relative' }}>
        <PFes padding="17px 18px" radius={18}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9, fontSize: 13.5, fontWeight: 600 }}>
            <span style={{ color: '#7DB3D5' }}>Valentin · 36%</span>
            <span style={{ color: '#9A7BC8' }}>Jeanne · 64%</span>
          </div>
          <div style={{ height: 10, background: 'rgba(26,26,31,0.06)', borderRadius: 5, overflow: 'hidden', display: 'flex', marginBottom: 10 }}>
            <div style={{ width: '36%', background: '#7DB3D5' }}></div>
            <div style={{ width: '64%', background: '#B8A5D9' }}></div>
          </div>
          <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400 }}>Les tâches mentales comptent ×1,5 — RDV, paiements, anniversaires, décisions.</div>
        </PFes>
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase', position: 'relative' }}>QUI PORTE QUOI</div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 11, position: 'relative' }}>
        {[
          { e: '🩺', l: 'RDV médicaux', who: 'Jeanne', v: 80, c: '#B8A5D9' },
          { e: '🎁', l: 'Cadeaux & anniversaires', who: 'Jeanne', v: 90, c: '#B8A5D9' },
          { e: '💳', l: 'Paiements & factures', who: 'Valentin', v: 70, c: '#7DB3D5' },
          { e: '🏫', l: 'École & activités', who: 'Jeanne', v: 60, c: '#B8A5D9' },
        ].map((r, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 19 }}>{r.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{r.l}</div>
              <div style={{ height: 4, background: 'rgba(26,26,31,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${r.v}%`, height: '100%', background: r.c }}></div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: r.c === '#B8A5D9' ? '#9A7BC8' : '#4C7FA3' }}>{r.who}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 22px', position: 'relative' }}>
        <PFes padding="13px 16px" radius={16} style={{ border: '1.5px solid #9FC9A8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 21 }}>✨</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Mochi suggère</div>
              <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>Transférer « RDV médicaux » à Valentin → 52/48 mental</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4F7A57' }}>Appliquer</div>
          </div>
        </PFes>
      </div>

      <PTb2 active="balance"></PTb2>
    </PShell2>
  );
}

// ═══════════ PAYWALL DUO+ ═══════════
function PaywallCreme() {
  return (
    <PShell2 intensity="strong">
      <div style={{ padding: '14px 23px 0', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFCF5', boxShadow: '0 0 0 1px rgba(26,26,31,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>×</div>
      </div>

      <div style={{ textAlign: 'center', position: 'relative', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <PMochi size={104} mood="happy"></PMochi>
        </div>
        <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -1.2, lineHeight: 1.05 }}>Duo+</div>
        <div style={{ fontSize: 14.5, color: '#8A857C', fontWeight: 400, marginTop: 6 }}>Tout l'équilibre, sans limites.</div>
      </div>

      <div style={{ padding: '0 26px', display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14, position: 'relative' }}>
        {[
          'Calendrier vue mois',
          'Analyse charge mentale détaillée',
          'Wrapped illimité + export PDF',
          'Tricount illimité · multi-sessions',
          'Pense-bête partagé · mood check-in',
        ].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, fontWeight: 500 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#C9E0C5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-6" stroke="#1A1A1F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"></path></svg>
            </span>
            {f}
          </div>
        ))}
      </div>

      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 8, position: 'relative' }}>
        <PFes padding="14px 16px" radius={16} style={{ border: '1.5px solid #9FC9A8', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -9, left: 14 }}><PPill color="#4F7A57">2 MOIS OFFERTS</PPill></div>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 500, marginTop: 4 }}>Annuel</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.8, marginTop: 3 }}>35 €<span style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}> /an</span></div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400 }}>soit 2,92 €/mois</div>
        </PFes>
        <PFes padding="14px 16px" radius={16}>
          <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 500, marginTop: 4 }}>Mensuel</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.8, marginTop: 3 }}>4 €<span style={{ fontSize: 14, fontWeight: 500, color: '#8A857C' }}> /mois</span></div>
          <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400 }}>sans engagement</div>
        </PFes>
      </div>

      <div style={{ position: 'absolute', bottom: 26, left: 18, right: 18, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        <div style={{ alignSelf: 'stretch', background: 'linear-gradient(135deg, #FFF1E0 0%, #FBC9A4 40%, #F5A89A 100%)', borderRadius: 14, padding: '17px 20px', textAlign: 'center', fontSize: 16, fontWeight: 600, boxShadow: '0 1px 2px rgba(26,26,31,0.06)' }}>
          Essayer 7 jours gratuits
        </div>
        <div style={{ fontSize: 13, color: '#8A857C', fontWeight: 400 }}>Annulable à tout moment · partagé à deux</div>
      </div>
    </PShell2>
  );
}

// ═══════════ PROFIL & SETTINGS ═══════════
function ProfilCreme() {
  return (
    <PShell2 intensity="soft">
      <div style={{ padding: '19px 23px 0', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
        <div style={{ width: 58, height: 58, borderRadius: '50%', background: '#7DB3D5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, color: '#fff', boxShadow: 'none' }}>V</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.6 }}>Valentin</div>
          <div style={{ fontSize: 13.5, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>En duo avec <span style={{ color: '#9A7BC8', fontWeight: 600 }}>Jeanne</span> · depuis 92 jours</div>
        </div>
        <PPill color="#F5C76E">DUO+</PPill>
      </div>

      <div style={{ padding: '0 22px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16, position: 'relative' }}>
        {[
          { k: 'Streak', v: '12 j' },
          { k: 'Tâches', v: '148' },
          { k: 'Équilibre', v: '51%' },
        ].map(s => (
          <PFes key={s.k} padding="13px 13px" radius={14}>
            <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: '#8A857C', fontWeight: 500, marginBottom: 6, textTransform: 'uppercase' }}>{s.k}</div>
            <div style={{ fontSize: 21, fontWeight: 600, letterSpacing: -0.6 }}>{s.v}</div>
          </PFes>
        ))}
      </div>

      <div style={{ padding: '0 22px', fontSize: 11.5, letterSpacing: 1.5, color: '#8A857C', fontWeight: 600, marginBottom: 9, textTransform: 'uppercase', position: 'relative' }}>RÉGLAGES</div>
      <div style={{ padding: '0 22px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
        {[
          { e: '🔔', l: 'Notifications', s: 'Rappels 30 min avant' },
          { e: '🗓', l: 'Mes disponibilités', s: 'Soirs + week-end' },
          { e: '🎯', l: 'Malus customs', s: '4 gages définis' },
          { e: '💳', l: 'Abonnement Duo+', s: 'Annuel · renouvelé le 3 sept' },
          { e: '⬇️', l: 'Exporter mes données', s: 'PDF ou CSV' },
        ].map((r, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', border: '0.5px solid rgba(26,26,31,0.06)', borderRadius: 14, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 13 }}>
            <span style={{ fontSize: 18 }}>{r.e}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15.5, fontWeight: 500 }}>{r.l}</div>
              <div style={{ fontSize: 12, color: '#8A857C', fontWeight: 400, marginTop: 3 }}>{r.s}</div>
            </div>
            <div style={{ fontSize: 16, color: '#8A857C' }}>›</div>
          </div>
        ))}
        <div style={{ textAlign: 'center', fontSize: 14.5, fontWeight: 600, color: '#C75744', padding: '10px 0' }}>Se déconnecter</div>
      </div>

      <PTb2 active="profile"></PTb2>
    </PShell2>
  );
}

Object.assign(window, { CalendrierMoisCreme, AnalyseChargeCreme, PaywallCreme, ProfilCreme });
