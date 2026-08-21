// Écrans 01-05 · Onboarding (pitch, jamais revu). Un seul pager horizontal paginé.
// Recette : docs/recettes/01-05-onboarding.md · slides : src/components/onboarding/
import React, { useRef, useState, useCallback } from 'react';
import { router } from 'expo-router';
import { View, FlatList, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnbHeader, SourceLine, CtaOnb, onb } from '../../src/components/onboarding/extra';
import { Slide01, Slide02, Slide03, Slide04, Slide05 } from '../../src/components/onboarding/slides';
import copy from '../../src/data/copy.json';
import { colors, space } from '../../src/theme';
import { dailyGapLabel } from '../../src/demo-onboarding';

const t = copy.onboarding;
const SLIDES = [Slide01, Slide02, Slide03, Slide04, Slide05];
// ligne de source affichée au-dessus du CTA (slides 01 et 03)
const SOURCES = { 0: t.s1Source, 2: t.s3Source.replace('{daily}', dailyGapLabel()) };

export default function Onboarding() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const list = useRef(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const finish = useCallback(() => router.replace('/(setup)/identite'), []);
  const next = useCallback(() => {
    if (last) return finish();
    list.current?.scrollToIndex({ index: index + 1, animated: true });
  }, [index, last, finish]);

  const onMomentumScrollEnd = useCallback(e => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(Math.max(0, Math.min(SLIDES.length - 1, i)));
  }, [width, index]);

  const bottom = Math.max(insets.bottom, 24);
  const headerH = insets.top + 30; // en-tête fixe : padding 14 + barres/« Passer » ~16
  const renderItem = useCallback(({ item: Slide, index: i }) => <Slide width={width} headerH={headerH} active={i === index} />, [width, headerH, index]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        ref={list}
        data={SLIDES}
        keyExtractor={(_, i) => String(i)}
        renderItem={renderItem}
        extraData={index}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={{ flex: 1 }}
      />

      {/* en-tête fixe : pagination (5 barres) + « Passer » sur 1-4 */}
      <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top, left: 0, right: 0 }}>
        <OnbHeader step={index + 1} total={onb.total} skipLabel={t.skip} onSkip={finish} showSkip={!last} />
      </View>

      {/* pied fixe : source (01, 03) + CTA */}
      {SOURCES[index] ? (
        <View pointerEvents="none" style={{ position: 'absolute', bottom: bottom + 54, left: 22, right: 22 }}>
          <SourceLine>{SOURCES[index]}</SourceLine>
        </View>
      ) : null}
      <View style={{ position: 'absolute', bottom, left: space.screenX, right: space.screenX }}>
        <CtaOnb label={last ? t.start : t.next} onPress={next} />
      </View>
    </View>
  );
}
