# Recette écran 16 · Détail tâche (source : duo-v3-fiche.jsx › TaskDetailV3) → app/task/[id].js

1. Fond + GlowBg `soft`. Header : chevron retour à gauche, « TÂCHE » au centre, rond 36 « ··· » à droite → edit?id=.
2. Contenu padding 22.
   - Héro : card radius 18, padding 12×14, marge basse 8 ; rangée gap 11 : LiveMochi 56 ; colonne : PillLabel catégorie
     (sageDeep domestique / lavenderDeep mental), titre 20/600 tracking −0,7, sous-texte 12/400 muted
     (« Toi cette semaine · jeudi · ≈ 45 min · divisible »).
   - Micro-label « CHECKLIST · PAR {prénom} » 11,5/600 uppercase tracking 1,4 muted, marge basse 5.
     Card radius 14, padding 8×11 ; rangées padding 9×0, séparateur 1 px encre 6 %, gap 8 ;
     case 18 radius 6 : bordure 1,5 encre 22 % / fait = fond sage + ✓ blanc 9 px (stroke 2,4) ;
     texte 14,5/400, fait = barré opacité 0,5. Tap = bascule (animation useCheckPop).
   - Micro-label « LES 5 DERNIÈRES FOIS » ; card radius 14, padding 9×13 ; 5 colonnes espacées :
     Avatar 30 couleur du slot + date 9,5/500 muted (gap 4) ; phrase bilan 12/400 muted centrée, marge 7.
3. Footer blanc padding 9 14 16, colonne gap 6 centrée : CTA « Marquer fait » 16/600 + indice 12/400 muted.
