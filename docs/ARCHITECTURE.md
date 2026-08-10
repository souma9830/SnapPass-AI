# SnapPass AI — Monorepo Architecture & Flow Overview

SnapPass AI is an enterprise-grade AI-powered passport photo generation platform designed for ICAO 9303 compliance, virtual fitting, print layout export, and offline resilience.

## System Topology

```
+-------------------------------------------------------------------+
|                        Client Browser                             |
|  React 18 + Vite | Context API | IndexedDB | Service Worker | i18n|
+-------------------------------------------------------------------+
                                  |
                                  | HTTP / JSON API
                                  v
+-------------------------------------------------------------------+
|                     Express.js API Gateway                        |
|  Helmet | Rate Limiters | JWT Auth | Security Audit Log | Express  |
+-------------------------------------------------------------------+
                                  |
                                  | REST Service Calls
                                  v
+-------------------------------------------------------------------+
|                   Python AI Analytics Service                     |
|  FastAPI | OpenCV | MediaPipe Face Mesh | Quality Inspector Gate  |
+-------------------------------------------------------------------+
```

## Key Subsystems

1. **Frontend Studio App**: Built with React 18, Tailwind CSS, Framer Motion, and IndexedDB for offline storage. Handles live cropping, background color selection, attire virtual try-on, and high-DPI sheet export.
2. **Backend API Gateway**: Built with Node.js & Express.js. Manages JWT sessions, rate limiting, request validation, EXIF metadata scrubbing, and audit telemetry.
3. **Python AI Analytics Microservice**: FastAPI service executing face mesh detection, eye positioning, background uniformity scoring, and facial lighting symmetry analysis.

## Data Persistence & Offline Cache
- **IndexedDB Storage**: Stores compressed offline photo sessions for instant access during connectivity drops.
- **Token Revocation Store**: In-memory token blacklisting for revoked sessions with automated TTL cleanup.

## Studio Telemetry & Commercial Reporting
- **Financial PDF Exporter**: Client-side jsPDF generator constructing A4 commercial telemetry reports detailing revenue, consumables expense, and profit margin.

