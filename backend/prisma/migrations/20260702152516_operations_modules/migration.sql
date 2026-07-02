-- CreateEnum
CREATE TYPE "CostStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Cost" ADD COLUMN     "status" "CostStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "accountEmail" TEXT,
ADD COLUMN     "internalOwner" TEXT,
ADD COLUMN     "recommendedUse" TEXT;

-- AlterTable
ALTER TABLE "Renewal" ADD COLUMN     "reminderDays" INTEGER;
