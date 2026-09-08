// ═══════════════════════════════════════════════════════════════════
// Seuils d'alerte du duo (households.threshold_warn_pct / threshold_alert_pct,
// migration 0009). Copie locale dans setup.thresholds pour l'affichage hors ligne.
// ═══════════════════════════════════════════════════════════════════
import { supabase } from './supabase';
import { loadSetup, setup, saveThresholds } from './setup-state';
import { occStore } from './demo-core';

export async function loadThresholds(householdId) {
  try {
    const { data } = await supabase.from('households').select('threshold_warn_pct, threshold_alert_pct').eq('id', householdId).maybeSingle();
    if (data && data.threshold_warn_pct != null) { saveThresholds({ warn: data.threshold_warn_pct, alert: data.threshold_alert_pct }); occStore.bump(); }
  } catch (e) { /* hors ligne : on garde la copie locale */ }
}

export async function saveThresholdsEverywhere({ warn, alert }) {
  await loadSetup();
  saveThresholds({ warn, alert });
  occStore.bump(); // Balance / Accueil recalculent leur état
  if (!setup.householdId) return;
  try { await supabase.from('households').update({ threshold_warn_pct: warn, threshold_alert_pct: alert }).eq('id', setup.householdId); } catch (e) { /* rejoué au prochain réglage */ }
}
