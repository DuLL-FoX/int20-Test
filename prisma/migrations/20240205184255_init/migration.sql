-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'ENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
