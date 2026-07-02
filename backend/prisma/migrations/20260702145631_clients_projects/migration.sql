-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "backendProviderId" TEXT,
ADD COLUMN     "databaseProviderId" TEXT,
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "estimatedDeliveryDate" TIMESTAMP(3),
ADD COLUMN     "frontendProviderId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_frontendProviderId_fkey" FOREIGN KEY ("frontendProviderId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_backendProviderId_fkey" FOREIGN KEY ("backendProviderId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_databaseProviderId_fkey" FOREIGN KEY ("databaseProviderId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;
