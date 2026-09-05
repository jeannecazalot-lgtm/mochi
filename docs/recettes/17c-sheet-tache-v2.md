# Recette · Sheet Tâche v2 (proto statique du 5 sept 2026) → app/proto-mission.js

Remplace le couple « sheet Mission → fiche 14 » par **une seule sheet à deux étages** :
« ce moment-ci » (l'occurrence) en haut, « la règle » (la tâche) repliée en bas.
Jamais de push d'écran depuis la sheet : tout se déplie en place, la sheet s'étire.
Brief Jeanne (3 sept) : l'essentiel = l'ai-je fait ? combien de temps ? combien dépensé ?
puis « pas le temps », puis la règle. Zéro émoji (décision 23 août).

Couches, de l'arrière vers l'avant :
1. Sheet native formSheet `fitToContents`, coins 26, fond `card`, padding 10 18 ; poignée 40×4 encre 15 %.
2. En-tête (marge basse 12) : titre 20/600 tracking −0,6 ; sous-ligne 13/400 muted avec Avatar 18 du porteur :
   « Toi · aujourd'hui · ≈ 30 min ». Aucun émoji, aucune pastille.
3. Étage « ce moment-ci » : Card radius 16 padding 0, rangées padding 12 14 séparées 1 px `line`.
   - « Temps passé » 15/500 + stepper (ronds 26 encre 6 %, valeur 15/600 tabulaire).
   - « Dépense » 15/500 + chip muted « Ajouter » → renseignée : chip encre « 12,40 € ».
   - « C'est fait » 15,5/600 + sous-texte 12 muted « 30 min comptés dans la balance » ; cercle check 22 à gauche.
     Variante B : cette rangée devient le CTA dégradé Mochi 52 « C'est fait · 30 min » sous la Card.
   - « Je n'aurai pas le temps » 15,5/600 + sous-texte « Déplacer, ou repasser à {binôme} » + ›.
     Déplié en place : micro-label « DÉPLACER À », 6 chips jour (flex 1, 30, encre 5 % + hairline),
     **avertissement 12 muted « {binôme} recevra une notification »**, puis rangée « Repasser à {binôme} »
     + sous-texte « Il devra accepter ».
4. Étage « la règle » : Card radius 16 padding 0. Repliée = une rangée « La règle » 15/500 + résumé 12 muted
   « 1× / semaine · lun, jeu · Mochi décide » + ›. Dépliée (la sheet grandit, ressort `motion.spring`) :
   - « Tous les combien » : toutes les fréquences en chips (pill, 13/600, sélection = fond encre / texte crème).
   - « Quels jours » : 7 chips L M M J V S D, mêmes règles.
   - « Qui s'en occupe » : chips avec Avatar 18 « Moi » / « {binôme} », puis « On alterne », « Mochi décide ».
   - « Durée estimée » + stepper.
   - « Note » 15/500 + texte 13 muted (« Lessive à 40°, pas le pull rouge ») + ›.
   Retirés ici : pénibilité, importance, divisible, charge mentale, dépense (→ moment), « Voir la tâche ».
   Sauvegarde automatique, pas de bouton.
5. Confirmations (remplacent le contenu, 350 ms, cercle 44 qui pop) :
   - fait : cercle sage ✓ · « C'est fait » 20/600 · « 30 min et 12,40 € comptés dans la balance » 13,5 muted.
   - déplacé : cercle sage ✓ · « Déplacé à jeudi » · « {binôme} est prévenu ».
   - repassé : Avatar 44 du binôme · « Proposé à {binôme} » · « Tu restes porteur jusqu'à sa réponse » ·
     PillLabel lavenderDeep « EN ATTENTE ».
   Fermeture automatique 900 ms après.
Aucune ombre portée hors CTA.
