import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, '..');
const srcDir = path.join(backendRoot, 'src');

const extensions = ['.js', '.mjs'];
let failures = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '__tests__') {
      walk(full);
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      try {
        execSync(`node --check "${full}"`, { stdio: 'pipe' });
      } catch (e) {
        console.error(`SYNTAX ERROR: ${path.relative(backendRoot, full)}`);
        console.error(e.stderr?.toString().trim());
        failures++;
      }
    }
  }
}

console.log('Checking backend module syntax...');
walk(srcDir);

const routesDir = path.join(backendRoot, 'routes');
if (fs.existsSync(routesDir)) {
  walk(routesDir);
}

if (failures > 0) {
  console.error(`\n${failures} file(s) failed syntax check.`);
  process.exit(1);
}
console.log('All backend modules pass syntax check.');
