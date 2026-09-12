require("dotenv").config({ path: ".env.local" });
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.env.SUPERADMIN_EMAIL || "").trim().toLowerCase();
  if (!email) {
    console.error("Set SUPERADMIN_EMAIL in your environment before running the seed script.");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`A user with email ${email} already exists (role: ${existing.role}). Nothing to do.`);
    return;
  }

  const password = crypto.randomBytes(9).toString("base64").replace(/[+/=]/g, "x");
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { email, name: "Superadmin", passwordHash, role: "SUPERADMIN" },
  });

  console.log("\nSuperadmin account created:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log("\nSign in at /admin/login and consider changing this password afterward.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
