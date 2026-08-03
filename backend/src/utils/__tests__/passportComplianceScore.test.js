import { computePassportComplianceScore } from "../passportComplianceScore.js";

const passItem = (id, title) => ({ id, title, status: "pass", detail: "ok" });
const failItem = (id, title, detail) => ({ id, title, status: "fail", detail: detail || `${id} failed` });
const warnItem = (id, title, detail) => ({ id, title, status: "warn", detail: detail || `${id} warning` });

describe("computePassportComplianceScore", () => {
  it("scores a fully passing checklist 100 with PASS status", () => {
    const items = [
      passItem("face", "Face detection"),
      passItem("dpi_quality", "DPI & Print Quality"),
      passItem("blur", "Sharpness"),
      passItem("tilt", "Face Angle"),
      passItem("centering", "Centering"),
      passItem("background", "Background"),
      passItem("dimensions", "Dimensions"),
      passItem("lighting", "Lighting"),
    ];
    const result = computePassportComplianceScore(items);
    expect(result.score).toBe(100);
    expect(result.status).toBe("PASS");
    expect(result.deductions).toEqual([]);
    expect(result.summary).toEqual({ pass: 8, warn: 0, fail: 0 });
  });

  it("deducts full weight for a failed blur check (15 pts)", () => {
    const result = computePassportComplianceScore([
      passItem("face", "Face"),
      passItem("dpi_quality", "DPI"),
      failItem("blur", "Sharpness", "Image is blurry or out of focus."),
    ]);
    expect(result.score).toBe(85);
    expect(result.status).toBe("ACCEPTABLE");
    expect(result.deductions).toHaveLength(1);
    expect(result.deductions[0]).toMatchObject({
      item: "blur",
      level: "fail",
      points: 15,
    });
  });

  it("deducts half weight for warnings", () => {
    const result = computePassportComplianceScore([
      warnItem("lighting", "Lighting", "Uneven lighting detected."),
    ]);
    expect(result.score).toBe(98);
    expect(result.deductions[0]).toMatchObject({ item: "lighting", level: "warn", points: 2.5 });
  });

  it("reports FAIL status when the score drops below 70", () => {
    const items = [
      failItem("face", "Face"),
      failItem("blur", "Sharpness"),
      failItem("dimensions", "Dimensions"),
      failItem("dpi_quality", "DPI"),
      passItem("tilt", "Tilt"),
    ];
    const result = computePassportComplianceScore(items);
    expect(result.score).toBeLessThan(70);
    expect(result.status).toBe("FAIL");
    expect(result.deductions.length).toBe(4);
  });

  it("forces FAIL status when hardFail is set", () => {
    const result = computePassportComplianceScore(
      [passItem("face", "Face"), passItem("blur", "Sharpness")],
      { hardFail: true }
    );
    expect(result.status).toBe("FAIL");
    expect(result.hardFail).toBe(true);
  });

  it("uses a default weight for unknown items", () => {
    const result = computePassportComplianceScore([
      failItem("unknown_check", "Mystery"),
    ]);
    expect(result.score).toBe(95);
  });

  it("handles an empty checklist gracefully", () => {
    const result = computePassportComplianceScore([]);
    expect(result.score).toBe(100);
    expect(result.status).toBe("PASS");
    expect(result.summary).toEqual({ pass: 0, warn: 0, fail: 0 });
  });
});
