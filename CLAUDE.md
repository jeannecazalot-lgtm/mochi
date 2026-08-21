# mochi — règles de travail

## Qui
Jeanne, cheffe de produit, ne code pas. Elle valide dans le simulateur et sur iPhone.
Tout en français. Elle donne des specs structurées (listes numérotées) : les appliquer
telles quelles, demander si ambigu, ne pas extrapoler.

## Produit
App utilitaire de charge mentale. Sobre, lisible, rapide : la donnée utilisateur est le
produit. [solo / partagée couple-foyer]. [Rappels par notifications locales.]

## Stack
Expo SDK 57 (docs : https://docs.expo.dev/versions/v57.0.0/ — lire avant d'écrire du
code), dev build iOS, EAS. Supabase (Auth + tables utilisateur + RLS), offline-first.
RevenueCat via src/purchases.js. Pas de serveur custom.
Point de départ pour purchases.js, data/copy.json, eas.json, legal/ : /Users/jeannecazalot/ikb
(copier et adapter, ne rien garder de branché).

## Méthode
- Git : commit à chaque étape validée, message descriptif en français, push en fin
  de session. Jamais .env, clés, credentials dans le repo ni dans le chat.
- Modèle de données d'abord : toute nouvelle donnée passe par une table Supabase
  validée, jamais par un état local improvisé.
- Page par page : un écran validé explicitement par Jeanne avant le suivant.
  Audit de cohérence visuelle (titres, marges, boutons) après les 3 premiers écrans,
  puis tous les 3-4 écrans.
- Un fichier d'écran > 500 lignes se découpe tout de suite ; le partagé va dans ui.js.
- Textes UI dans data/copy.json uniquement. Chiffres publics calculés depuis la base,
  jamais écrits à la main.
- Rendu visuel : écrire la recette (couches, ombres, rayons) avant d'itérer ;
  pas plus de 2 allers-retours sur captures sans recette écrite.
- Vérifier à l'écran (simulateur) avant d'annoncer « fait ». Export JS OK avant build.
- TODO.md = journal : backlog priorisé + ce qui a été fait/décidé, dates absolues.
- Fin de session : push, TODO à jour, liste de ce qui est fragile.
- Rétro à chaque jalon (efficacité, estimé vs réel, à améliorer, reste à faire).

## Store (à vérifier avant CHAQUE build soumis)
- Divulgation complète AU-DESSUS du CTA sur chaque paywall : nom, durée, essai,
  prix storefront (priceString RevenueCat), auto-renouvellement, annulation.
- Restore · Privacy Policy · Terms of Use (EULA) sur chaque paywall ET dans la
  description ASC.
- Captures ASC prises dans l'app réelle, chiffres exacts.
- Sortie manuelle + contact review à revérifier à chaque submit (ASC les réinitialise).
- Disponibilité : hors UE tant que pas de statut trader DSA ; aligner app et abonnement.
- Permissions (notifications…) demandées au moment utile, avec la phrase d'usage
  dans app.json.
