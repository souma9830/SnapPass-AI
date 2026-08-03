import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

describe('Global cursor behavior (issue 878)', () => {
  const cssPath = path.resolve(process.cwd(), 'src/index.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  it('defaults the page cursor to the arrow pointer', () => {
    expect(css).toMatch(/body\s*{[^}]*cursor:\s*default/);
  });

  it('shows a pointer on interactive elements', () => {
    expect(css).toMatch(/a,[\s\S]*?cursor:\s*pointer/);
  });

  it('keeps the text I-beam only for editable fields', () => {
    expect(css).toMatch(/input:not\([^)]*\)[\s\S]*?textarea[\s\S]*?cursor:\s*text/);
  });
});
