// Langue de l'app (13 nov 2026, Jeanne : app, captures et fiche en anglais).
// Français si le téléphone est en français, anglais sinon. Lue une fois au
// démarrage (iOS relance l'app quand on change de langue).
// EXPO_PUBLIC_LANG=en|fr force la langue (captures App Store, tests).
// Le module natif expo-localization n'existe qu'à partir du build 22 : sur un
// build plus ancien, on retombe sur Intl, puis sur le français.

function deviceLocales() {
  try {
    const { requireOptionalNativeModule } = require('expo-modules-core');
    if (requireOptionalNativeModule('ExpoLocalization')) {
      const list = require('expo-localization').getLocales();
      if (list?.length) return list.map(l => ({ lang: l.languageCode, tag: l.languageTag, currency: l.currencyCode }));
    }
  } catch (e) { /* module absent : repli Intl */ }
  try {
    const tag = Intl.DateTimeFormat().resolvedOptions().locale;
    if (tag) return [{ lang: tag.split('-')[0], tag }];
  } catch (e) { /* rien */ }
  return [{ lang: 'fr', tag: 'fr-FR' }];
}

const forced = process.env.EXPO_PUBLIC_LANG;
const first = deviceLocales()[0] || { lang: 'fr', tag: 'fr-FR' };

export const LANG = forced === 'en' || forced === 'fr' ? forced : (first.lang === 'fr' ? 'fr' : 'en');
export const isEN = LANG === 'en';

// Locale des dates, heures et montants : celle du téléphone si elle est dans la
// bonne langue (en-GB garde « 13 Nov », en-US « Nov 13 »), sinon une par défaut.
export const LOCALE = forced
  ? (LANG === 'en' ? 'en-US' : 'fr-FR')
  : (first.lang === LANG && first.tag ? first.tag : (LANG === 'en' ? 'en-US' : 'fr-FR'));

// Heure courte : « 9 h 30 » en français, « 9:30 AM » / « 09:30 » selon le téléphone en anglais.
export const fmtClock = (date) => {
  const s = new Intl.DateTimeFormat(LOCALE, { hour: '2-digit', minute: '2-digit' }).format(date);
  return LANG === 'fr' ? s.replace(':', ' h ') : s;
};

// « 20:00 » (heure stockée) → « 20 h 00 » / « 8:00 PM »
export const fmtHHMM = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':').map(Number);
  if (Number.isNaN(h)) return String(hhmm || '');
  const d = new Date(); d.setHours(h, m || 0, 0, 0);
  return fmtClock(d);
};

// Jour de la semaine dans une phrase : « lundi » en français, « Monday » en anglais.
export const dayWord = (s) => (LANG === 'fr' ? String(s).toLowerCase() : String(s));

// Devise du budget : celle du téléphone quand on la connaît (build 22+), sinon € en
// français et $ en anglais. Forcée à € / $ en mode capture.
export const CURRENCY = forced ? (LANG === 'en' ? 'USD' : 'EUR') : (first.currency || (LANG === 'en' ? 'USD' : 'EUR'));
