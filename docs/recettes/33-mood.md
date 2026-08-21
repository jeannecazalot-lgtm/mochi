# Recette écran 33 · Mood check-in (source : duo-embossed-modaux.jsx › MoodCheckinEmbossed)

Présentation modale, même ModalSheet que 30 (scrim 35 %, sheet radius haut 26, grabber, padding 22). Couches :
1. PillLabel coral « DIMANCHE SOIR · CHECK-IN », marge basse 6.
2. Titre 22/600 tracking −1 ; sous-titre 14/400 muted lineHeight 20, marge haute 6, marge basse 16.
3. Rangée 5 humeurs `space-between`, marge basse 19 : cercle 52 crème hairline (actif : fond `#F5A89A`), emoji 22 ;
   label 12 dessous (gap 6), muted 400 / encre 600 si actif. Tap = sélection locale.
4. Micro-label « QU'EST-CE QUI PÈSE ? », marge basse 9 ; chips wrap gap 5 padding 8×13 radius 999 hairline,
   fond crème texte encre / fond encre texte crème si actif, 13,5/500. Tap = bascule. Marge basse 19.
5. Micro-label « UNE NOTE POUR TOI (PERSO) », marge basse 9 ; card crème radius 14 padding 14×16, TextInput multiline
   16/400 italique `inkSoft` lineHeight 22, curseur coral. Marge basse 16.
6. CTA modal pilule « Valider mon check-in » → `router.back()`.
Écarts : « Mental load » traduit en « Charge mentale » (app en français) ; état par défaut = aucune humeur choisie
(l'artboard montre « Lourd » actif), CTA désactivé tant qu'aucune humeur.
