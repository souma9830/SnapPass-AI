import { validateAndSanitizePreset, PRESET_LIMITS } from "../presetManager.js";

describe("validateAndSanitizePreset", () => {
  it("accepts a valid preset and returns sanitized values", () => {
    const result = validateAndSanitizePreset({
      name: "  India 35x45  ",
      label: " 35x45 mm (India / UK) ",
      widthMm: "35",
      heightMm: 45,
      dpi: 300,
      bgColor: "#ffffff",
    });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({
      name: "India 35x45",
      label: "35x45 mm (India / UK)",
      widthMm: 35,
      heightMm: 45,
      dpi: 300,
      bgColor: "#FFFFFF",
    });
  });

  it("rejects presets missing required fields", () => {
    const result = validateAndSanitizePreset({ widthMm: 35 });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("name is required.");
    expect(result.errors).toContain("label is required.");
    expect(result.errors).toContain("heightMm is required.");
  });

  it("rejects dimensions above the 500mm physical bound", () => {
    const result = validateAndSanitizePreset({
      name: "Huge",
      label: "Huge",
      widthMm: 600,
      heightMm: 45,
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      `widthMm must be between ${PRESET_LIMITS.MIN_DIMENSION_MM} and ${PRESET_LIMITS.MAX_DIMENSION_MM}.`
    );
  });

  it("rejects zero and negative dimensions", () => {
    const result = validateAndSanitizePreset({
      name: "Bad",
      label: "Bad",
      widthMm: 0,
      heightMm: -5,
    });
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBe(2);
  });

  it("rejects non-numeric dimensions and invalid dpi", () => {
    const result = validateAndSanitizePreset({
      name: "Bad",
      label: "Bad",
      widthMm: "abc",
      heightMm: 45,
      dpi: 10,
    });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.startsWith("widthMm"))).toBe(true);
    expect(result.errors.some((e) => e.startsWith("dpi"))).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    const result = validateAndSanitizePreset({
      name: "Bad",
      label: "Bad",
      widthMm: 35,
      heightMm: 45,
      bgColor: "not-a-color",
    });
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("bgColor must be a valid hex color (e.g. #FFFFFF).");
  });

  it("partial mode allows missing required fields", () => {
    const result = validateAndSanitizePreset({ heightMm: 60 }, { partial: true });
    expect(result.ok).toBe(true);
    expect(result.value).toEqual({ heightMm: 60 });
  });

  it("partial mode still enforces bounds on provided fields", () => {
    const result = validateAndSanitizePreset({ heightMm: 8000 }, { partial: true });
    expect(result.ok).toBe(false);
    expect(result.errors.some((e) => e.startsWith("heightMm"))).toBe(true);
  });

  it("trims and drops empty country entries", () => {
    const result = validateAndSanitizePreset({
      name: "A",
      label: "B",
      widthMm: 35,
      heightMm: 45,
      countries: ["  India ", "", "UK "],
    });
    expect(result.ok).toBe(true);
    expect(result.value.countries).toEqual(["India", "UK"]);
  });
});
