import { Router, type IRouter } from "express";
import { eq, and, inArray } from "drizzle-orm";
import { db, usersTable, friendshipsTable } from "@workspace/db";
import { ListFriendsResponse, AddFriendBody, AddFriendResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

// GET /friends
router.get("/friends", requireAuth, async (req, res): Promise<void> => {
  const userId = req.user!.userId;
  const friendships = await db.select().from(friendshipsTable)
    .where(eq(friendshipsTable.userId, userId));
  if (friendships.length === 0) {
    res.json(ListFriendsResponse.parse([]));
    return;
  }
  const friendIds = friendships.map(f => f.friendId);
  const friends = await db.select().from(usersTable)
    .where(inArray(usersTable.id, friendIds));
  res.json(ListFriendsResponse.parse(friends.map(u => ({
    id: u.id,
    username: u.username,
    coins: u.coins,
    level: u.level,
  }))));
});

// POST /friends
router.post("/friends", requireAuth, async (req, res): Promise<void> => {
  const parsed = AddFriendBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const userId = req.user!.userId;
  const [friend] = await db.select().from(usersTable)
    .where(eq(usersTable.username, parsed.data.username));
  if (!friend) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (friend.id === userId) {
    res.status(400).json({ error: "Cannot add yourself" });
    return;
  }
  // Check already friends
  const existing = await db.select().from(friendshipsTable)
    .where(and(eq(friendshipsTable.userId, userId), eq(friendshipsTable.friendId, friend.id)));
  if (existing.length > 0) {
    res.status(400).json({ error: "Already friends" });
    return;
  }
  await db.insert(friendshipsTable).values({ userId, friendId: friend.id });
  res.status(201).json(AddFriendResponse.parse({
    id: friend.id,
    username: friend.username,
    coins: friend.coins,
    level: friend.level,
  }));
});

export default router;
