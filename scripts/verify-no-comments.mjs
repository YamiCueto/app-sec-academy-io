import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (/\.(ts|html|scss)$/.test(file)) {
      results.push(full);
    }
  }
  return results;
}

const files = walk('src');
const invalid = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    const cleaned = line.replace(/https?:\/\/[^\s"'`)]+/g, '');
    if (/\/\/|\/\*|<!--/.test(cleaned)) {
      invalid.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (invalid.length > 0) {
  console.error('Violacion de politica: Comentarios detectados en codigo fuente:\n' + invalid.join('\n'));
  process.exit(1);
}

console.log('Auditoria de cero comentarios superada exitosamente en ' + files.length + ' archivos.');
