import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user-001",
    email: "franqueado@boticario.com.br",
    name: "Carlos Mendes",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 99,
    openId: "admin-vpex-001",
    email: "admin@vpex.com.br",
    name: "VPEX Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeNull();
  });

  it("returns user data for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).not.toBeNull();
    expect(result?.openId).toBe("test-user-001");
    expect(result?.email).toBe("franqueado@boticario.com.br");
    expect(result?.name).toBe("Carlos Mendes");
    expect(result?.role).toBe("user");
  });

  it("returns admin role for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
    expect(result?.name).toBe("VPEX Admin");
  });
});

describe("appRouter structure", () => {
  it("has auth router with me and logout procedures", () => {
    // Verify the router has the expected structure
    expect(appRouter._def.procedures).toBeDefined();
    
    // Check auth procedures exist
    const procedureKeys = Object.keys(appRouter._def.procedures);
    expect(procedureKeys).toContain("auth.me");
    expect(procedureKeys).toContain("auth.logout");
  });

  it("has system router", () => {
    const procedureKeys = Object.keys(appRouter._def.procedures);
    // system router should have at least notifyOwner
    const systemProcedures = procedureKeys.filter(k => k.startsWith("system."));
    expect(systemProcedures.length).toBeGreaterThan(0);
  });
});
