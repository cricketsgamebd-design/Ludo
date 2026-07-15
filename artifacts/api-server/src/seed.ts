import bcrypt from "bcryptjs";
import { db, usersTable, coinBundlesTable, notificationsTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("admin123", 10);
  const testHash  = await bcrypt.hash("test123",  10);

  await db.insert(usersTable).values({
    username: "Admin", email: "admin@ludo.com", passwordHash: adminHash,
    coins: 999999, level: 99, inviteCode: "ADMINCODE", isAdmin: true,
  }).onConflictDoNothing();

  const testUsers = [
    { username:"Niloy", email:"niloy@ludo.com", coins:45200, level:12, inviteCode:"NILOY123" },
    { username:"Rakib", email:"rakib@ludo.com", coins:38500, level:10, inviteCode:"RAKIB456" },
    { username:"Tania", email:"tania@ludo.com", coins:52100, level:15, inviteCode:"TANIA789" },
    { username:"Sumon", email:"sumon@ludo.com", coins:29700, level:8,  inviteCode:"SUMON321" },
    { username:"Mitu",  email:"mitu@ludo.com",  coins:61400, level:18, inviteCode:"MITUXYZ1" },
  ];
  for (const u of testUsers) {
    await db.insert(usersTable).values({ ...u, passwordHash: testHash, isAdmin: false }).onConflictDoNothing();
    console.log(`  User ${u.username} done`);
  }

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

  // Seed rich notifications for niloy (first test user after admin)
  const [, niloy] = await db.select().from(usersTable).limit(2);
  if (niloy) {
    const notifs = [
      { title: "লুডো গেমে স্বাগতম! 🎉", message: "নতুন টুর্নামেন্ট শুরু হয়েছে। স্টোরে দেখুন দারুণ অফার!", notifType: "welcome" },
      { title: "টুর্নামেন্ট শুরু হচ্ছে!", message: "Summer Ludo Championship আগামীকাল শুরু। প্রস্তুত থাকুন!", notifType: "tournament_start" },
      { title: "ম্যাচ রেডি ✅", message: "আপনার ম্যাচ রুম তৈরি! Room #2847 এ যোগ দিন।", notifType: "match_ready" },
      { title: "বন্ধু অনলাইনে 👥", message: "Rakib এখন অনলাইনে আছে। এখনই চ্যালেঞ্জ করুন!", notifType: "friend_online" },
      { title: "পুরস্কার পেয়েছেন! 🎁", message: "Daily Login Bonus: ৫০০ কয়েন আপনার অ্যাকাউন্টে যোগ হয়েছে।", notifType: "reward_received" },
      { title: "ডিপোজিট সফল 💰", message: "৫,০০০ কয়েন সফলভাবে আপনার অ্যাকাউন্টে যোগ হয়েছে।", notifType: "deposit_success" },
      { title: "উইথড্র সম্পন্ন", message: "আপনার উইথড্র অনুরোধ প্রক্রিয়াধীন। ২৪ ঘণ্টার মধ্যে হবে।", notifType: "withdrawal_success" },
      { title: "অ্যাপ আপডেট 🔄", message: "লুডো গেম v1.1.0 — নতুন গেম মোড ও বাগ ফিক্স।", notifType: "update_notice" },
      { title: "রক্ষণাবেক্ষণ নোটিশ 🔧", message: "রাত ২টা থেকে ৪টা পর্যন্ত সার্ভার মেইনটেন্যান্স চলবে।", notifType: "maintenance_notice" },
      { title: "বন্ধুর অনুরোধ 👤", message: "Tania আপনাকে বন্ধু হিসেবে যোগ করতে চাইছে।", notifType: "friend_request" },
      { title: "ম্যাচে আমন্ত্রণ 🎮", message: "Sumon আপনাকে একটি ম্যাচে চ্যালেঞ্জ করেছে!", notifType: "match_invite" },
      { title: "টুর্নামেন্ট বার্তা 🏆", message: "Quarter Final এ আপনার পরবর্তী ম্যাচ আজ রাত ৮টায়।", notifType: "tournament_message" },
      { title: "উপহার পেয়েছেন! 🎀", message: "Mitu আপনাকে ২০০ কয়েন উপহার পাঠিয়েছে।", notifType: "gift" },
      { title: "অ্যাডমিন ঘোষণা 📢", message: "বিশেষ ইদ অফার: সব কয়েন বান্ডেলে ৩০% ছাড়!", notifType: "admin" },
    ];

    for (const n of notifs) {
      await db.insert(notificationsTable).values({
        userId: niloy.id, ...n, isRead: false,
      }).onConflictDoNothing();
    }
    console.log(`  Seeded ${notifs.length} notifications for ${niloy.username}`);
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
