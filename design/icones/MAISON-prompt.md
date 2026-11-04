# La pièce de Mochi en images (même matière que Mochi et les icônes) — prompt ChatGPT, 4 nov 2026

Joindre : `assets/mochi/leanp0.png` + `assets/icones-test/planche-chatgpt.png`.

```
Même matière, même éclairage et même palette que Mochi et la planche d'icônes jointes. Je veux les éléments d'une petite pièce, SÉPARÉS, pour les assembler moi-même dans l'app : planche de 9 vignettes, grille 3 × 3, fond uni crème #F7F2E9, sans texte ni légende, chaque objet entier, centré, vu de face, posé, aucune ombre portée dure, même échelle relative entre les objets :
1. une grande fenêtre en arche avec le ciel bleu pâle, une colline sauge et un soleil beurre
2. une plante verte dans un pot terracotta
3. une étagère murale avec un vase, deux livres et une petite plante
4. une table basse en bois clair avec un petit vase
5. une banquette corail avec deux coussins crème
6. un lampadaire crème avec un abat-jour beurre
7. un tapis rond crème
8. un petit cadre au mur
9. un rideau corail pâle
```

Découpe : floodfill depuis les coins (seuil 28), canevas carré, PNG transparent, puis `Scene` compose les images aux positions actuelles (mêmes paliers, mêmes animations : plante qui se balance, lampe qui respire la nuit). Nuit : les mêmes images avec un voile navy à 55 % + lampe allumée.
