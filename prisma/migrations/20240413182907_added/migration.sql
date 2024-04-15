/*
  Warnings:

  - Added the required column `milage` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "milage" INTEGER NOT NULL;
