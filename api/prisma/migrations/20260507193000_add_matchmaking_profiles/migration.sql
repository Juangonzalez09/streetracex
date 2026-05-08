-- CreateTable
CREATE TABLE "matchmaking_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "discoverable" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "matchmaking_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matchmaking_profiles_user_id_key" ON "matchmaking_profiles"("user_id");

-- CreateIndex
CREATE INDEX "matchmaking_profiles_discoverable_idx" ON "matchmaking_profiles"("discoverable");

-- AddForeignKey
ALTER TABLE "matchmaking_profiles" ADD CONSTRAINT "matchmaking_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

