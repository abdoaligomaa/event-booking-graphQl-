/*
  Warnings:

  - Added the required column `place` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PLACE" AS ENUM ('hall1', 'hall2', 'hall3', 'garden');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "place" "PLACE" NOT NULL;
