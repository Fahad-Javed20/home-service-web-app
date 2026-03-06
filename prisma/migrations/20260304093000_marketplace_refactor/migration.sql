DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Booking" CASCADE;
DROP TABLE IF EXISTS "ServiceProvider" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP TYPE IF EXISTS "BookingStatus" CASCADE;
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "ProviderApprovalStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "Weekday" CASCADE;

CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'SERVICE_PROVIDER');
CREATE TYPE "ProviderApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'REJECTED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');
CREATE TYPE "Weekday" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "phone" TEXT,
    "profileImage" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 120,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_providers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessName" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'USA',
    "postalCode" TEXT,
    "yearsOfExperience" INTEGER,
    "approvalStatus" "ProviderApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "jobsCompleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "service_providers_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "provider_services" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "customPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "provider_services_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "availability_slots" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "dayOfWeek" "Weekday" NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "availability_slots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "auth_accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth_verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");
CREATE UNIQUE INDEX "service_categories_slug_key" ON "service_categories"("slug");

CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");
CREATE UNIQUE INDEX "services_name_categoryId_key" ON "services"("name", "categoryId");
CREATE INDEX "services_categoryId_idx" ON "services"("categoryId");

CREATE UNIQUE INDEX "service_providers_userId_key" ON "service_providers"("userId");
CREATE INDEX "service_providers_approvalStatus_rating_totalReviews_idx" ON "service_providers"("approvalStatus", "rating", "totalReviews");
CREATE INDEX "service_providers_city_state_idx" ON "service_providers"("city", "state");

CREATE UNIQUE INDEX "provider_services_providerId_serviceId_key" ON "provider_services"("providerId", "serviceId");
CREATE INDEX "provider_services_serviceId_idx" ON "provider_services"("serviceId");
CREATE INDEX "provider_services_providerId_isPrimary_idx" ON "provider_services"("providerId", "isPrimary");

CREATE UNIQUE INDEX "availability_slots_providerId_dayOfWeek_timeSlot_key" ON "availability_slots"("providerId", "dayOfWeek", "timeSlot");
CREATE INDEX "availability_slots_providerId_dayOfWeek_idx" ON "availability_slots"("providerId", "dayOfWeek");

CREATE UNIQUE INDEX "bookings_providerId_bookingDate_timeSlot_key" ON "bookings"("providerId", "bookingDate", "timeSlot");
CREATE UNIQUE INDEX "bookings_userId_providerId_bookingDate_timeSlot_key" ON "bookings"("userId", "providerId", "bookingDate", "timeSlot");
CREATE INDEX "bookings_userId_createdAt_idx" ON "bookings"("userId", "createdAt");
CREATE INDEX "bookings_providerId_bookingDate_idx" ON "bookings"("providerId", "bookingDate");
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

CREATE UNIQUE INDEX "reviews_bookingId_key" ON "reviews"("bookingId");
CREATE INDEX "reviews_providerId_createdAt_idx" ON "reviews"("providerId", "createdAt");
CREATE INDEX "reviews_serviceId_createdAt_idx" ON "reviews"("serviceId", "createdAt");

CREATE UNIQUE INDEX "auth_accounts_provider_providerAccountId_key" ON "auth_accounts"("provider", "providerAccountId");
CREATE INDEX "auth_accounts_userId_idx" ON "auth_accounts"("userId");

CREATE UNIQUE INDEX "auth_sessions_sessionToken_key" ON "auth_sessions"("sessionToken");
CREATE INDEX "auth_sessions_userId_idx" ON "auth_sessions"("userId");

CREATE UNIQUE INDEX "auth_verification_tokens_identifier_token_key" ON "auth_verification_tokens"("identifier", "token");

ALTER TABLE "admins"
ADD CONSTRAINT "admins_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "services"
ADD CONSTRAINT "services_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "service_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "service_providers"
ADD CONSTRAINT "service_providers_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "provider_services"
ADD CONSTRAINT "provider_services_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "service_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "provider_services"
ADD CONSTRAINT "provider_services_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "availability_slots"
ADD CONSTRAINT "availability_slots_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "service_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "service_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_bookingId_fkey"
FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_providerId_fkey"
FOREIGN KEY ("providerId") REFERENCES "service_providers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "reviews"
ADD CONSTRAINT "reviews_serviceId_fkey"
FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "auth_accounts"
ADD CONSTRAINT "auth_accounts_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "auth_sessions"
ADD CONSTRAINT "auth_sessions_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
