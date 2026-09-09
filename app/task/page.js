// Proposition C (9 sept 2026) : la fiche tâche en écran plein, poussée depuis la sheet (pas d'étirement).
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { GlowBg } from '../../src/components/ui';
import { TaskEditBody } from './edit';

export default function TaskPage() {
  return (
    <View style={{ flex: 1 }}>
      <GlowBg intensity="strong" />
      <SafeAreaView style={{ flex: 1 }} edges={['top']}><TaskEditBody page /></SafeAreaView>
    </View>
  );
}
