# mochi

App utilitaire de charge mentale (couple / foyer). Expo SDK 57 · dev build iOS · Supabase · RevenueCat.

- Règles de travail : `CLAUDE.md` · Journal/backlog : `TODO.md`
- Référence visuelle : `design/handoff/Mental free - Embossed.html`
- Modèle de données : `docs/MODELE_DONNEES.md` + `supabase/migrations/`

## Démarrer
```bash
cp .env.example .env   # puis coller les clés publiques Supabase / RevenueCat
npm install
npx expo run:ios       # dev build sur le simulateur (pas Expo Go)
```

## Première mise en ligne du repo (à faire une fois, par Jeanne)
1. Créer le repo privé vide `mochi` sur https://github.com/new (compte jeannecazalot-lgtm, sans README).
2. Dans un terminal :
```bash
cd ~/mochi && git remote add origin https://github.com/jeannecazalot-lgtm/mochi.git && git push -u origin main
```
(GitHub demandera un identifiant + un *personal access token* à la place du mot de passe.)

## EAS / TestFlight (à faire une fois `eas login` passé)
```bash
cd ~/mochi && npx eas login && npx eas init && npx eas build --platform ios --profile development
```
