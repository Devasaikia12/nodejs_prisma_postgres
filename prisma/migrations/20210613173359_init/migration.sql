/*
  Warnings:

  - You are about to drop the column `lasttname` on the `user` table. All the data in the column will be lost.
  - Added the required column `lastname` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "lasttname",
ADD COLUMN     "lastname" VARCHAR(100) NOT NULL;
