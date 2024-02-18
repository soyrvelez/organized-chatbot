/*
  Warnings:

  - Added the required column `title` to the `Preferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "title" TEXT NOT NULL;
