// Trois mises en page du paywall Mochi+ (propositions du 10 nov 2026, Jeanne : « que visuellement elles diffèrent »).
// A · carte douce (dégradé rose, carte, Mochi couronné qui dépasse) · B · nuit étoilée · C · sticker feutre + comparatif.
// Les données (offres, divulgation, actions) viennent de app/paywall.js : seule l'apparence change ici.
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CTAPrimary } from '../ui';
import copy from '../../data/copy.json';

const t = copy.paywall;
const INK = '#1F2A58', CREAM = '#F5F1EA', NIGHT = '#2E2140', CORAL = '#E05A50', BUTTER = '#F7DFA8';
const ICONS = { list: require('../../../assets/icones/list.png'), gift: require('../../../assets/icones/gift.png'), calendar: require('../../../assets/icones/calendar.png'), coins: require('../../../assets/icones/coins.png'), ring: require('../../../assets/icones/ring.png') };
const MOCHI = require('../../../assets/splash/mochi-happy.png');
const CROWN = require('../../../assets/boutique/couronne.png');
const FELT = require('../../../assets/splash/feutre.jpg');

// Mochi couronné (image de l'app + couronne de la boutique posée sur le crâne)
export function CrownedMochi({ w }) {
  const h = w * 828 / 1024;
  return (
    <View style={{ width: w, height: h + w * 0.2 }}>
      <Image source={MOCHI} style={{ position: 'absolute', bottom: 0, width: w, height: h }} />
      <Image source={CROWN} style={{ position: 'absolute', top: 0, left: w * 0.33, width: w * 0.34, height: w * 0.3 }} resizeMode="contain" />
    </View>
  );
}

function Radio({ on, c }) { return <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: c, alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c }} /> : null}</View>; }

// offres côte à côte (A et C)
function SideOffers({ d, ink = INK, muted = '#6E7591', line = 'rgba(31,42,88,0.16)', cardBg = '#FFFFFF' }) {
  const box = on => ({ flex: 1, borderWidth: 1.5, borderColor: on ? ink : line, borderRadius: 18, padding: 14, paddingTop: 16, minHeight: 124, backgroundColor: on ? cardBg : 'transparent' });
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Pressable style={box(d.plan === 'pass')} onPress={() => d.setPlan('pass')}>
        {d.badge ? <View style={[s.badge, { backgroundColor: BUTTER }]}><Text style={s.badgeTxt}>{d.badge}</Text></View> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Radio on={d.plan === 'pass'} c={ink} /><Text style={{ fontSize: 12, fontWeight: '600', color: ink, opacity: 0.75 }}>{t.recommended}</Text></View>
        <Text style={{ fontSize: 16, fontWeight: '700', color: ink, marginTop: 8 }}>{t.passName}</Text>
        <Text style={{ fontSize: 14, color: ink, marginTop: 4 }}>{d.passPrice}</Text>
        {d.passHint ? <Text style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>{d.passHint}</Text> : null}
      </Pressable>
      <Pressable style={box(d.plan === 'monthly')} onPress={() => d.setPlan('monthly')}>
        <Radio on={d.plan === 'monthly'} c={ink} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: ink, marginTop: 8 }}>{t.monthName}</Text>
        <Text style={{ fontSize: 14, color: ink, marginTop: 4 }}>{d.monthPrice}</Text>
        <Text style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>{t.monthHint}</Text>
      </Pressable>
    </View>
  );
}
// pied commun : divulgation AU-DESSUS du CTA, CTA, mentions, liens
function Footer({ d, ink = INK, muted = '#6E7591' }) {
  return (
    <View>
      <Text style={{ fontSize: 11.5, lineHeight: 15, color: muted, marginTop: 12, textAlign: 'center' }}>{d.disclosure}</Text>
      <View style={{ marginTop: 10 }}><CTAPrimary big label={d.ctaLabel} onPress={d.onBuy} disabled={d.busy} /></View>
      {d.msg ? <Text style={{ fontSize: 13, color: CORAL, textAlign: 'center', marginTop: 8 }}>{d.msg}</Text> : null}
      <Text style={{ fontSize: 12.5, color: muted, textAlign: 'center', marginTop: 8 }}>{d.under}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 6 }}>
        <Pressable onPress={d.openPrivacy} hitSlop={8}><Text style={{ fontSize: 12.5, color: muted, textDecorationLine: 'underline' }}>{t.privacy}</Text></Pressable>
        <Pressable onPress={d.openTerms} hitSlop={8}><Text style={{ fontSize: 12.5, color: muted, textDecorationLine: 'underline' }}>{t.terms}</Text></Pressable>
      </View>
    </View>
  );
}
function TopBar({ d, color = INK, bg = 'rgba(255,255,255,0.7)' }) {
  return (
    <View style={{ position: 'absolute', top: d.insets.top + 8, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', zIndex: 5 }}>
      <Pressable onPress={d.leave} hitSlop={12} style={[s.chip, { backgroundColor: bg }]}><Text style={{ fontSize: 14, fontWeight: '600', color }}>{d.next ? t.soft : '×'}</Text></Pressable>
      <Pressable onPress={d.onRestore} hitSlop={12} style={[s.chip, { backgroundColor: bg }]}><Text style={{ fontSize: 14, fontWeight: '600', color }}>{t.restore}</Text></Pressable>
    </View>
  );
}

// ── A · carte douce ─────────────────────────────────────────────────────────────
export function LayoutA({ d }) {
  return (
    <LinearGradient colors={['#F4CEC7', '#F3E3EE', CREAM]} locations={[0, 0.45, 1]} style={{ flex: 1 }}>
      <TopBar d={d} />
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: d.insets.bottom + 6 }}>
        <View style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 30, paddingHorizontal: 18, paddingBottom: 14, paddingTop: 70 }}>
          <View style={{ position: 'absolute', top: -100, alignSelf: 'center' }}><CrownedMochi w={150} /></View>
          <Text style={{ fontSize: 26, lineHeight: 30, fontWeight: '700', letterSpacing: -0.7, color: INK, textAlign: 'center' }}>{t.headline}</Text>
          <View style={{ marginTop: 14 }}>
            <View style={{ position: 'absolute', left: 17, top: 20, bottom: 20, width: 2, backgroundColor: 'rgba(31,42,88,0.12)' }} />
            {t.benefits.map(b => (
              <View key={b.t} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}><Image source={ICONS[b.icon]} style={{ width: 30, height: 30 }} /></View>
                <View style={{ flex: 1 }}><Text style={{ fontSize: 15, fontWeight: '600', color: INK }}>{b.t}</Text><Text style={{ fontSize: 12.5, color: '#6E7591', marginTop: 1 }}>{b.s}</Text></View>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 18 }}><SideOffers d={d} /></View>
          <Footer d={d} />
        </View>
      </View>
    </LinearGradient>
  );
}

// ── B · nuit étoilée ────────────────────────────────────────────────────────────
const STARS = [[0.08, 0.06, 3], [0.22, 0.14, 2], [0.85, 0.08, 3], [0.7, 0.18, 2], [0.12, 0.28, 2], [0.92, 0.3, 3], [0.4, 0.04, 2], [0.6, 0.11, 3], [0.3, 0.22, 2], [0.78, 0.25, 2]];
export function LayoutB({ d }) {
  const { width: W, height: H } = useWindowDimensions();
  const ink = CREAM, muted = '#B9AECB', line = 'rgba(245,241,234,0.22)';
  return (
    <View style={{ flex: 1, backgroundColor: NIGHT }}>
      <LinearGradient colors={['#1F2A58', NIGHT]} style={StyleSheet.absoluteFill} />
      {STARS.map(([x, y, r], i) => <View key={i} style={{ position: 'absolute', left: x * W, top: y * H, width: r * 2, height: r * 2, borderRadius: r, backgroundColor: BUTTER, opacity: 0.9 }} />)}
      <TopBar d={d} color={CREAM} bg="rgba(245,241,234,0.12)" />
      <View style={{ alignItems: 'center', marginTop: d.insets.top + 60 }}>
        <View style={{ position: 'absolute', top: 30, width: 190, height: 190, borderRadius: 95, backgroundColor: BUTTER, opacity: 0.12 }} />
        <CrownedMochi w={190} />
        <Text style={{ fontSize: 28, lineHeight: 32, fontWeight: '700', letterSpacing: -0.8, color: CREAM, textAlign: 'center', marginTop: 22 }}>{t.headlineB}</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginTop: 18 }}>
        {t.tiles.map(b => (
          <View key={b.t} style={{ width: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: 'rgba(245,241,234,0.08)', borderWidth: 1, borderColor: line }}>
            <Image source={ICONS[b.icon]} style={{ width: 32, height: 32 }} /><Text style={{ fontSize: 14.5, fontWeight: '600', color: CREAM, flex: 1 }}>{b.t}</Text>
          </View>
        ))}
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 16, gap: 10 }}>
        {[['pass', t.passName, d.passHint || t.underPass, d.passOnly, d.badge], ['monthly', t.monthName, t.monthHint, d.monthPrice, null]].map(([id, name, sub, price, badge]) => (
          <Pressable key={id} onPress={() => d.setPlan(id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: d.plan === id ? BUTTER : line, borderRadius: 18, paddingVertical: 13, paddingHorizontal: 16, backgroundColor: d.plan === id ? 'rgba(247,223,168,0.10)' : 'transparent' }}>
            <Radio on={d.plan === id} c={d.plan === id ? BUTTER : muted} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text style={{ fontSize: 16, fontWeight: '700', color: CREAM }}>{name}</Text>{badge ? <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: BUTTER }}><Text style={s.badgeTxt}>{badge}</Text></View> : null}</View>
              <Text style={{ fontSize: 12.5, color: muted, marginTop: 2 }}>{sub}</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '600', color: CREAM }}>{price}</Text>
          </Pressable>
        ))}
      </View>
      <View style={{ paddingHorizontal: 20 }}><Footer d={d} ink={ink} muted={muted} /></View>
    </View>
  );
}

// ── C · sticker feutre + comparatif ─────────────────────────────────────────────
// texte « sticker » : contour blanc simulé par des copies décalées, comme le sticker des captures App Store
function StickerText({ children, size }) {
  const offs = [[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, 3], [-3, 3], [3, -3]];
  const st = { fontSize: size, fontWeight: '900', letterSpacing: -1.5 };
  return (
    <View style={{ transform: [{ rotate: '-4deg' }] }}>
      {offs.map(([x, y], i) => <Text key={i} style={[st, { position: 'absolute', left: x, top: y, color: '#FFFFFF' }]}>{children}</Text>)}
      <Text style={[st, { color: INK, textShadowColor: 'rgba(60,35,30,0.25)', textShadowOffset: { width: 0, height: 6 }, textShadowRadius: 10 }]}>{children}</Text>
    </View>
  );
}
export function LayoutC({ d }) {
  const { width: W } = useWindowDimensions();
  const cell = { width: 70, alignItems: 'center' };
  const mark = on => <Text style={{ fontSize: 17, fontWeight: '700', color: on ? '#6F9A2E' : '#6E7591', opacity: on ? 1 : 0.5 }}>{on ? '✓' : '–'}</Text>;
  return (
    <View style={{ flex: 1, backgroundColor: '#F3EADF' }}>
      <Image source={FELT} style={[StyleSheet.absoluteFill, { opacity: 0.5, width: '100%', height: '100%' }]} resizeMode="cover" />
      <View style={{ position: 'absolute', right: -W * 0.18, top: d.insets.top + 30, transform: [{ rotate: '-10deg' }] }}><CrownedMochi w={W * 0.55} /></View>
      <TopBar d={d} />
      <View style={{ marginTop: d.insets.top + 80, paddingHorizontal: 22 }}>
        <StickerText size={64}>Mochi+</StickerText>
        <Text style={{ fontSize: 19, lineHeight: 25, fontWeight: '600', color: INK, marginTop: 14, maxWidth: W * 0.62 }}>{t.headlineC}</Text>
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 18, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.85)', overflow: 'hidden' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14 }}>
          <View style={{ flex: 1 }} />
          <View style={cell}><Text style={{ fontSize: 12.5, fontWeight: '600', color: '#6E7591' }}>{t.compareFree}</Text></View>
          <View style={[cell, { backgroundColor: INK, borderRadius: 999, paddingVertical: 3 }]}><Text style={{ fontSize: 12.5, fontWeight: '700', color: CREAM }}>{t.comparePlus}</Text></View>
        </View>
        {t.compare.map(([label, free]) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderTopWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(31,42,88,0.14)' }}>
            <Text style={{ flex: 1, fontSize: 14, color: INK }}>{label}</Text><View style={cell}>{mark(free)}</View><View style={cell}>{mark(true)}</View>
          </View>
        ))}
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 18 }}><SideOffers d={d} cardBg="rgba(255,255,255,0.9)" /></View>
      <View style={{ paddingHorizontal: 20 }}><Footer d={d} /></View>
    </View>
  );
}

const s = StyleSheet.create({
  badge: { position: 'absolute', top: -11, alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  badgeTxt: { fontSize: 11.5, fontWeight: '700', color: INK },
  chip: { minWidth: 32, height: 32, paddingHorizontal: 10, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
