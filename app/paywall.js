// Écran 37 · Paywall Mochi+ (10 nov 2026). Données ici, apparence dans src/components/premium/paywall-layouts.js.
// Modèle (Jeanne, façon BellySafe) : « Pass 1 an » en paiement unique recommandé + « Mensuel » renouvelable.
// Mochi+ = semaine pré-remplie (en gratuit on repart de zéro chaque semaine), objets et tenues Mochi+,
// vue mois et budget, un seul paiement pour le foyer.
// Règles Store (CLAUDE.md) : divulgation complète AU-DESSUS du CTA, prix storefront via getOffers()
// (jamais un chiffre inventé en réel), Restaurer · Confidentialité · Conditions.
// `?next=` : paywall doux après la création du foyer. Dev seulement : `?demo=1` prix d'exemple, `?v=A|B|C` mise en page.
import React, { useState, useEffect } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { View, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Burst } from '../src/components/motion';
import { LEGAL_URLS } from '../src/components/premium/extra';
import { LayoutA, LayoutB, LayoutC } from '../src/components/premium/paywall-layouts';
import { getOffers, purchase, restore } from '../src/purchases';
import copy from '../src/data/copy.json';

const t = copy.paywall;
const fill = (str, vars) => String(str).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
const DEMO_OFFERS = [{ id: 'pass', priceString: '49,99 €', price: 49.99, currencyCode: 'EUR' }, { id: 'monthly', priceString: '14,99 €', price: 14.99, currencyCode: 'EUR' }];
const money = (v, cur) => { try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: cur }).format(v); } catch (e) { return null; } };
const LAYOUT = 'A'; // mise en page retenue (à fixer quand Jeanne aura choisi)

export default function Paywall() { const { from } = useLocalSearchParams(); return <PaywallView context={from ? String(from) : null} />; }

// embedded : affiché dans un onglet (Budget sans Mochi+, Jeanne 11 nov 2026) — croix vers l'Accueil (Jeanne : « il faut toujours une croix »), place pour la barre d'onglets
export function PaywallView({ embedded = false, context = null }) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { next, demo, v } = useLocalSearchParams();
  const V = __DEV__ && v ? String(v) : LAYOUT;
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
  const leave = () => { if (embedded) { navigation.navigate('index'); return; } if (next) router.replace(String(next)); else router.back(); }; // dans un onglet, la croix ramène à l'Accueil
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
  const d = {
    insets: embedded ? { ...insets, bottom: insets.bottom + 84 } : insets, next, embedded, plan, setPlan, busy, msg, leave, onBuy, onRestore,
    openPrivacy: () => open(LEGAL_URLS.privacy), openTerms: () => open(LEGAL_URLS.eula),
    badge: saving > 0 ? fill(t.passBadge, { n: saving }) : null,
    passPrice: pass ? fill(t.passPrice, { price: pass.priceString }) : t.priceUnavailable,
    passOnly: pass ? pass.priceString : t.priceUnavailable,
    passHint: perMonth ? fill(t.passHint, { price: perMonth }) : null,
    monthPrice: monthly ? fill(t.monthPrice, { price: monthly.priceString }) : t.priceUnavailable,
    disclosure: !current ? t.disclosureNoPrice : plan === 'pass' ? fill(t.disclosurePass, { price: current.priceString }) : fill(t.disclosureMonth, { price: current.priceString }),
    ctaLabel: busy ? t.buying : t.cta,
    // d'où l'on vient (Jeanne, 11 nov 2026) : le titre et le premier avantage parlent de ce qu'on a ouvert
    headline: (t.context[context] || {}).headline || t.headline,
    benefits: t.context[context] ? [t.context[context].first, ...t.benefits.filter(b => b.icon !== t.context[context].drop)] : t.benefits,
    under: plan === 'pass' ? t.underPass : t.underMonth,
  };
  const L = V === 'B' ? LayoutB : V === 'C' ? LayoutC : LayoutA;
  return (
    <View style={{ flex: 1 }}>
      <L d={d} />
      {burst ? <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 360 }}><Burst count={18} colors={['#D9483E', '#6F9A2E', '#F7DFA8', '#1F2A58']} dist={150} /></View> : null}
    </View>
  );
}
