/*
  Warnings:

  - The `date` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `id` was added to the `bookEvent` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "date",
ADD COLUMN     "date" INTEGER NOT NULL DEFAULT 1000000;

-- AlterTable
ALTER TABLE "bookEvent" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "bookEvent_pkey" PRIMARY KEY ("id");
