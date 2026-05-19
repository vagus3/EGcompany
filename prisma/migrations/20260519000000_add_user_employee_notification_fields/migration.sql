-- AlterTable
ALTER TABLE "User" ADD COLUMN "employeeCode" TEXT;
ALTER TABLE "User" ADD COLUMN "department" TEXT NOT NULL DEFAULT 'General';
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'employee';
ALTER TABLE "User" ADD COLUMN "clearanceLevel" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN "notificationEmail" TEXT;
ALTER TABLE "User" ADD COLUMN "notificationEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeCode_key" ON "User"("employeeCode");
