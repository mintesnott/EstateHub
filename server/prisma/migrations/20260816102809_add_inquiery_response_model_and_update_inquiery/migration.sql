/*
  Warnings:

  - You are about to drop the column `subject` on the `Inquiry` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InquiryPurpose" AS ENUM ('BUY', 'RENT');

-- AlterEnum
ALTER TYPE "InquiryStatus" ADD VALUE 'BREACHED';

-- AlterTable
ALTER TABLE "Inquiry" DROP COLUMN "subject",
ADD COLUMN     "budgetMax" DECIMAL(14,2),
ADD COLUMN     "budgetMin" DECIMAL(14,2),
ADD COLUMN     "financingAvailable" BOOLEAN,
ADD COLUMN     "minBathrooms" INTEGER,
ADD COLUMN     "minBedrooms" INTEGER,
ADD COLUMN     "preferredLocation" TEXT,
ADD COLUMN     "preferredMoveInDate" TIMESTAMP(3),
ADD COLUMN     "purpose" "InquiryPurpose" NOT NULL DEFAULT 'BUY',
ADD COLUMN     "viewingRequested" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "message" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InquiryResponse" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "proposedPrice" DECIMAL(14,2),
    "viewingAvailable" BOOLEAN NOT NULL DEFAULT false,
    "proposedViewingAt" TIMESTAMP(3),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InquiryResponse_inquiryId_key" ON "InquiryResponse"("inquiryId");

-- AddForeignKey
ALTER TABLE "InquiryResponse" ADD CONSTRAINT "InquiryResponse_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InquiryResponse" ADD CONSTRAINT "InquiryResponse_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
