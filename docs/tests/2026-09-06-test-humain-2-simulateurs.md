# Test « humain exigeant » — 6 sept 2026, ~00h45–01h15

Dispositif : iPhone 16 Pro (Kima, inviteuse, photo) + iPhone 16 Pro Max (Lea, rejoignante par code 6KFBSF), même Metro 8082, prod Supabase.
Contexte connu et non compté : données de démo sur Point hebdo, Wrapped, Bilan, Célébration, Calendrier 35, Analyse, Événement, Pense-bête, Notifs ; bouton dev + badge numéro ; lien GitHub Pages.

## Test à deux (temps réel)
1. Join par code : OK en ~2 s, 09b affiché des deux côtés. Attendu : idem, mais avec les bons textes (voir 09b).
2. BLOQUANT — l'inviteuse (Kima) est traitée comme rejoignante : 09b dit « Tu as rejoint le foyer de Lea ! · Encore trois petites étapes », CTA « Continuer » → 06 → 07 → 08 → Accueil ; jamais d'écran 10/11/12. Cause : `joiner = householdId && !tasks.length` (duo-forme.js) — vrai aussi pour l'inviteuse qui n'a pas encore choisi ses tâches. Attendu : « Lea a rejoint ton foyer ! » → « Choisir nos tâches » → 10.
3. La rejoignante qui avait déjà rempli 06/07/08 avant de saisir le code les refait, et ses saisies (dispos L/S à fond, M soir, 5,5 h ; préférences Vaisselle/Poubelles) sont perdues (grille vide, 2 h, chips neutres). Attendu : sauter ce qui est rempli, pré-remplir sinon.
4. Accueil de la rejoignante : « Choisissez vos tâches ensemble pour lancer la répartition » sans aucun bouton. Attendu : CTA vers 10 ou « En attente de Kima ».
5. Dispatch validé par Kima → missions chez Lea en < 3 s ; coche de Kima visible chez Lea ; Balance de Lea cohérente (0 min / 2h10). OK.
6. Repassage Lea → Kima : la carte Accepter/Refuser arrive chez Kima. Mais : autorisé sur une mission déjà faite ; aucune confirmation ni état « en attente » chez Lea ; l'acceptation transforme une occurrence « Ensemble » faite en « Kima seule ». Attendu : bloqué si fait, confirmation, porteur inchangé sur une occurrence close.
7. Ping « Rappel doux » : aucune trace nulle part (ni expéditeur, ni destinataire). Attendu : entrée fil + notification.
8. Réaction « Merci ❤️ » sur le fil : locale seulement, rien chez Kima. Attendu : visible par l'autre.
9. Dépense « Pizzas · 24 € · Sorties » : jamais enregistrée (solde 0 des deux côtés). Attendu : listée, solde mis à jour.
10. Tâche « Plantes » créée via FAB → fiche 14 → Enregistrer : n'apparaît sur aucun écran, aucun appareil. Attendu : tâche + occurrences visibles.
11. Couleur de Kima : bleu sur son appareil, violet chez Lea ; Lea bleu chez elle, violet chez Kima. Attendu : couleur fixe par membre.
12. Avatar de Kima : photo sur Accueil/Planning/sheets, lettre « K » sur 09b, fil Activité, sheet Dépense, paire « L K ». Attendu : photo partout.

## 01-05 Onboarding
1. Espaces avalées entre segments colorés : « d'unmi-temps », « Faireest une chose », « Y penseren est une autre », « appellela charge mentale », « Soit11 jours pleins,juste », « s'épargneau passage ». Attendu : espaces conservées autour des mots stylés.
2. 05 : « Duo aide les couples ». Attendu : « mochi aide… ».
3. 05 : « Vous êtes deux » vouvoie ; tout le reste tutoie. Attendu : règle tu/vous (tu = toi, vous = le duo) relue partout.
4. Aucun retour arrière entre slides (ni swipe ni flèche). Attendu : swipe horizontal + flèche.
5. 01 : la source « INSEE · ENQUÊTE EMPLOI DU TEMPS » touche le bord du CTA. Attendu : 12–16 px d'air.
6. 03 : « 260 h = 11 jours pleins » puis « ×1 voyage de trois semaines » : le lecteur fait le calcul, ça ne colle pas. Attendu : équivalences cohérentes.
7. CTA « Continuer → » pleine largeur avec flèche ; sur 06+ « Continuer » sans flèche, marges 24. Attendu : un seul composant CTA.
8. « Passer » : un tap sans réaction (zone sous le badge/gear). Attendu : zone tactile ≥ 44 pt, dégagée.

## 06 Identité
1. Photo choisie → la pilule dit toujours « Ajouter ». Attendu : « Modifier ».
2. Prénom modifié (« Kima ») sauvegardé sans confirmation et non modifiable ailleurs (profil non éditable). Attendu : édition prénom/photo depuis 38.
3. « C'est toi. » apostrophe droite vs typographique ailleurs. Attendu : ’ partout.
4. Bouton Continuer plus étroit que sur 07 (marges 24 vs 18). Attendu : même largeur.

## 07 Dispos & énergie
1. Grille vide + Continuer accepté sans un mot. Attendu : « Coche au moins un créneau » ou défaut explicite.
2. Dispos saisies perdues au second passage (voir test à deux 3). Attendu : pré-remplissage.
3. Depuis Profil → « Mes disponibilités » : même écran de setup avec points de progression et « Continuer » qui enchaîne 08 puis Accueil, grille vide. Attendu : écran réglage avec valeurs actuelles et « Enregistrer ».
4. Profil affiche « Soirs + week-end » alors que la grille était vide. Attendu : résumé calculé depuis la grille.
5. Slider mini 2 h : impossible de dire « rien cette semaine ». Attendu : 0 h possible ou « pas dispo ».

## 08 Préférences
1. Tap sur l'heure : 19:30 → 20:00 → 08:00, liste figée non découvrable. Attendu : sélecteur d'heure natif.
2. Préférences perdues au second passage. Attendu : pré-remplissage.
3. CTA « C'est parti » alors qu'il reste 09-12 pour l'inviteuse. Attendu : « Continuer » ; « C'est parti » réservé au 12.
4. Légende « neutre / 💚 j'aime · 1 tap / 🙅 je déteste · 2 taps » ressemble à des filtres cliquables. Attendu : légende texte, ou vrais filtres.
5. Chips de largeur variable → « Administratif & factures » seul sur sa ligne, layout en dents de scie. Attendu : grille 2 colonnes.
6. Rappel choisi ici (08:00) n'apparaît nulle part ensuite (profil : « 30 min avant »). Attendu : valeur reprise dans les réglages.

## 09 Inviter son binôme (+ sheet Rejoindre)
1. « Inviter plus tard » tronqué (« Inviter plus ta… »). Attendu : texte complet.
2. « Passer » en haut et « Inviter plus tard » en bas : doublon. Attendu : un seul.
3. Le code n'apparaît qu'après un partage ou « J'ai reçu un code » ; avant, « Une place t'attend » sans code. Attendu : code + lien visibles et copiables d'emblée.
4. Après ouverture de la feuille de partage : « Invitation envoyée ! » même si on a annulé. Attendu : ne rien présumer.
5. Sheet Rejoindre : CTA grisé sans dire pourquoi (6 caractères). Attendu : aide « code à 6 caractères ».
6. Rangée du bas : QR et share à gauche, deux liens texte à droite ; le bouton dev recouvre le QR. Attendu : rangée sur deux lignes.

## 09b Duo formé
1. Voir test à deux 2 (inviteuse = rejoignante) : bloquant.
2. Avatar « K » côté rejoignante alors que Kima a une photo. Attendu : photo.
3. « Encore trois petites étapes : ton prénom, tes dispos, tes préférences » à quelqu'un qui vient de les remplir. Attendu : texte conditionnel.

## 10 Choisir les tâches
1. « Choisis vos tâches. » mélange tu/vos. Attendu : « Choisissez vos tâches » ou « Choisis les tâches du foyer ».
2. Pas de points de progression (06-09 en ont). Attendu : cohérence.
3. ~150 px de vide entre mascotte et titre. Attendu : resserrer.
4. Boutons flottants « + Ajouter » / « Lancer » : troisième style de CTA, et ils changent de largeur selon l'état. Attendu : CTA stable + secondaire.
5. La liste passe sous le titre sans fondu : « Administratif » coupé à mi-hauteur. Attendu : fondu ou en-tête opaque.
6. « + Ajouter » insère un champ en tête sans focus, sans bouton OK, sans emoji : on ne sait pas comment finir. Attendu : sheet « Nouvelle tâche » ou champ focus + OK.
7. BUG : dernier caractère perdu à l'Entrée (« Arroser le jardin » → « Arroser le jardi », persisté jusqu'au 12). Attendu : texte complet.
8. Tâche perso = emoji 📝 générique non modifiable. Attendu : choix d'emoji/catégorie.
9. Aucune fréquence ni durée visible. Attendu : « 7×/sem · 40 min » en sous-ligne.
10. Rien de pré-coché, « Lancer » grisé ; le sous-titre dit « Coche, décoche ». Attendu : pré-sélection des tâches universelles.

## 11 Mochi calcule
1. RAS : animation lisible, enchaînement automatique. Attendu : ok.

## 12 Proposition de dispatch (= 13 Réattribuer)
1. « Equilibré » sans accent. Attendu : « Équilibré ».
2. Cycle du chip Lea → Alterné → Ensemble → Kima ; le sous-titre ne parle que du prénom. Attendu : sous-titre complet ou menu.
3. Chips de largeur variable → la rangée bouge à chaque tap. Attendu : largeur fixe.
4. Dernière rangée sous le CTA (« Arroser le jardi » masqué). Attendu : padding bas.
5. CTA « C'est parti » étroit et centré : encore une largeur. Attendu : uniforme.
6. « Rééquilibrer avec Mochi » (22) renvoie ici avec les fréquences initiales (7×, 1×) alors que le résumé garde mes réglages (6h50/2h) ; « C'est parti » recréerait tout. Attendu : rééquilibrage dédié, non destructif, valeurs actuelles.
7. Rien n'indique qu'une rangée mène à la fiche. Attendu : chevron ou rien.

## 17 Accueil (+ sheet Mission)
1. « Rien à faire — Mochi veille. » avec « 2 missions · ≈ 55 min » dessous. Attendu : sous-titre calculé.
2. « Vous êtes à l'équilibre cette semaine » alors que Balance dit « Ça penche chez Kima · 100 % ». Attendu : même calcul.
3. Compteur figé à « 2 missions · ≈ 55 min » après tout coché. Attendu : « Tout est fait ✓ ».
4. Tout coché : aucun état, Mochi neutre. Attendu : Mochi content + phrase.
5. Cocher fait sauter la ligne en bas ; pas d'annulation. Attendu : ligne en place + « Annuler » 5 s.
6. Appui long = tap (même sheet) : pas de ping. Attendu : appui long → Ping (18) ou menu.
7. « Glisser une mission pour la repasser ou la reporter » : glisser ouvre la sheet Mission, aucune action de glissement. Attendu : implémenter ou retirer.
8. Mission « Ensemble » sans repère (pas de double avatar). Attendu : badge « à deux ».
9. Icône bulle : premier tap ignoré. Attendu : réactif.
10. Sheet Mission sur mission déjà faite : propose encore « C'est fait ». Attendu : « Fait à 00:57 · Annuler ».
11. Sheet « Je n'aurai pas le temps » : jours L…S sans dates, aujourd'hui exclu, sheet qui grandit d'un coup. Attendu : « lun 7 »…, hauteur stable.
12. « Repasser à Kima » : fermeture sans confirmation ni état d'attente. Attendu : « Demande envoyée à Kima ».
13. État vide rejoignante sans CTA (voir test à deux 4), et hint de glissement affiché sans mission. Attendu : CTA, pas de hint.

## 19 Planning (semaine, mois, sheet Jour)
1. Avatar Kima = photo sur les rangées, lettre dans la paire « L K ». Attendu : photo.
2. Tâche du binôme faite : pas de ✓. Attendu : ✓ gris.
3. Mois : points sur 2 semaines seulement (génération ~7 j) → mois quasi vide. Attendu : génération glissante 4 semaines.
4. Sheet Jour : rangées non tappables ; tâche « Ensemble » sans avatar. Attendu : tap → sheet Mission ; double avatar.
5. Segment Semaine/Mois sous le badge d'écran. Attendu : dégager.

## 20-21 À faire
1. BUG : rangée de filtres (Tout 17 / Moi 12 / Lea 0 / En retard 0) coupée en haut, à moitié sous l'en-tête. Attendu : visible en entier.
2. Occurrences « Ensemble » = avatar « ? », et « Lea 0 » ne les compte pas. Attendu : double avatar, comptées pour les deux.
3. Glisser à droite = fait immédiatement (y compris une tâche de mardi prochain), sans confirmation ni annulation ; l'indication promet « repasser/reporter ». Attendu : gauche = fait, droite = reporter/repasser, ou menu.
4. Glisser à gauche révèle un ✓ vert qui ne répond pas (2 essais) ; rangée qui reste ouverte, emoji et rond disparus. Attendu : action fonctionnelle, rangée qui se referme.
5. « 17 tâches » et « 2 tâches » figés après coche. Attendu : compteurs vivants.
6. Durées « 40′ / 60′ » vs « 40 min / 1 h » ailleurs. Attendu : une notation.
7. « AUJOURD'HUI · DIM », « DEMAIN · LUN », « MAR. 8 SEPT. » vs « MAR 8 » sur Planning. Attendu : un format, date partout.
8. Flèche « ← » ici, « ‹ » sur setup/tâche. Attendu : un glyphe.
9. On coche une tâche de mardi depuis dimanche sans question. Attendu : « Faite en avance ? ».

## 21 Sheet Tâche en retard
1. « Repasser à Julian · Julian décide » : nom de démo alors que le binôme réel est Lea. Attendu : vrai prénom.
2. « Décaler à demain · Demain · +1 pt » : « Demain » deux fois. Attendu : « +1 pt ».

## 16 Détail tâche
1. 70 % d'écran vide. Attendu : fréquence, porteur, prochaine fois, ou CTA remonté.
2. « … » invisible sous le bouton dev, rien n'indique qu'il mène à la fiche. Attendu : « Modifier » explicite.
3. « Marquer fait » → « Fait ✓ », historique inchangé, pas d'annulation. Attendu : historique mis à jour + undo.
4. Historique hebdo « 6 juin… » pour une tâche « mardi » (6 juin 2026 = samedi). Attendu : dates cohérentes.
5. Hint « glisse la tâche depuis la liste » renvoie vers un geste cassé. Attendu : cohérent avec 20.

## 14 Fiche tâche (édition et création via FAB)
1. Deux chevrons ‹ superposés (sheet + écran 16 dessous). Attendu : masquer le fond.
2. Fréquence et Durée en tap-cycle (45′ → 1 h ; 1×/sem → 1×/mois). Attendu : sélecteur.
3. « Fenêtre d'exécution · Aucune » en rouge : le défaut ressemble à une erreur. Attendu : gris.
4. « Ta pénib. », « Import. ». Attendu : mots entiers.
5. Création : « Kima : 3★ » affiché pour une tâche inexistante. Attendu : rien avant enregistrement.
6. BUG : tâche créée invisible partout (voir test à deux 10).
7. « Enregistrer » ferme sans feedback. Attendu : toast.
8. Cadre vert autour du nom : ressemble à un état « valide », pas à un champ. Attendu : style champ.
9. « Fixe » ne dit pas à qui. Attendu : chips Kima/Lea sous Fixe.

## 15 Tâche mentale
1. CRASH : « Render Error · undefined is not a function » (fmtDay, src/demo-task.js:70) ; après Dismiss, écran blanc, relance obligatoire. Attendu : écran fonctionnel.

## 18 Ping
1. Envoi sans aucune trace (voir test à deux 7). Attendu : entrée fil + notif.
2. Poignée (grabber) au milieu de la sheet, sous la carte. Attendu : en haut.
3. Tâche affichée « Sortir les poubelles · Kima » : on pingue son binôme pour sa propre tâche (démo). Attendu : tâche du binôme.
4. Inatteignable depuis l'app (pas d'appui long). Attendu : entrée depuis la sheet Mission des tâches du binôme.

## 22 Fil Activité
1. Noms de tâches en minuscules (« cuisine »). Attendu : « Cuisine ».
2. « Kima a terminé… » sur l'appareil de Kima. Attendu : « Tu as terminé… ».
3. Couleurs et avatars instables (voir test à deux 11-12).
4. Réactions locales (voir test à deux 8).
5. « T'es la meilleure » genré par défaut. Attendu : neutre.
6. Deux « Kima a terminé vaisselle » (aujourd'hui + lundi coché en avance) sans date. Attendu : « vaisselle de lundi ».
7. Repassage accepté sur une tâche faite (voir test à deux 6).
8. ✅ après chaque « a terminé » : redondant. Superflu.
9. « Pas de messages libres ici… On ne remplace pas WhatsApp. » : justification. Superflu.

## 21 Balance
1. « Point hebdo · dim 12 » : le 12 sept 2026 est un samedi. Attendu : « dim 13 ».
2. « 1 jours ». Attendu : singulier.
3. Streak 1 j chez Lea qui n'a rien fait, sans dire « du duo ». Attendu : préciser.
4. « 100 % · 4 tâches » + Profil « Équilibre 100 % » : 100 % = déséquilibre total. Attendu : « Ta part 100 % » ou équilibre 0 %.
5. Couleurs Lea bleu / Kima violet ici, inversées sur 22. Attendu : fixe.
6. Chart 7 jours sans valeur ni échelle. Attendu : valeur en bout de barre.

## 22 Balance détail
1. Couleurs inversées vs 21. Attendu : idem.
2. « Si ça dure 2 semaines :Mochi suggérera » : espace manquante. Attendu : « : Mochi ».
3. « Rééquilibrer avec Mochi » → setup 12 (voir 12.6). Attendu : flux dédié.
4. « DÉSÉQUILIBRE · 100 % D'ÉCART » : jargon. Attendu : « Kima porte tout cette semaine ».

## 23 Point hebdo
1. Quatre noms : en-tête « MALUS », pilule « POINT HEBDO », Balance « Point hebdo », profil « Malus ». Attendu : un nom.
2. « DIM 12 » faux. Attendu : « dim 13 ».
3. Accepter → « Accepté ✓ · on efface tout » mais 5 pts et Mochi triste inchangés, CTA « On repart à zéro » toujours là. Attendu : 0 pt, Mochi content, CTA « Terminé ».
4. Pioche d'une idée : chip noircie, aucun effet. Attendu : « Idée envoyée à Kima ».
5. « On repart à zéro » → retour Balance sec. Attendu : feedback.

## 23 Budget (+ sheet Dépense)
1. BUG dépense invisible (voir test à deux 9).
2. « On est à zéro » et « Rappeler » actifs à solde nul, sans effet. Attendu : masqués ou feedback.
3. « Vous êtes à zéro ». Attendu : cohérence tu/vous.
4. Date limitée à Aujourd'hui/Hier. Attendu : date libre.
5. « Kima » = lettre sans photo. Attendu : photo.
6. Fermeture par × (autres sheets : grabber, ‹, « Annuler »). Attendu : un pattern.
7. Paywall liste « Tricount illimité » alors que Budget est gratuit (décision 5 sept). Attendu : retirer.

## Sheet Ajouter (FAB)
1. Icônes SVG monochromes ici, emojis partout ailleurs. Attendu : cohérence.
2. « Un événement » ouvre « Anniv de Sophie » pré-rempli : pas de création. Attendu : formulaire.

## 24-25 Wrapped
1. « TA SEMAINE · SEM. 28 » (démo, semaine 36 réelle). Attendu : semaine courante.
2. « Roi de la vaisselle » pour Lea, « Reine de la lessive » pour Kima : genre deviné. Attendu : neutre (« Star de… »).
3. « 1 jours ». Attendu : singulier.
4. « 48 / 52 » sans unité (et chiffres qui s'animent depuis 38/41). Attendu : « 48 % / 52 % ».
5. Pas de fermeture avant la fin, tap gauche/droite non indiqué, deux taps sortent sans montrer le 3e écran (atteint seulement via « Suite »). Attendu : × en haut, indicateur, 3 écrans stables.
6. Grand vide central. Attendu : compacter.

## 26 Bilan mensuel
1. Pilule « JUIN · CLÔTURE » illisible (jaune pâle sur rose). Attendu : contraste AA.
2. Barre bleu/violet/rouge sans légende. Attendu : légende.
3. « 51 / 49 sur 30 jours » sans unité. Attendu : « 51 % / 49 % ».
4. Grand vide. Attendu : compacter.

## 28 Célébration
1. BUG : « Partager le badge » rendu aussi en haut, visible à travers la Dynamic Island. Attendu : safe area respectée, un seul rendu.
2. « 14 jours d'affilée » vs streak 1 j sur Balance (démo). Attendu : même source.

## 35 Calendrier mois (Duo+)
1. Doublon de la vue Mois du Planning (gratuite). Attendu : supprimer 35 ou trancher Duo+.
2. Pilule « DUO+ » sous le bouton retour, flèches ‹ › sous le gear. Attendu : réordonner.

## 36 Analyse charge mentale
1. Pilule DUO+ + bannière + bouton « Découvrir Duo+ » : triple rappel. Superflu.
2. « Appliquer » non testé (démo). Attendu : confirmation.

## 37 Paywall
1. Ligne « Restaurer un achat · Politique de confidentialité · Conditions d'utilisation » touche les deux bords. Attendu : marges, retour à la ligne.
2. « Prix dans l'App Store » (pas de priceString) sans état de chargement ni erreur. Attendu : prix RevenueCat ou message.
3. « Passer à Duo+ » → retour à l'écran précédent sans message. Attendu : « Achat indisponible ».
4. Divulgation « facturé par an » fixe alors que Mensuel est sélectionnable. Attendu : divulgation qui suit le plan (nom, durée, essai, prix, renouvellement, annulation).
5. Grand vide entre plans et divulgation. Attendu : compacter.
6. « Tricount illimité · multi-sessions », « Wrapped illimité + export PDF » : jargon. Attendu : bénéfices clairs.

## 38 Profil & réglages (chaque rangée)
1. En-tête prénom/photo non éditable. Attendu : tap → édition.
2. « Équilibre 100 % » (voir Balance 4).
3. « Notifications · Rappels 30 min avant » → aperçu lockscreen 34, aucun réglage, rappel 08:00 absent. Attendu : écran réglages (heure, rappel croisé, permission).
4. « Mes disponibilités » → écran setup (voir 07.3).
5. « Exporter mes données » : rangée morte (onPress vide). Attendu : action ou retrait.
6. « Seuils d'alerte · 10 / 25 % » : non tappable. Attendu : réglage ou retrait.
7. « Malus » → 23 (démo).
8. « Abonnement Duo+ » → paywall. OK.
9. « Plan des écrans » : dev, à retirer avant build.
10. Icônes emoji de styles différents (🔔 coloré, 🔁 ⬇️ carrés bleus). Attendu : set unique.
11. « Être prévenu·e » : écriture inclusive seulement ici. Attendu : cohérence.
12. « Quitter le foyer » : alerte native OK → 09 avec nouveau code OK ; mais ensuite l'inviteuse retombe dans le bug 09b.
13. « Se déconnecter » : purge tout sans écran dédié (question ouverte connue).

## 30 Événement social
1. Démo pré-remplie, pas de création. Attendu : formulaire.
2. « Ajouter au calendrier » : iOS ou mochi ? Attendu : préciser.
3. Ombres colorées jaune/bleu sous les cartes : style unique. Attendu : cohérence.
4. « Annuler » texte à droite (autres sheets : × ou grabber). Attendu : un pattern.

## 32 Pense-bête
1. Tap sur une note = barrée sans confirmation ; impossible d'ouvrir, éditer, supprimer. Attendu : tap → détail ; « fait » explicite.
2. « + » sous le gear (env) ; non testé.
3. « Mdp box internet · CC91-… » : mot de passe en clair partagé, exemple à changer. Attendu : autre exemple.
4. « LE CERVEAU EXTERNE » + « DUO+ » : jargon. Attendu : titre simple.

## 33 Mood check-in
1. « Kima voit juste un agrégat anonyme » : à deux, rien n'est anonyme. Attendu : « Kima ne voit pas ta réponse ».
2. Valider → fermeture sèche. Attendu : « Merci, à dimanche prochain ».
3. Jamais déclenché automatiquement (pas de rappel dimanche). Attendu : notification ou carte Accueil.

## 34 Aperçu Notifs
1. Faux écran verrouillé « mardi 7 juillet » comme cible de Profil → Notifications. Attendu : réglages réels ; aperçu en dev seulement.
2. « Kima te ping » alors que le ping n'existe pas. Attendu : cohérent avec 18.

## Connexion (auth)
1. « Crée ton compte mochi » : numéro + Apple/Google/Email alors que décision = pas de compte, et pas de SMS dans la stack. Attendu : retirer ou limiter à Apple/e-mail.
2. Pas de retour, pas de liens CGU/Confidentialité. Attendu : liens légaux.

## Transversal (DA, wording)
1. Quatre largeurs de CTA (onboarding pleine largeur + →, setup 24 px, 07 18 px, 12 étroit centré). Attendu : un composant.
2. Retour : « ‹ » (setup, tâche) vs « ← » (À faire, Activité, Point hebdo) ; sheets : ‹, ×, « Annuler », grabber. Attendu : ‹ en push, × en sheet.
3. Apostrophes droites/typographiques mélangées. Attendu : ’.
4. tu/vous incohérent (« Vous êtes à l'équilibre », « Choisis vos tâches », « Votre foyer démarre », « Vous êtes à zéro »). Attendu : règle écrite et relue.
5. Durées : 40′ / 40 min / ≈ 40 min / 1h / 60′ / 6h50 / 2h10 / 5,5 h. Attendu : « 40 min », « 1 h 05 ».
6. Dates : « DIM 6 SEPT », « MAR. 8 SEPT. », « dim 12 », « 6 juin », « sam. 11 juil. », « Du 31 août au 6 sept ». Attendu : un format.
7. Couleurs membres différentes selon l'écran et l'appareil. Attendu : couleur liée au membre.
8. Avatars : photo / lettre / « ? » / paire. Attendu : photo, paire de photos.
9. Icônes : emojis système, SVG monochromes (FAB, tabs), emojis carrés (profil). Attendu : trancher.
10. Pluriels : « 1 jours », « 0 tâches ». Attendu : accord.
11. Bas d'écran vides (16, 24, 26, 28, 32, 37, Budget). Attendu : contenu ou compacter.
12. Écrans de démo mêlés au réel (23, 24-25, 26, 28, 30, 32, 34, 35, 36, sheet 21 « Julian ») : un testeur ne sait plus ce qui est vrai. Attendu : bandeau « Aperçu » ou masqués en mode réel.
13. Bouton dev + badge recouvrent Passer, QR, Mois, « … », ×, + (dev, à retirer avant build).

## TOP corrections (par ordre)
1. 09b : inviteuse prise pour rejoignante → jamais d'écran 10 ; texte faux. Bloquant pour tout nouveau duo.
2. Accueil vide de la rejoignante sans CTA vers le choix des tâches.
3. Dépense ajoutée jamais enregistrée ; tâche créée via FAB jamais créée.
4. Crash écran 15 (fmtDay).
5. À faire : glisser droite = fait sans confirmation, ✓ mort, filtres coupés, avatars « ? », compteurs figés.
6. Actions autorisées sur une mission déjà faite (C'est fait, Repasser, Accepter) → une occurrence close change de porteur.
7. Ping et réactions sans effet réel.
8. Saisies 07/08 perdues au second passage ; Profil → écrans de setup avec « Continuer ».
9. Dernier caractère perdu à l'Entrée (10).
10. Accueil : « Rien à faire » avec 2 missions, « à l'équilibre » vs Balance « ça penche », compteur figé, aucun état « tout est fait ».
11. Dates et textes : « dim 12 », « 1 jours », « Equilibré », « :Mochi », espaces avalées de l'onboarding, « Duo aide », « Julian ».
12. Membres : couleur et avatar stables sur tous les écrans et appareils.
13. Layout : Célébration sous l'encoche, footer Paywall débordant, pilule Bilan illisible, poignée Ping au milieu, « Inviter plus ta… ».
14. Un seul composant CTA, un seul glyphe retour, une règle tu/vous, un format durée/date.

## TOP suppressions
1. Écran 35 Calendrier mois (doublon du Planning Mois).
2. Écran 34 comme cible de « Notifications » (garder en dev).
3. « Inviter plus tard » (doublon de Passer).
4. « On est à zéro » / « Rappeler » quand le solde est nul.
5. Hint « Glisser une mission pour la repasser ou la reporter » tant que le geste n'existe pas.
6. Rangées mortes du profil : Exporter, Seuils.
7. Écran de connexion (numéro/Google) tant que « pas de compte » tient.
8. « On ne remplace pas WhatsApp » et ✅ redondants dans le fil.
9. Triple rappel Duo+ (pilule + bannière + bouton) sur 35/36.
10. « Tricount illimité » dans le paywall.
