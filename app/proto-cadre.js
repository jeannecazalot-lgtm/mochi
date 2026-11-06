// Proto · le cadre « Mochi et son foyer », 4 compositions premium (3 nov 2026, retour Jeanne :
// « plus premium, moins gamin, effet waouh, pas illustration »). Lumière, matière, reflet — pas d'objets dessinés.
// URL : /proto-cadre?v=studio|nid|verre|fenetre|maison-jour|maison-soir|maison-bonbon  — le reste de l'écran = DNA actuel (direction D « Foyer »).
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Ellipse, Rect, Defs, RadialGradient, Stop } from 'react-native-svg';
import { GlowBg, Card, Divider, Avatar, PillLabel } from '../src/components/ui';
import { BadgePill, CheckCircle } from '../src/components/core/extra';
import { frameFor, MOCHI_RATIO } from '../src/components/mochi-img';
import TabBar from '../src/components/TabBar';
import { me, partner } from '../src/demo';
import { colors, space, font, alpha } from '../src/theme';

const W = 160, H = W * MOCHI_RATIO; // Mochi 160 de large
const Mochi = ({ style }) => <Image source={frameFor(0)} style={[{ width: W, height: H }, style]} resizeMode="contain" />;
// reflet : image retournée, fondue dans la couleur du sol
const Reflet = ({ floor, op = 0.28, h = 70 }) => (
  <View style={{ width: W, height: h, overflow: 'hidden', marginTop: -2 }}>
    <Image source={frameFor(0)} style={{ width: W, height: H, transform: [{ scaleY: -1 }], opacity: op, marginTop: -(H - h) }} resizeMode="contain" />
    <LinearGradient colors={[alpha(floor, 0.2), floor]} style={StyleSheet.absoluteFill} />
  </View>
);
// ombre de contact : halo radial sombre
const Ombre = ({ w = 190, h = 34, a = 0.22, style }) => (
  <Svg width={w} height={h} style={style}><Defs><RadialGradient id="o" cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor="#3A2A20" stopOpacity={a} /><Stop offset="1" stopColor="#3A2A20" stopOpacity="0" /></RadialGradient></Defs><Ellipse cx={w / 2} cy={h / 2} rx={w / 2} ry={h / 2} fill="url(#o)" /></Svg>
);
// lumière : halo radial clair
const Lueur = ({ w, h, color = '#FFFFFF', a = 0.9, style }) => (
  <Svg width={w} height={h} style={style}><Defs><RadialGradient id="l" cx="50%" cy="50%" r="50%"><Stop offset="0" stopColor={color} stopOpacity={a} /><Stop offset="1" stopColor={color} stopOpacity="0" /></RadialGradient></Defs><Rect width={w} height={h} fill="url(#l)" /></Svg>
);

// 5 · Maison : rendu 3D généré (Figma AI, gpt-image, 3 nov 2026) en fond pleine largeur, Mochi posé dedans
const MAISON = { 'maison-jour': require('../assets/maison-proto/jour.png'), 'maison-soir': require('../assets/maison-proto/soir.png'), 'maison-bonbon': require('../assets/maison-proto/bonbon.png') };
function Maison({ k }) {
  return (
    <View style={s.frame}>
      <Image source={MAISON[k]} style={{ width: '100%', height: 640, marginTop: -150 }} resizeMode="cover" />
      {/* voile en haut : la date et les perles restent lisibles sur le rendu */}
      <LinearGradient colors={['rgba(250,250,247,0.92)', 'rgba(250,250,247,0.55)', 'rgba(250,250,247,0)']} locations={[0, 0.5, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 170 }} />
      <View style={{ position: 'absolute', bottom: 92, alignSelf: 'center' }}><Ombre w={220} h={44} a={0.3} /></View>
      <View style={{ position: 'absolute', bottom: 80, alignSelf: 'center' }}><Mochi /></View>
    </View>
  );
}
// 1 · Studio : fond photo produit, projecteur, sol satiné avec reflet
function Studio() {
  const floor = '#EFE3D6';
  return (
    <View style={s.frame}>
      <LinearGradient colors={['#FFF9F3', '#F7EDE3']} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['#EEE1D2', floor]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150 }} />
      <Lueur w={420} h={300} a={0.95} style={{ position: 'absolute', top: -130, alignSelf: 'center' }} />
      <View style={{ position: 'absolute', bottom: 136, alignSelf: 'center' }}><Ombre w={210} h={40} a={0.26} /></View>
      <View style={{ position: 'absolute', bottom: 74, alignSelf: 'center', alignItems: 'center' }}><Mochi /><Reflet floor={floor} /></View>
    </View>
  );
}
// 2 · Nid : coussin de velours, lumière de fin de journée, Mochi enfoncé dedans
function Nid() {
  return (
    <View style={s.frame}>
      <LinearGradient colors={['#F6E9EA', '#EFDCD6', '#E9D2CB']} style={StyleSheet.absoluteFill} />
      <Lueur w={380} h={260} color="#FFE7C8" a={0.8} style={{ position: 'absolute', top: -90, right: -60 }} />
      <View style={{ position: 'absolute', bottom: 76, alignSelf: 'center' }}><Ombre w={300} h={60} a={0.2} /></View>
      <LinearGradient colors={['#F9DCD2', '#E9B9A9']} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={{ position: 'absolute', bottom: 84, alignSelf: 'center', width: 290, height: 96, borderRadius: 60 }} />
      <LinearGradient colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']} style={{ position: 'absolute', bottom: 142, alignSelf: 'center', width: 230, height: 32, borderRadius: 30 }} />
      <View style={{ position: 'absolute', bottom: 120, alignSelf: 'center' }}><Ombre w={180} h={30} a={0.18} /></View>
      <View style={{ position: 'absolute', bottom: 114, alignSelf: 'center' }}><Mochi /></View>
      <LinearGradient colors={['rgba(233,185,169,0)', '#E9B9A9']} style={{ position: 'absolute', bottom: 84, alignSelf: 'center', width: 290, height: 36, borderBottomLeftRadius: 60, borderBottomRightRadius: 60 }} />
    </View>
  );
}
// 3 · Verre : cloche de verre sur socle, brume, reflets
function Verre() {
  return (
    <View style={s.frame}>
      <LinearGradient colors={['#EEF5F4', '#E1ECEA']} style={StyleSheet.absoluteFill} />
      <Lueur w={360} h={260} a={0.9} style={{ position: 'absolute', top: -110, alignSelf: 'center' }} />
      <View style={{ position: 'absolute', bottom: 72, alignSelf: 'center' }}><Ombre w={300} h={48} a={0.22} /></View>
      <LinearGradient colors={['#E2CDB0', '#BFA27E']} style={{ position: 'absolute', bottom: 80, alignSelf: 'center', width: 260, height: 26, borderRadius: 13 }} />
      <View style={{ position: 'absolute', bottom: 100, alignSelf: 'center' }}><Ombre w={200} h={28} a={0.2} /></View>
      <View style={{ position: 'absolute', bottom: 96, alignSelf: 'center' }}><Mochi /></View>
      {/* cloche */}
      <View style={{ position: 'absolute', bottom: 92, alignSelf: 'center', width: 236, height: 222, borderTopLeftRadius: 118, borderTopRightRadius: 118, borderBottomLeftRadius: 14, borderBottomRightRadius: 14, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1.2, borderColor: 'rgba(255,255,255,0.85)', overflow: 'hidden' }}>
        <LinearGradient colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0 }} end={{ x: 0.7, y: 0.6 }} style={StyleSheet.absoluteFill} />
        <View style={{ position: 'absolute', left: 26, top: 22, width: 14, height: 120, borderRadius: 7, backgroundColor: '#FFFFFF', opacity: 0.7, transform: [{ rotate: '14deg' }] }} />
        <View style={{ position: 'absolute', left: 48, top: 14, width: 5, height: 60, borderRadius: 3, backgroundColor: '#FFFFFF', opacity: 0.6, transform: [{ rotate: '14deg' }] }} />
      </View>
    </View>
  );
}
// 4 · Fenêtre : la pièce n'existe que par la lumière, une tache de soleil au sol
function Fenetre() {
  return (
    <View style={s.frame}>
      <LinearGradient colors={['#F8F0E7', '#F1E6DA']} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['#EADDCD', '#E4D5C3']} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140 }} />
      {/* tache de lumière (fenêtre à croisillons) projetée sur le mur puis le sol */}
      <View style={{ position: 'absolute', right: 26, top: 70, width: 160, height: 210, transform: [{ skewX: '-12deg' }], opacity: 0.75 }}>
        <LinearGradient colors={['#FFF6DF', '#FFEFD2']} style={[StyleSheet.absoluteFill, { borderRadius: 6 }]} />
        <View style={{ position: 'absolute', left: 71, top: 0, bottom: 0, width: 8, backgroundColor: '#F1E6DA' }} />
        <View style={{ position: 'absolute', top: 94, left: 0, right: 0, height: 8, backgroundColor: '#F1E6DA' }} />
      </View>
      <Lueur w={300} h={120} color="#FFF1D6" a={0.9} style={{ position: 'absolute', bottom: 70, right: -30 }} />
      <View style={{ position: 'absolute', bottom: 108, alignSelf: 'center', marginLeft: 70 }}><Ombre w={260} h={38} a={0.24} /></View>
      <View style={{ position: 'absolute', bottom: 84, alignSelf: 'center' }}><Mochi /></View>
      {[[60, 110], [90, 160], [120, 130], [40, 190], [150, 200]].map(([x, y], i) => <View key={i} style={{ position: 'absolute', left: x, top: y, width: 3, height: 3, borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.8 }} />)}
    </View>
  );
}

function Row({ emoji, title, done, who, first, together }) {
  return (
    <View>
      {!first ? <Divider /> : null}
      <View style={[s.row, done && { opacity: 0.45 }]}>
        <Text style={{ fontSize: 19 }}>{emoji}</Text>
        <View style={{ flex: 1 }}><Text style={[font.body, done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{title}</Text></View>
        {together ? <BadgePill color={colors.sageDeep} tint={colors.sage} a={0.22}>À DEUX</BadgePill> : who ? <Avatar initial={who.initial} color={who.color} size={22} /> : null}
        <CheckCircle done={done} />
      </View>
    </View>
  );
}

export default function ProtoCadre() {
  const { v = 'studio' } = useLocalSearchParams();
  const Frame = MAISON[v] ? () => <Maison k={v} /> : ({ studio: Studio, nid: Nid, verre: Verre, fenetre: Fenetre }[v] || Studio);
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="normal" />
      {/* scène pleine largeur, sous la barre d'état, fondue dans la page (retour Jeanne : « le cadre complet sur la hauteur » de A) */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 400 }}>
        <Frame />
        <LinearGradient colors={[alpha(colors.bg, 0), colors.bg]} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 120 }} />
      </View>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={s.header}>
          <Text style={[font.micro, { flex: 1, fontWeight: '500' }]}>MARDI 3 NOVEMBRE</Text>
          <PillLabel color={colors.butter} tint={colors.butter}><Text style={{ color: '#9A7A2E' }}>◉ 128 perles</Text></PillLabel>
          <Avatar initial={me.initial} color={me.color} size={36} />
        </View>
        <View style={{ height: 258 }} />
        <View style={{ alignItems: 'center', marginTop: 0, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
          <Text style={[font.cardTitle, { fontSize: 22 }]}>Mochi</Text>
          <PillLabel color={colors.coralDeep} tint={colors.coral}>MINI · JOUR 12</PillLabel>
        </View>
        <Text style={[font.secondary, { textAlign: 'center', marginTop: 4 }]}>Encore 2 missions et il part en balade.</Text>
        <Card padding={14} style={{ marginHorizontal: space.screenX, marginTop: 14 }}>
          <View style={s.gaugeHead}><Text style={font.sectionTitle}>Énergie du jour</Text><Text style={s.meta}>3 / 5</Text></View>
          <View style={{ height: 12, borderRadius: 6, backgroundColor: colors.line, marginTop: 8, overflow: 'hidden' }}><LinearGradient colors={['#FBE49A', '#F5C76E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ width: '60%', height: '100%', borderRadius: 6 }} /></View>
          <View style={[s.gaugeHead, { marginTop: 12 }]}><Text style={font.sectionTitle}>Forme</Text><Text style={{ fontSize: 15, letterSpacing: 2 }}><Text style={{ color: colors.coral }}>♥♥♥♥</Text><Text style={{ color: colors.checkRing }}>♥</Text></Text></View>
        </Card>
        <View style={s.sectionHead}><Text style={font.sectionTitle}>Aujourd'hui</Text><Text style={s.meta}>2 restantes · 35 min</Text></View>
        <View style={{ paddingHorizontal: space.screenX }}>
          <Card padding={0} style={{ paddingVertical: 6, paddingHorizontal: 14 }}>
            <Row first emoji="🧺" title="Lancer une lessive" />
            <Row emoji="📞" title="Appeler le pédiatre" who={me} />
            <Row emoji="🍽️" title="Vaisselle du soir" done together />
          </Card>
        </View>
        <View style={{ flex: 1 }} />
        <TabBar state={{ routes: [{ name: 'index' }, { name: 'planning' }, { name: 'balance' }, { name: 'budget' }], index: 0 }} navigation={{ navigate: () => {} }} onFab={() => {}} />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  frame: { height: 400, overflow: 'hidden' },
  header: { paddingTop: 16, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionHead: { paddingTop: 22, paddingBottom: 9, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 12 },
  gaugeHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  meta: { fontSize: 13, fontWeight: '500', color: colors.muted },
});
