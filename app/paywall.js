// Écran 37 · Paywall Mochi+ v4 (10 nov 2026, Jeanne : « un truc dans ce type de principe » → BellySafe).
// Pass 1 an en paiement unique (recommandé) à côté du mensuel renouvelable ; avantages en frise.
// Règles Store (CLAUDE.md) : divulgation complète AU-DESSUS du CTA, prix storefront via getOffers()
// (jamais un chiffre inventé en réel), Restaurer · Confidentialité · Conditions.
// `?next=` : paywall doux après la création du foyer (fermer ou acheter → va à `next`).
// `?demo=1` (dev uniquement) : prix d'exemple pour les captures, aucun achat possible.
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, Linking, Image, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { CTAPrimary } from '../src/components/ui';
import { Burst } from '../src/components/motion';
import { Scene } from '../src/components/mochi/scene';
import { LEGAL_URLS } from '../src/components/premium/extra';
import { getOffers, purchase, restore } from '../src/purchases';
import { useTokens, type, layout } from '../src/theme-v3';
import copy from '../src/data/copy.json';

const t = copy.paywall;
const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const ICONS = { gift: require('../assets/icones/gift.png'), calendar: require('../assets/icones/calendar.png'), coins: require('../assets/icones/coins.png'), ring: require('../assets/icones/ring.png') };
const DEMO_OFFERS = [{ id: 'pass', priceString: '49,99 €', price: 49.99, currencyCode: 'EUR' }, { id: 'monthly', priceString: '14,99 €', price: 14.99, currencyCode: 'EUR' }];
const money = (v, cur) => { try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur }).format(v); } catch (e) { return null; } };

// carte d'offre : bordure pleine quand choisie, pastille au-dessus pour la recommandée
function Offer({ T, on, name, price, hint, badge, ribbon, onPress }) {
  const sc = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Pressable style={{ flex: 1 }} onPress={() => { sc.value = withSequence(withTiming(0.97, { duration: 70 }), withSpring(1, { damping: 10, stiffness: 300 })); onPress(); }}>
      <Animated.View style={[s.offer, { borderColor: on ? T.ink : T.line, backgroundColor: on ? T.bg : 'transparent' }, st]}>
        {badge ? <View style={[s.badge, { backgroundColor: T.scene.lamp }]}><Text style={{ fontSize: 11.5, fontWeight: '700', color: T.ink }}>{badge}</Text></View> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: on ? T.ink : T.muted, alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: T.ink }} /> : null}</View>
          {ribbon ? <Text style={{ fontSize: 12, fontWeight: '600', color: T.ink, opacity: 0.75 }}>{ribbon}</Text> : null}
        </View>
        <Text style={[type.body, { color: T.ink, fontWeight: '700', marginTop: 8 }]}>{name}</Text>
        <Text style={{ fontSize: 14, color: T.ink, marginTop: 4, fontVariant: ['tabular-nums'] }}>{price}</Text>
        {hint ? <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{hint}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

// B : quatre tuiles d'avantages (icône feutre en grand)
function Tiles({ T, X }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: X, marginTop: 16 }}>
      {t.tiles.map(b => (
        <View key={b.t} style={{ width: '48%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 16, backgroundColor: 'rgba(31,42,88,0.05)' }}>
          <Image source={ICONS[b.icon]} style={{ width: 34, height: 34 }} />
          <Text style={{ fontSize: 14.5, fontWeight: '600', color: T.ink, flex: 1 }}>{b.t}</Text>
        </View>
      ))}
    </View>
  );
}
// B : offre en ligne pleine largeur
function Row({ T, on, name, sub, price, badge, onPress }) {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: on ? T.ink : T.line, borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16, backgroundColor: on ? T.bg : 'transparent' }}>
      <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: on ? T.ink : T.muted, alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: T.ink }} /> : null}</View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: T.ink }}>{name}</Text>
          {badge ? <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: T.scene.lamp }}><Text style={{ fontSize: 11.5, fontWeight: '700', color: T.ink }}>{badge}</Text></View> : null}
        </View>
        <Text style={{ fontSize: 12.5, color: T.muted, marginTop: 2 }}>{sub}</Text>
      </View>
      <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink, fontVariant: ['tabular-nums'] }}>{price}</Text>
    </Pressable>
  );
}
// C : comparatif gratuit / Mochi+
function Compare({ T, X }) {
  const cell = { width: 74, alignItems: 'center' };
  const mark = on => <Text style={{ fontSize: 17, fontWeight: '700', color: on ? T.ok : T.muted, opacity: on ? 1 : 0.5 }}>{on ? '✓' : '–'}</Text>;
  return (
    <View style={{ marginHorizontal: X, marginTop: 16, borderRadius: 18, borderWidth: 1, borderColor: T.line, overflow: 'hidden' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 14, backgroundColor: 'rgba(31,42,88,0.05)' }}>
        <View style={{ flex: 1 }} />
        <View style={cell}><Text style={{ fontSize: 12.5, fontWeight: '600', color: T.muted }}>{t.compareFree}</Text></View>
        <View style={[cell, { backgroundColor: T.ink, borderRadius: 999, paddingVertical: 3 }]}><Text style={{ fontSize: 12.5, fontWeight: '700', color: T.bg }}>{t.comparePlus}</Text></View>
      </View>
      {t.compare.map(([label, free]) => (
        <View key={label} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 14, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          <Text style={{ flex: 1, fontSize: 14, color: T.ink }}>{label}</Text>
          <View style={cell}>{mark(free)}</View>
          <View style={cell}>{mark(true)}</View>
        </View>
      ))}
    </View>
  );
}

export default function Paywall() {
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const { next, demo, v } = useLocalSearchParams();
  const V = __DEV__ && v ? String(v) : 'A'; // propositions du 10 nov 2026 : A frise · B Mochi en héros · C comparatif
  const [offers, setOffers] = useState(null);
  const [plan, setPlan] = useState('pass');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [burst, setBurst] = useState(false);
  useEffect(() => { if (__DEV__ && demo) { setOffers(DEMO_OFFERS); return; } getOffers().then(o => setOffers(o)).catch(() => {}); }, []);

  const pass = offers?.find(o => o.id === 'pass'), monthly = offers?.find(o => o.id === 'monthly');
  const current = plan === 'pass' ? pass : monthly;
  const saving = pass?.price && monthly?.price ? Math.round((1 - pass.price / (12 * monthly.price)) * 100) : 0;
  const perMonth = pass?.price ? money(pass.price / 12, pass.currencyCode) : null;
  const disclosure = !current ? t.disclosureNoPrice : plan === 'pass' ? fill(t.disclosurePass, { price: current.priceString }) : fill(t.disclosureMonth, { price: current.priceString });

  const leave = () => { if (next) router.replace(String(next)); else router.back(); };
  const onBuy = async () => {
    if (__DEV__ && demo) return;
    setBusy(true); setMsg(null);
    const r = await purchase(plan);
    setBusy(false);
    if (r.success) { setBurst(true); Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); setTimeout(leave, 900); }
    else if (!r.cancelled) setMsg(t.error);
  };
  const onRestore = async () => {
    setBusy(true); setMsg(null);
    const r = await restore();
    setBusy(false);
    if (r.success) { setMsg(t.restored); setTimeout(leave, 600); } else setMsg(t.restoreNone);
  };
  const open = url => { if (url) Linking.openURL(url).catch(() => {}); };
  const { height: SH } = useWindowDimensions();
  const sceneH = V === 'B' ? Math.max(160 + insets.top, SH - 560) : V === 'C' ? 210 + insets.top : Math.max(120 + insets.top, SH - 620); // tient sur un écran
  const X = layout.x;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(8, insets.bottom) }} showsVerticalScrollIndicator={false} bounces={false}>
        <View>
          <Scene T={T} stage="mochi" mood={burst ? 'wink' : 'happy'} lvl={4} height={sceneH} items={['montgolfiere', 'piano']} outfit="couronne" />
          {burst ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: sceneH }}><Burst count={18} colors={[T.accent, T.ok, T.scene.lamp, T.ink]} dist={150} /></View> : null}
          <View style={{ position: 'absolute', top: insets.top + 8, left: X, right: X, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Pressable onPress={leave} hitSlop={12} accessibilityLabel={next ? t.soft : t.close} style={s.chip}><Text style={[type.label, { color: T.ink }]}>{next ? t.soft : '×'}</Text></Pressable>
            <Pressable onPress={onRestore} disabled={busy} hitSlop={12} style={s.chip}><Text style={[type.label, { color: T.ink }]}>{t.restore}</Text></Pressable>
          </View>
        </View>

        <Animated.View entering={FadeInDown.delay(100).duration(320)} style={{ paddingHorizontal: X, paddingTop: 14 }}>
          <Text style={{ fontSize: 28, lineHeight: 32, fontWeight: '700', letterSpacing: -0.8, color: T.ink, textAlign: 'center' }}>{V === 'B' ? t.headlineB : V === 'C' ? t.headlineC : t.headline}</Text>
        </Animated.View>

        {V === 'B' ? <Tiles T={T} X={X} /> : V === 'C' ? <Compare T={T} X={X} /> : <>
        {/* avantages en frise : une icône feutre par ligne, un trait qui les relie */}
        <View style={{ paddingHorizontal: X + 4, marginTop: 14 }}>
          <View style={{ position: 'absolute', left: X + 4 + 17, top: 20, bottom: 20, width: 2, backgroundColor: T.line }} />
          {t.benefits.map((b, i) => (
            <Animated.View key={b.t} entering={FadeInDown.delay(180 + i * 60).duration(300)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 5 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' }}><Image source={ICONS[b.icon]} style={{ width: 30, height: 30 }} /></View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: T.ink }}>{b.t}</Text>
                <Text style={{ fontSize: 13, color: T.muted, marginTop: 1 }}>{b.s}</Text>
              </View>
            </Animated.View>
          ))}
        </View>

        </>}

        {V === 'B' ? (
          <View style={{ paddingHorizontal: X, marginTop: 18, gap: 10 }}>
            <Row T={T} on={plan === 'pass'} onPress={() => setPlan('pass')} name={t.passName} sub={perMonth ? fill(t.passHint, { price: perMonth }) : t.underPass} price={pass ? pass.priceString : t.priceUnavailable} badge={saving > 0 ? fill(t.passBadge, { n: saving }) : null} />
            <Row T={T} on={plan === 'monthly'} onPress={() => setPlan('monthly')} name={t.monthName} sub={t.monthHint} price={monthly ? fill(t.monthPrice, { price: monthly.priceString }) : t.priceUnavailable} />
          </View>
        ) : <>
        <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: X, marginTop: 22 }}>
          <Offer T={T} on={plan === 'pass'} onPress={() => setPlan('pass')} ribbon={t.recommended} badge={saving > 0 ? fill(t.passBadge, { n: saving }) : null}
            name={t.passName} price={pass ? fill(t.passPrice, { price: pass.priceString }) : t.priceUnavailable} hint={perMonth ? fill(t.passHint, { price: perMonth }) : null} />
          <Offer T={T} on={plan === 'monthly'} onPress={() => setPlan('monthly')}
            name={t.monthName} price={monthly ? fill(t.monthPrice, { price: monthly.priceString }) : t.priceUnavailable} hint={t.monthHint} />
        </View>

        </>}
        {/* divulgation complète AU-DESSUS du CTA (Apple 3.1.2) */}
        <Text style={{ fontSize: 11.5, lineHeight: 15, color: T.muted, paddingHorizontal: X, marginTop: 12, textAlign: 'center' }}>{disclosure}</Text>
        <View style={{ paddingHorizontal: X, marginTop: 10 }}>
          <CTAPrimary big label={busy ? t.buying : t.cta} onPress={onBuy} disabled={busy} />
          {msg ? <Text style={[type.label, { color: T.accent, textAlign: 'center', marginTop: 8 }]}>{msg}</Text> : null}
          <Text style={{ fontSize: 12.5, color: T.muted, textAlign: 'center', marginTop: 8 }}>{plan === 'pass' ? t.underPass : t.underMonth}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 18, marginTop: 6 }}>
            <Pressable onPress={() => open(LEGAL_URLS.privacy)} hitSlop={8}><Text style={{ fontSize: 12.5, color: T.muted, textDecorationLine: 'underline' }}>{t.privacy}</Text></Pressable>
            <Pressable onPress={() => open(LEGAL_URLS.eula)} hitSlop={8}><Text style={{ fontSize: 12.5, color: T.muted, textDecorationLine: 'underline' }}>{t.terms}</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  offer: { borderWidth: 1.5, borderRadius: 18, paddingHorizontal: 14, paddingTop: 16, paddingBottom: 14, minHeight: 128 },
  badge: { position: 'absolute', top: -11, alignSelf: 'center', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 },
  chip: { minWidth: 32, height: 32, paddingHorizontal: 10, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(245,241,234,0.9)' },
});
