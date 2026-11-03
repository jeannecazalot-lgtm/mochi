// Proto · « Mochi qu'on élève » (option B, 3 nov 2026) — STATIQUES à valider par Jeanne sur captures.
// Données en dur, vrais composants. URL : /proto-finch?s=accueil|balade|malade|retour|chambre|croissance|humeur
// Les objets/tenues sont des émojis provisoires à la place des illustrations à commander.
import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlowBg, Card, Divider, Avatar, CTAPrimary, CTASecondary, PillLabel, Micro } from '../src/components/ui';
import { MochiImage } from '../src/components/mochi-img';
import { ProgressBar } from '../src/components/motion';
import { Icon, ICON, BadgePill, CheckCircle, RoundButton, PillButton, Segment } from '../src/components/core/extra';
import { SplitBar } from '../src/components/balance/extra';
import TabBar from '../src/components/TabBar';
import { me, partner } from '../src/demo';
import { colors, space, radius, font, alpha, slotColors } from '../src/theme';

const POSE = { bebe: require('../assets/mochi/pose-11.png'), enfant: require('../assets/mochi/pose-08.png'), ado: require('../assets/mochi/mood-happy.png'), adulte: require('../assets/mochi/pose-09.png'), balade: require('../assets/mochi/pose-10.png') };
const Pose = ({ k, w = 60 }) => <Image source={POSE[k]} style={{ width: w, height: w * 0.8 }} resizeMode="contain" />;
const deep = m => slotColors[m.slot]?.deep ?? colors.ink;

// ─── briques communes ───────────────────────────────────────────────
function Header({ pearls = 128 }) {
  return (
    <View style={s.header}>
      <Text style={[font.micro, { flex: 1, fontWeight: '500' }]}>MARDI 3 NOVEMBRE</Text>
      <PillLabel color={colors.butter} tint={colors.butter}><Text style={{ color: '#9A7A2E' }}>◉ {pearls} perles</Text></PillLabel>
      <RoundButton><Icon d={ICON.bubble} size={17} /></RoundButton>
      <Avatar initial={me.initial} color={me.color} size={36} />
    </View>
  );
}
function Row({ emoji, title, done, who, first, together, sub }) {
  return (
    <View>
      {!first ? <Divider /> : null}
      <View style={[s.row, done && { opacity: 0.45 }]}>
        <Text style={{ fontSize: 19 }}>{emoji}</Text>
        <View style={{ flex: 1 }}><Text style={[font.body, done && { textDecorationLine: 'line-through' }]} numberOfLines={1}>{title}</Text>{sub ? <Text style={[font.caption, { marginTop: 2, color: colors.coralDeep, fontWeight: '600' }]}>{sub}</Text> : null}</View>
        {together ? <BadgePill color={colors.sageDeep} tint={colors.sage} a={0.22}>À DEUX</BadgePill> : who ? <Avatar initial={who.initial} color={who.color} size={22} /> : null}
        <CheckCircle done={done} />
      </View>
    </View>
  );
}
function Gauges({ energy = 3, max = 5, form = 4, sick }) {
  return (
    <Card padding={14} style={{ marginHorizontal: space.screenX, marginTop: 18 }}>
      <View style={s.gaugeHead}><Text style={font.sectionTitle}>Énergie du jour</Text><Text style={s.gaugeMeta}>{energy}/{max} missions</Text></View>
      <ProgressBar ratio={energy / max} color={colors.butter} track={colors.line} height={10} style={{ marginTop: 8 }} />
      <Text style={[font.caption, { marginTop: 7 }]}>{sick ? 'Pas de balade tant qu\'il est malade.' : energy >= max ? 'Jauge pleine : Mochi part en balade.' : `Encore ${max - energy} et Mochi part en balade.`}</Text>
      <Divider />
      <View style={[s.gaugeHead, { marginTop: 2 }]}>
        <Text style={font.sectionTitle}>Forme</Text>
        <Text style={{ fontSize: 15, letterSpacing: 2 }}>{'♥'.repeat(form)}<Text style={{ color: colors.checkRing }}>{'♥'.repeat(5 - form)}</Text></Text>
      </View>
      <Text style={[font.caption, { marginTop: 4, color: sick ? colors.coralDeep : colors.muted }]}>{sick ? 'Malade : 3 ratées cette semaine. Chaque rattrapage lui rend un cœur. Il ne grandit pas tant qu\'il dort.' : form >= 4 ? 'En pleine forme. Une mission ratée lui coûte un cœur.' : 'Un peu patraque : 2 missions en retard cette semaine.'}</Text>
    </Card>
  );
}
const Tabs = ({ active = 'index' }) => <TabBar state={{ routes: [{ name: 'index' }, { name: 'planning' }, { name: 'balance' }, { name: 'budget' }], index: ['index', 'planning', 'balance', 'budget'].indexOf(active) }} navigation={{ navigate: () => {} }} onFab={() => {}} />;

// ─── 1 · Accueil ────────────────────────────────────────────────────
function Accueil({ gone, sick }) {
  return (
    <>
      <Header />
      <View style={s.mochiBlock}>
        {gone
          ? <View style={{ width: 104, height: 84, alignItems: 'center', justifyContent: 'center' }}><View style={s.ghost}><Text style={{ fontSize: 22 }}>👣</Text></View></View>
          : <MochiImage size={104} mood={sick ? 'sleeping' : undefined} lean={0} />}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Text style={font.cardTitle}>Mochi</Text><PillLabel color={colors.coralDeep} tint={colors.coral}>BÉBÉ · JOUR 12</PillLabel></View>
          <Text style={[font.secondary, { marginTop: 5, lineHeight: 19 }]}>{sick ? 'Mochi est malade. Il a besoin de vous deux : rattrapez les 3 missions en retard.' : gone ? 'Parti en balade, retour vers 19 h 30. Il vous racontera.' : 'Encore 2 missions et je pars en balade !'}</Text>
        </View>
      </View>
      <Gauges energy={gone ? 5 : sick ? 1 : 3} form={sick ? 1 : 4} sick={sick} />
      <View style={s.sectionHead}><Text style={font.sectionTitle}>Aujourd'hui</Text><Text style={s.gaugeMeta}>{gone ? 'tout est fait' : sick ? '5 restantes · 1 h 10' : '2 restantes · 35 min'}</Text></View>
      <View style={{ paddingHorizontal: space.screenX }}>
        <Card padding={0} style={{ paddingVertical: 11, paddingHorizontal: 14 }}>
          {sick ? <><Row first emoji="💊" title="Renouveler l'ordonnance" sub="depuis 4 j" who={partner} /><Row emoji="🧹" title="Aspirateur salon" sub="depuis 3 j" who={me} /><Row emoji="🧾" title="Payer la cantine" sub="depuis 2 j" who={me} /></> : null}
          <Row first={!sick} emoji="🧺" title="Lancer une lessive" done={gone} />
          <Row emoji="📞" title="Appeler le pédiatre" done={gone} />
          <Row emoji="🍽️" title="Vaisselle du soir" done together />
          {sick ? null : <><Row emoji="🛒" title="Courses de la semaine" done /><Row emoji="🗑️" title="Sortir les poubelles" done /></>}
        </Card>
      </View>
      <View style={{ flex: 1 }} />
      <Tabs />
    </>
  );
}

// ─── 2 · Retour de balade ───────────────────────────────────────────
function Retour() {
  return (
    <View style={{ flex: 1, paddingHorizontal: space.screenX }}>
      <View style={{ alignItems: 'center', paddingTop: 70 }}>
        <Micro>RETOUR DE BALADE · 19 H 32</Micro>
        <View style={{ marginTop: 18 }}><MochiImage size={170} /></View>
        <Text style={[font.hero, { fontSize: 26, marginTop: 20 }]}>Mochi est rentré !</Text>
        <Text style={[font.secondary, { marginTop: 6, textAlign: 'center', lineHeight: 19 }]}>Il est allé jusqu'à la rivière. Vous avez tout fait aujourd'hui, à deux, et il a trouvé ça :</Text>
      </View>
      <Card r={radius.cardLg} padding={16} style={{ marginTop: 26, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={s.objBox}><Text style={{ fontSize: 30 }}>🪨</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={font.cardTitle}>Un galet lisse</Text>
          <Text style={[font.secondary, { marginTop: 3 }]}>Souvenir n° 4 · pour sa chambre</Text>
        </View>
        <BadgePill color="#9A7A2E" tint={colors.butter} a={0.3}>+12 PERLES</BadgePill>
      </Card>
      <View style={{ flex: 1 }} />
      <CTAPrimary big label="Le poser dans sa chambre" style={{ marginBottom: 12 }} />
      <CTASecondary label="Plus tard" style={{ marginBottom: 40 }} />
    </View>
  );
}

// ─── 3 · Chambre + boutique ─────────────────────────────────────────
function Chambre() {
  const items = [
    { e: '🪴', t: 'Plante grasse', p: '40', own: false }, { e: '🛋️', t: 'Pouf moelleux', p: '60', own: false }, { e: '🖼️', t: 'Cadre photo de vous deux', p: '80', own: false },
    { e: '🎩', t: 'Chapeau melon', p: 'Mochi+', own: false, plus: true }, { e: '🧣', t: 'Écharpe d\'hiver', p: 'Mochi+', own: false, plus: true },
  ];
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      <View style={[s.header, { paddingTop: 10 }]}>
        <Text style={[font.screenTitle, { flex: 1 }]}>La chambre de Mochi</Text>
        <PillLabel color={colors.butter} tint={colors.butter}><Text style={{ color: '#9A7A2E' }}>◉ 128 perles</Text></PillLabel>
      </View>
      <Card r={radius.cardLg} padding={0} style={{ marginHorizontal: space.screenX, marginTop: 14, height: 230, overflow: 'hidden', backgroundColor: '#FFF6E8' }}>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 72, backgroundColor: '#F3E3CC' }} />
        <View style={{ position: 'absolute', left: 22, top: 26 }}><Text style={{ fontSize: 30 }}>🖼️</Text></View>
        <View style={{ position: 'absolute', right: 26, top: 40 }}><Text style={{ fontSize: 30 }}>🪟</Text></View>
        <View style={{ position: 'absolute', left: 28, bottom: 44 }}><Text style={{ fontSize: 34 }}>🪴</Text></View>
        <View style={{ position: 'absolute', right: 30, bottom: 40 }}><Text style={{ fontSize: 34 }}>🪨</Text></View>
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 30, alignItems: 'center' }}><MochiImage size={120} /></View>
      </Card>
      <Text style={[font.caption, { textAlign: 'center', marginTop: 8 }]}>4 souvenirs de balade · 2 objets achetés ensemble</Text>
      <View style={{ paddingHorizontal: space.screenX, marginTop: 18 }}>
        <Segment options={[{ value: 'o', label: 'Objets' }, { value: 't', label: 'Tenues' }, { value: 's', label: 'Souvenirs' }]} value="o" onChange={() => {}} />
      </View>
      <View style={{ paddingHorizontal: space.screenX, marginTop: 14 }}>
        <Card padding={0} style={{ paddingVertical: 6, paddingHorizontal: 14 }}>
          {items.map((it, i) => (
            <View key={it.t}>
              {i ? <Divider /> : null}
              <View style={[s.row, { paddingVertical: 11 }]}>
                <View style={[s.objBox, { width: 44, height: 44 }]}><Text style={{ fontSize: 24 }}>{it.e}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={font.body}>{it.t}</Text>
                  {it.plus ? <Text style={[font.caption, { marginTop: 2 }]}>Collection d'hiver · Mochi+</Text> : null}
                </View>
                {it.plus ? <BadgePill color={colors.lavenderDeep} tint={colors.lavender} a={0.2}>MOCHI+</BadgePill> : <PillButton label={`◉ ${it.p}`} dark={!it.own} />}
              </View>
            </View>
          ))}
        </Card>
        <Text style={[font.caption, { textAlign: 'center', marginTop: 14, lineHeight: 17 }]}>Les perles sont communes au foyer : chaque mission cochée en rapporte 3, une balade 12.</Text>
      </View>
    </ScrollView>
  );
}

// ─── 4 · Balance v2 : croissance par l'équilibre ────────────────────
function Croissance() {
  const stages = [{ k: 'oeuf', l: 'Œuf' }, { k: 'bebe', l: 'Bébé' }, { k: 'enfant', l: 'Enfant' }, { k: 'ado', l: 'Ado' }, { k: 'adulte', l: 'Adulte' }];
  const parts = [{ ratio: 0.58, color: me.color }, { ratio: 0.42, color: partner.color }];
  return (
    <>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
        <View style={[s.header, { paddingTop: 10 }]}>
          <Text style={[font.screenTitle, { flex: 1 }]}>Balance</Text>
          <PillLabel color={colors.sky}>SEM. 45 · 2 → 8 NOV</PillLabel>
        </View>
        <View style={{ alignItems: 'center', paddingTop: 16 }}>
          <MochiImage size={72} mood="neutral" lean={0.4} />
          <Text style={[font.body, { marginTop: 8, textAlign: 'center' }]}>Ça penche un peu chez Ketley cette semaine.</Text>
        </View>
        <Card r={radius.cardLg} padding={18} style={{ marginHorizontal: space.screenX, marginTop: 18 }}>
          <View style={s.gaugeHead}><Text style={font.sectionTitle}>Mochi grandit</Text><Text style={s.gaugeMeta}>enfant dans 9 jours</Text></View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, alignItems: 'flex-end' }}>
            {stages.map((st, i) => (
              <View key={st.k} style={{ alignItems: 'center', width: 58 }}>
                <View style={{ height: 52, justifyContent: 'flex-end', alignItems: 'center' }}>
                  {st.k === 'oeuf' ? <Text style={{ fontSize: 26, opacity: 0.5 }}>🥚</Text> : <View style={{ opacity: i <= 1 ? 1 : 0.22 }}><Pose k={st.k} w={i === 1 ? 54 : 36 + i * 5} /></View>}
                </View>
                <View style={{ width: 8, height: 8, borderRadius: 4, marginTop: 8, backgroundColor: i <= 1 ? colors.coral : colors.line }} />
                <Text style={[font.caption, { marginTop: 5, fontWeight: i === 1 ? '600' : '400', color: i === 1 ? colors.ink : colors.muted }]}>{st.l}</Text>
              </View>
            ))}
          </View>
          <Text style={[font.secondary, { marginTop: 14, lineHeight: 18 }]}>Il grandit d'un cran par semaine équilibrée. 3 sur 4 jusqu'ici : encore une bonne semaine et il devient enfant.</Text>
        </Card>
        <Card r={radius.cardLg} padding={18} style={{ marginHorizontal: space.screenX, marginTop: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <View style={{ flex: 1 }}><Text style={[s.heroName, { color: deep(me) }]}>{me.first_name}</Text><Text style={font.hero}>3 h 10</Text><Text style={font.caption}>58 % · 11 missions</Text></View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}><Text style={[s.heroName, { color: deep(partner) }]}>{partner.first_name}</Text><Text style={font.hero}>2 h 20</Text><Text style={font.caption}>42 % · 8 missions</Text></View>
          </View>
          <SplitBar height={8} parts={parts} />
        </Card>
        <View style={s.sectionHead}><Text style={font.sectionTitle}>Ratées cette semaine</Text><Text style={s.gaugeMeta}>− 2 cœurs</Text></View>
        <View style={{ paddingHorizontal: space.screenX }}>
          <Card padding={0} style={{ paddingVertical: 6, paddingHorizontal: 14 }}>
            <Row first emoji="💊" title="Renouveler l'ordonnance" who={partner} />
            <Row emoji="🧹" title="Aspirateur salon" who={me} />
          </Card>
          <Text style={[font.caption, { textAlign: 'center', marginTop: 12, lineHeight: 17 }]}>Plus de points. Une ratée coûte un cœur à Mochi ; rattrapée, il le récupère.</Text>
        </View>
      </ScrollView>
      <Tabs active="balance" />
    </>
  );
}

// ─── 5 · Check-in d'humeur + ressenti vs réel ───────────────────────
function Humeur() {
  const opts = [{ e: '😮‍💨', l: 'Chargée' }, { e: '🙂', l: 'Ça va' }, { e: '☀️', l: 'Légère' }];
  return (
    <View style={{ flex: 1, paddingHorizontal: space.screenX }}>
      <View style={{ alignItems: 'center', paddingTop: 54 }}>
        <MochiImage size={96} mood="wink" />
        <Text style={[font.hero, { fontSize: 24, marginTop: 16 }]}>Bonjour Ketley, tu te sens comment ?</Text>
        <Text style={[font.secondary, { marginTop: 6 }]}>10 secondes, chaque matin. Julian a répondu « ça va ».</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 26 }}>
        {opts.map((o, i) => (
          <Card key={o.l} padding={14} style={{ flex: 1, alignItems: 'center', gap: 6 }} accent={i === 0 ? colors.coral : undefined}>
            <Text style={{ fontSize: 34 }}>{o.e}</Text>
            <Text style={[font.row, { fontWeight: i === 0 ? '600' : '500' }]}>{o.l}</Text>
          </Card>
        ))}
      </View>
      <View style={[s.sectionHead, { paddingHorizontal: 5 }]}><Text style={font.sectionTitle}>Ce que Mochi en retient</Text></View>
      <Card r={radius.cardLg} padding={16}>
        <Text style={[font.body, { lineHeight: 21 }]}>Cette semaine tu as fait <Text style={{ fontWeight: '700' }}>42 %</Text> des missions mais tu t'es sentie chargée <Text style={{ fontWeight: '700' }}>5 jours sur 7</Text>. C'est la charge qu'on ne voit pas dans le planning.</Text>
        <View style={{ marginTop: 14, gap: 10 }}>
          <View><View style={s.gaugeHead}><Text style={font.caption}>Missions faites</Text><Text style={font.caption}>42 %</Text></View><ProgressBar ratio={0.42} color={me.color} track={colors.line} height={8} style={{ marginTop: 4 }} /></View>
          <View><View style={s.gaugeHead}><Text style={font.caption}>Charge ressentie</Text><Text style={font.caption}>71 %</Text></View><ProgressBar ratio={0.71} color={colors.coral} track={colors.line} height={8} style={{ marginTop: 4 }} /></View>
        </View>
        <Text style={[font.caption, { marginTop: 12 }]}>Mochi le dira à Julian dimanche, avec vos mots, pas des chiffres.</Text>
      </Card>
      <View style={{ flex: 1 }} />
      <CTAPrimary big label="C'est noté" style={{ marginBottom: 40 }} />
    </View>
  );
}

export default function ProtoFinch() {
  const { s: screen = 'accueil' } = useLocalSearchParams();
  const body = { accueil: <Accueil />, balade: <Accueil gone />, malade: <Accueil sick />, retour: <Retour />, chambre: <Chambre />, croissance: <Croissance />, humeur: <Humeur /> }[screen] || <Accueil />;
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>{body}</SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  header: { paddingTop: 16, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 10 },
  mochiBlock: { paddingTop: 22, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'center', gap: 16 },
  sectionHead: { paddingTop: 26, paddingBottom: 9, paddingHorizontal: space.headerX, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 13 },
  gaugeHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  gaugeMeta: { fontSize: 13, fontWeight: '500', color: colors.muted },
  ghost: { width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.checkRing, alignItems: 'center', justifyContent: 'center' },
  objBox: { width: 54, height: 54, borderRadius: 14, backgroundColor: alpha(colors.ink, 0.04), alignItems: 'center', justifyContent: 'center' },
  heroName: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
});
