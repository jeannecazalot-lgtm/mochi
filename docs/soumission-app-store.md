# Soumission App Store : Mindpair 1.0 (build 25)

Préparé le 15 novembre 2026. À dérouler dans l'ordre le jour où l'on soumet.

---

## 1. Texte pour Apple

Dans App Store Connect › Mindpair › version 1.0 › **App Review Information** (et aussi TestFlight › **Test Information**, si un jour on invite des testeurs externes).

**Sign-in required** : coché

| Champ | À remplir |
|---|---|
| User name | `review@mindpair.app` |
| Password | le mot de passe enregistré le 15 nov (à coller par toi) |

**Notes** (à copier tel quel, Apple lit l'anglais) :

```
Mindpair is a household app for couples: two partners share the chores and raise a little creature, Mochi, together. Because the app is made for two people, we prepared a demo household where the second partner (Sam) is already active, so you can see every feature alone.

HOW TO SIGN IN
1. Swipe through the short intro.
2. On the Mochi+ screen, tap "Later" (top of the screen).
3. Tap "Continue with email" and enter review@mindpair.app. A password field appears for this demo account: enter the password above and tap "Sign in".

WHAT TO LOOK AT
- The weekly recap opens first (last week's results for the household).
- Home: Mochi's room and today's tasks for Alex (the demo user). Tick a task and Mochi reacts.
- Speech-bubble icon (top right): the Activity feed. Sam asks to hand over a task (Accept / Decline) and sent a reminder.
- Planner and Balance tabs: who does what this week, and how it balances out.
- In-app purchases: open the Budget tab to reach the Mochi+ screen. Two products:
  · Mochi+ 1-Year Pass: non-renewing subscription, one payment for 12 months.
  · Mochi+ Monthly: auto-renewable subscription, cancel anytime.
  Restore Purchases, Privacy Policy and Terms of Use are on the same screen.
- Account deletion: avatar (top right) > Profile > Delete my account. Please don't delete the demo account.

NOTES
- Built for iPhone; on iPad the app runs in iPhone compatibility mode.
- Notifications are optional (task reminders) and are asked for later, not at first launch.
- Sign in with Apple is also available.
```

En français, pour toi : on explique à Apple que l'app se vit à deux, qu'un foyer de démo est prêt avec Sam déjà actif, comment se connecter (passer l'intro, « Later » sur l'écran Mochi+, e-mail puis mot de passe), quoi regarder (récap, Accueil, Suivi, Planning, Balance, achats, suppression du compte), et que l'iPad affiche l'app au format iPhone.

---

## 2. Checklist

✅ fait et vérifié · ⬜ à faire · 🔁 à refaire à chaque soumission

### Le build
- ✅ **Build 25** rattaché à la version 1.0 (c'était le 21, corrigé le 15 nov).
- ✅ Build 25 sur TestFlight, dernière mise à jour publiée (17e, 15 nov).
- ✅ Prix Mochi+ affichés sur le vrai build (iPhone, 15 nov).
- ⬜ **Achat de test sur l'iPhone** (build 25) : acheter le Pass 1 an, puis le Mensuel, puis « Restaurer ». Rien n'est débité, c'est le compte de test d'Apple. Noter ce qui s'affiche après chaque achat.
- 🔁 **Foyer de démo réinstallé le jour même** (moi, dans Supabase). Si la revue dure plusieurs jours, je le réinstalle chaque jour.
- 🔁 Connexion au compte de démo vérifiée juste avant d'envoyer.

### L'écran d'achat (règle Apple 3.1.2)
- ✅ Au-dessus du bouton : nom, durée, prix réel, renouvellement (ou non), annulation. Textes en place en français et en anglais.
- ✅ Pas d'essai gratuit (rien à déclarer).
- ✅ Restaurer · Confidentialité · Conditions (EULA Apple) sur l'écran.

### La fiche App Store Connect
- ✅ **Description** FR et EN : liens Privacy Policy et Terms of Use déjà présents (vérifié le 15 nov).
  - Privacy : https://jeannecazalot-lgtm.github.io/privacy.html
  - Terms : https://www.apple.com/legal/internet-services/itunes/dev/stdeula/
- ⬜ **Achats intégrés** : les deux sont complets (« Prepare for Submission »). Au moment d'envoyer : « Add for Review » sur le groupe Mochi+ (Mensuel) et sur le Pass 1 an, puis sur la version. Ils partent ensemble dans la même soumission.
- ✅ Capture de revue de chaque abonnement (faite le 10 nov).
- ✅ Captures App Store FR et EN (iPhone). Pas de captures iPad à fournir, l'app n'est pas déclarée pour iPad.
- ✅ **App Privacy** publiée le 15 nov : 7 données (prénom, e-mail, photo, contenu, montants des dépenses, identifiant, achats), toutes pour le fonctionnement de l'app, liées au compte, aucun pistage. Adresse de la politique FR et EN.
- ✅ **Âge** : 4+ (déjà fait).
- ⬜ **Prix de l'app** : gratuite.
- ✅ Chiffrement : « aucun chiffrement non exempté », déjà déclaré dans l'app.
- ⬜ **Licence Apple Developer** : vérifier qu'aucun nouvel accord n'est en attente dans App Store Connect › Business. Le 10 nov, une licence non acceptée bloquait toute soumission.

### À revérifier à CHAQUE soumission (App Store Connect les remet à zéro)
- ✅ **Publication manuelle** cochée (à revérifier à chaque soumission).
- ✅ **Contact pour la revue** rempli le 15 nov (à revérifier à chaque soumission).
- 🔁 **Compte de démo et notes** de la partie 1 : identifiant et notes enregistrés le 15 nov ; ⬜ le mot de passe reste à coller.
- ✅ **Statut de commerçant (DSA) déclaré** : l'Union européenne (France comprise) peut rester ouverte. 174 pays pour l'app, 175 pour les abonnements.

### Règles Apple passées en revue
- ✅ 2.1 Complétude : pas d'écran vide ni de « bientôt » dans le parcours testé (iPad, 15 nov). Les outils de développement n'existent pas dans le build TestFlight.
- ✅ 4 iPad : l'app tourne en format iPhone sur iPad, sans élément coupé (simulateur iPad Air, 15 nov).
- ✅ 4.8 Sign in with Apple proposé à côté de l'e-mail.
- ✅ 5.1.1 Suppression du compte dans le Profil.
- ✅ 5.1.1 Phrases d'autorisation (photos, notifications) en français et en anglais.
- ✅ Pas de pistage publicitaire (aucune demande ATT).

---

## 3. Ce qui n'est PAS vérifié (à savoir avant d'envoyer)
- Le parcours complet du testeur sur le **vrai build 25 sur iPad** : tu n'as pas d'iPad. Il a été fait sur le simulateur d'iPad, avec le code de développement et les vraies données.
- L'**achat de test** (première case ⬜ ci-dessus).
- Le **report de la demande de notifications** à la première ouverture : codé, pas revu à l'écran.

## 4. Le rythme réel
- Revue Apple : de 1 à 7 jours en général. Un refus fait perdre environ une semaine.
- Publication manuelle : l'approbation ne publie rien. Tu choisis le jour de sortie.
