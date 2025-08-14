/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EnforcementType" AS ENUM ('SOFT_BAN', 'HARD_BAN', 'SHADOW_BAN');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "applicationFeeMinor" INTEGER,
ADD COLUMN     "processingFeeMinor" INTEGER,
ADD COLUMN     "stripeChargeId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "connectOnboardingStatus" TEXT,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "stripeAccountId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "Enforcement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "EnforcementType" NOT NULL,
    "reason" TEXT,
    "until" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enforcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enforcement_userId_idx" ON "Enforcement"("userId");

-- CreateIndex
CREATE INDEX "Enforcement_active_idx" ON "Enforcement"("active");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeAccountId_key" ON "User"("stripeAccountId");

-- AddForeignKey
ALTER TABLE "Enforcement" ADD CONSTRAINT "Enforcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
