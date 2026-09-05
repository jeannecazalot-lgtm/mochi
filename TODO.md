# mochi — TODO / journal

Référence visuelle : `design/handoff/Mental free - Embossed.html` (ouvrir dans un navigateur).
Numéros d'écran = numéros d'artboard du canvas. Les écrans « v2 » du canvas ne sont pas à faire.

## Session du 1er sept 2026 — repasse de Jeanne (récap fait en fin de session)
Modifs appliquées (commits `bedcf9e`, `dee3e3e`, `7fb6efa`) :
- **CTA global** : traversée du dégradé 500 → 800 ms, easing inOut (retour « ça bug ») — à valider au doigt.
- **06** : sous-titre retiré ; phrase « Ou continue sans… » retirée ; grande photo carrée arrondie centrée + pilule « Ajouter » façon Airbnb (2 itérations : rangée « Sélectionner une photo » puis version finale).
- **08** : sous-titre et phrase d'aide retirés ; légende porte tout : « j'aime · 1 tap / je déteste · 2 taps » ; écran aéré (chips plus larges) ; « Rappel quotidien » décollé.
- **09** : lien masqué (le bouton suffit) ; « Envoyer le lien » à la place exacte du CTA des écrans précédents ; QR · partage · « Inviter plus tard » regroupés au-dessus ; la place vide du binôme « respire » ; carte « Une place t'attend » remontée sous le titre.
- **09b** : animation restaurée (avatars qui glissent, Mochi en zoom, confettis) — elle avait été neutralisée le 26/08 avec mention « à retravailler ».
- **10** : minimum 3 tâches pour continuer + lien « Passer » retiré ; « + Ajouter » remonte l'écran en haut ; « pour tout le foyer » dans le sous-titre ; bug corrigé : tâches ajoutées affichées en double.
- **Plan des écrans** : entrée « 07 · rejouer l'animation d'intro » (la démo ne se joue qu'à la première visite, d'où l'impression d'animation disparue).

- **12** : cascade d'entrée plus perceptible (45 ms d'écart) ; barre d'équilibre animée (part de 50/50, glisse vers la vraie répartition, suit chaque bascule/réglage).

Réponses données pendant la repasse :
- **12 « données en dur »** : confirmé — l'écran ne reflète ni les 3 tâches cochées ni le reste (démo figée). Total ≈ 10 h = durées estimées du catalogue (vaisselle 15 min, cuisine 40, ménage 60…) × fréquences par défaut (quotidien, 2×/sem…) — estimations à faire valider par Jeanne, modifiables ensuite par foyer via la fiche tâche. Le n×/sem vient de ces défauts, réglable sur 12 (choix du 26/08 : pas de fréquence sur le 10).
- **Accueil « infos pas bonnes »** : même cause (démo). Prochaine étape logique quand la repasse visuelle est finie : brancher la chaîne réelle 06 → 12 → Accueil (Supabase + cache local offline-first) pour que l'app affiche ce que l'utilisateur a réellement saisi.
- **Animations « disparues »** : 07 = première visite seulement ; chips du 08 statiques = retour Jeanne du 26/08 ; 09b restaurée ce jour. Émojis : rétablis volontairement le 26/08 (annulation de la passe sobre).
- **Dispatch** : écrans 11/12 = données de démo figées ; le vrai algo (tasks + pénibilités + dispos par personne) sera branché avec Supabase après validation visuelle.
- **Choix des tâches** : une fois pour tout le foyer ; dispos (07) et préférences (08) par personne, le binôme remplit les siennes en acceptant.
- **Fréquence** : défaut du catalogue par tâche, ajustable sur l'écran 12 (− n×/sem +), pas sur le 10 (retour du 26/08).

- **21 · Balance** : titre aligné sur les autres onglets, pastille « Semaine n · x au y » à sa droite sur la même ligne.
- **17 · Accueil** : nouvelle **sheet Mission** — tap sur le titre/émoji d'une mission → pop-up : temps réel passé (− / +), « C'est fait » (coche la mission, temps compté), « Je n'aurai pas le temps » (reporter/repasser, démo), « Modifier la tâche » (→ fiche 14). Le rond coche toujours directement. Accessible aussi depuis /plan.
- **17 · Accueil** : bloc « Côté Julian » retiré (redondant avec le Planning) ; espacements aérés (Mochi, sections, rangées).
- **19 · Planning** : le segment Semaine/Mois **slide dans la page** (plus de push vers l'écran 35) ; vue mois = grille calendrier du mois courant (points par membre) ; tap sur un jour → **sheet Jour** (planning de la journée). ⚠️ Question monétisation ouverte : le mois dans Planning est-il gratuit alors que 35 · Calendrier était Duo+ ?
- **Sheet Mission v2** : « Je n'aurai pas le temps » ouvre un vrai choix (Reporter à demain / Repasser à {binôme}) ; « Modifier » et « Voir la tâche » attendent la fermeture de la sheet avant de naviguer (transition lisse) ; entrée « Voir la tâche » ajoutée (détail 16, l'ancien tap direct de l'Accueil).

Décision Jeanne (1er sept 2026) : **Budget = fonctionnalité payante (Duo+)** → prévoir l'état verrouillé de l'onglet Budget (paywall 37 pour les non-abonnés). Ajouté au backlog P4/P5 ; impacte la divulgation paywall et la description ASC.

**Synchro Supabase EN MARCHE (soir du 1er sept 2026, ~23h)** : « C'est parti » (12) crée le foyer et pousse membre (dispos + temps/sem), tâches, pénibilités et occurrences de la semaine — **vérifié en base** (6 tâches, 21 occurrences). Corrections en route : file offline sans upsert (`ON CONFLICT` refusé par la RLS avant d'être membre), ids de tâches stables entre synchros (rejouer ≠ dupliquer), `drain()` pour vider la file, **migration 0002 appliquée** (le créateur d'un foyer peut le lire avant d'en être membre — deadlock RLS). Base purgée par Jeanne le 1er sept 2026 au soir (foyers orphelins + users anonymes de test supprimés) — il ne reste que le foyer réel et ses données.

**Branchement réel (soir du 1er sept 2026)** : algo de dispatch (SPECS §2) en fonction pure + 10 tests node ; chaîne 07 → 08 → 10 branchée sur `src/setup-state.js` (local, offline-first) ; le 11 calcule sur les vraies saisies (binôme simulé au même budget tant que l'invitation réelle n'existe pas) ; le 12 affiche le vrai résultat — **vérifié au simulateur** (3 tâches cochées → 3 tâches réparties, totaux exacts). Reste : Accueil/Planning sur les vraies occurrences, synchro Supabase (bloquée par Anonymous sign-ins), invitation réelle.

Décisions Jeanne (1er sept 2026, soir) :
- **Le foyer solo n'existe pas** — l'app est duo/foyer uniquement (remplace « solo = foyer à 1 » du 21 août). Impacte : textes des états vides, place de l'invitation, algo (jamais 1 seul membre).
- Splash screen + paywalls (dont Budget verrouillé) : à faire, « plus tard ».
- Écrans restants (21 ratée, 22 fil, 23 point hebdo, rappels, Realtime) : « plus tard ».
- Questions sheet Mission / libellé photo / fréquence sur 10 / émojis maison : « on verra plus tard ».

## Nuit du 1er au 2 sept 2026 — les 7 chantiers construits (Jeanne : « fais tout ce que tu peux »)
Tout est branché et vérifié au simulateur (~20 commits). Détail :
1. **Identité réelle partout** : prénom + photo du profil substitués à la démo dès la racine, Avatar affiche les photos (14 écrans). Vérifié : header Accueil, fiche (« Toujours pour Jj »), carte du 09.
2. **Génération des jours** : occurrences placées selon la grille du 07 (5 tests node) ; porteur **« Alterné »** sur le 12 (zigzag) ; sheet Mission → **« Déplacer à… » avec rangée de jours** (refus si doublon) ; **fiche tâche 14 branchée au réel** (chargement + Enregistrer persiste tasks/task_pains ; les occurrences existantes ne bougent pas — la fenêtre s'applique à la prochaine génération).
3. **Planning réel** : occurrences par jour (semaine réelle), **coche directe** (mes tâches + communes), **tap sur un jour → défilement**, points de couleur réels, retard **encadré corail** → sheet 21. Drag réel : toujours pas fait (visuel seulement).
4. **Écran 21** (sheet assigné, maquette Jeanne) : je le fais / repasser (démo) / décaler à demain. **Rappels locaux réels** : récap par jour d'occurrences à l'heure du 08, reprogrammés à chaque synchro/déplacement ; permission demandée au 08. Vue lecture du non-assigné : avec le vrai binôme.
5. **Balance réelle** (SPECS §3) : score des occurrences cochées (validation → statut done + minutes réelles + copie figée partout : sheet, Accueil, Planning, 21), chart 7 jours réel, streak réel. Malus : en attente de la table.
6. **Budget verrouillé Duo+** (cadenas + PremiumGate → paywall 37, vérifié) ; **splash Mochi dessiné** (visible au prochain build EAS).
7. **Invitation réelle** : code Supabase 6 car. affiché sur le 09 (vérifié : F422U9) + partagé ; sheet **« Rejoindre un foyer »** (RPC accept_invitation + rapatriement) ; **Realtime branché** (occurrences/tâches/membres → refresh UI ; publication déjà dans la migration 0001).
Corrigé au passage : **dates locales** (toISOString = UTC → à minuit le Planning marquait hier « aujourd'hui ») ; date d'en-tête Accueil réelle.
Fragile / à tester à deux simulateurs : parcours invitation → rejoindre → duo réel ; realtime jamais observé en conditions réelles ; « Repasser » reste démo (swap_requests non branchée) ; malus non écrits en base.

Notes Jeanne (2 sept, ~00h45) versées au backlog : animations d'apparition d'écrans (passe globale) · faire les émojis ? (question ouverte plus bas) · **faire le Mochi** (design définitif du personnage) · **faire le logo** (icône de l'app) · faire les malus (table + écritures + affichage) · faire les notifs (passe complète, contenus du 34) · **écrans « Spotify »** = Wrapped 24-25 à finir/brancher · splash screen (v1 dessinée cette nuit, à valider) · **dashboard interne** missions/malus/visuels modifiables — le kickoff le conditionnait à un modèle de données stable : c'est le cas maintenant, à cadrer ensemble.

## 2 sept 2026 (journée) — TestFlight + duo réel
- **TestFlight EN LIGNE** : app `app.annie.mochi` créée dans ASC (id 6807728388, nom provisoire « mochi (0f598b) » — « mochi » pris), build 1.0.0(3) installé par Jeanne, **Ketley invitée** (testeuse interne, déjà App Manager du compte). Clés Supabase poussées dans l'env EAS production ; `ascAppId` + team épinglés → **builds et submits 100 % autonomes désormais**.
- **Binôme réel** : le prénom/photo de qui rejoint remplacent Julian partout (chargé au join, au boot, et par realtime sur household_members).
- **Parcours joiner** : après « Rejoindre avec un code », Duo formé → Accueil (pas de re-choix des tâches).
- **Malus réels** (SPECS §4) : balayage des occurrences échues → `missed` + points `importance × (1 + retard_j × 0,5)` (assignées seulement), +1 pt au décalage depuis la sheet 21, affichage semaine sur Balance. Pas de malus manuel — conforme à la reco.
- **Repassage réel** (SPECS §6, swap_requests) : proposer depuis les sheets Mission/21, Accepter (le porteur change) / Refuser dans le fil Activité ; realtime sur swaps et malus. Compteur 3 refus/sem : à lire dans les lignes, UI plus tard.
- **Build 4 auto-soumis** (submission 628fd15a) : embarque tout ça — arrivera seul sur les 2 iPhones.
- Test à deux téléphones lancé par Jeanne & Ketley (retours « petit à petit ») ; Jeanne travaille sur la maquette du pop-up tâche.

Branchements suivants (dans l'ordre proposé) :
- [ ] **Identité réelle partout** : avatars photo + vrai prénom (aujourd'hui « K/Ketley/Julian » de démo sur 09b, 12, Accueil… alors que le profil réel — prénom, photo — est en base et affiché sur le 06). Le composant Avatar ne sait pas encore afficher une photo.
- [ ] **Génération des jours intelligente** (question Jeanne 1er sept, ~23h15) : placer les occurrences selon la grille dispos du 07 (collectée mais inutilisée — courses un jour coché, pas « aujourd'hui ») ; porteur « en alternance » sur le 12 (cycle moi → binôme → alternance → les deux, `assign_mode: 'alternate'` déjà au modèle) pour cuisine/vaisselle en zigzag ; réglage durable « toujours le jeudi » via `window_days` sur la fiche 14 ; corrections ponctuelles : **sheet Mission → « Déplacer » avec mini-rangée de jours L-D** (en premier — remplace « Reporter à demain »), puis drag sur un jour du semainier au Planning 19 (drag sur avatar = réattribuer, drag sur jour = déplacer). Constat Jeanne 1er sept : aucun endroit ne permet aujourd'hui de changer le jour d'une tâche.
- [ ] Planning sur les vraies occurrences de la semaine ; puis Balance (calcul réel) ; puis Budget (+ paywall).
- [ ] Moyennes anonymes inter-foyers pour les durées (idée Jeanne 1er sept) : agrégat par `catalog_key` côté base, jamais de données individuelles exposées ; impact privacy policy à noter.

Questions ouvertes (à trancher par Jeanne) :
- [ ] Restructuration du flux d'entrée (invitation d'abord, setup pendant l'attente, Home à états, profil façon Airbnb pour le 38) — discutée, « pas envie d'y toucher pour l'instant » ; place du foyer solo à clarifier si on y revient.
- [ ] 06 : un seul libellé « Ajouter » même quand une photo est déjà choisie — garder ou distinguer ?
- [ ] 08 : légende suffisante pour comprendre le cycle ? (le 3ᵉ tap = retour neutre n'est pas affiché)
- [ ] Voir la fréquence dès l'écran 10 ? (aujourd'hui : écran 12 seulement)
- [ ] Vue mois du Planning : gratuite ou Duo+ ? (le 35 · Calendrier mois était prévu Duo+ ; l'intégrer au Planning la rend de fait gratuite — à trancher)
- [ ] Sheet Mission : contenu suffisant ? (aujourd'hui : temps passé + fait / pas le temps / modifier / voir. Reco : rester minimal, le reste vit dans la fiche tâche)
- [ ] Émojis maison (icônes custom) à la place des émojis système ? (question Jeanne 1er sept, « pas sûre que ce soit nécessaire ». Reco : garder les émojis pour la v1 — le champ `emoji` par tâche rend le remplacement par un set SVG facile plus tard ; un set custom ≈ 50 icônes à dessiner, à décider après le premier retour utilisateurs.)
- [ ] **Deux pop-ups au tap d'une tâche** — insistance Jeanne 2 sept (~00h30) : « ça me soûle de devoir appuyer sur Modifier la tâche pour avoir le pop-up tâche, il faudra revoir le pop-up ». Le deux-étages (sheet Mission → fiche) agace ; repenser en une seule surface. Vaut aussi pour le Planning (19), dixit Jeanne. (constat initial 1er sept, minuit) : Accueil → sheet Mission (action rapide) vs 12 → fiche tâche (réglages). « Lequel est le mieux, il faudra y réfléchir. » Options : garder les deux (contextes différents), remettre « Régler la tâche » dans la sheet Mission (lien vers la fiche, masqué en mode réel ce soir), ou unifier en un pop-up à deux étages.
- [ ] **Fiche tâche depuis le 12** (questions Jeanne 2 sept, « pour plus tard ») : trop brouillon en pop-up contextuel ; rien n'indique qu'une rangée du 12 est cliquable (affordance à ajouter — chevron ?) ; les sections Détails / Assignation (redondante, le 12 assigne déjà) / Options sont-elles utiles ICI ? Piste : une fiche allégée contextuelle depuis le 12 (fenêtre de jours + fréquence seulement), la fiche complète restant l'écran 14.
- [ ] **Écran de déconnexion dédié** (Jeanne, 2 sept après-midi) : la déconnexion purge maintenant tout et renvoie à l'onboarding — mais un vrai écran « À bientôt / Se reconnecter » est à dessiner.
- [ ] **Liens d'invitation cliquables** : nécessite un domaine + Universal Links Apple (ex. annie.app/mochi/j/CODE) ; en attendant, code 6 car. + QR (fait).
- [ ] **Profil (38) : tout revoir** (Jeanne, 2 sept ~00h30) — refonte complète à prévoir, à rapprocher de sa piste « profil façon Airbnb » (photo, Mes préférences, Invite ton binôme) du 1er sept.
- [ ] Bouton pour « écrire des malus » sur Balance ? (question Jeanne 1er sept — il n'y en a jamais eu : les malus naissent d'une tâche ratée. Reco : pas de malus manuel libre, plutôt une action « marquer comme ratée » sur la tâche, qui génère le malus — garde le système objectif.)

## 3 sept 2026 — déblocage du test à deux (migration 0003)
- **Bug trouvé et corrigé** : « elle n'arrive pas à rentrer mon code et moi le sien ». Cause : le foyer naissant dès l'écran 09 (correctif build 6), **Ketley avait déjà son propre foyer solo** en ouvrant l'écran d'invitation — et la RPC `accept_invitation` refusait (`already_in_household`) quiconque a déjà un foyer. Vérifié en base : 2 foyers solo créés le 3 sept (codes X548GX et 7YB7NB actifs) + l'ancien foyer du 1er sept (2 membres, code F422U9 accepté — identités orphelines d'avant la déconnexion).
- **Migration 0003** (appliquée en prod) : rejoindre quand on est **seul** dans son foyer = on le quitte automatiquement (foyer orphelin supprimé en cascade) puis on rejoint. Refus conservés : déjà membre du foyer cible, foyer actuel à 2+ membres. **Côté serveur → aucune nouvelle build nécessaire, build 6 suffit.**
- Consigne de test : **une seule direction** — Ketley tape le code affiché sur l'écran 09 de Jeanne (pas les deux en même temps, sinon échange de foyers).
- À faire (prochaine build) : message d'erreur dédié pour `household_not_empty` (aujourd'hui il tombe sur « réseau »).
- **Décision Jeanne : lien à envoyer plutôt que code — FAIT le soir même (build 7 = 1.0.0 (12)).** Comme Tricount : Universal Links. Site sur GitHub Pages (dépôt `jeannecazalot-lgtm.github.io`, copie locale `~/mochi-site`) : AASA validé par le CDN Apple dans l'heure, page d'atterrissage `/j/?code=X` avec le code en secours, 404.html qui gère `/j/CODE`. App : `associatedDomains` + route `/j` en **auto-join** (tap du lien → foyer directement, sans saisie) ; QR = même lien https ; message de partage raccourci ; erreurs de join enrichies (foyer complet / déjà à deux). Le premier essai de build a échoué (profil Apple sans la capacité Associated Domains) → session Apple expirée, Jeanne a relancé la commande interactive (mot de passe + 2FA) et EAS a régénéré le profil. À la sortie App Store : remplacer la page d'atterrissage par la redirection Store (3 lignes côté site) + Smart App Banner.
- Ménage à faire un jour en base : petits foyers de test `T3ST*` créés par le test de non-régression du 3 sept (inoffensifs).
- **Test du lien réussi** (« le code a marché ») puis 4 retours de Jeanne sur le foyer fraîchement rejoint → cause unique : foyer vide = retombée sur la **démo figée**. Corrigé (`inRealMode()` : réel dès qu'on a un foyer, même vide) et **vérifié au simulateur** en rejouant le parcours joiner complet : Accueil vide à la vraie date, Planning semaine réelle + jour cliquable, Activité vide propre, plus de streak/fausses notifs ; Accepter/Refuser retire la carte immédiatement. **Build 8 = 1.0.0 (13)** auto-soumis.
- **Maquettes pop-up tâche livrées à valider** (gros brief dicté par Jeanne) : pop-up en deux étages (« ce moment-ci » vs « la règle »), dépense/note au moment de la validation, fin du tap-cycle de fréquence, chips d'assignation visibles, confirmation animée + « en attente de Ketley », « Voir la tâche » supprimé → artefact https://claude.ai/code/artifact/8f23051d-4247-421a-a234-6a6f4a747ded — implémentation après validation.

## 5 sept 2026 — bot couple + campagne de bugs en autonomie (demande Jeanne)
- **Bot couple** `scripts/bot-couple.js` (à lancer avant chaque build) : deux comptes jetables vivent une semaine de foyer contre la prod — invitation, join (foyer solo remplacé), dispatch réel, missions cochées, décalage, repassages accepté/refusé, retard → malus, 3e membre, garde-fous, isolation RLS, départ. 36 pas, tout passe. Il ne tourne pas en continu (le serveur ne bouge pas seul) : lancé à chaque modification, programmable.
- **Bugs corrigés sans demander (règle convenue)** : tâches du binôme réel poussées en « commun » (uid réel maintenant) · pénibilité du binôme utilisée à la validation · synchro des pénibilités en échec silencieux (`task_pains` sans household_id, sans id → lignes écrasées) · temps réel « cannot add callbacks after subscribe » à la réouverture · **file de synchro empoisonnée** (une mutation refusée bloquait tout ; la déconnexion ne vidait ni la file ni les filigranes → « C'est parti » du rejoignant n'écrivait RIEN en base — reproduit et prouvé corrigé au simulateur : 4 tâches, 17 occurrences dont 7 au vrai binôme) · slot forcé à 1 pour un membre existant · uid/prénom/photo de l'ancien compte persistant après déconnexion. Migration **0004** (un malus par occurrence) appliquée.
- **Maquettes HTML du pop-up tâche rejetées** par Jeanne (« grossières, pas la DA ») → leçon en mémoire : prototyper dans l'app, valider sur captures. Direction : garder les pop-ups actuels, « beaucoup plus smooth ».
- **Build 9** = tout ce qui précède, auto-soumis (1.0.0 (14)). Consigne Jeanne ensuite : **plus de build à chaque modif** — regrouper, builder à sa demande.
- **Après le build 9 (non embarqué, prêt pour le build 10)** : Accueil « pour toi » filtré par porteur · uid qui suit la session · **audit des écrans encore en démo en mode réel** : À faire (20), sheet Jour, détail Balance (22), profil (chiffres) branchés sur les vraies données (`src/balance-real.js`). Vérification écran en attente : le simulateur iPhone est utilisé par la session « pop-up » (proto sheet Tâche v2, commit 8eb2e76), l'iPad ne rend pas.
- Reste en démo même en réel (volontairement, fonctionnalités à venir) : Budget (paywall), point hebdo 23, Wrapped 24-25, Bilan 26, analyse, calendrier 35, humeur, événements, notifs (34), pense-bête. Émojis système encore présents : streak 🔥 sur Balance, ⚠️/✨ sur le détail — à nettoyer (décision « zéro émoji »).
- **Proto statique Sheet Tâche v2 livré (5 sept 2026, après-midi)** : route `/proto-mission?v=a|b&s=…` (non branchée, démo), recette `docs/recettes/17c-sheet-tache-v2.md`, textes `copy.missionV2`. Une seule sheet à deux étages (« ce moment-ci » / « la règle »), dépense + note, avertissement notification avant déplacement, « en attente » après repassage, fréquence et jours tous visibles, « Voir la tâche » supprimé. 8 captures simulateur envoyées à Jeanne — **en attente de validation** (A rangée vs B CTA ; pénibilité/importance/options sortis de la sheet).
- **Décisions Jeanne (5 sept, après-midi) et exécution le jour même** : (1) celui qui rejoint par le lien passe par **06 → 07 → 08** après « Duo formé » puis atterrit à l'Accueil ; ses dispos/temps et préférences partent au foyer (`syncJoinerPrefs`) — question ouverte : « se créer un compte » = aussi un vrai compte e-mail/Apple ? (2) **duo strict en v1** (choix Claude, laissé libre par Jeanne) : migration **0005** — 3ᵉ membre refusé (`household_full`), réversible. (3) « Tu as rejoint le foyer de {name} ! » côté rejoignant. (4) placement : tâches du binôme selon **ses** dispos, alternance/commun = grilles additionnées ; sans grille, décalage par tâche (fini le « tout aujourd'hui », tests 8f/8g). (5) **« Quitter le foyer » dans le profil** (confirmation, ma ligne membre supprimée, l'autre garde tout, retour écran 09). Bot couple mis à jour (40 pas) + bot temps réel (`scripts/bot-realtime.js`, 90-560 ms).
- **Vérifié à l'écran le soir même** (simulateur libéré) : Quitter le foyer → 09 avec nouveau code ; rejoindre Fanny → « Tu as rejoint le foyer de Fanny ! » → 06 (prénom Kim, profil créé) → 07 → 08 → Accueil ; dispos de Kim en base ; temps réel sur l'appareil (missions créées côté serveur visibles en 5 s, filtre « pour toi » OK) ; À faire, sheet Jour, détail Balance, profil en réel. **Bug attrapé à l'écran** : le trigger de taille (duo strict) levait `household_full` sur la ré-écriture idempotente de la ligne membre → file bloquée → migration **0006** (membre existant ignoré) + `push()` fait la mise à jour d'abord sur les tables à clé composite + refus P0001 non bloquants. Reste non vérifié : dispatch à deux avec dispos du binôme (placement), rien de bloquant.
- Pas encore buildé (consigne : à la demande de Jeanne).

## Décisions prises
- **23 août 2026** — **Zéro émoji dans l'UI** (décision Jeanne : app sobre). Symboles graphiques ○ ● ✓ ‹ › et SVG conservés ; repères de rangée = pastille couleur du membre. Champs `emoji` conservés en données mais jamais affichés.
- **23 août 2026** — Écran 07 : proposition A (légende chips + « Tape une case ») + slider 2→8 h. Écran 08 : liste unique à bascule (neutre → j'aime → je déteste, 3 max par côté). Écrans 12+13 fusionnés. CTA taille Airbnb (52, marges 24), dégradé qui avance à l'appui. Flèche retour épinglée en haut.
- **21 août 2026 (soir)** — Jeanne demande **tous les écrans navigables + animations** avant la validation page par page. Méthode : tous les écrans construits avec des **données de démo** (`src/demo.js`, personnes **Ketley** (slot 1) et **Julian** (slot 2)), reliés selon la flow map, animations du brief ; la validation visuelle et le branchement Supabase se font ensuite écran par écran. Écran « Plan des écrans » (`/plan`) pour sauter partout.
- **21 août 2026** — Entrée dans l'app par **session anonyme Supabase** (pas de compte à créer avant le setup) ; le compte Apple/e-mail se relie ensuite à cette session (`linkIdentity`), sans perte de données. À confirmer par Jeanne.
- **21 août 2026** — Stack : Expo SDK 57, JS (pas TS : CLAUDE.md prime sur le brief design), expo-router,
  reanimated 4, Supabase Auth + Postgres + Realtime + Storage, RevenueCat, expo-notifications.
- **21 août 2026** — Choix par défaut sur les options entre crochets du brief (à confirmer par Jeanne) :
  mode **partagé couple/foyer** (solo = foyer à 1), **expo-notifications** (rappels locaux),
  **freemium + abo Duo+ mensuel et annuel** (SPECS §9).
- **21 août 2026** — Bundle id proposé : `io.langora.mochi` (à confirmer avant création ASC).
- **21 août 2026** — Entitlement RevenueCat : `duoplus`, packages `$rc_monthly` / `$rc_annual`.

## Bloquants (actions Jeanne)
- [x] GitHub : repo privé `jeannecazalot-lgtm/mochi` en ligne, push OK — 21 août 2026
- [x] Supabase : projet créé, `.env` rempli, 06 câblé → `profiles` + bucket `avatars` — 21 août 2026
- [x] Supabase : **Anonymous sign-ins déjà actifs** — vérifié par test réel le 1er sept 2026 (session anonyme créée via l'API ; un utilisateur anonyme de test `37b86916…` traîne en base, à purger un jour depuis le dashboard)
- [x] Modèle de données validé (16 tables, foyers 2→10, un foyer/personne, Duo+ par foyer, USD, planning hebdo) — 21 août 2026
- [x] EAS : connectée (jeannegourmande), projet lié `@jeannegourmande/mochi` — 21 août 2026
- [x] Apple : bundle id tranché le 2 sept 2026 → **`app.annie.mochi`** — aligné sur la convention d'iky (`app.annie.iky`), société Annie. Exit io.langora.

## Backlog priorisé (un item = un écran, validation explicite de Jeanne à chaque fois)
Légende : `[~]` = construit avec données de démo, **à valider visuellement par Jeanne puis à brancher sur Supabase** · `[x]` = validé et branché.
Entrée en dev : `/plan` (Plan des écrans). Écarts artboard/README à arbitrer : `docs/ECARTS.md`.
### P0 — chaîne technique
- [x] 1. Squelette Expo + git + .gitignore (.env ignoré) — 21 août 2026
- [x] 2. Proposition modèle de données (`supabase/migrations/0001_init.sql`) — 21 août 2026
- [x] 3. Squelette câblé : theme.js, ui.js, copy.json, purchases.js, supabase.js/auth.js, eas.json, legal/ — 21 août 2026
- [x] 4. Migration 0001 appliquée (projet `zdoqogsfmwpginolhtri`, Europe) ; 19 tables visibles, RLS vérifiée (insert anonyme refusé), RPC OK — 21 août 2026
- [x] 5a. Build dev simulateur EAS validé à l'écran (glow, tab bar, FAB, 4 onglets) — 21 août 2026
- [ ] 5b. App ASC + build 1 TestFlight — **reporté après l'audit visuel #1** (décision Jeanne, 21 août 2026) : `npx eas-cli build --platform ios --profile production` en interactif (Apple ID + 2FA)

### P1 — entrée dans l'app (setup)
- [~] Connexion (lien e-mail) — squelette ; Apple à brancher
- [~] 06 · Setup A — Identité (prénom + photo) — codé le 21 août 2026, **en attente de validation Jeanne** (écarts signalés : CTA 16/600 posé sur le fond, comme l'artboard, vs README 14/600 en footer blanc)
- [~] 07 · Setup B — Dispos & énergie (tap-cycle + slider temps/sem)
- [~] 08 · Setup C — Préférences (aimées/détestées → pénibilité perso, heure de rappel → permission notifs)
- [ ] → audit cohérence visuelle #1 (titres, marges, boutons) · puis TestFlight (5b)
- [~] 09 · Inviter son binôme (lien + QR, code 7 j)
- [~] 09b · Duo formé
- [~] 10 · Choisir les tâches (catalogue ~50 tâches en JSON + custom)
- [~] 11 · Mochi calcule (algo dispatch SPECS §2, fonction pure testée)
- [~] 12 · Proposition de dispatch
- [~] 13 · Glisser pour réattribuer (drag & drop)
- [ ] → audit cohérence visuelle #2

### P2 — cœur quotidien
- [~] 17 · Home cockpit (Mochi penche + phrase, missions du jour, côté binôme, streak)
- [~] 14 · Fiche tâche
- [~] 15 · Tâche mentale — planifier ≠ exécuter
- [~] 16 · Détail tâche + historique (5 dernières fois)
- [ ] → audit #3
- [~] 19 · Planning semaine (drag sur avatar)
- [~] 20 · Liste À faire (compacte, swipe cocher / repasser-reporter)
- [ ] 21 · Tâche ratée (malus) — **specs Jeanne du 1er sept (~23h20), maquette fournie** : dans le Planning, tâche en retard **encadrée rouge** + notif sur les DEUX téléphones ; tap → pop-up assigné (maquette : retard, avertissement malus x/5, « Je le fais maintenant » recommandé, « Repasser à {binôme} » +1 dette, « Décaler à demain » +1 malus) ; le non-assigné voit la même carte en LECTURE (pas de bandeau malus) avec « Je la reprends » et « Envoyer un ping » (proposition à valider) ; règles SPECS §6 : refus ≠ transfert, 3 refus/sem → « refaites le setup », importance ≥ 4 non repassable le jour même. + **cocher ses tâches directement depuis le Planning** (comme l'Accueil).
- [~] FAB → sheet d'ajout (tâche / événement / dépense / pense-bête) + formulaire dépense
- [ ] Rappels locaux des tâches dues
- [ ] → audit #4

### P3 — balance & social
- [ ] 21 · Balance (calcul SPECS §3, seuils 10/25 %)
- [ ] 22 · Balance détail (déséquilibre > 25 %)
- [~] 18 · Long press → Ping sheet
- [ ] 22 · Fil Activité (zéro texte libre)
- [ ] 23 · Point hebdo · malus (geste symbolique, remise à zéro)
- [ ] Realtime Supabase (les 2 téléphones se voient)
- [ ] → audit #5

### P4 — budget & moments
- [ ] 23 · Budget (solde, « On est à zéro », dépenses via tâche)
- [~] 30 · Événement social (modal)
- [~] 24 · Wrapped solo (push dim 20h, stories)
- [~] 25 · Wrapped couple
- [~] 26 · Bilan mensuel (badges)
- [~] 28 · Streak célébration (confetti)
- [~] 34 · Notifs lockscreen (contenu des notifs)
- [ ] → audit #6

### P5 — premium Duo+
- [~] 37 · Paywall Duo+ (divulgation au-dessus du CTA, Restore/Privacy/EULA, priceString)
- [~] 35 · Calendrier mois (Duo+)
- [~] 36 · Analyse charge mentale (Duo+)
- [~] 32 · Pense-bête partagé (Duo+)
- [~] 33 · Mood check-in (Duo+)
- [~] 38 · Profil & réglages (préférences perso / règles du duo, suppression de compte)

### Plus tard
- [~] 01-05 · Onboarding (pager, count-up)
- [~] Animations v1 : float/blink/lean Mochi, check spring, count-up, barres, sheet FAB, confetti, stories — faites ; reste : swipe à valider au doigt, drag & drop réel (13, 19), ✓ dessiné (stroke)
- [ ] Dashboard interne — quand le modèle de données est stable

## Fragile / à surveiller
- **Modales (dépense, ping, événement, mood)** : présentées en form sheet native iOS (fond assombri, coins 26). Mon outil de pilotage du simulateur ne délivre pas les taps aux modales → **fermeture (×), choix, scrim à tester au doigt par Jeanne**. Le swipe des rangées « À faire » et le drag du Planning aussi.
- Écran 06 : la saisie du prénom n'a pas pu être testée par mes outils (clavier) → test Jeanne.
- `legal/privacy.html` non hébergé : lien « Politique de confidentialité » du paywall vide (bloquant Store) → GitHub Pages.
- Les extras des agents (tokens locaux dans `src/components/*/extra.js`, `src/demo-*.js`) sont à consolider dans theme.js / demo.js quand les écrans seront validés.
- Tous les builds passent par EAS (dev simulateur + production) ; pas de build local.
- `react-dom` pinné à 19.2.3 (expo-router tirait 19.2.8, incompatible avec react 19.2.3 du SDK 57).
- `src/store.js` = squelette offline-first ; la gestion de conflits se précisera avec les premiers écrans.
- Apple Sign-In : `expo-apple-authentication` installé, pas encore branché à Supabase.
