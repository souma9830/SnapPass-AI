/**
 * Commitlint configuration for SnapPass AI.
 * Enforces conventional commit format across all contributions.
 *
 * See CONTRIBUTING.md for commit message guidelines.
 */
const Configuration = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build',
        'revert',
        'security',
        'a11y',
        'i18n',
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'frontend',
        'backend',
        'python-ai',
        'docker',
        'ci',
        'docs',
        'deps',
        'config',
        'ui',
        'api',
        'auth',
        'upload',
        'editor',
        'print',
        'admin',
        'i18n',
        'a11y',
        'security',
        'release',
      ],
    ],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
  },
  helpUrl:
    'https://github.com/souma9830/SnapPass-AI/blob/master/CONTRIBUTING.md#branch--commit-guidelines',
};

export default Configuration;
