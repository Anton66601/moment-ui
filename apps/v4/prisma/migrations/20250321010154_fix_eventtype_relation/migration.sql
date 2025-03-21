/*
  Warnings:

  - You are about to drop the column `createdAt` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `EventType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "createdAt",
DROP COLUMN "label",
DROP COLUMN "updatedAt";
