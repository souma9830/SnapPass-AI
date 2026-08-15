# Contributor Checklist

Before opening a PR, verify the following:

## Code Quality
- [ ] Code follows project conventions (JSDoc for JS, PEP 8 + docstrings for Python)
- [ ] No `console.log` or `print()` statements left in production code
- [ ] Variable names are descriptive (no single-letter names except loop counters)
- [ ] Components are under 200 lines; split if larger

## Testing
- [ ] Unit tests added for new logic
- [ ] Tests pass locally (`npm run test:run` or `pytest`)
- [ ] Edge cases covered (empty input, null values, boundary conditions)

## Security
- [ ] No hardcoded secrets or API keys
- [ ] File paths are validated before filesystem access
- [ ] User input is sanitized before processing
- [ ] Authentication/authorization checks are in place for protected routes

## Documentation
- [ ] README.md updated if new features are added
- [ ] API endpoints documented (request/response examples)
- [ ] New files have descriptive docstrings/comments

## PR Process
- [ ] Branch name follows convention (`type/short-description`)
- [ ] Issue title includes `[GSSoC_2026]`
- [ ] PR description includes "Closes #ISSUE_NUMBER"
- [ ] PR is based on latest `master` (no merge conflicts)
- [ ] At least 5 files modified (create + delete + update)

## Python AI Service Specific
- [ ] `file_path` inputs validated via `path_guard.py`
- [ ] Magic-byte checks before image processing
- [ ] Graceful degradation when optional dependencies are missing
- [ ] Temp files cleaned up after use
