import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, friendshipsTable } from "@workspace/db";
import { GetInviteCodeResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

// GET /invite/code
router.get("/invite/code", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  // Count how many people used this invite code
  const referrals = await db.select().from(usersTable)
    .where(eq(usersTable.invitedById, user.id));
  const totalInvited = referrals.length;
  const coinsEarned = totalInvited * 100;

  res.json(GetInviteCodeResponse.parse({
    inviteCode: user.inviteCode,
    totalInvited,
    coinsEarned,
  }));
});

export default router;
