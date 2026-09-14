# Mochi — le personnage · brief et prompts pour ChatGPT (14 sept 2026)

## État actuel
- In-app : sphère corail dessinée en SVG (`src/components/ui.js`, fonction `Mochi`), humeurs happy / neutral / sad / sleeping / wink, inclinaison `lean` selon la Balance, flottement.
- Splash : la même sphère (`assets/splash-icon.png`).
- Icône de l'app : encore celle par défaut d'Expo (chevron bleu, `assets/icon.png`) → à remplacer.
- Tailles réelles dans l'app : 34 px (fil Suivi), 84-92 px (profil, invitation), 110-140 px (Accueil, Wrapped), 1024 px (icône, splash).

## Ce que le personnage doit être
- Un mochi : blob de pâte de riz, rond, mou, un peu translucide. Deux yeux points + une bouche. Rien d'autre (pas de bras, pas d'accessoire) : il doit rester lisible à 34 px.
- Ton : sobre, doux, adulte. Pas kawaii saturé, pas 3D Pixar, pas de contour noir épais.
- DNA visuelle de l'app « Embossed Crème » : fond crème `#FBF7F2`, encre `#1A1A1F`, corail `#E89B85` / `#C75744`, beurre `#F5C76E`, sauge `#7BA982`. Couleur en petites doses, aucune ombre portée dure, lumière douce.
- Rôle : il penche vers celui qui porte le plus (Balance), il est content quand tout est fait, triste quand ça penche trop, endormi le soir.

## Méthode (3 étapes)
1. Exploration : 3 prompts, 3 directions. Jeanne génère 1-2 images par prompt dans ChatGPT, choisit une direction (ou mixe).
2. Planche d'expressions sur la direction retenue : mêmes proportions, 5 humeurs + 2 inclinaisons, fond uni.
3. Intégration par Claude : redessin en SVG paramétrique (humeur + inclinaison) pour l'app, PNG 1024 pour l'icône et le splash, vérification à l'écran à 34 / 140 / 1024 px.

Déposer les images retenues dans `design/mochi-personnage/retours-chatgpt/` (nom libre, ex. `A-1.png`).

## Étape 1 — prompts d'exploration (à coller tels quels)

### Direction A — mochi corail translucide (continuité de l'actuel)
```
Mascotte d'application mobile : un mochi japonais rond et moelleux, légèrement translucide comme de la pâte de riz, couleur corail pâle (#E89B85) avec un dégradé chaud vers le rouge doux (#C75744) sur les bords et une lumière douce en haut à gauche. Visage minimal : deux petits yeux ronds noirs et une petite bouche souriante, traits fins encre (#1A1A1F). Pas de bras, pas de contour noir, pas d'accessoire, pas de texte. Fond uni crème (#FBF7F2), aucune ombre portée dure, juste un contact léger au sol. Style illustration vectorielle propre, sobre et adulte, pas kawaii saturé, pas de rendu 3D Pixar. Image carrée, personnage centré occupant 70 % de la hauteur.
```

### Direction B — mochi blanc nacré, iridescent (la promesse du handoff)
```
Mascotte d'application mobile : un mochi japonais rond et dodu, blanc nacré avec un léger reflet iridescent (touches très douces de corail #E89B85, beurre #F5C76E et sauge #7BA982 dans le reflet, comme une perle). Surface mate et poudrée, comme saupoudrée de fécule. Visage minimal : deux petits yeux ronds noirs et une petite bouche souriante, traits fins encre (#1A1A1F). Pas de bras, pas de contour, pas d'accessoire, pas de texte. Fond uni crème (#FBF7F2), aucune ombre portée dure. Style illustration vectorielle sobre et adulte, pas kawaii saturé, pas de rendu 3D Pixar. Image carrée, personnage centré occupant 70 % de la hauteur.
```

### Direction C — mochi posé, plus « pâte » que sphère (forme écrasée, vivante)
```
Mascotte d'application mobile : un mochi japonais posé sur une surface, forme de goutte écrasée et moelleuse (plus large que haute, base aplatie, sommet arrondi), couleur crème rosée avec un dégradé subtil vers le corail (#E89B85) en bas. Matière douce et mate. Visage minimal placé bas sur le corps : deux petits yeux ronds noirs et une petite bouche souriante, traits fins encre (#1A1A1F). Pas de bras, pas de contour noir, pas d'accessoire, pas de texte. Fond uni crème (#FBF7F2), aucune ombre portée dure. Style illustration vectorielle propre, sobre et adulte, pas kawaii saturé, pas de rendu 3D Pixar. Image carrée, personnage centré occupant 65 % de la largeur.
```

Variantes utiles si une direction plaît mais pas tout à fait : « plus mat », « plus rond », « yeux plus écartés », « bouche plus petite », « moins de dégradé ».

## Étape 2 — planche d'expressions (une fois la direction choisie)
Uploader l'image retenue dans ChatGPT, puis :
```
Garde exactement ce personnage (forme, couleur, matière, proportions, style) et fais une planche de 7 vignettes sur fond uni crème (#FBF7F2), disposées en grille 4 × 2, sans texte ni légende :
1. neutre (bouche en petit trait horizontal)
2. content (petit sourire)
3. triste (bouche légèrement tombante, yeux un peu plus bas)
4. endormi (yeux fermés en petits arcs, bouche minuscule)
5. clin d'œil (un œil fermé en arc, petit sourire)
6. content, le corps entier incliné de 12° vers la gauche, comme s'il penchait
7. content, le corps entier incliné de 12° vers la droite
Même taille de personnage dans chaque vignette, même éclairage, aucune ombre portée dure.
```

## Étape 3 — icône et splash (une fois la direction choisie)
Icône App Store (1024 × 1024, pas de transparence, pas de texte, coins droits : iOS arrondit lui-même) :
```
Icône d'application iOS à partir de ce personnage : fond uni crème (#FBF7F2) plein cadre, le personnage centré, content, occupant 62 % de la hauteur, aucun texte, aucun cadre, aucun coin arrondi, aucune ombre portée. Image carrée 1024 × 1024.
```
Splash : même image, personnage à 45 % de la hauteur (Expo la centre sur fond crème).

## Ce que Claude fera avec les retours
- App : redessin SVG fidèle (le personnage doit rester paramétrique : humeur + inclinaison animées). Si la matière est trop riche pour du SVG, repli = un PNG par humeur, inclinaison faite par rotation.
- Icône : `assets/icon.png` 1024 sans alpha ; Android : `android-icon-foreground.png` avec marge de sécurité 33 %.
- Splash : `assets/splash-icon.png` + `backgroundColor` crème dans `app.json`.
- Vérification à l'écran (simulateur) à 34, 140 et sur l'écran d'accueil iOS avant « fait ».
