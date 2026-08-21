// Vérifie la syntaxe JS/JSX d'un ou plusieurs fichiers avec la config Babel d'Expo (rapide, sans bundler).
// Usage : node scripts/check-syntax.js app/foo.js src/bar.js
const babel = require('@babel/core');
const fs = require('fs');
let bad = 0;
for (const f of process.argv.slice(2)) {
  try { babel.transformSync(fs.readFileSync(f, 'utf8'), { filename: f, presets: ['babel-preset-expo'], babelrc: false, configFile: false }); console.log('OK ', f); }
  catch (e) { bad++; console.log('ERR', f, '\n   ', e.message.split('\n')[0]); }
}
process.exit(bad ? 1 : 0);
