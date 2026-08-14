# Watermark Tamper-Proof Steganography Engine

The **Watermark Tamper-Proof Steganography Engine** embeds invisible LSB cryptographic signatures into passport photos to prevent unauthorized photo editing or identity forgery.

## Components
- `<SteganographyWatermarkCard />`: Client signature embedding UI.
- `validateSteganographyHeader()`: Server verification service.
- Unit tested via `frontend/src/test/__tests__/SteganographyWatermarkCard.test.jsx`.
