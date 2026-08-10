# 💻 SnapPass-AI Developer Onboarding & Local Setup Guide

## 🛠️ Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher
- **Docker & Docker Compose** (Optional, for containerized local dev)

---

## 🏃 Local Development Quickstart

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Python AI Service Setup
```bash
cd python-ai-service
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

## ⌨️ Global Keyboard Shortcuts Cheat Sheet
The `KeyboardShortcutsModal.jsx` component listens globally for `Shift + ?` to toggle an interactive modal overlay detailing hotkeys for photo download (`Ctrl+S`), print preview (`Ctrl+P`), AI Assistant (`Alt+C`), and dialog dismissal (`Esc`).


## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

## 📏 Print Bleed & Page Margin Customizer
The `PrintBleedMarginAdjuster.jsx` component exposes real-time slider controls for fine-tuning individual photo bleed margins (0–10mm) and outer page margin padding (5–25mm) on multi-photo print sheets.

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

## 📏 Print Bleed & Page Margin Customizer
The `PrintBleedMarginAdjuster.jsx` component exposes real-time slider controls for fine-tuning individual photo bleed margins (0–10mm) and outer page margin padding (5–25mm) on multi-photo print sheets.

## 🌡️ White Balance & Color Temperature Adjuster
The `ColorTemperatureAdjuster.jsx` component provides Kelvin temperature shift (-50K to +50K) and green/magenta tint balance sliders for correcting indoor ambient lighting color cast.

## 📄 Custom Paper Size & Print Dimension Calculator
The `CustomPaperSizeCalculator.jsx` component converts custom width/height (mm) and target resolution (150, 300, 600 DPI) into calculated pixel canvas bounds (`pxWidth` x `pxHeight`).

## 💡 Print Cost & Savings Estimator
The `PrintCostEstimator.jsx` widget calculates DIY home printing costs against retail commercial studio fees based on paper cost, ink cost, and photo quantity.

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

## 📏 Print Bleed & Page Margin Customizer
The `PrintBleedMarginAdjuster.jsx` component exposes real-time slider controls for fine-tuning individual photo bleed margins (0–10mm) and outer page margin padding (5–25mm) on multi-photo print sheets.

## 🌡️ White Balance & Color Temperature Adjuster
The `ColorTemperatureAdjuster.jsx` component provides Kelvin temperature shift (-50K to +50K) and green/magenta tint balance sliders for correcting indoor ambient lighting color cast.

## 📄 Custom Paper Size & Print Dimension Calculator
The `CustomPaperSizeCalculator.jsx` component converts custom width/height (mm) and target resolution (150, 300, 600 DPI) into calculated pixel canvas bounds (`pxWidth` x `pxHeight`).

## 💡 Print Cost & Savings Estimator
The `PrintCostEstimator.jsx` widget calculates DIY home printing costs against retail commercial studio fees based on paper cost, ink cost, and photo quantity.

## ⌨️ Keyboard Shortcuts & Accessibility Guide
The `KeyboardShortcutsModal.jsx` component provides a floating trigger and modal sheet listening to global key shortcuts (`Shift + ?`, `Alt + C`, `Ctrl+S`, `Escape`).

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

## 📏 Print Bleed & Page Margin Customizer
The `PrintBleedMarginAdjuster.jsx` component exposes real-time slider controls for fine-tuning individual photo bleed margins (0–10mm) and outer page margin padding (5–25mm) on multi-photo print sheets.

## 🌡️ White Balance & Color Temperature Adjuster
The `ColorTemperatureAdjuster.jsx` component provides Kelvin temperature shift (-50K to +50K) and green/magenta tint balance sliders for correcting indoor ambient lighting color cast.

## 📄 Custom Paper Size & Print Dimension Calculator
The `CustomPaperSizeCalculator.jsx` component converts custom width/height (mm) and target resolution (150, 300, 600 DPI) into calculated pixel canvas bounds (`pxWidth` x `pxHeight`).

## 💡 Print Cost & Savings Estimator
The `PrintCostEstimator.jsx` widget calculates DIY home printing costs against retail commercial studio fees based on paper cost, ink cost, and photo quantity.

## ⌨️ Keyboard Shortcuts & Accessibility Guide
The `KeyboardShortcutsModal.jsx` component provides a floating trigger and modal sheet listening to global key shortcuts (`Shift + ?`, `Alt + C`, `Ctrl+S`, `Escape`).

## 🩺 Photo Quality Health Meter & Biometric Audit
The `PhotoQualityHealthMeter.jsx` component evaluates upload file health with visual progress meter, resolution grading, lighting uniformity checks, and background isolation audit.

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

## 📷 Photo Technical Metadata (EXIF) Inspector
The `ExifMetadataInspector.jsx` component parses file dimensions, Megapixel count, aspect ratio, and evaluates against ICAO print resolution guidelines (>=600px).

## 📏 Print Bleed & Page Margin Customizer
The `PrintBleedMarginAdjuster.jsx` component exposes real-time slider controls for fine-tuning individual photo bleed margins (0–10mm) and outer page margin padding (5–25mm) on multi-photo print sheets.

## 🌡️ White Balance & Color Temperature Adjuster
The `ColorTemperatureAdjuster.jsx` component provides Kelvin temperature shift (-50K to +50K) and green/magenta tint balance sliders for correcting indoor ambient lighting color cast.

## 📄 Custom Paper Size & Print Dimension Calculator
The `CustomPaperSizeCalculator.jsx` component converts custom width/height (mm) and target resolution (150, 300, 600 DPI) into calculated pixel canvas bounds (`pxWidth` x `pxHeight`).

---

## 🧪 Testing Suites
- **Frontend Unit Tests**: `cd frontend && npm test`
- **Backend Tests**: `cd backend && npm test`
- **Python AI Tests**: `cd python-ai-service && pytest`

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

