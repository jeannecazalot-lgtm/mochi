# Recette écran 38 · Profil & réglages — source : duo-creme-premium-profil.jsx › ProfilCreme (+ spec : 2 sections, rappel croisé, seuils, plan)

1. Fond `#FAFAF7` + GlowBg `soft`.
2. Header (padding 19 23 0, gap 14, marge basse 14) : bouton retour rond 34 (ajout) ; Avatar 58 couleur de slot, initiale 20/600 blanc ;
   prénom 20/600 tracking −0,6 ; « En duo avec **Jeanne** · depuis {n} jours » 13,5/400 muted, prénom en lavenderDeep 600 (marge 3) ; PillLabel « DUO+ » butter si abonné.
3. Trois tuiles (padding 0 22, gap 8, marge 16) : Card padding 13, radius 14 ; clé 10,5/500 tracking 1,2 uppercase muted (marge 6) ; valeur 21/600 tracking −0,6 :
   Streak (`streak.days` j) · Tâches (`lifetime.tasks_done`) · Équilibre (`balance.me` %).
4. Micro « MES PRÉFÉRENCES » 11,5/600 tracking 1,5 (marge 9) puis rangées glass (radius 14, padding 11 14, gap 13, gap vertical 6) : emoji 18 ; titre 15,5/500 ; sous-titre 12 muted (marge 3) ; chevron › 16 muted.
   Notifications · Mes disponibilités · Rappel croisé (Switch iOS à droite, opt-in, état local, piste sage) · Exporter mes données.
5. Micro « NOS RÈGLES DU DUO » (marge top 16) : Seuils d'alerte (valeur « 10 / 25 % » à droite, pas de chevron, non modifiable) · Malus · Abonnement Duo+ → `/paywall` · Plan des écrans → `/plan`.
6. « Se déconnecter » centré 14,5/600 coralDeep, padding 10 0.
Aucune ombre. Pas de tab bar (artboard : tab bar « profile » inexistante dans la nav v3 ; accès par l'avatar, retour par ←).
