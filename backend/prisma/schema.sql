-- ========================================================
-- ScholarNest - PostgreSQL Database Schema & Seed Script
-- ========================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ApplicationStatus" AS ENUM ('SAVED', 'PLANNING', 'APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'NEEDS_VERIFICATION', 'EXPIRED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create User Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "role" "Role" DEFAULT 'STUDENT' NOT NULL,
    "enabled" BOOLEAN DEFAULT TRUE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. Create StudentProfile Table
CREATE TABLE IF NOT EXISTS "StudentProfile" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER UNIQUE NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "dateOfBirth" TIMESTAMP WITH TIME ZONE,
    "gender" VARCHAR(50),
    "state" VARCHAR(100),
    "district" VARCHAR(100),
    "taluka" VARCHAR(100),
    "city" VARCHAR(100),
    "domicileState" VARCHAR(100),
    "category" VARCHAR(50),
    "casteCommunity" VARCHAR(100),
    "minorityStatus" BOOLEAN DEFAULT FALSE NOT NULL,
    "disabilityStatus" BOOLEAN DEFAULT FALSE NOT NULL,
    "disabilityPercentage" DOUBLE PRECISION,
    "annualIncome" DOUBLE PRECISION,
    "incomeCertificate" BOOLEAN DEFAULT FALSE NOT NULL,
    "parentOccupation" VARCHAR(150),
    "educationLevel" VARCHAR(100),
    "college" VARCHAR(255),
    "course" VARCHAR(150),
    "branch" VARCHAR(150),
    "academicYear" INTEGER,
    "percentage" DOUBLE PRECISION,
    "cgpa" DOUBLE PRECISION,
    "profileCompleted" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. Create Scholarship Table
CREATE TABLE IF NOT EXISTS "Scholarship" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "provider" VARCHAR(255) NOT NULL,
    "governmentDepartment" VARCHAR(255),
    "schemeLevel" VARCHAR(50) DEFAULT 'STATE' NOT NULL,
    "applicableStates" JSONB,
    "description" TEXT NOT NULL,
    "scholarshipType" VARCHAR(100) NOT NULL,
    "benefits" TEXT NOT NULL,
    "tuitionFee" VARCHAR(255),
    "maintenanceAllowance" VARCHAR(255),
    "hostelAllowance" VARCHAR(255),
    "amount" DOUBLE PRECISION,
    "openingDate" TIMESTAMP WITH TIME ZONE,
    "deadline" TIMESTAMP WITH TIME ZONE,
    "applicationUrl" TEXT,
    "officialInfoUrl" TEXT,
    "applicationInstructions" TEXT,
    "sourceAuthority" VARCHAR(255),
    "lastVerifiedDate" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "verificationStatus" "VerificationStatus" DEFAULT 'VERIFIED' NOT NULL,
    "active" BOOLEAN DEFAULT TRUE NOT NULL,
    "isDemo" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_scholarship_active_deadline" ON "Scholarship"("active", "deadline");

-- 5. Create ScholarshipEligibility Table
CREATE TABLE IF NOT EXISTS "ScholarshipEligibility" (
    "id" SERIAL PRIMARY KEY,
    "scholarshipId" INTEGER NOT NULL REFERENCES "Scholarship"("id") ON DELETE CASCADE,
    "field" VARCHAR(100) NOT NULL,
    "operator" VARCHAR(50) DEFAULT 'IN' NOT NULL,
    "values" JSONB,
    "minValue" DOUBLE PRECISION,
    "maxValue" DOUBLE PRECISION,
    "required" BOOLEAN DEFAULT TRUE NOT NULL,
    "label" VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS "idx_scholarship_eligibility" ON "ScholarshipEligibility"("scholarshipId", "field");

-- 6. Create ScholarshipDocument Table
CREATE TABLE IF NOT EXISTS "ScholarshipDocument" (
    "id" SERIAL PRIMARY KEY,
    "scholarshipId" INTEGER NOT NULL REFERENCES "Scholarship"("id") ON DELETE CASCADE,
    "documentName" VARCHAR(255) NOT NULL,
    "mandatory" BOOLEAN DEFAULT TRUE NOT NULL,
    "notes" TEXT
);

-- 7. Create SavedScholarship Table
CREATE TABLE IF NOT EXISTS "SavedScholarship" (
    "id" SERIAL PRIMARY KEY,
    "studentId" INTEGER NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "scholarshipId" INTEGER NOT NULL REFERENCES "Scholarship"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "uq_saved_student_scholarship" UNIQUE ("studentId", "scholarshipId")
);

-- 8. Create ApplicationTracking Table
CREATE TABLE IF NOT EXISTS "ApplicationTracking" (
    "id" SERIAL PRIMARY KEY,
    "studentId" INTEGER NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "scholarshipId" INTEGER NOT NULL REFERENCES "Scholarship"("id") ON DELETE CASCADE,
    "status" "ApplicationStatus" DEFAULT 'SAVED' NOT NULL,
    "appliedAt" TIMESTAMP WITH TIME ZONE,
    "notes" TEXT,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "uq_tracking_student_scholarship" UNIQUE ("studentId", "scholarshipId")
);

-- 9. Create Notification Table
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" SERIAL PRIMARY KEY,
    "studentId" INTEGER NOT NULL REFERENCES "StudentProfile"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(50) DEFAULT 'INFO' NOT NULL,
    "read" BOOLEAN DEFAULT FALSE NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_notification_student_read" ON "Notification"("studentId", "read");

