#!/usr/bin/env node
/**
 * fix-engine-warnings.js
 * Run from the project root: node fix-engine-warnings.js
 * Fixes all 7 ESLint @typescript-eslint/no-unused-vars warnings
 * from the Vercel build log without touching any logic.
 */

const fs   = require('fs');
const path = require('path');

let fixed = 0;
let skipped = 0;

function patch(filePath, find, replace, description) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.log(`  SKIP  (not found): ${filePath}`);
    skipped++;
    return;
  }
  const original = fs.readFileSync(abs, 'utf8');
  if (!original.includes(find)) {
    console.log(`  SKIP  (already fixed or pattern changed): ${filePath}`);
    skipped++;
    return;
  }
  const patched = original.replace(find, replace);
  fs.writeFileSync(abs, patched, 'utf8');
  console.log(`  FIXED: ${filePath}  — ${description}`);
  fixed++;
}

console.log('\nVedRith engine warning patcher\n');

// 1. ayanamsha.ts — J2000 unused constant
patch(
  'lib/engines/ephemeris/ayanamsha.ts',
  'const J2000',
  'const _J2000',
  'J2000 → _J2000'
);

// 2. planets.ts — d unused variable
patch(
  'lib/engines/ephemeris/planets.ts',
  'const d =',
  'const _d =',
  'd → _d'
);

// 3. sunrise.ts — tropicalLongitude unused
patch(
  'lib/engines/ephemeris/sunrise.ts',
  'const tropicalLongitude',
  'const _tropicalLongitude',
  'tropicalLongitude → _tropicalLongitude'
);

// 4. sunrise.ts — m unused variable (line 204)
patch(
  'lib/engines/ephemeris/sunrise.ts',
  '\n  const m =',
  '\n  const _m =',
  'm → _m (line 204)'
);

// 5. houses.ts — computeObliquity unused import
patch(
  'lib/engines/kundali/houses.ts',
  'computeObliquity, ',
  '',
  'remove unused computeObliquity import'
);
patch(
  'lib/engines/kundali/houses.ts',
  ', computeObliquity',
  '',
  'remove unused computeObliquity import (trailing)'
);

// 6. zodiac.ts — computeAyanamsha unused import
patch(
  'lib/engines/kundali/zodiac.ts',
  'computeAyanamsha, ',
  '',
  'remove unused computeAyanamsha import'
);
patch(
  'lib/engines/kundali/zodiac.ts',
  ', computeAyanamsha',
  '',
  'remove unused computeAyanamsha import (trailing)'
);

// 7. nakshatra.ts — normalize360 unused import
patch(
  'lib/engines/panchanga/nakshatra.ts',
  'normalize360, ',
  '',
  'remove unused normalize360 import'
);
patch(
  'lib/engines/panchanga/nakshatra.ts',
  ', normalize360',
  '',
  'remove unused normalize360 import (trailing)'
);

console.log(`\nDone. Fixed: ${fixed}  Skipped (already clean or not found): ${skipped}`);
console.log('\nNext steps:');
console.log('  git add -A && git commit -m "fix: remove unused vars in engine files (ESLint warnings)"');
console.log('  git push\n');
