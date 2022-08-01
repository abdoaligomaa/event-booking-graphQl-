/*
  Warnings:

  - The primary key for the `bookEvent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bookEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookEvent" DROP CONSTRAINT "bookEvent_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "bookEvent_pkey" PRIMARY KEY ("userId", "eventId");
