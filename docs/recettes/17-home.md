# Recette écran 17 · Accueil (source : duo-v3-core.jsx › HomeV3)

Couches, de l'arrière vers l'avant :
1. Fond `#FAFAF7` + GlowBg `soft`. Contenu dans un ScrollView (flexGrow 1) ; la tab bar est gérée par (tabs)/_layout.
2. Header (padding 14 23 0, row, gap 10) : date micro 11,5/500 tracking 1,4 muted uppercase (« MAR 7 JUIL », calculée
   depuis `demo.today`) · bulle activité 36 ronde crème + hairline, icône bulle 17 stroke 1,8, point coral 10 avec
   bord 2 `bg` en haut-droite si un ping non lu (`activity` avec `read_at` null) → `/activite` · Avatar 36 de `me` → `/profil`.
3. Bloc Mochi (padding 10 23 0, row, gap 16) : LiveMochi 104 `neutral`, lean calculé (`mochiLean()` dans demo-core :
   1° par point d'écart de balance, plafonné ±12°, négatif = penche vers le binôme) ; à droite phrase 20/600
   tracking −0,6 lineHeight 23 + sous-phrase 13,5/400 muted marge 4. Phrase choisie par `balance.state` (copy home.mochi*).
4. Titre section (padding 18 23 6, baseline) : « Aujourd'hui pour toi » 17/700 tracking −0,3 (tappable → `/afaire`)
   + méta 13/500 muted « {n} missions · ≈ {time} » calculée depuis `myToday()`.
5. Card missions (marges 18, radius 16, padding 11 14) : rangées padding 11 0, séparées par 1px `line`, gap 13 ;
   emoji 19 · titre 16/500 (line-through + opacité 0,45 si faite, 200 ms) · badge 11/700 tracking 0,6 uppercase
   padding 8 10 radius 999 (urgent : coral 14 % / coralDeep ; mental : lavender 18 % / lavenderDeep) ·
   cercle 24 : anneau 2 `checkRing` → rempli sage + ✓ blanc 11 (useCheckPop, haptique légère).
   Tap rangée → `/task/<id>` · long press → `/ping?occ=<id>` · tap cercle → toggle local.
   Indice centré 11,5/400 muted marge 6.
6. Bloc « Côté {partner} » (padding 14 18 0) : GlassRow (glass + hairline radius 14, padding 11 14, gap 13) :
   Avatar 28 partner · « Côté Jeanne » 15/500 + « · 2 missions · 40 min » 13,5/400 muted (depuis `partnerToday()`) · › 16 muted.
   → `/afaire`.
7. Streak : texte 13/500 muted centré, poussé en bas du contenu (paddingBottom 12 au-dessus de la tab bar).
Aucune ombre portée. Blur du glass non reproduit (RN sans backdrop-filter).
