import { COOKIE_NAME } from "@shared/const";
import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

function json400(res: Response, message: string) {
  return res.status(400).json({ error: message });
}

export function registerOAuthRoutes(app: Express) {
  /* ── POST /api/auth/register ── */
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { email, password, name } = req.body ?? {};

    if (!email || !password || !name) {
      return json400(res, "Nome, email e senha são obrigatórios");
    }
    if (typeof password !== "string" || password.length < 6) {
      return json400(res, "Senha deve ter pelo menos 6 caracteres");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json400(res, "Email inválido");
    }

    const existing = await db.getUserByEmail(email);
    if (existing) {
      return json400(res, "Email já cadastrado");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const openId = nanoid(24);

    const isOwner = ENV.ownerOpenId && ENV.ownerOpenId === openId;
    await db.upsertUser({
      openId,
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash,
      loginMethod: "email",
      role: isOwner ? "admin" : "user",
      lastSignedIn: new Date(),
    });

    const token = await sdk.createSessionToken(openId, {
      name: String(name).trim(),
    });

    res.cookie(COOKIE_NAME, token, {
      ...getSessionCookieOptions(req),
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    const user = await db.getUserByOpenId(openId);
    return res.json({ success: true, user: { name: user?.name, email: user?.email, role: user?.role } });
  });

  /* ── POST /api/auth/login ── */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return json400(res, "Email e senha são obrigatórios");
    }

    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) {
      return json400(res, "Email ou senha inválidos");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return json400(res, "Email ou senha inválidos");
    }

    const token = await sdk.createSessionToken(user.openId, {
      name: user.name ?? "",
    });

    res.cookie(COOKIE_NAME, token, {
      ...getSessionCookieOptions(req),
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

    return res.json({ success: true, user: { name: user.name, email: user.email, role: user.role } });
  });

  /* ── POST /api/auth/logout ── */
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.clearCookie(COOKIE_NAME, { ...getSessionCookieOptions(req), maxAge: -1 });
    return res.json({ success: true });
  });
}
