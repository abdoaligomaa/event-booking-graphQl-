/*
  Warnings:

  - The `date` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date",
ADD COLUMN     "date" INTEGER NOT NULL DEFAULT 1000000;
