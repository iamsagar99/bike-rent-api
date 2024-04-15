/*
  Warnings:

  - Added the required column `price_after_discount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "price_after_discount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "total_payment" SET DATA TYPE DOUBLE PRECISION;
