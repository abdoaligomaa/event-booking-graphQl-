/*
  Warnings:

  - Changed the type of `place` on the `Event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "place",
ADD COLUMN     "place" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PLACE";
