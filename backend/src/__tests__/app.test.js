import request from "supertest";
import app from "../app.js";

describe("Health check & basic routes tests", () => {
  it("should return 200 OK for base route GET /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "SnapPass AI Backend API");
  });

  it("should return 200 OK for GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("service", "SnapPass AI Backend");
    expect(res.body).toHaveProperty("timestamp");
  });

  it("should return 404 for non-existent routes", async () => {
    const res = await request(app).get("/api/non-existent-route");
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Route not found");
  });
});
