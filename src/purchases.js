// ═══════════════════════════════════════════════════════════════════
// Achat Duo+ — POINT D'ENTRÉE UNIQUE pour le paywall (écran 37).
// RevenueCat (react-native-purchases) est branché ICI et nulle part
// ailleurs. Deux modes, choisis automatiquement :
//  · RÉEL   — build EAS/dev build avec EXPO_PUBLIC_REVENUECAT_IOS_KEY.
//             Le droit s'appelle « duoplus » dans le dashboard RevenueCat.
//  · SIMULÉ — clé absente : aller-retour mimé (700 ms, succès).
// Offres : mensuel + annuel (SPECS §9). Identifiants RevenueCat :
//  packages $rc_monthly et $rc_annual de l'offering « default ».
// ═══════════════════════════════════════════════════════════════════
import { Platform } from 'react-native';
import { useSyncExternalStore } from 'react';

const KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const ENTITLEMENT = 'duoplus';   // NE PAS renommer sans changer le dashboard en même temps

export const REAL_PURCHASES = Boolean(KEY) && Platform.OS === 'ios';

let Purchases = null;
if (REAL_PURCHASES) Purchases = require('react-native-purchases').default;

const isActive = info => Boolean(info?.entitlements?.active?.[ENTITLEMENT]);

// ── état « Mochi+ » du foyer (10 nov 2026) ─────────────────────────────────────────────
// L'abonnement est PARTAGÉ à deux : l'identifiant RevenueCat = l'id du foyer (logIn), donc les deux
// téléphones du foyer lisent le même droit, quel que soit celui qui a payé.
let premium = false, premiumUntil = null, configured = false, linkedHid = null;
const subs = new Set();
const setPremium = (on, until) => { if (on === premium && until === premiumUntil) return; premium = on; premiumUntil = until; subs.forEach(f => f()); };
export const purchasesPremium = () => premium;
export const purchasesPremiumUntil = () => premiumUntil;
export const onPremiumChange = f => (subs.add(f), () => subs.delete(f));
// re-rend un écran quand le droit change (achat, restauration, l'autre a payé)
export const usePremiumVersion = () => useSyncExternalStore(onPremiumChange, () => `${premium}|${premiumUntil}`);
const sync = info => setPremium(isActive(info), info?.entitlements?.active?.[ENTITLEMENT]?.expirationDate || null);

// boot : config + resynchronisation du droit (appelé une fois au démarrage, app/_layout.js)
export function initPurchases(householdId) {
  if (!REAL_PURCHASES || configured) return;
  try {
    Purchases.configure({ apiKey: KEY, appUserID: householdId || null });
    configured = true; linkedHid = householdId || null;
    Purchases.getCustomerInfo().then(sync).catch(() => {});
    Purchases.addCustomerInfoUpdateListener(sync);
  } catch (e) { /* jamais bloquant */ }
}
// le foyer change (création, invitation acceptée, départ) : l'abonnement suit le foyer
export async function linkPurchasesHousehold(householdId) {
  if (!REAL_PURCHASES) return;
  if (!configured) { initPurchases(householdId); return; }
  if (!householdId || householdId === linkedHid) return;
  try { const { customerInfo } = await Purchases.logIn(householdId); linkedHid = householdId; sync(customerInfo); } catch (e) { /* réessayé au prochain lancement */ }
}

// offres : [{ id:'monthly'|'yearly', priceString, period }] — null en simulé
let cachedOffers = null;
export async function getOffers() {
  if (cachedOffers) return cachedOffers;
  if (!REAL_PURCHASES) return null;
  try {
    const offerings = await Purchases.getOfferings();
    const cur = offerings.current;
    const map = [['monthly', cur?.monthly], ['yearly', cur?.annual]].filter(([, p]) => p);
    cachedOffers = map.map(([id, pkg]) => ({ id, pkg, priceString: pkg.product.priceString, period: id === 'monthly' ? 'mois' : 'an' }));
    return cachedOffers;
  } catch (e) { return null; }
}

export async function purchase(offerId = 'monthly') {
  if (!REAL_PURCHASES) {
    await new Promise(r => setTimeout(r, 700));
    setPremium(true, null);
    return { success: true, simulated: true };
  }
  try {
    const offers = await getOffers();
    const o = offers?.find(x => x.id === offerId);
    if (!o) return { success: false, error: 'no-offering' };
    const { customerInfo } = await Purchases.purchasePackage(o.pkg);
    sync(customerInfo);
    return { success: isActive(customerInfo) };
  } catch (e) {
    return { success: false, cancelled: Boolean(e?.userCancelled), error: e?.message };
  }
}

export async function restore() {
  if (!REAL_PURCHASES) return { success: false };
  try {
    const info = await Purchases.restorePurchases();
    sync(info);
    return { success: isActive(info) };
  } catch (e) { return { success: false, error: e?.message }; }
}
