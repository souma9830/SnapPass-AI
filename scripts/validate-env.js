import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('\n--- SnapPass-AI Environment Configuration Validator ---\n');

let failed = false;

// 1. Backend validation
const backendEnvPath = path.join(rootDir, 'backend', '.env');
const backendExamplePath = path.join(rootDir, 'backend', '.env.example');

if (!fs.existsSync(backendEnvPath)) {
  console.error('❌ Error: backend/.env file is missing!');
  console.log(`💡 Instruction: Please copy ${path.relative(rootDir, backendExamplePath)} to backend/.env and fill in your values.\n`);
  failed = true;
} else {
  console.log('✅ Found backend/.env');
  const content = fs.readFileSync(backendEnvPath, 'utf8');
  
  const requiredKeys = ['MONGO_URI', 'JWT_SECRET', 'RESEND_API_KEY', 'EMAIL_FROM'];
  requiredKeys.forEach(key => {
    const regex = new RegExp(`^${key}\\s*=\\s*(.*)$`, 'm');
    const match = content.match(regex);
    if (!match || !match[1] || match[1].trim() === '' || match[1].includes('your_') || match[1].includes('placeholder')) {
      console.warn(`⚠️  Warning: ${key} is missing or appears to be a placeholder value in backend/.env`);
    } else {
      console.log(`   - ${key} is configured`);
    }
  });
}

// 2. Frontend validation
const frontendEnvPath = path.join(rootDir, 'frontend', '.env');
const frontendExamplePath = path.join(rootDir, 'frontend', '.env.example');

if (!fs.existsSync(frontendEnvPath)) {
  console.error('❌ Error: frontend/.env file is missing!');
  console.log(`💡 Instruction: Please copy ${path.relative(rootDir, frontendExamplePath)} to frontend/.env and fill in your values.\n`);
  failed = true;
} else {
  console.log('✅ Found frontend/.env');
}

console.log('\n----------------------------------------------------');
if (failed) {
  console.log('❌ Validation finished: Setup is incomplete. Please fix errors above.');
  process.exit(1);
} else {
  console.log('✅ Validation finished: Developer environment is configured correctly.');
  process.exit(0);
}
