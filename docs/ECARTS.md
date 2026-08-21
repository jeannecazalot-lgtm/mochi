# Écarts artboard / README / brief — à arbitrer par Jeanne (21 août 2026)

Quand l'artboard (canvas) et le README du handoff se contredisent, on a suivi **l'artboard**. Réponds par numéro.

## Récurrents (décision globale)
1. **CTA** : artboard = texte 16/600, padding 17, posé directement sur le fond (bottom 24-26). README = 14/600 dans un footer blanc (borderTop #EBEBEB, padding 12 18 26). Fiche tâche (14-16) : artboard = footer padding 9 14 19, CTA 16/600 padding 11.
2. **Sheets** : rayon haut 26 (README/brief) vs 24 (artboard 30/33). CTA des modaux = pilule radius 999 avec halo pêche (artboard) vs CTAPrimary radius 14.
3. **PillLabel** : 9,5 px (README) vs 10,5 px (primitive du design). On est à 9,5.
4. **Ombres** : le README dit « aucune ombre hors CTA/FAB ». L'artboard en met sur : chip « aujourd'hui » du Planning (0 4 12 encre 25 %), case « aujourd'hui » du Calendrier (0 6 14 encre 28 %), carte tâche surélevée du Ping, bouton « + » du Pense-bête, toggle/option active du setup 07/10. Conservées pour l'instant.
5. **Couleur des personnes** : README = A sky, B lavender (auto). Artboards Balance colorent parfois B en coral/pêche. On suit le README.
6. **Chiffres** : tous calculés depuis les données de démo (règle « jamais écrits à la main »), donc ils diffèrent des artboards (ex. « 3 missions · 30 min » au lieu de 55 ; 48/52 → « Équilibré » au lieu de « légèrement chez… » sur Balance détail). Normal.
7. **Textes genrés / prénoms en dur** de l'artboard rendus neutres avec `{name}` (« Ça penche un peu du côté de {name} »).

## Par écran
- **09 Inviter** : « Envoyer le lien » ouvre la feuille de partage iOS puis simule l'acceptation → 09b. « Copier » inactif (expo-clipboard non installé), QR et « Saisir un code » inactifs.
- **12 Dispatch** : « Modifier » et « C'est parti » mènent tous deux à 13. « C'est parti » doit-il aller directement aux onglets ?
- **13 Réattribuer** : drag = tap tâche puis tap sur l'autre colonne (drag réel plus tard).
- **05 Onboarding** : 5 barres de pagination uniques, pas de « Passer » sur la dernière, texte « Duo » (ancien nom) conservé verbatim dans `s5Body` → à réécrire « mochi » ?
- **18 Ping** : ombre de la sheet remplacée par la séparation 1 px (README) ; carte tâche surélevée garde son ombre.
- **20 À faire** : loupe remplacée par bouton retour ; filtre « En retard » = compteur.
- **21 Balance** : un seul Mochi qui penche (brief) au lieu de deux Mochis « vs » + « Par catégorie » (artboard v2 iridescent). Push automatique vers le détail si déséquilibre > 25 % — intrusif ?
- **22 Balance détail** : CTA « Rééquilibrer avec Mochi » → écran 12 (dispatch). Bon écran ?
- **23 Point hebdo** : CTA « On repart à zéro » ajouté (brief) ; libellés malus « {tâche} · ratée / repassée ».
- **24-25 Wrapped** : 3 segments (solo, couple, partage) au lieu de 4 ; texte héros en couleur pleine (pas de dégradé de texte sans lib supplémentaire) ; « Partager » placeholder.
- **26 Bilan** : bouton retour ajouté.
- **28 Célébration** : confetti animé au lieu des pastilles statiques.
- **30 Événement** : « → Tricount » devient « → Budget ».
- **32 Pense-bête** : « foulard Hermès » → « foulard » ; cochage/ajout local ajoutés.
- **33 Mood** : aucune humeur présélectionnée ; « Mental load » → « Charge mentale ».
- **34 Notifs** : pas de flou (expo-blur non installé) ; « DUO » → mochi ; ping = preset « zéro texte libre ».
- **35 Calendrier** : mois réel (juillet 2026) ; bandeau Duo+ sous le header (contenu visible derrière pour la démo).
- **37 Paywall** : aucun prix en dur ; en simulé « Prix dans l'App Store » ; lien Politique de confidentialité **sans URL tant que legal/ n'est pas hébergé** (GitHub Pages proposé).
- **38 Profil** : 2 sections (Mes préférences / Nos règles du duo) selon brief v3 au lieu de la liste unique ; « Malus customs · 4 gages » → « Malus · réglés chaque semaine ».
- **17 Accueil** : inclinaison Mochi proportionnelle (1°/point d'écart, max ±12°) → −4° avec 48/52 (artboard −7°).
- **19 Planning** : tâches faites masquées (comme l'artboard) ; long press = état « saisi » seulement.

## À 3+ membres (le canvas est dessiné pour 2)
Balance (lean du Mochi, colonnes héros, seuils 10/25 %), « Côté {binôme} » de l'Accueil, wrapped couple, point hebdo (un seul « autre »), Budget (« X te doit ») : pas de réponse visuelle au-delà de 2. À dessiner quand on attaquera le mode foyer.
