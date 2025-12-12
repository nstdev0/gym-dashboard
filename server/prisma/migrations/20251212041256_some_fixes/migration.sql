/*
  Warnings:

  - A unique constraint covering the columns `[docType,docNumber]` on the table `members` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `members_docType_docNumber_key` ON `members`(`docType`, `docNumber`);
