# Recette écran 23 · Budget (source : duo-v3-core.jsx › BudgetV3)

1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 14 23 0, marge basse 11) : titre 22/600 tracking −1,1 · sous-titre 13,5/400 muted marge 4
   « Dépenses partagées · {Mois} » (mois depuis `today`).
3. Card solde (marges 22, radius 20, padding 18 20, centré) : PillLabel « SOLDE » lavender (marge 9) ·
   phrase héros 24/700 tracking −1,2 tabular, montant en CountUp 500 ms (`budget.owes`) ·
   « {total} dépensés à deux ce mois » 13,5/400 muted marge 6.
   Boutons (row gap 8 marge 14) : « On est à zéro » pill encre texte card 14,5/600 padding 11 14 ·
   « Rappeler » pill encre 5 % 14,5/500. (Actions non branchées : pression visuelle seulement.)
4. Micro « DERNIÈRES DÉPENSES » 11,5/600 tracking 1,4 (padding 0 22 8).
5. Rangées (marges 18) : GlassRow radius 14 padding 11 14 marge 6 gap 13 : emoji 19 · titre 15,5/500
   + pill « VIA TÂCHE » 9,5/700 tracking 0,6 sage 25 % / sageDeep si `via_task` · sous-texte 12/400 muted marge 3
   (« hier · en cochant « Courses » · toi » / « ven 4 · payé par Jeanne ») · montant 15/600 tabular · Avatar 24 du payeur.
   Dépenses triées par date décroissante.
6. Indice centré 12/400 muted marge 4.
