/*
  Warnings:

  - You are about to drop the `InquiryResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InquiryResponse" DROP CONSTRAINT "InquiryResponse_agentId_fkey";

-- DropForeignKey
ALTER TABLE "InquiryResponse" DROP CONSTRAINT "InquiryResponse_inquiryId_fkey";

-- DropTable
DROP TABLE "InquiryResponse";
