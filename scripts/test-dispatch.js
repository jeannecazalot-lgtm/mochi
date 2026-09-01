// Tests de l'algo de dispatch (SPECS §2) — node scripts/test-dispatch.js
// Charge src/dispatch.js via Babel (même config qu'Expo), sans bundler.
const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src', 'dispatch.js');
const code = babel.transformSync(fs.readFileSync(src, 'utf8'), { filename: src, presets: ['babel-preset-expo'], babelrc: false, configFile: false }).code;
const mod = { exports: {} };
new Function('module', 'exports', 'require', code)(mod, mod.exports, require);
const { computeDispatch } = mod.exports;

let failed = 0;
const check = (label, cond, detail = '') => {
  if (cond) console.log('OK ', label);
  else { failed++; console.log('ERR', label, detail); }
};

const A = { id: 'a', weekly_minutes: 600 };
const B = { id: 'b', weekly_minutes: 600 };
const T = (id, duration_min, per_week, pain = 2, extra = {}) => ({ id, duration_min, per_week, pain, ...extra });

// 1 · deux tâches identiques → une chacun
{
  const r = computeDispatch({ members: [A, B], tasks: [T('t1', 30, 2), T('t2', 30, 2)] });
  check('1. deux tâches égales → une chacun', new Set(r.items.map(i => i.assignee_id)).size === 2, JSON.stringify(r.items));
  check('1b. équilibre parfait', r.loads.a === r.loads.b && r.state === 'ok');
}

// 2 · la pénibilité perso pèse : à charge égale, la tâche va à celui qui ne la déteste pas
{
  const r = computeDispatch({ members: [A, B], tasks: [T('t1', 30, 2)], pains: { t1: { a: 'hate', b: 'like' } } });
  check('2. tâche détestée par A → va à B', r.items[0].assignee_id === 'b', JSON.stringify(r.items));
}

// 3 · le budget minutes (07) est respecté tant que possible
{
  const petitA = { id: 'a', weekly_minutes: 60 };
  const r = computeDispatch({ members: [petitA, B], tasks: [T('gros', 120, 1), T('petit', 30, 1)] });
  const gros = r.items.find(i => i.task_id === 'gros');
  check('3. grosse tâche hors budget de A → B', gros.assignee_id === 'b', JSON.stringify(r.items));
}

// 4 · effort conforme à la formule durée × freq × (1 + pain × 0,2)
{
  const r = computeDispatch({ members: [A, B], tasks: [T('t1', 15, 7, 2)] });
  check('4. effort = 15×7×1,4 = 147', Math.abs(r.items[0].effort - 147) < 1e-9, String(r.items[0].effort));
}

// 5 · déséquilibre irréductible → 'review' ; divisible → 'both' quand ça aide
{
  const r1 = computeDispatch({ members: [A, B], tasks: [T('enorme', 300, 2), T('mini', 5, 1)] });
  check('5. déséquilibre > 15 % sans divisible → review', r1.state === 'review', r1.state);
  const r2 = computeDispatch({ members: [A, B], tasks: [T('enorme', 300, 2, 2, { divisible: true }), T('mini', 5, 1)] });
  check('5b. divisible → both et état ok', r2.items.find(i => i.task_id === 'enorme').assignee_id === 'both' && r2.state === 'ok', JSON.stringify(r2));
}

// 6 · catalogue réaliste (8 tâches de la démo) → jamais > 15 % à budgets égaux
{
  const tasks = [T('vaisselle', 15, 7), T('cuisine', 40, 7), T('courses', 45, 1), T('lessive', 30, 2), T('menage', 60, 1, 3), T('sdb', 30, 1, 3), T('poubelles', 5, 2, 1), T('repas', 20, 1, 2, { mental_load: true })];
  const r = computeDispatch({ members: [A, B], tasks });
  const totalMin = r.items.reduce((s, i) => s + i.weekly_min, 0);
  check('6. catalogue réel → équilibré', r.state === 'ok', JSON.stringify(r.loads));
  check('6b. minutes totales conservées (610)', totalMin === 610, String(totalMin));
}

// 7 · solo (foyer à 1) → tout à la même personne, jamais review
{
  const r = computeDispatch({ members: [A], tasks: [T('t1', 30, 2), T('t2', 60, 1)] });
  check('7. solo → tout à A, état ok', r.items.every(i => i.assignee_id === 'a') && r.state === 'ok');
}

process.exit(failed ? 1 : 0);
