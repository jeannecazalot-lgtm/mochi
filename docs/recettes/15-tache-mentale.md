# Recette écran 15 · Tâche mentale (source : duo-v3-fiche.jsx › FicheMentaleV3) → app/task/mentale.js

1. Fond `#FAFAF7` + GlowBg `soft`. Header identique à la fiche 14, titre « TÂCHE MENTALE ».
2. Contenu padding 22.
   - Héro : card radius 18, padding 12×14, **bordure 1,5 lavender** ; PillLabel « MENTAL · ×1,5 » lavenderDeep ;
     titre 20/600 tracking −0,8 ; phrase 13/400 muted marge 3. Marge basse 10.
   - Deux moitiés : card radius 15, padding 9×11 ; rangée gap 10 : rond 26 encre 6 % avec chiffre 14/600 ;
     colonne : titre 16,5/600, description 12/400 muted, puis 2 chips 11/600 padding 6×8 radius 999
     (grise : encre 5 % / muted ; coral : coral 10 % / coralDeep) ; à droite Avatar 26 (couleur du slot) — tap = bascule moi/binôme.
     Entre les deux cards : trait vertical 1,5×10 encre 15 % centré (marge 6 au-dessus, 4 en dessous) ; marge 14 sous la 2e.
   - Note attachée : rangée glass (blanc 55 %, bordure 0,5 encre 6 %, radius 14, padding 8×11, gap 8) ;
     emoji 18 ; titre 14,5/500 ; sous-texte 12/400 muted ; chevron › (ouvre un TextInput).
3. Footer blanc padding 9 14 19 ; CTA « Enregistrer les deux » gradient Mochi 16/600.
