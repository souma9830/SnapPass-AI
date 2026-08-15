class FaceCenterCropCalculator:
    def calculate_crop_box(self, img_w, img_h, face_bbox):
        if not face_bbox:
            return {"crop_x": 0, "crop_y": 0, "crop_w": img_w, "crop_h": img_h}
        
        fx, fy, fw, fh = face_bbox
        cx = fx + (fw / 2.0)
        cy = fy + (fh / 2.0)
        
        size = max(fw * 2.2, fh * 2.2)
        crop_x = max(0, int(cx - (size / 2.0)))
        crop_y = max(0, int(cy - (size * 0.4)))
        
        return {
            "crop_x": crop_x,
            "crop_y": crop_y,
            "crop_w": int(size),
            "crop_h": int(size),
            "face_centered": True
        }