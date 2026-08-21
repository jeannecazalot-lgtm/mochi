# Recette écran 14 · Fiche tâche (source : duo-v3-fiche.jsx › FicheTacheV3) → app/task/edit.js

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg intensité `soft`.
2. Header (padding 10×16, marge basse 8) : à gauche rond 36 crème + hairline avec chevron retour (→ router.back()) ;
   au centre titre 11,5/600 uppercase tracking 1,6 encre ; à droite rond vide 36 (équilibre).
3. Contenu padding horizontal 22, scroll vertical.
   - Héro : card crème radius 18, padding 10×12, **bordure accent 1,5 sage** (card d'action) ; PillLabel « DOMESTIQUE »
     sageDeep (10,5/600 uppercase tracking 1,4, fond sageDeep 16 %) ; titre 20/600 tracking −0,8 (TextInput si fiche vierge). Marge basse 6.
   - Micro-label de section 11,5/600 uppercase tracking 1,4 muted, marge basse 7.
   - « Quand » : card radius 14, padding 9×11, marge basse 8. Rangée Fréquence (15/500) + chip 14,5/600 fond encre 5 %,
     padding 6×9, radius 999 (tap = cycle des fréquences). Séparateur 1 px encre 6 %.
     Rangée Fenêtre d'exécution 15/500 + sous-texte 12/400 muted ; chip coral 12 % / texte coralDeep.
     Tap = déplie un sélecteur : 7 chips jours (L M M J V S D) + chips heure limite (matin · avant 14h · avant 20h · aucune).
   - « Détails » : grille 3 colonnes, gap 5, marge basse 8. Tuile = card radius 13, padding 6×10 ;
     label 9,5/600 tracking 1 muted ; valeur 19/700 tracking −0,4 ; indice 9,5/500 lavenderDeep (pénibilité du binôme).
     Tap Durée = cycle ; tap Pénib. = déplie 2 rangées d'étoiles (moi / binôme) ; tap Import. = cycle 1→5.
   - « Assignation » : card radius 14, padding 8×10, marge basse 8 ; 3 segments égaux radius 10, padding 6×8 ;
     actif fond encre / texte crème, inactif transparent ; titre 14,5/600, sous-titre 10,5/400 opacité 0,6.
   - « Options » : card radius 14, padding 8×11, marge basse 10 ; 4 rangées padding 5×0 séparées par 1 px encre 6 % ;
     titre 15/500, sous-texte 12/400 muted ; toggle 40×24 (sage actif / encre 12 % inactif, bouton 20 crème avec ombre 0 1 3 noir 20 %) ;
     dernière rangée = chevron › 16 muted qui ouvre un TextInput de note.
4. Footer blanc : borderTop 1 `#EBEBEB`, padding 9 14 19 (artboard ; le README dit 12 18 26 — on suit l'artboard).
   CTA gradient Mochi radius 14, padding 11×16, texte 16/600, ombre 0 1 2 encre 6 %.
Aucune ombre portée hors CTA et bouton de toggle.
