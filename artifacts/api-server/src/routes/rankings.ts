import { Router, type IRouter } from "express";
import { eq, desc, inArray } from "drizzle-orm";
import { db, usersTable, friendshipsTable } from "@workspace/db";
import { GetGlobalRankingsResponse, GetFriendsRankingsResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

// GET /rankings/global
router.get("/rankings/global", requireAuth, async (_req, res): Promise<void> => {
  const users = await db.select().from(usersTable)
    .orderBy(desc(usersTable.coins))
    .limit(100);
  const ranked = users.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    username: u.username,
    coins: u.coins,
    level: u.level,
  }));
  res.json(GetGlobalRankingsResponse.parse(ranked));
});

// GET /rankings/friends
router.get("/rankings/friends", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  // Get all friend IDs (both directions)
  const friendships = await db.select().from(friendshipsTable)
    .where(eq(friendshipsTable.userId, userId));
  const friendIds = friendships.map(f => f.friendId);
  // Include self
  const allIds = [userId, ...friendIds];

  if (allIds.length === 0) {
    res.json(GetFriendsRankingsResponse.parse([]));
    return;
  }

  const users = await db.select().from(usersTable)
    .where(inArray(usersTable.id, allIds))
    .orderBy(desc(usersTable.coins));
  const ranked = users.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    username: u.username,
    coins: u.coins,
    level: u.level,
  }));
  res.json(GetFriendsRankingsResponse.parse(ranked));
});

export default router;
