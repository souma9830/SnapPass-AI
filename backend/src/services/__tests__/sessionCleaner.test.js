import { SessionCleaner } from "../sessionCleaner.service.js";

jest.mock("../../models/session.model.js", () => ({
  __esModule: true,
  default: {
    updateMany: jest.fn(),
  },
}));

import Session from "../../models/session.model.js";

describe("SessionCleaner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deactivates stale sessions older than the inactivity limit", async () => {
    Session.updateMany.mockResolvedValue({ modifiedCount: 3 });
    const count = await SessionCleaner.execute();
    expect(count).toBe(3);
    const [filter, update] = Session.updateMany.mock.calls[0];
    expect(filter.isValid).toBe(true);
    expect(filter.updatedAt).toHaveProperty("$lt");
    expect(filter.updatedAt.$lt).toBeInstanceOf(Date);
    expect(update).toEqual({ $set: { isValid: false } });
  });

  it("leaves recent sessions untouched", async () => {
    Session.updateMany.mockResolvedValue({ modifiedCount: 0 });
    const count = await SessionCleaner.execute();
    expect(count).toBe(0);
    const [filter] = Session.updateMany.mock.calls[0];
    const cutoff = filter.updatedAt.$lt.getTime();
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    expect(cutoff).toBeLessThanOrEqual(now);
    expect(cutoff).toBeGreaterThan(now - thirtyDays - 60 * 1000);
  });

  it("returns 0 and does not throw when the database call fails", async () => {
    Session.updateMany.mockRejectedValue(new Error("database unreachable"));
    const count = await SessionCleaner.execute();
    expect(count).toBe(0);
  });
});
