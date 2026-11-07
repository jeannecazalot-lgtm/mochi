// La pièce de Mochi + boutique (étape 5, 4 nov 2026) : la scène en grand, les souvenirs ramenés, les objets et
// tenues contre des perles communes, Mochi+ pour les collections. Données : mochi_inventory / mochi_state.
import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Scene } from '../src/components/mochi/scene';
import { SHOP } from '../src/components/mochi/shop-assets';
import { Label, Num } from '../src/components/mochi/gauges';
import { useTokens, type, layout } from '../src/theme-v3';
import { read } from '../src/store';
import { loadSetup, setup, inRealMode } from '../src/setup-state';
import { mochiStore, getMochi, buyItem, setPlaced, setFramePhoto, setItemPos, positionsOf, STAGES } from '../src/mochi-state';
import * as ImagePicker from 'expo-image-picker';
import { uploadFramePhoto } from '../src/profile';
import items from '../src/data/mochi-items.json';
import copy from '../src/data/copy.json';

const fill = (s, vars) => Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), s);
const PLACES_BY_STAGE = { egg: [], mini: ['jardin'], mochi: ['jardin', 'riviere'], maxi: ['jardin', 'riviere', 'foret', 'ville'], dore: ['jardin', 'riviere', 'foret', 'ville', 'plage', 'montagne'] };
const DEMO = { mochi: { stage: 'mini', pearls: 128, hearts: 4 }, inv: [{ item_key: 'cheval', kind: 'object', placed: true }, { item_key: 'beret', kind: 'outfit', placed: true }] };

function RowItem({ it, kind, T, t, s, outfit, photoUrl, stageIdx, has: hasOf, placedOf, onBuy, onPlace, onPhoto }) {
  const has = hasOf(it.key);
  const locked = it.stage && STAGES.indexOf(it.stage) > stageIdx;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: T.line, opacity: locked ? 0.5 : 1 }}>
      <Image source={SHOP[it.key]} style={{ width: 52, height: 52 }} resizeMode="contain" accessibilityIgnoresInvertColors />
      <View style={{ flex: 1, minWidth: 0 }}><Text style={[type.body, { color: T.ink }]}>{it.label}</Text>{has && it.key === 'cadre' ? <Pressable onPress={onPhoto} hitSlop={6}><Label T={T} style={{ marginTop: 2, color: T.accent }}>{photoUrl ? t.photoChange : t.photoPick}</Label></Pressable> : locked ? <Label T={T} style={{ marginTop: 2 }}>{fill(t.locked, { k: STAGES.indexOf(it.stage) })}</Label> : it.plus ? <Label T={T} style={{ marginTop: 2 }}>{t.plus}</Label> : null}</View>
      {has && kind === 'outfit' ? (outfit === it.key ? <Pressable onPress={() => onPlace(it, kind, false)} style={[s.pill, { borderColor: T.line }]}><Label T={T}>{t.remove}</Label></Pressable> : <Pressable onPress={() => onPlace(it, kind, true)} style={[s.pill, { borderColor: T.ink }]}><Label T={T} style={{ color: T.ink }}>{t.wear}</Label></Pressable>)
        : has ? (placedOf(it.key) ? <Pressable onPress={() => onPlace(it, kind, false)} style={[s.pill, { borderColor: T.line }]}><Label T={T}>{t.store}</Label></Pressable> : <Pressable onPress={() => onPlace(it, kind, true)} style={[s.pill, { borderColor: T.ink }]}><Label T={T} style={{ color: T.ink }}>{t.place}</Label></Pressable>)
        : locked ? null
        : it.plus ? <View style={[s.pill, { borderColor: T.accent }]}><Label T={T} style={{ color: T.accent }}>{t.plus}</Label></View>
        : <Pressable onPress={() => onBuy(it, kind)} style={[s.pill, { borderColor: T.ink }]}><Num T={T}>{it.price}</Num><Label T={T} style={{ marginLeft: 4 }}>perles</Label></Pressable>}
    </View>);
}

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
  const stageIdx = Math.max(1, STAGES.indexOf(m.stage)); // l'œuf peut déjà meubler : le palier 1 est ouvert avant l'éclosion (7 nov 2026)
  // posé / porté = `placed` dans l'inventaire (commun au foyer) ; en démo, local
  const outfit = inv.find(i => i.kind === 'outfit' && i.placed)?.item_key || null;
  const objects = inv.filter(i => i.kind === 'object' && i.placed !== false).map(i => i.item_key);
  const placedOf = k => inv.some(i => i.item_key === k && i.placed !== false);
  // déplacer au doigt (Jeanne, 8 nov 2026) : la position est gardée localement tout de suite, puis partagée
  const positions = positionsOf(inv);
  const onMove = (key, pos) => { setInv(rows => rows.map(r => r.item_key === key ? { ...r, pos_x: pos.x, pos_y: pos.y } : r)); if (!demo) setItemPos(key, pos).catch(() => {}); };
  // la photo du cadre « vous deux » : choisie dans la photothèque, visible chez les deux
  const pickPhoto = async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [7, 10], quality: 0.7 });
      if (r.canceled) return;
      if (demo) { setMochi(mm => ({ ...mm, photo_url: r.assets[0].uri })); return; }
      const url = await uploadFramePhoto(r.assets[0].uri);
      await setFramePhoto(url); setMochi(await getMochi());
    } catch (e) { setMsg(t.photoError); }
  };
  const place = async (it, kind, on) => {
    if (demo) { setInv(rows => rows.map(r => r.item_key === it.key ? { ...r, placed: on } : kind === 'outfit' && on && r.kind === 'outfit' ? { ...r, placed: false } : r)); return; }
    await setPlaced(it.key, on);
  };
  const buy = async (it, kind) => {
    if (demo) { // démo : achat local, pour voir la pièce changer
      if ((m.pearls || 0) < it.price) { setMsg(fill(t.notEnough, { n: it.price - (m.pearls || 0) })); return; }
      setMsg(''); setInv(i => [...i.map(r => kind === 'outfit' && r.kind === 'outfit' ? { ...r, placed: false } : r), { item_key: it.key, kind, placed: true }]); setMochi(mm => ({ ...mm, pearls: (mm.pearls || 0) - it.price })); return;
    }
    const r = await buyItem(it, kind);
    setMsg(r.ok ? '' : r.reason === 'pearls' ? fill(t.notEnough, { n: it.price - (m.pearls || 0) }) : '');
  };
  const X = layout.x;
  // rangée hissée hors du composant (7 nov 2026) : définie à l'intérieur, chaque rafraîchissement temps réel
  // la remontait entièrement et avalait les touches (« Poser » / « Choisir votre photo » sans effet)
  const rowProps = { T, t, s, outfit, photoUrl: m.photo_url, stageIdx, has: k => owned.has(k), placedOf, onBuy: buy, onPlace: place, onPhoto: pickPhoto };
  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><Scene T={T} stage={m.stage} mood={T.night ? 'sleeping' : undefined} lvl={lvl} height={layout.scene + 40} items={objects} outfit={outfit} souvenirs={souvenirs} photo={m.photo_url || null} positions={positions} onMove={onMove} topInset={insets.top + 30} /></View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']} pointerEvents="box-none">{/* box-none : les touches sur la scène (objets déplaçables) passent à travers */}
        <View style={{ paddingTop: 12, paddingHorizontal: X, flexDirection: 'row', alignItems: 'center' }} pointerEvents="box-none">
          <Pressable onPress={() => router.back()} hitSlop={10}><Label T={T} style={{ color: T.ink }}>‹ Retour</Label></Pressable>
          <View style={{ flex: 1 }} />
          <Num T={T}>{m.pearls ?? 0}</Num><Label T={T} style={{ marginLeft: 6 }}>perles</Label>
        </View>
        {/* la scène reste fixe (Jeanne, 6 nov 2026 : « la partie écrite rogne sur l'animation ») : seule la liste défile dessous */}
        <View pointerEvents="none" style={{ height: Math.max(8, layout.scene + 40 - insets.top - 44) }} />
        <View style={{ paddingHorizontal: X, paddingTop: 12 }}><Text style={[type.name, { color: T.ink }]}>{t.title}</Text>{objects.length ? <Label T={T} style={{ marginTop: 4 }}>{t.dragHint}</Label> : null}</View>
        <View style={{ flexDirection: 'row', gap: 22, paddingHorizontal: X, marginTop: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: T.line }}>
          {t.tabs.map((lab, i) => <Pressable key={lab} onPress={() => setTab(i)} style={{ paddingBottom: 10, borderBottomWidth: 2, borderColor: tab === i ? T.ink : 'transparent' }}><Text style={[type.label, { color: tab === i ? T.ink : T.muted, fontWeight: '600' }]}>{lab}</Text></Pressable>)}
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: X }}>
            {tab === 0 ? items.objects.map(it => <RowItem key={it.key} it={it} kind="object" {...rowProps} />)
              : tab === 1 ? items.outfits.map(it => <RowItem key={it.key} it={it} kind="outfit" {...rowProps} />)
              : null}
            {msg ? <Label T={T} style={{ color: T.accent, marginTop: 12 }}>{msg}</Label> : null}
            <Label T={T} style={{ marginTop: 20 }}>{t.rule}</Label>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
const s = StyleSheet.create({ pill: { flexDirection: 'row', alignItems: 'baseline', borderWidth: 1.5, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 } });
