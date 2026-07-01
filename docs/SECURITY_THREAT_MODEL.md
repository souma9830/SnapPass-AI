# 🛡️ SnapPass AI - Security & Threat Model Guide

This guide outlines the threat model, architecture security boundaries, and implemented countermeasures within the SnapPass AI project. Maintainers and contributors must adhere to these policies to prevent vulnerabilities in production.

---

## 🧭 Security Boundaries

```
[ User Browser ] ──( HTTPS, CORS, Helmet )──> [ Express Backend ] ──( API Keys, JSON )──> [ Python AI Service ]
```

1. **Client-to-Backend**: Secured using strict Cross-Origin Resource Sharing (CORS) rules, Helmet-enforced Content Security Policy (CSP), and Rate Limiting.
2. **Backend-to-AI-Service**: Backend proxying to avoid direct exposure of python-ai-service to the internet.

---

## 🚫 Identified Threats & Mitigations

### 1. Remote Code Execution (RCE) via Malicious Image Upload
* **Threat**: Attacker uploads a web shell disguised as an image file (e.g. polyglot file, PHP, or executable) which gets executed on the server.
* **Mitigation**:
  - The backend uses `multer` configured to write files to disk with random names and no file extension.
  - MIME-type validation is performed using a magic number scan via `file-type` in `upload.middleware.js` rather than trusting the user's extension.
  - Public static uploads folder is served with Express static middleware without execute permissions.

### 2. Cross-Site Scripting (XSS) & NoSQL Injection
* **Threat**: Malicious input injected in request query parameters, request bodies, or route parameters targeting database queries or rendering pages.
* **Mitigation**:
  - `express-mongo-sanitize` is applied globally to strip keys prefixed with `$` or containing `.`.
  - Input sanitization middleware recursively strips dangerous HTML tags from all inputs (body, query, params).
  - CSP rules define exactly where scripts and resources can be loaded from.

### 3. Denial of Service (DoS) via File Upload & Request Flooding
* **Threat**: Attackers uploading extremely large files or spamming the image processing endpoints, exhausting server RAM and disk space.
* **Mitigation**:
  - Global API rate limiter (`express-rate-limit`) limits clients to a safe maximum number of requests per window.
  - Multer configures a strict `LIMIT_FILE_SIZE` (default 10MB) to drop large payloads early before disk buffer writes.
  - Body-parser payload limits are capped at `10mb`.

### 4. Cross-Origin Data Leakage (CORS Violations)
* **Threat**: Malicious third-party domains triggering requests to read private processed images or user tokens.
* **Mitigation**:
  - CORS configuration explicitly white-lists specific origins and credentials mode.
  - HSTS headers are enabled to enforce secure HTTPS channels.
  - `X-Frame-Options: DENY` prevents clickjacking.
  - `Permissions-Policy` blocks camera, microphone, geolocation, and payment API access from the backend.

### 5. Sensitive Information Disclosure via Server Headers
* **Threat**: Attackers fingerprinting the server stack through verbose HTTP headers (X-Powered-By, Server).
* **Mitigation**:
  - `X-Powered-By` header is disabled.
  - Helmet's `hidePoweredBy` removes Express fingerprinting.
  - Custom `X-Robots-Tag: noindex, nofollow` prevents search engine indexing of API responses.

### 6. Missing Security Contact Information
* **Threat**: Security researchers unable to find a responsible disclosure channel.
* **Mitigation**:
  - `security.txt` served at `/.well-known/security.txt` per RFC 9116.
  - `SECURITY.md` includes multiple contact methods and in-scope vulnerability types.
  - GitHub Security Advisory integration enabled for private disclosures.

### 7. Crawler Abuse and Resource Exhaustion
* **Threat**: Web crawlers consuming API bandwidth or indexing non-public endpoints.
* **Mitigation**:
  - `robots.txt` explicitly disallows `/api/` and `/admin/` paths.
  - `Crawl-Delay: 10` directive limits aggressive crawlers.
  - API rate limiting provides an additional layer of protection.
