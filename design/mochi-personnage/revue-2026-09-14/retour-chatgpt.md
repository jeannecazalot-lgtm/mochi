# Retour ChatGPT — revue visuelle et animations de mochi (14 sept 2026)

Conversation : https://chatgpt.com/c/6aa83d08-1fcc-83eb-8772-5ec031991746 (compte ChatGPT de Jeanne, modèle en mode « High »).
Entrée : les 4 planches de ce dossier + `prompt-revue.md`. Captures réelles du simulateur iPhone 16 Pro Max, données de test.
Réponse intégrale ci-dessous, non retouchée (seule la mise en forme du tableau a été reprise).

---

Le problème principal n'est pas la quantité d'idées : c'est que le système visuel n'est pas encore verrouillé. Aujourd'hui, je vois trois produits superposés : un onboarding pastel très doux, un gestionnaire de tâches beaucoup plus rouge/dense, et des écrans spéciaux type Budget/Wrapped qui partent encore dans une autre direction. Le Mochi actuel accentue cet écart parce qu'il ressemble davantage à un objet 3D/emoji qu'à une mascotte issue du langage « Embossed Crème ».

## 1. Le personnage Mochi

**Ce qui marche**
- La silhouette extrêmement simple est la bonne décision. On reconnaît immédiatement le personnage, il ne prend pas beaucoup d'espace et il peut devenir un repère constant de l'app.
- Le corail fonctionne également : au milieu du crème, du jaune pâle et du vert très léger, Mochi devient naturellement le point focal. Il n'a pas besoin d'accessoires ni de détails supplémentaires.
- L'idée que son corps matérialise l'équilibre du foyer est beaucoup plus intéressante que de simplement lui faire afficher des émotions. C'est là que se trouve le potentiel de la mascotte.

**Ce qui cloche**
1. Il ne ressemble pas vraiment à un mochi. Trop rond, trop tendu, trop brillant. Avec le reflet blanc, le dégradé rouge-orange et le volume très sphérique, on lit : boule en plastique, bonbon, bouton 3D ou emoji. La matière devrait être mate, souple, légèrement poudrée, avec une base un peu écrasée. Il faut sentir qu'il pourrait se déformer.
2. Il appartient à un autre univers graphique que l'interface. Les cards sont presque plates, filets très fins, surfaces crème, peu de contraste. Mochi a un highlight 3D fort et beaucoup de modelé : il paraît importé dans l'UI plutôt que construit avec elle. Réduire le rendu volumétrique d'au moins 50–70 %.
3. Le fait qu'il « penche » n'est pas assez lisible dans sa forme. Avec un cercle presque parfait, tourner de quelques degrés ne change quasiment pas la silhouette. Il faut une forme légèrement asymétrique, plus large en bas, pour que 5–10° d'inclinaison deviennent immédiatement perceptibles.
4. Le visage ne survivra pas très bien à 34 px. Les yeux et surtout la bouche deviennent des micro-détails ; triste/neutre/heureux ne diffèrent que de 2 ou 3 pixels. À 34 px : un alphabet limité, deux yeux + une bouche très simple, 4–5 états validés à taille réelle.
5. Son expression est trop « emoji ». Le petit visage centré sur une sphère brillante pousse vers le kawaii. Faire porter davantage l'émotion par la posture du corps que par le visage.

**Trois pistes définitives**
- A — Mochi galet mat. Forme basse et légèrement écrasée, corail très doux, matière mate avec un unique reflet diffus, visage minimal et déséquilibre exprimé principalement par la silhouette.
- B — Mochi perle crème. Corps crème nacré presque monochrome avec un reflet corail très léger sur un côté, volume extrêmement subtil et visage noir net : probablement la piste la plus premium/adulte.
- C — Mochi élastique. Forme simple presque plate, sans véritable rendu 3D, qui se comprime, s'étire et penche légèrement selon la charge : la piste la plus forte si l'interaction doit devenir l'identité.

« Je choisirais C ou un hybride A/C. Le personnage doit devenir vivant par son mouvement, pas par des effets de matière. »

## 2. Visuel écran par écran

Avant le détail : verrouiller quatre composants communs, Card, Task Row, Chip et CTA. Ils changent trop souvent de comportement visuel d'un écran à l'autre.

### Planche 1
- **01 Onboarding** : le 10h/sem. domine bien, mais label au-dessus + barre + texte créent trois niveaux de plus ; épurer autour du chiffre + une phrase. Le bas est encombré entre la source INSEE et le CTA : la source ne devrait pas flotter juste au-dessus du bouton principal.
- **09 Invite** : trop de vide entre la card centrale et les actions basses, « J'ai reçu un code » paraît accidentel ; le centre de gravité doit descendre. Avatars + Mochi + quatre points + titre = plusieurs symboles successifs sans hiérarchie ; supprimer au moins un niveau.
- **10 Tâches** : liste trop dense (picto + libellé + cercle + ajout + CTA) ; réserver un vrai espace au footer pour que « Lancer » ne recouvre jamais la liste. Les pictos multicolores/emoji contrastent avec la DA adulte : une famille unique de pictos 14–16 px (SF Symbols ou custom mono).
- **12 Dispatch** : l'écran le plus chargé du setup ; la tâche n'est plus le premier niveau de lecture. La grammaire des rows change trop par rapport au 10 : donner l'impression d'enrichir la même ligne, pas de changer de composant.
- **17 Accueil** : Mochi + phrase d'état encore trop petits pour l'importance conceptuelle de l'équilibre ; 15–20 % de présence en plus. Les labels « EN RETARD » écrasent tout : jamais bordure + pill + texte rouge en même temps, un seul signal.
- **19 Planning** : header très chargé (titre, Semaine/Mois, sept jours, indicateurs, liste) ; réduire la compétition entre le segmented control et le calendrier. Le contour rouge complet des retards est trop fort : petite barre latérale, texte rouge ou fond teinté à 4–6 %.
- **21 Balance** : le cœur du produit et l'un des écrans les plus faibles. Mochi petit, deux « 0 min » énormes, graphe presque vide. Les pills noires « +4.5 » ressemblent à des boutons : réserver le noir plein aux vraies actions.
- **23 Budget** : moitié basse vide, dette enfermée dans une grosse card ; la liste des dépenses pourrait structurer davantage. Le CTA noir « On est à zéro » est plus agressif que le reste de l'app.

### Planche 2
- **20 À faire** : trop de métadonnées avant la première tâche (compteur, quatre filtres, section, nombre, bordures rouges, malus). C'est là que l'incohérence des Task Rows est la plus visible : Accueil, Planning et À faire doivent partager le même composant.
- **22 Suivi** : les aplats vert/rose/orange ressemblent à des notifications ; la couleur encode sans signification évidente. Une timeline très sobre : date, icône, événement, heure, séparateur fin.
- **22b Balance détail** : trop de vide alors que « Ce qui pèse » est l'information intéressante. Quatre formulations du même message (Équilibre 0 %, phrase, deux 0 min, graphe vide) : une conclusion forte puis les preuves.
- **23b Point hebdo** : le verdict humain manque (« Cette semaine, Kima a porté davantage » + Mochi incliné). Les points rouges se lisent comme des erreurs : les malus sont une mécanique, pas une alerte.
- **24 Wrapped** : le passage au noir est trop radical, on dirait une campagne extérieure à l'app. Le 4h30 fonctionne ; supprimer une couche de cards. Une affiche, pas un dashboard sombre.
- **34 Notifications** : badge « ACTIVÉES » d'un côté, switch de l'autre : même contrôle partout (switch). L'heure 19:30 ressemble à un badge alors qu'elle est modifiable.
- **37 Paywall** : zone médiane peu dense, les deux offres paraissent équivalentes ; la sélection doit être évidente avant le CTA. Microcopie légale trop petite.
- **38 Profil** : concentre le plus de styles ; plus de respiration entre groupes, moins à l'intérieur. Pictos multicolores = « settings grand public/kawaii » ; une famille monochrome.

**Incohérences transversales** : trois manières d'afficher une tâche, plusieurs styles de CTA, plusieurs traitements du rouge, plusieurs familles d'icônes, pills noires tantôt action tantôt donnée, Wrapped qui change d'univers.

## 3. Animations existantes
- **Duo formé** : idée correcte (deux personnes viennent de connecter leur foyer ; Mochi entre les avatars explique le trio). Mais ~5 s, beaucoup trop long : après une seconde il ne se passe plus rien. Confettis génériques. Ramener à 800–1 100 ms : avatars → léger pop de Mochi → 6 à 10 particules maximum → terminé.
- **Mochi calcule** : la meilleure utilisation actuelle du personnage. Mais trois signaux de chargement simultanés (Mochi, anneaux, progression) : trop. Si le calcul dure < 1 s, animation de 600–900 ms ; s'il dure plusieurs secondes, vraie progression.
- **Célébration streak** : légitime, mais quasi la même mécanique que Duo formé. Une série devrait faire gonfler doucement Mochi de fierté ou faire apparaître une marque autour de lui ; confettis réservés aux jalons rares.
- **Ce qui manque** : les grands moments sont animés, pas les 20 petites actions quotidiennes. La causalité essentielle manque : je coche → la charge change → Mochi réagit. Viser ~80 % de micro-interactions contextuelles, 20 % de célébrations.

## 4. Propositions d'animations (classées valeur/effort)

| # | Priorité | Où / déclencheur | Animation | Durée / courbe | Pourquoi |
|---|---|---|---|---|---|
| 1 | Très forte | Task Row, coche d'une tâche | Le cercle se remplit, le check apparaît avec un très léger overshoot ; la row passe à 60–70 % puis se compacte ou quitte la section. Petit haptique. | Check 160–200 ms, row 220–260 ms. easeOut puis spring douce, damping ≈ 0,85 | L'action la plus répétée de l'app. Satisfaisante sans être gamifiée. |
| 2 | Très forte | Balance / Accueil, après toute action modifiant la charge | Mochi se déplace de 2–6 px et s'incline progressivement du côté chargé ; sa base se comprime légèrement avant de revenir. Le mouvement part de l'ancienne balance, jamais de zéro. | 280–380 ms, interactiveSpring(response 0,35, damping 0,82) | Transforme une donnée abstraite en conséquence physique. La signature du produit. |
| 3 | Très forte | Dispatch, changement d'assignation | Au tap sur Lea/Kima/Alterné, l'avatar actif glisse de quelques pixels vers son emplacement, le filet de la row reprend sa couleur. Mochi peut faire un micro-déplacement. | 200–260 ms, cubic-bezier(.22,1,.36,1) | Rend l'attribution tangible, lève le doute « mon tap a-t-il été pris ? ». |
| 4 | Forte | Ajout / modification d'une tâche | La nouvelle row apparaît depuis 8 px plus bas, opacité 0→1 ; les suivantes se repositionnent sans saut. Pas de gros bounce. | 220–280 ms, easeOut | L'utilisateur voit exactement ce qu'il vient d'ajouter. |
| 5 | Forte | Ouverture d'une tâche / réglage / filtres | Vraie bottom sheet iOS : montée native, coins fixes, fond atténué ; au swipe down la feuille suit le doigt. | 300–380 ms, spring native iOS | Familier, rapide, cohérent avec une app iOS adulte. |
| 6 | Forte | Navigation entre onglets | Crossfade du contenu + déplacement horizontal de 4–6 px selon la direction ; l'icône active change sans rebond. | 160–220 ms, easeOut | Continuité et orientation sans ralentir. |
| 7 | Moyenne/forte | Planning, changement de jour/semaine | Les cards sortent dans la direction du swipe, les nouvelles prennent leur place ; le jour sélectionné se déplace sous le doigt. | 220–300 ms, interactiveSpring légère | Vraie géographie temporelle, précédent/suivant clairs. |
| 8 | Moyenne | Balance, franchissement d'un seuil | Le trait central se décale puis Mochi suit avec 60–80 ms de retard ; le visage change seulement à la fin. | 350–450 ms, spring douce | On perçoit le changement d'état et sa cause. |
| 9 | Moyenne | Mochi calcule (fin du setup / recalcul) | Mochi se comprime, deux anneaux très fins partent de lui ; au résultat, les anneaux disparaissent et Mochi se place dans son inclinaison finale. Pas de barre si le calcul est court. | 650–900 ms, easeInOut puis spring finale | Le chargement devient une transition vers le résultat. |
| 10 | Moyenne/faible (rare) | Duo formé / streak / jalon hebdo | Animation plus généreuse réservée aux événements rares : pop de Mochi, 6–12 particules abstraites aux couleurs de la DA, stabilisation. Jamais de boucle. | 800–1 100 ms, spring + easeOut | La rareté donne de la valeur à la célébration. |

**Règle proposée, trois niveaux de mouvement** : niveau 1, 150–250 ms (tap, check, chips, tab) · niveau 2, 250–450 ms (modifications structurelles, Balance, sheets) · niveau 3, 700–1 100 ms (événements exceptionnels seulement). Prévoir un mode Reduce Motion : pas de flottement permanent, pas de squash exagéré, fades courts.

« Le flottement actuel du Mochi sur l'Accueil est dispensable. Un personnage qui bouge en permanence devient du bruit. Presque immobile au repos, réaction claire quand quelque chose se passe. »

## 5. Les 5 changements à faire en premier
1. **Refaire Mochi avant de multiplier ses animations** : version finale pensée d'abord à 34 px, silhouette asymétrique, base aplatie, matière mate, 4–5 expressions. Puis le héros à partir de ce modèle.
2. **Un véritable mini design system** : une Task Row, une Card, une famille de Chip, une hiérarchie de CTA, une famille d'icônes. Le changement qui ferait paraître l'app « finie » le plus vite.
3. **Faire de la Balance le langage visuel central** : Accueil, Balance, Balance détail, Point hebdo et Wrapped racontent la même chose : centre → charge → déplacement → Mochi qui penche.
4. **Retirer environ la moitié des signaux rouges et des contours** : jamais bordure + fond + texte + pill sur la même information.
5. **Passer d'animations « spectacle » à des animations de causalité** : cocher → attribuer → déplacer → équilibrer → Mochi réagit. Confettis, Wrapped et célébrations viennent après.
