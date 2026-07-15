import { Router, type IRouter } from "express";
import { eq, desc, and } from "drizzle-orm";
import { db, notificationsTable } from "@workspace/db";
import {
  ListNotificationsResponse,
  GetUnreadCountResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadParams,
  MarkNotificationReadResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

// GET /notifications
router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const notifs = await db.select().from(notificationsTable)
    .where(eq(notificationsTable.userId, req.user!.userId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(50);
  res.json(ListNotificationsResponse.parse(notifs));
});

// GET /notifications/unread-count
router.get("/notifications/unread-count", requireAuth, async (req, res): Promise<void> => {
  const unread = await db.select().from(notificationsTable)
    .where(and(
      eq(notificationsTable.userId, req.user!.userId),
      eq(notificationsTable.isRead, false),
    ));
  res.json(GetUnreadCountResponse.parse({ count: unread.length }));
});

// PUT /notifications/read-all
router.put("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  await db.update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, req.user!.userId));
  res.json(MarkAllNotificationsReadResponse.parse({ count: 0 }));
});

// PUT /notifications/:id/read
router.put("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const params = MarkNotificationReadParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [notif] = await db.update(notificationsTable)
    .set({ isRead: true })
    .where(and(
      eq(notificationsTable.id, params.data.id),
      eq(notificationsTable.userId, req.user!.userId),
    ))
    .returning();
  if (!notif) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json(MarkNotificationReadResponse.parse(notif));
});

export default router;
