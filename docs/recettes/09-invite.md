# Recette écran 09 · Inviter son binôme (source : duo-embossed-setup.jsx › SetupInvite)

1. Fond + GlowBg `soft`.
2. En-tête embossed (padding 14 23 0) : `PillLabel` coral « ÉTAPE 3/4 » à gauche, « Passer » 13/500 muted à droite.
3. Titre d'étape 22/600 tracking −1,1 « Invite ton binôme. » (copy.common.partner, jamais un prénom) + sous-titre 14/400 muted marge 6.
4. Bloc padding 19 23 0. Card « faire-part » radius 22, padding 22 20 18, centré :
   - rangée avatars : Avatar V 54 (sky, anneau 3 crème) · Mochi 64 (marges −6, au-dessus) · place vide 54 en pointillés 2 encre 25 %, fond encre 3 %, « ? » 21/600 muted ;
   - « Une place t'attend. » 17/600 tracking −0,3 · sous-texte 13,5/400 muted marges 3/14 ;
   - lien : bloc encre 5 % radius 12 padding 11×14, lien 14/500 encre (1 ligne, ellipse) + « Copier » 13/600 sage deep (tap → « Copié »).
5. CTA « Envoyer le lien » gradient Mochi 16/600 dans le flux (marge basse 10) — ouvre la feuille de partage iOS puis (démo) passe à 09b.
6. Deux boutons glass flex 1 gap 8 : fond blanc 55 %, hairline, radius 999, padding 11×14, icône 16 + texte 14,5/500 (« QR code », « Saisir un code », inactifs en démo).
7. Phrase d'aide 12/400 muted centrée, marge haute 10, interligne 18.
Pas de CTA en bas d'écran sur cet artboard.

## Retours Jeanne 22 août 2026
La recette ci-dessus (pastille « ÉTAPE 3/4 » + « Passer » texte) est remplacée :
1. En-tête unifié avec 06-08 : `SetupHeader` points + titre (step 4/4) avec sa flèche
   retour intégrée. PAS de Mochi héros en haut : le hero de cet écran est la carte
   d'invitation. `SkipLink` (extra.js) : « Passer » 13/500 muted en position absolue
   à droite (right 18, top 4, hauteur 30), aligné sur la flèche retour.
2. Carte-aperçu (avatars + « Une place t'attend. ») centrée VERTICALEMENT dans
   l'espace disponible (flex 1, justify center), paddings intérieurs plus généreux
   (28 24 24). Le lien s'affiche dans son bloc encre 5 % radius 12, centré,
   SANS bouton « Copier » (supprimé — l'action principale est Envoyer).
3. Actions façon Tricount, empilées en bas (marges 18, bottom 26) :
   - grand `CTAPrimary` big « Envoyer le lien » (gradient Mochi + animation de
     bande claire à l'appui) → `Share.share` puis (démo) passe à 09b ;
   - rangée centrée gap 10 : `ActionPill` pilule « QR code » (icône + texte,
     inactive en démo) + `ActionPill` ronde 48 icône partage système → `Share.share` ;
   - lien texte « Inviter plus tard » 13,5/500 muted centré → 09b.
   Le bouton « Saisir un code » et la phrase d'aide disparaissent.
Composants ajoutés dans `src/components/setup/extra.js` : `SkipLink`, `ActionPill`,
`ShareIcon`, `QRIcon`. Planche de variantes statiques : `app/props/invite.js`.
Point ouvert pour Jeanne : 06-08 affichent 3 points (total 3), cet écran en affiche 4
(step 4/4) — harmoniser le total sur 06-08 si la DA est validée.
