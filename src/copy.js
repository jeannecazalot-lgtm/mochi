// Textes de l'app dans la langue du téléphone (voir src/lang.js).
// copy.json = français (source, avec les _labels pour Jeanne) ;
// copy.en.json = anglais, même structure sans les _labels.
// Une clé absente en anglais retombe sur le français (jamais d'écran vide).
import fr from './data/copy.json';
import en from './data/copy.en.json';
import { LANG } from './lang';

const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
function merge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
  return out;
}

const copy = LANG === 'en' ? merge(fr, en) : fr;
export default copy;

// Textes qui vivent dans le code (catalogue de tâches, données de démo des
// captures) : le français reste à côté de la donnée, l'anglais est rangé dans
// copy.en.json › section › id. tx('catalogue', 't-vaisselle', 'Vaisselle').
export const tx = (section, id, fr) => (LANG === 'en' && en?.[section]?.[id]) || fr;
