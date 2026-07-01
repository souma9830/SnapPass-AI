# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest release | ✅ Active development |
| Previous releases | ❌ Please upgrade |

## Responsible Disclosure

We take security seriously. If you discover a security vulnerability in **SnapPass AI**, please let us know as soon as possible. Follow these steps to report the issue responsibly:

1. **Do not publicly disclose** the vulnerability or share it with anyone who does not need to know.
2. **Contact us** via one of the methods below. Include a clear description of the issue, steps to reproduce, impact, and any relevant logs or screenshots.
3. **Allow us time to respond**. We will acknowledge receipt of your report within 48 hours and aim to provide a fix or mitigation promptly.
4. **Coordinate disclosure**. Once a fix is released, we will work with you to coordinate a public announcement if desired.

### Preferred Contact Methods

- **Email:** security@snappass.ai
- **GitHub Advisory:** https://github.com/souma9830/SnapPass-AI/security/advisories/new
- **security.txt:** https://snappass.ai/.well-known/security.txt

### What to Include in Your Report

- Detailed description of the vulnerability
- Steps to reproduce (including any test files or payloads)
- Expected vs. actual behavior
- Potential impact (e.g., data leakage, unauthorized access)
- Affected component (frontend, backend, Python AI service, Docker)
- Any mitigations you have identified
- CWE reference if known (e.g., CWE-79 for XSS, CWE-22 for path traversal)

### In-Scope Vulnerabilities

We are interested in:

- Remote code execution (RCE)
- Cross-site scripting (XSS) — stored, reflected, DOM-based
- Cross-site request forgery (CSRF)
- Path traversal / LFI / RFI
- Authentication bypass
- SQL/NoSQL injection
- Server-side request forgery (SSRF)
- Privilege escalation
- Insecure direct object references (IDOR)
- Sensitive data exposure
- Race conditions in image processing pipeline

### Out of Scope

The following are considered out of scope:

- Rate limiting bypass without demonstrated impact
- Missing HTTP security headers without a demonstrated exploitation scenario
- Self-XSS
- Social engineering attacks
- Physical attacks
- Denial of Service attacks (we have rate limiting in place)

## Security Features

SnapPass AI implements the following security measures:

| Measure | Status |
|---------|--------|
| CORS whitelist | ✅ Configured |
| Helmet security headers | ✅ CSP, HSTS, XFO, COEP |
| Rate limiting (API, Auth, OTP) | ✅ Implemented |
| Input sanitization (XSS prevention) | ✅ Middleware |
| Magic byte validation for uploads | ✅ file-type lib |
| Path traversal protection | ✅ Multiple validation layers |
| Multer file size limits | ✅ 10MB default |
| HTTP-only cookies (JWT) | ✅ Configured |
| Password policy enforcement | ✅ 8-32 chars, special chars |
| OTP cooldown & attempt limiting | ✅ 60s cooldown, 5 attempts |
| MongoDB injection prevention | ✅ express-mongo-sanitize |
| HPP (HTTP parameter pollution) | ✅ hpp middleware |
| Body size limits | ✅ 10mb JSON/URL-encoded |
| Docker healthchecks | ✅ All services |
| Security.txt | ✅ Published |

## Threat Model

For a detailed security threat model, see our [Security Threat Model Guide](docs/SECURITY_THREAT_MODEL.md).

---

## Our Commitment

- We will treat all reports with confidentiality and professionalism.
- We will credit you (if you wish) in any public advisory.
- We will aim to resolve the vulnerability as quickly as possible.

---

*This security policy is part of the SnapPass AI open-source project. Contributions and feedback are welcome to improve our security posture.*
