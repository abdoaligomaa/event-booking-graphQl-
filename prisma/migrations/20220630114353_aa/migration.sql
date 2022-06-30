/*
  Warnings:

  - You are about to drop the column `createdUser` on the `Event` table. All the data in the column will be lost.
  - Added the required column `createId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createdUser_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "createdUser",
ADD COLUMN     "createId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
