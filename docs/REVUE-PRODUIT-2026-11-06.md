# Revue produit — 6 novembre 2026

Repasse complète demandée par Jeanne : « est-ce que tout marche, est-ce que c'est logique, est-ce que tout sert au produit ». Faite sur les 28 écrans en démo + lecture de la logique (retards, repasser, balance, récaps, Mochi).

## Verdict en une ligne
Le cœur (Accueil + Mochi + Planning + fiche mission) est bon et cohérent. Autour, il reste **deux jeux qui se contredisent** (les points de malus d'avant et les cœurs de Mochi), **trois récaps qui ne se déclenchent jamais**, une **boutique qui ne change rien à l'écran**, et un onboarding de 14 écrans avant l'Accueil. C'est ça qu'il faut trancher avant le test à deux.

## 1. Deux jeux en même temps (à trancher en premier)
- À faire, sheet Retard, Point hebdo, Bilan du mois, Célébration et Wrapped parlent encore de **points de malus**, de **streak** et de **badges** (« 4,5 pt de malus », « +1 pt », « 14 jours équilibrés d'affilée »).
- L'Accueil, la Balance et la pièce parlent de **cœurs**, de **perles**, de **paliers**. Un utilisateur voit les deux selon l'écran.
- Proposition : **un seul jeu, Mochi**. Une ratée = −1 cœur (déjà fait), la faire plus tard = +1 cœur (déjà fait), décaler = rien. Les points, le streak et les badges disparaissent ; le point hebdo et le bilan deviennent des moments de Mochi (ci-dessous).

## 2. Les récaps : un par semaine, par Mochi
- Aujourd'hui : Point hebdo (dimanche), Bilan du mois, Wrapped, Célébration. Aucun ne s'ouvre tout seul : rien ne les déclenche. Trois écrans pour la même idée.
- Proposition : **un récap par semaine, le dimanche à 20 h**, sous forme de moment Mochi (la semaine a-t-elle été saine : < 10 % d'écart, ≥ 80 % des missions faites, pas malade), avec le chiffre de chacun et ce que Mochi en retient. Le mois = le passage de palier, déjà codé. Le Wrapped peut revenir plus tard comme partage, pas comme récap.

## 3. La Balance : pertinente, mais elle juge au lieu d'aider
- Elle mesure la semaine en cours, sur ce qui est **fait** : minutes × pénibilité perso (+15 % par point) × 1,5 si charge mentale, + 15 min « pour y penser » par tâche distincte. Seuils 10 % / 25 %. La formule est bonne, et elle nourrit déjà la santé de Mochi.
- Problème : elle dit « ça penche nettement de ton côté » à celle qui fait tout, sans issue. Elle constate.
- Proposition : garder la mesure, ajouter **l'action** : « Pour rééquilibrer : 2 missions de plus pour Julian cette semaine » avec un bouton qui réassigne les prochaines occurrences (la logique « Mochi décide » existe déjà dans l'horizon). Et montrer le **prévu** à côté du **fait** : si le partage prévu est juste et que l'un ne coche pas, le problème n'est pas la répartition.

## 4. La boutique ne change rien (le Tamagotchi s'arrête là)
- On gagne des perles (3 par mission, 12 par balade), on achète des objets et des tenues… mais **la pièce se remplit selon le palier, pas selon ce qu'on achète**, et une tenue achetée n'apparaît pas sur Mochi. Les souvenirs de balade ne se voient pas dans la pièce non plus.
- C'est le point le plus important pour « l'envie de rester » : acheter doit se voir. Proposition : chaque objet du catalogue = un calque posé dans la pièce ; chaque tenue = un calque sur Mochi (bonnet, écharpe, chapeau) ; les souvenirs = une étagère qui se garnit. Les paliers débloquent le droit d'acheter, pas les objets.

## 5. Retard, repasser, décaler : logique OK, textes faux
- Retard : « Je le fais maintenant » (cœur regagné), « Repasser à l'autre » (en attente de sa réponse, affiché sur l'Accueil), « Décaler à demain » : OK.
- Mais les textes annoncent « +1 pt », « 4,5 pt de malus », « efface le malus ». À réécrire en cœurs : « Une ratée = un cœur de moins. La faire = le cœur revient. »
- Repasser : si l'autre refuse, la mission reste chez moi sans explication. Ajouter une ligne « Julian a refusé, elle reste chez toi ».

## 6. L'onboarding : 14 écrans avant l'Accueil
- Onboarding 5 → paywall → connexion → prénom → dispos → préférences → inviter → attendre l'autre → choisir les tâches → calcul → répartition → Accueil. Finch était « trop long » ; là c'est pareil.
- Proposition : **7 écrans**. Onboarding 3 (constat, Mochi parle, nom) → connexion → prénom → tâches (avec la répartition dedans) → Accueil avec l'œuf. Dispos et préférences passent dans le Profil, avec des valeurs par défaut. L'invitation vit sur l'Accueil tant qu'on est seul (« Mochi éclot quand vous serez deux »). Le paywall **après l'éclosion**, pas avant d'avoir vu Mochi.

## 7. Doublons à retirer
- Mood du dimanche (ancien) vs check-in quotidien → garder le check-in.
- Pense-bête vs Note → garder les notes dans le Planning.
- Tâche mentale (écran 15) et Détail tâche (écran 16) vs fiche mission → garder la fiche.
- À faire vs Planning → garder le Planning (le filtre « En retard » suffit).
- Calendrier (Mochi+) vs Planning mois → garder le Planning.
- Analyse charge mentale → une ligne dans la Balance.

## 8. Ce qui ne marche pas (vu)
- Bande noire en haut de tous les anciens écrans (À faire, Balance détail, Bilan, Point hebdo, Pense-bête, Notifications, Mes dispos, Fiche tâche, Calendrier, Analyse, Célébration, Mood, Wrapped) : les écrans en « modal » n'ont pas le fond v3 derrière la barre d'état.
- Outils de dev visibles (rond gris engrenage, numéro d'écran, Plan) : à retirer avant tout build.
- Rien n'a encore été testé **à deux sur deux téléphones** depuis la refonte : repasser, ping, temps réel, éclosion quand l'autre rejoint.

## 9. Ce qui marche bien (à garder tel quel)
Accueil + pièce + Mochi qui réagit, planning qui se reconduit seul (retour Ketley), fiche mission (titre = modifier, note, moment pré-rempli), jauge d'énergie → balade → souvenir, cœurs plancher 1 (jamais mort), éclosion à la formation du duo, check-in qui change la tête de Mochi, mode nuit automatique, Budget.

## Ordre proposé
1. Un seul jeu : retirer points/streak/badges, réécrire les textes de retard. (1 session)
2. La boutique qui se voit : objets, tenues, souvenirs dans la pièce et sur Mochi. (2 sessions, images à produire)
3. Récap du dimanche en moment Mochi ; Point hebdo / Bilan / Wrapped / Célébration retirés. (1 session)
4. Balance : prévu vs fait + bouton rééquilibrer. (1 session)
5. Onboarding court + paywall après l'éclosion. (1 session)
6. Bande noire + outils de dev + doublons. (½ session)
7. Test à deux, puis build 20.
