import numpy as np
from app.services.shadow_uniformity_inspector import ShadowUniformityInspector

def test_shadow_uniformity_clean():
    inspector = ShadowUniformityInspector(variance_threshold=18.5)
    bg = np.ones((100, 100)) * 250
    res = inspector.inspect_shadows(bg)
    assert res["has_harsh_shadows"] is False
    assert res["uniformity_score"] == 100.0

def test_shadow_uniformity_harsh():
    inspector = ShadowUniformityInspector(variance_threshold=18.5)
    bg = np.random.normal(128, 30, (100, 100))
    res = inspector.inspect_shadows(bg)
    assert res["has_harsh_shadows"] is True
    assert res["status"] == "HARSH_SHADOWS_DETECTED"