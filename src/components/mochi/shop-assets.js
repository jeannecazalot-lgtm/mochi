// Boutique de Mochi (7 nov 2026, planches validées par Jeanne : design/boutique-propositions).
// Règle de Jeanne : « quand ils ont un objet, il faut qu'il soit gros et bien placé ; la pièce
// s'adapte au fur et à mesure ». Les objets sont décrits dans le repère de l'image de la pièce
// (1536 × 1024) ; `layoutRoom` choisit les emplacements selon le nombre d'objets posés et les
// grossit quand ils sont peu nombreux, puis convertit en points écran (même transformation
// « cover » que le décor). `placed` dans mochi_inventory = posé / rangé (objet) ou portée (tenue).
import items from '../../items';

export const SHOP = {
  aquarium: require('../../../assets/boutique/aquarium.png'), tournedisque: require('../../../assets/boutique/tournedisque.png'), lave: require('../../../assets/boutique/lave.png'),
  piano: require('../../../assets/boutique/piano.png'), chewinggum: require('../../../assets/boutique/chewinggum.png'), cheval: require('../../../assets/boutique/cheval.png'),
  disco: require('../../../assets/boutique/disco.png'), jukebox: require('../../../assets/boutique/jukebox.png'), maisonpoupee: require('../../../assets/boutique/maisonpoupee.png'),
  baignoire: require('../../../assets/boutique/baignoire.png'), mobile: require('../../../assets/boutique/mobile.png'), cage: require('../../../assets/boutique/cage.png'),
  montgolfiere: require('../../../assets/boutique/montgolfiere.png'), cheminee: require('../../../assets/boutique/cheminee.png'), coucou: require('../../../assets/boutique/coucou.png'),
  cadre: require('../../../assets/boutique/cadre.png'), lampe: require('../../../assets/boutique/lampe.png'),
  table: require('../../../assets/boutique/table.png'), // guéridon offert : apparaît tout seul pour poser les petits objets tant qu'il n'y a ni piano ni cheminée
  lunettesrouges: require('../../../assets/boutique/lunettesrouges.png'), couronne: require('../../../assets/boutique/couronne.png'), noeud: require('../../../assets/boutique/noeud.png'),
  fleurs: require('../../../assets/boutique/fleurs.png'), pirate: require('../../../assets/boutique/pirate.png'), fete: require('../../../assets/boutique/fete.png'),
  lapin: require('../../../assets/boutique/lapin.png'), beret: require('../../../assets/boutique/beret.png'), lunettesecolier: require('../../../assets/boutique/lunettesecolier.png'),
  astronaute: require('../../../assets/boutique/astronaute.png'), cire: require('../../../assets/boutique/cire.png'),
};
// hauteur / largeur de chaque image
const R = { aquarium: 0.941, tournedisque: 1.143, lave: 2.645, piano: 1.144, chewinggum: 1.748, cheval: 0.962, disco: 1.422, jukebox: 1.315, maisonpoupee: 0.966, baignoire: 1.03, mobile: 1.33, cage: 1.331, montgolfiere: 1.604, cheminee: 1.099, coucou: 1.667, cadre: 1.337, lampe: 1.172, table: 0.919,
  lunettesrouges: 0.412, couronne: 0.81, noeud: 0.529, fleurs: 0.471, pirate: 0.52, fete: 1.605, lapin: 0.93, beret: 0.66, lunettesecolier: 0.41, astronaute: 0.912, cire: 1.096 };

// zone, largeur quand la pièce est pleine (w), largeur quand l'objet est presque seul (wa), en px de l'image.
// top = posé sur un meuble (hosts, dans l'ordre), sinon repli (fb).
const OBJ = {
  cheval: { zone: 'front', w: 270, wa: 340 }, chewinggum: { zone: 'front', w: 130, wa: 230 }, baignoire: { zone: 'front', w: 300, wa: 370 },
  cage: { zone: 'back', w: 150, wa: 240 }, maisonpoupee: { zone: 'back', w: 230, wa: 330 },
  piano: { zone: 'wall', w: 250, wa: 330 }, cheminee: { zone: 'wall', w: 290, wa: 370 }, jukebox: { zone: 'wall', w: 190, wa: 270 },
  disco: { zone: 'hang', w: 100, wa: 150 }, mobile: { zone: 'hang', w: 170, wa: 240 },
  coucou: { zone: 'mount', w: 100, wa: 170 },
  cadre: { zone: 'top', hosts: ['cheminee', 'piano'], w: 70, wa: 100 }, // posé, jamais au mur (il « flottait », Jeanne 7 nov 2026)
  montgolfiere: { zone: 'window', w: 110, wa: 150 },
  table: { zone: 'side', w: 150, wa: 210 },
  aquarium: { zone: 'top', hosts: ['piano', 'cheminee'], w: 110, wa: 150 },
  tournedisque: { zone: 'top', hosts: ['cheminee', 'piano'], w: 100, wa: 130 },
  lave: { zone: 'top', hosts: ['cheminee', 'piano'], w: 42, wa: 60 },
  lampe: { zone: 'top', hosts: ['piano', 'cheminee'], w: 80, wa: 110 },
};
// ce qu'un meuble peut porter : décalages x (px de l'image, à sa largeur de base) et enfoncement du bas de l'objet dans le dessus
// fenêtre du cadre (fraction de l'image) : la photo du couple s'y glisse derrière
export const CADRE_WINDOW = { x: 0.2, y: 0.146, w: 0.597, h: 0.648 };
const HOSTS = { piano: { dx: [-10, 70, -85], sink: 14 }, cheminee: { dx: [-40, 45, 110], sink: 14 }, table: { dx: [-18, 38], sink: 22 } };
// emplacements par zone selon le nombre d'objets dans la zone : [cx, bas] (sol, mur) ou [cx, haut] (suspendu, accroché, fenêtre)
const LAYOUTS = {
  front: [[[320, 1000]], [[320, 1000], [1330, 1015]], [[290, 1000], [1330, 1015], [500, 1010]], [[290, 1000], [1330, 1015], [500, 1010], [1090, 990]]], // pas trop à gauche : le décor est rogné de ~115 px de chaque côté sur un iPhone
  back: [[[300, 790]], [[370, 790], [120, 790]], [[370, 790], [120, 790], [1230, 790]]],
  // Mochi (large) couvre le centre bas : un meuble seul va à gauche, le plus grand des trois au centre (son dessus reste visible)
  wall: [[[1180, 740]], [[1180, 740], [600, 745]], [[880, 735], [560, 745], [1200, 740]], [[880, 735], [560, 745], [1200, 740], [1060, 740]]],
  side: [[[1060, 960]], [[1060, 960], [1250, 800]]], // guéridons : à droite de Mochi, jamais derrière lui
  hang: [[[950, 180]], [[1010, 180], [850, 190]], [[1010, 180], [850, 190], [1180, 200]]],
  mount: [[[1215, 300]], [[1215, 300], [580, 330]], [[1215, 300], [580, 330], [1400, 440]]],
  window: [[[300, 170]]],
};
const ORDER = items.objects.map(o => o.key);

// keys posées → [{ key, left, top, width, height, string }] en points écran, pour une scène SW × hh
// positions : { clé → { x, y } } fractions de la scène (centre de l'objet), posées au doigt (8 nov 2026) ; elles priment sur l'emplacement automatique
export function layoutRoom(keys, SW, hh, boost = 1.15, positions = {}) {
  const s = Math.max(SW / 1536, hh / 1024); const ox = (SW - 1536 * s) / 2, oy = (hh - 1024 * s) / 2;
  const ks = keys.filter((k, i) => OBJ[k] && SHOP[k] && k !== 'table' && keys.indexOf(k) === i).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
  const t = Math.max(0, Math.min(1, (8 - ks.length) / 7)); // 1 = presque seul → grand ; 0 = pièce pleine
  const px = o => (o.w + (o.wa - o.w) * t) * boost;
  const zones = { front: [], back: [], wall: [], side: [], hang: [], mount: [], window: [] }; const tops = []; const load = {};
  const take = (k, hosts) => { for (const h of hosts) { if ((load[h] || 0) < HOSTS[h.replace(/\d+$/, '')].dx.length) { load[h] = (load[h] || 0) + 1; tops.push([k, h]); return true; } } return false; };
  ks.forEach(k => { const o = OBJ[k]; if (o.zone !== 'top') zones[o.zone].push([k, o]); });
  // les petits objets vont sur le piano ou la cheminée ; sinon sur un guéridon offert (deux par guéridon)
  const tables = [];
  ks.filter(k => OBJ[k].zone === 'top').forEach(k => {
    if (take(k, OBJ[k].hosts.filter(h => ks.includes(h)))) return;
    if (!take(k, tables)) { const tk = 'table' + (tables.length + 1); tables.push(tk); zones.side.push([tk, OBJ.table]); take(k, [tk]); }
  });
  const out = {};
  Object.entries(zones).forEach(([z, list]) => {
    const lays = LAYOUTS[z]; const lay = lays[Math.min(list.length, lays.length) - 1] || [];
    list.sort((a, b) => px(b[1]) - px(a[1])); // le plus grand prend le meilleur emplacement
    list.forEach(([k, o], i) => { const slot = lay[i] || lay[lay.length - 1]; if (!slot) return; const w = px(o), h = w * R[k.replace(/\d+$/, '')]; const hangs = z === 'hang' || z === 'mount' || z === 'window'; out[k] = { x: slot[0] - w / 2, y: hangs ? slot[1] : slot[1] - h, w, h, string: z === 'hang' }; });
  });
  const used = {};
  tops.forEach(([k, host]) => { const H = out[host]; if (!H) return; const kind = host.replace(/\d+$/, ''); const spec = HOSTS[kind]; const i = used[host] || 0; used[host] = i + 1; const sc = H.w / OBJ[kind].w; const dx = (spec.dx[i] ?? 0) * sc; const w = px(OBJ[k]), h = w * R[k]; out[k] = { x: H.x + H.w / 2 + dx - w / 2, y: H.y + spec.sink * sc - h, w, h }; });
  return Object.entries(out).map(([key, p]) => { const w = p.w * s, h = p.h * s; const m = positions[key]; const left = m ? m.x * SW - w / 2 : ox + p.x * s, top = m ? m.y * hh - h / 2 : oy + p.y * s; return { key, img: key.replace(/\d+$/, ''), left, top, width: w, height: h, string: !!p.string && !m, photo: key === 'cadre' }; });
}

// tenues : largeur relative à Mochi (W), ancre (center / bottom), y relatif à sa hauteur (H), décalage x relatif
const OUTFIT = {
  lunettesrouges: [0.66, 'center', 0.52, 0], lunettesecolier: [0.66, 'center', 0.52, 0], couronne: [0.42, 'bottom', 0.10, 0], fete: [0.34, 'bottom', 0.12, 0],
  pirate: [0.62, 'bottom', 0.14, 0], beret: [0.60, 'bottom', 0.24, 0.06], fleurs: [0.78, 'center', 0.17, 0], lapin: [0.62, 'bottom', 0.30, 0],
  noeud: [0.40, 'center', 0.86, 0], astronaute: [1.15, 'center', 0.42, 0], cire: [1.12, 'center', 0.46, 0],
};
export function outfitStyle(key, W, H) {
  const o = OUTFIT[key]; if (!o || !R[key]) return null;
  const w = W * o[0], h = w * R[key]; const y = H * o[2];
  const top = o[1] === 'bottom' ? y - h : o[1] === 'center' ? y - h / 2 : y;
  return { position: 'absolute', left: '50%', marginLeft: -w / 2 + W * o[3], top, width: w, height: h };
}
