// Écran 37 · Paywall Duo+. Recette : docs/recettes/37-paywall.md
// Règles Store (CLAUDE.md) : divulgation complète AU-DESSUS du CTA, prix storefront
// via getOffers() (jamais un chiffre inventé), Restore · Privacy · Terms sous le CTA.
import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, PillLabel, CTAPrimary } from '../src/components/ui';
import { LiveMochi } from '../src/components/motion';
import { RoundButton, CheckDot, LEGAL_URLS } from '../src/components/premium/extra';
import { getOffers, purchase, restore } from '../src/purchases';
import copy from '../src/data/copy.json';
import { colors, space, radius, font } from '../src/theme';

const t = copy.paywall;
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// essai gratuit annoncé par le storefront (RevenueCat : product.introPrice, price 0) → « {n} jours »
function trialOf(offer) {
  const ip = offer?.pkg?.product?.introPrice;
  if (!ip || ip.price !== 0) return null;
  const unitDays = { DAY: 1, WEEK: 7, MONTH: 30, YEAR: 365 }[ip.periodUnit] || 1;
  return fill(t.trialDays, { n: ip.periodNumberOfUnits * unitDays });
}
// équivalent mensuel du prix annuel, dans la devise du storefront
function perMonthOf(yearly) {
  const p = yearly?.pkg?.product;
  if (!p?.price || !p.currencyCode) return null;
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: p.currencyCode }).format(p.price / 12); } catch (e) { return null; }
}
// mois offerts = 12 − (annuel ÷ mensuel), uniquement si les deux prix sont connus
function monthsFree(yearly, monthly) {
  const y = yearly?.pkg?.product?.price, m = monthly?.pkg?.product?.price;
  if (!y || !m) return 0;
  return Math.max(0, Math.round(12 - y / m));
}

export default function Paywall() {
  const [offers, setOffers] = useState(null);
  const [plan, setPlan] = useState('yearly');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
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

  const onBuy = async () => {
    setBusy(true); setMsg(null);
    const r = await purchase(plan);
    setBusy(false);
    if (r.success) router.back();
    else if (!r.cancelled) setMsg(t.error);
  };
  const onRestore = async () => {
    setBusy(true); setMsg(null);
    const r = await restore();
    setBusy(false);
    if (r.success) { setMsg(t.restored); setTimeout(() => router.back(), 600); } else setMsg(t.restoreNone);
  };
  const open = url => { if (url) Linking.openURL(url).catch(() => {}); };

  const Plan = ({ id, label, offer, suffix, hint, badge, flex }) => {
    const on = plan === id;
    return (
      <Pressable onPress={() => setPlan(id)} style={{ flex }}>
        <Card padding={0} r={radius.card} accent={on ? colors.sage : undefined} style={{ paddingVertical: 14, paddingHorizontal: 16, overflow: 'visible' }}>
          {badge ? <View style={s.badge}><PillLabel color={colors.sageDeep}>{badge}</PillLabel></View> : null}
          <Text style={s.planLabel}>{label}</Text>
          <Text style={s.price}>{offer ? offer.priceString : t.priceUnavailable}{offer ? <Text style={s.priceSuffix}>{suffix}</Text> : null}</Text>
          {hint ? <Text style={s.hint}>{hint}</Text> : null}
        </Card>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={s.header}><RoundButton icon="close" size={36} onPress={() => router.back()} label={t.close} /></View>

        <View style={{ alignItems: 'center', marginBottom: 14 }}>
          <View style={{ marginBottom: 6 }}><LiveMochi size={104} mood="happy" /></View>
          <Text style={s.title}>{t.title}</Text>
          <Text style={s.sub}>{t.subtitle}</Text>
        </View>

        <View style={{ paddingHorizontal: 26, gap: 5, marginBottom: 14 }}>
          {t.features.map(f => (
            <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <CheckDot /><Text style={font.row}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={{ paddingHorizontal: 22, flexDirection: 'row', gap: 8, alignItems: 'stretch' }}>
          <Plan id="yearly" flex={1.2} label={t.planYearly} offer={yearly} suffix={t.perYear} hint={perMonth ? fill(t.yearlyHint, { price: perMonth }) : null} badge={free > 0 ? fill(t.monthsFree, { n: free }) : null} />
          <Plan id="monthly" flex={1} label={t.planMonthly} offer={monthly} suffix={t.perMonth} hint={t.monthlyHint} />
        </View>

        <View style={s.bottom}>
          {msg ? <Text style={[s.disclosure, { color: colors.coralDeep }]}>{msg}</Text> : null}
          <Text style={s.disclosure}>{disclosure}</Text>
          <CTAPrimary label={ctaLabel} onPress={onBuy} disabled={busy} big style={{ alignSelf: 'stretch' }} />
          <Text style={s.footnote}>{t.footnote}</Text>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Pressable onPress={onRestore} disabled={busy} hitSlop={6}><Text style={s.link}>{t.restore}</Text></Pressable>
            <Text style={s.link}>·</Text>
            <Pressable onPress={() => open(LEGAL_URLS.privacy)} hitSlop={6}><Text style={s.link}>{t.privacy}</Text></Pressable>
            <Text style={s.link}>·</Text>
            <Pressable onPress={() => open(LEGAL_URLS.eula)} hitSlop={6}><Text style={s.link}>{t.terms}</Text></Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 14, paddingHorizontal: space.headerX, alignItems: 'flex-end' },
  title: { fontSize: 22, fontWeight: '600', letterSpacing: -1.2, lineHeight: 23, color: colors.ink },
  sub: { fontSize: 14.5, fontWeight: '400', color: colors.muted, marginTop: 6 },
  badge: { position: 'absolute', top: -9, left: 14, zIndex: 1 },
  planLabel: { fontSize: 13, fontWeight: '500', color: colors.muted, marginTop: 4 },
  price: { fontSize: 20, fontWeight: '700', letterSpacing: -0.8, color: colors.ink, marginTop: 3, fontVariant: ['tabular-nums'] },
  priceSuffix: { fontSize: 14, fontWeight: '500', letterSpacing: 0, color: colors.muted },
  hint: { fontSize: 12, fontWeight: '400', color: colors.muted },
  bottom: { position: 'absolute', left: space.screenX, right: space.screenX, bottom: 26, alignItems: 'center', gap: 10 },
  disclosure: { fontSize: 12, fontWeight: '400', color: colors.muted, textAlign: 'center', lineHeight: 16 },
  footnote: { fontSize: 13, fontWeight: '400', color: colors.muted },
  link: { fontSize: 12, fontWeight: '500', color: colors.muted },
});
