# Recette écran 22 · Activité (source : duo-v3-social.jsx › ActiviteV3)

Fond `#FAFAF7` + GlowBg `soft`. Données : `activityFeed` (src/demo-social.js = demo.activity enrichi d'heures + 2 items).

1. Header (padding 14 20 0, marge basse 6) : bouton retour rond 36 crème + hairline, flèche ← SVG 1,8 ; titre centré
   11,5/600 uppercase tracking 1,6 encre « ACTIVITÉ » ; spacer 36 à droite. Retour = `router.back()`.
2. Fil (ScrollView, padding 10 18, gap 8) groupé par jour : label centré 10,5/500 tracking 1,4 muted
   (AUJOURD'HUI / HIER / date courte).
3. Cartes (Card crème radius 16, padding 13×14, hairline) selon `type` :
   - `task_done` : Avatar 28 de l'acteur · texte 15/500 « {prénom} a terminé **{tâche}** ✅ » (tâche en 600) · heure 11/500 muted.
     Si l'acteur n'est pas moi : rangée de chips réponses (marge haute 9, marge gauche 38, gap 5) : 13/500, padding 8×10,
     radius 999, fond encre 5 % ; sélectionnée = fond encre / texte crème.
   - `ping` : Avatar 28 · message 15,5/500 entre guillemets (copy.pings.<preset_key>) · heure.
     Bloc tâche attachée (marge 9/38) : fond encre 4 %, radius 10, padding 8×10 : emoji 16 · « {tâche} · {heure} » 13,5/500 ·
     « Voir » 12/600 sageDeep → `/task/<id>`. Puis chips réponses ping.
   - `swap_proposed` : Card accent lavender (bordure 1,5) · « {prénom} propose de te repasser **{tâche}** » · sous-ligne 12/400
     muted marge 4/38 « Si tu acceptes : +1 dette pour {elle/lui} » · 2 boutons pill (marge 9/38, gap 6, flex 1, padding 8×13) :
     Accepter = fond encre, texte crème 14/600 ; Refuser = fond encre 5 %, 14/500.
   - `swap_accepted` : même carte sans bordure, texte « {prénom} a accepté de reprendre **{tâche}** ».
   - `mochi_moment` : Card accent butter, radius 14, padding 11×16, centrée (minWidth 230) : Mochi 34 happy centré (marge 6),
     titre 14,5/600 tracking −0,2, sous-titre 12/400 muted marge 3 « +1 jour à votre streak ({n} 🔥) » avec n = demo.streak.days.
4. Note de bas de fil : 11,5/400 muted, centrée, lineHeight 17, marge haute 3 (copy.activity.note).
Aucune ombre portée. Les réponses sont des presets (copy.activity.replies) ; la sélection est un état d'écran éphémère.
