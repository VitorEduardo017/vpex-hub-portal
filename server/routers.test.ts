import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ═══════════════════════════════════════════════════════════════
// Test Helpers
// ═══════════════════════════════════════════════════════════════

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUserContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "test@vpex.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    companyId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(overrides: Partial<AuthenticatedUser> = {}): TrpcContext {
  return createUserContext({ role: "admin", ...overrides });
}

function createAnonymousContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ═══════════════════════════════════════════════════════════════
// Router Structure Tests
// ═══════════════════════════════════════════════════════════════

describe("Router structure", () => {
  it("should have all expected top-level routers", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(caller.auth).toBeDefined();
    expect(caller.dashboard).toBeDefined();
    expect(caller.admin).toBeDefined();
    expect(caller.intelligence).toBeDefined();
    expect(caller.system).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════
// Dashboard Router Tests
// ═══════════════════════════════════════════════════════════════

describe("dashboard router", () => {
  it("should require authentication for kpis", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.dashboard.kpis()).rejects.toThrow();
  });

  it("should require authentication for alerts", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.dashboard.alerts()).rejects.toThrow();
  });

  it("should require authentication for activities", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.dashboard.activities()).rejects.toThrow();
  });

  it("should require authentication for company", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.dashboard.company()).rejects.toThrow();
  });

  it("should require authentication for revenueByChannel", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.dashboard.revenueByChannel()).rejects.toThrow();
  });

  it("should return data for authenticated user with kpis", async () => {
    const caller = appRouter.createCaller(createUserContext());
    // Will return null if no company is linked, which is valid behavior
    const result = await caller.dashboard.kpis();
    // Result should be null (no company linked) or an object with KPI fields
    if (result !== null) {
      expect(result).toHaveProperty("currentMonthRevenueCents");
      expect(result).toHaveProperty("monthlyGoalCents");
      expect(result).toHaveProperty("daysRemaining");
      expect(result).toHaveProperty("dailyData");
    }
  });

  it("should return data for authenticated user with alerts", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.dashboard.alerts();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should return data for authenticated user with activities", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.dashboard.activities();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should accept limit parameter for activities", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.dashboard.activities({ limit: 5 });
    expect(Array.isArray(result)).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// Admin Router Tests
// ═══════════════════════════════════════════════════════════════

describe("admin router", () => {
  it("should reject non-admin users for overview", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.overview()).rejects.toThrow();
  });

  it("should reject anonymous users for overview", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.admin.overview()).rejects.toThrow();
  });

  it("should reject non-admin users for companies", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(caller.admin.companies()).rejects.toThrow();
  });

  it("should reject non-admin users for companyDetail", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.admin.companyDetail({ companyId: 1 })
    ).rejects.toThrow();
  });

  it("should reject non-admin users for createCompany", async () => {
    const caller = appRouter.createCaller(createUserContext());
    await expect(
      caller.admin.createCompany({
        name: "Test Company",
        segment: "digital",
      })
    ).rejects.toThrow();
  });

  it("should allow admin to get overview", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.overview();
    // Should return an object with admin overview data
    if (result !== null) {
      expect(result).toHaveProperty("totalMrrCents");
      expect(result).toHaveProperty("activeCount");
      expect(result).toHaveProperty("totalCount");
      expect(result).toHaveProperty("avgHealthScore");
      expect(result).toHaveProperty("companies");
    }
  });

  it("should allow admin to list companies", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.companies();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should allow admin to get company detail", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    // Company 1 should exist from seed
    const result = await caller.admin.companyDetail({ companyId: 1 });
    if (result !== null) {
      expect(result).toHaveProperty("company");
      expect(result).toHaveProperty("kpis");
      expect(result.company).toHaveProperty("name");
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// Intelligence Router Tests
// ═══════════════════════════════════════════════════════════════

describe("intelligence router", () => {
  it("should require authentication for commercial", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.intelligence.commercial()).rejects.toThrow();
  });

  it("should require authentication for marketing", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.intelligence.marketing()).rejects.toThrow();
  });

  it("should require authentication for logistics", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.intelligence.logistics()).rejects.toThrow();
  });

  it("should require authentication for hr", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    await expect(caller.intelligence.hr()).rejects.toThrow();
  });

  it("should return data for authenticated user with commercial", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.intelligence.commercial();
    // null if no company linked, or object with snapshots
    if (result !== null) {
      expect(result).toHaveProperty("snapshots");
      expect(result).toHaveProperty("companyId");
    }
  });

  it("should return data for authenticated user with marketing", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.intelligence.marketing();
    if (result !== null) {
      expect(result).toHaveProperty("metrics");
      expect(result).toHaveProperty("companyId");
    }
  });

  it("should return data for authenticated user with logistics", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.intelligence.logistics();
    if (result !== null) {
      expect(result).toHaveProperty("metrics");
      expect(result).toHaveProperty("companyId");
    }
  });

  it("should return data for authenticated user with hr", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.intelligence.hr();
    if (result !== null) {
      expect(result).toHaveProperty("metrics");
      expect(result).toHaveProperty("companyId");
    }
  });

  it("should accept custom date range for commercial", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.intelligence.commercial({
      startDate: "2026-01-01",
      endDate: "2026-04-05",
    });
    if (result !== null) {
      expect(result).toHaveProperty("snapshots");
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// Auth Router Tests (existing + extended)
// ═══════════════════════════════════════════════════════════════

describe("auth.me", () => {
  it("should return null for anonymous users", async () => {
    const caller = appRouter.createCaller(createAnonymousContext());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("should return user for authenticated users", async () => {
    const caller = appRouter.createCaller(createUserContext());
    const result = await caller.auth.me();
    expect(result).toBeDefined();
    expect(result?.name).toBe("Test User");
    expect(result?.email).toBe("test@vpex.com");
    expect(result?.role).toBe("user");
  });

  it("should return admin role for admin users", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.auth.me();
    expect(result?.role).toBe("admin");
  });
});
