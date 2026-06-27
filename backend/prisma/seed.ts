import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import dotenv from "dotenv";
import { hashPassword } from "../src/services/password.service.js";

dotenv.config();

const prisma = new PrismaClient();

function getAdminRole(value: string | undefined) {
  if (!value) return UserRole.ADMIN;

  const role = value.toUpperCase();

  if (!Object.values(UserRole).includes(role as UserRole)) {
    throw new Error(`Invalid ADMIN_ROLE "${value}".`);
  }

  return role as UserRole;
}

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "NexoDigital Admin";
  const role = getAdminRole(process.env.ADMIN_ROLE);

  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the initial admin.",
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
      status: UserStatus.ACTIVE,
    },
    create: {
      email,
      name,
      passwordHash,
      role,
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
