# 🐍 Python AI Microservice

This microservice provides OpenCV, PIL, and U-2-Net (`rembg`) image processing capabilities for SnapPass-AI.

## 🚀 Features
- **Background Removal**: Clean segmentation using `rembg`.
- **Face Quality Gate**: Blur score detection via Laplacian variance, tilt angle calculation, and minimum resolution checks.
- **Compliance Inspector**: Automated ICAO passport guideline validation.
- **Print Sheet Generator**: High-DPI crop-marked print sheet generation for A4, 4x6, and 5x7 paper sizes.

## 🧪 Running Tests
```bash
pytest app/services/
```
