-- AlterTable
ALTER TABLE "User" ADD COLUMN     "location" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'active';
