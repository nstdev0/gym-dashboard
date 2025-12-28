/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `memberships` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `invoices` DROP FOREIGN KEY `invoices_membershipId_fkey`;

-- DropForeignKey
ALTER TABLE `memberships` DROP FOREIGN KEY `memberships_memberId_fkey`;

-- DropIndex
DROP INDEX `invoices_membershipId_fkey` ON `invoices`;

-- DropIndex
DROP INDEX `members_firstName_idx` ON `members`;

-- DropIndex
DROP INDEX `members_lastName_idx` ON `members`;

-- AlterTable
ALTER TABLE `invoices` ADD COLUMN `serialNumber` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `members` ADD COLUMN `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `memberships` ADD COLUMN `price` DECIMAL(10, 2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `invoices_serialNumber_key` ON `invoices`(`serialNumber`);

-- CreateIndex
CREATE INDEX `members_firstName_lastName_idx` ON `members`(`firstName`, `lastName`);

-- CreateIndex
CREATE INDEX `memberships_status_idx` ON `memberships`(`status`);

-- AddForeignKey
ALTER TABLE `memberships` ADD CONSTRAINT `memberships_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `members`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invoices` ADD CONSTRAINT `invoices_membershipId_fkey` FOREIGN KEY (`membershipId`) REFERENCES `memberships`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `memberships` RENAME INDEX `memberships_memberId_fkey` TO `memberships_memberId_idx`;
