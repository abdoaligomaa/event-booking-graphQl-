/*
  Warnings:

  - Added the required column `createdUser` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdUser" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdUser_fkey" FOREIGN KEY ("createdUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
