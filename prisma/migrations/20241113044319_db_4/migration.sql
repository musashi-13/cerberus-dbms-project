/*
  Warnings:

  - Added the required column `task` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "service_comments" TEXT,
ADD COLUMN     "task" TEXT NOT NULL,
ALTER COLUMN "est_finish_date" DROP NOT NULL;
