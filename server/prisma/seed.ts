import dotenv from "dotenv";

import prisma from "../src/config/database.js";
import { hashPassword } from "../src/utils/password.js";

dotenv.config();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;


  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Missing ADMIN_EMAIL or ADMIN_PASSWORD in environment variables."
    );
  }
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`ℹ️ Admin user (${adminEmail}) already exists. Skipping.`);
    return;
  }

  // Hash the admin password with Argon2
  const hashedPassword = await hashPassword(adminPassword)

  // Create initial ADMIN user
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: adminEmail,
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Default ADMIN user created: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });