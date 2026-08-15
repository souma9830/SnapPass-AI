# Biometric Face Mesh Landmark Analyzer

The **Biometric Face Mesh Landmark Analyzer** provides real-time 3D facial landmark mesh rendering and ICAO compliance calculation for passport photo verification.

## Features
- **3D Landmark Distance Calculation**: Measures exact interpupillary distance (IPD) in pixels.
- **Head Orientation Metrics**: Evaluates Roll, Pitch, and Yaw angles against ICAO 9303 constraints.
- **SVG Overlay Component**: High-performance SVG mesh visualization for React frontends.
- **Confidence Scoring**: Dynamic confidence and symmetry rating algorithm.

## Usage Example

```jsx
import BiometricMeshViewer from '../components/BiometricMeshViewer';

<BiometricMeshViewer landmarks={facialMeshLandmarks} width={400} height={500} />
```
