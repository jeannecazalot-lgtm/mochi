// Écran 37 · Paywall Mochi+ (v3, 4 nov 2026). Recette : docs/recettes/37-paywall.md + da-v2-mochi-eleve.md
// Règles Store (CLAUDE.md) : divulgation complète AU-DESSUS du CTA, prix storefront
// via getOffers() (jamais un chiffre inventé), Restore · Privacy · Terms sous le CTA.
// `?next=` : paywall doux montré après l'onboarding (fermer ou acheter → va à `next`).
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Pressable, Linking, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { CTAPrimary } from '../src/components/ui';
import { Burst } from '../src/components/motion';
import { Scene } from '../src/components/mochi/scene';
import { Label, Num, Hair } from '../src/components/mochi/gauges';
import { LEGAL_URLS } from '../src/components/premium/extra';
import { getOffers, purchase, restore } from '../src/purchases';
import { useTokens, type, layout } from '../src/theme-v3';
import copy from '../src/data/copy.json';

const t = copy.paywall;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// essai gratuit annoncé par le storefront (RevenueCat : product.introPrice, price 0) → « {n} jours »
function trialOf(offer) {
  const ip = offer?.pkg?.product?.introPrice;
  if (!ip || ip.price !== 0) return null;
  const unitDays = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 }[ip.periodUnit] || 1;
  return fill(t.trialDays, { n: ip.periodNumberOfUnits * unitDays });
}
function perMonthOf(yearly) {
  const p = yearly?.pkg?.product;
  if (!p?.price || !p.currencyCode) return null;
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: p.currencyCode }).format(p.price / 12); } catch (e) { return null; }
}
function monthsFree(yearly, monthly) {
  const y = yearly?.pkg?.product?.price, m = monthly?.pkg?.product?.price;
  if (!y || !m) return 0;
  return Math.max(0, Math.round(12 - y / m));
}

// rangée de plan : rond plein quand choisi, prix tabulaire, petit ressort à l'appui
function Plan({ T, on, label, price, suffix, hint, badge, onPress }) {
  const sc = useSharedValue(1);
  const st = useAnimatedStyle(() => ({ transform: [{ scale: sc.value }] }));
  return (
    <Pressable onPress={() => { sc.value = withSequence(withTiming(0.97, { duration: 70 }), withSpring(1, { damping: 10, stiffness: 300 })); onPress(); }}>
      <Animated.View style={[s.plan, { borderColor: on ? T.ink : T.line }, st]}>
        <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: on ? T.ink : T.muted, alignItems: 'center', justifyContent: 'center' }}>{on ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: T.ink }} /> : null}</View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[type.body, { color: T.ink }]}>{label}</Text>
            {badge ? <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, backgroundColor: T.ok }}><Text style={[type.label, { color: T.bg, fontSize: 12 }]}>{badge}</Text></View> : null}
          </View>
          {hint ? <Label T={T} style={{ marginTop: 2 }}>{hint}</Label> : null}
        </View>
        <Num T={T} style={{ fontSize: 17 }}>{price}<Text style={{ color: T.muted, fontWeight: '500', fontSize: 13.5 }}>{suffix}</Text></Num>
      </Animated.View>
    </Pressable>
  );
}

export default function Paywall() {
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const { next } = useLocalSearchParams();
  const [offers, setOffers] = useState(null);
  const [plan, setPlan] = useState('yearly');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [burst, setBurst] = useState(false);
  useEffect(() => { getOffers().then(o => setOffers(o)).catch(() => {}); }, []);

  const yearly = offers?.find(o => o.id === 'yearly'), monthly = offers?.find(o => o.id === 'monthly');
  const current = plan === 'yearly' ? yearly : monthly;
  const period = plan === 'yearly' ? t.periodYear : t.periodMonth;
  const trial = trialOf(current);
  const free = monthsFree(yearly, monthly);
  const perMonth = perMonthOf(yearly);

  const disclosure = !current ? fill(t.disclosureNoPrice, { name: t.title, period })
    : trial ? fill(t.disclosureTrial, { name: t.title, trial, price: current.priceString, period })
    : fill(t.disclosure, { name: t.title, price: current.priceString, period });
  const ctaLabel = busy ? t.buying : trial ? fill(t.ctaTrial, { trial }) : t.cta;

  const leave = () => { if (next) router.replace(String(next)); else router.back(); };
  const onBuy = async () => {
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
  // tient sur un écran (Jeanne, 7 nov 2026) : la scène prend ce qui reste au-dessus d'un contenu compact (~600 pt)
  const { height: SH } = useWindowDimensions();
  const sceneH = Math.max(150 + insets.top, SH - 600);
  const X = layout.x;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: Math.max(8, insets.bottom) }} showsVerticalScrollIndicator={false} bounces={false}>
        <View>
          <Scene T={T} stage="mochi" mood={burst ? 'wink' : undefined} lvl={4} height={sceneH} />
          {burst ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: sceneH }}><Burst count={18} colors={[T.accent, T.ok, T.scene.lamp, T.ink]} dist={150} /></View> : null}
          {/* paywall doux (après l'onboarding) : « Plus tard » visible en haut, sinon la croix */}
          {next
            ? <Pressable onPress={leave} hitSlop={12} style={{ position: 'absolute', top: insets.top + 10, right: X }}><Text style={[type.label, { color: T.ink, opacity: 0.7 }]}>{t.soft}</Text></Pressable>
            : <Pressable onPress={leave} hitSlop={12} accessibilityLabel={t.close} style={{ position: 'absolute', top: insets.top + 8, right: X, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: T.bg, opacity: 0.9 }}><Text style={{ color: T.ink, fontSize: 16, lineHeight: 18 }}>×</Text></Pressable>}
        </View>

        <Animated.View entering={FadeInDown.delay(120).duration(320)} style={{ paddingHorizontal: X, paddingTop: 14 }}>
          <Text style={[type.name, { color: T.ink }]}>{t.title}</Text>
          <Text style={[type.sub, { color: T.muted, marginTop: 4 }]}>{t.subtitle}</Text>
        </Animated.View>

        <View style={{ marginHorizontal: X, marginTop: 12 }}>
          <Hair T={T} />
          {t.features.map((f, i) => (
            <Animated.View key={f} entering={FadeInDown.delay(200 + i * 60).duration(300)} style={[s.feature, { borderColor: T.line }]}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: i === 0 ? T.accent : T.ok }} />
              <Text style={[type.body, { color: T.ink, flex: 1 }]}>{f}</Text>
            </Animated.View>
          ))}
        </View>

        <View style={{ paddingHorizontal: X, marginTop: 14, gap: 8 }}>
          <Plan T={T} on={plan === 'yearly'} onPress={() => setPlan('yearly')} label={t.planYearly} price={yearly ? yearly.priceString : t.priceUnavailable} suffix={yearly ? ` ${t.perYear}` : ''} hint={perMonth ? fill(t.yearlyHint, { price: perMonth }) : null} badge={free > 0 ? fill(t.monthsFree, { n: free }) : null} />
          <Plan T={T} on={plan === 'monthly'} onPress={() => setPlan('monthly')} label={t.planMonthly} price={monthly ? monthly.priceString : t.priceUnavailable} suffix={monthly ? ` ${t.perMonth}` : ''} hint={t.monthlyHint} />
        </View>

        {/* divulgation complète AU-DESSUS du CTA (Apple 3.1.2) */}
        <Text style={[type.label, { color: T.muted, fontSize: 11.5, lineHeight: 15, paddingHorizontal: X, marginTop: 12 }]}>{disclosure}</Text>
        <View style={{ paddingHorizontal: X, marginTop: 10 }}>
          <CTAPrimary big label={ctaLabel} onPress={onBuy} disabled={busy} />
          {msg ? <Text style={[type.label, { color: T.accent, textAlign: 'center', marginTop: 8 }]}>{msg}</Text> : null}
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 14, marginTop: 10 }}>
            <Pressable onPress={onRestore} disabled={busy} hitSlop={8}><Text style={[type.label, { color: T.muted }]}>{t.restore}</Text></Pressable>
            <Pressable onPress={() => open(LEGAL_URLS.privacy)} hitSlop={8}><Text style={[type.label, { color: T.muted }]}>{t.privacy}</Text></Pressable>
            <Pressable onPress={() => open(LEGAL_URLS.eula)} hitSlop={8}><Text style={[type.label, { color: T.muted }]}>{t.terms}</Text></Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  feature: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 16, borderWidth: 1.5 },
});
