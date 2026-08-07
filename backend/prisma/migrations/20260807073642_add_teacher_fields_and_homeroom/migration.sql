/*
  Warnings:

  - A unique constraint covering the columns `[homeroomTeacherId]` on the table `classes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "Designation" AS ENUM ('TEACHER', 'CASHIER', 'ADMIN');

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "homeroomTeacherId" TEXT;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "alternatePhone" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "department" TEXT,
ADD COLUMN     "designation" "Designation" NOT NULL DEFAULT 'TEACHER',
ADD COLUMN     "employmentDate" TIMESTAMP(3),
ADD COLUMN     "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "highestQualification" TEXT,
ADD COLUMN     "professionalCertification" TEXT,
ADD COLUMN     "residentialAddress" TEXT,
ADD COLUMN     "specialization" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "classes_homeroomTeacherId_key" ON "classes"("homeroomTeacherId");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_homeroomTeacherId_fkey" FOREIGN KEY ("homeroomTeacherId") REFERENCES "teachers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
