import fs from 'fs';

const content = fs.readFileSync('src/config/sampleProperties.ts', 'utf-8');
const nameMatches = [...content.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1]);
const slugMatches = [...content.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);
const coverMatches = [...content.matchAll(/coverImage:\s*'([^']+)'/g)].map(m => m[1]);

console.log('Sample properties count:', nameMatches.length);
nameMatches.forEach((name, i) => {
  console.log(`${i + 1}. ${name} (${slugMatches[i]})`);
  console.log(`   Cover: ${coverMatches[i]}`);
});

