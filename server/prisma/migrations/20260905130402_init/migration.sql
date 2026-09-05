-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `district` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `category` VARCHAR(191) NULL,
    `caste` VARCHAR(191) NULL,
    `minorityStatus` BOOLEAN NOT NULL DEFAULT false,
    `disabilityStatus` BOOLEAN NOT NULL DEFAULT false,
    `annualIncome` DOUBLE NULL,
    `incomeCertificate` BOOLEAN NOT NULL DEFAULT false,
    `occupation` VARCHAR(191) NULL,
    `educationLevel` VARCHAR(191) NULL,
    `college` VARCHAR(191) NULL,
    `course` VARCHAR(191) NULL,
    `branch` VARCHAR(191) NULL,
    `academicYear` INTEGER NULL,
    `percentage` DOUBLE NULL,
    `cgpa` DOUBLE NULL,
    `domicileState` VARCHAR(191) NULL,
    `rural` BOOLEAN NULL,
    `profileCompleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Scholarship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `scholarshipType` VARCHAR(191) NOT NULL,
    `benefits` TEXT NOT NULL,
    `amount` DOUBLE NULL,
    `openingDate` DATETIME(3) NULL,
    `deadline` DATETIME(3) NULL,
    `applicationUrl` VARCHAR(191) NULL,
    `applicationInstructions` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `isDemo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Scholarship_active_deadline_idx`(`active`, `deadline`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScholarshipEligibility` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scholarshipId` INTEGER NOT NULL,
    `field` VARCHAR(191) NOT NULL,
    `operator` VARCHAR(191) NOT NULL DEFAULT 'IN',
    `values` JSON NULL,
    `minValue` DOUBLE NULL,
    `maxValue` DOUBLE NULL,
    `required` BOOLEAN NOT NULL DEFAULT true,
    `label` VARCHAR(191) NULL,

    INDEX `ScholarshipEligibility_scholarshipId_field_idx`(`scholarshipId`, `field`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ScholarshipDocument` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `scholarshipId` INTEGER NOT NULL,
    `documentName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedScholarship` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `scholarshipId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SavedScholarship_studentId_scholarshipId_key`(`studentId`, `scholarshipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicationTracking` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `scholarshipId` INTEGER NOT NULL,
    `status` ENUM('SAVED', 'PLANNING', 'APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'SAVED',
    `appliedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicationTracking_studentId_scholarshipId_key`(`studentId`, `scholarshipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `read` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_studentId_read_idx`(`studentId`, `read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentProfile` ADD CONSTRAINT `StudentProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScholarshipEligibility` ADD CONSTRAINT `ScholarshipEligibility_scholarshipId_fkey` FOREIGN KEY (`scholarshipId`) REFERENCES `Scholarship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ScholarshipDocument` ADD CONSTRAINT `ScholarshipDocument_scholarshipId_fkey` FOREIGN KEY (`scholarshipId`) REFERENCES `Scholarship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedScholarship` ADD CONSTRAINT `SavedScholarship_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedScholarship` ADD CONSTRAINT `SavedScholarship_scholarshipId_fkey` FOREIGN KEY (`scholarshipId`) REFERENCES `Scholarship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationTracking` ADD CONSTRAINT `ApplicationTracking_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApplicationTracking` ADD CONSTRAINT `ApplicationTracking_scholarshipId_fkey` FOREIGN KEY (`scholarshipId`) REFERENCES `Scholarship`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `StudentProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
