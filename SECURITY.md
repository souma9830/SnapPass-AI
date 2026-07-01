# Security Policy

## Responsible Disclosure

We take security seriously. If you discover a security vulnerability in **SnapPass AI**, please let us know as soon as possible. Follow these steps to report the issue responsibly:

1. **Do not publicly disclose** the vulnerability or share it with anyone who does not need to know.
2. **Contact us** via the security email listed below. Include a clear description of the issue, steps to reproduce, impact, and any relevant logs or screenshots.
3. **Allow us time to respond**. We will acknowledge receipt of your report within 48 hours and aim to provide a fix or mitigation promptly.
4. **Coordinate disclosure**. Once a fix is released, we will work with you to coordinate a public announcement if desired.

### Preferred Contact Method
- Email: **security@snapass.ai** (replace with actual address)
- Open a **draft security advisory**: https://github.com/souma9830/SnapPass-AI/security/advisories/new
- PGP key (optional for encrypted communication):
```
-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----
```

### What to Include in Your Report
- Detailed description of the vulnerability
- Steps to reproduce (including any test files or payloads)
- Expected vs. actual behavior
- Potential impact (e.g., data leakage, unauthorized access)
- Any mitigations you have identified

### Our Commitment
- We will treat all reports with confidentiality and professionalism.
- We will credit you (if you wish) in any public advisory.
- We will aim to resolve the vulnerability as quickly as possible.

---

## Automated Security Scanning

SnapPass AI uses several automated security tools to proactively identify vulnerabilities:

| Tool | Schedule | Scope |
|------|----------|-------|
| Dependabot | Weekly (Mon–Thu) | npm, pip, Docker, GitHub Actions |
| npm audit | Weekly (Monday) | Frontend & backend direct dependencies |
| OpenSSF Scorecard | Weekly (Sunday) | Overall project security posture |
| Trivy | Weekly (Sunday) | Filesystem vulnerability scanning |
| Semgrep | Per PR + Weekly | SAST for JavaScript and Python |
| CodeQL | Per PR + Weekly | Deep code analysis |

Results are automatically uploaded as workflow artifacts and SARIF reports are integrated with GitHub Security tab.

---

*This security policy is part of the SnapPass AI open-source project. Contributions and feedback are welcome to improve our security posture.*
