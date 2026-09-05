// ═══════════════════════════════════════════════════════════════════
// État RÉEL du setup — remplace la démo figée pour la chaîne
// 07 (dispos) → 08 (préférences) → 10 (tâches) → 11 (calcul) → 12 (dispatch).
// Source de vérité locale (AsyncStorage), offline-first ; la synchro
// Supabase (household_members.availability, task_pains, tasks,
// occurrences) se branche par-dessus, table par table.
// ═══════════════════════════════════════════════════════════════════
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'mochi:setup:v1';
const state = {
  availability: null,     // 07 · grille { morning: [0|1|2 ×7], evening: [...] }
  weekly_minutes: null,   // 07 · slider heures/sem × 60
  prefs: null,            // 08 · { [task_id]: 'like' | 'hate' }
  reminder: null,         // 08 · heure du rappel quotidien
  tasks: null,            // 10 · [{ id, label, emoji, duration_min, per_week, pain, mental_load, divisible }]
  result: null,           // 11 · sortie de computeDispatch + méta d'affichage
  realTaskIds: null,      // synchro · id local → uuid Supabase (rejouer ≠ dupliquer)
  householdId: null,      // foyer réel (créé au « C'est parti » ou rejoint par code)
};

let loadedPromise = null;
export function loadSetup() {
  if (!loadedPromise) {
    loadedPromise = AsyncStorage.getItem(KEY)
      .then(raw => { if (raw) Object.assign(state, JSON.parse(raw)); return state; })
      .catch(() => state);
  }
  return loadedPromise;
}
export const setup = state; // lecture directe (après loadSetup au moins une fois)

const persist = () => AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});

export function saveDispos({ availability, weekly_minutes }) { state.availability = availability; state.weekly_minutes = weekly_minutes; persist(); }
export function savePrefs({ prefs, reminder }) { state.prefs = prefs; state.reminder = reminder; persist(); }
export function saveTasks(tasks) { state.tasks = tasks; persist(); }
export function saveResult(result) { state.result = result; persist(); }
export function saveRealTaskIds(map) { state.realTaskIds = map; persist(); }
export function saveHouseholdId(id) { state.householdId = id; persist(); }
export function clearSetup() { Object.keys(state).forEach(k => { state[k] = null; }); persist(); }

// fréquence du catalogue ({ daily } | { perWeek: n } | { perDay: n }) → occurrences/semaine
export const freqPerWeek = f => (f?.daily ? 7 : f?.perDay ? f.perDay * 7 : f?.perWeek || 1);

// Mode réel = on a un foyer (créé OU rejoint), même encore vide — retour test à
// deux du 3 sept 2026 : qui rejoignait n'avait jamais de dispatch local et
// retombait sur la démo figée (fausses tâches validées, fausses notifs, faux jour).
// À appeler après loadSetup().
export const inRealMode = () => !!(state.householdId || state.result?.items?.length);
