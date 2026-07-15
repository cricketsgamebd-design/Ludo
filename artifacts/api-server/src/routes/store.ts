import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, coinBundlesTable, usersTable, purchasesTable, notificationsTable } from "@workspace/db";
import {
  ListBundlesResponse,
  CreateBundleBody, CreateBundleResponse,
  UpdateBundleParams, UpdateBundleBody, UpdateBundleResponse,
  DeleteBundleParams,
  PurchaseBundleBody, PurchaseBundleResponse,
} from "@workspace/api-zod";
import { requireAuth, requireAdmin } from "../lib/auth";

const router: IRouter = Router();

function bundleToResponse(b: typeof coinBundlesTable.$inferSelect) {
  return {
    id: b.id,
    coinsAmount: b.coinsAmount,
    priceBdt: parseFloat(b.priceBdt as unknown as string),
    originalPriceBdt: b.originalPriceBdt != null ? parseFloat(b.originalPriceBdt as unknown as string) : null,
    discountPercent: b.discountPercent ?? null,
    label: b.label,
    isActive: b.isActive,
    sortOrder: b.sortOrder,
    createdAt: b.createdAt,
  };
}

// GET /store/bundles
router.get("/store/bundles", async (_req, res): Promise<void> => {
  const bundles = await db.select().from(coinBundlesTable)
    .where(eq(coinBundlesTable.isActive, true))
    .orderBy(asc(coinBundlesTable.sortOrder));
  res.json(ListBundlesResponse.parse(bundles.map(bundleToResponse)));
});

// POST /store/bundles (admin)
router.post("/store/bundles", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBundleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [bundle] = await db.insert(coinBundlesTable).values({
    coinsAmount: parsed.data.coinsAmount,
    priceBdt: String(parsed.data.priceBdt),
    originalPriceBdt: parsed.data.originalPriceBdt != null ? String(parsed.data.originalPriceBdt) : null,
    discountPercent: parsed.data.discountPercent ?? null,
    label: parsed.data.label,
    sortOrder: parsed.data.sortOrder,
    isActive: parsed.data.isActive ?? true,
  }).returning();
  res.status(201).json(CreateBundleResponse.parse(bundleToResponse(bundle)));
});

// PUT /store/bundles/:id (admin)
router.put("/store/bundles/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = UpdateBundleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateBundleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updateData: Record<string, unknown> = {};
  if (parsed.data.coinsAmount !== undefined) updateData["coinsAmount"] = parsed.data.coinsAmount;
  if (parsed.data.priceBdt !== undefined) updateData["priceBdt"] = String(parsed.data.priceBdt);
  if (parsed.data.originalPriceBdt !== undefined) updateData["originalPriceBdt"] = parsed.data.originalPriceBdt != null ? String(parsed.data.originalPriceBdt) : null;
  if (parsed.data.discountPercent !== undefined) updateData["discountPercent"] = parsed.data.discountPercent;
  if (parsed.data.label !== undefined) updateData["label"] = parsed.data.label;
  if (parsed.data.sortOrder !== undefined) updateData["sortOrder"] = parsed.data.sortOrder;
  if (parsed.data.isActive !== undefined) updateData["isActive"] = parsed.data.isActive;

  const [bundle] = await db.update(coinBundlesTable)
    .set(updateData)
    .where(eq(coinBundlesTable.id, params.data.id))
    .returning();
  if (!bundle) {
    res.status(404).json({ error: "Bundle not found" });
    return;
  }
  res.json(UpdateBundleResponse.parse(bundleToResponse(bundle)));
});

// DELETE /store/bundles/:id (admin)
router.delete("/store/bundles/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params["id"]) ? req.params["id"][0] : req.params["id"];
  const id = parseInt(raw ?? "", 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const params = DeleteBundleParams.safeParse({ id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db.delete(coinBundlesTable).where(eq(coinBundlesTable.id, params.data.id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Bundle not found" });
    return;
  }
  res.sendStatus(204);
});

// POST /store/purchase
router.post("/store/purchase", requireAuth, async (req, res): Promise<void> => {
  const parsed = PurchaseBundleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [bundle] = await db.select().from(coinBundlesTable)
    .where(eq(coinBundlesTable.id, parsed.data.bundleId));
  if (!bundle || !bundle.isActive) {
    res.status(404).json({ error: "Bundle not found or inactive" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  // Add coins
  const newCoins = user.coins + bundle.coinsAmount;
  await db.update(usersTable).set({ coins: newCoins }).where(eq(usersTable.id, user.id));
  // Record purchase
  await db.insert(purchasesTable).values({
    userId: user.id,
    bundleId: bundle.id,
    coinsAmount: bundle.coinsAmount,
    pricePaid: bundle.priceBdt,
  });
  // Notification
  await db.insert(notificationsTable).values({
    userId: user.id,
    title: "Purchase Successful!",
    message: `You purchased ${bundle.label} and received ${bundle.coinsAmount.toLocaleString()} coins.`,
    notifType: "purchase",
    isRead: false,
  });
  res.json(PurchaseBundleResponse.parse({
    coinsAdded: bundle.coinsAmount,
    newBalance: newCoins,
    bundleLabel: bundle.label,
  }));
});

export default router;
