import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable, notificationsTable } from "@workspace/db";
import { RegisterUserBody, LoginUserBody, RegisterUserResponse, LoginUserResponse, GetMeResponse } from "@workspace/api-zod";
import { signToken, requireAuth } from "../lib/auth";
import { generateInviteCode } from "../lib/invite";

const router: IRouter = Router();

// POST /auth/register
router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { username, email, password, inviteCode } = parsed.data;

  // Check duplicate
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (existingUser.length > 0) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newInviteCode = generateInviteCode();

  let invitedById: number | null = null;
  let startCoins = 0;

  if (inviteCode) {
    const [referrer] = await db.select().from(usersTable).where(eq(usersTable.inviteCode, inviteCode));
    if (referrer) {
      invitedById = referrer.id;
      startCoins = 1000; // new user gets 1000 coins
      // Referrer gets 100 coins
      await db.update(usersTable).set({ coins: referrer.coins + 100 }).where(eq(usersTable.id, referrer.id));
      // Notify referrer
      await db.insert(notificationsTable).values({
        userId: referrer.id,
        title: "Invite Reward!",
        message: `${username} joined using your invite code. You earned 100 coins!`,
        notifType: "invite",
        isRead: false,
      });
    }
  }

  const [user] = await db.insert(usersTable).values({
    username,
    email,
    passwordHash,
    coins: startCoins,
    level: 1,
    inviteCode: newInviteCode,
    invitedById: invitedById ?? undefined,
    isAdmin: false,
  }).returning();

  // Welcome notification for new user
  await db.insert(notificationsTable).values({
    userId: user.id,
    title: "Welcome to Ludo!",
    message: startCoins > 0
      ? `You joined with an invite code and earned ${startCoins} coins. Enjoy playing!`
      : "Welcome! Start playing and climb the rankings!",
    notifType: "welcome",
    isRead: false,
  });

  const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
  const response = RegisterUserResponse.parse({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      coins: user.coins,
      level: user.level,
      inviteCode: user.inviteCode,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
    token,
  });
  res.status(201).json(response);
});

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ userId: user.id, isAdmin: user.isAdmin });
  const response = LoginUserResponse.parse({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      coins: user.coins,
      level: user.level,
      inviteCode: user.inviteCode,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
    },
    token,
  });
  res.json(response);
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json(GetMeResponse.parse({
    id: user.id,
    username: user.username,
    email: user.email,
    coins: user.coins,
    level: user.level,
    inviteCode: user.inviteCode,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  }));
});

export default router;
