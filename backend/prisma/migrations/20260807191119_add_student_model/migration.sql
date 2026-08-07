/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[admissionNumber]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admissionNumber` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('ACTIVE', 'GRADUATED', 'SUSPENDED', 'INACTIVE');

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "admissionDate" TIMESTAMP(3),
ADD COLUMN     "admissionNumber" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "guardianAddress" TEXT,
ADD COLUMN     "guardianEmail" TEXT,
ADD COLUMN     "guardianName" TEXT,
ADD COLUMN     "guardianOccupation" TEXT,
ADD COLUMN     "guardianPhone" TEXT,
ADD COLUMN     "guardianRelationship" TEXT,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "previousSchool" TEXT,
ADD COLUMN     "residentialAddress" TEXT,
ADD COLUMN     "stateOfOrigin" TEXT,
ADD COLUMN     "status" "StudentStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_userId_key" ON "students"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "students_admissionNumber_key" ON "students"("admissionNumber");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
