import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('screenshots/phase-9d2');
for (const f of files) {
  const stat = fs.statSync(path.join('screenshots/phase-9d2', f));
  console.log(f.padEnd(48), (stat.size / 1024).toFixed(1) + ' KB');
}

