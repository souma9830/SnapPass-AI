from app.services.face_center_crop_calculator import FaceCenterCropCalculator

def test_crop_calculator():
    calc = FaceCenterCropCalculator()
    res = calc.calculate_crop_box(1000, 1000, [100, 100, 200, 200])
    assert res["face_centered"] is True
    assert res["crop_w"] > 200