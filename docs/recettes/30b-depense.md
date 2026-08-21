# Recette · Formulaire dépense (pas d'artboard ; même DNA que 30 et que les cards crème)

Route `app/depense.js`, déclarée en `transparentModal` (fade) dans app/_layout.js → l'écran dessine lui-même :
1. Scrim encre 35 % (FadeIn 200 ms), tap → `router.back()`.
2. Sheet collée en bas (SlideInDown 320 ms) : fond card, radius haut 26, séparation 1px `sheetLine`, padding top 10,
   hauteur max 92 % (marge haute = inset + 24). Poignée 36×5. KeyboardAvoidingView autour.
3. Header (padding 0 23 4, row space-between) : titre 22/600 tracking −1,1 · bouton × 32 rond crème + hairline.
4. Sections avec micro-label 11,5/600 uppercase, marge haute 18 / basse 9 (padding horizontal 23) :
   - Intitulé : Card radius 16 padding 0, TextInput 17/600 padding 15 18.
   - Montant : Card, TextInput 24/700 tabular tracking −1,2 (decimal-pad) + « € » 20/600 muted.
   - Payé par : 2 boutons flex 1 = Card padding 10 12, row gap 10, Avatar 28 + prénom 15/500 ;
     sélectionné = bordure accent 1,5 couleur du membre.
   - Catégorie : chips (wrap, gap 8) : crème + hairline radius 999 padding 9 13, 13,5/500 ; actif = fond encre texte card.
   - Date : chips « Aujourd'hui » / « Hier » même style (sélecteur complet plus tard).
5. Footer blanc (borderTop `footerLine`, padding 12 18, bas = max(inset, 26)) avec CTAPrimary « Ajouter la dépense »,
   désactivé tant que intitulé vide ou montant ≤ 0. Validation = `router.back()` (persistance Supabase à venir).
