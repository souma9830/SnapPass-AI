import request from "supertest";

jest.mock("../models/securityAudit.model.js", () => ({
  __esModule: true,
  default: {
    logSecurityEvent: jest.fn().mockResolvedValue({}),
  },
}));

import app from "../app.js";

describe("Protected routes require authentication", () => {
  const protectedRoutes = [
    "post /api/upload/",
    "post /api/upload/batch",
    "post /api/process",
    "post /api/process/process",
    "post /api/print/generate-sheet",
  ];

  it.each(protectedRoutes)("%s returns 401 without a token", async (route) => {
    const [method, path] = route.split(" ");
    const res = await request(app)[method](path);
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty(
      "message",
      "No authentication token provided"
    );
  });

  it("allows unauthenticated GET /api/print/presets", async () => {
    const res = await request(app).get("/api/print/presets");
    expect(res.statusCode).not.toEqual(401);
  });
});
