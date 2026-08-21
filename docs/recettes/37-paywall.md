# Recette écran 37 · Paywall Duo+ — source : duo-creme-premium-profil.jsx › PaywallCreme + règles Store (CLAUDE.md)

1. Fond `#FAFAF7` + GlowBg `strong` (0,9).
2. Header (padding 14 23 0) : rond 36 crème hairline « × » aligné à droite → `router.back()`.
3. Héros centré (marge basse 14) : LiveMochi 104 `happy` (marge 6) ; « Duo+ » 22/600 tracking −1,2 ; sous-titre 14,5/400 muted (marge 6).
4. Avantages (padding 0 26, gap 5, marge 14) : pastille ✓ 20 fond `#C9E0C5` + check encre 10 ; texte 15/500.
5. Deux cards plan (padding 0 22, colonnes 1,2 / 1, gap 8, padding 14 16, radius 16), sélectionnables (tap) ; la sélectionnée a la bordure accent sage 1,5 (annuel par défaut).
   Annuel : pill « {n} MOIS OFFERTS » sageDeep flottante (top −9, left 14) **uniquement si n calculé depuis les prix storefront** ; « Annuel » 13/500 muted (marge top 4) ;
   prix 20/700 tracking −0,8 + « /an » 14/500 muted ; « soit {prix/12}/mois » 12/400 (calculé). Mensuel : idem avec « sans engagement ».
   Prix = `priceString` RevenueCat via `getOffers()` ; en simulé (null) → « Prix dans l'App Store », aucun chiffre inventé.
6. Bloc bas (absolu, bottom 26, marges 18, gap 10) :
   a. **Divulgation complète au-dessus du CTA** 12/400 muted centrée : nom, période, essai (si `introPrice` gratuit), prix storefront, renouvellement auto, annulation.
   b. CTA gradient Mochi radius 14, padding 17 20, texte 16/600 : « Essayer {n} jours gratuits » si essai annoncé par le storefront, sinon « Passer à Duo+ ».
   c. « Annulable à tout moment · partagé à deux » 13/400 muted.
   d. Liens 12/500 muted : Restaurer · Politique de confidentialité · Conditions d'utilisation (EULA Apple).
   Achat → `purchase(id)` puis `router.back()` si succès ; restaurer → `restore()`. Erreurs en 12 coralDeep au-dessus du CTA.
Ombre : seule le CTA (0 1 2 encre 6 %). Écart artboard : les lignes a. et d. sont ajoutées (obligation Store).
