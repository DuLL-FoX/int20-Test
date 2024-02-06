/*
  Warnings:

  - The `status` column on the `auctions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `sessionId` on the `chat_session` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuctionLotStatus" AS ENUM ('ACTIVE', 'SOLD', 'UNSOLD');

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "auctionLotLogoUrl" TEXT NOT NULL DEFAULT '',
DROP COLUMN "status",
ADD COLUMN     "status" "AuctionStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "chat_session" DROP COLUMN "sessionId";

-- DropEnum
DROP TYPE "Status";
