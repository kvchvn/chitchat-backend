/*
  Warnings:

  - You are about to drop the column `isDisabled` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isEdited` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isLiked` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isRead` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_friendship` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_friendship_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_friendship" DROP CONSTRAINT "_friendship_A_fkey";

-- DropForeignKey
ALTER TABLE "_friendship" DROP CONSTRAINT "_friendship_B_fkey";

-- DropForeignKey
ALTER TABLE "_friendship_request" DROP CONSTRAINT "_friendship_request_A_fkey";

-- DropForeignKey
ALTER TABLE "_friendship_request" DROP CONSTRAINT "_friendship_request_B_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "isDisabled";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "createdAt",
DROP COLUMN "isEdited",
DROP COLUMN "isLiked",
DROP COLUMN "isRead";

-- DropTable
DROP TABLE "_friendship";

-- DropTable
DROP TABLE "_friendship_request";
