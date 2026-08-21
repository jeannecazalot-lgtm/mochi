# Recette écran 08 · Setup C — Préférences (source : duo-v3-setup.jsx › SetupPrefsV3)

1. Fond + GlowBg `soft`. `SetupHeader` étape 3/3 : « Ce que tu aimes (ou pas). » + sous-titre.
2. Bloc padding 17 23 0.
3. Micro-label « J'AIME BIEN FAIRE · 3 MAX » en **sage deep** (marge 9). Chips wrap gap 6, marge basse 16 :
   padding 8×13, radius 999, 14/500 encre, « emoji label ».
   · off : crème + bord intérieur 1,5 encre 10 % · on : fond `#C9E0C5` + hairline.
   Tap = toggle, 3 sélections max (4e tap ignoré).
4. Micro-label « JE DÉTESTE · 3 MAX » en **coral deep**. Mêmes chips, on = `#F5A89A`. Marge basse 19.
5. Micro-label « RAPPEL QUOTIDIEN » muted. Card radius 16 padding 14×18, rangée gap 13 :
   🔔 19 px · « Chaque jour à » 15,5/600 + « Ton récap de missions du jour » 13/400 muted marge 3 ·
   heure dans un bloc encre 6 % radius 10 padding 8×14, 17/600 tabulaire (tap = heure suivante de `reminderTimes`).
6. CTA « C'est parti » sur le fond, bottom 26, marges 18, 16/600.
Écart : les deux teintes de chips n'existent pas dans theme.js → `setupTokens` dans src/components/setup/extra.js.
