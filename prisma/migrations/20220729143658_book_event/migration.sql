-- DropIndex
DROP INDEX "Event_id_key";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "price" SET DEFAULT 0,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Event_id_seq";

-- CreateTable
CREATE TABLE "bookEvent" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "bookEvent_userId_eventId_key" ON "bookEvent"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "bookEvent" ADD CONSTRAINT "bookEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookEvent" ADD CONSTRAINT "bookEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
