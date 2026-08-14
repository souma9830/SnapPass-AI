# Biometric Eye Glare & Refraction Evaluator

The **Biometric Eye Glare & Refraction Evaluator** detects lens reflections and pupil glare to satisfy ICAO eye visibility mandates.

## Key Functions
- `detectEyeSpecularReflection()`: Calculates pure white pixel ratios across eye regions.
- `<EyeGlareDiagnosticCard />`: Visual status badge and warning component.
- Tested via `frontend/src/test/__tests__/EyeGlareDiagnosticCard.test.jsx`.
