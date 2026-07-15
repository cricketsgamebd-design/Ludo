import bcrypt from "bcryptjs";
import { db, usersTable, coinBundlesTable, notificationsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const testHash  = await bcrypt.hash("test123",  10);

  // Admin
  await db.insert(usersTable).values({
    username: "Admin", email: "admin@ludo.com", passwordHash: adminHash,
    coins: 999999, level: 99, inviteCode: "ADMINCODE", isAdmin: true,
  }).onConflictDoNothing();

  // Test users with varying coins for ranking
  const users = [
    { username:"Niloy", email:"niloy@ludo.com", coins:45200, level:12, inviteCode:"NILOY123" },
    { username:"Rakib", email:"rakib@ludo.com", coins:38500, level:10, inviteCode:"RAKIB456" },
    { username:"Tania", email:"tania@ludo.com", coins:52100, level:15, inviteCode:"TANIA789" },
    { username:"Sumon", email:"sumon@ludo.com", coins:29700, level:8,  inviteCode:"SUMON321" },
    { username:"Mitu",  email:"mitu@ludo.com",  coins:61400, level:18, inviteCode:"MITUXYZ1" },
  ];
  for (const u of users) {
    await db.insert(usersTable).values({ ...u, passwordHash: testHash, isAdmin: false }).onConflictDoNothing();
    console.log(`  User ${u.username} done`);
  }

  // Coin bundles
  const bundles = [
    { coinsAmount:5000,   priceBdt:"89",   originalPriceBdt:"109",  discountPercent:18, label:"Starter Pack",  sortOrder:1 },
    { coinsAmount:10000,  priceBdt:"169",  originalPriceBdt:"209",  discountPercent:19, label:"Bronze Pack",   sortOrder:2 },
    { coinsAmount:25000,  priceBdt:"399",  originalPriceBdt:"499",  discountPercent:20, label:"Silver Pack",   sortOrder:3 },
    { coinsAmount:50000,  priceBdt:"749",  originalPriceBdt:"999",  discountPercent:25, label:"Gold Pack",     sortOrder:4 },
    { coinsAmount:75000,  priceBdt:"1049", originalPriceBdt:"1499", discountPercent:30, label:"Platinum Pack", sortOrder:5 },
    { coinsAmount:100000, priceBdt:"1299", originalPriceBdt:"1999", discountPercent:35, label:"Diamond Pack",  sortOrder:6 },
  ];
  for (const b of bundles) {
    await db.insert(coinBundlesTable).values({ ...b, isActive: true }).onConflictDoNothing();
    console.log(`  Bundle ${b.label} done`);
  }

  // Welcome notification for Niloy
  const [niloy] = await db.select().from(usersTable);
  if (niloy) {
    await db.insert(notificationsTable).values({
      userId: niloy.id, title: "Welcome to Ludo!", notifType: "welcome",
      message: "Welcome back! New tournaments are live. Check the store for coin deals!", isRead: false,
    }).onConflictDoNothing();
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
