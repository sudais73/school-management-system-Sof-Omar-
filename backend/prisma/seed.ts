import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env before seeding");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin already exists for ${email}, skipping seed.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName: "U-Lead Super Admin",
      role: "SUPER_ADMIN",
      // The seeded admin is a real, known-good account from the start —
      // skip the temp-password/forced-change flow that applies to
      // accounts admin creates for other people later.
      isVerified: true,
      mustChangePassword: false,
    },
  });

  console.log(`Seeded SUPER_ADMIN account for ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
