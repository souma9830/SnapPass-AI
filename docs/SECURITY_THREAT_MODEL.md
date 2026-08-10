# SnapPass AI — Security Threat Model & Hardening Matrix

This document outlines the security controls, threat vectors, and mitigation strategies enforced across the SnapPass AI monorepo.

## Threat Matrix & Mitigation Controls

| Threat Vector | Risk Level | Protection Control |
|---|---|---|
| Malicious File Uploads (Executables / Polyglots) | CRITICAL | Magic bytes signature inspection, file extension whitelist (`.jpeg`, `.png`, `.webp`), and size bounds (max 10MB). |
| EXIF Metadata Leaks (GPS / Camera Data) | HIGH | Automatic server-side EXIF metadata stripping via `exifScrubber.js` before disk or cloud persistence. |
| Brute Force / Auth Abuse | HIGH | Sliding window rate limiting on `/api/auth/*` endpoints (10 requests per 15 min per IP). |
| JWT Replay & Session Hijacking | CRITICAL | HTTP-only cookies, token revocation store check on every authenticated request, and session inactivity janitor. |
| XSS & Header Injection | MEDIUM | Helmet HTTP headers enforcement, CSP rules, and HTML sanitization of text inputs. |

## Client-Side EXIF Privacy Scrubbing
The `ExifMetadataInspector` component provides a one-click client-side canvas re-encoding mechanism (`stripExifMetadata`), purging GPS geolocation, camera serial numbers, and device timestamp tags before photo submission.


## Compliance & Auditing
All authentication events (logins, logouts, failed token validation, session revocations) are logged into the `SecurityAudit` MongoDB collection with IP, User-Agent, and severity telemetry.
