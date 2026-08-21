# Recette écran 18 · Ping sheet (source : duo-v3-social.jsx › PingSheetV3)

Présentation : modale transparente (`presentation: 'transparentModal'` à déclarer par l'intégrateur dans app/_layout.js),
paramètre `?occ=<id occurrence>` (useLocalSearchParams). Fermeture = tap scrim ou envoi → `router.back()`.

Couches, de l'arrière vers l'avant :
1. Scrim plein écran encre 35 % (`rgba(26,26,31,0.35)`), fade 200 ms (FadeIn). Pressable → back.
2. Tâche source « surélevée » : Card crème radius 16, padding 13×16, top 150 (sous la safe area), marges 24.
   Rangée : emoji 19 · titre 16/600 · sous-titre 12/400 muted (« {heure} · chez {prénom} ce soir ») · Avatar 26 de l'assigné.
   C'est la SEULE ombre portée de l'app hors CTA/FAB (artboard : 0 20 48 encre 35 %) → shadow ink 0.35 / radius 24 / y 12.
3. Sheet bas : fond `#FAFAF7`, radius haut 26, padding 10 18 31, séparation haute 1 px encre 8 % (README ; l'artboard met
   une ombre 0 −12 40 encre 25 % — on suit le README « 0 −1px »). SlideInDown 320 ms.
   - Poignée 40×4 radius 2 encre 15 %, centrée, marge basse 14.
   - Ligne titre (marge basse 11) : micro 11,5/600 uppercase tracking 1,4 muted « Envoyer un ping à {prénom} » (flex 1)
     + chip « {emoji} tâche attachée » 11/600 muted, padding 8×10, radius 999, fond encre 5 %.
   - 4 options (réponses préformatées, zéro texte libre) : Card crème radius 14, padding 13×14, marge basse 6, gap 13 :
     emoji 19 · label 15,5/600 + sous-texte 12/400 muted marge 3 · chevron › 16 muted.
     Clés copy.pings.options : reminder (🌷), turn (emoji de la tâche), deadline (⏰, `{time}` = fenêtre/heure de l'occurrence ;
     option masquée si aucune heure), takeover (🤝).
   - Tap option = haptique légère + `router.back()` (l'envoi réel viendra avec Supabase : table activity, type ping, preset_key).
