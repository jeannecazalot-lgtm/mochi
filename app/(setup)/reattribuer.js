// Écran 13 · Réattribuer — FUSIONNÉ dans l'écran 12 (décision Jeanne, 22 août 2026) :
// la réattribution se fait désormais directement sur la proposition de dispatch
// (tap sur une tâche = bascule vers l'autre membre). Ce fichier ne sert plus qu'à
// rediriger les anciens liens vers /(setup)/dispatch. Recette : docs/recettes/13-reattribuer.md
import React from 'react';
import { Redirect } from 'expo-router';

export default function Reattribuer() {
  return <Redirect href="/(setup)/dispatch" />;
}
