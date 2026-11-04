# DA v2 · « Mochi qu'on élève » — recette (3 nov 2026)

Décision Jeanne (3 nov 2026) : option B validée (Mochi partagé par le foyer, qu'on fait grandir
à deux ; énergie, balade, cœurs à la place des points, croissance par l'équilibre, chambre + perles,
check-in d'humeur). Demande : réinventer complètement la DA, et travailler l'expérience de Mochi
(évolution, points, etc.). Règle maintenue : app utilitaire, hyper facile ; le jeu habite l'Accueil
et la chambre, Planning / Budget / Suivi restent des outils.

## 1. L'expérience Mochi (système)

### Stades (5) — par semaines « saines » cumulées, jamais consécutives (pas de streak)
| Stade | Condition | Taille à l'écran |
|---|---|---|
| Œuf | création du foyer ; éclot quand CHACUN a coché sa première mission (moment fondateur à deux) | 0,6 |
| Mini | à l'éclosion | 0,75 |
| Mochi | 3 semaines saines | 1 |
| Maxi | 8 semaines saines | 1,15 |
| Doré | 16 semaines saines (≈ 4 mois) — forme finale, teinte dorée | 1,25 |
Semaine saine = balance sous le seuil « warn » ET ≥ 80 % des missions du foyer faites ET pas de
semaine « malade ». Pas de régression de stade, jamais.
Le mot « bébé » n'apparaît pas (question Jeanne 3 nov : angoissant pour un couple) ; noms de
tailles ci-dessus, à valider.

### Énergie du jour (jauge)
- 1 segment par mission prévue aujourd'hui pour le FOYER (les deux). Reset à minuit.
- Pleine → Mochi part en balade (2 h). ≥ 60 % à 21 h → petite balade (perles seulement, pas de souvenir).
- Elle ne se remplit jamais « à moitié par personne » : c'est le foyer qui nourrit Mochi.

### Balade → souvenir
- Rapporte 12 perles + 1 souvenir (collection de 40, par lieux débloqués avec le stade :
  jardin → rivière → forêt → ville → plage → montagne). Une mission « à deux » faite ce jour → souvenir rare.
- Retour affiché plein écran à la prochaine ouverture (pas d'obligation d'ouvrir le soir).
  Notification « Mochi est rentré » seulement si les notifs sont activées.

### Forme (cœurs, remplace les points de malus)
- 5 cœurs. −1 par mission ratée (à l'échéance). +1 par ratée rattrapée (immédiat). +1 par journée
  à jauge pleine. Plancher 1 : il ne meurt pas, ne régresse pas.
- 5 : en forme · 4-3 : boude (phrases sèches, balades courtes) · 2 : patraque (plus de balade,
  chambre grisée) · 1 : malade (il dort, la semaine ne compte pas pour la croissance,
  message « Mochi a besoin de vous deux »).
- Jamais de notification « Mochi va mal ». Jamais de « toi » : Mochi parle du foyer.

### Perles (monnaie commune au foyer)
| Action | Perles |
|---|---|
| mission cochée | 3 |
| mission mentale | 4 |
| mission « à deux » (chacun) | 5 |
| journée pleine / balade | 12 |
| petite balade | 5 |
| check-in du matin | 1 |
| quête de couple | 30 |
Rythme attendu ≈ 190 perles / semaine → un objet par semaine en gratuit.
Prix : petit objet 40-60 · moyen 80-120 · gros 200-300 · tenue 60-150.
Mochi+ : collections saisonnières, tenues rares, 2e pièce (jardin). JAMAIS de multiplicateur de
perles ni d'utilitaire derrière le paywall.

### Quêtes de couple (1 par semaine, proposée le lundi, jamais obligatoire)
« Échange » (faire une mission de l'autre) · « Journée parfaite » (jauge pleine) · « Dimanche
net » (0 retard dimanche soir) · « Mental » (3 tâches mentales par celui qui en porte le moins).
Récompense : 30 perles ; V3 : un œuf de compagnon qui vit dans la chambre.

### Moments forts (plein écran, les deux le reçoivent)
Éclosion · passage de stade · 1er souvenir · retour de balade · pièce complète.

## 2. Trois directions de DA (rendues dans /proto-da?v=recre|maison|veilleuse)

### A · « Récré » — jeu doux, pastel pop (le plus proche de Finch)
- Fond : ciel #EAF4FF → crème #FFF8EA, colline sage derrière Mochi (il est « dehors »).
- Cartes blanches, radius 22, bordure 2 px #E6E1F3 + bord bas 4 px (effet jouet).
- Encre indigo doux #2E2A4A, muted #8B86A6. Accents saturés : corail #FF8A73, menthe #7ED3A6,
  beurre #FFD166, ciel #7FB8F0, lavande #B59CF2.
- Titres ArialRoundedMTBold, corps système. Jauges épaisses 14 px avec médaillon ⚡ / ♥.
- Mochi grand (150) au centre, ombre douce, bulle de dialogue.

### B · « Maison » — nid chaleureux, tactile, terracotta
- Fond papier chaud #F7F0E4. Cartes #FFFBF3, radius 26, ombre diffuse (0 8 24 · 6 %) à la place du hairline.
- Encre brun #3A2E28, muted #9A8B7E. Accents : terracotta #D97757, olive #7E9463, ocre #E0A93F, prune #8A6B9E.
- Titres Georgia (serif éditorial), corps système.
- Mochi dans sa chambre dès l'Accueil : bandeau « pièce » en haut (mur + sol + ses objets).
  La boutique = brocante.

### C · « Veilleuse » — nuit douce, Mochi lumineux
- Fond nuit #1C1B33 → #2B2650, étoiles discrètes. Cartes verre sombre (blanc 8 % + bord blanc 12 %), radius 20.
- Encre #F4F1FF, muted #A9A4C8. Accents lueur : corail #FF9C8A, menthe #8FE3C0, miel #FFD98A, lavande #C9B6FF.
- Titres AvenirNext-DemiBold. Mochi avec halo : son énergie, c'est sa lumière.
- Risque : sombre toute la journée pour un outil → au mieux un « mode soir ».

Décision attendue de Jeanne : une direction (ou un mélange), puis recette détaillée par écran et
illustration des stades / objets à commander.

## 3. Retours Jeanne du 3 nov 2026 (après-midi) — cadre de la DA, à ne plus franchir
- REJETÉ : bord 3D « jouet » sous les cartes (déjà retiré de la v1), fonds lumière/matière (studio, fenêtre :
  « cringe »), rendus 3D réalistes d'appartement (« manga kawaii », « super gênant »), illustration façon Finch.
- RECHERCHÉ : simplicité, fluidité, lisible de 18 à 45 ans ; le premium vient de la retenue (espace, typo,
  mouvement). Mochi reste le seul élément « doux ». Son appartement existe mais dans le langage de l'app
  (formes simples, aplats crème, halos, zéro texture), il se remplit avec le temps, chaque objet = une forme.
- AIMÉ : la scène pleine hauteur bord à bord (A), Mochi dans son propre petit appartement (B/D),
  le mode jour / nuit : au choix de l'utilisateur OU automatique selon l'heure (C « Veilleuse » comme mode nuit).
- En attente : 2-3 références DA de Jeanne avant tout nouveau visuel.

## 4. Inventaire : ce que la DA doit couvrir (états et moments de l'expérience Mochi)
Chaque état a besoin d'une pose/humeur de Mochi, d'une variante jour ET nuit de la scène, d'une phrase.
| Écran / moment | États à dessiner |
|---|---|
| Accueil · scène | 5 stades (taille) × humeur (en forme, boude, patraque, malade=dort) × jour/nuit ; Mochi absent (en balade : traces + heure) |
| Accueil · jauges | énergie 0→pleine (+ animation du remplissage), cœurs 1→5, état « jauge pleine : il part » |
| Appartement | pièce vide (œuf) → pièce qui se remplit : objets = formes simples, 2e pièce Mochi+, souvenirs posés |
| Retour de balade | plein écran : Mochi revient, souvenir, perles ; variante petite balade (perles seules) |
| Éclosion | plein écran à deux : l'œuf → Mini, le moment fondateur |
| Passage de stade | plein écran reçu par les deux, nouvelle taille |
| Balance | timeline des 5 stades, semaines saines, ratées sans points (cœurs) |
| Check-in | matin : 3 états ; soir (mode nuit) : variante calme ; carte ressenti vs réel |
| Quête de couple | carte du lundi, progression, récompense (perles, œuf de compagnon V3) |
| Boutique / collection | objets, tenues, souvenirs par lieu, Mochi+ |
| Notifications | retour de balade, passage de stade, « Mochi a besoin de vous deux » (max 1/sem.) |
| Mode nuit | palette, scène, Mochi qui dort après l'heure du coucher du foyer |

## 5. DA v3 « l'instrument et la créature » (3 nov 2026, soir) — grille validée par Jeanne
Références qu'elle aime : Headspace, Gentler Streak (chaleur, formes plates sans contour) ; Teenage Engineering,
Nothing, Suno (« c'est ça le premium » : monochrome, typo forte, beaucoup d'air, zéro effet).
Application (proto app/proto-instrument.js?v=jour|nuit) :
- Interface = instrument : fond #F3F1EC / nuit #0E0E10, encre, UN accent corail (cœurs, +). Pas de cartes :
  lignes séparées par des hairlines, étiquettes en petites capitales espacées (10,5 / 600 / +1,8),
  chiffres en matrice de points 3×5 (perles, énergie), vu-mètre à 20 segments pour l'énergie, 5 points pour la forme.
- Appartement = Headspace : 4-5 formes plates sans contour, couleurs sourdes (mur, sol, fenêtre, canapé, plante),
  pleine largeur sous la barre d'état, c'est le seul endroit avec des aplats de couleur. Il se remplit avec le temps.
- Mochi inchangé (brillant), posé dans le décor plat comme un produit sur fond neutre (TE).
- Nuit : tout passe en noir, points blancs, l'appartement s'assombrit, Mochi dort. Au choix ou automatique.
- Tab bar : icônes fines, étiquettes capitales, + plat corail.

## 6. DÉCISION (3 nov 2026, soir, « fais confiance, faisons ça ») — DA v3 retenue = variante D
Mélange : étiquettes et air de B + palette de A + vu-mètre à segments + night shift. Proto : `/proto-instrument?v=d` (`&n=1` nuit).
Rejeté au passage : chiffres en matrice de points (« moins adapté »), capitales espacées partout (froid).

### Tokens à porter dans theme.js (à faire écran par écran, pas d'un coup)
| Token | Jour | Nuit |
|---|---|---|
| bg | #F7F2E9 | #0E0E10 |
| ink | #2B2420 | #F2F0EB |
| muted | #9A8F84 | #6F6D68 |
| line (hairline) | rgba(43,36,32,0.10) | rgba(255,255,255,0.12) |
| seg (segment éteint) | rgba(43,36,32,0.08) | rgba(255,255,255,0.12) |
| accent (cœurs, +) | #E0725C | #E97A6A |
| scène : mur / sol | #EFE3D3 / #E2CFB8 | #17171A / #1F1F23 |
| scène : fenêtre / canapé / plante / pot | #FBF2E2 / #D9A98F / #8FA985 / #C27A58 | #2A2A40 / #3A3530 / #2F4234 / #5A4030 |
| ombre de contact | rgba(43,36,32,0.10) | rgba(0,0,0,0.5) |

### Règles
- Pas de cartes sur l'Accueil : lignes séparées par des hairlines (StyleSheet.hairlineWidth), marges 24.
- Étiquettes en phrase normale 13,5 / 500 muted (pas de capitales). Nom « Mochi » 32 / 600 / −1. Chiffres tabulaires 15 / 600.
- Énergie = 20 segments 14 px (rayon 2, gap 3), allumés = ink. Forme = 5 points 10 px, allumés = accent.
- Scène pleine largeur sous la barre d'état, 300 px, formes plates sans contour, Mochi 150 posé sur une ombre plate.
- Night shift : au choix de l'utilisateur ou automatique (coucher du foyer) ; Mochi dort (mood sleeping), lune dans la fenêtre.
- Tab bar : hairline en haut, icônes 1,6, étiquettes 11, + plat accent 48.
- Les émojis des tâches restent (ce sont des données), taille 16.
- Ailleurs (Planning, Budget, Suivi, sheets) : on garde la DA actuelle tant que l'écran n'est pas repris ; chaque reprise suit ces tokens.

## 7. L'appartement (3 nov 2026, « vas-y tu as raison ») — composition retenue et ordre d'apparition
Point de départ = composition « Fenêtre » (`/proto-instrument?v=d&apt=4&lvl=0`), la pièce se remplit avec le temps.
Chaque objet est une forme plate sans contour, dans les tokens de scène (§6). Positions : ancrées gauche/droite,
à adapter en largeur relative avant la vraie implémentation.
| Moment (déclencheur) | Ce qui apparaît | lvl |
|---|---|---|
| Foyer créé (œuf) | mur, sol, grande arche avec le soleil (lune la nuit) | 0 |
| Éclosion (chacun a coché sa 1re mission) | la plante, le tabouret | 1 |
| 1er souvenir de balade | l'étagère, avec le souvenir posé dessus ; 5 cases, une par souvenir | 2 |
| Stade « Mochi » (3 semaines saines) | la banquette et son coussin ; étagère à 3 | 3 |
| Stade « Maxi » (8 semaines) / 1er achat | la lampe, le cadre, le tapis ; étagère pleine | 4 |
| Au-delà | objets achetés avec les perles, 2e pièce Mochi+ | — |
Règle : un objet n'apparaît jamais sans raison ; la pièce est la mémoire visible du foyer.

## 8. Décisions prises sur le tableau de bord (4 nov 2026)
- Heure de coucher du foyer : **22 h** par défaut (mode nuit automatique de 22 h à 7 h), modifiable dans les réglages. Migration 0014.
- Paywall Mochi+ : **après l'onboarding**, comme Finch — soft paywall, tout le cœur reste gratuit, on peut passer.
- Noms des stades : « pas fan » des étiquettes (Mini/Maxi, S/M/L/XL) → à reproposer avec l'écran de passage de stade.

## 9. Nuit = bleu marine (Jeanne, 4 nov 2026 : « le fond noir est trop foncé, j'aurais fait un bleu marine »)
bg #141B30 · ink #F2F0EB · muted #8E95AD · hairline/segments blanc 14 % · accent #F08A78 · scène : mur #1B2440, sol #243052, fenêtre #2E3B66.
