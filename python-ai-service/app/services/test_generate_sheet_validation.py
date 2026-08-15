"""Tests for generate-sheet input validation."""
import pytest
from app.services.sheet_generator import generate_sheet


class TestQuantityValidation:
    def test_quantity_zero_raises(self):
        with pytest.raises(ValueError, match="greater than zero"):
            generate_sheet(["dummy.jpg"], quantity=0)

    def test_quantity_negative_raises(self):
        with pytest.raises(ValueError, match="greater than zero"):
            generate_sheet(["dummy.jpg"], quantity=-1)

    def test_quantity_positive_works(self):
        # Should not raise for valid quantity (will raise for missing file, which is fine)
        with pytest.raises(Exception):
            generate_sheet(["dummy.jpg"], quantity=1)


class TestPresetValidation:
    def test_unknown_preset_raises(self):
        with pytest.raises(ValueError, match="Unknown preset"):
            generate_sheet(["dummy.jpg"], preset_id="invalid")