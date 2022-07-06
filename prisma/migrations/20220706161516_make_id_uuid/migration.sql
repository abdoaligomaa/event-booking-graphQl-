-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_createId_fkey";

-- DropIndex
DROP INDEX "User_id_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "createId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createId_fkey" FOREIGN KEY ("createId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
