/**
 * Changelog Generator for SnapPass AI.
 *
 * Scans git log for conventional commits since the last tag and
 * produces a CHANGELOG.md section ready for the release drafter.
 *
 * Usage:
 *   node scripts/generate-changelog.js [--from <tag>] [--to <tag>]
 *
 * Examples:
 *   node scripts/generate-changelog.js
 *   node scripts/generate-changelog.js --from v0.1.0 --to HEAD
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const GROUP_ORDER = [
  { type: 'feat', heading: 'Features' },
  { type: 'fix', heading: 'Bug Fixes' },
  { type: 'security', heading: 'Security' },
  { type: 'perf', heading: 'Performance' },
  { type: 'a11y', heading: 'Accessibility' },
  { type: 'refactor', heading: 'Refactoring' },
  { type: 'style', heading: 'Styles' },
  { type: 'test', heading: 'Tests' },
  { type: 'ci', heading: 'CI/CD' },
  { type: 'docs', heading: 'Documentation' },
  { type: 'chore', heading: 'Maintenance' },
];

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { from: null, to: 'HEAD' };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--from' && args[i + 1]) {
      options.from = args[++i];
    } else if (args[i] === '--to' && args[i + 1]) {
      options.to = args[++i];
    }
  }

  if (!options.from) {
    try {
      options.from = execSync('git describe --tags --abbrev=0', {
        encoding: 'utf8',
      }).trim();
    } catch {
      options.from = execSync('git rev-list --max-parents=0 HEAD', {
        encoding: 'utf8',
      }).trim();
    }
  }

  return options;
}

function getCommits(from, to) {
  const range = `${from}..${to}`;
  try {
    const log = execSync(
      `git log ${range} --format="%s|||%h|||%an|||%ai" --no-merges`,
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    return log
      .trim()
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const [subject, hash, author, date] = line.split('|||');
        return { subject: subject.trim(), hash: hash.trim(), author: author.trim(), date: date.trim() };
      });
  } catch {
    return [];
  }
}

function parseCommitType(subject) {
  const match = subject.match(/^(\w+)(\([^)]+\))?:\s*.+/);
  if (match) {
    return { type: match[1], scope: match[2] ? match[2].slice(1, -1) : null };
  }
  return { type: 'other', scope: null };
}

function formatCommit(commit) {
  const { scope } = parseCommitType(commit.subject);
  const scopePrefix = scope ? `**${scope}:** ` : '';
  const message = commit.subject.replace(/^(\w+)(\([^)]+\))?:\s*/, '');
  return `- ${scopePrefix}${message} ([${commit.hash}](${getRepoUrl()}/commit/${commit.hash})) @${commit.author}`;
}

function getRepoUrl() {
  try {
    const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    return remote
      .replace(/^git@([^:]+):/, 'https://$1/')
      .replace(/\.git$/, '');
  } catch {
    return 'https://github.com/souma9830/SnapPass-AI';
  }
}

function generateChangelog() {
  const { from, to } = parseArgs();
  console.log(`Generating changelog from ${from} to ${to}...\n`);

  const commits = getCommits(from, to);

  if (commits.length === 0) {
    console.log('No new commits found.');
    return;
  }

  const grouped = {};
  for (const { type } of GROUP_ORDER) {
    grouped[type] = [];
  }
  grouped.other = [];

  for (const commit of commits) {
    const { type } = parseCommitType(commit.subject);
    const group = GROUP_ORDER.find((g) => g.type === type);
    if (group) {
      grouped[group.type].push(commit);
    } else {
      grouped.other.push(commit);
    }
  }

  let output = `## What's Changed\n\n`;

  for (const { type, heading } of GROUP_ORDER) {
    const groupCommits = grouped[type];
    if (groupCommits.length > 0) {
      output += `### ${heading}\n\n`;
      for (const commit of groupCommits) {
        output += formatCommit(commit) + '\n';
      }
      output += '\n';
    }
  }

  if (grouped.other.length > 0) {
    output += `### Other Changes\n\n`;
    for (const commit of grouped.other) {
      output += formatCommit(commit) + '\n';
    }
    output += '\n';
  }

  const changelogPath = path.join(rootDir, 'CHANGELOG.md');
  const dateStr = new Date().toISOString().split('T')[0];
  const version = process.env.RELEASE_VERSION || 'Unreleased';
  const header = `# Changelog\n\n## [${version}] - ${dateStr}\n\n`;

  let existing = '';
  if (fs.existsSync(changelogPath)) {
    existing = fs.readFileSync(changelogPath, 'utf8');
    // Remove the header + first entry to rebuild
    existing = existing.replace(/^# Changelog\n\n##.*?\n\n/s, '');
  }

  fs.writeFileSync(changelogPath, header + output + '\n' + '---\n\n' + existing);
  console.log(`Changelog written to ${changelogPath}`);
  console.log(`\n--- Stats ---`);
  console.log(`Total commits: ${commits.length}`);
}

generateChangelog();
