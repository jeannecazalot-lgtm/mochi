// Catalogue de Mochi (objets, tenues, souvenirs, lieux) dans la langue de l'app.
// mochi-items.json = français + données ; mochi-items.en.json = libellés anglais par clé.
import fr from './data/mochi-items.json';
import en from './data/mochi-items.en.json';
import { LANG } from './lang';

const relabel = list => list.map(x => ({ ...x, label: en.labels[x.key] || x.label }));
const items = LANG === 'en'
  ? { ...fr, places: { ...fr.places, ...en.places }, placeTo: { ...fr.placeTo, ...en.placeTo }, souvenirs: relabel(fr.souvenirs), objects: relabel(fr.objects), outfits: relabel(fr.outfits) }
  : fr;
export default items;
