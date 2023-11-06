/*
  Warnings:

  - You are about to drop the column `isSeen` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "isSeen",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;
