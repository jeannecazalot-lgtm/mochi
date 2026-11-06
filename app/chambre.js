// La pièce de Mochi + boutique (étape 5, 4 nov 2026) : la scène en grand, les souvenirs ramenés, les objets et
// tenues contre des perles communes, Mochi+ pour les collections. Données : mochi_inventory / mochi_state.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scene } from '../src/components/mochi/scene';
import { Label, Num } from '../src/components/mochi/gauges';
import { useTokens, type, layout } from '../src/theme-v3';
import { read } from '../src/store';
import { loadSetup, setup, inRealMode } from '../src/setup-state';
import { mochiStore, getMochi, buyItem, STAGES } from '../src/mochi-state';
import items from '../src/data/mochi-items.json';
import copy from '../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const PLACES_BY_STAGE = { egg: [], mini: ['jardin'], mochi: ['jardin', 'riviere'], maxi: ['jardin', 'riviere', 'foret', 'ville'], dore: ['jardin', 'riviere', 'foret', 'ville', 'plage', 'montagne'] };
const SHOP_IMG = { plante: require('../assets/boutique/plante.png'), pouf: require('../assets/boutique/pouf.png'), cadre: require('../assets/boutique/cadre.png'), lampe: require('../assets/boutique/lampe.png'), tapis: require('../assets/boutique/tapis.png'), etagere2: require('../assets/boutique/etagere2.png'), fauteuil: require('../assets/boutique/fauteuil.png'), bibliotheque: require('../assets/boutique/bibliotheque.png'), bonnet: require('../assets/boutique/bonnet.png'), echarpe: require('../assets/boutique/echarpe.png'), chapeau: require('../assets/boutique/chapeau.png') };
const DEMO = { mochi: { stage: 'mini', pearls: 128, hearts: 4 }, inv: [{ item_key: 'jardin-01', kind: 'souvenir' }, { item_key: 'jardin-03', kind: 'souvenir' }, { item_key: 'plante', kind: 'object' }, { item_key: 'bonnet', kind: 'outfit' }] };

export default function Chambre() {
  const t = copy.chambre;
  const T = useTokens();
  const insets = useSafeAreaInsets();
  const v = mochiStore.useVersion();
  const [tab, setTab] = useState(0);
  const [mochi, setMochi] = useState(null);
  const [inv, setInv] = useState([]);
  const [msg, setMsg] = useState('');
  const [demo, setDemo] = useState(false);
  useEffect(() => { (async () => { await loadSetup(); if (!inRealMode()) { setDemo(true); setMochi(DEMO.mochi); setInv(DEMO.inv); return; } setMochi(await getMochi()); setInv((await read('mochi_inventory')).filter(i => i.household_id === setup.householdId)); })(); }, [v]);
  const m = mochi || DEMO.mochi;
  const owned = new Set(inv.map(i => i.item_key));
  const souvenirs = inv.filter(i => i.kind === 'souvenir').length;
  const lvl = m.stage === 'egg' ? 0 : souvenirs === 0 ? 1 : m.stage === 'mini' ? 2 : m.stage === 'mochi' ? 3 : 4;
  const places = PLACES_BY_STAGE[m.stage] || [];
  const stageIdx = STAGES.indexOf(m.stage);
  const [worn, setWorn] = useState(null); // tenue portée (choix local ; sinon la dernière achetée)
  const outfitsOwned = inv.filter(i => i.kind === 'outfit'); const outfit = worn || (outfitsOwned.length ? outfitsOwned[outfitsOwned.length - 1].item_key : null);
  const objects = inv.filter(i => i.kind === 'object').map(i => i.item_key);
  const buy = async (it, kind) => {
    if (demo) { // démo : achat local, pour voir la pièce changer
      if ((m.pearls || 0) < it.price) { setMsg(fill(t.notEnough, { n: it.price - (m.pearls || 0) })); return; }
      setMsg(''); setInv(i => [...i, { item_key: it.key, kind }]); setMochi(mm => ({ ...mm, pearls: (mm.pearls || 0) - it.price })); return;
    }
    const r = await buyItem(it, kind);
    setMsg(r.ok ? '' : r.reason === 'pearls' ? fill(t.notEnough, { n: it.price - (m.pearls || 0) }) : '');
  };
  const X = layout.x;
  const RowItem = ({ it, kind }) => {
    const has = owned.has(it.key);
    const locked = it.stage && STAGES.indexOf(it.stage) > stageIdx;
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, opacity: locked ? 0.5 : 1 }}>
        <Image source={SHOP_IMG[it.key]} style={{ width: 44, height: 44 }} resizeMode="contain" accessibilityIgnoresInvertColors />
        <View style={{ flex: 1, minWidth: 0 }}><Text style={[type.body, { color: T.ink }]}>{it.label}</Text>{locked ? <Label T={T} style={{ marginTop: 2 }}>{fill(t.locked, { k: STAGES.indexOf(it.stage) })}</Label> : it.plus ? <Label T={T} style={{ marginTop: 2 }}>{t.plus}</Label> : null}</View>
        {has && kind === 'outfit' ? (outfit === it.key ? <Label T={T}>{t.worn}</Label> : <Pressable onPress={() => setWorn(it.key)} style={[s.pill, { borderColor: T.ink }]}><Label T={T} style={{ color: T.ink }}>{t.wear}</Label></Pressable>)
          : has ? <Label T={T}>{t.owned}</Label>
          : locked ? null
          : it.plus ? <View style={[s.pill, { borderColor: T.accent }]}><Label T={T} style={{ color: T.accent }}>{t.plus}</Label></View>
          : <Pressable onPress={() => buy(it, kind)} style={[s.pill, { borderColor: T.ink }]}><Num T={T}>{it.price}</Num><Label T={T} style={{ marginLeft: 4 }}>perles</Label></Pressable>}
      </View>);
  };
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} stage={m.stage} mood={T.night ? 'sleeping' : undefined} lvl={lvl} height={layout.scene + 40} items={objects} outfit={outfit} souvenirs={souvenirs} topInset={insets.top + 30} /></View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingTop: 12, paddingHorizontal: X, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()} hitSlop={10}><Label T={T} style={{ color: T.ink }}>‹ Retour</Label></Pressable>
          <View style={{ flex: 1 }} />
          <Num T={T}>{m.pearls ?? 0}</Num><Label T={T} style={{ marginLeft: 6 }}>perles</Label>
        </View>
        {/* la scène reste fixe (Jeanne, 6 nov 2026 : « la partie écrite rogne sur l'animation ») : seule la liste défile dessous */}
        <View pointerEvents="none" style={{ height: Math.max(8, layout.scene + 40 - insets.top - 44) }} />
        <View style={{ paddingHorizontal: X, paddingTop: 12 }}><Text style={[type.name, { color: T.ink }]}>{t.title}</Text></View>
        <View style={{ flexDirection: 'row', gap: 22, paddingHorizontal: X, marginTop: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          {t.tabs.map((lab, i) => <Pressable key={lab} onPress={() => setTab(i)} style={{ paddingBottom: 10, borderBottomWidth: 2, borderColor: tab === i ? T.ink : 'transparent' }}><Text style={[type.label, { color: tab === i ? T.ink : T.muted, fontWeight: '600' }]}>{lab}</Text></Pressable>)}
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: X }}>
            {tab === 0 ? items.objects.map(it => <RowItem key={it.key} it={it} kind="object" />)
              : tab === 1 ? items.outfits.map(it => <RowItem key={it.key} it={it} kind="outfit" />)
              : Object.keys(items.places).map(pl => {
                const all = items.souvenirs.filter(sv => sv.place === pl); const mine = all.filter(sv => owned.has(sv.key)); const open = places.includes(pl); const unlockAt = STAGES.findIndex(st => (PLACES_BY_STAGE[st] || []).includes(pl));
                return (
                  <View key={pl} style={{ paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}><Text style={[type.body, { color: open ? T.ink : T.muted }]}>{items.places[pl]}</Text><Label T={T}>{open ? fill(t.souvenirsCount, { n: mine.length, total: all.length }) : fill(t.locked, { k: unlockAt })}</Label></View>
                    {mine.length ? <Text style={[type.sub, { color: T.muted, marginTop: 4 }]}>{mine.map(sv => sv.label).join(' · ')}</Text> : null}
                  </View>);
              })}
            {tab === 2 && souvenirs === 0 ? <Text style={[type.sub, { color: T.muted, marginTop: 10 }]}>{t.empty}</Text> : null}
            {msg ? <Label T={T} style={{ color: T.accent, marginTop: 12 }}>{msg}</Label> : null}
            <Label T={T} style={{ marginTop: 20 }}>{t.rule}</Label>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const s = StyleSheet.create({ pill: { flexDirection: 'row', alignItems: 'baseline', borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 } });
