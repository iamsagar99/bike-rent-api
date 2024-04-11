/*
  Warnings:

  - Added the required column `bookingId` to the `FeedBack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FeedBack" ADD COLUMN     "bookingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "FeedBack" ADD CONSTRAINT "FeedBack_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
