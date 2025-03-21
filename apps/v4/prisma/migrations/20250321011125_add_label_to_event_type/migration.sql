/*
  Warnings:

  - Added the required column `label` to the `EventType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "label" TEXT NOT NULL;
