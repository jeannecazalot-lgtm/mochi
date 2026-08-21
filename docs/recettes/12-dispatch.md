# Recette écran 12 · Proposition de dispatch (source : duo-embossed-setup.jsx › SetupDispatch)

1. Fond + GlowBg `soft`. Pas de pastille d'étape : titre « Mochi a réparti vos tâches. » + « Tout est ajustable. Promis. ».
2. Bloc padding 18 23 0 : Card **accent sage 1,5** radius 20, padding 17×18, marge basse 14, rangée gap 14 :
   - état 21/600 tracking −0,6 (« Équilibré » si écart < 10 %, sinon « Ça penche ») ;
   - sous-ligne 13/400 muted : charges hebdo en encre 600 tabulaire (« 3h50 Valentin · 3h10 Jeanne / sem ») ;
   - barre 80×8 radius 4 piste encre 10 %, segments sky / lavender proportionnels.
3. Liste scrollable padding 0 18 110 : Card radius 12 padding 11×14 marge 6, rangée gap 10 :
   emoji 19 · titre 16/500 + « créneau · {min}min » 13/400 muted · Avatar 26 de l'assigné, ou paire V/J 26 avec anneau crème et chevauchement −8 si partagée.
4. Bas : « Modifier » (secondaire flex 1) + « C'est parti → » (primaire flex 1,6), gap 8, bottom 24. Les deux mènent à 13 (enchaînement demandé).
Chiffres calculés : `weeklyLoad` / `balanceState` (src/demo-setup.js) — l'artboard écrivait 4h30 / 4h48 en dur.
